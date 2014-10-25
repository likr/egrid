import webapp2
from webapp2 import Route
from api.admin_handler import AdminHandler
from api.collaborator_handler import CollaboratorHandler
from api.participant_handler import ParticipantHandler
from api.participant_handler import ParticipantGridHandler
from api.project_handler import ProjectHandler
from api.project_handler import ProjectGridCurrentHandler
from api.analysis_handler import AnalysisHandler
from api.analysis_handler import AnalysisListHandler
from api.analysis_handler import AnalysisGridHandler
from api.analysis_handler import AnalysisQuestionnaireHandler
from api.user_handler import UserHandler
from api.user_handler import UserAuthUrlHandler


app = webapp2.WSGIApplication([
    Route('/api/admin', AdminHandler),
    Route('/api/projects', ProjectHandler),
    Route('/api/projects/<project_id:[\w\-]+>', ProjectHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/analyses', AnalysisListHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/analyses/<analysis_id:[\w\-]+>', AnalysisHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/analyses/current/grid', ProjectGridCurrentHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/analyses/<analysis_id:[\w\-]+>/grid', AnalysisGridHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/analyses/<analysis_id:[\w\-]+>/questionnaire',
          AnalysisQuestionnaireHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/collaborators', CollaboratorHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/collaborators/<collaborator_id:[\w\-]+>', CollaboratorHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/participants', ParticipantHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/participants/<participant_id:[\w\-]+>', ParticipantHandler),
    Route('/api/projects/<project_id:[\w\-]+>'
          '/participants/<participant_id:[\w\-]+>/grid',
          ParticipantGridHandler),
    Route('/api/users', UserHandler),
    Route('/api/public/auth', UserAuthUrlHandler),
], debug=True)
