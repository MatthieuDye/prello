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
    Input, TextArea, Form
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

    handleEditing = (e) => {
        this.setState({
            editingMode: !this.state.editingMode
        })
    };

    render() {
        const {activeIndex} = this.state;

        return (
            <Container>
                <Form>
                    <Divider hidden/>
                    <Header as='h2'>
                        <Segment.Inline>
                            <Icon name='users'/>
                            <Header.Content>
                                {this.state.editingMode
                                    ? <Form.Input value='fjkdsfbsdkjhf'/>
                                    : 'Team fjkdsfbsdkjhf' + this.props.currentTeam.name
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
                                placeholder='enter team description'
                                value='la balbekjzlfbljkfbd sf dsklqfhjsldfj'
                            />
                            : 'bla balbekjzlfbljkfbd sf dsklqfhjsldfjk' + this.props.currentTeam.description
                        }
                    </Container>

                    < Divider hidden/>

                    < Grid padded relaxed columns={2} stackable centered>
                        <Grid.Column style={{maxWidth: 400}}>
                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='users'/>
                                    5 Members
                                </Header>
                            </Divider>

                            <AddTeamMember />

                            <List selection relaxed>
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
                                        <List.Header>Alia fdsfsdfsdfsdfdsfsdfdsCHAWAF</List.Header>
                                        <List.Content>alia.chawaf</List.Content>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon name='user' color='grey'/>
                                    <List.Content>
                                        <List.Header>Alia CHAWAF</List.Header>
                                        <List.Content>alia.chfdsdfsfsawaf</List.Content>
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
                </Form>
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
