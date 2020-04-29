const initialState = {
    auth: false,
    token: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER_SUCCESS':
        case 'AUTH_CHECK_SUCCESS':
        case 'USER_AUTHORIZE':
            return action.payload;

        case 'USER_UNAUTHORIZE':
            return  {
                auth: false,
                token: null
            };

        default:
            return state;
    }
};

export default userReducer;
