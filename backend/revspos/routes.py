from flask import request
from flask_restx import Api, Resource, fields
from functools import wraps

api = Api(version="1.0", title="RevsPos API")

test_model = api.model('SignUpModel', {"field": fields.String(required=True, min_length=1, max_length=64)})

@api.route('/api/test')
class Test(Resource):
    #api for testing
    @api.expect(test_model, validate=True)
    def post(self):
        req = request.get_json()
        return {"Field":"processed" + req.get("field")}, 200

