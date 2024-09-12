import React, { useEffect, useState, useRef, Fragment } from "react";
import { ThunderboltTwoTone, LoadingOutlined } from "@ant-design/icons";
import _ from "lodash";
//import { selectRoot, Form } from '../../../react-formio';
import Link from "next/link";
import { Tabs, Empty, Button, Drawer, List, notification, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
//import style from './style.module.scss';
import { completeUserTask } from "../../../redux/usertask/actions";
import { updateNotification } from "../../../redux/usertask/api";
import { getFormByPathApi } from "../../../redux/form/api";

const { TabPane } = Tabs;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// custom hook for getting previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

let formioInstance = null;

const List2 = (props) => {
  const {
    userTasks,
    notifications,
    options,
    onSubmit,
    onUpdateNotification,
    currentLocale,
    auth,
  } = props;

  useEffect(() => {
    import("../../../react-formio");
  }, []);

  const [taskDetailsVisible, setTaskDetailsVisible] = useState(false);
  const [notificationDetailsVisible, setNotificationDetailsVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // The task data
  const [submissionData, setSubmissionData] = useState({});
  // The task form
  const [formKey, setFormKey] = useState(null);
  const [form, setForm] = useState(null);
  const [notificationData, setNotificationData] = useState(null);
  // The save enabled
  const [isFormValid, setIsFormValid] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (formKey !== undefined && formKey !== null) {
      setLoader(true);
      getFormByPathApi(formKey)
        .then((result) => {
          setForm(result);
          setLoader(false);
        })
        .catch(() => {
          setLoader(false);
        });
    }
  }, [formKey]);

  // previous tasks
  const prevCount = usePrevious(userTasks);

  function formReady(instance) {
    formioInstance = instance;
  }

  function onChange(instance, event, isWizardDirty) {
    if (isWizardDirty !== undefined) {
      setIsFormValid(formioInstance.checkValidity());
    } else {
      setIsFormValid(instance.isValid);
    }
  }

  function triggerTaskComplete() {
    formioInstance.submit();
    setSelectedTask(null);
  }

  function updateNotificationSeen(data) {
    const payload = {
      notificationId: data._id ? data._id : data.id,
      seen: true,
    };
    onUpdateNotification(payload);
  }

  useEffect(() => {
    if (formioInstance) {
      formioInstance.submission = _.clone(submissionData);
    }
  }, [submissionData]);

  return (
    <div>
      <Tabs
        className="air-tabs-bordered notifications-tabs"
        defaultActiveKey="1"
      >
        <TabPane tab={<FormattedMessage id="topBar.Tasks" />} key="1">
          <div className="py-2 pb-4">
            {userTasks && userTasks.data ? (
              <List
                itemLayout="horizontal"
                dataSource={userTasks.data.length ? userTasks.data : []}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        key="list-switch-profile"
                        onClick={() => {
                          notification.close(item.id);
                          setFormKey(item.data.formKey);
                          setTaskDetailsVisible(true);
                          setSelectedTask({ data: item.data });
                          setSubmissionData({
                            data: {
                              ...item.data.data,
                              userFullName: auth.user.fullName,
                            },
                          });
                        }}
                      >
                        <FormattedMessage id="button.view" />
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.data.name}
                      description={item.data.id}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={<FormattedMessage id="topBar.Notasks" />} />
            )}
          </div>
        </TabPane>
        <TabPane tab={<FormattedMessage id="topBar.Events" />} key="2">
          <div className="py-2 pb-4">
            {notifications && notifications.data ? (
              <List
                itemLayout="horizontal"
                dataSource={notifications.data.length ? notifications.data : []}
                renderItem={(item) =>
                  !item.isSeen ? (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          key="list-switch-profile"
                          onClick={() => {
                            notification.close(item._id);
                            setNotificationDetailsVisible(true);
                            setNotificationData(item);
                            updateNotificationSeen(item);
                          }}
                        >
                          View
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta title={item.subject} />
                    </List.Item>
                  ) : null
                }
              />
            ) : (
              <Empty
                description={<FormattedMessage id="topBar.NoNotifications" />}
              />
            )}
          </div>
        </TabPane>
      </Tabs>
      <Drawer
        title="Task Details"
        className="task-details"
        width="70%"
        closable={true}
        onClose={() => {
          setForm(null);
          setFormKey(null);
          setIsFormValid(false);
          setTaskDetailsVisible(false);
          setSubmissionData({ data: {} });
          setSelectedTask(null);
        }}
        //afterVisibleChange={() => loadTaskDetails()}
        open={taskDetailsVisible}
      >
        {selectedTask && selectedTask.data ? (
          <div className="row">
            <div className="col-12">
              <div>
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-lg-12">
                        <div
                          className={style.style_item__3oAWy + " mb-xl-0 mb-3"}
                        >
                          <span className={style.style_icon__3hQk1}>
                            <i className="fe fe-home"></i>
                          </span>
                          <div>
                            {selectedTask.data.data &&
                            selectedTask.data.data.uri ? (
                              <Link
                                href={
                                  selectedTask.data.data &&
                                  selectedTask.data.data.uri
                                    ? `/${selectedTask.data.data.uri}`
                                    : ""
                                }
                              >
                                <>
                                  <span className={style.style_title__1QlUR}>
                                    Name:
                                  </span>{" "}
                                  {selectedTask.data.name}
                                </>
                              </Link>
                            ) : (
                              <>
                                <span className={style.style_title__1QlUR}>
                                  Name:
                                </span>{" "}
                                {selectedTask.data.name}
                              </>
                            )}
                          </div>
                          <div
                            className={style.style_line__3ul5u + " bg-success"}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-lg-6">
                        <div
                          className={style.style_item__3oAWy + " mb-xl-0 mb-3"}
                        >
                          <span className={style.style_icon__3hQk1}>
                            <i className="fe fe-star"></i>
                          </span>
                          <div>
                            <span className={style.style_title__1QlUR}>
                              Created:
                            </span>{" "}
                            {new Date(
                              selectedTask.data.created
                            ).toLocaleDateString(currentLocale)}
                          </div>
                          <div
                            className={style.style_line__3ul5u + " bg-primary"}
                          ></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div
                          className={style.style_item__3oAWy + " mb-xl-0 mb-3"}
                        >
                          <span className={style.style_icon__3hQk1}>
                            <i className="fe fe-command"></i>
                          </span>
                          <div>
                            <span className={style.style_title__1QlUR}>
                              Due Date:
                            </span>{" "}
                            {selectedTask.data.dueDate
                              ? new Date(
                                  selectedTask.data.dueDate
                                ).toLocaleDateString(currentLocale)
                              : "N/A"}
                          </div>
                          <div
                            className={style.style_line__3ul5u + " bg-warning"}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Spin indicator={loadingIcon} size="large" spinning={loader}>
                  <div className="card">
                    <div className="card-body">
                      <Form
                        className="mb-4 mt-4 text-left"
                        formReady={(instance) => {
                          formReady(instance);
                        }}
                        form={form}
                        submission={submissionData}
                        options={options}
                        onChange={onChange}
                        onError={(submission) => {
                          console.log("Error in submission");
                        }}
                        onSubmit={(submission) => {
                          onSubmit(submission, selectedTask);
                        }}
                      />
                      <Button
                        type="primary"
                        className="mb-2 mt-4"
                        block
                        icon={<ThunderboltTwoTone />}
                        disabled={!isFormValid}
                        onClick={() => {
                          triggerTaskComplete();
                          setFormKey(null);
                          setForm(null);
                          setTaskDetailsVisible(false);
                        }}
                      >
                        <FormattedMessage id="button.completetask" />
                      </Button>
                    </div>
                  </div>
                </Spin>
              </div>
            </div>
          </div>
        ) : (
          <Spin
            indicator={loadingIcon}
            tip={<FormattedMessage id="loader.userTasks" />}
          >
            <div className="full-loader"></div>
          </Spin>
        )}
      </Drawer>
      <Drawer
        title="Notification Details"
        className="task-details"
        width="70%"
        closable={true}
        onClose={() => {
          setNotificationDetailsVisible(false);
          setNotificationData(null);
          setFormKey(null);
          setForm({});
        }}
        open={notificationDetailsVisible}
      >
        {notificationData ? (
          <div className="row">
            <div className="col-12">
              <div>
                <div className={`card ${style.notification_card}`}>
                  <div className="card-header">
                    <h4>
                      {notificationData.subject.toUpperCase()}{" "}
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          color: "#1b55e3",
                        }}
                      >
                        {new Date(
                          notificationData.createdOn
                        ).toLocaleDateString(currentLocale)}
                      </span>
                    </h4>
                  </div>
                  <div className="card-body">
                    <Fragment>{notificationData.body}</Fragment>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Spin
            indicator={loadingIcon}
            tip={<FormattedMessage id="loader.userTasks" />}
          >
            <div className="full-loader"></div>
          </Spin>
        )}
      </Drawer>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const userTasks = state["userTask"];
  const notifications = state["notifications"];
  return {
    userTasks: userTasks,
    notifications,
    auth: state["auth"],
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      noAlerts: true,
    },
    currentLocale: state.settings.locales[state.settings.locale],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (submission, selectedTask) => {
      var editedData = _.cloneDeep(submission);
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
        delete editedData.data[e.key];
      });
      dispatch(completeUserTask({ id: selectedTask.data.id, ...editedData }));
    },
    onUpdateNotification: (payload) => {
      dispatch(updateNotification(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List2);
