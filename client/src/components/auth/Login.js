import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginGoogleUser, loginPolytechUser } from "../../actions/authActions";
import { Button } from "semantic-ui-react";
import classnames from "classnames";
import Row from "react-bootstrap/Row";
import { bindActionCreators } from "redux";
import axios from "axios";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      url: this.authPolytech()
    };
  }

  componentDidMount() {
   // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/:userName/boards");
    }

    if (this.props.location.search) {
      const params = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => {
        params[key] = value;
      });


      //callback of polytech auth
      if(params.state !== undefined && (params.state.localeCompare(localStorage.getItem("state")))) {

        const data = {client_id: "566e7eb0-0081-4171-9cef-de9e92e84901", code: params.code};
        axios
            .post("https://oauth.igpolytech.fr/token", data)
            .then(res =>this.props.loginPolytechUser(res.data.access_token, this.props.history));
      }


      //last step for google and polytech auth
      if (params.token !== undefined) {
        this.props.loginGoogleUser("Bearer ".concat(params.token.replace("#", "")), this.props.history)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      //this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  authPolytech = () => {

    let state = Math.random().toString(36).substring(7);
    localStorage.setItem("state", state);

    const clientId = "566e7eb0-0081-4171-9cef-de9e92e84901";
    const redirectUri = encodeURI("http://localhost:3000/login");
    return `http://oauth.igpolytech.fr/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`

  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <Row>
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                  >
                    Login
                </button>

                  <a href={this.state.url}> Log in with polytech  </a>
                  <a href="http://localhost:5000/api/public/user/auth/google"> Log in with google  </a>
                </Row>
              </div>
            </form>
            <Button onClick={this.authPolytech}>Login Polytech</Button>
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  loginGoogleUser: PropTypes.func.isRequired,
  loginPolytechUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

// Put actions in props
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loginUser,
    loginGoogleUser,
    loginPolytechUser
  }, dispatch,
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);