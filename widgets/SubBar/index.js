import React from "react";
import { Dropdown, message, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { FormattedMessage, IntlProvider } from "react-intl";
import { useRouter } from "next/router";

const SubBar = (props) => {
  const router = useRouter();
  const {
    settings: { locale, locales },
  } = props;
  const currentLocale = locales[locale];

  const menuHelperMessage = (
    <IntlProvider
      locale={currentLocale.locale}
      messages={currentLocale.messages}
    >
      <FormattedMessage id="context.menuHelper" />
    </IntlProvider>
  );

  return (
    <div className="air__utils__heading d-flex flex-wrap">
      {props.enableBackNavigation ? (
        <a onClick={() => router.back()} className="back-menu-btn">
          <span></span>
          <span></span>
        </a>
      ) : (
        ""
      )}
      <h5 className="mr-auto">
        {props.mainTitle}: {props.subTitle}
      </h5>
      <div className="d-flex flex-wrap font-size-16">
        {props.contextMenu ? (
          <Dropdown
            onClick={() => message.info(menuHelperMessage)}
            overlay={props.contextMenu}
            placement="bottomLeft"
          >
            <Button>
              <FormattedMessage id="context.actions" /> <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          ""
        )}
        {props.createNewEntryPath ? (
          <Link
            href={props.createNewEntryPath}
            className="btn btn-primary btn-with-addon ml-2"
          >
            <>
              <span className="btn-addon">
                <i className="btn-addon-icon fe fe-plus" />
              </span>
              Create {props.subTitle}
            </>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SubBar);
