export const MultiTenancyConfig = [
  {
    config_id: "dmadmin",
    authority: "http://54.167.251.231:8080/realms/dmadmin",
    client_id: "dmadmin-client",
    client_secret: "GyZzlzAxgmhyEI79aFIBQQXorWFfyqAC",
    redirect_uri: "http://localhost:3000/dashboard",
    post_logout_redirect_uri: "http://localhost:3000",
    onSigninCallback: (_user) => {
      window.history.replaceState({}, document.title, window.location.pathname);
    },
  },
];
