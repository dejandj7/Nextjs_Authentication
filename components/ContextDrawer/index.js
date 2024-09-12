import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { LoadingOutlined, ThunderboltTwoTone } from "@ant-design/icons";
import RelatedTasks from "./RelatedTasks";
import ApplicationScoringReview from "./ApplicationScoringReview";
import ScoringReview from "./ScoringReview";
import ActionButton from "./ActionButton";
import { Drawer, Spin, Empty, Button } from "antd";
import { resetWorkFlow } from "../../redux/workflows/actions";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ContextDrawer = (props) => {
  const {
    contextOptions,
    contextClose,
    contextToggle,
    contextData,
    dataPresentationType,
    contextDrawerMainWidth,
    contextDrawerInnerWidth,
    options,
    onSubmit,
    callBackSuccess,
    callBackError,
  } = props;

  const [selectedContextItem, setSelectedContextItem] = useState(null);
  const [itemDetailsVisible, setItemDetailsVisible] = useState(false);

  useEffect(() => {
    import("../../react-formio");
  }, []);

  // This function triggers the list item's submit action.
  const triggerTaskComplete = () => {
    const submitActionEl = document.querySelector(
      ".ant-drawer-body .formio-component-submit > button"
    );
    if (submitActionEl) {
      submitActionEl.click();
    }
  };

  // This function handles the content of the context drawer
  const renderActionComponent = (
    type,
    dataObj,
    itemDetailsVisible,
    callBackSuccess,
    callBackError
  ) => {
    switch (type) {
      case "relatedTasks":
        return <RelatedTasks relatedTasks={dataObj} />;
      case "applicationScoringReview":
        return <ApplicationScoringReview selectedApplication={dataObj} />;
      case "ScoringReview":
        return <ScoringReview selectedApplication={dataObj} />;
      case "actionButton":
        if (dataObj) {
          return (
            <ActionButton
              dataContext={dataObj}
              dataOnBeforeSubmit={
                contextOptions.beforeSubmitHook &&
                typeof contextOptions.beforeSubmitHook === "function"
                  ? contextOptions.beforeSubmitHook
                  : ""
              }
              successMessage={
                contextOptions.successMessage
                  ? contextOptions.successMessage
                  : false
              }
              parallel={
                contextOptions.parallel ? contextOptions.parallel : false
              }
              callBackSuccess={callBackSuccess}
              callBackError={callBackError}
            />
          );
        } else {
          return <></>;
        }
      default:
        return "You didn't specifiy a presentation type";
    }
  };

  return (
    <Drawer
      title={contextOptions ? contextOptions.title : ""}
      width={contextDrawerMainWidth ? contextDrawerMainWidth : "60%"}
      className="task-details"
      onClose={() => {
        resetWorkFlow();
        contextClose();
      }}
      open={contextToggle}
    >
      {contextData ? (
        <div className="row">
          <div className="col-12">
            {dataPresentationType && contextData ? (
              renderActionComponent(
                dataPresentationType,
                contextData,
                itemDetailsVisible,
                callBackSuccess,
                callBackError
              )
            ) : (
              <Empty description="No data or action to perfrom in this drawer" />
            )}
          </div>
        </div>
      ) : (
        <Spin indicator={loadingIcon} tip="Loading context">
          <div className="full-loader"></div>
        </Spin>
      )}

      <Drawer
        title="Complete this task ..."
        width={contextDrawerInnerWidth ? contextDrawerInnerWidth : "40%"}
        closable={false}
        onClose={() => {
          setItemDetailsVisible(false);
          setSelectedContextItem(null);
        }}
        open={itemDetailsVisible}
      >
        {selectedContextItem && selectedContextItem.data ? (
          <div className="row">
            <div className="col-12">
              <Form
                className="mb-4 mt-4 text-left"
                form={{}}
                submission={selectedContextItem.data}
                options={options}
                onSubmit={onSubmit}
              />
              <Button
                type="primary"
                className="mb-2"
                block
                icon={<ThunderboltTwoTone />}
                onClick={() => {
                  triggerTaskComplete();
                  callBackSuccess();
                  setItemDetailsVisible(false);
                }}
              >
                Complete Task
              </Button>
            </div>
          </div>
        ) : (
          <Spin indicator={loadingIcon} tip="Loading context">
            <div className="full-loader"></div>
          </Spin>
        )}
      </Drawer>
    </Drawer>
  );
};

const mapStateToProps = (state) => {
  return {
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dataPresentationType: ownProps.dataPresentationType,
    resetWorkFlow: () => dispatch(resetWorkFlow()),
    onSubmit: (submission) => {
      if (ownProps.contextData.selectedRecords) {
        submission.data.selectedApplications = selectedRecords;
      }
      console.log(submission);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextDrawer);
