import {updateMessageInList} from "./messageActions";

export const fetchChatMessagesRequest = () => ({type: 'FETCH_CHAT'});
export const fetchChatSuccess = (payload) => ({type: 'FETCH_CHAT_SUCCESS', payload});
export const fetchChat = (apiService) => (id, receiverId) => (dispatch) => {
    dispatch(fetchChatMessagesRequest());

    return apiService.getChatMessages(id, receiverId).then(res => {
        dispatch(fetchChatSuccess(res.body));
        dispatch(updateMessageInList({id: receiverId, updated: false, sort: false}));
    })
};

export const actionUpdateChatStatus = ({inChat, chatId}) => ({type: 'CHAT_STATUS_UPDATE', payload: {inChat, chatId}});
export const addChatMessage = ({name, text}) => ({type: 'CHAT_MESSAGE_ADD', payload: {name, text}});

export const actionSendMessage = (apiService) => (companion, user, message, date) => (dispatch) => {
    const receiverId = companion.id;

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({id: receiverId, senderId: user.id, message, companion, date})
    };

    return apiService.getRequest('sendMessage', params);
};
