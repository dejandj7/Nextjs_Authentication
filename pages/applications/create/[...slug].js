import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FormIOForm from "../../../components/FormIO";
import PageLayout from "../../../components/PageLayout";
import { FormattedMessage, IntlProvider } from "react-intl";
import { message, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import SubBar from "../../../widgets/SubBar";
import { getApplicationTemplateByIdApi } from "../../../redux/applicationTemplates/api";
import {
  getTenderByIdApi,
  saveApplicationApi,
  updateApplicationApi,
} from "../../../redux/grants/api";
import { startFlowByKey } from "../../../redux/workflows/actions";
import withAuthorization from "../../../authorization/withAuthorization";
import { ButtonPrivate } from "../../../authorization/Private";
import _ from "lodash";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { applicationTable } from "../../../utilities/database.config";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
let applicationId = null;
let formioInstance = null;
let isCurrentlySaving = false;
let currency = "USD";

const CreateApplication = (props) => {
  const router = useRouter();
  const appTemplateId = router.query.slug[0];
  const tenderId = router.query.slug[1];
  const {
    auth,
    saveApplication,
    messageWarningMessage,
    messageTenderExpired,
    saveDraft,
    startFlow,
    currentLocale,
    options,
  } = props;

  // The application data
  const [submissionData, setSubmissionData] = useState({});
  // The application form
  const [form, setForm] = useState(null);
  // Data entered
  const [isFormDirty, setIsFormDirty] = useState(false);
  // Data valid
  const [isFormValid, setIsFormValid] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tenderExpired, setTenderExpired] = useState(null);
  const { data: session, status } = useSession();

  const onSubmitButton = (args) => {
    if (tenderExpired && tenderExpired < new Date()) {
      message.error(messageTenderExpired);
    } else {
      if (!_.isEmpty(args.instance.data) && !isCurrentlySaving) {
        isCurrentlySaving = true;
        var editedData = _.cloneDeep(args.instance.data);
        if (editedData["submit"] === true) {
          editedData["status"] = "Complete";
        }
        //sanitize data
        delete editedData.myprofile;
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
        const id = applicationTable.add(editedData);
        console.log(id);
        if (!formioInstance.isValid()) {
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
            Мodal.warning(content);
          }
        }
        try {
          if (applicationId === undefined || applicationId === null) {
            setIsSaving(true);
            saveApplicationApi({ data: editedData }).then((response) => {
              applicationId = response.data._id.$oid;
              message.success(
                `Application ${applicationId} successfully created!`
              );
              setSubmissionData({
                data: { ...response.data, myprofile: auth.myprofile },
              });
              setIsSaving(false);
              setIsFormDirty(false);
              isCurrentlySaving = false;
            });
          } else {
            setIsSaving(true);
            updateApplicationApi({
              data: { _id: applicationId, ...editedData },
            }).then((response) => {
              message.success(
                `Application ${applicationId} successfully updated!`
              );
              setSubmissionData({
                data: { ...response.data, myprofile: auth.myprofile },
              });
              setIsSaving(false);
              setIsFormDirty(false);
              isCurrentlySaving = false;
            });
          }
        } catch (error) {
          message.error("Error on application save: " + error.message);
          console.error("onSubmit catch error " + error);
          setIsSaving(false);
          isCurrentlySaving = false;
          throw new Error(error);
        }
      }
    }
  };

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

  useEffect(() => {
    setLoader(true);
    let formio = null;
    applicationId = null;
    isCurrentlySaving = false;
    let data = {
      status: "New",
      tenderDefinition: {
        currency: "USD",
      },
      myprofile: auth.myprofile,
      applicant: {
        applicantId: auth.myprofile._id,
        fullName: auth.myprofile.fullName,
      },
      appTemplateId,
      appliedBy: {
        userId: session.user.userId,
        userName: session.user.name,
        email: session.user.email,
      },
      createdOn: new Date(),
    };

    getApplicationTemplateByIdApi(appTemplateId).then((response) => {
      formio = response.data.Form;
      if (tenderId !== null && tenderId !== undefined) {
        getTenderByIdApi(tenderId).then((responseTender) => {
          if (responseTender.data !== null) {
            console.debug(responseTender.data);
            data.tenderDefinition = {
              ...data.tenderDefinition,
              tenderId: responseTender.data._id,
              currency: responseTender.data.financial.currency,
              title: responseTender.data.general.name,
              tenderEnd: responseTender.data.general.applicationDateTo,
              applicationReviewers: responseTender.data.applicationReviewers,
              documents: responseTender.data.documents,
              percentageOfcoFinancing:
                responseTender.data.financial.percentageOfcoFinancing,
            };
            setTenderExpired(
              new Date(responseTender.data.general.applicationDateTo)
            );
            currency = responseTender.data.financial.currency;
            data.financing = {
              budgetId: responseTender.data.financial.Source,
              budgetTitle: responseTender.data.financial.secondarySourceOfFunds,
            };
            data.coordinatorId = responseTender.data.general.coordinatorId;
            setSubmissionData({ data: data });
            formio = replaceCurrency(formio, currency);
            setForm(formio);
          }
        });
      } else {
        setSubmissionData({ data: data });
        setForm(formio);
      }
    });
    setLoader(false);
  }, [appTemplateId]);

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
      <Spin indicator={loadingIcon} size="large" spinning={loader}>
        {/* <Prompt
        when={isFormDirty}
        message="You have unsaved changes, are you sure you want to leave without saving?"
      /> */}
        <div>
          <Helmet title="Create an Application" />
          <div className="container air__utils__content">
            <SubBar
              mainTitle={
                <FormattedMessage id="topBar.createAnNewApplication" />
              }
              subTitle={
                <span>
                  <span>{auth.myprofile.fullName}</span>{" "}
                  <span>{tenderExpiration}</span>
                </span>
              }
              enableBackNavigation
            />
            <div className="card">
              <div className="card-body no-border-tabbed-section-application">
                {form ? (
                  <FormIOForm
                    className="mb-4 mt-4 text-left"
                    formReady={(instance) => {
                      formReady(instance);
                    }}
                    formObject={form}
                    options={options}
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
                  !("tenderId" in submissionData.data.tenderDefinition) &&
                  submissionData.data.status === "Complete" ? (
                    <ButtonPrivate
                      perform="application:send:review"
                      type="button"
                      onClick={() =>
                        startFlow(
                          "FreeApplicationInProcessId",
                          submissionData.data._id,
                          auth.user.userId,
                          {
                            userId: session.user.userId,
                            id: applicationId,
                            uri:
                              "apps/applications/view/" +
                              applicationId +
                              "/" +
                              submissionData.data.appTemplateId,
                            title: submissionData.data.projectTitle,
                            applicantId: submissionData.data.appliedBy.userId,
                            applicant: submissionData.data.applicant.fullName,
                            recipientsList: [
                              {
                                id: session.user.userId,
                                email: session.user.email,
                              },
                            ],
                            currency:
                              submissionData.data.tenderDefinition.currency,
                          }
                        )
                      }
                      className="btn btn-secondary btn-with-addon submit-app-btn"
                    >
                      <span className="btn-addon">
                        <i className="btn-addon-icon fa fa-send" />
                      </span>
                      <span className="btn-text">
                        <FormattedMessage id="content.submitApplication" />
                      </span>
                    </ButtonPrivate>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </PageLayout>
  );
};

const mapStateToProps = (state) => {
  const auth = state["auth"];
  const currentLocale = state.settings.locales[state.settings.locale];
  return {
    auth,
    applicationCreatedMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="application.created" />
      </IntlProvider>
    ),
    applicationDraftSavedMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="application.draftSaved" />
      </IntlProvider>
    ),
    applicationSaveErrorMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="application.saveError" />
      </IntlProvider>
    ),
    saveWarningMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.unsavedApplication" />
      </IntlProvider>
    ),
    messageWarningMessage: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.warning" />
      </IntlProvider>
    ),
    messageTenderExpired: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="message.tenderExpired" />
      </IntlProvider>
    ),
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      highlightErrors: true,
      noSubmit: true,
      noAlerts: true,
    },
    currentLocale,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveApplication: () => {
      console.log("saveApplication");
      document.querySelector(".save-application.btn").click();
    },
    saveDraft: () => {
      document.querySelector(".save-draft.btn").click();
    },
    startFlow: (definitionKey, applicationId, userId, data) => {
      dispatch(startFlowByKey(definitionKey, applicationId, userId, data));
      message.success("Application sent!");
    },
  };
};

export default withAuthorization(
  "application:create",
  connect(mapStateToProps, mapDispatchToProps)(CreateApplication)
);
