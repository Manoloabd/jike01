import { combineReducers } from "redux";
import login from './Login'
import profile from "./profile";
import home from "./home"
import article from "./article";
const rootReducer = combineReducers({
    login, profile, home, article
})

export default rootReducer