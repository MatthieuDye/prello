import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import "bootstrap/dist/css/bootstrap.min.css";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import CreateTodo from "./components/create-todo.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import CreateTeam from "./components/team/CreateTeam";

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
                                    <Link to="/" className="nav-link">Todos</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/create" className="nav-link">Create Todo</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li>
                                    <Link to="/team/create" className="nav-link">Create a Team</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <br/>
                    <Route path="/" exact component={TodosList} />
                    <Route path="/edit/:id" component={EditTodo} />
                    <Route path="/create" component={CreateTodo} />
                    <Route path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/team/create" component={CreateTeam}/>
            </Switch>
                </div>
            </Router>
            </Provider>
        );
    }
}

export default App;