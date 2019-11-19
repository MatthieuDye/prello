import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser} from "../../actions/authActions";
import classnames from "classnames";
import {Formik} from "formik";
import * as Yup from "yup";
import {Button, Image, Container, Divider, Form, Grid, Header, Segment, Message} from "semantic-ui-react";

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .required("First name is required")
        .min(2, 'First name must be between 2 and 50 characters')
        .max(50, 'First name must be between 2 and 50 characters'),
    lastName: Yup.string()
        .required("Last name is required")
        .min(2, 'Last name must be between 2 and 50 characters')
        .max(50, 'Last name must be between 2 and 50 characters'),
    userName: Yup.string()
        .required("Username is required")
        .min(3, 'Username must be between 3 and 30 characters')
        .max(30, 'Username must be between 3 and 30 characters'),
    email: Yup.string().email()
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
    password2: Yup.string()
        .required("Password confirmation is required"),
});

class Register extends Component {
    constructor() {
        super();
        this.state = {
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/:userName/boards");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        const {errors} = this.state;

        return (
            <Container>

                <Grid centered textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 800}}>
                        <Message attached>
                            <Header as='h3'>
                                TO DO ADD LOGO
                                <Image src='../../../public/logo192.png'/>
                                <Header.Content>Register to Prello</Header.Content>
                            </Header>
                        </Message>
                        <Formik
                            initialValues={{
                                description: ''
                            }}
                            validationSchema={RegisterSchema}
                            onSubmit={values => {

                                const newUser = {
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    userName: values.userName,
                                    email: values.email,
                                    password: values.password,
                                    password2: values.password2
                                };

                                this.props.registerUser(newUser, this.props.history);
                            }}
                        >

                            {({handleChange, handleSubmit, values, yupErrors}) => (


                                <Segment>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                required
                                                label='First Name'
                                                placeholder='firstname'
                                                value={values.firstName}
                                                onChange={handleChange('firstName')}
                                                className={classnames("", {
                                                    invalid: errors.firstName
                                                })}
                                                error={errors.firstName && {content: errors.firstName}}
                                            />
                                            <Form.Input
                                                label='Last Name'
                                                placeholder='lastname'
                                                value={values.lastName}
                                                onChange={handleChange('lastName')}
                                                className={classnames("", {
                                                    invalid: errors.lastName
                                                })}
                                                error={errors.lastName && {content: errors.lastName}}
                                            />
                                        </Form.Group>

                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                required
                                                icon='user'
                                                iconPosition='left'
                                                label='Username'
                                                placeholder='username'
                                                value={values.userName}
                                                onChange={handleChange('userName')}
                                                className={classnames("", {
                                                    invalid: errors.userName
                                                })}
                                                error={errors.userName && {content: errors.userName}}
                                            />
                                            <Form.Input
                                                required
                                                icon='at'
                                                iconPosition='left'
                                                label='Email'
                                                placeholder='email'
                                                value={values.email}
                                                onChange={handleChange('email')}
                                                className={classnames("", {
                                                    invalid: errors.email
                                                })}
                                                error={errors.email && {content: errors.email}}
                                            />
                                        </Form.Group>

                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                required
                                                icon='lock'
                                                iconPosition='left'
                                                label='Password'
                                                type='password'
                                                placeholder='password'
                                                value={values.password}
                                                onChange={handleChange('password')}
                                                className={classnames("", {
                                                    invalid: errors.password
                                                })}
                                                error={errors.password && {content: errors.password}}
                                            />
                                            <Form.Input
                                                required
                                                icon='lock'
                                                iconPosition='left'
                                                label='Confirm Password'
                                                type='password'
                                                placeholder='password2'
                                                value={values.password2}
                                                onChange={handleChange('password2')}
                                                className={classnames("", {
                                                    invalid: errors.password2
                                                })}
                                                error={errors.password2 && {content: errors.password2}}
                                            />
                                        </Form.Group>

                                        <Button type='submit' primary>Register</Button>
                                    </Form>

                                </Segment>
                            )}
                        </Formik>

                        <Message attached='bottom' color='blue'>
                            Already have an account? <Link to="/login"> LOG IN</Link>
                        </Message>

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {registerUser}
)(withRouter(Register));