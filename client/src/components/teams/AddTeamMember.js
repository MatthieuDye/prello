import React, { Component } from 'react';
import Autocomplete from  'react-autocomplete';
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class AddTeamMember extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            value: '',
            users: [{name: "Rémi"}],
            team: this.props.teams.filter(t => t._id === this.props.match.params.teamId)[0]
        };
    }

    render() {
        return (
            <div style = {{ marginTop: 40, marginLeft: 50 }}>
                <div>
                team : {this.state.team.name}
                </div>
                <Autocomplete
                    inputProps={{ id: 'states-autocomplete' }}
                    wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                    value={this.state.value}
                    items={this.state.users}
                    getItemValue={(item) => item.name}
                    onSelect={(value, item) => {
                        // set the menu to only the selected item
                        this.setState({ value, users: [ item ] })
                        // or you could reset it to a default list again
                        // this.setState({ unitedStates: getStates() })
                    }}
                    onChange={(event, value) => {
                        this.setState({ value });
                        clearTimeout(this.requestTimer);
                        this.requestTimer =  axios
                            .post("/api/users/findByBeginName", this.state.value)
                            .then(res => this.setState({ users: res.data.users }))
                    }}
                    renderMenu={children => (
                        <div className="menu">
                            {children}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) => (
                        <div
                            className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                            //key={item.abbr}
                        >{item.name}</div>
                    )}
                />
            </div>
        );
    }
}

AddTeamMember.propTypes = {
    teams: PropTypes.array.isRequired,

};

const mapStateToProps = state => ({
    teams: state.teams,
});

export default connect(
    mapStateToProps
)(AddTeamMember);
