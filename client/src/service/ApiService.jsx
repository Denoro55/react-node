import UnauthorizedError from "../errors/UnauthorizedError";

class ApiService {
    URL = '/api/';

    getRequest(url, params = {}) {
        return new Promise((resolve, reject) => {
            fetch(`${this.URL}${url}`, params).then(res => {
                if (res.status === 401) reject(new UnauthorizedError());
                return res.json();
            }).then(res => resolve(res));
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

    getChatMessages = (id, receiverId) => {
        return this.getRequest('chatMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, receiverId})
        });
    };

    getListMessages = (id) => {
        return this.getRequest('listMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        });
    };

    updateChatTime(id, receiverId, date) {
        return this.getRequest('chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, receiverId, date})
        });
    }
}

export default ApiService;
