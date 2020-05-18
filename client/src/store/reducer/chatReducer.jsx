const initialState = {
    messages: [],
    loading: false,
    inChat: false,
    chatId: null,
    companion: {}
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CHAT':
            return {
                ...state,
                loading: true
            };

        case 'FETCH_CHAT_SUCCESS':
            return {
                ...state,
                messages: action.payload.messages,
                companion: {
                    ...action.payload.companion
                },
                loading: false
            };

        case 'FETCH_CHAT_FAILURE':
            return {
                ...state,
                loading: false
            };

        case 'CHAT_STATUS_UPDATE':
            const {inChat = false, chatId = null} = action.payload;
            return {
                ...state,
                inChat: inChat,
                chatId: chatId
            };

        case 'CHAT_MESSAGE_ADD':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        default:
            return state;
    }
};

export default chatReducer;
