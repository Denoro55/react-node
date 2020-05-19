import {combineReducers} from "redux";
import userReducer from "./userReducer";
import messagesReducer from "./messageReducer";
import chatReducer from "./chatReducer";
import counterReducer from "./counterReducer";

const reducer = combineReducers({
    user: userReducer,
    messages: messagesReducer,
    chat: chatReducer,
    counter: counterReducer
});

export default reducer;
