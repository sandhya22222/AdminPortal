import { useState, useEffect } from "react";

/**
 * ! useAuthorization is a custom hook designed to get session storage value for session storage(refresh_token) .
 * ! The main purpose of this custom hook is to return refresh_token based on session storage value.
 * ? Use of this custom hook
 * ? We can import this custom hook in any of the react component and can call this hook.
 * ! How to use this custom hook in a component.
 * ? import useAuthorization from './../../hooks/useAuthorization';
 * * from path my vary based on the component & this custom hook directory.
 * * Call useAuthorization hook which get the refresh_token value from session storage if refresh_token value is null it will return null .
 * ?  const authorizationHeader = useAuthorization();
 * */

// function useAuthorization() {
//   const [value, setValue] = useState(null);

//   useEffect(() => {
//     const storedAuthorizationValue =
//       window.sessionStorage.getItem("refresh_token");
//     setValue(storedAuthorizationValue || null);
//   }, []);

//   return value;
// }

// export default useAuthorization;

const useAuthorization = () => {
  const autohrizationValue =
    window.sessionStorage.getItem("access_token") || null;
  const autorizationHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: autohrizationValue,
    },
  };
  return autorizationHeader;
};

export default useAuthorization;
