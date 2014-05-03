import json
from google.appengine.api import users
from google.appengine.ext import db
from version import VERSION
from model_base import DeletableModelBase


class EgridModel(DeletableModelBase):
    created_at = db.DateTimeProperty(auto_now_add=True)
    updated_at = db.DateTimeProperty(auto_now=True)
    version = db.IntegerProperty(default=VERSION)


class User(EgridModel):
    location = db.StringProperty(default="ja", required=True)
    email = db.StringProperty(required=True)
    user = db.UserProperty()

    def to_dict(self):
        return {
            'key': str(self.key()),
            "location": self.location,
            'email': self.email,
            'nickname': self.user.nickname(),
            'user_id': self.user.user_id(),
            'federated_identity': self.user.federated_identity(),
            'federated_provider': self.user.federated_provider(),
        }

    def is_collaborator_on(self, project):
        if project:
            collaborators = Collaborator.all().filter('project =', project)
            for collaborator in collaborators:
                if collaborator.user.key() == self.key():
                    return True

    @staticmethod
    def current_user():
        current_user = users.get_current_user()
        user = User.all().filter('user =', current_user).get()
        if not user:
            user = User(
                user=current_user,
                email=current_user.email())
            user.put()
        return user


class Project(EgridModel):
    name = db.StringProperty(required=True)
    note = db.TextProperty()

    def to_dict(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
            'createdAt': self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'updatedAt': self.updated_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }


class Analysis(EgridModel):
    name = db.StringProperty(required=True)
    note = db.TextProperty()
    grid = db.TextProperty(required=True)
    project = db.ReferenceProperty(Project)

    def get_grid(self):
        data = json.loads(self.grid)
        return {
            'key': str(self.key()),
            'projectKey': str(self.project.key()),
            'nodes': data['nodes'],
            'links': data['links'],
        }

    def to_dict(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
            'project': self.project.to_dict(),
            'projectKey': str(self.project.key()),
            'createdAt': self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'updatedAt': self.updated_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }


class Participant(EgridModel):
    name = db.StringProperty(required=True)
    note = db.TextProperty()
    json = db.TextProperty()
    project = db.ReferenceProperty(Project)

    def to_dict(self):
        return {
            'key': str(self.key()),
            'name': self.name,
            'note': self.note,
            'project': self.project.to_dict(),
            'projectKey': str(self.project.key()),
            'json': self.json,
            'createdAt': self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            'updatedAt': self.updated_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }


class Collaborator(EgridModel):
    project = db.ReferenceProperty(Project)
    user = db.ReferenceProperty(User)
    is_manager = db.BooleanProperty(default=False)

    def to_dict(self):
        return {
            'key': str(self.key()),
            'project': self.project.to_dict(),
            'projectKey': str(self.project.key()),
            'user': self.user.to_dict(),
            'userKey': str(self.user.key()),
            'isManager': int(bool(self.is_manager))
        }
