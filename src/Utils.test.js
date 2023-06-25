import { waitFor } from "@testing-library/react";
import APIClient from "./utils/APIClient";
import { removeNewlines, cardTextForList,
         reduceWhiteSpaces, extractCategoryKeys } from "./utils/helpers";
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
        expect(response.status).toEqual(204);
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

