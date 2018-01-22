export const SET_LOADING = 'SET_LOADING';

export function setLoading(sign) {
    return dispatch => {
        dispatch({
            type: SET_LOADING,
            sign
        })
    };
};