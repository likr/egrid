from google.appengine.ext import ndb
import endpoints
from protorpc import messages
from protorpc.message_types import VoidMessage
from protorpc import remote
from models import Analysis
from models import Project
from egrid_api import egrid_api
from utils import get_current_user
from utils import check_owner


class AnalysesResponseMessage(messages.Message):
    key = messages.IntegerField(1)
    projectKey = messages.IntegerField(2)
    name = messages.StringField(3)
    note = messages.StringField(4)
    createdAt = messages.StringField(5)
    updatedAt = messages.StringField(6)


class AnalysesRequestMessage(messages.Message):
    name = messages.StringField(1, required=True)
    note = messages.StringField(2)


class AnalysesPatchRequestMessage(messages.Message):
    name = messages.StringField(1)
    note = messages.StringField(2)


class AnalysesCollectionMessage(messages.Message):
    items = messages.MessageField(AnalysesResponseMessage, 1, repeated=True)


@egrid_api.api_class(resource_name='projects.analyses')
class Analyses(remote.Service):
    KeyResource = endpoints.ResourceContainer(
        VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    PutResource = endpoints.ResourceContainer(
        AnalysesRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    PatchResource = endpoints.ResourceContainer(
        AnalysesRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    QueryResource = endpoints.ResourceContainer(
        VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32))

    @endpoints.method(
        KeyResource, AnalysesResponseMessage,
        path='projects/{projectKey}/analyses/{key}',
        http_method='GET', name='get')
    def get(self, request):
        analysis = get_analysis(request.projectKey, request.key)
        return analysis_to_message(analysis)

    @endpoints.method(
        AnalysesRequestMessage, AnalysesResponseMessage,
        path='projects/{projectKey}/analyses',
        http_method='POST', name='post')
    def post(self, request):
        analysis = get_analysis(request.projectKey)
        analysis.name = request.name
        analysis.note = request.note
        analysis.grid = {
            'nodes': [],
            'links': []
        }
        analysis.put()
        return analysis_to_message(analysis)

    @endpoints.method(
        PutResource, AnalysesResponseMessage,
        path='projects/{projectKey}/analyses/{key}',
        http_method='PUT', name='put')
    def put(self, request):
        analysis = get_analysis(request.projectKey, request.key)
        analysis.name = request.name
        analysis.note = request.note
        analysis.put()
        return analysis_to_message(analysis)

    @endpoints.method(
        PatchResource, AnalysesResponseMessage,
        path='projects/{projectKey}/analyses/{key}',
        http_method='PATCH', name='patch')
    def patch(self, request):
        analysis = get_analysis(request.projectKey, request.key)
        if request.name is not None:
            analysis.name = request.name
        if request.note is not None:
            analysis.note = request.note
        analysis.put()
        return analysis_to_message(analysis)

    @endpoints.method(
        KeyResource, VoidMessage,
        path='projects/{projectKey}/analyses/{key}',
        http_method='DELETE', name='delete')
    def delete(self, request):
        analysis = get_analysis(request.projectKey, request.key)
        analysis.delete()
        return VoidMessage()

    @endpoints.method(
        QueryResource, AnalysesCollectionMessage,
        path='projects/{projectKey}/analyses',
        http_method='GET', name='query')
    def query(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, int(request.projectKey))
        project = projectKey.get()
        check_owner(project, current_user)
        analyses = Analysis.query(Analysis.project == projectKey)
        message = AnalysesCollectionMessage()
        message.items = [analysis_to_message(analysis)
                         for analysis in analyses]
        return message


def get_analysis(projectKey, analysisKey=None):
    current_user = get_current_user()
    projectKey = ndb.Key(Project, int(projectKey))
    project = projectKey.get()
    check_owner(project, current_user)
    if analysisKey is None:
        analysis = Analysis()
    else:
        analysisKey = ndb.Key(Analysis, int(analysisKey))
        analysis = analysisKey.get()
        if analysis.project != projectKey:
            raise endpoints.NotFoundException()
    return analysis


def analysis_to_message(analysis):
    message = AnalysesResponseMessage()
    message.key = analysis.key.id()
    message.projectKey = analysis.project.id()
    message.name = analysis.name
    message.note = analysis.note
    message.createdAt = analysis.created_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    message.updatedAt = analysis.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    return message
