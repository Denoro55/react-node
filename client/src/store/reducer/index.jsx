import {combineReducers} from "redux";
import userReducer from "./userReducer";
import messagesReducer from "./messageReducer";
import chatReducer from "./chatReducer";

const reducer = combineReducers({
    user: userReducer,
    messages: messagesReducer,
    chat: chatReducer
});

export default reducer;
