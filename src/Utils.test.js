import { waitFor } from "@testing-library/react";
import APIClient from "./utils/APIClient";
import { removeNewlines, cardTextForList, checkIfCardIsInList,
         reduceWhiteSpaces, extractCategoryKeys,
         removeElementsByClass, extractDate,
         tagContentClearer, textCleaner, compareDate,
         convertEFactorData } from "./utils/helpers";
import { queuedCardsMiddlePage,
         eFactorDistribution } from "./__mocks__/mockData";
import{ axiosMatch } from "axios";

describe("APIClient", () => {
    const apiClient = new APIClient();

    afterAll(jest.clearAllMocks);

    beforeAll(() => {
        const credentials = {user: "user_1",
                             password: "passwd"};
        apiClient.authenticate("/auth/token/login/", credentials);
    });

    test("calling route using an absolute URL", async () => {
        const allowedUrl = "http://localhost:8000/test/url";
        const response = await apiClient.request(allowedUrl, "get");
        expect(response).toBe("correct response");
        // to have been called times 1
    });

    test("calling unallowed origin using an absolute URL", async () => {
        const unallowedUrl = "http://notallowed:8000/test/url";
        await expect(() => apiClient.request(unallowedUrl,"get"))
            .rejects
            .toThrow("Attempt to make request with an unknowon origin: ");
    });

    test("delete method", async () => {
        const url = "/cards/memorized/7cf7ed26-bfd2-45a8-a9fc-a284a86a6bfa";
        const response = await apiClient.delete(url);
        expect(axiosMatch.delete).toHaveBeenCalledTimes(1);
        expect(axiosMatch.delete).toHaveBeenCalledWith(
            expect.objectContaining(
                {url: `http://localhost:8000/api${url}`}));
    });
});

test("removeNewlines()", () => {
    const testText = `

some 

text

`;
    const expectedOutput = "some text";
    const receivedOutput = removeNewlines(testText);
    expect(receivedOutput).toEqual(expectedOutput);
});

describe("cardTextForList()", () => {
    test("short output text - no ...", () => {
        const testText = "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>House moment.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Sound high.</p>\n</div>\n\n</div>";
        const expectedOutput = "House moment. Sound high.";
        const receivedOutput = cardTextForList(testText);
        expect(receivedOutput).toEqual(expectedOutput);
    });

    test("longer output text with ...", () => {
        const testText = "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>House <i>moment</i> Nunc nunc diam, cursus sit amet ligula eget, accumsan aliquet eros.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Sound high <b>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed gravida semper mauris, sit amet vehicula velit scelerisque eget.</b> short.</p>\n</div>\n\n</div>";
        const expectedOutput = "House moment Nunc nunc diam, c...";
        const receivedOutput = cardTextForList(testText);

        expect(receivedOutput).toEqual(expectedOutput);
    });

    it("removes content from unwanted tags", () => {
        // should remove contents of <style></style> and
        // <script></script> first
        const testText = '<style>ul.toc li.heading, .back-top, a.demo, '
              + '.home-intro-sub{background:#232323; color:#fff</style>'
              + '<script></script><script>!function(t,e){var i=function('
              + 't,e){if(e.body){var n=e.createElement("div");</script>'
              + 'House moment Nunc nunc diam sit vehicula velit scelerisque'
              + '<!-- fallback card template -->\n<!-- used when the Card';
        const expectedOutput = "House moment Nunc nunc diam si...";
        const receivedOutput = cardTextForList(testText);

        expect(receivedOutput).toEqual(expectedOutput);
    });
});

test("reduceWhiteSpaces()", () => {
    const testText = "a     	 b";  // several spaces and a tab
    const expectedOutput = "a b";
    const receivedOutput = reduceWhiteSpaces(testText);
    expect(receivedOutput).toEqual(expectedOutput);
});

