import json
import webapp2
from api.models import Participant
from api.models import Project
DEFAULT_JSON = '{"nodes":[],"links":[]}'


class ParticipantHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id=None):
        if participant_id:
            participant = Participant.get(participant_id)
            if participant.deleted_at is not None:
                self.error(404)
            self.response.write(json.dumps(participant.to_dict()))
        else:
            project = Project.get(project_id)
            participants = Participant.all()\
                .filter('project =', project)\
                .filter('deleted_at =', None)\
                .order('created_at')
            self.response.write(json.dumps([p.to_dict() for p in participants]))

    def post(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        participant = Participant(
            name=data.get('name'),
            note=data.get('note'),
            project=project,
            json=DEFAULT_JSON)
        participant.put()
        self.response.write(json.dumps(participant.to_dict()))

    def put(self, project_id, participant_id):
        data = json.loads(self.request.body)
        participant = Participant.get(participant_id)
        participant.name = data.get('name')
        participant.note = data.get('note')
        participant.put()
        self.response.write(json.dumps(participant.to_dict()))

    def delete(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        participant.remove()


class ParticipantGridHandler(webapp2.RequestHandler):
    def get(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        result = json.loads(participant.json)
        result['projectKey'] = project_id
        result['participantKey'] = participant_id
        self.response.write(json.dumps(result))

    def put(self, project_id, participant_id):
        participant = Participant.get(participant_id)
        participant.json = self.request.body.decode('utf-8')
        participant.put()
        self.response.write(json.dumps(participant.to_dict()))
