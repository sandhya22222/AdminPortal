import React, { useEffect, useState, useImperativeHandle } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Content } from "antd/lib/layout/layout";
import {
  ArrowLeftOutlined,
  InboxOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  Layout,
  Spin,
  Skeleton,
  Upload,
} from "antd";
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { testValueByRegexPattern } from "../../util/util";
import useAuthorization from "../../hooks/useAuthorization";
import StoreModal from "../../components/storeModal/StoreModal";
//! Import CSS libraries
import { Container } from "reactstrap";
import MarketplaceServices from "../../services/axios/MarketplaceServices";

//! Destructure the components
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const pageLimit = process.env.REACT_APP_ITEM_PER_PAGE;
const languageUpdateAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_UPDATE_API;
const languageDocumentAPI = process.env.REACT_APP_LANGUAGE_DOCUMENT_API;

toast.configure();

const EditLanguage = () => {
  const authorizationHeader = useAuthorization();

  const search = useLocation().search;
  const _id = new URLSearchParams(search).get("_id");
  const [languageDetails, setLanguageDetails] = useState({
    language: "",
    language_code: "",
    native_name: "",
    writing_script_direction: "",
    lang_support_docs: null,
    lang_file_name: "",
    language_regex: "",
    islanguageDetailsEdited: false,
  });
  const [isLanguageFieldEmpty, setIsLanguageFieldEmpty] = useState(false);
  const [isLanguageCodeFieldEmpty, setIsLanguageCodeFieldEmpty] =
    useState(false);
  const [isRegexFieldEmpty, setIsRegexFieldEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [fileValue, setFileValue] = useState();
  const [fileData, setFileData] = useState();
  const [regexName, setRegexName] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [responseLanguageData, setResponseLanguageData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [documentPath, setDocumentPath] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newlyUploadedFile, setNewlyUploadedFile] = useState(0);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [fileName, setFileName] = useState();
  const [fileExtension, setFileExtension] = useState("");
  const navigate = useNavigate();
  // hanler for language, language_code, native_name, writing_script_direction
  const languageHandler = (fieldName, value) => {
    let copyofLanguageDetails = { ...languageDetails };
    if (fieldName === "language") {
      copyofLanguageDetails.language = value;
      if (value != "") {
        setIsLanguageFieldEmpty(false);
      }
    } else if (fieldName === "language_code") {
      copyofLanguageDetails.language_code = value;
      if (value != "") {
        setIsLanguageCodeFieldEmpty(false);
      }
    } else if (fieldName === "language_regex") {
      copyofLanguageDetails.language_regex = value;
      if (value != "") {
        setIsRegexFieldEmpty(false);
      }
    } else if (fieldName === "native_name") {
      copyofLanguageDetails.native_name = value;
    } else if (fieldName === "writing_script_direction") {
      copyofLanguageDetails.writing_script_direction = value;
    } else if (fieldName === "lang_support_docs") {
      if (value[0].size < 4 * 1000000) {
        let file = value[0];
        let fileExtension = file.name.split(".").pop();
        copyofLanguageDetails.lang_support_docs = file;
        setFileData(file);
        setFileValue(fileExtension);
        // var arr = fileExtension.name.split("."); //! Split the string using dot as separator
        // var lastExtensionValue = arr.pop();
        console.log("Final File In Function", file, fileExtension);
      } else {
        toast(`Please select a file that is smaller than 4 MB in size`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        });
      }
    }
    copyofLanguageDetails.islanguageDetailsEdited = true;
    setLanguageDetails(copyofLanguageDetails);
  };
  console.log("Final File In Function", fileData, fileValue);

  const editLanguageButtonHeader = () => {
    return (
      <>
        <Row className="w-[50%] float-left flex items-center my-3">
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
              Edit Language
            </Title>
          </Col>
        </Row>
      </>
    );
  };

  // language API GET call
  const getLanguageAPI = (page, limit) => {
    // Enabling skeleton
    setIsDataLoading(true);
    // axios
    //   .get(languageAPI, authorizationHeader, {
    //     params: {
    //       "page-number": page,
    //       "page-limit": limit,
    //     },
    //   })
    MarketplaceServices.findByPage(languageAPI, null, page, limit, false)
      .then((response) => {
        console.log(
          "Response from  edit language server-----> ",
          response.data
        );
        let languageData = response?.data.data.filter(
          (element) => element.id === parseInt(_id)
        );
        console.log("languageData", languageData);
        setResponseLanguageData(languageData);
        if (languageData && languageData.length > 0) {
          let copyofLanguageDetails = { ...languageDetails };
          copyofLanguageDetails.language = languageData[0].language;
          copyofLanguageDetails.language_code = languageData[0].language_code;
          copyofLanguageDetails.native_name = languageData[0].native_name;
          copyofLanguageDetails.writing_script_direction =
            languageData[0].writing_script_direction;
          copyofLanguageDetails.lang_support_docs =
            languageData[0].lang_support_docs_path;
          copyofLanguageDetails.lang_file_name =
            languageData[0].lang_support_docs;
          copyofLanguageDetails.language_regex = languageData[0].language_regex;
          setRegexName(languageData[0].language_regex);
          setDocumentPath(languageData[0].lang_support_docs_path);
          setLanguageName(languageData[0].language);

          setLanguageDetails(copyofLanguageDetails);
        }
        // disabling skeleton
        setIsDataLoading(false);
      })
      .catch((error) => {
        // disabling skeleton
        setIsDataLoading(false);
        console.log("errorFromLanguageApi====>", error);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getLanguageAPI(
      searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : pageLimit
    );
  }, []);

  console.log("documentPath", documentPath);
  console.log("responseLanguagedata", responseLanguageData);
  const validateLanguageFieldEmptyOrNot = () => {
    // if (
    //   languageDetails.language !== "" &&
    //   languageDetails.language_code !== "" &&
    //   languageDetails.writing_script_direction !== "" &&
    //   languageDetails.lang_support_docs !== null &&
    //   languageDetails.language_regex !== "" &&
    //   languageDetails.islanguageDetailsEdited
    // ) {
    //   editLanguage();
    // } else if (
    //   languageDetails.language === "" ||
    //   languageDetails.language_code === "" ||
    //   languageDetails.language_regex === regexName
    // ) {
    if (languageDetails.language === "") {
      setIsLanguageFieldEmpty(true);
      toast("Please enter the language name ", {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (languageDetails.language_code === "") {
      setIsLanguageCodeFieldEmpty(true);
      toast("Please enter the language code.", {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else if (
      newlyUploadedFile === 0 &&
      responseLanguageData[0].language === languageDetails.language &&
      responseLanguageData[0].language_code === languageDetails.language_code &&
      responseLanguageData[0].lang_support_docs_path ===
        languageDetails.lang_support_docs &&
      responseLanguageData[0].native_name === languageDetails.native_name &&
      responseLanguageData[0].writing_script_direction ===
        languageDetails.writing_script_direction &&
      responseLanguageData[0].language_regex === languageDetails.language_regex
    ) {
      toast("No changes were detected", {
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
        autoClose: 10000,
      });
    } else {
      updateEditLanguage();
    }
    // } else {
    //   toast("No Changes Detected !", {
    //     autoClose: 5000,
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "info",
    //   });
    // }
  };
  console.log("newlyUploadedFile", newlyUploadedFile);
  // Language PUT API call
  const updateEditLanguage = () => {
    // const langaugeData = new FormData();
    // langaugeData.append("language", languageDetails.language);
    // langaugeData.append("language_code", languageDetails.language_code);
    // langaugeData.append("language_regex", languageDetails.language_regex);
    // langaugeData.append("native_name", languageDetails.native_name);
    // langaugeData.append(
    //   "writing_script_direction",
    //   languageDetails.writing_script_direction
    // );
    // if (
    //   languageDetails.lang_support_docs !== null &&
    //   typeof languageDetails.lang_support_docs === "object"
    // ) {
    //   langaugeData.append(
    //     "lang_support_docs",
    //     languageDetails.lang_support_docs
    //   );
    // }

    const temp = {};
    temp["language"] = languageDetails.language;
    temp["language_code"] = languageDetails.language_code;
    temp["language_regex"] = languageDetails.language_regex;
    temp["native_name"] = languageDetails.native_name;
    temp["writing_script_direction"] = languageDetails.writing_script_direction;
    if (
      languageDetails.lang_support_docs !== null
      // &&
      // typeof languageDetails.lang_support_docs === "object"
    ) {
      temp["lang_support_docs_path"] = languageDetails.lang_support_docs;
    }

    console.log("PutObject----->", temp);
    // enabling spinner
    setIsLoading(true);
    // axios
    //   .put(
    //     languageAPI,
    //     temp,
    //     {
    //       params: {
    //         _id: parseInt(_id),
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.update(languageAPI, temp, { _id: parseInt(_id) })
      .then(function (response) {
        let copyofLanguageDetails = { ...languageDetails };
        copyofLanguageDetails.islanguageDetailsEdited = false;
        setLanguageDetails(copyofLanguageDetails);
        console.log(
          "response of language data",
          response.data[0].lang_support_docs
        );
        setRegexName(response.data.language_regex);
        setLanguageName(response.data.language);
        // disabling spinner
        setIsLoading(false);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          // getLanguageAPI();
          toast("Language edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        // disabling spinner
        setIsLoading(false);
        if (fileData) {
          if (fileValue !== ".csv")
            toast(
              "Invalid file extension, only '.csv' extension is supported.",
              {
                position: toast.POSITION.TOP_RIGHT,
                type: "error",
                autoClose: 10000,
              }
            );
        } else {
          toast(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
        console.log(error.response);
      });
  };

  const updateEditLanguageDocument = () => {
    const temp = {};
    temp["language"] = languageDetails.language;
    temp["language_code"] = languageDetails.language_code;
    // temp["lang_support_docs_path"] = "";

    MarketplaceServices.update(languageAPI, temp, { _id: parseInt(_id) })
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
  };

  const updateLanguageDocument = (fileValue, lastExtensionValue) => {
    const formData = new FormData();
    formData.append("language_document", fileValue);
    formData.append("extension", lastExtensionValue);
    // axios
    //   .put(
    //     languageUpdateAPI,
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //       params: {
    //         document_path: documentPath,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.update(languageUpdateAPI, formData, {
      document_path: documentPath,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log("put response", response.data);
        setNewlyUploadedFile(+1);
        toast("File uploaded successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
          autoClose: 10000,
        });
        setLanguageDetails({
          ...languageDetails,
          lang_support_docs: response.data.document_path,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (fileExtension !== "csv") {
            toast(
              "Invalid file extension, only '.csv' extension is supported.",
              {
                position: toast.POSITION.TOP_RIGHT,
                type: "error",
                autoClose: 10000,
              }
            );
          }
        }
      });
  };

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
        setNewlyUploadedFile(+1);
        toast("File uploaded successfully", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
          autoClose: 10000,
        });
        // setIsUpLoading(false);
        let temp = { ...languageDetails };
        temp["lang_support_docs"] = response.data.document_path;
        setLanguageDetails(temp);
        setDocumentPath(response.data.document_path);
        console.log("Server Success Response From files", response.data);
      })
      .catch((error) => {
        if (error.response) {
          // toast(`${error.response.data.extension[0]}`, {
          //   position: toast.POSITION.TOP_RIGHT,
          //   type: "error",
          // });
          if (fileExtension !== "csv") {
            toast(
              "Invalid file extension, only '.csv' extension is supported.",
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
    //     languageUpdateAPI,
    //     {
    //       params: {
    //         document_path: documentPath,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.remove(languageUpdateAPI, {
      document_path: documentPath,
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
        setLanguageDetails({ ...languageDetails, lang_support_docs: null });
        setIsDocumentModalOpen(false);
        updateEditLanguageDocument();
        // disabling spinner
      })
      .catch((error) => {
        // disabling spinner
        console.log("response from delete===>", error.response);
        toast(`${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        });
      });
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleDropImage = (e) => {
    console.log("test", e.file);
    setFileName(e.file);
    var arr = e.file.name.split("."); //! Split the string using dot as separator
    var lastExtensionValue = arr.pop(); //! Get last element (value after last dot)
    setFileExtension(lastExtensionValue);
    if (languageDetails.lang_support_docs === null) {
      if (e.file.status !== "removed") {
        saveLanguageDocument(e.file, lastExtensionValue);
      }
    } else {
      if (e.file.status !== "removed") {
        updateLanguageDocument(e.file, lastExtensionValue);
      }
    }
  };

  console.log("languageDetails", languageDetails);

  return (
    <Content>
      <Content className="">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            {
              title: "Language",
              navigationPath: "/dashboard/language",
              displayOrder: 2,
            },
            { title: "Edit Language", navigationPath: "", displayOrder: 3 },
          ]}
        />
      </Content>
      <Content className="bg-white !w-full !mt-[80px] fixed z-10">
        {editLanguageButtonHeader()}
      </Content>
      <Spin tip="Please wait!" size="large" spinning={isLoading}>
        <Content className="p-3">
          <Row>
            <Col span={16}>
              {isDataLoading ? (
                <div className="mt-[-480px]">
                  <Skeleton
                    active
                    paragraph={{
                      rows: 5,
                    }}
                    className="p-3"
                  ></Skeleton>
                </div>
              ) : (
                <Content className="!w-[150%] ">
                  <Content className="p-3 !bg-white mt-36">
                    <Content className="">
                      {/* <Typography.Title
                        level={3}
                        className="inline-block !font-normal"
                      >
                        Language Details
                      </Typography.Title> */}
                      <Row>
                        <Col span={8} className="pr-2">
                          <Content className="my-3">
                            <span className="text-red-600 text-sm !items-center py-4">
                              *
                            </span>
                            <label className="text-[13px] mb-2 ml-1">
                              Language
                              {/* <sup className="text-red-600 text-sm">*</sup> */}
                            </label>
                            <Input
                              placeholder="Enter Language Name"
                              value={languageDetails.language}
                              className={`${
                                isLanguageFieldEmpty
                                  ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                                  : ""
                              }`}
                              maxLength={15}
                              onChange={(e) => {
                                const regex = /^[a-zA-Z0-9]*$/;
                                if (
                                  e.target.value !== "" &&
                                  testValueByRegexPattern(regex, e.target.value)
                                ) {
                                  languageHandler("language", e.target.value);
                                } else if (e.target.value === "") {
                                  languageHandler("language", e.target.value);
                                }
                              }}
                            />
                          </Content>
                        </Col>
                        <Col span={8} className="pl-2">
                          <Content className="my-3">
                            <span className="text-red-600 text-sm !text-center">
                              *
                            </span>
                            <label className="text-[13px] mb-2 ml-1">
                              Language Code
                              {/* <sup className="text-red-600 text-sm">*</sup> */}
                            </label>
                            <Input
                              placeholder="Enter Language Code"
                              value={languageDetails.language_code}
                              maxLength={3}
                              className={`${
                                isLanguageCodeFieldEmpty
                                  ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const regex = /^[a-zA-Z0-9]*$/;
                                if (
                                  e.target.value !== "" &&
                                  testValueByRegexPattern(regex, e.target.value)
                                ) {
                                  languageHandler(
                                    "language_code",
                                    e.target.value
                                  );
                                } else if (e.target.value === "") {
                                  languageHandler(
                                    "language_code",
                                    e.target.value
                                  );
                                }
                              }}
                            />
                          </Content>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8} className="pr-2">
                          <Content className="my-3">
                            <label className="text-[13px] mb-2">
                              Language Regex
                              {/* <sup className="text-red-600 text-sm">*</sup> */}
                            </label>
                            <Input
                              placeholder="Enter Language Regex"
                              value={languageDetails.language_regex}
                              maxLength={128}
                              className={`${
                                isRegexFieldEmpty
                                  ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                                  : ""
                              }`}
                              onChange={(e) => {
                                languageHandler(
                                  "language_regex",
                                  e.target.value
                                );
                              }}
                            />
                          </Content>
                        </Col>
                        <Col span={8} className="pl-2">
                          <Content className="my-3">
                            <label className="text-[13px] mb-2">
                              Native Name
                            </label>
                            <Input
                              placeholder="Enter Native Name"
                              value={languageDetails.native_name}
                              onChange={(e) => {
                                languageHandler("native_name", e.target.value);
                              }}
                              // className={
                              //   "h-10 px-2 py-[5px] border-[1px] border-solid border-[#C6C6C6] rounded-sm"
                              // }
                            />
                          </Content>
                        </Col>
                      </Row>
                      <Content className="my-3 w-[32%]">
                        <label className="text-[13px] mb-2">
                          Script Direction
                        </label>
                        <Select
                          // size={"large"}
                          style={{ display: "flex" }}
                          defaultValue={
                            languageDetails.writing_script_direction
                          }
                          value={languageDetails.writing_script_direction}
                          onChange={(e) => {
                            languageHandler("writing_script_direction", e);
                          }}
                        >
                          <Option value="LTR">Left to right</Option>
                          <Option value="RTL">Right to left</Option>
                        </Select>
                      </Content>
                      <Content className="my-3 mt-4 w-[32%]">
                        <label className="text-[13px] pb-1 mb-2">
                          Language Supported Document
                        </label>
                        {/* <Input
                          type="file"
                          name="filename"
                          onChange={(e) =>
                            languageHandler("lang_support_docs", e.target.files)
                          }
                          accept=".csv"
                        /> */}
                        <StoreModal
                          isVisible={isDocumentModalOpen}
                          okButtonText={"Yes"}
                          title={"Warning"}
                          cancelButtonText={"No"}
                          okCallback={() => removeLanguageDocument()}
                          cancelCallback={() => closeDocumentModal()}
                          isSpin={false}
                        >
                          <div>
                            <p>{`Confirm Language Document Deletion`}</p>
                            <p>{`Are you absolutely sure you want to delete the Document? This action cannot be undone.`}</p>
                          </div>
                        </StoreModal>
                        <Dragger
                          name="file"
                          multiple={false}
                          maxCount={1}
                          beforeUpload={() => {
                            return false;
                          }}
                          accept=".csv"
                          // fileList={fileList}
                          onChange={(e) => {
                            handleDropImage(e);
                            languageHandler(
                              "lang_support_docs",
                              e.target.files
                            );
                          }}
                          onRemove={true}
                        >
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text mx-2">
                            Upload your file here or drag and drop the file here
                          </p>
                          <p className="ant-upload-hint">only .csv files</p>
                        </Dragger>
                        {languageDetails.lang_support_docs !== null ? (
                          <>
                            <p className="mt-2 flex justify-between">
                              <span>{languageDetails.lang_file_name} </span>{" "}
                              {languageDetails.lang_file_name !== null ? (
                                <span className="ml-44">
                                  <DeleteOutlined
                                    onClick={() => setIsDocumentModalOpen(true)}
                                  />
                                </span>
                              ) : (
                                ""
                              )}
                            </p>
                            <p className="mt-2 ">
                              <span className="text-red-600">
                                {languageDetails.lang_file_name}{" "}
                              </span>{" "}
                              was uploaded for{" "}
                              <span className="text-red-600">
                                {languageDetails.language}
                              </span>{" "}
                              Language. You can update the file by browsing and
                              selecting a new file above.
                            </p>
                          </>
                        ) : (
                          ""
                        )}
                      </Content>
                    </Content>
                  </Content>
                  <Content className="mt-3">
                    <StoreModal
                      isVisible={isModalOpen}
                      okButtonText={"Yes"}
                      title={"Warning"}
                      cancelButtonText={"No"}
                      okCallback={() => navigate("/dashboard/language")}
                      cancelCallback={() => closeModal()}
                      isSpin={false}
                    >
                      <div>
                        <p>{`Discard Changes Confirmation`}</p>
                        <p>{`This action will take you back to the listing page, and any changes made here will not be saved. Are you sure you would like to proceed?`}</p>
                      </div>
                    </StoreModal>
                    <Row>
                      <Col>
                        {/* <Link to="/dashboard/language"> */}
                        <Button
                          // style={{ background: "#FFFFFF" }}
                          className="app-btn-secondary"
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        >
                          {/* <label className="h-5 text-[14px]  text-[#393939] cursor-pointer"> */}
                          Discard
                          {/* </label> */}
                        </Button>
                        {/* </Link> */}
                      </Col>
                      <Col className="pl-4">
                        <Button
                          // style={{ backgroundColor: "#393939" }}
                          className=" app-btn-primary"
                          onClick={() => validateLanguageFieldEmptyOrNot()}
                        >
                          {/* <label className=" h-5  text-[14px]  text-[#FFFFFF] cursor-pointer"> */}
                          Update
                          {/* </label> */}
                        </Button>
                      </Col>
                    </Row>
                  </Content>
                </Content>
              )}
            </Col>
          </Row>
        </Content>
      </Spin>
    </Content>
  );
};
export default EditLanguage;
