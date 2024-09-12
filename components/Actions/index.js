import React, { useEffect, useState } from "react";
import { Dropdown, Badge, Avatar } from "antd";
import List2 from "../../widgets/Lists/2";
import { BellOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  selectTasks,
  selectNotifications,
} from "../../redux/usertask/selector";

const Actions = (props) => {
  const { userTasks, notifications } = props;
  // User task count
  const [count, setCount] = useState(0);
  const [countNots, setCountNots] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (userTasks.data && userTasks.data.length) {
      setCount(userTasks.data.length);
    } else {
      setCount(0);
    }
  }, [userTasks]);

  useEffect(() => {
    if (notifications.data && notifications.data.length) {
      setCountNots(notifications.data.length);
    } else {
      setCountNots(0);
    }
  }, [notifications]);

  function visibleChange(flag) {
    setVisible(flag);
  }

  const menu = (
    <React.Fragment>
      <div className="card air__utils__shadow width-450">
        <div className="card-body p-0">
          <List2 />
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <Dropdown
      menu={menu}
      trigger={["click"]}
      placement="bottomRight"
      onOpenChange={visibleChange}
      open={visible}
    >
      <Badge
        size="small"
        count={count + countNots}
        style={{ cursor: "pointer" }}
        // showZero
      >
        <Avatar
          style={{ backgroundColor: "transparent" }}
          shape="square"
          size="large"
          icon={<BellOutlined />}
        />
      </Badge>
    </Dropdown>
  );
};

const mapStateToProps = (state, ownProps) => {
  const userTasks = state["userTask"];
  const notifications = state["notifications"];
  return {
    userTasks: userTasks,
    notifications: notifications,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
