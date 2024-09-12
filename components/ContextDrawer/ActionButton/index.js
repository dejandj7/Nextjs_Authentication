import React, { useEffect, useState } from "react";
import { AppConfig } from "../../../utilities/config";
import { connect } from "react-redux";
import {
  startFlowByKey,
  resetWorkFlow,
  startApi,
} from "../../../redux/workflows/actions";
import { FormattedMessage } from "react-intl";
import { Spin, message, Empty, Button } from "antd";
import { LoadingOutlined, ThunderboltTwoTone } from "@ant-design/icons";
import { getFormByPathApi } from "../../../redux/form/api";
import { useRouter } from "next/router";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let formioInstance = null;
//const Context = React.createContext({ name: 'Default' });

const ActionButton = (props) => {
  const router = useRouter();
  const {
    options,
    formKey,
    startFlow,
    startApi,
    submission,
    auth,
    resetWorkFlow,
    successMessage,
    redirect,
    apiCall,
    beforeOnSubmit,
    callBackSuccess,
    callBackError,
  } = props;
  // The task form
  const [form, setForm] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  // The save enabled
  const [isFormValid, setIsFormValid] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    import("../../../react-formio");
  }, []);

  useEffect(() => {
    setIsFormLoading(true);
    if (formKey !== undefined) {
      getFormByPathApi(formKey)
        .then((result) => {
          setForm(result);
          setIsFormLoading(false);
        })
        .catch(() => {
          setIsFormLoading(false);
        });
    }
  }, [formKey]);

  useEffect(() => {
    if (props.workflowError) {
      message.error(props.workflowError);
      if (callBackError) {
        callBackError();
      }
    }
  }, [props.workflowError]);

  useEffect(() => {
    setSubmissionData({ ...submission, userFullName: auth.user.fullName });
  }, [submission]);

  function formReady(instance) {
    formioInstance = instance;
  }

  function onChange(instance, event, isWizardDirty) {
    if (formioInstance) {
      setIsFormValid(formioInstance.checkValidity());
    }
  }

  function onSubmitButton(submission) {
    if (!_.isEmpty(submission.data)) {
      var editedData = _.cloneDeep(submission.data);
      FormioUtils.searchComponents(formioInstance.form.components, {
        type: "datetime",
      }).forEach((e, indx) => {
        if (e.attributes.date) {
          editedData[e.key] = editedData[e.key].slice(0, 10);
        }
      });
      //sanitize data
      FormioUtils.searchComponents(formioInstance.form.components, {
        persistent: false,
      }).forEach((e, indx) => {
        delete editedData[e.key];
      });
      editedData["apiUrl"] = AppConfig.apiUrlBpmn;
      try {
        if (beforeOnSubmit && typeof beforeOnSubmit === "function") {
          beforeOnSubmit(submission)
            .then((result) => {
              console.log(result, result.length);
              if (result.length !== 0) {
                message.error(`Errors beforeSubmit ${result.length}`);
                console.error(`Errors beforeSubmit ${result.length}`);
              }
            })
            .catch(() => {});
        }
        if (apiCall) {
          startApi();
          apiCall(editedData);
        } else {
          startFlow(editedData);
        }
      } catch (error) {
        message.error("Error on startFlow: " + error.message);
        console.error("Error on startFlow:" + error);
        throw new Error(error);
      } finally {
        setIsFormValid(false);
        setForm({});
      }
    }
  }

  if (isFormLoading) {
    return (
      <>
        <Spin
          indicator={loadingIcon}
          tip={<FormattedMessage id="loader.form" />}
        >
          <div className="full-loader"></div>
        </Spin>
      </>
    );
  }

  if (props.workflowError) {
    return (
      <>
        <Empty imageStyle={{ color: "red" }} description={props.workflowError}>
          <Button
            className="btn-danger"
            onClick={() => {
              document.querySelector(".ant-drawer-close").click();
              resetWorkFlow();
            }}
          >
            <FormattedMessage id="workflow.drawerclose" />
          </Button>
        </Empty>
      </>
    );
  }

  if (props.isWorkflowLoading) {
    return (
      <>
        <Spin
          indicator={loadingIcon}
          tip={<FormattedMessage id="workflow.starting" />}
        >
          <div className="full-loader"></div>
        </Spin>
      </>
    );
  }

  if (props.isWorkflowSuccess) {
    return (
      <>
        <Empty
          imageStyle={{ color: "green" }}
          description={
            successMessage ? (
              successMessage
            ) : (
              <FormattedMessage id="workflow.success" />
            )
          }
        >
          <Button
            className="btn-success"
            onClick={() => {
              setIsFormValid(false);
              setIsFormLoading(false);
              setForm({});
              resetWorkFlow();
              formioInstance = null;
              if (callBackSuccess) {
                callBackSuccess();
              }
              if (redirect) {
                router.push(redirect);
              }
              document.querySelector(".ant-drawer-close").click();
            }}
          >
            <FormattedMessage id="workflow.drawerclose" />
          </Button>
        </Empty>
      </>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <Form
          className="mb-4 mt-4 text-left"
          options={options}
          formReady={(instance) => {
            formReady(instance);
          }}
          form={form}
          submission={submissionData}
          onChange={onChange}
        />
        <Button
          type="primary"
          className="mb-2"
          block
          icon={<ThunderboltTwoTone />}
          disabled={!isFormValid}
          onClick={() => {
            //formioInstance.submit();
            onSubmitButton(formioInstance.submission);
          }}
        >
          <FormattedMessage id="button.submit" />
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const formKey = ownProps.dataContext.formKey;
  const submission = ownProps.dataContext.data
    ? { data: ownProps.dataContext.data }
    : null;
  const beforeOnSubmit = ownProps.dataOnBeforeSubmit
    ? ownProps.dataOnBeforeSubmit
    : false;
  const callBackSuccess =
    ownProps.callBackSuccess && typeof ownProps.callBackSuccess === "function"
      ? ownProps.callBackSuccess
      : false;
  const callBackError =
    ownProps.callBackError && typeof ownProps.callBackError === "function"
      ? ownProps.callBackError
      : false;
  const successMessage = ownProps.successMessage
    ? ownProps.successMessage
    : false;
  const redirect = ownProps.dataContext.redirect
    ? ownProps.dataContext.redirect
    : null;
  const apiCall = ownProps.dataContext.apiCall
    ? ownProps.dataContext.apiCall
    : null;
  return {
    formKey,
    redirect,
    callBackError,
    callBackSuccess,
    apiCall,
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      noAlerts: true,
    },
    submission: submission,
    auth: state["auth"],
    isWorkflowLoading: state.workflow.isLoading,
    isWorkflowSuccess: state.workflow.isWorkflowSuccess,
    workflowError: state.workflow.error,
    successMessage,
    beforeOnSubmit,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetWorkFlow: () => dispatch(resetWorkFlow()),
    startApi: () => dispatch(startApi()),
    onError: (error, submission) => {
      if (error && error.length) {
        message.error(error[0].message);
      }
    },
    startFlow: (data) => {
      if (!ownProps.parallel) {
        dispatch(
          startFlowByKey(
            ownProps.dataContext.processKey,
            ownProps.dataContext.id,
            ownProps.dataContext.userId,
            { ...data }
          )
        );
      } else {
        Promise.all(
          data.parallelData.map((record) =>
            dispatch(
              startFlowByKey(
                ownProps.dataContext.processKey,
                ownProps.dataContext.id,
                ownProps.dataContext.userId,
                { ...record }
              )
            )
          )
        ).then((result) =>
          console.log(`Started ${data.parallelData.length} processes`)
        );
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionButton);
