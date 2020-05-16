export const actionAuthorize = ({auth, token}) => {
    localStorage.setItem('userData', token);

    return {type: 'USER_AUTHORIZE', payload: {auth, token}};
};

export const actionUnauthorize = () => {
    localStorage.removeItem('userData');

    return {type: 'USER_UNAUTHORIZE'};
};

export const actionGetUserDataSuccess = (payload) => ({type: 'GET_USER_SUCCESS', payload});
export const actionGetUserDataFailure = () => ({type: 'GET_USER_FAILURE'});
export const actionGetUserData = () => ({type: 'GET_USER'});
export const actionUpdateUserData = (payload) => ({type: 'USER_DATA_UPDATE', payload});

export const getUserData = (apiService, token) => () => (dispatch) => {
    dispatch(actionGetUserData());

    return apiService.getUserData().then(response => {
        const res = response.body.data;

        const data = {
            auth: true,
            token,
            ...res
        };

        return dispatch(actionGetUserDataSuccess(data));
    }).catch(err => {
        console.log(err);
        dispatch(actionGetUserDataFailure());
    })
};

export const auth = (isAuth) => ({type: 'AUTH', payload: isAuth});
