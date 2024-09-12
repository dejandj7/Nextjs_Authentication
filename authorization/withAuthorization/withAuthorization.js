import React from "react";
import Can from "./Can";
import UnAuthorized from "../../components/UnAuthorized";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { signOut, useSession } from "next-auth/react";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const withAuthorization =
  (action, WrappedComponent, isLink = false) =>
  ({ auth, ...props }) => {
    const { data: session, status } = useSession();

    if (status === "loading") {
      return (
        <Spin indicator={loadingIcon} tip="Loading...">
          <div className="full-loader"></div>
        </Spin>
      );
    } else if (!session) {
      console.debug("withAuthorization signOut");
      signOut();
    } else {
      console.log(action);
      return (
        <Can
          permissions={auth.permissions ? auth.permissions : []}
          perform={action}
          yes={() => <WrappedComponent {...props} />}
          no={() => <UnAuthorized />}
        />
      );
    }
  };

export default withAuthorization;
