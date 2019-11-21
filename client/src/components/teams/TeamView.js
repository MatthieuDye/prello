import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Card, Checkbox, Container, Divider, Form, Grid, Header, Icon, List, Segment} from "semantic-ui-react";
//________ACTIONS________
import {fetchTeam} from "../../actions/teamActions";
import AddTeamMember from "./AddTeamMember";
import {updateMemberRole} from "../../actions/teamActions";

class TeamView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
        };
        this.handleEditing = this.handleEditing.bind(this)
    }

    componentDidMount() {
        this.props.fetchTeam(this.props.match.params.teamId);
    }

    handleEditing = (e) => {
        this.setState({
            editingMode: !this.state.editingMode
        })
    };

    handleMemberRoleChange = (memberID) => {
        const userID = this.props.auth.user.id;
        const teamID = this.props.currentTeam._id;
        const isAdmin = this.props.currentTeam.admins.includes(memberID);
        this.props.updateMemberRole(userID, teamID, !isAdmin);
    };

    redirectionBoard = (boardId) => {
        this.props.history.push(`/board/${boardId}`);
    };

    render() {
        return (
            <Container>
                <Form>
                    <Divider hidden/>
                    <Header as='h2'>
                        <Segment.Inline>
                            <Icon name='users'/>
                            <Header.Content>
                                {this.props.currentTeam.admins
                                && this.props.currentTeam.admins.includes(this.props.auth.user.id)
                                && this.state.editingMode
                                    ? <Form.Input value={this.props.currentTeam.name}/>
                                    : 'Team ' + this.props.currentTeam.name
                                }
                            </Header.Content>
                            {this.props.currentTeam.admins
                            && this.props.currentTeam.admins.includes(this.props.auth.user.id)
                            && (this.state.editingMode
                                ? <Button.Group size='mini' floated='right'>
                                    <Button onClick={this.handleEditing}>Cancel</Button>
                                    <Button.Or/>
                                    <Button positive onClick={this.handleEditing}>Save</Button>
                                </Button.Group>
                                : <Button primary size='mini' floated='right' onClick={this.handleEditing}>
                                    <Icon name='edit'/>Edit
                                </Button>
                            )}

                        </Segment.Inline>
                    </Header>

                    <Divider/>
                    <Divider hidden/>

                    <Container>
                        <Header fluid as='h4'>Description</Header>
                        {this.state.editingMode
                            ?
                            <Form.TextArea
                                rows={4}
                                placeholder='Enter team description'
                                value={this.props.currentTeam.description}
                            />
                            : this.props.currentTeam.description ? this.props.currentTeam.description : 'No description yet ...'
                        }
                    </Container>

                    < Divider hidden/>

                    < Grid padded relaxed columns={2} stackable centered>
                        <Grid.Column style={{maxWidth: 400}}>
                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='users'/>
                                    {this.props.members.length > 1
                                        ? this.props.members.length + ' Members'
                                        : this.props.members.length + ' Member'
                                    }
                                </Header>
                            </Divider>

                            <Divider hidden/>
                            {this.props.currentTeam.admins
                            && this.props.currentTeam.admins.includes(this.props.auth.user.id)
                            && <AddTeamMember/>
                            }
                            <Divider hidden/>

                            <List selection relaxed='very'>
                                {this.props.members.map(({_id, firstName, lastName, userName}) => (

                                    <List.Item>
                                        {this.state.editingMode && this.props.auth.user.id !== _id &&
                                        <List.Content floated='right' verticalAlign='middle'>
                                            <Icon color='red' name='trash' link/>
                                            <Checkbox
                                                fitted slider
                                                label='admin'
                                                defaultChecked={this.props.currentTeam.admins.includes(_id)}
                                                onClick={() => this.handleMemberRoleChange(_id)}
                                            />
                                        </List.Content>
                                        }
                                        <Icon
                                            name={this.props.currentTeam.admins.includes(_id) ? 'user' : 'user outline'}
                                            color={this.props.currentTeam.admins.includes(_id) ? 'red' : 'grey'}/>
                                        <List.Content>
                                            <List.Header>{firstName} {lastName.toUpperCase()}</List.Header>
                                            <List.Content>
                                                {userName}
                                            </List.Content>
                                        </List.Content>
                                    </List.Item>
                                ))}
                            </List>
                        </Grid.Column>

                        <Grid.Column style={{maxWidth: 70}}>
                        </Grid.Column>

                        <Grid.Column style={{maxWidth: 400}}>
                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='columns'/>
                                    {this.props.boards.length > 1
                                        ? this.props.boards.length + ' Boards'
                                        : this.props.boards.length + ' Board'
                                    }
                                </Header>
                            </Divider>

                            <Divider hidden/>

                            <List selection relaxed='very'>
                                {this.props.boards.map(({_id, name}) => (
                                    <Card.Group>
                                        <Card fluid color='blue' header={name} link onClick={() => this.redirectionBoard(_id)}/>
                                    </Card.Group>
                                ))}
                            </List>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Container>
        )
    }
}

TeamView.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    fetchTeam: PropTypes.func.isRequired,
    updateMemberRole: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
    boards: PropTypes.array.isRequired
};

TeamView.defaultProps = {
    members: [],
    boards: []
};

const mapStateToProps = state => ({
    currentTeam: state.currentTeam,
    auth: state.auth,
    members: state.currentTeam.members,
    boards: state.currentTeam.boards
});

export default connect(
    mapStateToProps,
    {fetchTeam, updateMemberRole}
)(TeamView);
