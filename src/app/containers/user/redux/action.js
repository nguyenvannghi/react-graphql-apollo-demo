import * as nameConsts from '../const';

const userCall = data => ({ type: nameConsts.CREATE_USER_CALL, data });
const userSuccess = () => ({ type: nameConsts.CREATE_USER_SUCCESS });
const userFailed = () => ({ type: nameConsts.CREATE_USER_FAILED });
export { userCall, userSuccess, userFailed };
