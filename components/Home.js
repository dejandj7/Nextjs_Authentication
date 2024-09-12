import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { Carousel, Card, Col, Row } from "antd";
import SubBar from "../widgets/SubBar";
import TenderList from "../widgets/Lists/TenderList";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageLayout from "../components/PageLayout";

const { Meta } = Card;

const Home = (props) => {
  const { applications, links } = props;
  const { data: session, status } = useSession();

  const contentStyle = {
    height: "240px",
    color: "#786fa4",
    lineHeight: "240px",
    textAlign: "center",
    background: "#f2f4f8",
  };

  const cardStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const imageStyle = {
    padding: "5px",
    height: "80px",
    width: "80px",
  };

  return (
    <PageLayout>
      <div className="air__utils__content">
        <Helmet title="Home" />
        <SubBar
          mainTitle={<FormattedMessage id="topBar.dashboards" />}
          subTitle={<FormattedMessage id="topBar.homePage" />}
        />
        {applications &&
          applications.length > 0 &&
          applications.filter((a) => a.status === "New").length > 0 && (
            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="card">
                  <div className="ml-3 mt-2 mb-2">
                    <FormattedMessage id="title.continueLastApplication" />
                    <span>. </span>
                    <Link
                      href={`/myapplications/${
                        applications.filter((a) => a.status === "New")[0]._id
                      }/${
                        applications.filter((a) => a.status === "New")[0]
                          .appTemplateId
                      }`}
                    >
                      <strong>
                        <FormattedMessage id="title.clickHere" />
                        <i className="fe fe-target ml-2" />
                      </strong>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              <TenderList />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card">
              {links && (
                <Carousel autoplay autoplaySpeed={10000}>
                  {links.length === 0 && (
                    <div key={0}>
                      <div className="site-card-wrapper" style={contentStyle}>
                        <Row
                          gutter={{
                            xs: 8,
                            sm: 16,
                            md: 24,
                            lg: 32,
                          }}
                        >
                          <Col span={4} key={0} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                          <Col span={4} key={1} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                          <Col span={4} key={2} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                          <Col span={4} key={3} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                          <Col span={4} key={4} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                          <Col span={4} key={5} style={cardStyle}>
                            <Card loading={true}>
                              <Meta title="" description="" />
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                  {links.length > 0 &&
                    links.map((linksItem, i) => {
                      return (
                        <div key={i}>
                          <div
                            className="site-card-wrapper"
                            style={contentStyle}
                          >
                            <Row
                              gutter={{
                                xs: 8,
                                sm: 16,
                                md: 24,
                                lg: 32,
                              }}
                            >
                              {linksItem.map((item, index) => {
                                return (
                                  <Col span={4} key={index} style={cardStyle}>
                                    <Card
                                      size="small"
                                      cover={
                                        <a
                                          style={cardStyle}
                                          href={
                                            item.link !== "" ? item.link : null
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <img
                                            alt={item.title}
                                            src={item.image}
                                            style={imageStyle}
                                          />
                                        </a>
                                      }
                                    >
                                      <Meta
                                        title={item.title}
                                        description={item.description}
                                      />
                                    </Card>
                                  </Col>
                                );
                              })}
                            </Row>
                          </div>
                        </div>
                      );
                    })}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const mapStateToProps = (state) => {
  var allLinks = state["links"].data;
  var links = [];
  var items = 0;
  while (allLinks && allLinks.length > items) {
    items +=
      links.length * 6 + 6 >= allLinks.length
        ? links.length * 6 + 6
        : links.length * 6 + 6;
    const smth = _.slice(allLinks, links.length * 6, items);
    links.push(smth);
  }

  return {
    auth: state["auth"],
    links: links,
    applications: state["auth"].applications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

// Home.getInitialProps = async ({ store, isServer, pathname, query }) => {
//   await store.dispatch(getPosts());
//   return { custom: 'custom' };
// };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
