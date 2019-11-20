import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    List,
    Message,
    Segment,
    Accordion,
    Input
} from "semantic-ui-react";


//________ACTIONS________
import {fetchTeam} from "../../actions/teamActions";
import {Link} from "react-router-dom";
import AddTeamMember from "./AddTeamMember";

class TeamView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            activeIndex: 0
        };
        this.handleEditing = this.handleEditing.bind(this)
    }

    componentDidMount() {
        this.props.fetchTeam(this.props.match.params.teamId);
    }

    redirectionAddTeamMember = (teamId) => {
        this.props.history.push(`/team/${teamId}/add`);
    };

    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex})
    };

    handleEditing = (e) => {
        this.setState({
            editingMode: !this.state.editingMode
        })
    };

    render() {
        const {activeIndex} = this.state;

        return (
            <Container>

                <Button onClick={() => this.redirectionAddTeamMember(this.props.currentTeam._id)}>Add a member</Button>

                <Header as='h2'>
                    <Icon name='users'/>
                    <Header.Content>

                        {this.state.editingMode
                            ? <Input size='mini' value='kjdshfkjsdhfs'/>
                            : 'Team fjkdsfbsdkjhf' + this.props.currentTeam.name
                        }
                    </Header.Content>
                    <Button primary size='mini' floated='right' onClick={this.handleEditing}>
                        <Icon name='edit'/>
                        EDIT
                    </Button>
                </Header>
                <br/>
                <Divider/>
                <Container>
                    <Header as='h4'>Description</Header>
                    <p>bla balbekjzlfbljkfbd sf dsklqfhjsldfjk</p>
                </Container>

                <Divider hidden/>

                <Grid padded relaxed columns={2} stackable centered textAlign='center'>
                    <Grid.Column style={{maxWidth: 400}}>
                        <Divider horizontal>
                            <Header as='h4'>
                                <Icon name='users'/>
                                5 Members
                            </Header>
                        </Divider>

                        <AddTeamMember />

                        <Accordion>
                            <Accordion.Title active={activeIndex === 0}
                                             index={0}
                                             onClick={this.handleClick}>
                                <Icon name='dropdown'/>
                                5 members
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <List relaxed>
                                    <List.Item>
                                        <Icon name='user' color='grey'/>
                                        <List.Content>
                                            <List.Header>Alia CHAWAF</List.Header>
                                            <List.Content>alia.chawaf</List.Content>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name='user outline' color='blue'/>
                                        <List.Content>
                                            <List.Header>Alia CHAWAF</List.Header>
                                            <List.Content>alia.chawaf</List.Content>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name='user' color='grey'/>
                                        <List.Content>
                                            <List.Header>Alia CHAWAF</List.Header>
                                            <List.Content>alia.chawaf</List.Content>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name='user' color='grey'/>
                                        <List.Content>
                                            <List.Header>Alia CHAWAF</List.Header>
                                            <List.Content>alia.chawaf</List.Content>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                    <Grid.Column style={{maxWidth: 70}}>
                    </Grid.Column>
                    <Grid.Column style={{maxWidth: 400}}>
                        <Divider horizontal>
                            <Header as='h4'>
                                <Icon name='columns'/>
                                5 Boards
                            </Header>
                        </Divider>
                    </Grid.Column>
                </Grid>

            </Container>
        )
    }
}

TeamView.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    fetchTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentTeam: state.currentTeam,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchTeam}
)(TeamView);
