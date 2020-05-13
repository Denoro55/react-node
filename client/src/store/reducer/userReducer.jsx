const initialState = {
    name: null,
    auth: false,
    token: null,
    id: null,
    avatarUrl: null
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

        case 'USER_AVATAR_UPDATE':
            return {
                ...state,
                avatarUrl: action.payload
            };

        case 'USER_UNAUTHORIZE':
            return {...initialState};

        default:
            return state;
    }
};

export default userReducer;
