import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AddTeamMember from "./AddTeamMember";

import {Formik} from "formik";
import * as Yup from "yup";
import {
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    List,
    Popup,
    Segment
} from "semantic-ui-react";
//________ACTIONS________
import {deleteMember, fetchTeam, updateMemberRole, updateTeam} from "../../actions/teamActions";

const UpdateTeamSchema = Yup.object().shape({
    teamName: Yup.string()
        .required('Team name is required')
        .max(50, 'Team name should not exceed 50 characters'),
    description: Yup.string()
        .max(1000, 'Description should not exceed 1000 characters')
});

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

    // EDIT HANDLER
    handleEditing = (e) => {
        this.setState({
            editingMode: !this.state.editingMode
        })
    };

    // MEMBER EDIT HANDLERS
    handleMemberRoleChange = (memberID) => {
        const teamID = this.props.currentTeam._id;
        const isAdmin = this.props.currentTeam.admins.includes(memberID);
        this.props.updateMemberRole(memberID, teamID, !isAdmin);
    };

    handleDeleteMember = (memberID) => {
        this.props.deleteMember(memberID, this.props.currentTeam._id);
    };

    // BOARDS
    redirectionBoard = (boardId) => {
        this.props.history.push(`/board/${boardId}`);
    };

    render() {
        return (
            <Container>
                <Formik
                    initialValues={{
                        teamName: this.props.currentTeam.name,
                        description: this.props.currentTeam.description
                    }}
                    enableReinitialize
                    validationSchema={UpdateTeamSchema}
                    onSubmit={values => {

                        const teamData = {
                            name: values.teamName,
                            description: values.description,
                        };

                        this.handleEditing();
                        const teamID = this.props.currentTeam._id;

                        this.props.updateTeam(teamID, teamData)
                    }}
                >

                    {({handleChange, handleSubmit, values, errors}) => (

                        <Form>
                            <Divider hidden/>
                            <Header as='h2'>
                                <Segment.Inline>
                                    <Icon name='users'/>
                                    <Header.Content>
                                        {this.props.currentTeam.admins
                                        && this.props.currentTeam.admins.includes(this.props.auth.user._id)
                                        && this.state.editingMode
                                            ? <Form.Input
                                                value={values.teamName}
                                                onChange={handleChange('teamName')}
                                                error={errors.teamName && {content: errors.teamName}}
                                            />
                                            : 'Team ' + this.props.currentTeam.name
                                        }
                                    </Header.Content>
                                    {this.props.currentTeam.admins
                                    && this.props.currentTeam.admins.includes(this.props.auth.user._id)
                                    && (this.state.editingMode
                                            ?
                                            <Button positive size='mini' floated='right' type='submit' onClick={handleSubmit}>
                                                <Icon name='check'/>Save
                                            </Button>
                                            :
                                            <Button primary size='mini' floated='right' type='button' onClick={this.handleEditing}>
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
                                        value={values.description}
                                        onChange={handleChange('description')}
                                        error={errors.description && {content: errors.description}}

                                    />
                                    : this.props.currentTeam.description ? this.props.currentTeam.description : 'No description yet ...'
                                }
                            </Container>
                        </Form>
                    )}
                </Formik>
                <Divider hidden/>

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
                        && this.props.currentTeam.admins.includes(this.props.auth.user._id)
                        && <AddTeamMember/>
                        }
                        <Divider hidden/>

                        <List selection relaxed='very'>
                            {this.props.members.map(({_id, firstName, lastName, userName}) => (

                                <List.Item>
                                    {this.state.editingMode && this.props.auth.user._id !== _id &&
                                    <List.Content floated='right' verticalAlign='middle'>
                                        <Icon color='red' name='trash' link
                                              onClick={() => this.handleDeleteMember(_id)}/>
                                    </List.Content>
                                    }

                                    {this.state.editingMode && this.props.auth.user._id !== _id &&
                                    <List.Content floated='right' verticalAlign='middle'>
                                        <Popup
                                            trigger={
                                                <Checkbox
                                                    fitted slider
                                                    defaultChecked={this.props.currentTeam.admins.includes(_id)}
                                                    onClick={() => this.handleMemberRoleChange(_id)}
                                                />
                                            }
                                            content="Make admin"
                                            basic
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
                                    <Card fluid color='blue' header={name} link
                                          onClick={() => this.redirectionBoard(_id)}/>
                                </Card.Group>
                            ))}
                        </List>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

TeamView.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    fetchTeam: PropTypes.func.isRequired,
    updateTeam: PropTypes.func.isRequired,
    deleteMember: PropTypes.func.isRequired,
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
    {fetchTeam, updateMemberRole, deleteMember, updateTeam}
)(TeamView);
