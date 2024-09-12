import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppsConfig } from "../../utilities/config";
import { getGrantWithProfileAndOrdersByIdApi } from "../../redux/grants/api";
import FormIOForm from "../../components/FormIO";
import { FormattedMessage, injectIntl } from "react-intl";
import { Helmet } from "react-helmet";
import SubBar from "../../widgets/SubBar";
import {
  LoadingOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Empty,
  message,
  Tabs,
  Menu,
  Table,
  List,
  Tag,
  Drawer,
  Spin,
  Typography,
  Badge,
  Button,
  Tooltip,
} from "antd";
import Status from "../../components/Status";
import General1v2 from "../../widgets/General/1v2";
import Statuses from "../../components/ApplicationStatuses";
import ContextDrawer from "../../components/ContextDrawer";
import DynamicTable from "../../components/Table/DynamicTable";
import withAuthorization from "../../authorization/withAuthorization";
import CustomerProfile from "../../components/CustomerProfile";
import AllApplications from "../../components/AllApplications";
import { updateDocumentPropertyApi } from "../../redux/generic/api";
import {
  downloadSpsFromUrl,
  getMimeTypeFromExtension,
} from "../../utilities/Utils";
import { endApi } from "../../redux/workflows/actions";
import PageLayout from "../../components/PageLayout";
import { useRouter } from "next/router";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Text } = Typography;
let formioInstance = null;

