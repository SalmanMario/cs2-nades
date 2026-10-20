import axios from "axios";

// No baseURL: Laravel serves the app and the API from the same domain,
// so requests go to whatever domain the site is opened on
const api = axios.create({
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
