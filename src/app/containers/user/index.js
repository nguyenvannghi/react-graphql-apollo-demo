import React, { useCallback, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createStructuredSelector } from 'reselect';
import { Grid, Box, Form, Button, FormField, TextInput, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import { FormClose, Edit } from 'grommet-icons';
import useForm from 'react-hook-form';
import setFormControlValue from 'app/consts/helper';
import { openToast } from 'app/components/toast/action';
import { STATUS_MESSAGE } from 'app/consts';
import ALL_USER from './graphql/queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from './graphql/mutation';
import { FIELDS_USER } from './const';
import injectReducerSaga from './redux/injectReducerSaga';
import UserSchema from './validators';

const columns = [
    {
        property: 'id',
        label: 'Id',
        dataScope: 'row',
        format: datum => <strong>{datum.id}</strong>,
    },
    {
        property: 'email',
        label: 'Email',
        align: 'left',
    },
    {
        property: 'name',
        label: 'Name',
        align: 'left',
    },
];

const User = ({ openToast }) => {
    injectReducerSaga();
    const [dataUser, setDataUser] = useState(null);
    const { loading, error, data } = useQuery(ALL_USER);
    const [createUser] = useMutation(CREATE_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    const { register, handleSubmit, errors, watch, reset, setValue, getValues } = useForm({
        mode: 'onChange',
        validationSchema: UserSchema,
    });
    const disabledBtn = !!(errors[FIELDS_USER.EMAIL] || !watch()[FIELDS_USER.EMAIL]);

    const fetchData = () => {
        return [
            {
                query: ALL_USER,
                variables: {},
            },
        ];
    };
    const onSubmit = useCallback(
        async data => {
            console.log(data, getValues());
            let action = new Promise(resolve => resolve);
            if (dataUser) {
                delete data.id;
                action = createUser({
                    variables: data,
                    refetchQueries: fetchData(),
                });
            } else {
                action = updateUser({
                    variables: dataUser,
                    refetchQueries: fetchData(),
                });
            }
            try {
                await action.then(data => {
                    console.log(data);
                    openToast(STATUS_MESSAGE.SUCCESS, `Created`);
                    reset();
                });
            } catch (error) {
                openToast(STATUS_MESSAGE.ERROR, 'Error');
            }
        },
        [createUser, dataUser, getValues, openToast, reset, updateUser],
    );

    const onEditItem = useCallback(
        (_event, data) => {
            setDataUser(data);
            console.log(data);
            setFormControlValue(data, UserSchema, setValue);
        },
        [setValue],
    );

    const onRemoveItem = useCallback(
        async (_event, id) => {
            await deleteUser({
                variables: { id: id },
                refetchQueries: fetchData(),
            })
                .then(data => {
                    console.log(data);
                    openToast(STATUS_MESSAGE.SUCCESS, `Deleted: ${id}`);
                })
                .catch(error => {
                    openToast(STATUS_MESSAGE.ERROR, 'Error');
                });
        },
        [deleteUser, openToast],
    );
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <Grid
                areas={[
                    { name: 'form', start: [0, 0], end: [0, 0] },
                    { name: 'list', start: [1, 0], end: [1, 0] },
                ]}
                columns={['large', 'medium']}
                rows={['medium', 'medium']}
                gap="small">
                <div className="user">
                    {data.allUsers && (
                        <Table caption="User Table">
                            <TableHeader>
                                <TableRow>
                                    {columns.map(c => (
                                        <TableCell key={c.property} scope="col" border="bottom" align={c.align}>
                                            <Text>{c.label}</Text>
                                        </TableCell>
                                    ))}
                                    <TableCell key="action" scope="col" border="bottom" align="center">
                                        <Text>Action</Text>
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.allUsers.map(datum => (
                                    <TableRow key={datum.id}>
                                        {columns.map(c => (
                                            <TableCell key={c.property} scope={c.dataScope} align={c.align}>
                                                <Text>{c.format ? c.format(datum) : datum[c.property]}</Text>
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <Button
                                                type="button"
                                                onClick={e => {
                                                    onRemoveItem(e, datum.id);
                                                }}>
                                                <FormClose color="brand" />
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={e => {
                                                    onEditItem(e, datum);
                                                }}>
                                                <Edit color="brand" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <Box
                    border={{ color: 'warning', size: 'large' }}
                    pad="medium"
                    gridArea="list"
                    full="vertical"
                    justify="center"
                    background="brand">
                    <Form onSubmit={handleSubmit(onSubmit)} background="white">
                        <h1>{!dataUser ? 'Create' : 'Edit'} User</h1>
                        <fieldset>
                            <TextInput id="id" name="id" type="hidden" ref={register} />
                            <FormField label="email" error={errors[FIELDS_USER.EMAIL] && errors[FIELDS_USER.EMAIL].message}>
                                <TextInput id="email" name="email" placeholder="type email here" ref={register} />
                            </FormField>
                            <FormField label="name" error={errors[FIELDS_USER.NAME] && errors[FIELDS_USER.NAME].message}>
                                <TextInput id="name" type="name" name="name" placeholder="type name here" ref={register} />
                            </FormField>
                        </fieldset>
                        <Button disabled={disabledBtn} type="submit" label={!dataUser ? 'Create' : 'Edit'} primary />
                        <Button
                            type="reset"
                            label="Reset"
                            onClick={() => {
                                setDataUser(null);
                                reset();
                            }}
                        />
                    </Form>
                </Box>
            </Grid>
        </>
    );
};

User.propTypes = {
    openToast: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => bindActionCreators({ openToast }, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(User);
