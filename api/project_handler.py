import json
import webapp2
from api.models import Collaborator
from api.models import Participant
from api.models import Project
from api.models import User


class ProjectHandler(webapp2.RequestHandler):
    def get(self, project_id=None):
        current_user = User.current_user()
        if project_id:
            project = Project.get(project_id)
            if project.deleted_at is not None:
                self.error(404)
            if not current_user.is_collaborator_on(project):
                self.error(403)

            self.response.write(json.dumps(project.to_dict()))
        else:
            collaborators = Collaborator.all()\
                .filter('user =', current_user)
            projects = [c.project for c in collaborators if c.project.deleted_at is None]
            projects.sort(key=lambda a: a.updated_at)
            content = json.dumps([p.to_dict() for p in projects])
            self.response.write(content)

    def post(self):
        data = json.loads(self.request.body)
        current_user = User.current_user()
        project = Project(
            name=data.get('name'),
            note=data.get('note'))
        project.put()
        collaborator = Collaborator(
            project=project,
            user=current_user,
            is_manager=True)
        collaborator.put()
        self.response.write(json.dumps(project.to_dict()))

    def put(self, project_id):
        data = json.loads(self.request.body)
        project = Project.get(project_id)
        project.name = data.get('name')
        project.note = data.get('note')
        project.put()
        self.response.write(json.dumps(project.to_dict()))

    def delete(self, project_id):
        project = Project.get(project_id)
        project.remove()


class ProjectGridCurrentHandler(webapp2.RequestHandler):
    def get(self, project_id):
        project = Project.get(project_id)
        participants = Participant.all().filter('project =', project)
        self.response.write(json.dumps(merge_grids(participants)))


def merge_grids(participants):
    all_nodes = []
    all_links = []
    index_offset = 0
    node_texts = {}
    for participant in participants:
        grid = json.loads(participant.json)
        nodes = grid['nodes']
        links = grid['links']
        index_map = []
        for i, node in enumerate(nodes):
            text = node['text']
            if text in node_texts:
                all_nodes[node_texts[text]]['weight'] += 1
                all_nodes[node_texts[text]]['participants']\
                    .append(str(participant.key()))
                index_map.append(node_texts[text])
            else:
                node_texts[text] = index_offset
                index_map.append(index_offset)
                node['participants'] = [str(participant.key())]
                node['weight'] = 1
                all_nodes.append(node)
                index_offset += 1
        for link in links:
            all_links.append({
                'source': index_map[link['source']],
                'target': index_map[link['target']],
            })
    return {
        'nodes': all_nodes,
        'links': all_links,
    }
