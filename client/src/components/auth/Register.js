import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser} from "../../actions/authActions";
import {Formik} from "formik";
import {Button, Container, Divider, Form, Grid, Header, Image, Label, Message, Segment} from "semantic-ui-react";
import logo from '../../assets/prello_icon.png'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/boards");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors.message !== undefined) {
            this.setState({
                errors: nextProps.errors.message
            });
        }
    }

    render() {
        const {errors} = this.state;

        return (
            <Container>

                <Grid centered textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 700}}>
                        <Divider hidden/>
                        <Header as='h3' textAlign='center'>
                            <Image src={logo}/>
                            <Header.Content>Register to Prello</Header.Content>
                        </Header>
                        <Divider hidden/>
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                userName: '',
                                email: '',
                                password: '',
                                password2: ''
                            }}
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

                            {({handleChange, handleSubmit, values}) => (

                                <Segment>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group widths='equal'>
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
                                        </Form.Group>

                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                icon='user'
                                                iconPosition='left'
                                                label='Username'
                                                placeholder='username'
                                                value={values.userName}
                                                onChange={handleChange('userName')}
                                                error={errors.userName && {content: errors.userName}}
                                            />
                                            <Form.Input
                                                icon='at'
                                                iconPosition='left'
                                                label='Email'
                                                placeholder='email'
                                                value={values.email}
                                                onChange={handleChange('email')}
                                                error={errors.email && {content: errors.email}}
                                            />
                                        </Form.Group>

                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                icon='lock'
                                                iconPosition='left'
                                                label='Password'
                                                type='password'
                                                placeholder='password'
                                                value={values.password}
                                                onChange={handleChange('password')}
                                                error={errors.password && {content: errors.password}}
                                            />
                                            <Form.Input
                                                icon='lock'
                                                iconPosition='left'
                                                label='Confirm Password'
                                                type='password'
                                                placeholder='password confirmation'
                                                value={values.password2}
                                                onChange={handleChange('password2')}
                                                error={errors.password2 && {content: errors.password2}}
                                            />
                                        </Form.Group>

                                        <Button type='submit' content='Register' primary />
                                    </Form>

                                </Segment>
                            )}
                        </Formik>

                        <Message attached='bottom' color='blue'>
                            Already have an account?
                            {' '}
                            <Label as='a' color='blue' basic>
                                <Link to="/login"> LOG IN</Link>
                            </Label>

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