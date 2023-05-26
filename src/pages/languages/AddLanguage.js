import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Spin,
  message,
  Upload,
} from "antd";
import { toast } from "react-toastify";
import { ArrowLeftOutlined, InboxOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import "./language.css";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;
const { Dragger } = Upload;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const languageDocumentAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_API;
const languageDeleteAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_UPDATE_API;
const AddLanguage = () => {
  const authorizationHeader = useAuthorization();

  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] =
    useState(false);
  const [isSpecialCharacter, setIsSpecialCharacter] = useState("");
  const [isRegexFieldEmpty, setIsRegexFieldEmpty] = useState(false);
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [regex, setRegex] = useState("^[s\\S\\]*");
  const [nativeName, setNativeName] = useState("");
  const [scriptDirection, setScriptDirection] = useState("LTR");
  const [fileData, setFileData] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [langugaeDocumentPath, setLanguageDocumentPath] = useState(null);
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    // setLanguage(e.target.value);
    // setNativeName(e.target.value);
    const { value } = e.target;
    const regex = /^[a-zA-Z0-9]*$/;
    if (e.target.value !== "") {
      setIsLanguageFieldEmpty(false);
    }
    if (regex.test(value)) {
      setLanguage(value);
      setNativeName(value);
    }
  };
  const handleLanguageCodeChange = (e) => {
    // setLanguageCode(e.target.value);
    const { value } = e.target;
    const regex = /^[a-zA-Z0-9]*$/;
    if (e.target.value !== "") {
      setIsLanguageCodeFieldEmpty(false);
    }
    if (regex.test(value)) {
      setLanguageCode(value);
    }
  };

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
    // if (e.target.value != "") {
    //   setIsRegexFieldEmpty(false);
    // }
  };

  const handleNativeNameChange = (e) => {
    setNativeName(e.target.value);
  };

  const handleScriptDirectionChange = (value) => {
    setScriptDirection(value);
  };

  //post function
  const saveLanguageAPI = () => {
    // const paramsData = new FormData();
    // paramsData.append("language", language);
    // paramsData.append("language_code", languageCode);
    // paramsData.append("language_regex", regex);
    // paramsData.append("native_name", nativeName);
    // paramsData.append("writing_script_direction", scriptDirection);
    // if (typeof fileData === "object") {
    //   paramsData.append("lang_support_docs", fileData);
    // }
    // console.log("This is from Params Data---->", paramsData);
    // enabling spinner
    // console.log("lang_support_docs", langugaeDocumentPath + ".csv");
    // console.log(
    //   "languageDocumentPath",
    //   langugaeDocumentPath,
    //   typeof langugaeDocumentPath
    // );
    const temp = {};
    temp["language"] = language;
    temp["language_code"] = languageCode;
    // console.log("regex", regex, typeof regex);
    if (regex !== null && regex !== "") {
      temp["language_regex"] = regex;
    }
    // console.log("nativename", nativeName, typeof nativeName);
    if (nativeName !== null && nativeName !== "") {
      temp["native_name"] = nativeName;
    }
    temp["writing_script_direction"] = scriptDirection;
    // if (typeof fileData === "object") {
    if (langugaeDocumentPath !== null && langugaeDocumentPath !== undefined) {
      temp["lang_support_docs"] = langugaeDocumentPath;
    }
    // temp["lang_support_docs"] = langugaeDocumentPath + ".csv";
    // }
    console.log("tempBdy", temp);
    setIsLoading(true);
    // axios
    //   .post(
    //     languageAPI,
    //     temp,
    //     // {
    //     //   headers: { "Content-Type": "application/json" },
    //     // },
    //     authorizationHeader
    //   )
    MarketplaceServices.save(languageAPI, temp)
      .then((res) => {
        console.log("from response----->", res.data);
        console.log("from--->", res);
        if (res.status === 201) {
          if (res.data) {
            toast("Language details created", {
              position: toast.POSITION.TOP_RIGHT,
              type: "success",
            });
            // disabbling spinner
            setIsLoading(false);
            navigate(-1);
          }
        }
      })
      .catch((error) => {
        // disabbling spinner
        setIsLoading(false);
        console.log("error", error.response);
        if (error.response.status === 409) {
          toast("Data already exist", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else if (fileData) {
          if (fileExtension !== "csv") {
            toast("Invalid Extention , It will support only .csv extention", {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
            });
          }
        } else {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
      });
  };

  const validateLanguageFieldEmptyOrNot = () => {
    // let validValues = 2
    // var pattern = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/g;
    if (language === "") {
      setIsLanguageFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Name", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (languageCode === "") {
      setIsLanguageCodeFieldEmpty(true);
      // validValues -= 1;
      toast("Please Enter Language Code", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    // if (regex === "") {
    //   setIsRegexFieldEmpty(true);
    //   // validValues -= 1;
    //   toast("Please Enter Language Regex", {
    //     autoClose: 5000,
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }
    if (language !== "" && languageCode !== "") {
      saveLanguageAPI();
    }
  };

  const addLanguageButtonHeader = () => {
    return (
      <>
        <Row className="!w-full float-left flex items-center my-3 ">
          <Col>
            <Link to="/dashboard/language">
              <ArrowLeftOutlined
                role={"button"}
                className={"ml-4 text-black text-lg"}
              />
            </Link>
          </Col>
          <Col className="ml-4">
            <Title level={3} className="m-0 inline-block !font-normal">
              Add Language
            </Title>
          </Col>
        </Row>
      </>
    );
  };

  const handleDropImage = (e) => {
    console.log("test", e.file);
    var arr = e.file.name.split("."); //! Split the string using dot as separator
    var lastExtensionValue = arr.pop(); //! Get last element (value after last dot)
    if (e.file.status !== "removed") {
      saveLanguageDocument(e.file, lastExtensionValue);
    }
  };

  const getLangugaeDocument = () => {
    // axios
    //   .get(languageDocumentAPI, authorizationHeader)
    MarketplaceServices.findAll(languageDocumentAPI)
      .then(function (response) {
        console.log("responseofdashboard--->", response);
      })
      .catch((error) => {
        console.log("errorresponse--->", error);
      });
  };
  //! document post call
  const saveLanguageDocument = (fileValue, lastExtensionValue) => {
    const formData = new FormData();
    if (fileValue) {
      formData.append("language_document", fileValue);
      formData.append("extension", lastExtensionValue);
    }
    // axios
    //   .post(languageDocumentAPI, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    MarketplaceServices.save(languageDocumentAPI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        //   toast("file uploaded successfully.", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     type: "success",
        //   });
        // setIsUpLoading(false);
        console.log("Server Success Response From files", response.data);
        setLanguageDocumentPath(response.data.document_path);
      })
      .catch((error) => {
        if (error.response) {
          toast(`${error.response.data.extension}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        console.log(error.response);
        // setIsUpLoading(false);
        // setInValidName(true)
        // onClose();
      });
    // }
  };

  //! document delete call
  const removeLanguageDocument = () => {
    // axios
    //   .delete(
    //     languageDeleteAPI,
    //     {
    //       params: {
    //         document_path: langugaeDocumentPath,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.remove(languageDeleteAPI, {
      document_path: langugaeDocumentPath,
    })
      .then((response) => {
        console.log("response from delete===>", response.data);
        if (response.status === 200 || response.status === 201) {
          toast("Document Deleted Successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
        // disabling spinner
      })
      .catch((error) => {
        // disabling spinner
        console.log("response from delete===>", error.response);
        toast(`${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      });
  };

  const handleUploadFile = (e) => {
    // if (e.target.files[0].size < 4 * 1000000) {
    //   let file = e.target.files[0];
    //   let fileExtension = file.name.split(".").pop();
    //   let fileName = file.name;
    //   setFileData(file);
    //   setFileExtension(fileExtension);
    //   setFileName(fileName);
    //   console.log("Final FIle In Function", file, fileExtension, fileName);
    // } else {
    //   toast(`Please select File less than four mb`, {
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "warning",
    //   });
    // }
    // const { status } = info.file;
    // if (status !== "uploading") {
    //   console.log("fileInfo", info.file, info.fileList);
    //   let file = info.file;
    //   let fileExtension = file.name.split(".").pop();
    //   let fileName = file.name;
    //   setFileData(file);
    //   // if (fileData) {
    //   //   postLanguageDocument();
    //   // }
    //   console.log("Final FIle In Function", file, fileExtension, fileName);
    // }
    // if (status === "done") {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === "error") {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  return (
    <Layout>
      <Content className="">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            {
              title: "Language",
              navigationPath: "/dashboard/language",
              displayOrder: 2,
            },
            { title: "Add Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      <Content className="!bg-white !mt-[80px] !w-full fixed z-10">
        {addLanguageButtonHeader()}
      </Content>
      <Content className="mt-36 !w-full p-3">
        <Spin tip="Please wait!" size="large" spinning={isLoading}>
          <Content>
            <Content className="p-3 bg-white mt-0 ">
              <Content>
                {/* <Typography.Title
                    level={3}
                    className="inline-block !font-normal"
                  >
                    Language Details
                  </Typography.Title> */}
                <Row>
                  <Col span={8} className="pr-2">
                    <Content className="my-3">
                      <span className="text-red-600 text-sm !text-center">
                        *
                      </span>
                      <label className="text-[13px] mb-2 ml-1">
                        language
                        {/* <sup className="text-red-600 text-sm mt-1">*</sup> */}
                      </label>
                      <Input
                        placeholder="Enter Language Name"
                        value={language}
                        maxLength={15}
                        className={`${
                          isLanguageFieldEmpty
                            ? "border-red-400 !border-[0.5px] border-solid focus:border-red-400 hover:border-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          handleLanguageChange(e);
                        }}
                        // pattern="^[A-Za-z0-9]+$"
                        // rules={[
                        //   {
                        //    pattern: new RegExp("/^[A-Z@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]*$/i"),
                        //    message: "field does not accept numbers"
                        //   }
                        //  ]}
                      />
                    </Content>
                  </Col>
                  <Col span={8} className="pl-2">
                    <Content className="my-3">
                      <span className="text-red-600 text-sm text-center">
                        *
                      </span>
                      <label className="text-[13px] mb-2 ml-1">
                        Language Code
                        {/* <sup className="text-red-600 text-sm">*</sup> */}
                      </label>
                      <Input
                        placeholder="Enter Language Code"
                        value={languageCode}
                        maxLength={3}
                        className={`${
                          isLanguageCodeFieldEmpty
                            ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          handleLanguageCodeChange(e);
                        }}
                        // pattern="^[A-Za-z0-9]+$"
                      />
                    </Content>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} className="pr-2">
                    <Content className="my-3">
                      {/* <span className="text-red-600 text-sm">*</span> */}
                      <label className="text-[13px] mb-2 ml-1">
                        Language Regex
                        {/* <sup className="text-red-600 text-sm">*</sup> */}
                      </label>
                      <Input
                        placeholder="Enter Language Regex"
                        value={regex}
                        maxLength={128}
                        defaultValue="^[\s\S]*"
                        // className={`${
                        //   isRegexFieldEmpty
                        //     ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                        //     : ""
                        // }`}
                        onChange={(e) => {
                          handleRegexChange(e);
                        }}
                      />
                    </Content>
                  </Col>
                  <Col span={8} className="pl-2">
                    <Content className="my-3">
                      <label className="text-[13px] mb-2">Native Name</label>
                      <Input
                        placeholder="Enter Native Name"
                        value={nativeName}
                        onChange={(e) => {
                          handleNativeNameChange(e);
                        }}
                        // className={
                        //   "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                        // }
                      />
                    </Content>
                  </Col>
                </Row>
                <Content className="my-3 w-[32%]">
                  <label className="text-[13px] mb-2">Script Direction</label>
                  <Select
                    // size={"large"}
                    style={{ display: "flex" }}
                    value={scriptDirection}
                    onChange={(e) => {
                      handleScriptDirectionChange(e);
                    }}
                  >
                    <Option value="LTR">Left to Right</Option>
                    <Option value="RTL">Right to Left</Option>
                  </Select>
                </Content>
                <Content className="my-3 mt-4 w-[32%]">
                  <label className="text-[13px] pb-1 mb-2">
                    Language Supported Document
                  </label>
                  {/* <Input
                    type="file"
                    name="filename"
                    onChange={(e) => handleUploadFile(e)}
                    accept=".csv"
                  />
                  <Button onClick={temp}>Save</Button> */}
                  <Dragger
                    // {...props}
                    beforeUpload={() => {
                      return false;
                    }}
                    afterUpload={() => {
                      return false;
                    }}
                    accept=".csv"
                    // action="/languages/rest/v2/language"
                    // onDrop={(e) => handleDrop(e)}
                    name="file"
                    onChange={(e) => handleDropImage(e)}
                    onRemove={(e) => removeLanguageDocument(e)}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">only .csv files</p>
                  </Dragger>
                </Content>
              </Content>
            </Content>
            <Content className="mt-3">
              <Row>
                <Col>
                  <Button
                    style={{ backgroundColor: "#393939" }}
                    className="app-btn-primary"
                    onClick={() => validateLanguageFieldEmptyOrNot()}
                  >
                    Save
                  </Button>
                </Col>
                <Col className="pl-4">
                  <Link to="/dashboard/language">
                    <Button
                      // style={{ background: "#FFFFFF" }}
                      className=" app-btn-secondary"
                    >
                      Discard
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Content>
          </Content>
        </Spin>
      </Content>
    </Layout>
  );
};

export default AddLanguage;
