import * as Yup from 'yup';
import { FIELDS_USER } from './const';

const UserSchema = Yup.object().shape({
    [FIELDS_USER.ID]: Yup.string(),
    [FIELDS_USER.NAME]: Yup.string(),
    [FIELDS_USER.EMAIL]: Yup.string().required('Email is required.'),
});
export default UserSchema;
