import UnauthorizedError from "../errors/UnauthorizedError";

class ApiService {
    URL = 'http://localhost:9000/api/';

    getRequest(url, params = {}, timeout = 20000) {
        return new Promise((resolve, reject) => {
            fetch(`${this.URL}${url}`, params).then(res => {
                if (res.status === 401) reject(new UnauthorizedError());
                return res.json();
            }).then(res => resolve(res));

            if (timeout) {
                const e = new Error("Connection timed out");
                setTimeout(reject, timeout, e);
            }
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

    updateChatTime(id, receiverId) {
        return this.getRequest('chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, receiverId})
        });
    }
}

export default ApiService;
