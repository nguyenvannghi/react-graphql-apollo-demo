import produce from 'immer';
import * as nameConst from '../const';

export const initialState = {
    error: null,
    allUsers: null,
};

const userReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case nameConst.CREATE_USER_SUCCESS:
                draft.data = action.data;
                draft.error = initialState.error;
                return draft;
            case nameConst.CREATE_USER_FAILED:
                draft.data = initialState.data;
                draft.error = action.error;
                return draft;
            default:
                return draft;
        }
    });
export default userReducer;
