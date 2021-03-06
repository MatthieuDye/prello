import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Card, Divider, Icon, Header, Container, Button, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

import {fetchTeams} from "../../actions/teamActions";

class MyTeams extends Component {

    componentDidMount() {
        this.props.fetchTeams(this.props.auth.user._id);
    }

    redirectionTeam = (teamId) => {
        this.props.history.push(`/team/${teamId}`);
    };

    render() {
        return (
            <Container>
                <Divider hidden/>
                <Header as='h2'>
                    <Segment.Inline>
                        <Icon name='users'/>
                        <Header.Content>My Teams</Header.Content>
                        <Link to='/add/team'>
                            <Button primary size='mini' floated='right'>
                                <Icon name='add'/>
                                ADD
                            </Button>
                        </Link>
                    </Segment.Inline>
                </Header>

                <Divider/>
                <Divider hidden/>

                <Card.Group stackable doubling itemsPerRow={4}>
                    {this.props.teams.map(({_id, name, description, members}) => (

                        <Card onClick={() => this.redirectionTeam(_id)} color='blue'>
                            <Card.Content textAlign='center' header={name}/>
                            <Card.Content description={description}/>
                            <Card.Content extra>
                                <Icon name='user'/>
                                {members.length > 1 ? members.length + ' members' : members.length + ' member'}
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
            </Container>
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
