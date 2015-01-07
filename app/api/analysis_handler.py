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

    def put(self, project_id, analysis_id):
        data = json.loads(self.request.body)
        analysis = Analysis.get(analysis_id)
        analysis.name = data.get('name')
        analysis.put()
        self.response.write(json.dumps(analysis.to_dict()))

    def delete(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        analysis.remove()


class AnalysisListHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        analyses = Analysis.all()\
            .filter('project =', project)\
            .filter('deleted_at =', None)\
            .order('created_at')
        self.response.write(json.dumps([p.to_dict() for p in analyses]))

    def post(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        participants = Participant.all()\
            .filter('project =', project)\
            .filter('deleted_at =', None)
        if data.get('grid'):
            grid = data.get('grid')
        else:
            grid = merge_grids(participants)
        questionnaire = [node['text'] for node in grid['nodes']]
        analysis = Analysis(
            name=data.get('name'),
            grid=json.dumps(grid),
            questionnaire=json.dumps(questionnaire),
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
        analysis.grid = self.request.body.decode('utf-8')
        analysis.put()
        self.response.write(json.dumps(analysis.get_grid()))


class AnalysisQuestionnaireHandler(webapp2.RequestHandler):
    def get(self, project_id, analysis_id):
        analysis = Analysis.get(analysis_id)
        if analysis.deleted_at is not None:
            self.error(404)
        self.response.write(json.dumps(analysis.get_questionnaire()))

    def put(self, project_id, analysis_id):
        data = json.loads(self.request.body)
        analysis = Analysis.get(analysis_id)
        analysis.form_url = data.get('formUrl')
        analysis.sheet_url = data.get('sheetUrl')
        analysis.put()
        self.response.write(json.dumps(analysis.to_dict()))
