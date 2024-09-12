import { createRef, useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Layouts/Sidebar";
import HeaderApp from "../components/HeaderApp";
import Footer from "../components/Footer";
import MainMenu from "../components/MainMenu/";
import MainMenuLeft from "../components/MainMenuLeft/";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useSession, signOut } from "next-auth/react";

const PageLayout = (props) => {
  const { settings, myprofile, children } = props;
  const { data: session, status } = useSession();

  return (
    <Layout>
      <Sidebar />
      {settings.menuLayoutType === "left" && <MainMenuLeft />}
      {settings.menuLayoutType === "top" && (
        <HeaderApp>
          <MainMenu />
        </HeaderApp>
      )}
      {children}
      <Footer />
    </Layout>
  );
};

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state["settings"],
    myprofile: state["auth"]?.myprofile,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
