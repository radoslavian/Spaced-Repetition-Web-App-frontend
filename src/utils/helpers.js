export function getAuthToken() {
    const tokenString = localStorage.getItem('userToken');
    let userToken;
    try {
	userToken = JSON.parse(tokenString);
    } catch (e) { }
    return userToken?.auth_token;
}

export function saveToken(userToken) {
    localStorage.setItem('userToken', JSON.stringify(userToken));
}

export function timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sleep(fn, timeout) {
    await timeOut(timeout);
    return fn();
}

