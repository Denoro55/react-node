// export const actionAuthCheckSuccess = (payload) => ({type: 'AUTH_CHECK_SUCCESS', payload});
// export const actionAuthCheckFailure = () => ({type: 'AUTH_CHECK_FAILURE'});
// export const actionAuthCheck = () => ({type: 'AUTH_CHECK'});
// export const authCheck =  () => (dispatch) => {
//     dispatch(actionAuthCheck());
//
//     const token = localStorage.getItem('userData');
//     if (token) {
//         dispatch(actionAuthCheckSuccess({auth: true, token}));
//     } else {
//         dispatch(actionAuthCheckFailure());
//     }
// };

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

export const getUserData = (apiService, token) => () => (dispatch) => {
    dispatch(actionGetUserData());

    apiService.getUserData(token).then(res => {
        const data = {auth: true, token};
        dispatch(actionGetUserDataSuccess(data));
    }).catch(err => {
        dispatch(actionGetUserDataFailure());
    })
};

export const auth = (isAuth) => ({type: 'AUTH', payload: isAuth});
