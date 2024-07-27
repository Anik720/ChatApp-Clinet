import { Button, Form, Input, Select, Space } from "antd";
import React, { useContext, useEffect } from "react";
import { SettingsContext } from "../../../../contexts/admin/SettingsContext";

const FilterWord = () => {
  const [form] = Form.useForm();
  const { addFilterWord, getFilterWords, filters, isFilterWordsLoading } =
    useContext(SettingsContext);
  const handleChange = (value: any) => {
    addFilterWord({
      words: value,
    });
  };

  useEffect(() => {
    getFilterWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters)
      form.setFieldsValue({
        filterWord: filters.map((filter) => {
          return filter.word;
        }),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <Form form={form} name="basic" layout="vertical">
        <Form.Item
          label="Filter Word"
          name="filterWord"
          rules={[
            {
              required: true,
              message: "Please input your filter word!",
            },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            onChange={handleChange}
            defaultValue={filters.map((filter) => {
              return filter.word;
            })}
            options={filters.map((filter) => {
              return {
                label: filter.word,
                value: filter.word,
              };
            })}
          />
        </Form.Item>

        <Form.Item>
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterWord;
