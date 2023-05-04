import axios from "axios";
import { getAuthToken, saveToken } from "./helpers.js";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL || "http://localhost:8000";

export default class ApiClient {
    constructor() {
	this.baseUrl = BASE_API_URL + "/api";
    }

    async authenticate(endpoint, credentials) {
        const localToken = await this.post(endpoint, credentials);
        saveToken(localToken);
    }

    isAuthenticated() {
	const token = getAuthToken();
        return token !== null;
    }

    async request(url, method, options) {
        const authToken = getAuthToken();
        const headers = authToken !== undefined ? {
            'Content-Type': 'application/json',
            Authorization: 'Token '+ authToken
        } : {
            'Content-Type': 'application/json'
        };
        const config =  {
            ...options,
            headers: { ...headers }
        };
        const requestUrl = this.baseUrl + url;
        
        return axios[method](requestUrl, config)
            .then(response => response.data)
            .catch(console.error);
    }

    async get(url) {
        return this.request(url, "get");
    }

    async post(url, options) {
        return this.request(url, "post", options);
    }
}

