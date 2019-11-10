import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {ListGroup, ListGroupItem} from 'reactstrap';


class MyTeams extends Component {

    redirectionTeam = (id) => {
        this.props.history.push(`/team/addMembers/${id}`);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>My Teams</h3>
                <ListGroup>
                    {this.props.teams.map(({_id, name, description}) => (


                        <ListGroupItem key={_id} className="ListMenu" tag="a" onClick={() => this.redirectionTeam(_id)}
                                       action>{name} : {description}

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
