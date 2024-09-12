import React from "react";
import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import jp from "jsonpath";
import { FormattedMessage } from "react-intl";

export const handleSearch = (
  selectedKeys,
  confirm,
  dataIndex,
  setSearchText,
  setSearchedColumn
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

export const handleReset = (
  clearFilters,
  confirm,
  setSearchText,
  setSearchedColumn
) => {
  clearFilters();
  setSearchText("");
  setSearchedColumn("");
  confirm();
};

export const getColumnSearchProps = (
  dataIndex,
  searchText,
  searchedColumn,
  setSearchText,
  setSearchedColumn
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn
            )
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedMessage id="button.search"></FormattedMessage>
        </Button>
        <Button
          onClick={() =>
            handleReset(clearFilters, confirm, setSearchText, setSearchedColumn)
          }
          size="small"
          style={{ width: 90 }}
        >
          <FormattedMessage id="button.reset"></FormattedMessage>
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) => {
    const filteredResult = jp.query(record, `$.${dataIndex}`, 1)[0];

    if (filteredResult) {
      return filteredResult
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    }
  },
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => searchText, 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[typeof searchText === "string" ? searchText : ""]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : (
      text
    ),
});
