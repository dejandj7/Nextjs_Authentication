import React, { useEffect, useState } from "react";
import { Rate, Avatar, Empty, List, Tag, Button, Spin } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import {
  downloadSpsFromUrl,
  getMimeTypeFromExtension,
} from "../utilities/Utils";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const CustomerProfile = (props) => {
  const { profile, currentLocale } = props;
  const [loader, setLoader] = useState(false);
  const rateDesc = ["D - Very Poor", "C - Poor", "B - Good", "A - Very Good"];
  const contactTypes = [
    "contact.phone",
    "contact.email",
    "contact.mobile",
    "contact.fax",
  ];

  const allOrganizationTypes = [
    "legal.LocalGovernmentUnit",
    "legal.AssociationOfCitizens",
    "legal.PublicInstitution",
    "legal.TradingCompany",
  ];

  function checkObjectTypes(i) {
    if (typeof i === "object") {
      return "";
    } else {
      return i;
    }
  }
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    var customerDocuments = [];

    if (profile && profile.documents) {
      profile.documents.forEach((array) => {
        if (Array.isArray(array)) {
          array.forEach((doc) => {
            customerDocuments.push(doc);
          });
        } else {
          customerDocuments.push(array);
        }
      });
      setDocuments(customerDocuments);
    }
  }, [profile]);

  return (
    <Spin indicator={loadingIcon} size="large" spinning={loader}>
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <div>
            <h2 className="badge-example">General</h2>
            <div className="card">
              <div className="card-body">
                <div>
                  <div className="d-flex flex-nowrap align-items-center flex-column pb-4">
                    <div className="text-center mb-2">
                      <Avatar
                        shape="square"
                        size={64}
                        icon={<UserOutlined />}
                      />
                    </div>
                    <div className="text-center mb-2">
                      <div className="font-weight-bold font-size-24 text-dark mb-1">
                        {profile.fullName ? profile.fullName : "N/A"}
                      </div>
                      <div className="font-size-18">
                        {profile.taxIdentificationNumber
                          ? profile.taxIdentificationNumber
                          : "N/A"}
                      </div>
                    </div>
                    <div className="text-uppercase font-weight-bold font-size-20 text-dark">
                      {" "}
                      <FormattedMessage id="title.OrganizationType" />:
                    </div>
                    <div className="text-center mb-2 font-size-18">
                      <FormattedMessage
                        id={
                          profile.legalCustomer
                            ? allOrganizationTypes[
                                profile.legalCustomer.typeLegalId
                              ]
                            : "private.individual"
                        }
                      />
                    </div>{" "}
                  </div>
                  <div className="border-top text-center text-gray-4 pt-3">
                    Last updated: @{" "}
                    {new Date(profile.modifiedOn).toLocaleDateString(
                      currentLocale
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="badge-example">Scoring</h2>
            <div className="card">
              <div className="card-body">
                <div className="text-center">
                  <div className="mb-2">
                    <Rate
                      style={{ fontSize: 48 }}
                      tooltips={rateDesc}
                      count={4}
                      value={profile.profileScore ? profile.profileScore : 4}
                      disabled={true}
                    />
                  </div>
                  <p className="text-uppercase text-muted mb-3">
                    {
                      rateDesc[
                        profile.profileScore ? profile.profileScore : 4 - 1
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="badge-example">Related Users</h2>
            {profile.relatedUsers && profile.relatedUsers.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={profile.relatedUsers}
                renderItem={(item) => (
                  <div className="card mb-1">
                    <div className="card-body py-2">
                      <div className="d-flex flex-wrap-reverse align-items-center">
                        <div className="mr-auto">
                          <div className="text-uppercase font-weight-bold font-size-20 text-dark">
                            {item.fullName}
                          </div>
                          <div className="font-size-16">
                            {item.isEnabled ? (
                              <Tag
                                icon={<CheckCircleOutlined />}
                                color="success"
                              >
                                Active
                              </Tag>
                            ) : (
                              <Tag
                                icon={<ExclamationCircleOutlined />}
                                color="error"
                              >
                                Disabled
                              </Tag>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                          <i className="fe fe-user"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <div className="card">
                <div className="card-body">
                  <Empty description="No Related Users" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <div className="mb-5">
                <h2 className="badge-example">Addresses</h2>
                {profile.customerAddresses &&
                profile.customerAddresses.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={profile.customerAddresses}
                    renderItem={(item) => (
                      <div className="card mb-1">
                        <div className="card-body py-2">
                          <div className="d-flex flex-wrap-reverse align-items-center">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-20 text-dark">
                                {item.streetName}
                              </div>
                              <div className="font-size-16">
                                {item.streetNumber
                                  ? item.streetNumber + ","
                                  : ""}
                                {item.zipCode} {checkObjectTypes(item.cityName)}
                              </div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i className="fe fe-map-pin"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <Empty description="No Addresses" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="mb-5">
                <h2 className="badge-example">Contacts</h2>
                {profile.customerContacts &&
                profile.customerContacts.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={profile.customerContacts}
                    renderItem={(item) => (
                      <div className="card mb-1">
                        <div className="card-body py-2">
                          <div className="d-flex flex-wrap-reverse align-items-center">
                            <div className="mr-auto">
                              <div className="text-lowercase font-weight-bold font-size-20 text-dark">
                                {item.contactData}
                              </div>
                              <div className="font-size-1">
                                <FormattedMessage
                                  id={contactTypes[item.typeContactID - 1]}
                                />
                              </div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i
                                className={`fe ${
                                  item.typeContactID !== 2
                                    ? "fe-phone-call"
                                    : "fe-at-sign"
                                }`}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <Empty description="No Contacts" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h2 className="badge-example">Documents</h2>
            {documents && documents.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={documents}
                renderItem={(item) => (
                  <div className="card mb-1">
                    <div className="card-body">
                      <div className="d-flex flex-wrap-reverse align-items-center">
                        <div className="mr-auto">
                          <div className="text-uppercase font-weight-bold font-size-20 text-dark">
                            {item.originalName}
                          </div>
                          <div className="font-size-16"></div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            type="text"
                            size="default"
                            className="font-size-36 text-gray-4 pl-1"
                            onClick={() =>
                              downloadSpsFromUrl(
                                item.url,
                                item.type
                                  ? item.type
                                  : getMimeTypeFromExtension(
                                      item.originalName.substring(
                                        item.originalName.lastIndexOf(".") + 1
                                      )
                                    ),
                                item.originalName
                              )
                            }
                          >
                            <i className="fe fe-file-text"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <div className="card">
                <div className="card-body">
                  <Empty description="No Documents" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default CustomerProfile;
