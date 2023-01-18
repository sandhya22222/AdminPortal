export const keycloakData = {
  "url": 'http://54.210.56.174:8080/realms/dmadmin/protocol/openid-connect/auth?response_type=code&client_id=dmadmin-client',
  "realmName": 'dmadmin',
  "clientId": 'dmadmin-client',
}

export const backendUrl = {
  'isLoggedInURL': 'http://127.0.0.1:5000/authenticate/is_loggedin',
  'getPermissionsUrl': 'http://127.0.0.1:5000/authenticate/get_permission',
  'logoutUrl': 'http://127.0.0.1:5000/authenticate/logout',
  'getAccessTokenUrl': 'http://127.0.0.1:5000/authenticate/get_access_token?code='
}