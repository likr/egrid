import json
import webapp2
from api.models import Analysis
from api.models import Participant
from api.models import Project
from project_handler import merge_grids


class AnalysisHandler(webapp2.RequestHandler):
    def get(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        if analysis.deleted_at is not None:
            self.error(404)
        self.response.write(json.dumps(analysis.to_dict()))


class AnalysisListHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        analyses = Analysis.all()\
            .filter('project =', project)\
            .order('created_at')
        self.response.write(json.dumps([p.to_dict() for p in analyses]))

    def post(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        participants = Participant.all().filter('project =', project)
        grid = merge_grids(participants)
        analysis = Analysis(
            name=data.get('name'),
            grid=json.dumps(grid),
            project=project)
        analysis.put()
        self.response.write(json.dumps(analysis.to_dict()))


class AnalysisGridHandler(webapp2.RequestHandler):
    def get(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        if analysis.deleted_at is not None:
            self.error(404)
        self.response.write(json.dumps(analysis.get_grid()))

    def put(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        analysis.grid = self.request.body
        analysis.put()
        self.response.write(json.dumps(analysis.get_grid()))


class AnalysisQuestionnaireHandler(webapp2.RequestHandler):
    def get(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        result = json.loads(analysis.questionnaire)
        result['projectKey'] = project_id
        result['semProjectKey'] = analysis_id
        self.response.write(json.dumps(result))

    def put(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        analysis.questionnaire = self.request.body
        analysis.put()
        self.response.write(json.dumps(analysis.to_dict()))
