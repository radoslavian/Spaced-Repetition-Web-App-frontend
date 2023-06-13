import { waitFor } from "@testing-library/react";
import APIClient from "./utils/APIClient";
import { removeNewlines, cardTextForList,
         reduceWhiteSpaces } from "./utils/helpers";
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
        const testText = "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>House moment.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Sound high short.</p>\n</div>\n\n</div>";
        const expectedOutput = "House moment. Sound high short.";
        const receivedOutput = cardTextForList(testText);
        expect(receivedOutput).toEqual(expectedOutput);
    });

    test("longer output text with ...", () => {
        const testText = "<!-- fallback card template -->\n<!-- used when the Card instance does not supply template for rendering -->\n<!-- base template for cards-->\n<div class=\"container\" id=\"card-body\">\n    \n<div class=\"question\">\n    <p>House <i>moment</i> Nunc nunc diam, cursus sit amet ligula eget, accumsan aliquet eros.</p>\n</div>\n<hr />\n<div class=\"answer\">\n    <p>Sound high <b>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed gravida semper mauris, sit amet vehicula velit scelerisque eget.</b> short.</p>\n</div>\n\n</div>";
        const expectedOutput = "House moment Nunc nunc diam, cursus sit amet ligul...";
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
