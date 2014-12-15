from google.appengine.ext import ndb
from google.appengine.api.users import User
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


class CollaboratorResponseMessage(messages.Message):
    role = messages.EnumField(CollaboratorRole, 1)
    email = messages.StringField(2)
    nickname = messages.StringField(3)


class CollaboratorRequestMessage(messages.Message):
    role = messages.EnumField(CollaboratorRole, 1, required=True)


class CollaboratorCollectionMessage(messages.Message):
    items = messages.MessageField(CollaboratorResponseMessage, 1,
                                  repeated=True)


@egrid_api.api_class(resource_name='projects.collaborators')
class Collaborators(remote.Service):
    KeyResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        email=messages.StringField(2))

    PutResource = endpoints.ResourceContainer(
        CollaboratorRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        email=messages.StringField(2))

    QueryResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32))

    @endpoints.method(PutResource, CollaboratorResponseMessage,
                      path='projects/{projectKey}/collaborators/{email}',
                      http_method='PUT', name='put')
    def put(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, request.projectKey)
        project = projectKey.get()
        check_owner(project, current_user, CollaboratorRole.ADMIN)
        collaborators = [c for c in project.collaborators
                         if c.user.email == request.email]
        if collaborators:
            collaborator = collaborators[0]
        else:
            collaborator = Collaborator()
            collaborator.user = User(request.email)
            project.collaborators.append(collaborator)
        collaborator.role = request.role
        project.put()
        message = collaborator_to_message(collaborator)
        return message

    @endpoints.method(KeyResource, message_types.VoidMessage,
                      path='projects/{projectKey}/collaborators/{email}',
                      http_method='DELETE', name='delete')
    def delete(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, request.projectKey)
        project = projectKey.get()
        check_owner(project, current_user, CollaboratorRole.ADMIN)
        collaborators = [c for c in project.collaborators
                         if c.user.email() == request.email]
        if not collaborators:
            raise endpoints.NotFoundException(
                '{0} is not found'.format(request.email))
        collaborator = collaborators[0]
        if collaborator.role == CollaboratorRole.OWNER:
            raise endpoints.ForbiddenException(
                '{0} is a owner'.format(request.email))
        project.collaborators.remove(collaborator)
        project.put()
        message = message_types.VoidMessage()
        return message

    @endpoints.method(QueryResource, CollaboratorCollectionMessage,
                      path='projects/{projectKey}/collaborators',
                      http_method='GET', name='query')
    def query(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, request.projectKey)
        project = projectKey.get()
        check_owner(project, current_user, CollaboratorRole.ADMIN)
        message = CollaboratorCollectionMessage()
        message.items = [collaborator_to_message(collaborator)
                         for collaborator in project.collaborators]
        return message


def collaborator_to_message(collaborator):
    message = CollaboratorResponseMessage()
    message.role = collaborator.role
    message.email = collaborator.user.email()
    message.nickname = collaborator.user.nickname()
    return message
