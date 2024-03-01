import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;
axios.defaults.credentials = 'same-origin';
axios.defaults.withXSRFToken = true
export default axios;