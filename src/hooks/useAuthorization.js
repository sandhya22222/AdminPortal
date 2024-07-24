import Cookies from 'js-cookie'

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

const useAuthorization = () => {
    const authorizationValue =
        // window.sessionStorage.getItem("ap_access_token") || null;
        Cookies.get('ap_access_token') || null

    const authorizationHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: authorizationValue,
        },
    }
    return authorizationHeader
}

export default useAuthorization
