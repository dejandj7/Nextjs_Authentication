import FILE from './constants';

const deleteFileRequest = (fileInfo) => ({
  type: FILE.DELETE_FILE_REQUEST,
  fileInfo
});

const deleteFileSuccess = (status) => ({
  type: FILE.DELETE_FILE_SUCCESS,
  status
});

const deleteFileError = (error) => ({
  type: FILE.DELETE_FILE_ERROR,
  error
});

export {
  deleteFileRequest,
  deleteFileSuccess,
  deleteFileError,
};
