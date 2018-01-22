import { combineReducers } from 'redux';
import globalError  from './globalError';
import loading from './loading';
import categories from './categories';


export default combineReducers({
    globalError,
    loading,
    categories
});