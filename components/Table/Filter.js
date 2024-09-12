import React from 'react';
import { Button, Input, Form, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

const Filter = (props) => {
  const { onFilter, onReset, intl, initialValues, inputPlaceHolder } = props;
  const [form] = Form.useForm();

  return (
    <div className="row">
      <div className="col-xs-12 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Form name="filter" form={form} onFinish={onFilter} initialValues={initialValues}>
              <div className="row">
                <div className="col-xs-12 col-lg-6 mt-3">
                  <Form.Item name="query">
                    <Input
                      placeholder={intl.formatMessage(inputPlaceHolder)}
                      prefix={
                        <SearchOutlined className="site-form-item-icon" />
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-xs-12 col-lg-4 mt-3">
                </div>
                <div className="col-xs-12 col-lg-1 mt-3">
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<FilterOutlined />}
                      block
                    >
                      <FormattedMessage id="filter.FilterButton" />
                    </Button>
                  </Form.Item>
                </div>
                <div className="col-xs-12 col-lg-1 mt-3">
                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="button"
                      onClick={() => onReset(form)}
                      block
                    >
                      <FormattedMessage id="filter.ResetButton" />
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(Filter);
