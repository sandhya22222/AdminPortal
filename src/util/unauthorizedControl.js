import axios from "axios";

const auth = process.env.REACT_APP_AUTH;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
const refreshTokenUrl = process.env.REACT_APP_USM_BASE_URL;

export const logoutUser = () => {
  let keycloakData = sessionStorage.getItem('keycloakData');
  keycloakData = JSON.parse(keycloakData);
  window.location = keycloakData.url;
  sessionStorage.clear()
}

export const makeHttpRequestForRefreshToken = () => {
  if (auth === 'true') {
    let refreshToken = sessionStorage.getItem('refresh_token');
    let accessToken = sessionStorage.getItem('access_token');
    let baseurl = `${umsBaseUrl}${refreshTokenUrl}`;

    axios({ 
      url: baseurl, 
      method: 'post', 
      data: { 
        refresh_token: refreshToken, 
        access_token: accessToken 
        }, 
      })
      .then(res => {
        if (res.data.access_token) {
          sessionStorage.setItem('access_token', res.data.access_token)
          sessionStorage.setItem('refresh_token', res.data.refresh_token)
          window.location.reload();
        }
      })
      .catch(err => {
        console.log(err)
        if (err && err.response.status === 401) {
          logoutUser();
        }
        console.log('get access token err', err)
      })
  }
}