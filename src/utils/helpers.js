export function getAuthToken() {
    const tokenString = localStorage.getItem('userToken');
    const userToken = JSON.parse(tokenString);
    return userToken?.auth_token;
}

export function saveToken(userToken) {
    localStorage.setItem('userToken', JSON.stringify(userToken));
}

