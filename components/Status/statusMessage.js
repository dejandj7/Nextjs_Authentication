import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert } from 'antd';

const StatusMessage = (props) => {
  const { status, statuses } = props;
  const statusItem = statuses.filter((s) => s.status === status)[0];
  const message = statusItem ? (
    <FormattedMessage id={statusItem.message} />
  ) : (
    <></>
  );

  return (
    <div>
      {statusItem ? (
        <Alert message={message} type={statusItem.type} />
      ) : (
        <Alert message={'N/A'} type="info" />
      )}
    </div>
  );
};

export default StatusMessage;
