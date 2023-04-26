import { useState } from "react";

// based on:
// https://www.digitalocean.com/community/tutorials/how-to-add-login-
// Authentication-to-react-applications#step-3-storing-a-user-token-with-sessionstorage
// -and-localstorage
// the article describes also storing token in localStorage

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString === undefined ? tokenString : "{}");
        return userToken?.token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    };
}

