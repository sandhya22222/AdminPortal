import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import validator from "validator";
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
import StoreModal from "../../components/storeModal/StoreModal";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import "./language.css";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;
const { Dragger } = Upload;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const languageDocumentAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_API;
const languageDeleteAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_UPDATE_API;
const titleMinLength = process.env.REACT_APP_TITLE_MIN_LENGTH;
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH;
const AddLanguage = () => {
  usePageTitle("Add Language");

  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] =
    useState(false);
  const [isSpecialCharacter, setIsSpecialCharacter] = useState("");
  const [isNativeFieldEmpty, setIsNativeFieldEmpty] = useState(false);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onChangeValues, setOnChangeValues] = useState(false);

  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    if (e.target.value !== "") {
      setIsLanguageFieldEmpty(false);
      setLanguage(e.target.value);
      // setNativeName(e.target.value);
    }
    // if (regex.test(value)) {
    //   setLanguage(value);
    //   setNativeName(value);
    // }
  };

  const handleLanguageCodeChange = (e) => {
    // setLanguageCode(e.target.value);
    const { value } = e.target;
    const regex = /^[a-zA-Z0-9]*$/;
    if (e.target.value !== "") {
      setIsLanguageCodeFieldEmpty(false);
      setLanguageCode(value);
    }
    // if (regex.test(value)) {
    //   setLanguageCode(value);
    // }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
    // if (e.target.value != "") {
    //   setIsRegexFieldEmpty(false);
    // }
  };

  const handleNativeNameChange = (e) => {
    const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
    if (
      e.target.value !== "" &&
      validator.matches(e.target.value, alphaWithSpacesRegex)
    ) {
      setNativeName(e.target.value);
    } else if (e.target.value === "") {
      setNativeName(e.target.value);
    }
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
    temp["language"] = language.trim();
    temp["language_code"] = languageCode.trim();
    // console.log("regex", regex, typeof regex);
    if (regex !== null && regex !== "") {
      temp["language_regex"] = regex.trim();
    }
    // console.log("nativename", nativeName, typeof nativeName);
    if (nativeName !== null && nativeName !== "") {
      temp["native_name"] = nativeName.trim();
    }
    temp["writing_script_direction"] = scriptDirection;
    // if (typeof fileData === "object") {
    if (langugaeDocumentPath !== null && langugaeDocumentPath !== undefined) {
      temp["lang_support_docs_path"] = langugaeDocumentPath;
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
        if (res.status === 201) {
          if (res.data) {
            toast("Language created successfully", {
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
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error && error.response === undefined) {
            toast("Something went wrong, please try again later", {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            });
          } else {
            if (error.response.status === 409) {
              toast(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                type: "error",
                autoClose: 10000,
              });
            }
            //  else if (fileData) {
            //   if (fileExtension !== "csv") {
            //     toast(
            //       "Invalid file extension, only '.csv' extension is supported.",
            //       {
            //         position: toast.POSITION.TOP_RIGHT,
            //         type: "error",
            //         autoClose: 10000,
            //       }
            //     );
            //   }
            // }
            else {
              toast(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                type: "error",
                autoClose: 10000,
              });
            }
          }
        }
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateLanguageFieldEmptyOrNot = () => {
    let validValues = 2;
    if (language.trim() === "" && languageCode.trim() === "") {
      setIsLanguageFieldEmpty(true);
      setIsLanguageCodeFieldEmpty(true);
      validValues--;
      toast("Please enter the values for the mandatory field", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (language.trim() === "" && languageCode.trim() !== "") {
      setIsLanguageFieldEmpty(true);
      validValues--;
      toast("Please enter the language name", {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    // const languageReg = /^[a-zA-Z]{4,15}$/;
    if (
      // (language.trim() && validator.isAlpha(language) === false) ||
      validator.isLength(language.trim(), {
        min: titleMinLength,
        max: titleMaxLength,
      }) === false
    ) {
      validValues--;
      setIsLanguageFieldEmpty(true);
      toast(
        `Language must contain minimum of ${titleMinLength}, maximum of ${titleMaxLength} characters`,
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (languageCode.trim() === "" && language.trim() !== "") {
      setIsLanguageCodeFieldEmpty(true);
      validValues--;
      toast("Please enter the language code", {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else if (
      // (languageCode.trim() &&
      //   validator.isAlpha(languageCode.trim()) === false) ||
      validator.isLength(languageCode.trim(), {
        min: 2,
        max: 5,
      }) === false
    ) {
      validValues--;
      setIsLanguageCodeFieldEmpty(true);
      toast(
        `Language code must contain minimum of 2, maximum of 5 characters`,
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (
      // (nativeName.trim() && validator.isAlpha(nativeName.trim()) === false) ||
      validator.isLength(nativeName.trim(), {
        min: titleMinLength,
        max: titleMaxLength,
      }) === false
    ) {
      if (nativeName !== null && nativeName !== "") {
        setIsNativeFieldEmpty(true);
        validValues--;
        toast(
          `Native name must contain minimum of ${titleMinLength}, maximum of ${titleMaxLength} characters`,
          {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          }
        );
      }
    }
    if (validValues === 2) {
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
    setFileData(e.file);
    var arr = e.file.name.split("."); //! Split the string using dot as separator
    var lastExtensionValue = arr.pop(); //! Get last element (value after last dot)
    setFileExtension(lastExtensionValue);
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
        toast("File uploaded successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
          autoClose: 10000,
        });
        // setIsUpLoading(false);
        console.log("Server Success Response From files", response.data);
        setLanguageDocumentPath(response.data.document_path);
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            // toast(`${error.response.data.extension}`, {
            //   position: toast.POSITION.TOP_RIGHT,
            //   type: "error",
            // });
            if (fileExtension !== "csv") {
              toast(
                "Invalid file extension, only '.csv' extension is supported",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  type: "error",
                  autoClose: 10000,
                }
              );
            }
          } else if (error && error.response && error.response.status === 400) {
            toast(`${error.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            });
          } else {
            toast("Something went wrong, please try again later", {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            });
          }
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
    MarketplaceServices.remove(languageDeleteAPI, {
      document_path: langugaeDocumentPath,
    })
      .then((response) => {
        console.log("response from delete===>", response.data);
        if (response.status === 200 || response.status === 201) {
          toast("Document deleted successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
        // disabling spinner
      })
      .catch((error) => {
        // disabling spinner
        console.log("response from delete===>", error.response);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
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
    //   message.success(`${info.file.name} File uploaded successfully.`);
    // } else if (status === "error") {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  return (
    <Content>
      <HeaderForTitle
        title={
          <Content className="flex">
            <Content className="flex text-left self-center items-center pr-3">
              <Link to="/dashboard/language">
                <ArrowLeftOutlined
                  role={"button"}
                  className={"text-black text-lg -translate-y-1"}
                />
              </Link>
              <Title level={3} className="!font-normal mb-0 ml-4">
                Add Language
              </Title>
            </Content>
          </Content>
        }
      />
      <Content className="mt-[8rem] !w-full p-3">
        <Spin tip="Please wait!" size="large" spinning={isLoading}>
          <Content className="mt-[-15px]">
            <Content className="p-3 bg-white mt-0 !rounded-l">
              <Content className="!mb-10">
                <Row>
                  <Col span={8} className="pr-2">
                    <Content className="my-3">
                      <span className="text-red-600 text-sm !text-center">
                        *
                      </span>
                      <label className="text-[13px] mb-2 ml-1">Language</label>
                      <Input
                        placeholder="Enter Language Name"
                        value={language}
                        minLength={titleMinLength}
                        maxLength={titleMaxLength}
                        className={`${
                          isLanguageFieldEmpty
                            ? "border-red-400 !border-[0.5px] border-solid focus:border-red-400 hover:border-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            validator.isAlpha(e.target.value)
                          ) {
                            setLanguage(e.target.value);
                            // setNativeName(e.target.value);
                            setOnChangeValues(true);
                          } else if (e.target.value === "") {
                            setLanguage(e.target.value);
                            // setNativeName(e.target.value);
                            setOnChangeValues(true);
                          }
                          setIsLanguageFieldEmpty(false);
                        }}
                        onBlur={() => {
                          const trimmed = language.trim();
                          const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                          setLanguage(trimmedUpdate);
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
                        minLength={2}
                        maxLength={5}
                        className={`${
                          isLanguageCodeFieldEmpty
                            ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                            : ""
                        }`}
                        // onChange={(e) => {
                        //   handleLanguageCodeChange(e);
                        // }}
                        onChange={(e) => {
                          const languageCodeRegex = /^[a-zA-Z\-]+$/;
                          if (
                            e.target.value !== "" &&
                            validator.matches(e.target.value, languageCodeRegex)
                          ) {
                            setLanguageCode(e.target.value);
                            setOnChangeValues(true);
                          } else if (e.target.value === "") {
                            setLanguageCode(e.target.value);
                            setOnChangeValues(true);
                          }
                          setIsLanguageCodeFieldEmpty(false);
                        }}
                        onBlur={() => {
                          const trimmed = languageCode.trim();
                          const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                          setLanguageCode(trimmedUpdate);
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
                        defaultValue="^[\s\S]*"
                        // className={`${
                        //   isRegexFieldEmpty
                        //     ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                        //     : ""
                        // }`}
                        onChange={(e) => {
                          handleRegexChange(e);
                          // setOnChangeValues(true);
                        }}
                        onBlur={() => {
                          const trimmed = regex.trim();
                          const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                          setRegex(trimmedUpdate);
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
                        minLength={titleMinLength}
                        maxLength={titleMaxLength}
                        onChange={(e) => {
                          handleNativeNameChange(e);
                          setIsNativeFieldEmpty(false);
                          // setOnChangeValues(true);
                        }}
                        onBlur={() => {
                          const trimmed = nativeName.trim();
                          const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                          setNativeName(trimmedUpdate);
                        }}
                        className={`${
                          isNativeFieldEmpty
                            ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                            : ""
                        }`}
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
                      // setOnChangeValues(true);
                    }}
                  >
                    <Option value="LTR">Left to Right</Option>
                    <Option value="RTL">Right to Left</Option>
                  </Select>
                </Content>
                {/* <Content className="my-3 mt-4 w-[32%]">
                  <label className="text-[13px] pb-1 mb-2">
                    Language Supported Document
                  </label>

                  <Dragger
                    beforeUpload={() => {
                      return false;
                    }}
                    afterUpload={() => {
                      return false;
                    }}
                    accept=".csv"
                    maxCount={1}
                    name="file"
                    onChange={
                      (e) => handleDropImage(e)
                      // setOnChangeValues(true)
                    }
                    onRemove={true}
                    className="app-btn-secondary"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="!text-[#7d3192]" />
                    </p>
                    <p className="ant-upload-text">Upload File</p>
                    <p className="ant-upload-text mx-2">
                      Upload your file here or drag and drop the file here
                    </p>
                    <p className="ant-upload-hint">only .csv files</p>
                  </Dragger>
                </Content> */}
              </Content>
              {/* </Content> */}
              <Content className="">
                <StoreModal
                  isVisible={isModalOpen}
                  okButtonText={"Yes"}
                  title={"Warning"}
                  cancelButtonText={"No"}
                  okCallback={() => navigate("/dashboard/language")}
                  cancelCallback={() => closeModal()}
                  hideCloseButton={false}
                  isSpin={false}
                >
                  <div>
                    <p>{`Discard Changes Confirmation`}</p>
                    <p>{`This action will take you back to the listing page, and any changes made here will not be saved. Are you sure you would like to proceed?`}</p>
                  </div>
                </StoreModal>
                <Row>
                  <Col>
                    <Button
                      className={
                        onChangeValues ? "app-btn-primary" : "!opacity-75"
                      }
                      onClick={() => validateLanguageFieldEmptyOrNot()}
                      disabled={!onChangeValues}
                    >
                      Save
                    </Button>
                  </Col>
                  <Col className="pl-2">
                    {/* <Link to="/dashboard/language"> */}
                    <Button
                      // style={{ background: "#FFFFFF" }}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                      // className=" app-btn-secondary"
                      className={
                        onChangeValues === true
                          ? "app-btn-secondary"
                          : "!opacity-75"
                      }
                      disabled={!onChangeValues}
                    >
                      Discard
                    </Button>
                    {/* </Link> */}
                  </Col>
                </Row>
              </Content>
            </Content>
          </Content>
        </Spin>
      </Content>
    </Content>
  );
};

export default AddLanguage;
