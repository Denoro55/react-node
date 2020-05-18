const initialState = {
    loading: true,
    messages: []
};

const createMessage = (name, text, id, avatarUrl, updated) => ({name, text, id, avatarUrl, updated});

const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_MESSAGES':
            return {
                loading: true,
                messages: []
            };

        case 'FETCH_MESSAGES_SUCCESS':
            return {
                loading: false,
                messages: action.payload
            };

        case 'FETCH_MESSAGES_FAILURE':
            return {
                loading: false,
                messages: [...state.messages]
            };

        case 'MESSAGE_UPDATE': {
            const {id, updated, message, sort = true} = action.payload;

            const index = state.messages.findIndex(m => m.id === id);
            let updatedMessages = [...state.messages];

            if (sort) {
                // отсортировать и создать, если нет собеседника в списке
                let name = message.name;
                let text = message.text;
                let avatarUrl = message.avatarUrl;

                if (index >= 0) {
                    name = updatedMessages[index].name;
                    updatedMessages = updatedMessages.filter(m => m.id !== id);
                }
                updatedMessages.unshift(createMessage(name, text, id, avatarUrl, updated));
            } else {
                if (index >= 0) {
                    updatedMessages[index].updated = updated;
                }
            }

            return {
                ...state,
                messages: updatedMessages
            };
        }

        case 'MESSAGES_LIST_UPDATE':
            return {
                ...state,
                messages: action.payload
            };

        default:
            return state;
    }
};

export default messagesReducer;
