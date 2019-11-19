import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button} from "semantic-ui-react";


//________ACTIONS________
import {fetchTeam} from "../../actions/teamActions";

class TeamView extends Component {

    componentDidMount() {
        this.props.fetchTeam(this.props.match.params.teamId);
    }

    redirectionAddTeamMember = (teamId) => {
        this.props.history.push(`/team/${teamId}/add/member`);
    };

    render() {
        return (
           <div>
               team name : {this.props.currentTeam.name}

               <Button onClick={() => this.redirectionAddTeamMember(this.props.currentTeam._id)}>Add a member</Button>
           </div>
        )
    }
}

TeamView.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    fetchTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentTeam: state.currentTeam,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchTeam}
)(TeamView);
