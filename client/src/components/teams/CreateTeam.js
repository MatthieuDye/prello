import React from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createTeam} from "../../actions/teamActions";
import {Button, Divider, Header, Icon, Label, Input, Form, Grid, Container, TextArea} from "semantic-ui-react";
import {Formik} from 'formik'
import * as Yup from 'yup'

const CreateTeamSchema = Yup.object().shape({
    teamName: Yup.string()
        .required('Team name is required')
});

const CreateTeam = (props) => (

    <Container>

        <Header as='h3'>
            <Icon name='users'/>
            <Header.Content>Create a Team</Header.Content>
        </Header>
        <Divider/>

        <Grid centered textAlign='center' verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 500}}>
                <Formik
                    initialValues={{
                        teamName: '',
                        description: ''
                    }}
                    validationSchema={CreateTeamSchema}
                    onSubmit={values => {
                        const teamData = {
                            name: values.teamName,
                            description: values.description,
                            userId: props.auth.user.id
                        };

                        props.createTeam(teamData, props.history);
                    }}
                >

                    {({handleChange, handleSubmit, values, errors, touched}) => (

                        <Form onSubmit={handleSubmit}>
                            <Form.Field required>
                                <Header as='h4'>Team Name</Header>
                                <Input
                                    placeholder='name'
                                    value={values.teamName}
                                    onChange={handleChange('teamName')}
                                />
                                {errors.teamName && touched.teamName &&
                                <Label basic prompt pointing>
                                    {errors.teamName}
                                </Label>}
                            </Form.Field>

                            <Form.Field>
                                <Header as='h4'>Description</Header>
                                <TextArea
                                    placeholder='enter team description'
                                    value={values.description}
                                    style={{minHeight: 100}}
                                    onChange={handleChange('description')}
                                />
                            </Form.Field>

                            <Button primary onPress={handleSubmit}>
                                Create the Team
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Grid.Column>
        </Grid>
    </Container>
);

CreateTeam.propTypes = {
    createTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    {createTeam}
)(CreateTeam);
