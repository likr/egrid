from google.appengine.ext import ndb
import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from models import Project
from models import Participant
from egrid_api import egrid_api
from utils import get_current_user
from utils import check_owner


class ParticipantResponseMessage(messages.Message):
    key = messages.IntegerField(1)
    projectKey = messages.IntegerField(2)
    name = messages.StringField(3)
    note = messages.StringField(4)
    createdAt = messages.StringField(5)
    updatedAt = messages.StringField(6)


class ParticipantRequestMessage(messages.Message):
    name = messages.StringField(1, required=True)
    note = messages.StringField(2)


class ParticipantPatchRequestMessage(messages.Message):
    name = messages.StringField(1)
    note = messages.StringField(2)


class ParticipantCollectionMessage(messages.Message):
    items = messages.MessageField(ParticipantResponseMessage, 1,
                                  repeated=True)


@egrid_api.api_class(resource_name='projects.participants')
class Participants(remote.Service):
    KeyResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    PostResource = endpoints.ResourceContainer(
        ParticipantRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32))

    PutResource = endpoints.ResourceContainer(
        ParticipantRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    PatchResource = endpoints.ResourceContainer(
        ParticipantPatchRequestMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32),
        key=messages.IntegerField(2, variant=messages.Variant.INT32))

    QueryResource = endpoints.ResourceContainer(
        message_types.VoidMessage,
        projectKey=messages.IntegerField(1, variant=messages.Variant.INT32))

    @endpoints.method(KeyResource, ParticipantResponseMessage,
                      path='projects/{projectKey}/participants/{key}',
                      http_method='GET', name='get')
    def get(self, request):
        participant = get_participant(request.projectKey, request.key)
        return participant_to_message(participant)

    @endpoints.method(PostResource, ParticipantResponseMessage,
                      path='projects/{projectKey}/participants',
                      http_method='POST', name='post')
    def post(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, int(request.projectKey))
        project = projectKey.get()
        check_owner(project, current_user)
        participant = Participant()
        participant.project = projectKey
        participant.name = request.name
        participant.note = request.note
        participant.grid = {
            'nodes': [],
            'links': []
        }
        participant.put()
        message = participant_to_message(participant)
        return message

    @endpoints.method(PutResource, ParticipantResponseMessage,
                      path='projects/{projectKey}/participants/{key}',
                      http_method='PUT', name='put')
    def put(self, request):
        participant = get_participant(request.projectKey, request.key)
        participant.name = request.name
        participant.note = request.note
        participant.put()
        return participant_to_message(participant)

    @endpoints.method(PatchResource, ParticipantResponseMessage,
                      path='projects/{projectKey}/participants/{key}',
                      http_method='PATCH', name='patch')
    def patch(self, request):
        participant = get_participant(request.projectKey, request.key)
        if request.name:
            participant.name = request.name
        if request.note:
            participant.note = request.note
        participant.put()
        return participant_to_message(participant)

    @endpoints.method(KeyResource, message_types.VoidMessage,
                      path='projects/{projectKey}/participants/{key}',
                      http_method='DELETE', name='delete')
    def delete(self, request):
        participant = get_participant(request.projectKey, request.key)
        participant.key.delete()
        return message_types.VoidMessage()

    @endpoints.method(QueryResource, ParticipantCollectionMessage,
                      path='projects/{projectKey}/participants',
                      http_method='GET', name='query')
    def query(self, request):
        current_user = get_current_user()
        projectKey = ndb.Key(Project, int(request.projectKey))
        project = projectKey.get()
        check_owner(project, current_user)
        participants = Participant.query(Participant.project == projectKey)
        message = ParticipantCollectionMessage()
        message.items = [participant_to_message(p) for p in participants]
        return message


def get_participant(projectKey, participantKey):
    current_user = get_current_user()
    projectKey = ndb.Key(Project, int(projectKey))
    project = projectKey.get()
    check_owner(project, current_user)
    participantKey = ndb.Key(Participant, int(participantKey))
    participant = participantKey.get()
    if participant.project != projectKey:
        raise endpoints.NotFoundException()
    return participant


def participant_to_message(participant):
    message = ParticipantResponseMessage()
    message.key = participant.key.id()
    message.projectKey = participant.project.id()
    message.name = participant.name
    message.note = participant.note
    message.createdAt = participant.created_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    message.updatedAt = participant.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    return message
