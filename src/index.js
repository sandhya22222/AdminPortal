import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store, { Persistor } from "./services/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./services/i18next/1i18n";

import { AuthProvider } from "react-oidc-context";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

import "./core-ui/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

//! Get all required details from .env file
let realm = process.env.REACT_APP_REALM;
const authority = process.env.REACT_APP_AUTHORITY;
let clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const postLogoutRedirectUri = process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI;

const oidcConfig = {
  authority: authority,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

root.render(
  <AuthProvider {...oidcConfig}>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <App />
      </PersistGate>
    </Provider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
