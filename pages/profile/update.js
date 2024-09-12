import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPrompt from "../../components/ReactPrompt";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Helmet } from "react-helmet";
import SubBar from "../../widgets/SubBar";
import { PropTypes } from "prop-types";
import { Avatar, message, Menu, Alert, Tag, Modal, Spin } from "antd";
import General1 from "../../widgets/General/1";
import General12v1 from "../../widgets/General/12v1";
import { AppConfig, AuthConfig } from "../../utilities/config";
import {
  UserOutlined,
  CloseOutlined,
  InfoOutlined,
  LockOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styles from "./style.module.scss";
import ContextDrawer from "../../components/ContextDrawer";
import axios from "axios";
import { decrypt, encrypt } from "../../utilities/Utils";
import { updateCustomerProfile } from "../../redux/auth/actions";
import { resetProfileStatus } from "../../redux/usertask/actions";
import { requestSetDefaultProfile } from "../../redux/users/actions";
import withAuthorization from "../../authorization/withAuthorization";
import { ButtonPrivate } from "../../authorization/Private";
import { updateCustomerApi } from "../../redux/customer/api";
import { startFlowByKey } from "../../redux/workflows/actions";
import FormIOForm from "../../components/FormIO";
import PageLayout from "../../components/PageLayout";
import { useSession } from "next-auth/react";
import { getUserProfile, setUserProfile } from "../../redux/auth";

// Dummy context menu onBeforeSubmit action
const doTaxNumberValidationBeforeSubmit = async function (submission) {
  var validationErrors = [];
  if (
    submission &&
    submission.data &&
    !submission.data.hasTaxNumber &&
    (submission.data.customer || submission.data.taxIdentificationNumber)
  ) {
    try {
      let response = await axios.get(
        AppConfig.apiUrl +
          "/customer/taxnumber/" +
          (submission.data.taxIdentificationNumber
            ? submission.data.taxIdentificationNumber
            : submission.data.customer.taxIdentificationNumber)
      );
      if (submission.data._id) {
        if (submission.data._id !== response.data._id) {
          validationErrors.push({
            message: "Customer with such tax number already exists!",
          });
        }
      } else {
        if (response.data._id) {
          validationErrors.push({
            message: "Customer with such tax number already exists!",
          });
        }
      }
    } catch (err) {
      let error = await err.toJSON();
      if (error.message !== "Request failed with status code 400") {
        validationErrors.push({
          message: error.toString(),
        });
      }
    }
    return validationErrors;
  }
};

// Translated messages
let profileUpdateErrorMessage, profileUpdateSuccessMessage, saveWarningMessage;
let formioInstance = null;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const UserSettings = (props) => {
  const {
    auth,
    makeEditable,
    saveProfile,
    saveDraft,
    cancelUpdate,
    customer,
    updateProfile,
    setCurrentProfileAsDefault,
    messageWarningMessage,
    getUserAndProfile,
    setProfile,
    options,
    hasTaxNumber,
    startFlow,
    profileStatusUpdate,
  } = props;
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextOptions, setContextOptions] = useState({});
  // The data or datum to send to the context drawer
  const [contextData, setContextData] = useState([]);
  // The action to perform when the context drawer is loaded
  const [contextDataAction, setContextDataAction] = useState(null);
  // The presentation type for the drawer. Curerntly only 'list' and 'form' are available
  const [contextPresentationType, setContextPresentationType] = useState(false);
  // The modified state
  const [isFormDirty, setIsFormDirty] = useState(false);
  // The modified state
  const [isProfileEditable, setIsProfileEditable] = useState(false);
  const [customerStatusID, setCustomerStatusID] = useState(1);
  // The profile data
  const [submissionData, setSubmissionData] = useState();
  // The save enabled
  const [isValid, setIsValid] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const { data: session, status } = useSession();

  function onChange(instance, event, isWizardDirty) {
    if (isWizardDirty !== undefined) {
      if (isWizardDirty === true) {
        setIsFormDirty(true);
      }
      //setIsValid(formioInstance.checkValidity());
    }
  }

  function onSubmit(args) {
    // if (!isValid) {
    //   let errors = [];
    //   const errorsOnForm = formioInstance.showErrors();
    //   if (errorsOnForm !== undefined && errorsOnForm.length > 0) {
    //     errorsOnForm.forEach((e, indx) => {
    //       errors.push(e.message);
    //     });

    //     const listItems = errors.map((e, i) =>
    //       <li key={i}>
    //         {e}
    //       </li>
    //     );
    //     const content = {
    //       title: messageWarningMessage,
    //       content: (<ul>
    //         {listItems}
    //       </ul>)
    //     };
    //     Modal.warning(content);
    //   }
    // }
    if (!_.isEmpty(args.instance.data)) {
      var editedData = _.cloneDeep(args.instance.data);
      if (
        formioInstance.checkValidity() &&
        editedData["customerStatusID"] === 1
      ) {
        editedData["customerStatusID"] = 2;
      } else {
        editedData["customerStatusID"] = customerStatusID;
      }
      if (
        !editedData.isLegalEntity &&
        editedData["taxIdentificationNumber"] !== undefined &&
        editedData["taxIdentificationNumber"] !== ""
      ) {
        editedData["taxIdentificationNumber"] = encrypt(
          editedData["taxIdentificationNumber"]
        );
      }
      delete editedData.roles;
      updateCustomerApi({ ...editedData, _id: customer._id })
        .then(() => {
          let $tabbedSection = document.querySelector(
            ".no-border-tabbed-section"
          );
          $tabbedSection.classList.toggle("editable");
          updateProfile({ ...editedData, _id: customer._id });
          message.success(profileUpdateSuccessMessage);
          setIsFormDirty(false);
          if (customerStatusID !== parseInt(editedData["customerStatusID"])) {
            setCustomerStatusID(parseInt(editedData["customerStatusID"]));
          }
        })
        .catch((err) => {
          message.error(err);
          let $tabbedSection = document.querySelector(
            ".no-border-tabbed-section"
          );
          $tabbedSection.classList.toggle("editable");
        });
    }
  }

  function formReady(instance) {
    formioInstance = instance;
  }

  function onError(error, submission) {
    console.debug("onError", error);
    let errors = [];
    if (error !== undefined && error.length > 0) {
      error.forEach((e, indx) => {
        errors.push(e.message);
      });

      const listItems = errors.map((e, i) => <li key={i}>{e}</li>);
      const content = {
        title: messageWarningMessage,
        content: <ul>{listItems}</ul>,
      };
      Modal.warning(content);
    }
  }

  useEffect(() => {
    if (customer) {
      const taxIdentificationNumber = customer.isLegalEntity
        ? customer.taxIdentificationNumber
        : decrypt(
            customer.taxIdentificationNumber
              ? customer.taxIdentificationNumber
              : ""
          );
      setCustomerStatusID(customer.customerStatusID);
      setSubmissionData({
        data: {
          ...customer,
          taxIdentificationNumber,
          hasTaxNumber,
          isInternal: customer._id === process.env.ORGANIZATION_ID,
        },
      });
    }
  }, [customer]);

  useEffect(() => {
    if (
      customer &&
      profileStatusUpdate &&
      profileStatusUpdate.data &&
      profileStatusUpdate.data._id === customer._id &&
      profileStatusUpdate.data.status !== customerStatusID
    ) {
      setCustomerStatusID(profileStatusUpdate.data.status);
      resetProfileStatus();
    }
  }, [profileStatusUpdate]);

  const contextMenu = (
    <Menu>
      {customer && customerStatusID && customerStatusID === 2 ? (
        <Menu.Item key="0">
          <a
            type="button"
            className="d-block"
            onClick={() => {
              setContextOptions(
                <FormattedMessage id="actionButton.submitProfile" />
              );
              setContextPresentationType("actionButton");
              setContextData({
                formKey: "profilereviewrequest",
                id: customer._id,
                userId: auth.user.id,
                data: {
                  customerId: customer._id,
                  userId: auth.user.id,
                  uri: "customer/" + customer._id,
                  name: submissionData.data.fullName,
                },
                processKey: "CompleteCustomerProfileProcessId",
              });
              setContextMenuVisible(true);
            }}
          >
            <i className="btn-addon-icon fe fe-star" />{" "}
            <FormattedMessage id="actionButton.submitProfile" />
          </a>
        </Menu.Item>
      ) : (
        <></>
      )}
      {customer && !customer.isLegalEntity && customerStatusID === 5 ? (
        <Fragment>
          <Menu.Item key="11">
            <a
              type="button"
              className="d-block"
              onClick={() => {
                setContextMenuVisible(true);
                setContextOptions({
                  title: (
                    <FormattedMessage id="actionButton.createorganization" />
                  ),
                  beforeSubmitHook: doTaxNumberValidationBeforeSubmit,
                  successMessage: (
                    <FormattedMessage id="actionButton.createOrganizationSuccess" />
                  ),
                });
                setContextPresentationType("actionButton");
                setContextData({
                  formKey: "organization/register",
                  userId: auth.user.id,
                  data: {
                    requestorName: auth.user.fullName,
                    requestorNameLocal: `${auth.myprofile.privateCustomer.firstName} ${auth.myprofile.privateCustomer.lastName}`,
                    recipientsList: [
                      { id: auth.user.id, email: auth.user.email },
                    ],
                    userId: auth.user.id,
                    selectedRole: {
                      name: "grantistAdmin",
                      id: "5fabda250d791a541805d6ed",
                    },
                  },
                  processKey: "RegisterOrganization_ID",
                });
              }}
            >
              <i className="btn-addon-icon fe fe-star" />{" "}
              <FormattedMessage id="actionButton.createorganization" />
            </a>
          </Menu.Item>
          <Menu.Item key="12">
            <a
              type="button"
              className="d-block"
              onClick={() => {
                setContextMenuVisible(true);
                setContextOptions(
                  <FormattedMessage id="actionButton.joinorganization" />
                );
                setContextPresentationType("actionButton");
                setContextData({
                  formKey: "organization/join",
                  userId: auth.user.id,
                  data: {
                    requestorName: auth.user.fullName,
                    requestorNameLocal: `${auth.myprofile.privateCustomer.firstName} ${auth.myprofile.privateCustomer.lastName}`,
                    userId: auth.user.id,
                    organizationId: AppConfig.organizationId,
                    recipientsList: [
                      { id: auth.user.id, email: auth.user.email },
                    ],
                  },
                  processKey: "JoinOrganization_ID",
                });
              }}
            >
              <i className="btn-addon-icon fe fe-star" />{" "}
              <FormattedMessage id="actionButton.joinorganization" />
            </a>
          </Menu.Item>
        </Fragment>
      ) : (
        <></>
      )}
      {customer && customer.isLegalEntity && customerStatusID === 5 && (
        <Menu.Item key="2">
          <a
            type="button"
            className="d-block"
            onClick={() => {
              setContextMenuVisible(true);
              setContextOptions({
                title: <FormattedMessage id="actionButton.removeUser" />,
                successMessage: (
                  <FormattedMessage id="actionButton.removeUserSuccess" />
                ),
              });
              setContextPresentationType("actionButton");
              setContextData({
                formKey: "organization/removeUser",
                userId: auth.user.id,
                data: {
                  requestorName: auth.user.fullName,
                  recipientsList: [
                    { id: auth.user.id, email: auth.user.email },
                  ],
                  userId: auth.user.id,
                  customerId: customer._id,
                  users: customer.relatedUsers,
                },
                processKey: "RemoveUserFromOrganizationID",
              });
            }}
          >
            <i className="btn-addon-icon fe fe-star" />{" "}
            <FormattedMessage id="actionButton.removeUser" />
          </a>
        </Menu.Item>
      )}
      {customer &&
      !customer.isLegalEntity &&
      customerStatusID === 5 &&
      process.env.MSAL_TYPE === "private" ? (
        <Menu.Item key="3">
          <a
            type="button"
            className="d-block"
            onClick={() => {
              setContextMenuVisible(true);
              setContextOptions(
                <FormattedMessage id="actionButton.joinfosm" />
              );
              setContextPresentationType("actionButton");
              setContextData({
                formKey: "fosm/join",
                userId: auth.user.id,
                data: {
                  requestorName: auth.user.fullName,
                  userId: auth.user.id,
                  recipientsList: [
                    { id: auth.user.id, email: auth.user.email },
                  ],
                },
                processKey: "JoinFosm",
              });
            }}
          >
            <i className="btn-addon-icon fe fe-star" />{" "}
            <FormattedMessage id="actionButton.joinfosm" />
          </a>
        </Menu.Item>
      ) : (
        <></>
      )}
    </Menu>
  );

  const renderLoader = () => {
    return (
      <Spin indicator={loadingIcon} tip="Loading...">
        <div className="full-loader"></div>
      </Spin>
    );
  };

  const renderProfile = () => {
    return (
      <PageLayout>
        <div>
          {/* <ReactPrompt
        when={isFormDirty}
        title={areYouSure}
        content={unsavedChanges}
      /> */}
          <Helmet title="User: Settings" />
          <div className="air__utils__content">
            <SubBar
              mainTitle={<FormattedMessage id="content.profile" />}
              subTitle={<FormattedMessage id="content.settings" />}
              contextMenu={contextMenu}
              enableBackNavigation
            />
            <div className="row">
              <div className="col-xl-4 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap flex-column align-items-center">
                      <div className="air__utils__avatar air__utils__avatar--size128 mb-3">
                        <Avatar
                          className={styles.avatar}
                          shape="square"
                          size="large"
                          icon={<UserOutlined />}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-dark font-weight-bold font-size-18">
                          {session.user.email}
                        </div>
                        <div className="text-uppercase font-size-12 mb-3">
                          {customer &&
                            customer.relatedUsers
                              .filter((c) => c._id === session.user.userId)[0]
                              .userRoles.map((item, i) => (
                                <span key={i}>{item.name} </span>
                              ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {customerStatusID === 1 || customerStatusID === 2 ? (
                  <div>
                    <div className="card">
                      <div className="card-body">
                        <strong>
                          {customer && customer.isLegalEntity ? (
                            <div>
                              <FormattedMessage id="content.thisIs" />
                              <strong style={{ color: "#1B55E3" }}>
                                <FormattedMessage id="content.updateProfileLegal" />
                              </strong>

                              <FormattedMessage id="content.updateProfileLegalText" />
                            </div>
                          ) : (
                            <div>
                              <FormattedMessage id="content.thisIs" />
                              <strong style={{ color: "#1B55E3" }}>
                                <FormattedMessage id="content.updateProfilePrivate" />
                              </strong>
                              <FormattedMessage id="content.updateProfilePrivateText" />
                            </div>
                          )}
                          <br />
                          {
                            <strong style={{ color: "#1B55E3" }}>
                              <FormattedMessage id="content.updateProfile" />
                            </strong>
                          }
                          <br />
                          {<FormattedMessage id="content.updateProfile1" />}
                        </strong>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <strong>
                          {<FormattedMessage id="content.manual" />}
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="card text-white bg-primary">
                      <General12v1 />
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <General1 />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xl-8 col-lg-12">
                <div className="card">
                  <div className="card-header card-header-flex flex-column">
                    <div className="row">
                      <div className="col-xl-6 card-body">
                        <div className="text-dark font-size-18 font-weight-bold">
                          {customer ? customer.fullName : ""}
                        </div>
                        <div className="text-gray-6">
                          {customer && customer.facebook
                            ? "@" + customer.facebook
                            : ""}
                        </div>
                      </div>
                      <div className="col-xl-6 card-body">
                        <div className="text-right">
                          {customerStatusID === 1 && (
                            <Tag icon={<CloseOutlined />} color="#3ea4d4">
                              <strong>
                                {<FormattedMessage id="userStatus.new" />}
                              </strong>
                            </Tag>
                          )}
                          {customerStatusID === 2 && (
                            <Tag icon={<InfoOutlined />} color="#3ea4d4">
                              <strong>
                                {
                                  <FormattedMessage id="userStatus.readyForChecking" />
                                }
                              </strong>
                            </Tag>
                          )}
                          {customerStatusID === 3 && (
                            <Tag icon={<InfoOutlined />} color="#ffc107">
                              <strong>
                                {<FormattedMessage id="userStatus.checking" />}
                              </strong>
                            </Tag>
                          )}
                          {customerStatusID === 4 && (
                            <Tag icon={<CloseOutlined />} color="#dc3545">
                              <strong>
                                {
                                  <FormattedMessage id="userStatus.incomplete" />
                                }
                              </strong>
                            </Tag>
                          )}
                          {customerStatusID === 5 && (
                            <Tag icon={<CheckOutlined />} color="#28a745">
                              <strong>
                                {<FormattedMessage id="userStatus.approved" />}
                              </strong>
                            </Tag>
                          )}
                          {customerStatusID === 6 && (
                            <Tag icon={<LockOutlined />} color="#dc3545">
                              <strong>
                                {<FormattedMessage id="userStatus.blocked" />}
                              </strong>
                            </Tag>
                          )}
                        </div>
                        {customerStatusID === 1 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.new" />
                            }
                            type="info"
                          />
                        )}
                        {customerStatusID === 2 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.review" />
                            }
                            type="info"
                          />
                        )}
                        {customerStatusID === 3 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.verification" />
                            }
                            type="warning"
                          />
                        )}
                        {customerStatusID === 4 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.incomplete" />
                            }
                            type="error"
                          />
                        )}
                        {customerStatusID === 5 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.approve" />
                            }
                            type="success"
                          />
                        )}
                        {customerStatusID === 6 && (
                          <Alert
                            message={
                              <FormattedMessage id="profileStatus.blocked" />
                            }
                            type="error"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body no-border-tabbed-section p-0">
                    {submissionData ? (
                      <FormIOForm
                        className="mb-4 mt-4 text-left"
                        form={
                          customer && customer.isLegalEntity
                            ? AuthConfig.customermanagementlegal.form
                            : AuthConfig.customermanagementprivate.form
                        }
                        formReady={(instance) => {
                          formReady(instance);
                        }}
                        options={options}
                        submission={submissionData}
                        onSubmitButton={onSubmit}
                        onChange={onChange}
                        onError={onError}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="text-center card-header card-header-flex">
                    {isProfileEditable ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileEditable(false);
                            saveProfile();
                          }}
                          className="btn btn-success btn-with-addon save-profile-btn"
                        >
                          <span className="btn-addon">
                            <i className="btn-addon-icon fe fe-check-square" />
                          </span>
                          <span className="btn-text">
                            <FormattedMessage id="content.saveProfile" />
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileEditable(false);
                            cancelUpdate();
                            setSubmissionData({ data: customer });
                          }}
                          className="btn btn-danger btn-with-addon cancel-btn"
                        >
                          <span className="btn-addon">
                            <i className="btn-addon-icon fe fe-x-square" />
                          </span>
                          <span className="btn-text">
                            <FormattedMessage id="content.cancel" />
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ButtonPrivate
                          perform="profile:edit"
                          type="button"
                          onClick={() => {
                            setIsProfileEditable(true);
                            makeEditable();
                          }}
                          className="btn btn-primary btn-with-addon editable-btn"
                        >
                          <span className="btn-addon">
                            <i className="btn-addon-icon fe fe-edit" />
                          </span>
                          <span className="btn-text">
                            <FormattedMessage id="content.editProfile" />
                          </span>
                        </ButtonPrivate>
                        {session.user.userCustomers.filter(
                          (u) => u.isDefault === true
                        )[0].id !== customer._id ? (
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentProfileAsDefault(
                                customer,
                                session.user.userId
                              )
                            }
                            className="btn btn-secondary btn-with-addon editable-btn ml-2"
                          >
                            <span className="btn-addon">
                              <i className="btn-addon-icon fa fa-street-view" />
                            </span>
                            <span className="btn-text">
                              <FormattedMessage id="actionButton.setDefaultProfile" />
                            </span>
                          </button>
                        ) : (
                          <></>
                        )}
                        {customerStatusID &&
                        customerStatusID === 2 &&
                        !isProcessStarted ? (
                          <ButtonPrivate
                            perform="profile:edit"
                            type="button"
                            onClick={() =>
                              startFlow(
                                "CompleteCustomerProfileProcessId",
                                customer._id,
                                auth.user.userId,
                                {
                                  customerId: customer._id,
                                  userId: auth.user.id,
                                  uri: "customer/" + customer._id,
                                  name: submissionData.data.fullName,
                                },
                                setIsProcessStarted
                              )
                            }
                            className="btn btn-success btn-with-addon submit-app-btn ml-2"
                          >
                            <span className="btn-addon">
                              <i className="btn-addon-icon fa fa-send" />
                            </span>
                            <span className="btn-text">
                              <FormattedMessage id="actionButton.submitProfile" />
                            </span>
                          </ButtonPrivate>
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <ContextDrawer
              contextOptions={contextOptions}
              contextClose={() => {
                setContextMenuVisible(false);
                setContextData(null);
                setContextPresentationType("");
              }}
              contextToggle={contextMenuVisible}
              contextData={contextData}
              dataAction={contextDataAction}
              dataPresentationType={contextPresentationType}
            />
          </div>
        </div>
      </PageLayout>
    );
  };

  const renderView = () => {
    if (!customer) {
      renderLoader();
    } else {
      return renderProfile();
    }
  };

  return <Fragment>{renderView()}</Fragment>;
};

