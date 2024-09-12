import React from 'react';
import { Button, Input, Form, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

const FilterWithStatus = (props) => {
  const {
    onFilter,
    onReset,
    onFilterChange,
    intl,
    initialValues,
    statuses,
    inputPlaceHolder,
    statusPlaceHolder,
  } = props;
  const [form] = Form.useForm();
  const { Option } = Select;

  let optionTemplate = statuses.map((v, i) => (
    <Option key={i} value={v.value}>
      {v.text}
    </Option>
  ));

  const onFieldsChange = (allFields) => {
    if (onFilterChange) {
      onFilterChange(
        allFields.filter(
          (e) => e.touched && e.name.findIndex((e) => e === 'status') > -1
        )
      );
    }
  };

  return (
    <div className="row">
      <div className="col-xs-12 col-lg-12">
        <div className="card">
          <div className="card-body">
            <Form
              name="filter"
              form={form}
              onFinish={onFilter}
              onFieldsChange={(_, allFields) => {
                onFieldsChange(allFields);
              }}
              initialValues={initialValues}
            >
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
                  <Form.Item name="status">
                    <Select
                      allowClear
                      placeholder={statusPlaceHolder}
                      statuses={statuses}
                    >
                      {optionTemplate}
                    </Select>
                  </Form.Item>
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

export default injectIntl(FilterWithStatus);
