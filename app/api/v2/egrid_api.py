import endpoints


web_id = '1099158809186-j2pj3jap76buhfmler03pb3'\
         'kqasl8ddt.apps.googleusercontent.com'


egrid_api = endpoints.api(name='egrid', version='v2',
                          # allowed_client_ids=[web_id],
                          scopes=[endpoints.EMAIL_SCOPE])
