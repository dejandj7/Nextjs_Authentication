import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { updateDocumentPropertiesApi } from '../../../../redux/generic/api';
import {
  Table,
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  message,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { getColumnSearchProps } from '../../containers/Table/utils';

// define editable cell for table rows
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { TextArea } = Input;
  const inputNode = inputType === 'number' ? <InputNumber /> : <TextArea />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: inputType === 'number' ? true : false,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [application, setApplication] = useState({});
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const {
    auth,
    data,
    applicationUpdate,
    successMessage,
    errorMessage,
    updateStateSuccessMessage,
    updateStateErrorMessage,
    loading,
    expandable,
  } = props;

  const tableColumns = [
    { name: 'projectTitle', include: true, regex: true, multi: false },
  ];
  const [filters, setFilters] = useState(tableColumns);

  const viewApp = (record) => {
    setApplication(record);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record.scoring,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const save = async (key) => {
    try {
      let row = await form.validateFields();
      row['reviewId'] = auth.user.id;
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const scoring = {
          reviewId: row.reviewId,
          score: row.score,
          comment: row.comment,
          modifiedOn: new Date(),
          modifiedBy: auth.user.id,
        };
        const properties = {
          'scoring.$.score': row.score,
          'scoring.$.comment': row.comment,
          'scoring.$.modifiedOn': new Date(),
          'scoring.$.modifiedBy': auth.user.id,
        };
        const data2update = {
          collection: 'Applications',
          filter: [
            { key: '_id', keyData: item._id, isObjectId: true },
            {
              key: 'scoring.reviewId',
              keyData: auth.user.id,
              isObjectId: false,
            },
          ],
          properties: properties,
        };
        newData.splice(index, 1, {
          ...item,
          scoring: scoring,
          score: row.score,
          comment: row.comment,
        });
        updateDocumentPropertiesApi(data2update)
          .then(() => {
            message.success(successMessage);
          })
          .catch((error) => {
            console.error(error);
            message.error(errorMessage);
          });
        setTableData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  function goToPage(path) {
    history.push(path);
  }

  const columns = [
    {
      title: <FormattedMessage id="title.applicant" />,
      dataIndex: 'applicantFullName',
      render: (text, row, index) => {
        return <span>{row.applicant.fullName}</span>;
      },
    },
    {
      title: <FormattedMessage id="title.projectTitle" />,
      dataIndex: 'projectTitle',
      ellipsis: true,
      ...getColumnSearchProps(
        'projectTitle',
        searchText,
        searchedColumn,
        setSearchText,
        setSearchedColumn
      ),
    },
    {
      title: <FormattedMessage id="title.score" />,
      dataIndex: 'score',
      editable: true,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.scoring.score - b.scoring.score,
      render: (text, row, index) => {
        return <span>{row.scoring.score}</span>;
      },
    },
    {
      title: <FormattedMessage id="title.comment" />,
      dataIndex: 'comment',
      editable: true,
      render: (text, row, index) => {
        return <span>{row.scoring.comment}</span>;
      },
    },
    {
      title: <FormattedMessage id="title.actions" />,
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
              icon={<SaveOutlined />}
            >
              <FormattedMessage id="button.save" />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="danger" icon={<CloseOutlined />}>
                <FormattedMessage id="button.cancel" />
              </Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Tooltip title={<FormattedMessage id="button.edit" />}>
              <Button
                icon={<EditOutlined />}
                size="small"
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
              ></Button>
            </Tooltip>
            <Tooltip title={<FormattedMessage id="button.view" />}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() =>
                  goToPage(
                    `/apps/applications/view/${record._id}/${record.appTemplateId}`
                  )
                }
              ></Button>
            </Tooltip>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'score' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        loading={loading}
        dataSource={tableData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        expandable={expandable}
      />
    </Form>
  );
};

export default EditableTable;
