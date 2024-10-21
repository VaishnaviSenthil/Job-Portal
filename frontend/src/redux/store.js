import {createStore , combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { editAjobReducer, loadJobReducer, loadJobSingleReducer } from './reducers/jobReducer';
import { createJobTypeReducer, loadJobTypeReducer } from './reducers/jobTypeRedeucer';
import { allUserReducer, userApplyJob, userReducerProfile, userReducerSignIn } from './reducers/userReducer';

const reducer = combineReducers({
    loadJobs: loadJobReducer,
    jobType: loadJobTypeReducer,
    signIn:userReducerSignIn,
    userProfile:userReducerProfile,
    singleJob : loadJobSingleReducer,
    userJobApply : userApplyJob,
    allUsers: allUserReducer,
    jobEdit: editAjobReducer,
    createJobType: createJobTypeReducer,
    
});


let initialState = {
    signIn: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    },
}
const middleware = [thunk];
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));



export default store;

