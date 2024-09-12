import React from 'react';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';

class Localization extends React.Component {
  render() {
    const {
      children,
      settings: { locale, locales },
    } = this.props;
    const currentLocale = locales[locale];
    return (
      <ConfigProvider locale={currentLocale.localeAntd}>
        <IntlProvider locale={currentLocale.locale} messages={currentLocale.messages}>
          {children}
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Localization);
