import endpoints
from models import CollaboratorRole


def get_current_user():
    current_user = endpoints.get_current_user()
    if current_user is None:
        raise endpoints.UnauthorizedException('Invalid token')
    return current_user


def check_owner(project, user, role=CollaboratorRole.VIEWER):
    collaborators = [c for c in project.collaborators if c.user == user]
    if len(collaborators) == 0 or collaborators[0].role < role:
        raise endpoints.ForbiddenException('Access denied')
