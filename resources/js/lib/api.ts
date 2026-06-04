import axios from "axios";

const api = axios.create({
    baseURL: "http://cs2-nades.test",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

export const getXsrfToken = () =>
    decodeURIComponent(
        document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? ''
    );

api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export default api;
