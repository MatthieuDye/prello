import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {loginGoogleUser, loginPolytechUser} from "../../actions/authActions";
import {connect} from "react-redux";
import {Container, Dimmer, Image, Loader} from "semantic-ui-react";
import logo from '../../assets/prello_logo.png';


class LoaderAuth extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard

        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/boards");
        }

        if (this.props.location.search) {

            const params = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => {
                params[key] = value;
            });

            //callback of polytech auth
            if (params.state !== undefined && (params.state === localStorage.getItem("state"))) {
                const data = {client_id: "566e7eb0-0081-4171-9cef-de9e92e84901", code: params.code};
                axios
                    .post("https://oauth.igpolytech.fr/token", data)
                    .then(res => this.props.loginPolytechUser(res.data.access_token, this.props.history));
            }

            //last step for google and polytech auth
            if (params.token !== undefined) {
                this.props.loginGoogleUser("Bearer ".concat(params.token.replace("#", "")), this.props.history)
            }
        }
    }

    render() {
        return (<Container>
            <Dimmer active inverted>
                <Image src={logo} />
                <Loader inline='centered' size='massive'> Redirecting </Loader>
            </Dimmer>
        </Container>)
    }
}

LoaderAuth.propTypes = {
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
        loginGoogleUser,
        loginPolytechUser
    }, dispatch,
);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoaderAuth);