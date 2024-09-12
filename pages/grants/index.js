import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Button, Drawer, Spin } from "antd";
import { EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Helmet } from "react-helmet";
import SubBar from "../../widgets/SubBar";
import { startFlowByKey } from "../../redux/workflows/actions";
import { getDocumentsDataTableApi } from "../../redux/generic/api";
import PagedTable from "../../components/Table";
import { getColumnSearchProps } from "../../components/Table/utils";
import withAuthorization from "../../authorization/withAuthorization";
import FormIOForm from "../../components/FormIO";
import PageLayout from "../../components/PageLayout";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const GrantsList = (props) => {
  const {
    currentLocale,
    optionsReadOnly,
    form,
    startFlow,
    grantsReceivedSuccess,
    grantsReceivedError,
    auth,
  } = props;
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Searched column
  const [searchedColumn, setSearchedColumn] = useState("");
  // Search text
  const [searchText, setSearchText] = useState("");
  const tableColumns = [
    {
      name: "isGrant",
      searchable: true,
      search: { value: true, regex: false },
    },
    { name: "grantNumberId", include: true, regex: true, multi: false },
    { name: "status", include: true, regex: true, multi: true },
    { name: "applicant", include: true, regex: true, multi: false },
    { name: "appliedBy", include: true, regex: true, multi: false },
    { name: "appTemplateId", include: true, regex: true, multi: false },
    { name: "projectTitle", include: true, regex: true, multi: false },
    { name: "tenderDefinition", include: true, regex: true, multi: false },
    { name: "totalBudget", include: true, regex: true, multi: false },
    { name: "createdOn", include: true, regex: true, multi: false },
  ];
  // Filters
  const [filters, setFilters] = useState(tableColumns);
  const statusFilters = [
    { text: <FormattedMessage id="filter.signed" />, value: "Signed" },
    { text: <FormattedMessage id="filter.finished" />, value: "Finished" },
    { text: <FormattedMessage id="filter.closed" />, value: "Closed" },
  ];

  const columns = [
    {
      title: <FormattedMessage id="title.grantNumber" />,
      dataIndex: "grantNumberId",
      ...getColumnSearchProps(
        "grantNumberId",
        searchText,
        searchedColumn,
        setSearchText,
        setSearchedColumn
      ),
    },
    {
      title: <FormattedMessage id="title.year" />,
      dataIndex: "applicationYear",
      render: (text, row, index) => {
        return (
          <span>
            {new Date(row.createdOn).toLocaleDateString(currentLocale, {
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.applicant" />,
      dataIndex: "applicant.fullName",
      ...getColumnSearchProps(
        "applicant.fullName",
        searchText,
        searchedColumn,
        setSearchText,
        setSearchedColumn
      ),
      render: (text, row, index) => {
        return <span>{row.applicant.fullName}</span>;
      },
    },
    {
      title: <FormattedMessage id="title.projectTitle" />,
      dataIndex: "projectTitle",
      ...getColumnSearchProps(
        "projectTitle",
        searchText,
        searchedColumn,
        setSearchText,
        setSearchedColumn
      ),
    },
    {
      title: <FormattedMessage id="title.status" />,
      dataIndex: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, row, index) =>
        row.status
          ? statusFilters.filter((s) => s.value === text)[0].text
          : "N/A",
    },
    {
      title: <FormattedMessage id="title.actions" />,
      dataIndex: "actions",
      render: (text, row, index) => {
        return (
          <span>
            <Link href={`/grants/${row._id}`}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                className="mr-2"
              ></Button>
            </Link>
          </span>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <div className="air__utils__content">
        <Helmet title="Dashoard: Grants" />
        <SubBar
          mainTitle={<FormattedMessage id="topBar.dashboards" />}
          subTitle={<FormattedMessage id="topBar.grants" />}
        />
        <div className="row">
          <div className="col-xs-12 col-lg-12">
            <div className="card">
              <div className="card-body">
                <PagedTable
                  successMessage={grantsReceivedSuccess}
                  errorMessage={grantsReceivedError}
                  getDataApi={getDocumentsDataTableApi}
                  filters={filters}
                  loading={isLoading}
                  columns={columns}
                  collection={"Applications"}
                  rowKey={"_id"}
                />
              </div>
            </div>
          </div>
        </div>
        <Drawer
          title="View Grants Details"
          width="90%"
          closable={false}
          onClose={() => {
            setViewDrawerVisible(false);
          }}
          visible={viewDrawerVisible}
        >
          {selectedApplicant ? (
            <div className="row">
              <div className="col-12">
                <FormIOForm
                  className="mb-4 mt-4 text-left"
                  form={form}
                  submission={{ data: selectedApplicant }}
                  options={optionsReadOnly}
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
    </PageLayout>
  );
};

const mapStateToProps = (state) => {
  const currentLocale = state.settings.locales[state.settings.locale];
  return {
    grantsReceivedSuccess: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="grants.received" />
      </IntlProvider>
    ),
    grantsReceivedError: (
      <IntlProvider
        locale={currentLocale.locale}
        messages={currentLocale.messages}
      >
        <FormattedMessage id="grants.error" />
      </IntlProvider>
    ),
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
    },
    optionsReadOnly: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      readOnly: true,
    },
    auth: state["auth"],
    currentLocale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startFlow: (definitionKey, applicationId, userId, data) =>
      dispatch(startFlowByKey(definitionKey, applicationId, userId, data)),
  };
};

export default withAuthorization(
  "grants:list",
  connect(mapStateToProps, mapDispatchToProps)(GrantsList)
);
