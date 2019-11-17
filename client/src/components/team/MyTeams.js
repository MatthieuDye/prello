import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {bindActionCreators} from "redux";

import {fetchTeams} from "../../actions/teamActions";


class MyTeams extends Component {

    componentDidMount() {
        this.props.fetchTeams(this.props.auth.user.id);
    }

    redirectionTeam = (id) => {
        this.props.history.push(`/team/addMembers/${id}`);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>My Teams</h3>
                <ListGroup>
                    {this.props.teams.map(({_id, name, description}) => (


                        <ListGroupItem
                            key={_id}
                            className="ListMenu"
                            onClick={() => this.redirectionTeam(_id)}
                            action
                        >

                            <h3>{name}</h3>

                        </ListGroupItem>

                    ))}

                </ListGroup>
            </div>
        )
    }
}

MyTeams.propTypes = {
    teams: PropTypes.array.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    teams: state.teams,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchTeams}
)(MyTeams);
