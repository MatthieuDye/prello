import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Container, Divider, Form, Grid, Header, Icon, List, Segment} from "semantic-ui-react";
//________ACTIONS________
import {fetchTeam} from "../../actions/teamActions";
import AddTeamMember from "./AddTeamMember";

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

    render() {
        return (
            <Container>
                <Form>
                    <Divider hidden/>
                    <Header as='h2'>
                        <Segment.Inline>
                            <Icon name='users'/>
                            <Header.Content>
                                {this.state.editingMode
                                    ? <Form.Input value={this.props.currentTeam.name}/>
                                    : 'Team ' + this.props.currentTeam.name
                                }
                            </Header.Content>
                            {this.state.editingMode
                                ? <Button color='green' size='mini' floated='right' onClick={this.handleEditing}>
                                    <Icon name='check'/>SAVE
                                </Button>
                                : <Button primary size='mini' floated='right' onClick={this.handleEditing}>
                                    <Icon name='edit'/>EDIT
                                </Button>
                            }

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
                            <AddTeamMember/>
                            <Divider hidden/>

                            <List selection relaxed>
                                {this.props.members.map(({_id, firstName, lastName, userName}) => (

                                    <List.Item>
                                        <Icon
                                            name={this.props.currentTeam.admins.includes(_id) ? 'user' : 'user outline'}
                                            color={this.props.currentTeam.admins.includes(_id) ? 'red' : 'grey'}/>
                                        <List.Content>
                                            <List.Header>{firstName} {lastName.toUpperCase()}</List.Header>
                                            <List.Content>{userName}</List.Content>
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
    {fetchTeam}
)(TeamView);
