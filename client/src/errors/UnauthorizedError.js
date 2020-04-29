class UnauthorizedError extends Error {
    constructor(...args) {
        super(...args);
        this.status = 401;
    }
}

export default UnauthorizedError;
