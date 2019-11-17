
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import teamReducer from "./teamReducer";
import currentTeamReducer from "./currentTeamReducer";
import boardReducer from "./boardReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  user: userReducer,
  teams: teamReducer,
  boards: boardReducer,
  currentTeam: currentTeamReducer

});