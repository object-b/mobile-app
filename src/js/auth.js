import { get, set } from 'idb-keyval';

class Auth {
  isAuthenticated(cb) {
    get('AUTH_TOKEN').then(token => {
      cb(token);
    });
  }
}

export default new Auth();