import { useState } from "react";
import { getAuthToken, saveToken } from "../utils/helpers.js";

// based on:
// https://www.digitalocean.com/community/tutorials/how-to-add-login-
// Authentication-to-react-applications#step-3-storing-a-user-token-with-sessionstorage
// -and-localstorage
// the article describes also storing token in localStorage

export default function useToken() {
    const [token, setToken] = useState(getAuthToken());

    const saveUserToken = userToken => {
	console.log("Save token: ", userToken);
	saveToken(userToken);
	setToken(userToken.auth_token);
    };

    return {
	setToken: saveUserToken,
	token
    }
}

