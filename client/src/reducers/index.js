
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import teamReducer from "./teamReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  teams: teamReducer
});