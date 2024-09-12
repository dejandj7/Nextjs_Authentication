import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Spin, Table, Tooltip, Button, Drawer, Empty } from "antd";
import Link from "next/link";
import { SelectOutlined, LoadingOutlined } from "@ant-design/icons";
import { getTenders } from "../../../redux/tenders/actions";
import FormIOForm from "../../../components/FormIO";
import { DashConfig, AppsConfig } from "../../../utilities/config";
import ContextDrawer from "../../../components/ContextDrawer";
import { FormattedMessage, IntlProvider } from "react-intl";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const TenderList = (props) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextOptions, setContextOptions] = useState({});
  // The data or datum to send to the context drawer
  const [contextData, setContextData] = useState([]);
  // The action to perform when the context drawer is loaded
  const [contextDataAction, setContextDataAction] = useState(null);
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  // The presentation type for the drawer. Curerntly only 'list' and 'form' are available
  const [contextPresentationType, setContextPresentationType] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [unrelatedTemplate, setUnrelatedTemplate] = useState(null);
  // The form
  const [form, setForm] = useState({});

  const {
    auth,
    unrelatedData,
    grantsReceivedSuccess,
    grantsReceivedError,
    optionsReadOnly,
    currentLocale,
    applications,
    tenders,
    refreshTenders,
    fetchTenders,
    isLoading,
  } = props;

  const comparisonStatusAndTemplates = (status, templates, tenderId) => {
    if (status !== 5) {
      return <FormattedMessage id="title.ProfileNotApproved" />;
    }
    if (templates === null) {
      return <FormattedMessage id="title.NotProvidedForThisProfileType" />;
    }
    if (
      applications.filter((a) => a.tenderDefinition.tenderId === tenderId)
        .length > 0
    ) {
      return (
        <FormattedMessage id="title.theApplicationHasAlreadyBeenCompleted" />
      );
    }
    return <FormattedMessage id="title.createNewApplication" />;
  };

  const columns = [
    {
      title: <FormattedMessage id="title.grant" />,
      width: 100,
      dataIndex: "tenderName",
      render: (text, row, index) => {
        return (
          <span>
            <a
              onClick={() => {
                setViewDrawerVisible(true);
                setSelectedTender(row);
              }}
            >
              {row.general ? row.general.name : ""}
            </a>
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.period" />,
      width: 100,
      dataIndex: "period",
      render: (text, row, index) => {
        return (
          <span>
            {new Date(row.general.applicationDateFrom).toLocaleDateString(
              currentLocale
            )}
            <span> - </span>
            {new Date(row.general.applicationDateTo).toLocaleDateString(
              currentLocale
            )}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.budgetAmount" />,
      width: 100,
      dataIndex: "amount",
      align: "right",
      render: (text, row, index) => {
        return (
          <span>
            {new Intl.NumberFormat(currentLocale, {
              style: "currency",
              currency: row.financial.currency,
            }).format(row.financial ? row.financial.amount : 0)}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.apply" />,
      key: "action",
      align: "center",
      fixed: "right",
      width: 20,
      render: (text, row, index) => {
        return (
          <Tooltip
            title={comparisonStatusAndTemplates(
              auth.myprofile.customerStatusID,
              auth.myprofile.isLegalEntity
                ? row.templates.organizationalTemplate
                : row.templates.individualTemplate,
              row._id
            )}
          >
            <Link
              href={"".concat(
                "/applications/create",
                "/",
                auth.myprofile.isLegalEntity
                  ? row.templates.organizationalTemplate
                  : row.templates.individualTemplate,
                "/",
                row._id
              )}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<SelectOutlined />}
                size="small"
                id={row.key}
                disabled={
                  (auth.myprofile.customerStatusID &&
                    auth.myprofile.customerStatusID !== null &&
                    auth.myprofile.customerStatusID !== 5) ||
                  (auth.myprofile.isLegalEntity &&
                    row.templates.organizationalTemplate === "") ||
                  (!auth.myprofile.isLegalEntity &&
                    row.templates.individualTemplate === "") ||
                  applications.filter(
                    (a) => a.tenderDefinition.tenderId === row._id
                  ).length > 0
                }
              />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    if (refreshTenders) {
      fetchTenders(true);
    }
  }, [refreshTenders]);

  return (
    <div>
      <div className="air__utils__content">
        <div className="d-flex flex-wrap">
          <div className="mr-auto pr-3 my-2">
            <i className="fe fe-book font-size-21 mr-2" />
            <div className="text-nowrap d-inline-block font-size-18 text-dark">
              <FormattedMessage id="topBar.allaActiveTenders" />
            </div>
            <div>
              <FormattedMessage id="title.CallsCanOnlyApplyToASpecificProfileType" />
              <span>. </span>
              {auth.myprofile && auth.myprofile.customerStatusID !== 5 ? (
                <strong>
                  <FormattedMessage id="title.YouCanOnlyApplyToTheCallWithACompletedAndApprovedProfile" />
                </strong>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap font-size-16">
            <div className="mr-3 my-2 text-nowrap">
              <i className="fe fe-star font-size-21 mr-1" />
              <FormattedMessage id="grant.label" />
              <strong className="text-dark font-size-18 ml-1">
                {tenders.length}
              </strong>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={tenders}
          rowKey={(record) => record._id}
          loading={isLoading}
          pagination={tenders.length > 5 ? true : false}
        />
        <Drawer
          title={<FormattedMessage id="topBar.grantDefinitionDetails" />}
          width="90%"
          closable={false}
          onClose={() => {
            setViewDrawerVisible(false);
          }}
          open={viewDrawerVisible}
        >
          {selectedTender ? (
            <div className="row">
              <div className="col-12">
                <FormIOForm
                  className="mb-4 mt-4 text-left"
                  {...props}
                  submission={{ data: { ...selectedTender } }}
                  options={optionsReadOnly}
                  form={DashConfig.tenderdesc.form}
                />
              </div>
            </div>
          ) : (
            <Spin
              indicator={loadingIcon}
              tip={<FormattedMessage id="loader.applicant" />}
            >
              <div className="full-loader"></div>
            </Spin>
          )}
        </Drawer>
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
  );
};

const mapStateToProps = (state) => {
  const currentLocale = state.settings.locales[state.settings.locale];
  const applications = state["auth"]?.applications
    ? state["auth"]?.applications
    : [];
  const tenders = state["tenders"]?.data ? state["tenders"]?.data : [];

  return {
    grantsReceivedSuccess: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="grantdefinitions.received" />
      </IntlProvider>
    ),
    grantsReceivedError: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="grantdefinitions.error" />
      </IntlProvider>
    ),
    currentLocale,
    optionsReadOnly: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      readOnly: true,
    },
    auth: state["auth"],
    applications,
    tenders,
    refreshTenders: state["tenders"].refreshTenders,
    isLoading: state["tenders"].isLoading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchTenders: (filtered) => dispatch(getTenders(filtered)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenderList);