test("extractKeys() - category keys extractor", () => {
    const input = [
        {
            "key": "64c3df14-7117-4453-8679-42ebfd18159c",
            "title": "English language",
            "children": [
                {
                    "key": "6d18daff-94d1-489b-97ce-969d1c2912a6",
                    "title": "Grammar",
                    "children": [
                        {
                            "key": "e742bdf5-2324-4b7c-ba63-08b9345c9f40",
                            "title": "Expressing future",
                            "children": []
                        },
                        {
                            "key": "2bc7beda-f447-49d8-87ad-72c6e649bbb8",
                            "title": "Verb",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "216682bb-7f28-42ed-8de8-37ff686cf62b",
                    "title": "Vocabulary",
                    "children": [
                        {
                            "key": "1b2ad022-731c-4a56-af0e-39b0384bb8c4",
                            "title": "Holidays",
                            "children": []
                        },
                        {
                            "key": "0b075f21-8e05-49a1-a426-e39b772c3604",
                            "title": "Household devices",
                            "children": []
                        },
                        {
                            "key": "2dd3ef3a-f88b-4be3-a556-b0a274f0b15d",
                            "title": "Household utils",
                            "children": [
                                {
                                    "key": "4ab9e997-8bbe-46b6-8970-f2ed644b289c",
                                    "title": "New utils",
                                    "children": []
                                }
                            ]
                        },
                    ]
                }
            ]
        }
    ];
    const expectedOutput = [
        "64c3df14-7117-4453-8679-42ebfd18159c",
        "6d18daff-94d1-489b-97ce-969d1c2912a6",
        "e742bdf5-2324-4b7c-ba63-08b9345c9f40",
        "2bc7beda-f447-49d8-87ad-72c6e649bbb8",
        "216682bb-7f28-42ed-8de8-37ff686cf62b",
        "1b2ad022-731c-4a56-af0e-39b0384bb8c4",
        "0b075f21-8e05-49a1-a426-e39b772c3604",
        "2dd3ef3a-f88b-4be3-a556-b0a274f0b15d",
        "4ab9e997-8bbe-46b6-8970-f2ed644b289c"
    ];

    const computedOutput = extractCategoryKeys(input);
    expect(expectedOutput).toEqual(computedOutput);
});

test("removeElementsByClass()", () => {
    const htmlString = `<p class="dict-entry">lacklustre [ˈ<span title="l - as in leap, hill">l</span><span title="a - as in trap">a</span><span title="kl - as in clean">kl</span><span title="ʌ - u as in butter, upset">ʌ</span><span title="st - as in stay, post">st</span><span title="ə - as in another">ə</span>]</p><div class="answer-examples">
          <p><i>A dull and boring party is an example of something
            that would be described as a lackluster event.</i></p>
          <p>A half-hearted and uncaring effort is an example
            of something that would be described as a lackluster effort.</p>`;
    const expectedOutput = `<div class="answer-examples">
          <p><i>A dull and boring party is an example of something
            that would be described as a lackluster event.</i></p>
          <p>A half-hearted and uncaring effort is an example
            of something that would be described as a lackluster effort.</p></div>`;
    const renderedHtml = document.createElement("div");
    renderedHtml.innerHTML = expectedOutput;
    const receivedOutput = removeElementsByClass(htmlString, "dict-entry");
    expect(receivedOutput).toBe(expectedOutput);
});

test("checkIfCardIsInList(card, list) - should return true", () => {
    // cardId = "5f143904-c9d1-4e5b-ac00-01258d09965a"
    const card = queuedCardsMiddlePage.results[0];
    expect(checkIfCardIsInList(card, queuedCardsMiddlePage.results))
        .toBeTruthy();
});

test("checkIfCardIsInList(card, list) - should return false", () => {
    const card = {
        "id": "cf530d38-1212-41ea-906a-c60670dbe2b8",
        "created_on": "2023-04-06 13:10:48.900927+00:00",
        "body": "empty card",
        "categories": []
    };
    expect(checkIfCardIsInList(card, queuedCardsMiddlePage.results))
        .toBeFalsy();
});

test("extractDate()", () => {
    const input = "2023-05-10T10:06:01.179692Z";
    const expectedOutput = "2023-05-10";
    const receivedOutput = extractDate(input);

    expect(receivedOutput).toEqual(receivedOutput);
});

test("tagContentClearer", () => {
    const input = "We will learn to <b>remove all child elements or "
          + "content</b> of a div element using JavaScript. However, whatever"
          + "method we learn to clear the div element's content will "
          + "work with any HTML element.";
    const expectedOutput = "We will learn to <b></b> of a div element using"
          + " JavaScript. However, whatever"
          + "method we learn to clear the div element's content will "
          + "work with any HTML element.";
    const receivedOutput = tagContentClearer(input, "b");

    expect(expectedOutput).toEqual(receivedOutput);
});

describe("compareDate", () => {
    test("dateA before dateB", () => {
        const dateA = "2023-08-15";
        const dateB = "2023-09-15";
        const result = compareDate(dateA, dateB);
        expect(result).toBeLessThan(0);
    });

    test("date b before date a", () => {
        const dateA = "2023-09-15";
        const dateB = "2023-08-15";
        const result = compareDate(dateA, dateB);
        expect(result).toBeGreaterThan(0);
    });

    test("dates are equal", () => {
        const dateA = "2023-09-15";
        const dateB = "2023-09-15";
        const result = compareDate(dateA, dateB);
        expect(result).toEqual(0);
    });
});

test("convertEFactorData", () => {
    const expectedOutput = {
        "1.3": 2,
        "1.7": 2,
        "1.72": 2,
        "1.76": 1,
        "1.78": 1,
        "1.82": 1,
        "1.9": 2,
        "1.96": 2,
        "2.04": 1,
        "2.04": 7,
        "2.18": 6,
        "2.22": 8,
        "2.28": 6,
        "2.36": 19,
        "2.46": 2,
        "2.5": 2,
        "2.6": 4
    };
    const receivedOutput = convertEFactorData(eFactorDistribution);
    expect(receivedOutput).toMatchObject(expectedOutput);
});

