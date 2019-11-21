import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {Button, Container, Divider, Form, Grid, Header, Image, Label, Message, Segment} from "semantic-ui-react";
import { updateUser, fetchUser } from "../../actions/userActions";
import {Formik} from "formik";


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

    this.props.fetchUser(this.props.auth.user._id);

  }


  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.user !==prevState.user){
      return { someState: nextProps.user};
    }
    if(nextProps.errors !==prevState.errors){
      return { someState: nextProps.errors};
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.user!==this.props.user){
      //Perform some operation here
      this.setState({
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        userName: this.props.user.userName,
        email: this.props.user.email,
      });
    }

    if (prevProps.errors !== prevState.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

    render() {
        const {errors} = this.state;

        return (
            <Container>
                <Grid centered textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 500}}>

                        <div className="col s12" style={{paddingLeft: "11.250px"}}>
                            <h4>
                                <b>Manage your profile</b>
                            </h4>
                        </div>
                        <Formik initialValues={{
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            userName: this.state.userName,
                            email: this.state.email
                        }}
                                enableReinitialize
                                onSubmit={values => {

                            const updatedUser = {
                                firstName: values.firstName,
                                lastName: values.lastName,
                                userName: values.userName,
                                email: values.email
                            };

                            this.props.updateUser(this.props.user.userName, updatedUser, this.props.history);
                        }}>

                            {({handleChange, handleSubmit, values}) => (

                                <Segment>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            label='First Name'
                                            placeholder='firstname'
                                            value={values.firstName}
                                            onChange={handleChange('firstName')}
                                            error={errors.firstName && {content: errors.firstName}}
                                        />


                                        <Form.Input
                                            label='Last Name'
                                            placeholder='lastname'
                                            value={values.lastName}
                                            onChange={handleChange('lastName')}
                                            error={errors.lastName && {content: errors.lastName}}
                                        />

                                        <Form.Input
                                            icon='user'
                                            iconPosition='left'
                                            label='Username'
                                            placeholder='username'
                                            value={values.userName}

                                            error={errors.userName && {content: errors.userName}}
                                        />


                                        <Form.Input
                                            icon='at'
                                            iconPosition='left'
                                            label='Email'
                                            placeholder='email'
                                            value={values.email}

                                            error={errors.email && {content: errors.email}}
                                        />

                                        <Button type='submit' content='Save' primary/>
                                    </Form>
                                </Segment>
                            )}
                        </Formik>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

Profile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  user: state.user
});

export default connect(
  mapStateToProps,
  { updateUser, fetchUser }
)(withRouter(Profile));