import UnauthorizedError from "../errors/UnauthorizedError";

class ApiService {
    URL = '/api/';
    token = null;

    getRequest(url, params = {}) {
        return new Promise((resolve, reject) => {
            fetch(`${this.URL}${url}`, params)
                .then(r =>  r.json().then(data => ({status: r.status, body: data})) )
                .then(res => {
                    if (res.status === 401) reject(new UnauthorizedError());
                    resolve(res);
                }).catch(e => {
                    reject(e);
                })
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
        return this.getRequest('register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    uploadAvatar(formData) {
        return this.getRequest('uploadAvatar', {
            method: 'POST',
            headers: {
                'Authorization': this.getToken()
            },
            body: formData
        });
    }

    uploadBackground(formData) {
        return this.getRequest('uploadBackground', {
            method: 'POST',
            headers: {
                'Authorization': this.getToken()
            },
            body: formData
        });
    }

    // posts
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

    createPost(formData) {
        return this.getRequest('createPost', {
            method: 'POST',
            headers: {
                'Authorization': this.getToken()
            },
            body: formData
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

    // comments
    createComment(userId, postId, text) {
        return this.getRequest('createComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({userId, postId, text})
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

    getUserData = () => {
        return this.getRequest('userData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            }
        });
    };

    // messages
    sendMessage = (receiverId, senderId, message, companion, date) => {
        return this.getRequest('sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({id: receiverId, senderId, message, companion, date})
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

    follow(followerId, followingId, isFollowing) {
        console.log(followerId, followingId, isFollowing);
        return this.getRequest('follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({followerId, followingId, isFollowing})
        });
    }

    fetchFollowers(userId) {
        return this.getRequest('followers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({userId})
        });
    }

    fetchFollowing(userId) {
        return this.getRequest('following', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({userId})
        });
    }

    fetchUsers(match) {
        return this.getRequest('users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getToken()
            },
            body: JSON.stringify({match})
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
