import React from 'react';
import { InfoOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';

const Status = (props) => {
  const { status, statuses, className } = props;
  const statusItem = statuses.filter((s) => s.status === status)[0];

  return (
    <div className={className}>
      {statusItem ? (
        <Tag
          style={{ fontSize: '16px' }}
          icon={statusItem.icon}
          color={statusItem.color}
        >
          <FormattedMessage id="application.status" />
          <strong>{statusItem.text}</strong>
        </Tag>
      ) : (
        <Tag
          style={{ fontSize: '16px' }}
          icon={<InfoOutlined />}
          color="#3ea4d4"
        >
          Status: <strong>N\A</strong>
        </Tag>
      )}
    </div>
  );
};

export default Status;