const GrantDetails = (props) => {
  const router = useRouter();
  const { grantId } = router.query;
  const { auth, userTasks, currentLocale, optionsReadOnly, endApi, intl } =
    props;
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextOptions, setContextOptions] = useState({});
  // The data or datum to send to the context drawer
  const [contextData, setContextData] = useState([]);
  // The action to perform when the context drawer is loaded
  const [contextDataAction, setContextDataAction] = useState(null);
  // The presentation type for the drawer. Curerntly only 'list' and 'form' are available
  const [contextPresentationType, setContextPresentationType] = useState(false);
  const [error, setError] = useState(null);
  // The application data
  const [grantData, setGrantData] = useState(null);
  const [grantNumber, setGrantNumber] = useState("");
  // The profile data
  const [profile, setProfile] = useState({});
  // The application status
  const [status, setStatus] = useState(null);
  const [customerDetailsVisible, setCustomerDetailsVisible] = useState(false);
  const [applicationsVisible, setApplicationsVisible] = useState(false);
  const [applicationDocs, setApplicationDocs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reportLate, setReportLate] = useState(false);
  const { TabPane } = Tabs;
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [submissionData, setSubmissionData] = useState({});
  const [form, setForm] = useState({});
  const [orderForm, setOrderForm] = useState({});
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [viewOrderDrawerVisible, setViewOrderDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetHistoryData, setBudgetHistoryData] = useState([]);
  const [budgetHistoryColumns, setBudgetHistoryColumns] = useState([]);
  const [spendingHistoryData, setSpendingHistoryData] = useState([]);
  const [spendingHistoryColumns, setSpendingHistoryColumns] = useState([]);

  const updateOtherDocumentsApi = (data) => {
    const payload = {
      key: "_id",
      keyData: grantId,
      collection: "Applications",
      isObjectId: true,
      property: "otherDocuments",
      propertyData: data.otherDocuments,
    };
    updateDocumentPropertyApi(payload)
      .then((response) => {
        message.success("Documents updated!");
        setApplicationDocs(payload.otherDocuments);
        endApi();
      })
      .catch((error) => {
        console.error(error);
        message.error(
          `Update of the documents for application ${grantId} failed!`
        );
      });
  };

  const psCols = [
    {
      title: <FormattedMessage id="title.date" />,
      dataIndex: "date",
      render: (text, row, index) => {
        return (
          <Text
            type={
              new Date(row.date) < new Date() && row.status !== "Approved"
                ? "danger"
                : "default"
            }
          >
            {new Date(row.date).toLocaleDateString(currentLocale)}
          </Text>
        );
      },
    },
    {
      title: <FormattedMessage id="userProfile.completed" />,
      dataIndex: "date",
      render: (text, row, index) => {
        return (
          <span>
            {row.completedDate
              ? new Date(row.completedDate).toLocaleDateString(currentLocale)
              : "N\\A"}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.type" />,
      dataIndex: "reportType",
      key: "reportType",
    },
    {
      title: <FormattedMessage id="title.status" />,
      dataIndex: "status",
      key: "status",
      render: (text, row, index) => {
        var stat = row.status;
        if (stat === "Approved") {
          return (
            <Tag color="green" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        } else if (stat === "Pending") {
          return (
            <Tag color="gold" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        } else {
          return (
            <Tag color="blue" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      // Use download method
      render: (text, row, index) => {
        return (
          <span>
            <Tooltip title={<FormattedMessage id="button.view" />}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setViewDrawerVisible(true);
                  setSelectedReport(row);
                  setSubmissionData({ data: row });
                }}
              />
            </Tooltip>
          </span>
        );
      },
    },
  ];
  const ordersCols = [
    {
      title: <FormattedMessage id="title.date" />,
      dataIndex: "paymentDate",
      render: (text, row, index) => {
        return (
          <span>
            {new Date(row.paymentDate).toLocaleDateString(currentLocale)}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.account" />,
      dataIndex: "accountNumber",
      key: "account",
    },
    {
      title: <FormattedMessage id="title.status" />,
      dataIndex: "status",
      key: "status",
      render: (text, row, index) => {
        var stat = row.status;
        if (stat === "Completed") {
          return (
            <Tag color="green" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        } else if (stat === "Pending") {
          return (
            <Tag color="gold" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        } else {
          return (
            <Tag color="blue" key={stat}>
              {stat.toUpperCase()}
            </Tag>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="title.amount" />,
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (text, row, index) => {
        return (
          <span>
            {new Intl.NumberFormat(currentLocale, {
              style: "currency",
              currency: currency,
            }).format(row.amount)}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.action" />,
      key: "action",
      render: (text, row, index) => {
        return (
          <span>
            <Tooltip title={<FormattedMessage id="button.view" />}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setViewOrderDrawerVisible(true);
                  setSelectedOrder(row);
                  setSubmissionData({ data: row });
                }}
              />
            </Tooltip>
          </span>
        );
      },
    },
  ];
  const accountingCols = [
    {
      title: <FormattedMessage id="title.date" />,
      dataIndex: "date",
      render: (text, row, index) => {
        return (
          <span>{new Date(row.date).toLocaleDateString(currentLocale)}</span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.amount" />,
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (text, row, index) => {
        return (
          <span>
            {new Intl.NumberFormat(currentLocale, {
              style: "currency",
              currency: "MKD",
            }).format(row.amount)}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="title.amountGrantCurrency" />,
      dataIndex: "amountOriginalCurrency",
      key: "amountOriginalCurrency",
      align: "right",
      render: (text, row, index) => {
        return (
          <span>
            {new Intl.NumberFormat(currentLocale, {
              style: "currency",
              currency: currency,
            }).format(row.amountOriginalCurrency)}
          </span>
        );
      },
    },
  ];
  const docCols = [
    {
      title: <FormattedMessage id="title.name" />,
      dataIndex: "originalName",
      key: "name",
    },
    {
      title: <FormattedMessage id="title.action" />,
      key: "action",
      render: (text, row, index) => (
        <>
          {/* <a
            className="btn btn-sm"
            target="_blank"
            href={`${row.shareUrl}`}
            rel="noopener noreferrer"
          >
            <i className="fe fe-download"></i>
          </a> */}
          <span>
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() =>
                downloadSpsFromUrl(
                  row.url,
                  row.type
                    ? row.type
                    : getMimeTypeFromExtension(
                        row.originalName.substring(
                          row.originalName.lastIndexOf(".") + 1
                        )
                      ),
                  row.originalName
                )
              }
            ></Button>
          </span>
        </>
      ),
      // Use download method
      // render: (text, row, index) => {
      //   return (
      //     <span>
      //       <Button icon={<DownloadOutlined />} size="small" onClick={() => downloadSps(row.url)}>
      //       </Button>
      //     </span>
      //   );
      // },
    },
  ];

  const contextMenu = (
    <Menu>
      <Menu.Item key="0">
        <a
          className="d-block"
          onClick={() => {
            setContextMenuVisible(true);
            setContextOptions(
              <FormattedMessage id="actionButton.relatedtasks" />
            );
            setContextData([
              grantId,
              userTasks.filter((task) => {
                return (
                  grantId &&
                  task.data &&
                  task.data.data &&
                  task.data.data.id &&
                  task.data.data.id === grantId
                );
              }),
            ]);
            setContextPresentationType("relatedTasks");
          }}
        >
          <i className="btn-addon-icon fe fe-check-circle" />{" "}
          <FormattedMessage id="actionButton.relatedtasks" />
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a
          className="d-block"
          onClick={() => {
            setCustomerDetailsVisible(true);
          }}
        >
          <i className="btn-addon-icon fe fe-user-check" />{" "}
          <FormattedMessage id="actionButton.customerProfile" />
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a
          className="d-block"
          onClick={() => {
            setApplicationsVisible(true);
          }}
        >
          <i className="btn-addon-icon fe fe-user-check" />{" "}
          <FormattedMessage id="actionButton.customerApplications" />
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <a
          className="d-block"
          onClick={() => {
            setContextMenuVisible(true);
            setContextOptions({
              title: <FormattedMessage id="context.createOrder" />,
            });
            setContextPresentationType("actionButton");
            setContextData({
              formKey: "makepayment",
              data: {
                id: grantId,
                uri: "grants/" + grantId,
                title: grantData.projectTitle,
                applicant: grantData.applicant.fullName,
                accountNumber: grantData.account.accountNumber,
                currency: currency,
                approvedAmount,
                remainingAmount,
                paidAmount,
                paymentDate: new Date(),
                userId: auth.user.id,
                orderRegisteredBy: auth.user.fullName,
                grantNumber: grantNumber,
                financing: grantData.financing,
                recipients: [
                  {
                    email: grantData.appliedBy.email,
                  },
                ],
              },
              processKey: "PaymentOrderId",
            });
          }}
        >
          <i className="btn-addon-icon fe fe-dollar-sign" />{" "}
          <FormattedMessage id="actionButton.paymentOrder" />
        </a>
      </Menu.Item>
      <Menu.Item key="4">
        <a
          className="d-block"
          onClick={() => {
            setContextMenuVisible(true);
            setContextOptions({
              title: (
                <FormattedMessage id="actionButton.changeReportSchedule" />
              ),
            });
            setContextPresentationType("actionButton");
            setContextData({
              formKey: "changeReportSchedule",
              data: {
                id: grantId,
                uri: "grants/" + grantId,
                title: grantData.projectTitle,
                applicant: grantData.applicant.fullName,
                userId: auth.user.id,
                reportSchedule: grantData.reportSchedule, //.filter((e) => e.status !== 'Approved'),
                grantNumber: grantNumber,
              },
              processKey: "ChangeReportScheduleId",
            });
          }}
        >
          <i className="btn-addon-icon fe fe-list" />{" "}
          <FormattedMessage id="actionButton.changeReportSchedule" />
        </a>
      </Menu.Item>
      <Menu.Item key="5">
        <a
          className="d-block"
          onClick={() => {
            setContextMenuVisible(true);
            setContextOptions({
              title: <FormattedMessage id="actionButton.completeGrant" />,
            });
            setContextPresentationType("actionButton");
            setContextData({
              formKey: "completeGrant",
              data: {
                id: grantId,
                uri: "grants/" + grantId,
                title: grantData.projectTitle,
                applicant: grantData.applicant.fullName,
                userId: auth.user.id,
                grantNumber: grantNumber,
              },
              processKey: "CompleteGrantId",
            });
          }}
        >
          <i className="btn-addon-icon fe fe-package" />{" "}
          <FormattedMessage id="actionButton.completeGrant" />
        </a>
      </Menu.Item>
      <Menu.Item key="6">
        <a
          className="d-block"
          onClick={() => {
            setContextMenuVisible(true);
            setContextOptions({
              title: (
                <FormattedMessage id="actionButton.modifyOtherDocuments" />
              ),
            });
            setContextPresentationType("actionButton");
            setContextData({
              formKey: "modifyDocuments",
              data: {
                otherDocuments: grantData.otherDocuments,
              },
              apiCall: updateOtherDocumentsApi,
            });
          }}
        >
          <i className="btn-addon-icon fe fe-layers" />{" "}
          <FormattedMessage id="actionButton.modifyOtherDocuments" />
        </a>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    getGrantWithProfileAndOrdersByIdApi(grantId).then((response) => {
      if (response.status === 200) {
        const result = response.data;
        setOrders(result.orders);
        setProfile(result.myprofile);
        setGrantData(result);
        setStatus(result.status);
        setApprovedAmount(result.approvedBudget);
        setPaidAmount(result.paidAmount ?? 0);
        setRemainingAmount(result.approvedBudget - (result.paidAmount ?? 0));
        setCurrency(result.tenderDefinition.currency);
        const docs = result.otherDocuments.filter((e) => e.name !== undefined);
        const late =
          result.reportSchedule.filter(
            (e) => new Date(e.date) < new Date() && e.status !== "Approved"
          ).length > 0;
        setReportLate(late);
        setApplicationDocs(docs);
        setGrantNumber(result.grantNumberId);
        if (result.budgetHistory && result.budgetHistory.length > 0) {
          var budgetColumns = [];
          var budgetData = [];
          result.budgetHistory.forEach((e, i) => {
            var columnName = e.budgetDate.substring(0, 10);
            if (i === 0) {
              budgetColumns.push({
                title: intl.formatMessage({ id: "topBar.budget" }),
                name: "budget",
                dataIndex: "budget",
                width: 100,
              });
              budgetColumns.push({
                title: intl.formatMessage({ id: "topBar.initial" }),
                name: "approved",
                dataIndex: "approved",
                align: "right",
                width: 60,
              });
            } else {
              budgetColumns.push({
                title: columnName,
                name: columnName,
                dataIndex: columnName,
                align: "right",
                width: 60,
              });
            }
            e.budget.forEach((elem, idx) => {
              if (i === 0) {
                budgetData.push({
                  budget: elem.description,
                  approved: new Intl.NumberFormat(currentLocale, {
                    style: "currency",
                    currency: result.tenderDefinition.currency,
                  }).format(elem.value),
                });
              } else {
                var cell = budgetData[idx];
                cell[columnName] = new Intl.NumberFormat(currentLocale, {
                  style: "currency",
                  currency: result.tenderDefinition.currency,
                }).format(elem.value);
                budgetData[idx] = cell;
              }
            });
          });
          setBudgetHistoryColumns(budgetColumns);
          setBudgetHistoryData(budgetData);
        }
        var spendingColumns = [];
        var spendingData = [];
        result.reportSchedule.forEach((e, i) => {
          if (e.budget) {
            var columnName = e.date.substring(0, 10);
            if (i === 0) {
              spendingColumns.push({
                title: intl.formatMessage({ id: "topBar.budget" }),
                name: "budget",
                dataIndex: "budget",
                width: 100,
              });
            }
            spendingColumns.push({
              title: columnName,
              name: columnName,
              dataIndex: columnName,
              align: "right",
              width: 60,
            });
            e.budget.forEach((elem, idx) => {
              if (i === 0) {
                spendingData.push({
                  budget: elem.description,
                });
              }
              var cell = spendingData[idx];
              cell[columnName] = new Intl.NumberFormat(currentLocale, {
                style: "currency",
                currency: currency,
              }).format(elem.costNumber);
              spendingData[idx] = cell;
            });
          }
        });
        if (spendingColumns.length > 0) {
          setSpendingHistoryColumns(spendingColumns);
        }
        if (spendingData.length > 0) {
          setSpendingHistoryData(spendingData);
        }
      }
    });
  }, [grantId]);

  if (error) {
    return <Empty>{error}</Empty>;
  }

  return (
    <PageLayout>
      <div className="air__utils__content">
        <Helmet title="Grant: Details" />
        <SubBar
          mainTitle={<FormattedMessage id="topBar.manage" />}
          subTitle={
            <span>
              <FormattedMessage id="topBar.grant" /> {grantNumber}{" "}
            </span>
          }
          contextMenu={contextMenu}
          enableBackNavigation
        />
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <General1v2
                  title={<FormattedMessage id="title.awardedAmount" />}
                  info=""
                  customClass="text-primary"
                  number={new Intl.NumberFormat(currentLocale, {
                    style: "currency",
                    currency: currency,
                  }).format(approvedAmount)}
                />
              </div>
            </div>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <h2 className="badge-example">
                    <FormattedMessage id="title.overview" />
                  </h2>
                }
                key="1"
              >
                <div>
                  {grantData ? (
                    <div className="card">
                      <div className="card-body">
                        <List>
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <p className="font-weight-bold">
                                  <FormattedMessage id="title.applicant" />
                                </p>
                              }
                              description={
                                <span>{profile ? profile.fullName : ""}</span>
                              }
                            />
                          </List.Item>
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <p className="font-weight-bold">
                                  <FormattedMessage id="title.project" />
                                </p>
                              }
                              description={
                                <span>
                                  <span>{grantData.projectTitle}</span>{" "}
                                  <strong>
                                    {grantData.implementationStartApproved}
                                  </strong>{" "}
                                  -{" "}
                                  <strong>
                                    {grantData.implementationEndApproved}
                                  </strong>
                                </span>
                              }
                            />
                          </List.Item>
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <p className="font-weight-bold">
                                  <FormattedMessage id="title.financing" />
                                </p>
                              }
                              description={
                                <span>{grantData.financing.budgetTitle}</span>
                              }
                            />
                          </List.Item>
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <p className="font-weight-bold">
                                  <FormattedMessage id="title.status" />
                                </p>
                              }
                              description={
                                <Status
                                  status={grantData.status}
                                  statuses={Statuses.Applications}
                                />
                              }
                            />
                          </List.Item>
                        </List>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <Empty description="No data found" />
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <h2 className="badge-example">
                    <FormattedMessage id="title.documents" />
                  </h2>
                }
                key="2"
              >
                <div>
                  {grantData ? (
                    <div className="card">
                      <div className="card-body">
                        <Table columns={docCols} dataSource={applicationDocs} />
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <Empty description="No documents for this Grant" />
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <General1v2
                  title={<FormattedMessage id="title.availableAmount" />}
                  info=""
                  customClass="text-success"
                  number={new Intl.NumberFormat(currentLocale, {
                    style: "currency",
                    currency: currency,
                  }).format(remainingAmount)}
                />
              </div>
            </div>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <h2 className="badge-example">
                    <FormattedMessage id="topBar.orders" />
                  </h2>
                }
                key="1"
              >
                <div>
                  {grantData ? (
                    <div className="card">
                      <div className="card-body">
                        <Table
                          columns={ordersCols}
                          rowKey={"_id"}
                          dataSource={orders}
                          expandable={{
                            expandedRowRender: (record) => (
                              <p style={{ margin: 0 }}>
                                <strong>
                                  <span>
                                    <FormattedMessage id="title.description" />:{" "}
                                  </span>
                                </strong>
                                {record.comment}{" "}
                                <strong>
                                  <FormattedMessage id="title.paidTo" />:{" "}
                                </strong>
                                <span>
                                  {record.paymentToGrantist
                                    ? profile.fullName
                                    : record.provider.fullName}
                                </span>
                              </p>
                            ),
                          }}
                          summary={(pageData) => {
                            let totalPayment = 0;

                            pageData.forEach(({ amount }) => {
                              totalPayment += amount;
                            });

                            return (
                              <>
                                <Table.Summary.Row>
                                  <Table.Summary.Cell colSpan={5}>
                                    <FormattedMessage id="title.total" />
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    <Text>
                                      {new Intl.NumberFormat(currentLocale, {
                                        style: "currency",
                                        currency: currency,
                                      }).format(totalPayment)}
                                    </Text>
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              </>
                            );
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <Table
                          columns={accountingCols}
                          rowKey={"date"}
                          dataSource={
                            grantData.accounting ? grantData.accounting : []
                          }
                          expandable={{
                            expandedRowRender: (record) => (
                              <p style={{ margin: 0 }}>
                                <strong>
                                  <span>
                                    <FormattedMessage id="title.description" />:
                                  </span>
                                </strong>{" "}
                                <span>{record.comment}</span>
                              </p>
                            ),
                          }}
                          summary={(pageData) => {
                            let totalPayment = 0;
                            let totalPaymentOC = 0;

                            pageData.forEach(
                              ({ amount, amountOriginalCurrency }) => {
                                totalPayment += amount;
                                totalPaymentOC += amountOriginalCurrency;
                              }
                            );

                            return (
                              <>
                                <Table.Summary.Row>
                                  <Table.Summary.Cell colSpan={2}>
                                    <FormattedMessage id="title.total" />
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    <Text>
                                      {new Intl.NumberFormat(currentLocale, {
                                        style: "currency",
                                        currency: "MKD",
                                      }).format(totalPayment)}
                                    </Text>
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    <Text>
                                      {new Intl.NumberFormat(currentLocale, {
                                        style: "currency",
                                        currency: currency,
                                      }).format(totalPaymentOC)}
                                    </Text>
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              </>
                            );
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <Empty description="No orders found" />
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <Badge dot={reportLate}>
                    <h2 className="badge-example">
                      <FormattedMessage id="topBar.reports" />
                    </h2>
                  </Badge>
                }
                key="2"
              >
                <div>
                  {grantData ? (
                    <div className="card">
                      <div className="card-body">
                        <Table
                          columns={psCols}
                          rowKey={"date"}
                          dataSource={
                            grantData.reportSchedule
                              ? grantData.reportSchedule
                              : []
                          }
                          expandable={{
                            expandedRowRender: (record) => (
                              <p style={{ margin: 0 }}>
                                <strong>
                                  <span>
                                    <FormattedMessage id="title.comment" />:
                                  </span>
                                </strong>{" "}
                                <span>{record.comment}</span>
                              </p>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <Empty description="No report schedule found" />
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <h2 className="badge-example">
                    <FormattedMessage id="topBar.budgetHistory" />
                  </h2>
                }
                key="3"
              >
                <div className="card">
                  <div className="card-body">
                    {grantData && budgetHistoryData ? (
                      <DynamicTable
                        columns={budgetHistoryColumns}
                        data={budgetHistoryData}
                      />
                    ) : (
                      <div className="card">
                        <div className="card-body">
                          <Empty description="No budget history found" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <h2 className="badge-example">
                    <FormattedMessage id="topBar.spendingHistory" />
                  </h2>
                }
                key="4"
              >
                <div className="card">
                  <div className="card-body">
                    {grantData && spendingHistoryData ? (
                      <DynamicTable
                        columns={spendingHistoryColumns}
                        data={spendingHistoryData}
                      />
                    ) : (
                      <div className="card">
                        <div className="card-body">
                          <Empty description="No spending history found" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <Drawer
        className="customer-drawer"
        title="Customer Details"
        width="90%"
        closable={false}
        onClose={() => {
          setCustomerDetailsVisible(false);
        }}
        visible={customerDetailsVisible}
      >
        {profile ? (
          <CustomerProfile profile={profile} currentLocale={currentLocale} />
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
        className="applications-drawer"
        title="Applications"
        width="90%"
        closable={false}
        onClose={() => {
          setApplicationsVisible(false);
        }}
        visible={applicationsVisible}
      >
        {grantData ? (
          <AllApplications
            customerId={grantData.applicant.applicantId}
            currentLocale={currentLocale}
          />
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
        title="Report Details"
        width="60%"
        closable={true}
        onClose={() => {
          setViewDrawerVisible(false);
          setSelectedReport(null);
        }}
        visible={viewDrawerVisible}
      >
        {selectedReport ? (
          <div className="row">
            <div className="col-12">
              <FormIOForm
                className="mb-4 mt-4 text-left"
                submission={submissionData}
                options={optionsReadOnly}
                form={AppsConfig.reportView.form}
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
      <Drawer
        title="Order Details"
        width="60%"
        closable={true}
        onClose={() => {
          setViewOrderDrawerVisible(false);
          setSelectedOrder(null);
        }}
        visible={viewOrderDrawerVisible}
      >
        {selectedOrder ? (
          <div className="row">
            <div className="col-12">
              <FormIOForm
                className="mb-4 mt-4 text-left"
                submission={submissionData}
                options={optionsReadOnly}
                form={AppsConfig.orderView.form}
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
      <ContextDrawer
        contextOptions={contextOptions}
        contextDrawerMainWidth="50%"
        contextClose={() => {
          setContextMenuVisible(false);
          setContextData(null);
          setContextPresentationType("");
        }}
        contextToggle={contextMenuVisible}
        contextData={contextData}
        dataPresentationType={contextPresentationType}
      />
    </PageLayout>
  );
};

const mapStateToProps = (state) => {
  const userTasks = state["userTask"]?.data;
  return {
    userTasks,
    currentLocale: state.settings.locales[state.settings.locale],
    auth: state["auth"],
    optionsReadOnly: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
      readOnly: true,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    endApi: () => {
      dispatch(endApi());
    },
  };
};

export default withAuthorization(
  "grant:details",
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(GrantDetails))
);
