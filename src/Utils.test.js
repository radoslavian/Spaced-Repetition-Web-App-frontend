import { waitFor } from "@testing-library/react";
import APIClient from "./utils/APIClient";

describe("APIClient", () => {
    const apiClient = new APIClient();

    afterAll(jest.clearAllMocks);

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
});
