import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createBoard } from "../../actions/boardActions";
import {Button, Divider, Header, Icon, Label, Input, Form, Grid, Container, TextArea} from "semantic-ui-react";
import {Formik} from 'formik'
import * as Yup from 'yup'

const CreateBoardSchema = Yup.object().shape({
    boardName: Yup.string()
        .required('Board name is required')
});

const CreateBoard = (props) => (

    <Container>

        <Header as='h3'>
            <Icon name='columns'/>
            <Header.Content>Create a Board</Header.Content>
        </Header>
        <Divider/>

        <Grid centered textAlign='center' verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 500}}>
                <Formik
                    initialValues={{
                        boardName: '',
                        description: ''
                    }}
                    validationSchema={CreateBoardSchema}
                    onSubmit={values => {
                        const boardData = {
                            name: values.boardName,
                            description: values.description,
                            userId: props.auth.user.id
                        };

                        props.createBoard(boardData, props.history);
                    }}
                >

                    {({handleChange, handleSubmit, values, errors, touched}) => (

                        <Form onSubmit={handleSubmit}>
                            <Form.Field required>
                                <Header as='h4'>Board Name</Header>
                                <Input
                                    placeholder='name'
                                    value={values.boardName}
                                    onChange={handleChange('boardName')}
                                />
                                {errors.boardName && touched.boardName &&
                                <Label basic prompt pointing>
                                    {errors.boardName}
                                </Label>}
                            </Form.Field>

                            <Form.Field>
                                <Header as='h4'>Description</Header>
                                <TextArea
                                    placeholder='enter board description'
                                    value={values.description}
                                    style={{minHeight: 100}}
                                    onChange={handleChange('description')}
                                />
                            </Form.Field>

                            <Button primary onPress={handleSubmit}>
                                Create the Board
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Grid.Column>
        </Grid>
    </Container>
);

CreateBoard.propTypes = {
    createBoard: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { createBoard }
)(CreateBoard);