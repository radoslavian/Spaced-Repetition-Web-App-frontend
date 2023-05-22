export function stripHTMLShortenText(text) {
    // strips text of html tags and shortens it
    const textLen = 50;
    const strippedText = stripOfHtmlTags(text);
    if (strippedText.length < textLen) {
        return strippedText;
    }
    return strippedText.slice(0, textLen) + "...";
};

export function stripOfHtmlTags(html) {
    // got it from StackOverflow:
    // https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

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

