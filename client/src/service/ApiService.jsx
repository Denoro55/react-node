import UnauthorizedError from "../errors/UnauthorizedError";

class ApiService {
    URL = 'http://localhost:9000/api/';
    authorization = '';

    getRequest(url, params = {}) {
        return fetch(`${this.URL}${url}`, params).then(res => {
            if (res.status === 401) throw new UnauthorizedError();
            return res.json();
        }).then(res => res);
    }

    checkAuth() {
        return this.getRequest('auth', {
            method: 'POST'
        });
    }

    login(data) {
        return this.getRequest('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    register(data) {
        console.log(JSON.stringify(data));
        return this.getRequest('register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    getUserData = (token) => {
        return this.getRequest('userData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };
}

export default ApiService;
