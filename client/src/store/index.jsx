import {createStore, compose, applyMiddleware} from 'redux'
import reducer from "./reducer";
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware();

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const logMiddleware = () => (next) => (action) => {
    console.log(action);
    return next(action);
};

const store = createStore(reducer, compose(applyMiddleware(reduxThunk, sagaMiddleware, logMiddleware), reduxDevTools));

// sagaMiddleware.run(mySaga);

export default store;
