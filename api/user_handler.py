import json
import webapp2
from google.appengine.api import users
from models import User


class UserHandler(webapp2.RequestHandler):
    def get(self):
        user = User.current_user()
        content = json.dumps(user.to_dict())
        self.response.write(content)

    def post(self):
        data = json.loads(self.request.body)
        user = User.current_user()
        if 'location' in data:
            user.location = data['location']
        user.put()
        content = json.dumps(user.to_dict())
        self.response.write(content)


class UserAuthUrlHandler(webapp2.RequestHandler):
    def get(self):
        dest_url = self.request.GET['dest_url']
        login_url = users.create_login_url(dest_url)
        data = {
            'login_url': login_url,
            'logout_url': users.create_logout_url(login_url)
        }
        content = json.dumps(data)
        self.response.write(content)
