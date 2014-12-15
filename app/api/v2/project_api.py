from google.appengine.ext import ndb
import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from models import Collaborator
from models import CollaboratorRole
from models import Project
from egrid_api import egrid_api
from utils import get_current_user
from utils import check_owner


class ProjectResponseMessage(messages.Message):
    key = messages.IntegerField(1)
    name = messages.StringField(2)
    note = messages.StringField(3)
    createdAt = messages.StringField(4)
    updatedAt = messages.StringField(5)


class ProjectRequestMessage(messages.Message):
    name = messages.StringField(1, required=True)
    note = messages.StringField(2)


class ProjectPatchRequestMessage(messages.Message):
    name = messages.StringField(1)
    note = messages.StringField(2)


class ProjectCollectionMessage(messages.Message):
    items = messages.MessageField(ProjectResponseMessage, 1, repeated=True)


@egrid_api.api_class(resource_name='projects')
class Projects(remote.Service):
    KeyResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        key=messages.IntegerField(1, variant=messages.Variant.INT32))

    PutResource = endpoints.ResourceContainer(
        ProjectRequestMessage,
        key=messages.IntegerField(1, variant=messages.Variant.INT32))

    PatchResource = endpoints.ResourceContainer(
        ProjectPatchRequestMessage,
        key=messages.IntegerField(1, variant=messages.Variant.INT32))

    QueryResource = endpoints.ResourceContainer(
        message_types.VoidMessage)

    @endpoints.method(KeyResource, ProjectResponseMessage,
                      path='projects/{key}', http_method='GET',
                      name='get')
    def get(self, request):
        current_user = get_current_user()
        key = ndb.Key(Project, request.key)
        project = key.get()
        check_owner(project, current_user)
        message = project_to_message(project)
        return message

    @endpoints.method(ProjectRequestMessage, ProjectResponseMessage,
                      path='projects', http_method='POST',
                      name='post')
    def post(self, request):
        current_user = get_current_user()
        collaborator = Collaborator()
        collaborator.role = CollaboratorRole.OWNER
        collaborator.user = current_user
        project = Project()
        project.name = request.name
        project.note = request.note
        project.collaborators = [collaborator]
        project.put()
        message = project_to_message(project)
        return message

    @endpoints.method(PutResource, ProjectResponseMessage,
                      path='projects/{key}', http_method='PUT',
                      name='put')
    def put(self, request):
        current_user = get_current_user()
        key = ndb.Key(Project, request.key)
        project = key.get()
        check_owner(project, current_user)
        project.name = request.name
        project.note = request.note
        project.put()
        message = project_to_message(project)
        return message

    @endpoints.method(PatchResource, ProjectResponseMessage,
                      path='projects/{key}', http_method='PATCH',
                      name='patch')
    def patch(self, request):
        current_user = get_current_user()
        key = ndb.Key(Project, request.key)
        project = key.get()
        check_owner(project, current_user)
        if request.name is not None:
            project.name = request.name
        if request.note is not None:
            project.note = request.note
        project.put()
        message = project_to_message(project)
        return message

    @endpoints.method(KeyResource, message_types.VoidMessage,
                      path='projects/{key}', http_method='DELETE',
                      name='delete')
    def delete(self, request):
        current_user = get_current_user()
        key = ndb.Key(Project, request.key)
        project = key.get()
        check_owner(project, current_user)
        key.delete()
        return message_types.VoidMessage()

    @endpoints.method(QueryResource, ProjectCollectionMessage,
                      path='projects', http_method='GET',
                      name='query')
    def query(self, request):
        current_user = get_current_user()
        projects = Project.query(Project.collaborators.user == current_user)
        message = ProjectCollectionMessage()
        message.items = [project_to_message(project) for project in projects]
        return message


def project_to_message(project):
    message = ProjectResponseMessage()
    message.key = project.key.id()
    message.name = project.name
    message.note = project.note
    message.createdAt = project.created_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    message.updatedAt = project.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    return message
