import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { updateUser } from "../../actions/userActions";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Profile page, should redirect them to dashboard
    /*if (this.props.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }*/
    //const { user } = getUserById(this.props.auth.user.id)
    this.setState({userName: this.props.auth.user.userName, email: this.props.auth.user.email})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const updatedUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userName: this.state.userName,
      email: this.state.email
    };

    console.log(`Form submitted:`);
    console.log(`User fisrt name: ${this.state.firstName}`);
    console.log(`User last name: ${this.state.lastName}`);
    console.log(`User name: ${this.state.userName}`);
    console.log(`User email: ${this.state.email}`);

    this.props.updateUser(this.props.auth.user.id, updatedUser);
  };

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;

    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Manage your profile</b>
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.userName}
                  error={errors.userName}
                  id="userName"
                  type="text"
                  className={classnames("", {
                    invalid: errors.userName
                  })}
                />
                <label htmlFor="userName">User Name</label>
                <span className="red-text">{errors.userName}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>
              
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updateUser }
)(withRouter(Profile));