UserSettings.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const customer = state["auth"]?.myprofile;
  const profileStatusUpdate = state["userTask"];
  const hasTaxNumber = customer && customer.taxIdentificationNumber !== "";
  const currentLocale = state.settings.locales[state.settings.locale];
  // Get current locale and set translated messages
  profileUpdateSuccessMessage = (
    <IntlProvider
      locale={currentLocale.locale}
      messages={currentLocale.messages}
    >
      <FormattedMessage id="profile.updateSuccess" />
    </IntlProvider>
  );
  profileUpdateErrorMessage = (
    <IntlProvider
      locale={currentLocale.locale}
      messages={currentLocale.messages}
    >
      {" "}
      <FormattedMessage id="profile.updateError" />
    </IntlProvider>
  );
  saveWarningMessage = (
    <IntlProvider
      locale={currentLocale.locale}
      messages={currentLocale.messages}
    >
      <FormattedMessage id="message.unsavedApplication" />
    </IntlProvider>
  );

  return {
    customer,
    profileStatusUpdate,
    hasTaxNumber,
    messageWarningMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.warning" />
      </IntlProvider>
    ),
    areYouSure: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="title.areYouSure" />
      </IntlProvider>
    ),
    unsavedChanges: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.unsavedChanges" />
      </IntlProvider>
    ),
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      noSubmit: true,
      noAlerts: true,
    },
    auth: state["auth"],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateProfile: (profile) => {
      dispatch(updateCustomerProfile(profile)); //add permissions
    },
    makeEditable: () => {
      let $tabbedSection = document.querySelector(".no-border-tabbed-section");
      $tabbedSection.classList.toggle("editable");
    },
    saveProfile: () => {
      document.querySelector(".save-profile.btn").click();
    },
    saveDraft: () => {
      // let $elementsErrors = document.querySelectorAll('.form-text.error');
      // if ($elementsErrors && $elementsErrors.length > 0) {
      //   message.error({ content: 'Fix the errors before continuing!', key: 'updatable' });
      //   setTimeout(() => {
      //     $elementsErrors.forEach((e, idx) => {
      //       message.error({ content: e.innerText, key: idx, duration: 2 });
      //     }, 2000);
      //   });
      // } else {
      //   document.querySelector('.save-draft.btn').click();
      // }
      document.querySelector(".save-draft.btn").click();
    },
    cancelUpdate: () => {
      let $tabbedSection = document.querySelector(".no-border-tabbed-section");
      $tabbedSection.classList.toggle("editable");
      let $elementsErrors = document.querySelectorAll(".form-text.error");
      $elementsErrors.forEach((e) => e.remove());
      let $elementsHasError = document.querySelectorAll(
        ".has-error.has-message"
      );
      $elementsHasError.forEach((e) =>
        e.classList.remove(".has-error.has-message")
      );
      let $elementsIsInvalid = document.querySelectorAll(
        ".form-control.is-invalid"
      );
      $elementsIsInvalid.forEach((e) => e.classList.remove("is-invalid"));
    },
    setCurrentProfileAsDefault: (profile, userId) => {
      message.loading("Setting your default profile ...", 2.5).then(() => {
        dispatch(requestSetDefaultProfile(userId, profile._id));
        message.success(
          "Profile " + profile.fullName + " set as default.",
          2.5
        );
      });
    },
    getUserAndProfile: (customerId, userId, email, userCustomers) =>
      dispatch(getUserProfile(customerId, userId, email, userCustomers)),
    setProfile: (profile, role, permissions) =>
      dispatch(setUserProfile(profile, role, permissions)),
    startFlow: (
      definitionKey,
      applicationId,
      userId,
      data,
      setIsProcessStarted
    ) => {
      setIsProcessStarted(true);
      dispatch(startFlowByKey(definitionKey, applicationId, userId, data));
    },
  };
};

export default withAuthorization(
  "profile:visit",
  connect(mapStateToProps, mapDispatchToProps)(UserSettings)
);
