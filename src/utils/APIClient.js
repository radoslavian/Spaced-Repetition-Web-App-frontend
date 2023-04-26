import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL || "http://localhost:8000";

export default class ApiClient{
    constructor(authToken = "") {
	this.baseUrl = BASE_API_URL + "/api";
        this.authToken = authToken;
    }

    setAuthToken(token) {
        this.authToken = token;
    }

    async request(url, method, options) {
        const headers = this.authToken !== "" ? {
            'Content-Type': 'application/json',
            Authorization: 'Token '+ this.authToken
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

