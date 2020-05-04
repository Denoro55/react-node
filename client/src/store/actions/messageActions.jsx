export const fetchMessagesRequest = (payload) => ({type: 'FETCH_MESSAGES', payload});
export const fetchMessagesSuccess = (payload) => ({type: 'FETCH_MESSAGES_SUCCESS', payload});

export const actionFetchMessages = (apiService) => (id) => (dispatch) => {
    dispatch(fetchMessagesRequest());

    apiService.getListMessages(id).then(res => {
        dispatch(fetchMessagesSuccess(res.messages));
    })
};

export const updateMessageInList = (payload) => ({type: 'MESSAGE_UPDATE', payload});
export const updateMessagesList = (list) => ({type: 'MESSAGES_LIST_UPDATE', payload: list});
export const sortMessagesList = ({id}) => ({type: 'MESSAGES_LIST_SORT', payload: id});
