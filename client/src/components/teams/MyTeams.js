import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {ListGroup, ListGroupItem} from 'react-bootstrap';


class MyTeams extends Component {

    redirectionTeam = (teamId) => {
        this.props.history.push(`/team/${teamId}/add`);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>My Teams</h3>
                <p>Insert code</p>
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

};

const mapStateToProps = state => ({
    teams: state.teams,
});

export default connect(
    mapStateToProps
)(MyTeams);
