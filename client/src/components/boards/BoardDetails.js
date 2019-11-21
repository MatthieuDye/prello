import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
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
} from 'semantic-ui-react'
import {fetchBoard, updateMemberRole, deleteTeamMember, updateBoard, deleteBoardMember} from "../../actions/boardActions";
import AddBoardMember from "./AddBoardMember";
import AddBoardTeam from "./AddBoardTeam";

const UpdateBoardSchema = Yup.object().shape({
    boardName: Yup.string()
        .required('Team name is required')
        .max(50, 'Team name should not exceed 50 characters'),
    description: Yup.string()
        .max(1000, 'Description should not exceed 1000 characters')
});

class BoardDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
        };
        this.handleEditing = this.handleEditing.bind(this)
    }

    componentDidMount() {
        this.props.fetchBoard(this.props.match.params.boardId);
    };

    // EDIT HANDLER
    handleEditing = (e) => {
        this.setState({
            editingMode: !this.state.editingMode
        })
    };

    // MEMBER EDIT HANDLERS
    handleMemberRoleChange = (memberID) => {
        const boardID = this.props.currentBoard._id;
        const isAdmin = this.props.currentBoard.admins.includes(memberID);
        this.props.updateMemberRole(memberID, boardID, !isAdmin);
    };

    handleDeleteMember = (memberID) => {
        this.props.deleteBoardMember(memberID, this.props.currentBoard._id);
    };

    // BOARDS
    redirectionTeam = () => {
        const teamID = this.props.currentBoard.team._id;
        this.props.history.push(`/team/${teamID}`);
    };

    redirectionAddBoardMember = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/member`);
    };

    redirectionAddBoardTeam = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/team`);
    };


    render() {
        return (
            <Container>
                <Formik
                    initialValues={{
                        boardName: this.props.currentBoard.name,
                        description: this.props.currentBoard.description
                    }}
                    validationSchema={UpdateBoardSchema}
                    enableReinitialize
                    onSubmit={values => {

                        this.handleEditing();
                        // TODO

                    }}
                >

                    {({handleChange, handleSubmit, values, errors}) => (

                        <Form>
                            <Divider hidden/>
                            <Header as='h2'>
                                <Segment.Inline>
                                    <Icon name='columns'/>
                                    <Header.Content>
                                        {this.props.currentBoard.admins
                                        && this.props.currentBoard.admins.includes(this.props.auth.user._id)
                                        && this.state.editingMode
                                            ? <Form.Input
                                                value={values.boardName}
                                                onChange={handleChange('boardName')}
                                                error={errors.boardName && {content: errors.boardName}}
                                            />
                                            : 'Board ' + this.props.currentBoard.name
                                        }
                                    </Header.Content>
                                    {this.props.currentBoard.admins
                                    && this.props.currentBoard.admins.includes(this.props.auth.user._id)
                                    && (this.state.editingMode
                                            ?
                                            <Button positive size='mini' floated='right' type='submit'
                                                    onClick={handleSubmit}>
                                                <Icon name='check'/>Save
                                            </Button>
                                            :
                                            <Button primary size='mini' floated='right' type='button'
                                                    onClick={this.handleEditing}>
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
                                        placeholder='Enter board description'
                                        value={values.description}
                                        onChange={handleChange('description')}
                                        error={errors.description && {content: errors.description}}
                                    />
                                    : this.props.currentBoard.description ? this.props.currentBoard.description : 'No description yet ...'
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
                                {this.props.guestMembers.length > 1
                                    ? this.props.guestMembers.length + ' Guest Members'
                                    : this.props.guestMembers.length + ' Guest Member'
                                }
                            </Header>
                        </Divider>

                        <Divider hidden/>
                        <AddBoardMember/>
                        <Divider hidden/>

                        <List selection relaxed='very'>
                            {this.props.guestMembers.map(({_id, firstName, lastName, userName}) => (

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
                                                    defaultChecked={this.props.currentBoard.admins.includes(_id)}
                                                    onClick={() => this.handleMemberRoleChange(_id)}
                                                />
                                            }
                                            content="Make admin"
                                            basic
                                        />
                                    </List.Content>
                                    }

                                    <Icon
                                        name={this.props.currentBoard.admins.includes(_id) ? 'user' : 'user outline'}
                                        color={this.props.currentBoard.admins.includes(_id) ? 'red' : 'grey'}/>
                                    <List.Content>
                                        <List.Header>{firstName} {lastName}</List.Header>
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
                                <Icon name='users'/>
                                {this.props.currentBoard.team !== undefined
                                && this.props.currentBoard.team !== ""
                                && this.props.currentBoard.team !== null
                                    ? 'Team ' + this.props.currentBoard.team.name
                                    : 'No Team'
                                }
                            </Header>
                        </Divider>

                        <Divider hidden/>

                        {this.props.currentBoard.team !== undefined
                        && this.props.currentBoard.team !== ""
                        && this.props.currentBoard.team !== null
                            ?
                            (this.state.editingMode
                                    ? <List>
                                    <List.Item>
                                        <AddBoardTeam hasTeam={true}/>
                                    </List.Item>
                                    <List.Item>
                                        <Button floated='right'>
                                            <Icon name='trash' color='red'/>
                                        </Button>
                                    </List.Item>
                                    </List>
                                    : <Card color='blue' fluid link onClick={this.redirectionTeam}>
                                        <Card.Content>
                                            <Card.Header>{this.props.currentBoard.team.name}</Card.Header>
                                        </Card.Content>
                                    </Card>
                            )
                            : <AddBoardTeam hasTeam={false}/>
                        }
                        <Divider hidden/>

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

BoardDetails.propTypes = {
    auth: PropTypes.object.isRequired,
    currentBoard: PropTypes.object.isRequired,
    guestMembers: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    fetchBoard: PropTypes.func.isRequired,
    updateMemberRole: PropTypes.func.isRequired,
    deleteTeamMember: PropTypes.func.isRequired,
    deleteBoardMember: PropTypes.func.isRequired,
    updateBoard: PropTypes.func.isRequired
};

BoardDetails.defaultProps = {
    guestMembers: []
};

const mapStateToProps = state => ({
    auth: state.auth,
    currentBoard: state.currentBoard,
    guestMembers: state.currentBoard.guestMembers,
    errors: state.errors,
    name: state.currentBoard.name
});

export default connect(
    mapStateToProps,
    {fetchBoard, updateMemberRole, deleteTeamMember, deleteBoardMember, updateBoard}
)(BoardDetails);
