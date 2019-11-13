import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import "bootstrap/dist/css/bootstrap.min.css";
import {setCurrentUser, logoutUser} from "./actions/authActions";
import {Provider} from "react-redux";
import store from "./store";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
<<<<<<< HEAD
import CreateTeam from "./components/team/CreateTeam";
import Profile from "./components/profile/Profile"
=======
import Profile from "./components/profile/Profile"
import CreateTeam from "./components/team/CreateTeam";
import MyTeams from "./components/team/MyTeams";
import AddMember from "./components/team/AddMember";
>>>>>>> 80dea49461e822f9f5f77cf62e08bb220e68ce69

// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

        // Redirect to login
        window.location.href = "./login";
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <a class="navbar-brand" href="https://codingthesmartway.com" target="_blank">
                            </a>
                            <Link to="/" className="navbar-brand">Prello</Link>
                            <div className="collpase navbar-collapse">
                                <ul className="navbar-nav mr-auto">
                                    <li className="navbar-item">
                                    <Link to="/profile/:id" className="nav-link">My profile</Link>
                                </li>
                                    <li>
                                        <Link to="/team/create" className="nav-link">Create a Team</Link>
                                    </li>
                                    <li>
                                        <Link to="/team" className="nav-link">My Teams</Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <br/>
                        <Route path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Switch>
                            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                            <PrivateRoute exact path="/profile/:id" component={Profile} />
                            <PrivateRoute exact path="/team/create" component={CreateTeam}/>
                            <PrivateRoute exact path="/team" component={MyTeams}/>
                            <PrivateRoute exact path='/team/addMembers/:teamId' component={AddMember}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;