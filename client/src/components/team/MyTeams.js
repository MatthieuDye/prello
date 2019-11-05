import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";




class MyTeams extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>My Teams</h3>
                <div className="teamsList">
                    {this.props.teams.map(({id, name, description}) => (
                        <div className="fosfo" key={id}> {name} : {description} </div>
                    ))}
                </div>
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
