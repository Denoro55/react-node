import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
import {ApiService} from '../../service';

const apiService = new ApiService();

// worker Saga: will be fired on AUTH_CHECK action
function* authCheckSaga(action) {
    try {
        const token = null;
        if (token) {
            const payload = {token, auth: true};
            yield put({type: "AUTH_CHECK_SUCCESS", payload});
        } else {

        }
    } catch (e) {

    }
}

function* getUserDataSaga() {
    const userData = yield apiService.getUserData();
    yield put({type: "USER_DATA_SUCCESS", payload: userData});
}

// function* onAuth(action) {
//     const {token} = action.payload;
//     storageService.setToken(token);
// }

// function* watchAuthCheck() {
//     yield takeEvery("AUTH_CHECK", authCheckSaga);
// }

// function* watchGetUserData() {
//     yield takeEvery("GET_USER", getUserDataSaga);
// }

// function* mySaga2() {
//     yield takeEvery("AUTH", onAuth);
// }

export default function* rootSaga() {
    yield all([
        // watchAuthCheck(),
        // watchGetUserData()
    ])
}
