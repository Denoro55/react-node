const initialState = {
    loading: true,
    messages: []
};

const createMessage = (name, id, updated) => ({name, id, updated});

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

        case 'MESSAGE_UPDATE': {
            const {id, updated, message, sort = true} = action.payload;

            const index = state.messages.findIndex(m => m.id === id);
            let updatedMessages = [...state.messages];

            if (sort) {
                // отсортировать и создать, если нет собеседника в списке
                let name = message.name;

                if (index >= 0) {
                    name = updatedMessages[index].name;
                    updatedMessages = updatedMessages.filter(m => m.id !== id);
                }
                updatedMessages.unshift(createMessage(name, id, updated));
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

        // case 'MESSAGE_STATUS_UPDATE': {
        //     const id = action.payload.id;
        //     const updated = action.payload.updated;
        //     const message = action.payload.message;
        //
        //     const updatedMessages = [...state.messages];
        //     const index = updatedMessages.findIndex(m => m.id === id);
        //     if (index < 0) {
        //         if (!message) {
        //             return state;
        //         } else {
        //             updatedMessages.unshift({...message, updated: true});
        //             return {
        //                 ...state,
        //                 messages: updatedMessages
        //             };
        //         }
        //     }
        //
        //     updatedMessages[index].updated = updated;
        //
        //     return {
        //         ...state,
        //         messages: updatedMessages
        //     };
        // }

        // case 'MESSAGES_LIST_SORT': {
        //     const id = action.payload;
        //
        //     const updatedMessages = [...state.messages];
        //     const index = updatedMessages.findIndex(m => m.id === id);
        //     if (index < 0) return state;
        //
        //     const thisItem = updatedMessages[index];
        //     const newMessagesList = updatedMessages.filter(m => m.id !== id);
        //     newMessagesList.unshift(thisItem);
        //
        //     return {
        //         ...state,
        //         messages: newMessagesList
        //     };
        // }

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
