import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser} from "../../actions/authActions";
import {Button, Container, Divider, Form, Grid, Header, Image, Label, List, Message, Segment} from "semantic-ui-react";
import {bindActionCreators} from "redux";
import logoPrello from '../../assets/prello_icon.png';
import logoPolytech from '../../assets/logoPolytech.png';
import logoGoogle from '../../assets/logoGoogle.png';
import {Formik} from "formik";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            url: this.authPolytech()
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/boards");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            //this.props.history.push("/dashboard");
        }

        if (nextProps.errors.message !== undefined) {

            this.setState({
                errors: nextProps.errors.message
            });
        }
    }

    authPolytech = () => {

        let state = Math.random().toString(36).substring(7);
        localStorage.setItem("state", state);

        const clientId = "566e7eb0-0081-4171-9cef-de9e92e84901";
        const redirectUri = encodeURI("http://localhost:3000/loader");
        return `https://oauth.igpolytech.fr/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
    };

    render() {
        const {errors} = this.state;

        return (
            <Container>
                <Divider hidden/>
                <Header as='h3' textAlign='center'>
                    <Image src={logoPrello}/>
                    <Header.Content>Login to Prello</Header.Content>
                </Header>
            <Segment placeholder stackable padded>

                <Grid columns={2} stackable centered textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 350}}>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            onSubmit={values => {

                                const userData = {
                                    email: values.email,
                                    password: values.password
                                };

                                this.props.loginUser(userData, this.props.history);
                            }}
                        >

                            {({handleChange, handleSubmit, values}) => (

                                <Segment>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            icon='user'
                                            iconPosition='left'
                                            label='Email'
                                            placeholder='email'
                                            value={values.email}
                                            onChange={handleChange('email')}
                                            error={errors.email && {content: errors.email}}
                                        />
                                        <Form.Input
                                            icon='lock'
                                            iconPosition='left'
                                            label='Password'
                                            placeholder='password'
                                            type='password'
                                            value={values.password}
                                            onChange={handleChange('password')}
                                            error={errors.password && {content: errors.password}}
                                        />
                                        <Divider hidden/>
                                        <Button type='submit' content='Login' primary fluid/>
                                    </Form>

                                </Segment>
                            )}
                        </Formik>

                        <Message attached='bottom' color='blue'>
                            Don't have an account?
                            {' '}
                            <Label as='a' color='blue' basic>
                                <Link to="/register">REGISTER</Link>
                            </Label>
                        </Message>
                    </Grid.Column>

                    <Grid.Column >
                        <List>
                            <List.Item>
                                <a href={this.state.url}>
                                    <Button fluid>
                                        <Header as='h6'>
                                            <Image src={logoPolytech} size='mini'/>
                                            Login with Polytech
                                        </Header>
                                    </Button>
                                </a>
                            </List.Item>

                            <List.Item>
                                <a href="http://localhost:5000/api/public/user/auth/google">
                                    <Button fluid>
                                        <Header as='h6'>
                                            <Image src={logoGoogle} size='mini'/>
                                            Login with Google
                                        </Header>
                                    </Button>
                                </a>
                            </List.Item>
                        </List>
                    </Grid.Column>

                    <Divider vertical>OR</Divider>

                </Grid>
            </Segment>
            </Container>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
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
    }, dispatch,
);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);