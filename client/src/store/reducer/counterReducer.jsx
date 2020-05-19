const counterReducer = (state = 3, action) => {
    switch (action.type) {
        case 'COUNTER_ADD': {
            return state + 1
        }
        default: {
            return state;
        }
    }
};

export default counterReducer;
