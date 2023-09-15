export function removeElementsByClass(htmlString, className){
    /* Removes elements from html string by their class name
      and returns html string.
      Based on:
      + StackOverflow - Removing elements by class name
      + StackOverflow - Strip HTML tags from text using plain JavaScript
     */
    const htmlObject = document.createElement("div");
    htmlObject.innerHTML = htmlString;
    const elements = htmlObject.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    return htmlObject.innerHTML;
}

export function cardTextForList(text) {
    /* strips text of html tags and shortens it, removes white spaces
      from start and end of the text
    */
    const textLen = 30;
    const outputText = textCleaner(text);

    if (outputText.length < textLen) {
        return outputText;
    }
    return outputText.slice(0, textLen) + "...";
};

const textCleaner = composeAll(
    text => tagContentClearer(text, "audio"),
    text => tagContentClearer(text, "script"),
    text => tagContentClearer(text, "style"),
    stripOfHtmlTags,
    removeNewlines,
    reduceWhiteSpaces,
    text => text.trim()
);


function compose(f, g) {
    /* compose() and composeALl() - composing functions for a single input
      solution with StackOverflow origin:
      "Javascript Reduce from a compose function"
    */
    return function(...args) {
        return f(g(...args));
    };
}

function composeAll(...fns) {
    return fns.reduceRight(compose);
}

export function stripOfHtmlTags(html) {
    // got it from StackOverflow:
    // https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export function reduceWhiteSpaces(text) {
    return text.replace(/\s+/g, " ");
}

export function removeNewlines(text) {
    // got it from StackOverflow
    return text.replace(/(\r\n|\n|\r)/gm, "");
}

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

export function extractCategoryKeys(categories) {
    const categoryKeys = [];
    for (let category of categories) {
	categoryKeys.push(category["key"]);
	categoryKeys.push(...extractCategoryKeys(category["children"]));
    }
    return categoryKeys;
}

export function checkIfCardIsInList(card, list) {
    const cardsIds = list.map(card => card.id);
    return cardsIds.includes(card.id);
}

export function extractDate(dateTimeString) {
    // extracts date from string with 'T', such as:
    // 2023-05-10T10:06:01.179692Z
    return dateTimeString.split("T")[0];
}

export function tagContentClearer(input, tag) {
    // removes contents of a particular tag pair

    const parentDiv = document.createElement("div");
    parentDiv.innerHTML = input;
    const tags = parentDiv.getElementsByTagName(tag);

    for(let htmlTag of tags) {
        htmlTag.replaceChildren();
    }

    return parentDiv.innerHTML;
}

export function compareDate(dateA, dateB) {
    // date sorting function - from Stackoverflow:
    // How to sort an object array by date property?
    return new Date(dateA) - new Date(dateB);
}

export function convertEFactorData(eFactorData) {
    // convert array data received from the API
    // into an object = { "e-factor": value }
    // With the help from StackOverflow:
    // How do I convert array of Objects into one Object in JavaScript?
    const mapped = eFactorData.map(ef => ({ [ef["e-factor"]]: ef["count"] }));
    const convertedData = Object.assign({}, ...mapped);
    return convertedData;
}

