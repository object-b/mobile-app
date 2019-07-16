import { get } from 'idb-keyval';
export const axios = require('axios');
import * as config from '../config.json';

axios.defaults.baseURL = config.authApiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

get('AUTH_TOKEN').then(AUTH_TOKEN => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN;
});