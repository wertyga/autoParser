import { SET_LOADING } from '../actions/loading';

export default function (state = false, action = {}) {
    switch(action.type) {
        case SET_LOADING:
            return action.sign;

        default:
            return state;
    };
};