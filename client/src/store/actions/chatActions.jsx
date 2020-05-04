import {updateMessageInList} from "./messageActions";

export const fetchChatMessagesRequest = () => ({type: 'FETCH_CHAT'});
export const fetchChatSuccess = (payload) => ({type: 'FETCH_CHAT_SUCCESS', payload});
export const fetchChat = (apiService) => (id, receiverId) => (dispatch) => {
    dispatch(fetchChatMessagesRequest());

    return apiService.getChatMessages(id, receiverId).then(res => {
        dispatch(fetchChatSuccess(res));
        dispatch(updateMessageInList({id: receiverId, updated: false, sort: false}));
    })
};

export const actionUpdateChatStatus = ({inChat, chatId}) => ({type: 'CHAT_STATUS_UPDATE', payload: {inChat, chatId}});
export const addChatMessage = ({name, text}) => ({type: 'CHAT_MESSAGE_ADD', payload: {name, text}});

export const actionSendMessage = (apiService) => (companion, user, message) => (dispatch) => {
    const receiverId = companion.id;

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({id: receiverId, senderId: user.id, message})
    };

    apiService.getRequest('sendMessage', params);
    dispatch(addChatMessage(message));

    // client messages list
    const clientMessage = {
        ...message,
        name: companion.name
    };
    dispatch(updateMessageInList({id: receiverId, updated: false, message: clientMessage, sort: true}));
};
