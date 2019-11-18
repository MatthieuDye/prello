import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Card, Divider, Icon, Header, Container, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

class MyBoards extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <Container>
        <Header as='h2'>
          <Icon name='columns' />
          <Header.Content>My Boards</Header.Content>
          <Link to='/add/board'>
            <Button primary size='mini' floated='right'>
              <Icon name='add' />
              ADD
                    </Button>
          </Link>
        </Header>

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='heart' />
            Favorite boards
      </Header>
        </Divider>
        <Card.Group stackable doubling itemsPerRow={4}>
          <Card>
            <Card.Content textAlign='center' header="Board 1" />
            <Card.Content description="Description for board 1" />
            <Card.Content extra>
              <Icon name='heart' />
            </Card.Content>
          </Card>
          <Card>
            <Card.Content textAlign='center' header="Board 2" />
            <Card.Content description="Description for board 2" />
            <Card.Content extra>
              <Icon name='heart' />
            </Card.Content>
          </Card>
        </Card.Group>

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='user' />
            Personal boards
      </Header>
        </Divider>
        <Card.Group stackable doubling itemsPerRow={4}>
          <Card>
            <Card.Content textAlign='center' header="Board 1" />
            <Card.Content description="Description for board 1" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
          <Card>
            <Card.Content textAlign='center' header="Board 2" />
            <Card.Content description="Description for board 2" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
          <Card>
            <Card.Content textAlign='center' header="Board 3" />
            <Card.Content description="Description for board 3" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
        </Card.Group>

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='users' />
            Team 1 boards
      </Header>
        </Divider>
        <Card.Group stackable doubling itemsPerRow={4}>
          <Card>
            <Card.Content textAlign='center' header="Board 1" />
            <Card.Content description="Description for board 1" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
        </Card.Group>

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='users' />
            Team 2 boards
      </Header>
        </Divider>
        <Card.Group stackable doubling itemsPerRow={4}>
          <Card>
            <Card.Content textAlign='center' header="Board 1" />
            <Card.Content description="Description for board 1" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
          <Card>
            <Card.Content textAlign='center' header="Board 2" />
            <Card.Content description="Description for board 2" />
            <Card.Content extra>
              <Icon name='heart outline' />
            </Card.Content>
          </Card>
        </Card.Group>

      </Container>
    );
  }
}

MyBoards.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  //auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  //auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(MyBoards);