import React, { useEffect, useState } from "react";
import { AppsConfig } from "../../../utilities/config";
import { connect } from "react-redux";
import {
  startFlowByKey,
  resetWorkFlow,
} from "../../../redux/workflows/actions";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Spin, message, Empty, Button, List, Skeleton } from "antd";
import { ThunderboltTwoTone, LoadingOutlined } from "@ant-design/icons";
import { getFormByPathApi } from "../../../redux/form/api";
import style from "./style.module.scss";
import withAuthorization from "../../../authorization/withAuthorization";

let formioInstance = null;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ApplicationScoringReview = (props) => {
  const {
    selectedApplication,
    options,
    onSubmit,
    resetWorkFlow,
    successMessage,
  } = props;
  const paginationProps = {
    showSizeChanger: false,
    showLessItems: true,
    pageSize: 5,
  };
  console.log(selectedApplication);
  // The form
  const [form, setForm] = useState({});
  // The data
  const [submissionData, setSubmissionData] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    import("../../../react-formio");
  }, []);

  function formReady(instance) {
    formioInstance = instance;
  }

  function onChange(instance, event, isWizardDirty) {
    if (isWizardDirty !== undefined) {
      setIsFormValid(formioInstance.checkValidity());
    }
  }

  useEffect(() => {
    setSubmissionData({
      data: {
        uri:
          "apps/applications/view/" +
          selectedApplication.data._id +
          "/" +
          selectedApplication.data.appTemplateId,
        finalScore: selectedApplication.data.score,
        proposedBudget: selectedApplication.data.totalBudgetFOSM,
        title: selectedApplication.data.projectTitle,
        id: selectedApplication.data.id,
      },
    });
    getFormByPathApi(AppsConfig.applicationscoringreview.form).then(
      (response) => {
        setForm(response);
      }
    );
  }, []);

  useEffect(() => {
    if (props.workflowError) {
      message.error(props.workflowError);
    }
  }, [props.workflowError]);

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

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h4 className="badge-example">
            <FormattedMessage id="budget.label" />
          </h4>
          <div className={`${style.container} pt-3`}>
            <div className={`${style.status} bg-success`} />
            <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
              <div className="mr-auto">
                <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                  {selectedApplication.data.currency.currency} {""}
                  <FormattedNumber
                    minimumFractionDigits={2}
                    value={selectedApplication.data.totalBudget}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4 className="badge-example">
            <FormattedMessage id="fosm.budgetLabel" />
          </h4>
          <div className={`${style.container} pt-3`}>
            <div className={`${style.status} bg-success`} />
            <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
              <div className="mr-auto">
                <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                  {selectedApplication.data.currency.currency} {""}
                  <FormattedNumber
                    minimumFractionDigits={2}
                    value={selectedApplication.data.totalBudgetFOSM}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4 className="badge-example mt-4">
        <FormattedMessage id="scoring.label" />
      </h4>
      <List
        className="demo-loadmore-list"
        loading={false}
        itemLayout="vertical"
        pagination={paginationProps}
        dataSource={selectedApplication ? selectedApplication.data.scoring : []}
        renderItem={(item) => (
          <List.Item className={`${style.item} mb-1`}>
            <div>
              <div className="row">
                <div className="col-md-3">
                  <Skeleton avatar title={false} loading={false} active>
                    <div className={`${style.itemHead} mb-2`}>
                      <div className={style.itemPic}>
                        <i>{`${item.reviewer ? item.reviewer : ""}`}</i>
                      </div>
                      <div className="mr-2">
                        <div>{item.reviewer}</div>
                        <div className="text-muted">
                          Score:{" "}
                          <strong className="text-gray-6">{item.score}</strong>
                        </div>
                      </div>
                    </div>
                  </Skeleton>
                </div>
                <div className="col-md-9">
                  <div className="progress">
                    <div
                      className={`progress-bar ${
                        item.score >= 75
                          ? "bg-success"
                          : item.score < 75 && item.score > 30
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      style={{
                        width: item.score + "%",
                      }}
                      role="progressbar"
                      aria-valuenow={item.score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="text-muted mb-2">
                    Comment:{" "}
                    <strong className="text-gray-6">{item.comment}</strong>
                  </div>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
      <h2 className="badge-example mt-5">
        <FormattedMessage id="scoring.reviewLabel" />
      </h2>
      <Form
        className="mb-4 mt-4 text-left"
        submission={submissionData}
        onSubmit={onSubmit}
        formReady={(instance) => {
          formReady(instance);
        }}
        onChange={onChange}
        form={form}
        options={options}
      />
      <Button
        type="primary"
        className="mb-2"
        block
        icon={<ThunderboltTwoTone />}
        disabled={!isFormValid}
        onClick={() => {
          onSubmit(formioInstance.submission);
        }}
      >
        <FormattedMessage id="button.submit" />
      </Button>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps);
  const submission = ownProps.selectedApplication.data
    ? { data: ownProps.selectedApplication.data }
    : null;
  return {
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      noAlerts: true,
    },
    selectedApplication: submission,
    isWorkflowLoading: state.workflow.isLoading,
    isWorkflowSuccess: state.workflow.isWorkflowSuccess,
    workflowError: state.workflow.error,
    successMessage: ownProps.successMessage ? ownProps.successMessage : false,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (submission) => {
      dispatch(
        startFlowByKey(
          ownProps.selectedApplication.processKey,
          ownProps.selectedApplication.id,
          ownProps.selectedApplication.userId,
          submission.data
        )
      );
    },
    resetWorkFlow: () => dispatch(resetWorkFlow()),
  };
};

export default withAuthorization(
  "applicationscoringreview:view",
  connect(mapStateToProps, mapDispatchToProps)(ApplicationScoringReview)
);
