import React from "react";
import StatusMessage from "./statusMessage";
import Status from "./index";
import Statuses from "./applicationStatuses";
import { FormattedMessage } from "react-intl";

const ApplicationStatus = (props) => {
  const { status, grantNumberId } = props;

  return (
    <div className="row">
      <div className="col-xl-6">
        <StatusMessage status={status} statuses={Statuses.Applications} />
      </div>
      <div className="col-xl-6">
        <Status
          status={status}
          statuses={Statuses.Applications}
          className={"text-right"}
        />
        {grantNumberId ? (
          <div className="text-right mr-2">
            <span>
              <FormattedMessage id="topBar.grantNumber" />: {grantNumberId}
            </span>{" "}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
