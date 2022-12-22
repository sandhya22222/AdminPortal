import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Select,
} from "antd";

const languageAPI = process.env.REACT_APP_DM_LANGUAGE_API;

const { Content } = Layout;
const { Option } = Select;

const PostLanguage = () => {
  const [response, setResponse] = useState();
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [scriptDirection, setScriptDirection] = useState("");
  const [check, setCheck] = useState(null);
  const [script, setScript] = useState("");

  const PostLanguageAPI = () => {
    const events = [
      {
        language: language,
        language_code: languageCode,
        native_name: nativeName,
        writing_script_direction: scriptDirection,
      },
    ];

    console.log(events);
    axios
      .post(languageAPI, events)
      .then((res) => {
        console.log("from response----->", res.data);
        console.log("from--->", res);

        if (response.status === 201) {
          if (res.data) {
            setCheck(res.data);
            toast("Language Details created", {
              position: toast.POSITION.TOP_RIGHT,
              type: "success",
            });
            console.log(
              "response data------------------------>",
              response.data
            );
          }
        }
      })
      .catch((error) => {
        // console.log("Error from post call===>", error);
        toast("Language Details not created", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
        console.log("Error from post call===>", error);
      });
  };

  return (
    <Layout className="">
      <Content>
        {/* {addVendorButtonHeader()} */}
        <Row>
          <Col span={14}>
            <Content className="p-3 bg-white mt-0">
              <Typography.Title level={3} className="inline-block !font-normal">
                Language Details
              </Typography.Title>
              <Content>
                <Form layout="vertical">
                  <Form.Item label="Language" name="language">
                    <Input
                      value={language}
                      //   onChange={(e) => {
                      //     handleLanguageChange(e);
                      //   }}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Language Code" name="languageCode">
                    <Input
                      //   onChange={(e) => {
                      //     handleLanguageCodeChange(e);
                      //   }}
                      placeholder="Please enter language code here"
                      onChange={(e) => {
                        setLanguageCode(e.target.value);
                      }}
                      value={languageCode}
                    />
                  </Form.Item>
                  <Form.Item label="Native Name" name="nativeName">
                    <Input
                      //   onChange={(e) => {
                      //     handleNativeNameChange(e);
                      //   }}
                      onChange={(e) => {
                        setNativeName(e.target.value);
                      }}
                      value={nativeName}
                    />
                  </Form.Item>
                  <Form.Item label="Script Direction" name="scriptDirection">
                    <Select
                      value={scriptDirection}
                      placeholder="---"
                      allowClear
                      //   onChange={(e) => {
                      //     handleScriptDirectionChange(e);
                      //   }}
                      onChange={(e) => {
                        setScript(e.target.value);
                      }}
                    >
                      <Option value="LTR">LTR</Option>
                      <Option value="RTL">RTL</Option>
                    </Select>
                  </Form.Item>
                </Form>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={PostLanguageAPI}
                >
                  Save
                </Button>
              </Content>
            </Content>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PostLanguage;
