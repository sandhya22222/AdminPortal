import {
  CheckCircleFilled,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Layout, Spin, Typography, Upload } from "antd";
import React, { useState } from "react";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import StoreModal from "../../components/storeModal/StoreModal";
import { DownloadIcon, codeJsonIcon, tableIcon } from "../../constants/media";
import util from "../../util/common";
import MarketplaceToaster from "../../util/marketplaceToaster";

const { Title } = Typography;
const storeLanguageKeysUploadAPI =
  process.env.REACT_APP_UPLOAD_LANGUAGE_TRANSLATION_CSV;
const LanguageDownloadApiCsv =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV;
const LanguageDownloadApiZip =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_ZIP;
function LanguageDocUpload({ langCode }) {
  const [languageKeyFile, setLanguageKeyFile] = useState();
  const [chooseDownloadModalVisible, setChooseDownloadModalVisible] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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

  const handleFileChange = (file) => {
    console.log("test", file);
    setLanguageKeyFile(file);
    if (file.status !== "removed") {
      uploadStoreLanguageKeys(file);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data.response_body);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.csv";
        alink.click();
        setChooseDownloadModalVisible(false);
        // let successBody = {
        //   message: "Download successful",
        //   errorType: "success",
        // };
        // MarketplaceToaster.showToast("", successBody);
        MarketplaceToaster.showToast(
          util.getToastObject("Download successful", "success")
        );
      })
      .catch((error) => {
        setIsSpinning(false);
        // let errorBody = {
        //   message: "Unable to download this format",
        //   errorType: "error",
        // };
        // MarketplaceToaster.showToast("", errorBody);
        MarketplaceToaster.showToast(
          util.getToastObject("Unable to download this format", "error")
        );
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error.response
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
        // let successBody = {
        //     message: "Download successful",
        //     errorType: "success",
        //   };
        // MarketplaceToaster.showToast("", successBody);
        MarketplaceToaster.showToast(
          util.getToastObject("Download successful", "success")
        );
        const fileURL = window.URL.createObjectURL(response.data.response_body);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.zip";
        alink.click();
        setChooseDownloadModalVisible(false);
      })
      .catch((error) => {
        setIsSpinning(false);
        // let errorBody = {
        //   message: "Unable to download this format",
        //   errorType: "error",
        // };
        // MarketplaceToaster.showToast("", errorBody);
        MarketplaceToaster.showToast(
          util.getToastObject("Unable to download this format", "error")
        );
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error.response
        );
      });
  };

  return (
    <Content>
      <Content className="my-3 w-[40%]">
        <Spin spinning={isSpinning} tip="Please wait">
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
            <p className="ant-upload-text">{t("languages:Drag-Message")}</p>
            {/* <p className="ant-upload-text mx-2">
              Upload your file here or drag and drop the file here
            </p> */}
            <p className="ant-upload-hint p-2">{t("languages:Drag-Info")}</p>
          </Dragger>
        </Spin>
        {/* {uploadSuccess ? ( */}
        <Content
          className="mt-2 inline-flex cursor-pointer"
          onClick={() => setChooseDownloadModalVisible(true)}
        >
          <img
            src={DownloadIcon}
            alt="download icon"
            className="!text-xs !w-[10px] mr-1 !items-center"
          />
          <div className="text-[#0246bb] !ml-[8px]">
            {t("languages:Download-Current-Document")}
          </div>
        </Content>
        {/* ) : (
                    ""
                )} */}
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
            {t("languages:Upload-Success")}
          </Title>
          <Text>{t("languages:Upload-Success-Message")}</Text>
          <Content className="mt-3">
            <Button
              className="app-btn-primary mr-2"
              onClick={() => closeSuccessModal()}
            >
              {t("common:Close")}
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
                {t("languages:Upload-again")}
              </Button>
            </Upload>
          </Content>
        </Content>
      </StoreModal>
      <StoreModal
        isVisible={chooseDownloadModalVisible}
        // title={t("languages:Download-Current-Document")}
        okButtonText={null}
        hideCloseButton={false}
        cancelButtonText={null}
        cancelCallback={() => setChooseDownloadModalVisible(false)}
        isSpin={false}
      >
        <Spin spinning={isSpinning} tip="Please wait">
          <Content className="flex justify-between items-center">
            <Title level={4}>{t("languages:Download-Current-Document")}</Title>
            <CloseOutlined
              role={"button"}
              className="mb-[5px]"
              onClick={() => setChooseDownloadModalVisible(false)}
            ></CloseOutlined>
          </Content>
          <Content className="my-2">
            <Typography>{t("languages:Choose-Download-Format")}</Typography>
            <Content className="mt-3 flex">
              <Card
                onClick={() => downloadZIP()}
                className="w-[147px] mr-2 cursor-pointer"
              >
                <Content className="flex flex-col items-center">
                  <img src={codeJsonIcon} alt="json icon" />
                  <p>{t("languages:Json-Format")}</p>
                </Content>
              </Card>
              <Card
                onClick={() => downloadCSV()}
                className="w-[147px] cursor-pointer"
              >
                <Content className="flex flex-col items-center">
                  <img alt="table icon" src={tableIcon} />
                  <p>{t("languages:Csv-Format")}</p>
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
