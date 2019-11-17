import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Card, Divider, Icon, Header, Container, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

class MyTeams extends Component {

    redirectionTeam = (id) => {
        this.props.history.push(`/team/addMembers/${id}`);
    };

    render() {
        return (
            <Container>
                <Header as='h3'>
                    <Icon name='users'/>
                    <Header.Content>My Teams</Header.Content>
                    <Link to='/team/create'>
                        <Button primary size='mini' floated='right'>
                            <Icon name='add'/>
                            ADD
                        </Button>
                    </Link>
                </Header>
                <Divider />
                <Card.Group stackable doubling itemsPerRow={4}>
                    {this.props.teams.map(({_id, name, description, members}) => (

                        <Card>
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

};

const mapStateToProps = state => ({
    teams: state.teams,
});

export default connect(
    mapStateToProps
)(MyTeams);
