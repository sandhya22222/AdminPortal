import React from "react";
import { keycloakData } from "../../urlPages/keycloak";


const keycloakUrl = keycloakData.url
const PageNotFound = () => {
  // return <h1>Page not found</h1>;
  return <h1>Please login to access this page <a href={keycloakUrl}>Login</a></h1>
};

export default PageNotFound;
