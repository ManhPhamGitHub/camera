import * as moment from 'moment';

export const formatErrorResponse = (code: any, msg: any, data: any = null) => {
  return {
    status: 0,
    error: code,
    msg: msg,
    currentTime: moment().toISOString(),
    data: data,
  };
};

export const formatSuccessResponse = (
  code: any,
  msg: any,
  data: any = null,
) => {
  return {
    status: 1,
    error: code,
    msg: msg,
    currentTime: moment().toISOString(),
    data: data,
  };
};
