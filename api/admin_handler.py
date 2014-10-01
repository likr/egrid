from __future__ import print_function
import webapp2
from api.models import Project
from api.models import Participant


class AdminHandler(webapp2.RequestHandler):
    def get(self):
        project_id = self.request.get('project_id')
        project = Project.get(project_id)
        participants = Participant.all().filter('project =', project)
        for participant in participants:
            participant.deleted_at = None
            participant.put()
