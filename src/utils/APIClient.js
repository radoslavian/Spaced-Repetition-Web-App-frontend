import axios from "axios";
import { getAuthToken } from "./helpers.js";

export const BASE_API_URL = (process.env.REACT_APP_BASE_API_URL
			     || "http://localhost:8000");

export default class ApiClient {
    constructor() {
	this.baseUrl = BASE_API_URL + "/api";
    }

    async authenticate(endpoint, credentials) {
        const localToken = await this.post(endpoint, {data: credentials});
	return localToken;
    }

    async logout() {
	const response = await this.post("/auth/token/logout/");
    }

    isAuthenticated() {
	const token = getAuthToken();
        return Boolean(token);
    }

    validateRequest(url) {
        const baseUrlOrigin = new URL(this.baseUrl).origin;
        const receivedUrlOrigin = new URL(url).origin;
        return baseUrlOrigin === receivedUrlOrigin;
    }

    getRequestUrl(url) {
        let validation;

        try {
            validation = this.validateRequest(url);
        } catch(e) {
            return this.baseUrl + url;
        }

        switch(validation) {
        case true:
            return url;
        case false:
            throw Error("Attempt to make request with an unknowon origin: "
                        + `${new URL(url).origin}`);
        default:
            throw Error(`Wrong URL: ${url}`);
        }
    }

    async request(url, method, options = {}) {
        const requestUrl = this.getRequestUrl(url);
        const authToken = getAuthToken();
        const headers = Boolean(authToken) ? {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + authToken
        } : {
            'Content-Type': 'application/json'
        };
        const config =  {
            url: requestUrl,
            method: method,
            headers: { ...headers },
            ...options
        };

        // axios itself is only called in this place
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async get(url) {
        return this.request(url, "get");
    }

    async post(url, options) {
        return this.request(url, "post", options);
    }

    async put(url, options) {
        return this.request(url, "put", options);
    }

    async patch(url, options) {
        return this.request(url, "patch", options);
    }

    async delete(url, options) {
        return this.request(url, "delete", options);
    }
}

