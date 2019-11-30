import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createStructuredSelector } from 'reselect';
import { Grid, Box, Form, Button, FormField, TextInput } from 'grommet';
import useForm from 'react-hook-form';
import ALL_USER from './graphql/queries';
import CREATE_USER from './graphql/mutation';
import { FIELDS_USER } from './const';
import injectReducerSaga from './redux/injectReducerSaga';
import SignInSchema from './validators';

const User = () => {
    injectReducerSaga();

    const { register, handleSubmit, errors, watch, reset } = useForm({ mode: 'onChange', validationSchema: SignInSchema });

    const { loading, error, data } = useQuery(ALL_USER);
    const [createUser] = useMutation(CREATE_USER);
    const onSubmit = useCallback(
        async data => {
            await createUser({
                variables: data,
                refetchQueries: () => {
                    return [
                        {
                            query: ALL_USER,
                            variables: {},
                        },
                    ];
                },
            });
            reset();
        },
        [createUser, reset],
    );

    const disabledBtn = !!(errors[FIELDS_USER.EMAIL] || !watch()[FIELDS_USER.EMAIL]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <Grid
                areas={[
                    { name: 'form', start: [0, 0], end: [0, 0] },
                    { name: 'list', start: [1, 0], end: [1, 0] },
                ]}
                columns={['medium', 'medium']}
                rows={['medium', 'medium']}
                gap="small">
                <Box gridArea="form" full="vertical" justify="center" background="brand">
                    <div className="user">
                        <ul>
                            {data.allUsers &&
                                data.allUsers.map(({ id, name, email }, index) => (
                                    <li key={index}>
                                        {index} : {name} - {email}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </Box>
                <Box gridArea="list" full="vertical" justify="center" background="brand">
                    <Form onSubmit={handleSubmit(onSubmit)} background="white">
                        <h1>Create User</h1>
                        <fieldset>
                            <p>blah blah</p>
                            <FormField label="email" error={errors[FIELDS_USER.EMAIL] && errors[FIELDS_USER.EMAIL].message}>
                                <TextInput id="email" name="email" placeholder="type email here" ref={register} />
                            </FormField>
                            <FormField label="name" error={errors[FIELDS_USER.NAME] && errors[FIELDS_USER.NAME].message}>
                                <TextInput id="name" type="name" name="name" placeholder="type name here" ref={register} />
                            </FormField>
                        </fieldset>
                        <Button disabled={disabledBtn} type="submit" label="Create" primary />
                    </Form>
                </Box>
            </Grid>
        </>
    );
};

User.propTypes = {
    userCall: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(User);
