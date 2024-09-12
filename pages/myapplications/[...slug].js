import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ContextDrawer from "../../components/ContextDrawer";
import FormIOForm from "../../components/FormIO";
import PageLayout from "../../components/PageLayout";
import SubBar from "../../widgets/SubBar";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Menu, Spin, message, Modal } from "antd";
import { LoadingOutlined, FilePdfOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { AppConfig } from "../../utilities/config";
import {
  getMyApplicationWithProfileAndTenderByIdApi,
  updateApplicationApi,
} from "../../redux/grants/api";
import { getApplicationTemplateByIdApi } from "../../redux/applicationTemplates/api";
import { startFlowByKey } from "../../redux/workflows/actions";
import withAuthorization from "../../authorization/withAuthorization";
import axios from "axios";
import ApplicationStatus from "../../components/Status/applicationStatus";
import { resetApplicationStatus } from "../../redux/application/actions";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { applicationTable } from "../../utilities/database.config";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let formioInstance = null;
let currency = "USD";
let isCurrentlySaving = false;

const CustomerApplications = (props) => {
  const router = useRouter();
  const applicationId = router.query.slug[0];
  const appTemplateId = router.query.slug[1];
  const {
    path,
    options,
    messageWarningMessage,
    getPDFDocument,
    saveApplication,
    saveDraft,
    startFlow,
    currentLocale,
    auth,
    applicationUpdate,
    resetAppStatus,
    connectionStatus,
  } = props;
  // The application form
  const [form, setForm] = useState(null);
  // The modified state
  const [isFormDirty, setIsFormDirty] = useState(false);
  // Data valid
  const [isFormValid, setIsFormValid] = useState(false);
  // The application status
  const [appStatus, setAppStatus] = useState(null);
  // The profile data
  const [profile, setProfile] = useState({});
  const [hasAccess, setHasAccess] = useState(false);
  // The application data
  const [submissionData, setSubmissionData] = useState({});
  const [loader, setLoader] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tenderExpired, setTenderExpired] = useState(null);
  const [isTenderApp, setIsTenderApp] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const { data: session, status } = useSession();

  function onChange(instance, event, isWizardDirty) {
    if (isWizardDirty !== undefined) {
      if (isWizardDirty === true) {
        setIsFormDirty(true);
      }
      setIsFormValid(formioInstance.checkValidity());
    }
  }

  function formReady(instance) {
    formioInstance = instance;
  }

  function replaceCurrency(form, currency) {
    if ("type" in form && form["type"].toString() === "columns") {
      form["columns"].forEach((column) => {
        replaceCurrency(column, currency);
      });
    } else {
      if ("prefix" in form && form["prefix"].toString() === "USD") {
        form["prefix"] = currency;
      }

      if ("components" in form) {
        form["components"].forEach((component) => {
          replaceCurrency(component, currency);
        });
      }
    }
    return form;
  }

  const onSubmitButton = (args) => {
    // allow only when application returned to applicant to adjust
    if (
      appStatus !== "ApprovedWithAdjustment" &&
      tenderExpired &&
      tenderExpired < new Date()
    ) {
      message.error(messageTenderExpired);
    } else {
      if (!_.isEmpty(args.instance.data) && !isCurrentlySaving) {
        isCurrentlySaving = true;
        var editedData = _.cloneDeep(args.instance.data);
        if (editedData["submit"] === true && editedData["status"] === "New") {
          editedData["status"] = "Complete";
          setAppStatus("Complete");
        }
        //sanitize data
        delete editedData.myprofile;
        delete editedData.tender;
        FormioUtils.searchComponents(formioInstance.form.components, {
          type: "datetime",
        }).forEach((e, indx) => {
          if (e.attributes.date) {
            editedData[e.key] = editedData[e.key].slice(0, 10);
          }
        });
        FormioUtils.searchComponents(formioInstance.form.components, {
          persistent: false,
        }).forEach((e, indx) => {
          delete editedData[e.key];
        });
        console.log(id);
        if (!isFormValid) {
          let errors = [];
          const errorsOnForm = formioInstance.showErrors();
          if (errorsOnForm !== undefined && errorsOnForm.length > 0) {
            errorsOnForm.forEach((e, indx) => {
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
        try {
          setIsSaving(true);
          if (connectionStatus === "Connected") {
            updateApplicationApi({ data: editedData }).then((response) => {
              message.success(
                `Application ${response._id} successfully updated!`
              );
              setSubmissionData({ data: { ...response, myprofile: profile } });
              setIsSaving(false);
              setIsFormDirty(false);
              isCurrentlySaving = false;
            });
          } else {
            const id = applicationTable.add(editedData);
          }
          setLoader(false);
        } catch (error) {
          setLoader(false);
          message.error("Error on application update: " + error.message);
          console.error("onSubmit catch error " + error);
          isCurrentlySaving = false;
          setIsSaving(false);
          throw new Error(error);
        }
      }
    }
  };

  const contextMenu = (
    <Menu>
      <Menu.Item key="0">
        <a className="d-block">
          <i className="btn-addon-icon fe fe-check-circle" />
          <FormattedMessage id="actionButton.relatedtasks" />
        </a>
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      <Menu.Item key="6">
        <a
          className="d-block"
          onClick={() => {
            getPDFDocument(submissionData);
          }}
        >
          <FilePdfOutlined /> Download PDF
        </a>
      </Menu.Item>
    </Menu>
  );

  const setApplicationWithTender = (data) => {
    setProfile(data.myprofile);
    setSubmissionData({ data: { ...data } });
    setAppStatus(data.status);
    let userHasAccess =
      data.coordinatorId === session.user.userId ||
      data.applicant.applicantId === auth.myprofile._id;
    if (data.tenderId !== null) {
      setIsTenderApp(true);
      setHasAccess(userHasAccess);
      if (data.tender) {
        setTenderExpired(new Date(data.tender.general.applicationDateTo));
      }
    } else {
      setHasAccess(userHasAccess);
    }
    setIsProcessStarted(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    setLoader(true);
    Promise.all([
      getMyApplicationWithProfileAndTenderByIdApi(
        applicationId,
        auth.myprofile._id,
        abortController.signal
      ),
      getApplicationTemplateByIdApi(appTemplateId),
    ])
      .then((result) => {
        let aborted = abortController.signal.aborted;
        if (aborted === false) {
          setApplicationWithTender(result[0].data);
          currency = result[0].data.tenderDefinition.currency;
        }
        let formio = replaceCurrency(result[1].data.Form, currency);
        setForm(formio);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });

    return () => {
      abortController.abort();
    };
  }, [applicationId, appTemplateId]);

  useEffect(() => {
    if (
      applicationUpdate &&
      applicationUpdate.data &&
      applicationUpdate.data._id === applicationId &&
      applicationUpdate.data.status !== appStatus
    ) {
      setLoader(true);
      getApplicationWithProfileAndTenderByIdApi(applicationId)
        .then((result) => {
          setApplicationWithTender(result.data);
          setLoader(false);
          resetAppStatus();
        })
        .catch(() => {
          setLoader(false);
        });
    }
  }, [applicationUpdate]);

  if (isSaving) {
    return (
      <>
        <Spin
          indicator={loadingIcon}
          tip={<FormattedMessage id="loader.saving" />}
        >
          <div className="full-loader"></div>
        </Spin>
      </>
    );
  }

  const tenderExpiration = tenderExpired ? (
    <span>
      {" "}
      / <FormattedMessage id="topBar.tenderExpires" />{" "}
      {tenderExpired.toLocaleDateString(currentLocale)}
    </span>
  ) : (
    ""
  );

  return (
    <PageLayout>
      <div>
        {/* <Prompt
        when={isFormDirty}
        message="You have unsaved changes, are you sure you want to leave without saving?"
      /> */}
        <Spin indicator={loadingIcon} size="large" spinning={loader}>
          <div className="air__utils__content">
            <Helmet title="View Application" />
            <SubBar
              mainTitle={<FormattedMessage id="topBar.application" />}
              subTitle={
                <span>
                  <span>{auth.myprofile ? auth.myprofile.fullName : ""}</span>{" "}
                  <span>{tenderExpiration}</span>
                </span>
              }
              contextMenu={contextMenu}
              enableBackNavigation
            />
            <div className="row">
              <div className="col-xs-12 col-lg-12">
                {isSaving ? (
                  <>
                    <Spin
                      indicator={loadingIcon}
                      tip={<FormattedMessage id="loader.saving" />}
                    >
                      <div className="full-loader"></div>
                    </Spin>
                  </>
                ) : (
                  <div className="card">
                    <ApplicationStatus status={appStatus} />
                    <div className="card-body no-border-tabbed-section-application">
                      {form ? (
                        <FormIOForm
                          className="mb-4 mt-4 text-left"
                          formReady={(instance) => {
                            formReady(instance);
                          }}
                          options={options}
                          formObject={form}
                          submission={submissionData}
                          onSubmitButton={onSubmitButton}
                          onChange={onChange}
                        />
                      ) : (
                        <></>
                      )}
                      <div>
                        {isFormValid ? (
                          <button
                            type="button"
                            onClick={saveApplication}
                            className="btn btn-success btn-with-addon save-application-btn"
                          >
                            <span className="btn-addon">
                              <i className="btn-addon-icon fe fe-check-square" />
                            </span>
                            <span className="btn-text">
                              <FormattedMessage id="content.saveProfile" />
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={saveDraft}
                            className="btn btn-warning btn-with-addon draft-btn"
                          >
                            <span className="btn-addon">
                              <i className="btn-addon-icon fe fe-save" />
                            </span>
                            <span className="btn-text">
                              <FormattedMessage id="content.saveDraft" />
                            </span>
                          </button>
                        )}
                        {submissionData.data &&
                        submissionData.data.status === "Complete" &&
                        !isProcessStarted ? (
                          <button
                            type="button"
                            onClick={() =>
                              startFlow(
                                submissionData.data &&
                                  submissionData.data.tenderDefinition &&
                                  submissionData.data.tenderDefinition.tenderId
                                  ? "ApplicationSubmitId"
                                  : "FreeApplicationInProcessId",
                                submissionData.data._id,
                                session.user.userId,
                                {
                                  id: submissionData.data._id,
                                  uri:
                                    "apps/applications/" +
                                    submissionData.data._id +
                                    "/" +
                                    submissionData.data.appTemplateId,
                                  title: submissionData.data.projectTitle,
                                  coordinatorId:
                                    submissionData.data.coordinatorId,
                                  tenderId:
                                    submissionData.data.tenderDefinition
                                      .tenderId,
                                  applicantId:
                                    submissionData.data.appliedBy.userId,
                                  applicant:
                                    submissionData.data.applicant.fullName,
                                  recipientsList: [
                                    {
                                      id: session.user.userId,
                                      email: session.user.email,
                                    },
                                  ],
                                  projectName: submissionData.data.projectTitle,
                                  tenderName:
                                    submissionData.data.tenderDefinition.title,
                                },
                                setIsProcessStarted
                              )
                            }
                            className="btn btn-success btn-with-addon submit-app-btn"
                          >
                            <span className="btn-addon">
                              <i className="btn-addon-icon fa fa-send" />
                            </span>
                            <span className="btn-text">
                              <FormattedMessage id="content.submitApplication" />
                            </span>
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <ContextDrawer
              // contextOptions={contextOptions}
              // contextDrawerMainWidth='40%'
              // contextClose={() => {
              //   setContextMenuVisible(false);
              //   setContextData(null);
              //   setContextPresentationType('');
              // }}
              // contextToggle={contextMenuVisible}
              // contextData={contextData}
              // dataPresentationType={contextPresentationType}
              />
            </div>
          </div>
        </Spin>
      </div>
    </PageLayout>
  );
};

const mapStateToProps = (state) => {
  const currentLocale = state.settings.locales[state.settings.locale];
  const applicationUpdate = state["application"].data;
  return {
    auth: state["auth"],
    connectionStatus: state.userTask.signalR,
    currentLocale,
    applicationUpdate,
    messageWarningMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.warning" />
      </IntlProvider>
    ),
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      noAlerts: true,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveApplication: () => {
      document.querySelector(".save-application.btn").click();
    },
    saveDraft: () => {
      document.querySelector(".save-draft.btn").click();
    },
    getPDFDocument: (submissionData) => {
      message.loading({ content: "Generating PDF...", key: 0, duration: 0 });
      const headers = {
        Accept: "application/pdf",
      };
      axios
        .post(
          AppConfig.apiUrl + "/document/bookmarks",
          { ...submissionData.data },
          { headers: headers }
        )
        .then((result) => {
          let file = result.data;
          message.destroy(0);
          message.success("PDF generated. Downloading now ...");
          var link = document.createElement("a");
          link.href = "data:application/pdf;base64," + file.fileContents;
          link.download = file.fileDownloadName;
          link.click();
        })
        .catch((error) => {
          message.destroy(0);
          console.error("Generate PDF catch error " + error);
          message.error("Generate PDF catch error " + error);
        });
    },
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
    resetAppStatus: () => dispatch(resetApplicationStatus()),
  };
};

export default withAuthorization(
  "customerapplication:edit",
  connect(mapStateToProps, mapDispatchToProps)(CustomerApplications)
);
