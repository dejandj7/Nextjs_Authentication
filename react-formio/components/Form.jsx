import {cloneDeep} from 'lodash/lang';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter2';
import _isEqual from 'lodash/isEqual';
import {Formio} from 'formiojs';
import { fetchPostApi, fetchGetApi, fetchDeleteApi } from '../../redux/fetchHelper';
const FormioForm = Formio.Form;

Formio.prototype.deleteFile = async function (fileInfo) {
  if (fileInfo.storage === "url" && fileInfo.url) {
    var urlLocal = `${process.env.NEXT_PUBLIC_API_URL}/document/delete/${fileInfo.data.libraryGuid}/${fileInfo.data.driveId}/${fileInfo.data.title}`;
    fetchDeleteApi(urlLocal, options)
      .then((response) => {
        if (response.status > 400) {
          throw new Error(response.statusText);
        }
        return response.status;
      })
      .catch((e) => {
        throw e;
      });
  }
};

Formio.prototype.uploadFile = async function (
  storage,
  file,
  fileName,
  dir,
  progressCallback,
  url,
  options,
  fileKey
) {
  if (storage === "url") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dir", dir);
    formData.append("fileName", fileName);

    const optionsLocal = {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Remove 'Content-Type' header to allow browser to add
    // along with the correct 'boundary'
    delete optionsLocal.headers["Content-Type"];

    var responseJson = null;

    await fetchPostApi(
      `${process.env.NEXT_PUBLIC_API_URL}/document/uploadother`,
      formData,
      true,
      null
    )
      .then((response) => {
        if (response.status > 400) {
          throw new Error(response.statusText);
        }
        responseJson = response.data;
      })
      .catch((e) => {
        console.error(e);
      });

      return responseJson;
  }
};

Formio.prototype.downloadFile = async function (file) {
  fetchGetApi(
    `${process.env.NEXT_PUBLIC_API_URL}/document/getdocumentfromsps?url=${file.url}&mediaType=${file.type}`
  )
    .then((response) => response.json())
    // Update image
    .then((body) => {
      var link = document.createElement("a");
      link.href = `data:${file.type};base64,` + body.fileContents;
      link.download = file.originalName;
      link.click();
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err);
    });
};

Formio.prototype.request = async function (url) {
  if (url.toString().includes(process.env.NEXT_PUBLIC_API_URL)) {
    fetchGetApi(url)
      .then(() => {})
      .catch(() => {});
  } else {
    axios
      .get(urlLocal)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error("FormIO GET error " + error);
      });
  }
};

/**
 * @param {FormProps} props
 * @returns {JSX.Element}
 */
 const Form = (props) => {
  let instance;
  let createPromise;
  let element;
  const [formio, setFormio] = useState(undefined);
  const jsonForm = useRef(undefined);

  useEffect(() => () => formio ? formio.destroy(true) : null, [formio]);

  const createWebformInstance = (srcOrForm) => {
    const {options = {}, formioform, formReady} = props;
    instance = new (formioform || FormioForm)(element, srcOrForm, options);
    createPromise = instance.ready.then(formioInstance => {
      setFormio(formioInstance);
      if (formReady) {
        formReady(formioInstance);
      }
    });

    return createPromise;
  };

  const onAnyEvent = (event, ...args) => {
     if (event.startsWith('formio.')) {
      const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
       // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty(funcName) && typeof (props[funcName]) === 'function') {
        props[funcName](...args);
      }
    }
  };

  const initializeFormio = () => {
    const {submission} = props;
    if (createPromise) {
      instance.onAny(onAnyEvent);
      createPromise.then(() => {
        if (formio && submission) {
          formio.submission = submission;
        }
      });
    }
  };

  useEffect(() => {
    const {src} = props;
    if (src) {
      createWebformInstance(src).then(() => {
        if (formio) {
          formio.src = src;
        }
      });
      initializeFormio();
    }
  }, [props.src]);

  useEffect(() => {
    const {form, url} = props;
    // eslint-disable-next-line no-undef
    if (form && !_isEqual(form, jsonForm.current)) {
        jsonForm.current = cloneDeep(form);
      createWebformInstance(form).then(() => {
      if (formio) {
        formio.form = form;
        if (url) {
          formio.url = url;
        }
        return formio;
      }
      });
      initializeFormio();
    }
  }, [props.form]);

  useEffect(() => {
    const {options = {}} = props;
    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }
  }, [props.options]);

  useEffect(() => {
    const {submission} = props;
    if (formio && submission && !_isEqual(formio.submission.data, submission.data)) {
      formio.submission = submission;
    }
  }, [props.submission, formio]);

  return <div ref={el => element = el} />;
};

/**
 * @typedef {object} Options
 * @property {boolean} [readOnly]
 * @property {boolean} [noAlerts]
 * @property {object} [i18n]
 * @property {string} [template]
 * @property {boolean} [saveDraft]
 */

/**
 * @typedef {object} FormProps
 * @property {string} [src]
 * @property {string} [url]
 * @property {object} [form]
 * @property {object} [submission]
 * @property {Options} [options]
 * @property {function} [onPrevPage]
 * @property {function} [onNextPage]
 * @property {function} [onCancel]
 * @property {function} [onChange]
 * @property {function} [onCustomEvent]
 * @property {function} [onComponentChange]
 * @property {function} [onSubmit]
 * @property {function} [onSubmitDone]
 * @property {function} [onFormLoad]
 * @property {function} [onError]
 * @property {function} [onRender]
 * @property {function} [onAttach]
 * @property {function} [onBuild]
 * @property {function} [onFocus]
 * @property {function} [onBlur]
 * @property {function} [onInitialized]
 * @property {function} [formReady]
 * @property {any} [formioform]
 */
Form.propTypes = {
  src: PropTypes.string,
  url: PropTypes.string,
  form: PropTypes.object,
  submission: PropTypes.object,
  options: PropTypes.shape({
    readOnly: PropTypes.bool,
    noAlerts: PropTypes.bool,
    i18n: PropTypes.object,
    template: PropTypes.string,
    saveDraft: PropTypes.bool,
    language: PropTypes.string
  }),
  onPrevPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onCustomEvent: PropTypes.func,
  onComponentChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitDone: PropTypes.func,
  onFormLoad: PropTypes.func,
  onError: PropTypes.func,
  onRender: PropTypes.func,
  onAttach: PropTypes.func,
  onBuild: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onInitialized: PropTypes.func,
  formReady: PropTypes.func,
  formioform: PropTypes.any
};

Form.getDefaultEmitter = () => {
  return new EventEmitter({
    wildcard: false,
    maxListeners: 0
  });
};

export default Form;