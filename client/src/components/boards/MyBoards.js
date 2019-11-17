import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class MyBoards extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { userName } = this.props.user;

    return (
      <div>
        <h3>My boards</h3>
        <p>Insert code</p>
      </div>
    );
  }
}

MyBoards.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  //auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  //auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(MyBoards);