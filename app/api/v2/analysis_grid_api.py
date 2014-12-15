from google.appengine.ext import ndb
import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from models import Analysis
from models import Project
from egrid_api import egrid_api
from utils import get_current_user
from utils import check_owner


class NodeMessage(messages.Message):
    text = messages.StringField(1, required=True)
    participants = messages.IntegerField(2, repeated=True)


class LinkMessage(messages.Message):
    source = messages.IntegerField(1, required=True)
    target = messages.IntegerField(2, required=True)
    participants = messages.IntegerField(3, repeated=True)


class AnalysisGridMessage(messages.Message):
    nodes = messages.MessageField(NodeMessage, 1, repeated=True)
    links = messages.MessageField(LinkMessage, 2, repeated=True)


@egrid_api.api_class(resource_name='projects.analyses.grid')
class AnalysisGrid(remote.Service):
    KeyResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        analysisKey=messages.IntegerField(2, variant=messages.Variant.INT32))

    PutResource = endpoints.ResourceContainer(
        AnalysisGridMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        analysisKey=messages.IntegerField(2, variant=messages.Variant.INT32))

    @endpoints.method(
        KeyResource, AnalysisGridMessage,
        path='projects/{projectKey}/analyses/{analysisKey}/grid',
        http_method='GET', name='get')
    def get(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, request.projectKey)
        project = projectKey.get()
        check_owner(project, current_user)
        analysisKey = ndb.Key(Analysis, request.analysisKey)
        analysis = analysisKey.get()
        message = grid_to_message(analysis.grid)
        return message

    @endpoints.method(
        PutResource, message_types.VoidMessage,
        path='projects/{projectKey}/analyses/{analysisKey}/grid',
        http_method='PUT', name='put')
    def put(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, request.projectKey)
        project = projectKey.get()
        check_owner(project, current_user)
        analysisKey = ndb.Key(Analysis, request.analysisKey)
        analysis = analysisKey.get()
        analysis.grid = {
            'nodes': [{'text': node.text} for node in request.nodes],
            'links': [{'source': link.source, 'target': link.target}
                      for link in request.links]
        }
        analysis.put()
        return message_types.VoidMessage()


def grid_to_message(grid):
    message = AnalysisGridMessage()
    message.nodes = [NodeMessage(text=node['text'])
                     for node in grid['nodes']]
    message.links = [LinkMessage(source=link['source'], target=link['target'])
                     for link in grid['links']]
    return message
