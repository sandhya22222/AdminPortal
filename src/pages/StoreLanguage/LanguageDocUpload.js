import {
  CheckCircleFilled,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Layout, Spin, Typography, Upload, Image } from "antd";
import React, { useState } from "react";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import StoreModal from "../../components/storeModal/StoreModal";
import {
  DownloadIcon,
  codeJsonIcon,
  tableIcon,
  FrontEndKeysDownloadIcon,
  BackendKeysDownloadIcon,
  tableDropDownArrow,
  DownloadIconDisable,
} from "../../constants/media";
import util from "../../util/common";
import MarketplaceToaster from "../../util/marketplaceToaster";

const { Title } = Typography;
const storeLanguageKeysUploadAPI =
  process.env.REACT_APP_UPLOAD_LANGUAGE_TRANSLATION_CSV;
const LanguageDownloadApiCsv =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV;
const LanguageDownloadApiZip =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_ZIP;
const AdminBackendKeyUploadAPI =
  process.env.REACT_APP_UPLOAD_ADMIN_BACKEND_MESSAGE_DETAILS;
const downloadBackendKeysAPI =
  process.env.REACT_APP_DOWNLOAD_ADMIN_BACKEND_MESSAGE_DETAILS;
const LanguageDownloadAPI =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV;
function LanguageDocUpload({ langCode }) {
  const [languageKeyFile, setLanguageKeyFile] = useState();
  const [chooseDownloadModalVisible, setChooseDownloadModalVisible] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isBEKeysUploadModalOpen, setIsBEKeysUploadModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [isSpinningForBEUpload, setIsSpinningForBEUpload] = useState(false);

  const { t } = useTranslation();
  const { Content } = Layout;
  const { Title, Text } = Typography;
  const { Dragger } = Upload;

  const uploadStoreLanguageKeys = (languageFile) => {
    setIsSpinning(true);
    const formData = new FormData();
    if (languageFile) {
      formData.append("language_file", languageFile);
      formData.append("language_code", langCode);
    }
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    let storeLanguageKeysPOSTBody = {
      language_code: langCode,
      language_file: languageFile,
    };
    console.log("postBody", storeLanguageKeysPOSTBody);
    MarketplaceServices.save(storeLanguageKeysUploadAPI, formData, null, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        setIsSpinning(false);
        setShowSuccessModal(true);
        setUploadSuccess(true);
      })
      .catch((error) => {
        setIsSpinning(false);
        MarketplaceToaster.showToast(
          util.getToastObject("Unable to upload the file", "error")
        );
      });
  };

  const uploadStoreBackendKeys = (languageFile) => {
    setIsSpinningForBEUpload(true);
    const formData = new FormData();
    if (languageFile) {
      formData.append("language_file", languageFile);
      formData.append("language_code", langCode);
    }
    console.log("formBody", formData);
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    let storeLanguageKeysPOSTBody = {
      language_code: langCode,
      language_file: languageFile,
    };
    console.log("postBody", storeLanguageKeysPOSTBody);
    MarketplaceServices.save(AdminBackendKeyUploadAPI, formData, null, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("success response for backend keys upload", response);
        setIsSpinningForBEUpload(false);
        setIsBEKeysUploadModalOpen(true);
      })
      .catch((error) => {
        setIsSpinningForBEUpload(false);
        MarketplaceToaster.showToast(
          util.getToastObject("Unable to upload the file", "error")
        );
      });
  };

  const handleFileChange = (file) => {
    setLanguageKeyFile(file);
    if (file.status !== "removed") {
      uploadStoreLanguageKeys(file);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const downloadBEKeysFile = (isFormat, languageCode) => {
    // setIsSpinningForBEUpload(true);
    MarketplaceServices.findMedia(downloadBackendKeysAPI, {
      "is-format": isFormat,
      language_code: languageCode,
    })
      .then(function (response) {
        // setIsSpinningForBEUpload(false);
        console.log(
          "Server Response from DocumentTemplateDownload Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "message_format.csv";
        alink.click();

        MarketplaceToaster.showToast(
          util.getToastObject(t("messages:download_successful"), "success")
        );
      })
      .catch((error) => {
        // setIsSpinningForBEUpload(false);
        MarketplaceToaster.showToast(
          util.getToastObject(t("messages:unable_to_download_this_format"), "error")
        );
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error.response
        );
      });
  };

  const downloadCSV = () => {
    setIsSpinning(true);
    MarketplaceServices.findMedia(LanguageDownloadApiCsv, {
      "is-format": 2,
      language_code: langCode,
    })
      .then(function (response) {
        setIsSpinning(false);
        console.log(
          "Server Response from DocumentTemplateDownload Function: ",
          LanguageDownloadApiCsv,
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.csv";
        alink.click();
        setChooseDownloadModalVisible(false);
        MarketplaceToaster.showToast(
          util.getToastObject(t("messages:download_successful"), "success")
        );
      })
      .catch((error) => {
        setIsSpinning(false);
        console.log(
          "Error server Response from DocumentTemplateDownload Function:  ",
          LanguageDownloadApiCsv,
          error
        );
        MarketplaceToaster.showToast(
          util.getToastObject(
            t("messages:unable_to_download_this_format"),
            "error"
          )
        );
      });
  };

  const downloadZIP = () => {
    setIsSpinning(true);
    MarketplaceServices.findMedia(LanguageDownloadApiZip, {
      language_code: langCode,
    })
      .then(function (response) {
        setIsSpinning(false);
        console.log(
          "Server Response from DocumentTemplateDownload Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.zip";
        alink.click();
        setChooseDownloadModalVisible(false);
        MarketplaceToaster.showToast(
          util.getToastObject(t("messages:download_successful"), "success")
        );
      })
      .catch((error) => {
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error
        );
        MarketplaceToaster.showToast(
          util.getToastObject(
            t("messages:unable_to_download_this_format"),
            "error"
          )
        );
        setIsSpinning(false);
      });
  };

  const closeKeysUploadModal = () => {
    setIsBEKeysUploadModalOpen(false);
  };

  //! get call of get document template API
  const findAllSupportDocumentTemplateDownload = (isFormat, languageCode) => {
    setIsSpinning(true);
    MarketplaceServices.findMedia(LanguageDownloadAPI, {
      "is-format": isFormat,
      language_code: languageCode,
    })
      .then(function (response) {
        setIsSpinning(false);
        console.log(
          "Server Response from DocumentTemplateDownload Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.csv";
        alink.click();

        MarketplaceToaster.showToast(
          util.getToastObject(t("messages:download_successful"), "success")
        );
      })
      .catch((error) => {
        setIsSpinning(false);
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error.response
        );
        MarketplaceToaster.showToast(
          util.getToastObject(`${t("messages:unable_to_download_this_format")}`, "error")
        );
      });
  };

  const handleChangeForBackendKeysUpload = (file) => {
    if (file.status !== "removed") {
      uploadStoreBackendKeys(file);
    }
  };

  return (
    <Content>
      <Title level={4} className=" !m-0">
        {t("labels:support_document")}
      </Title>
      <p className="mt-2 w-[80%]">{t("messages:document_description")}</p>
      <Content className="!flex gap-4">
        <>
          <img src={FrontEndKeysDownloadIcon} className="w-[8%] h-[8%] mt-2" />
        </>
        <Content className="">
          <Content className="flex justify-between">
            <Content>
              <Text className="text-base font-bold">
                {t("labels:frontend_keys")}:
              </Text>
            </Content>
            <Button
              className="app-btn-secondary flex gap-2 !items-center mb-1"
              onClick={() => findAllSupportDocumentTemplateDownload(1, null)}
            >
              <img src={DownloadIconDisable} className=" !w-2" />
              {t("labels:get_frontend_support_template")}
            </Button>
          </Content>
          <p>{t("messages:frontend_document")}</p>
          <Content className="">
            <Spin spinning={isSpinning} tip="Please wait">
              <Upload
                beforeUpload={() => {
                  return false;
                }}
                afterUpload={() => {
                  return false;
                }}
                showUploadList={false}
                accept=".csv"
                maxCount={1}
                onChange={(e) => handleFileChange(e.file)}
                className="app-btn-secondary"
                openFileDialogOnClick={
                  langCode !== undefined && langCode !== null ? true : false
                }
              >
                <Button
                  className={"flex items-center"}
                  icon={<UploadOutlined />}
                  disabled={
                    langCode !== undefined && langCode !== null ? false : true
                  }
                >
                  {t("labels:click_to_upload")}
                </Button>
              </Upload>
            </Spin>
            {/* {uploadSuccess ? ( */}
            <Content
              className="mt-2 inline-flex cursor-pointer gap-1"
              onClick={() => setChooseDownloadModalVisible(true)}
            >
              <img
                src={DownloadIcon}
                alt="download icon"
                className="!text-xs !w-[10px] !items-center"
              />
              <div className="text-[#0246bb] !ml-[8px]">
                {t("messages:download_current_document")}
              </div>
            </Content>
            {/* ) : (
              ""
            )} */}
          </Content>
        </Content>
      </Content>
      {/* <Content className="my-3 w-[40%]">
        {/* <Spin spinning={isSpinning} tip="Please wait">
          <Dragger
            beforeUpload={() => {
              return false;
            }}
            afterUpload={() => {
              return false;
            }}
            showUploadList={false}
            disabled={langCode != undefined ? false : true}
            accept=".csv"
            maxCount={1}
            onChange={(e) => handleFileChange(e.file)}
            className="app-btn-secondary"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t("messages:drag_message")}</p>
            {/* <p className="ant-upload-text mx-2">
              Upload your file here or drag and drop the file here
            </p> *
            <p className="ant-upload-hint p-2">{t("messages:drag_info")}</p>
          </Dragger>
        </Spin> */}
        {/* {uploadSuccess ? ( */}
        {/* <Button
          type="text"
          className="app-btn-text cursor-pointer gap-1 mt-2"
          onClick={() => setChooseDownloadModalVisible(true)}
        >
          <img
            src={DownloadIcon}
            alt="download icon"
            className="!text-xs !w-[10px] !items-center"
          />
          {t("messages:download_current_document")}
        </Button> */}
        {/* ) : (
                    ""
                )} 
      </Content> */}

      <Content className=" mt-4 !flex gap-4">
        <>
          <img src={BackendKeysDownloadIcon} className="w-[8%] h-[8%] mt-2" />
        </>
        <Content className="">
          <Content className="flex justify-between ">
            <Content>
              <Text className="text-base font-bold">
                {t("labels:backend_keys")}:
              </Text>
            </Content>
            <Button
              className="app-btn-secondary flex gap-2 !items-center !mb-1"
              onClick={() => downloadBEKeysFile(1, null)}
            >
              <img src={DownloadIconDisable} className=" !w-2" />
              {t("labels:get_backend_support_template")}
            </Button>
          </Content>
          <p>{t("messages:backend_document")}</p>
          <Content className="">
            <Spin spinning={isSpinningForBEUpload} tip="Please wait">
              <Upload
                beforeUpload={() => {
                  return false;
                }}
                afterUpload={() => {
                  return false;
                }}
                showUploadList={false}
                openFileDialogOnClick={
                  langCode !== undefined && langCode !== null ? true : false
                }
                accept=".csv"
                maxCount={1}
                onChange={(e) => handleChangeForBackendKeysUpload(e.file)}
                className="app-btn-secondary"
              >
                <Button
                  className={"flex items-center"}
                  icon={<UploadOutlined />}
                  disabled={
                    langCode !== undefined && langCode !== null ? false : true
                  }
                >
                  {t("labels:click_to_upload")}
                </Button>
              </Upload>
            </Spin>
            <Content
              className="mt-2 inline-flex cursor-pointer gap-1"
              onClick={() => downloadBEKeysFile(2, langCode)}
            >
              <img
                src={DownloadIcon}
                alt="download icon"
                className="!text-xs !w-[10px] !items-center"
              />
              <div className="text-[#0246bb] !ml-[8px]">
                {t("messages:download_current_document")}
              </div>
            </Content>
          </Content>
        </Content>
      </Content>

      <StoreModal
        isVisible={showSuccessModal}
        // title={t("approvals:Approval-Request-Submission")}
        okButtonText={null}
        hideCloseButton={false}
        cancelButtonText={null}
        isSpin={false}
      >
        <Content className="flex flex-col justify-center items-center">
          <CheckCircleFilled className=" text-[#52c41a] text-[80px]" />
          <Title level={3} className="!mt-5 !mb-0">
            {t("messages:upload_success")}
          </Title>
          <Text>{t("messages:upload_success_message")}</Text>
          <Content className="mt-3">
            <Button
              className="app-btn-primary mr-2"
              onClick={() => closeSuccessModal()}
            >
              {t("labels:close")}
            </Button>
            <Upload
              showUploadList={false}
              maxCount={1}
              accept=".csv"
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              onChange={(e) => {
                setShowSuccessModal(false);
                handleFileChange(e.file);
              }}
            >
              <Button className={"flex items-center"} icon={<UploadOutlined />}>
                {t("labels:upload_again")}
              </Button>
            </Upload>
          </Content>
        </Content>
      </StoreModal>
      <StoreModal
        isVisible={isBEKeysUploadModalOpen}
        // title={t("approvals:Approval-Request-Submission")}
        okButtonText={null}
        hideCloseButton={false}
        cancelButtonText={null}
        isSpin={false}
      >
        <Content className="flex flex-col justify-center items-center">
          <CheckCircleFilled className=" text-[#52c41a] text-[80px]" />
          <Title level={3} className="!mt-5 !mb-0">
            {t("labels:uploaded_successfully")}
          </Title>
          <Text>{t("labels:upload_success_message")}</Text>
          <Content className="mt-3">
            <Button
              className="app-btn-primary mr-2"
              onClick={() => closeKeysUploadModal()}
            >
              {t("labels:close")}
            </Button>
            <Upload
              showUploadList={false}
              maxCount={1}
              accept=".csv"
              beforeUpload={() => {
                return false;
              }}
              afterUpload={() => {
                return false;
              }}
              onChange={(e) => {
                setIsBEKeysUploadModalOpen(false);
                handleChangeForBackendKeysUpload(e.file);
              }}
            >
              <Button className={"flex items-center"} icon={<UploadOutlined />}>
                {t("labels:upload_again")}
              </Button>
            </Upload>
          </Content>
        </Content>
      </StoreModal>
      <StoreModal
        isVisible={chooseDownloadModalVisible}
        // title={t("messages:download_current_document")}
        okButtonText={null}
        hideCloseButton={false}
        cancelButtonText={null}
        cancelCallback={() => setChooseDownloadModalVisible(false)}
        isSpin={false}
      >
        <Spin spinning={isSpinning} tip="Please wait">
          <Content className="flex justify-between items-center">
            <Title level={4}>{t("messages:download_current_document")}</Title>
            <CloseOutlined
              role={"button"}
              className="mb-[5px]"
              onClick={() => setChooseDownloadModalVisible(false)}
            ></CloseOutlined>
          </Content>
          <Content className="my-2">
            <Typography>{t("messages:choose_download_format")}</Typography>
            <Content className="mt-3 flex">
              <Card
                onClick={() => downloadZIP()}
                className="w-[147px] mr-2 cursor-pointer"
              >
                <Content className="flex flex-col items-center">
                  <img src={codeJsonIcon} alt="json icon" />
                  <p>{t("labels:json_format")}</p>
                </Content>
              </Card>
              <Card
                onClick={() => downloadCSV()}
                className="w-[147px] cursor-pointer"
              >
                <Content className="flex flex-col items-center">
                  <img alt="table icon" src={tableIcon} />
                  <p>{t("labels:csv_format")}</p>
                </Content>
              </Card>
            </Content>
          </Content>
        </Spin>
      </StoreModal>
    </Content>
  );
}

export default LanguageDocUpload;
