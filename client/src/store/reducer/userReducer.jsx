const initialState = {
    name: null,
    auth: false,
    token: null,
    id: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER_SUCCESS':
        case 'AUTH_CHECK_SUCCESS':
        case 'USER_AUTHORIZE':
            return {
                ...state,
                ...action.payload
            };

        case 'USER_UNAUTHORIZE':
            return  {
                name: null,
                auth: false,
                token: null
            };

        default:
            return state;
    }
};

export default userReducer;
