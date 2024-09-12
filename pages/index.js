import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import Home from "../components/Home";
import stylesPage from "../styles/signin.module.css";
import { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getUserProfile } from "../redux/auth";
import {
  setupSignalRConnection,
  getSingalRConnection,
} from "../redux/signalR/actions";
import { deleteCookie, setCookie } from "../utilities/Utils";
import { isLoading } from "../redux/tenders/actions";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Root = (props) => {
  const { loading, getUserAndProfile, auth, customer, applications } = props;
  const { data: session, status } = useSession();

  const renderLoader = () => {
    return (
      <Spin indicator={loadingIcon} tip="Loading...">
        <div className="full-loader"></div>
      </Spin>
    );
  };

  const renderHome = () => {
    return <Home />;
  };

  const renderOptions = () => <Link href="/auth/signin">SignIn</Link>;

  const renderView = () => {
    if (status === "loading" || isLoading) {
      renderLoader();
    }
    if (status === "authenticated" && customer && applications) {
      setCookie("profile", JSON.stringify(customer));
      setCookie("applications", JSON.stringify(applications));
      return renderHome();
    }
    if (status === "unauthenticated") {
      deleteCookie("profile");
      deleteCookie("applications");
      return renderOptions();
    }
  };

  return <Fragment>{renderView()}</Fragment>;
};

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state["auth"],
    customer: state["auth"]?.myprofile,
    applications: state["auth"].applications,
    isLoading: state["auth"].isLoading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    connectSignalR: (token, userId) =>
      dispatch(
        setupSignalRConnection(
          `${process.env.NEXT_PUBLIC_API_URL}/usertaskhub`,
          token,
          userId
        )
      ),
    getUserAndProfile: (customerId, userId, email, userCustomers) =>
      dispatch(getUserProfile(customerId, userId, email, userCustomers)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
