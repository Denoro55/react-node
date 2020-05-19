const initialState = {
    name: null,
    auth: false,
    token: null,
    id: null,
    avatarUrl: null,
    followingCount: 0,
    followersCount: 0
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

        case 'USER_DATA_UPDATE':
            return {
                ...state,
                ...action.payload
            };

        case 'USER_COUNTERS_UPDATE':
            const exec = typeof action.payload === 'function' ? action.payload : false;

            let newParams;
            if (exec) {
                newParams = exec(state);
            } else {
                newParams = action.payload;
            }

            return {
                ...state,
                ...newParams
            };

        case 'USER_UNAUTHORIZE':
            return {...initialState};

        default:
            return state;
    }
};

export default userReducer;
