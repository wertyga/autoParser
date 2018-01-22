import axios from 'axios';

export const GET_CATEGORIES = 'GET_CATEGORIES';

export function fetchCategories() {
    return dispatch => {
        return axios.get('/categories/fetch-categories')
    };
};

export function getCategories() {
    return dispatch => {
        return axios.get('/categories/get-categories')
            .then(res => dispatch({
                type: GET_CATEGORIES,
                categories: res.data.categories
            }))
            .catch(err => { throw err })
    };
};