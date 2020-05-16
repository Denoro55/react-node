import UnauthorizedError from "../errors/UnauthorizedError";

class ApiService {
    URL = '/api/';
    token = null;

    getRequest(url, params = {}) {
        return new Promise((resolve, reject) => {
            // fetch(`${this.URL}${url}`, params).then(res => {
            //     if (res.status === 401) reject(new UnauthorizedError());
            //     return res.json();
            // }).then(res => resolve(res));

            fetch(`${this.URL}${url}`, params)
                .then(r =>  r.json().then(data => ({status: r.status, body: data})))
                .then(res => resolve(res));
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

    uploadAvatar(formData) {
        const token = this.getToken();

        return this.getRequest('uploadAvatar', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });
    }

    createPost(formData) {
        return this.getRequest('createPost', {
            method: 'POST',
            headers: {
                'Authorization': this.getToken()
            },
            body: formData
        });
    }

    createComment(userId, postId, text) {
        return this.getRequest('postComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({userId, postId, text})
        });
    }

    fetchPosts(id) {
        return this.getRequest('posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({id})
        });
    }

    removePost(id) {
        return this.getRequest('posts', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({id})
        });
    }

    getUserData = () => {
        const token = this.getToken();

        return this.getRequest('userData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
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

    getUserInfo(id, clientId) {
        const token = this.getToken();

        return this.getRequest('userInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({id, clientId})
        });
    }

    likePost(userId, postId, isLiked) {
        const token = this.getToken();

        return this.getRequest('postLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({userId, postId, like: isLiked})
        });
    }

    likeComment(userId, commentId, isLiked) {
        return this.getRequest('likeComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({userId, commentId, like: isLiked})
        });
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }
}

export default ApiService;
