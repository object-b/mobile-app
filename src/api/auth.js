import { get, set } from 'idb-keyval';
import { axios } from './init';
import * as config from '../config.json';

class Auth {
  async register(email, password, name) {
    const url = '/register';
    const payload = {
      name: name,
      email: email,
      password: password,
    };
    let response;
    let AUTH_TOKEN;

    try {
      response = await axios.post(url, payload);
      AUTH_TOKEN = response.data.success.access_token;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN;
      
      set('AUTH_TOKEN', AUTH_TOKEN);
    } catch (error) {
      response = error || 'Неизвестная ошибка. Код 3';
    }

    return response;
  }

  async login(email, password) {
    const url = '/login';
    const payload = {
      email: email,
      password: password,
    };
    let response;
    let AUTH_TOKEN;
    
    await get('AUTH_TOKEN').then(async value => {
      if (value === undefined) {
        try {
          response = await axios.post(url, payload);
          AUTH_TOKEN = response.data.success.access_token;
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN;
          
          set('AUTH_TOKEN', AUTH_TOKEN).then();
        } catch (error) {
          response = error || 'Неизвестная ошибка. Код 4';
        }
      } else {
        response.status = 200; // well...
      }
    });

    return response;
  };

  async userDetails() {
      const url = '/details';
      const payload = {};
      
      try {
          return await axios.get(url, payload);
      } catch (error) {
          return error.response;
      }
  }

  logout(cb) {
    cb();
  }
  
  isAuthenticated() {
    get('AUTH_TOKEN').then(value => {
      return value !== undefined;
    });
  }
}

export default new Auth();
