import React, { Fragment, useEffect, useState } from "react";
import { Table, Tooltip, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { getDocumentsApi } from "../redux/generic/api";
import { useRouter } from "next/router";

const AllApplications = (props) => {
  const router = useRouter();
  const { customerId, currentLocale } = props;
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState(null);
  const [grants, setGrants] = useState(null);

  const statusFilters = [
    { text: <FormattedMessage id="status.new" />, value: "New" },
    { text: <FormattedMessage id="status.complete" />, value: "Complete" },
    {
      text: <FormattedMessage id="status.blockChanges" />,
      value: "BlockChanges",
    },
    {
      text: <FormattedMessage id="status.readyForReview" />,
      value: "ReadyForReview",
    },
    {
      text: <FormattedMessage id="status.readyForScoring" />,
      value: "ReadyForScoring",
    },
    { text: <FormattedMessage id="status.scored" />, value: "Scored" },
    { text: <FormattedMessage id="status.signed" />, value: "Signed" },
    {
      text: <FormattedMessage id="status.pendingFicheChange" />,
      value: "PendingFicheChange",
    },
    {
      text: <FormattedMessage id="status.readyForBoard" />,
      value: "ReadyForBoard",
    },
    {
      text: <FormattedMessage id="status.pendingBoardDecision" />,
      value: "PendingBoardDecision",
    },
    {
      text: <FormattedMessage id="status.approvedForAdjustment" />,
      value: "ApprovedWithAdjustment",
    },
    { text: <FormattedMessage id="status.incomplete" />, value: "Incomplete" },
    { text: <FormattedMessage id="status.approved" />, value: "Approved" },
    { text: <FormattedMessage id="status.rejected" />, value: "Rejected" },
    { text: <FormattedMessage id="filter.finished" />, value: "Finished" },
    { text: <FormattedMessage id="filter.closed" />, value: "Closed" },
  ];

  useEffect(() => {
    setLoading(true);
    const filtersBuild = [
      {
        key: "applicant.applicantId",
        value: customerId,
        isObjectId: true,
      },
    ];
    const parameters = {
      collection: "Applications",
      filters: filtersBuild,
    };
    getDocumentsApi(parameters).then((response) => {
      if (response.status === 200) {
        const result = response.data;
        setApplications(
          result.filter((a) => a.isGrant === undefined || a.isGrant === false)
        );
        setGrants(result.filter((a) => a.isGrant === true));
      }
    });
    setLoading(false);
  }, [customerId]);

  const columns = [
    {
      title: <FormattedMessage id="title.projectTitle" />,
      dataIndex: "projectTitle",
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
      title: <FormattedMessage id="title.status" />,
      dataIndex: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: <FormattedMessage id="title.actions" />,
      dataIndex: "actions",
      render: (text, row, index) => {
        return (
          <Tooltip title={<FormattedMessage id="button.view" />}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() =>
                goToPage(
                  `/apps/applications/view/${row._id}/${row.appTemplateId}`
                )
              }
            />
          </Tooltip>
        );
      },
    },
  ];

  function goToPage(path) {
    router.push(path);
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div>
            <h2 className="badge-example">Applications</h2>
            <Table
              loading={loading}
              columns={columns}
              dataSource={applications}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="mb-5">
            <h2 className="badge-example">Grants</h2>
            <Table loading={loading} columns={columns} dataSource={grants} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AllApplications;
