import React, {Component} from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import {logoutUser, setCurrentUser} from "./actions/authActions";
import {Provider} from "react-redux";
import store from "./store";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import MyBoards from "./components/boards/MyBoards";
import MyTeams from "./components/teams/MyTeams";
import Profile from "./components/profile/Profile"
import CreateTeam from "./components/teams/CreateTeam";
import CreateBoard from "./components/boards/CreateBoard";
import AddTeamMember from "./components/teams/AddTeamMember";
import AddBoardMember from "./components/boards/AddBoardMember";
import BoardView from "./components/boards/BoardView";
import TeamView from "./components/teams/TeamView";
import AddBoardTeam from "./components/boards/AddBoardTeam";
import BoardDetails from "./components/boards/BoardDetails";

import {Dropdown, Icon, Menu} from 'semantic-ui-react'
import LoaderAuth from "./components/auth/LoaderAuth";

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
    state = {
        activeItem: 'boards'
    };

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    onLogoutClick = e => {
        e.preventDefault();
        store.dispatch(logoutUser());
    };

    render() {
        const {activeItem} = this.state
        const DefaultContainer = () => (
            <React.Fragment>
                <Menu inverted>
                    <Menu.Item>
                        <img src={require('./assets/prello_icon.png')} alt="Prello logo"/>
                    </Menu.Item>

                    <Link to="/boards" className="nav-link">
                        <Menu.Item
                            name='boards'
                            active={activeItem === 'boards'}
                            onClick={this.handleItemClick}
                        />
                    </Link>

                    <Link to="/teams" className="nav-link">
                        <Menu.Item
                            name='teams'
                            active={activeItem === 'teams'}
                            onClick={this.handleItemClick}
                        />
                    </Link>

                    <Menu.Menu position='right'>
                        <Dropdown item icon='plus circle'>
                            <Dropdown.Menu className="dropDownMenu">
                                <Dropdown.Item>
                                    <Link to="/add/board" className="nav-link">
                                        <Icon name='columns'/>
                                        New Board
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to="/add/team" className="nav-link">
                                        <Icon name='users'/>
                                        New Team
                                    </Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item icon='user'>
                            <Dropdown.Menu className="dropDownMenu">
                                <Dropdown.Item>
                                    <Link to="/profile" className="nav-link">My profile</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to="/login" className="nav-link" onClick={this.onLogoutClick}>
                                        <Icon name='log out'/>
                                        Logout
                                    </Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>

                <PrivateRoute exact path="/boards" component={MyBoards}/>
                <PrivateRoute exact path='/board/:boardId/add/member' component={AddBoardMember}/>
                <PrivateRoute exact path="/profile" component={Profile}/>
                <PrivateRoute exact path="/add/team" component={CreateTeam}/>
                <PrivateRoute exact path="/add/board" component={CreateBoard}/>
                <PrivateRoute exact path="/teams" component={MyTeams}/>
                <PrivateRoute exact path='/team/:teamId' component={TeamView}/>
                <PrivateRoute exact path='/board/:boardId' component={BoardView}/>
                <PrivateRoute exact path='/board/:boardId/details' component={BoardDetails}/>
                <PrivateRoute exact path='/board/:boardId/add/team' component={AddBoardTeam}/>
            </React.Fragment>
        );

        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route path="/loader" component={LoaderAuth}/>
                        <Route path="/login" component={Login}/>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <PrivateRoute component={DefaultContainer}/>
                    </Switch>

                </Router>
            </Provider>
        );
    }
}


export default App;