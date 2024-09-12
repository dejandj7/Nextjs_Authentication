import React, { useState } from "react";
import { connect } from "react-redux";
import {
  PushpinTwoTone,
  EyeTwoTone,
  SisternodeOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { Drawer, Empty, List, Skeleton, Tag, Avatar, Button } from "antd";
import { getFormByPathApi } from "../../../redux/form/api";

const RelatedTasks = (props) => {
  const { relatedTasks, onSubmit, options } = props;
  const [selectedContextItem, setSelectedContextItem] = useState(null);
  const [itemDetailsVisible, setItemDetailsVisible] = useState(false);
  // The task form
  const [form, setForm] = useState({});

  useEffect(() => {
    import("../../../react-formio");
  }, []);

  return (
    <>
      <List
        className="demo-loadmore-list"
        // loading={isLoading}
        itemLayout="horizontal"
        pagination={{
          showSizeChanger: true,
          showLessItems: true,
          pageSize: 5,
        }}
        dataSource={relatedTasks ? relatedTasks[1] : []}
        renderItem={(item) => (
          <List.Item
            className="mb-1"
            actions={[
              <Button
                onClick={() => {
                  getFormByPathApi(item.data.formKey).then((result) => {
                    setForm(result);
                  });
                  setSelectedContextItem(item);
                  setItemDetailsVisible(true);
                }}
                icon={<EyeTwoTone />}
                key="list-loadmore-edit"
              >
                View
              </Button>,
            ]}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size="large"
                    style={{ backgroundColor: "#fff" }}
                    icon={<PushpinTwoTone />}
                  />
                }
                title={
                  <span className="badge-example mb-1">{item.data.name}</span>
                }
                description={
                  <>
                    <Tag icon={<SisternodeOutlined />} color="lime">
                      <b>Status:</b> {item.data.status}
                    </Tag>
                    <Tag icon={<FieldTimeOutlined />} color="orange">
                      <b>Created:</b> {item.data.created}
                    </Tag>
                    <Tag icon={<FieldTimeOutlined />} color="magenta">
                      <b>Due:</b> {item.data.dueDate}
                    </Tag>
                  </>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <Drawer
        title="Some title"
        width="40%"
        onClose={() => {
          setItemDetailsVisible(false);
          setForm({});
        }}
        open={itemDetailsVisible}
      >
        {selectedContextItem && selectedContextItem.data ? (
          <Form
            className="mb-4 mt-4 text-left"
            form={form}
            submission={selectedContextItem.data}
            options={options}
            onSubmit={onSubmit}
          />
        ) : (
          <Empty description="Nothing to show" />
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    options: {
      language: state.settings.locale.substr(0, 2),
      i18n: state.settings.i18n,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    relatedTasks: ownProps.relatedTasks,
    onSubmit: (submission) => {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedTasks);
