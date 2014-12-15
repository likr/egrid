from google.appengine.ext import ndb
from google.appengine.ext.ndb import msgprop
from protorpc import messages
from api.version import VERSION


class EgridModel(ndb.Model):
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    deleted_at = ndb.DateTimeProperty(default=None)
    version = ndb.IntegerProperty(default=VERSION)


class CollaboratorRole(messages.Enum):
    OWNER = 400
    ADMIN = 300
    EDITOR = 200
    VIEWER = 100


class Collaborator(ndb.Model):
    role = msgprop.EnumProperty(CollaboratorRole, required=True)
    user = ndb.UserProperty(required=True)


class Project(EgridModel):
    name = ndb.StringProperty(required=True)
    note = ndb.TextProperty()
    collaborators = ndb.StructuredProperty(Collaborator, repeated=True)


class Participant(EgridModel):
    name = ndb.StringProperty(required=True)
    note = ndb.TextProperty()
    grid = ndb.JsonProperty(required=True)
    project = ndb.KeyProperty(kind=Project, required=True)


class Analysis(EgridModel):
    name = ndb.StringProperty(required=True)
    note = ndb.TextProperty()
    grid = ndb.JsonProperty(required=True)
    project = ndb.KeyProperty(kind=Project, required=True)
