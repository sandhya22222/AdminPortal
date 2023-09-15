import { CheckCircleFilled } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Layout,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import StoreModal from "../../components/storeModal/StoreModal";
import { crossIcon } from "../../constants/media";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
// import MarketplaceAppConfig from "../../util/MarketplaceMutlitenancy";
import MarketplaceToaster from "../../util/marketplaceToaster";
import { useTranslation } from "react-i18next";
const { Content } = Layout;
const { Title, Text } = Typography;
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;
const languageEditStatusAPI = process.env.REACT_APP_STORE_LANGUAGE_STATUS_API;

function LanguageHeaderAction({
  languageId,
  languageCode,
  languageStatus,
  languageDefault,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDeleteLanguageModalOpen, setIsDeleteLanguageModalOpen] =
    useState(false);
  const [islanguageDeleting, setIslanguageDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(
    languageStatus == 2 ? false : true
  );
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMakeAsDefault, setIsMakeAsDefault] = useState(
    languageDefault == "1" ? true : false
  );
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [warningLanguageDefaultModal, setWarningLanguageDefaultModal] =
    useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setSwitchStatus(languageStatus == 2 ? false : true);
  }, [languageStatus]);

  useEffect(() => {
    setIsMakeAsDefault(languageDefault == "1" ? true : false);
  }, [languageDefault]);

  // closing the delete warning model pop up
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // opening the delete warning model pop up
  const openModal = (e) => {
    setIsModalOpen(true);
  };

  // opening the default lang warning model pop up
  const openLanguageDefaultWaringModal = (e) => {
    setWarningLanguageDefaultModal(true);
    setDefaultChecked(e);
  };
  // closing the default lang warning model pop up
  const closeLanguageDefaultWaringModal = () => {
    setWarningLanguageDefaultModal(false);
  };

  const updateLanguageStatus = async () => {
    const reqBody = {
      status: changeSwitchStatus === true ? 1 : 2,
    };
    setIsLoading(true);
    MarketplaceServices.update(languageEditStatusAPI, reqBody, {
      language_id: languageId,
    })
      .then((response) => {
        setSwitchStatus(changeSwitchStatus);
        closeModal();
        setIsLoading(false);
        setSearchParams({
          k: searchParams.get("k"),
          n: searchParams.get("n"),
          c: searchParams.get("c"),
          s: changeSwitchStatus === true ? 1 : 2,
          d: searchParams.get("d"),
        });
        // let successBody = {message: response.data.response_message, errorType: "success"}
        MarketplaceToaster.showToast(response);
        // MarketplaceToaster.showToast(response)
        // toast(response.data.response_body.message, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     type: "success",
        //     autoClose: 10000,
        // });
      })
      .catch((error) => {
        setIsLoading(false);
        closeModal();
        MarketplaceToaster.showToast(error.response);
      });
  };

  const makeAsDefaultLanguage = () => {
    setIsLoading(true);
    const reqBody = {
      is_default: defaultChecked,
    };
    MarketplaceServices.update(languageEditStatusAPI, reqBody, {
      language_id: languageId,
    })
      .then((response) => {
        MarketplaceToaster.showToast(response);
        // let successBody = {message: response.data.response_message, errorType: "success"}
        // MarketplaceToaster.showToast("", successBody);
        setIsMakeAsDefault(defaultChecked);
        closeLanguageDefaultWaringModal(false);
        setIsLoading(false);
        // searchParams.get("k");
        // searchParams.get("n");
        // searchParams.get("c");
        // searchParams.get("s");
        // searchParams.get("d");
        setSearchParams({
          k: searchParams.get("k"),
          n: searchParams.get("n"),
          c: searchParams.get("c"),
          s: searchParams.get("s"),
          d: isMakeAsDefault ? 1 : 0,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        MarketplaceToaster.showToast(error.response);
      });
  };

  const onChange = (checked) => {
    setChangeSwitchStatus(checked);
    setIsModalOpen(true);
  };

  // closing the delete popup model
  const closeDeleteModal = () => {
    setIsDeleteLanguageModalOpen(false);
  };

  // opening the delete popup model
  const openDeleteModal = (id) => {
    setIsDeleteLanguageModalOpen(true);
  };

  //!delete function of language
  const removeLanguage = () => {
    setIslanguageDeleting(true);
    MarketplaceServices.remove(languageAPI, { _id: languageId })
      .then((response) => {
        console.log("response from delete===>", response.data, languageId);
        if (response.status === 200 || response.status === 201) {
          setIsDeleteLanguageModalOpen(false);
        }
        setShowSuccessModal(true);
        // disabling spinner
        setIslanguageDeleting(false);
        MarketplaceToaster.showToast(response);
      })
      .catch((error) => {
        // disabling spinner
        setIslanguageDeleting(false);
        // console.log("response from delete===>", error.response);
        MarketplaceToaster.showToast(error.response);
        // let errorBody = {message: "Deletion unsuccessful, please try again later", errorType: "error"}
        // MarketplaceToaster.showToast("", errorBody);
        // toast("Deletion unsuccessful, please try again later", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     type: "error",
        //     autoClose: 10000,
        // });
      });
  };

  return (
    <Content className="text-right !flex items-center !justify-end">
      <Content className="flex mr-2">
        <Content>
          <StoreModal
            isVisible={isModalOpen}
            okButtonText={t("common:Yes")}
            title={
              changeSwitchStatus ? t("common:Success") : t("common:Warning")
            }
            cancelButtonText={t("common:Cancel")}
            okCallback={() => updateLanguageStatus()}
            cancelCallback={() => closeModal()}
            isSpin={isLoading}
            hideCloseButton={false}
          >
            {changeSwitchStatus ? (
              <div>
                <p>{t("languages:Language-Activation-Confirmation")}</p>
                <p>{t("languages:Language-Activation-Confirmation-Message")}</p>
              </div>
            ) : (
              <div>
                <p>{t("languages:Language-Deactivation-Confirmation")}</p>
                <p>
                  {t("languages:Language-Deactivation-Confirmation-Message")}
                </p>
              </div>
            )}
          </StoreModal>
          <Content className="inline-flex items-center">
            <Typography className="pr-2">
              {" "}
              {t("languages:Status-Label")}{" "}
            </Typography>
            <Space direction="vertical">
              <Switch
                className={
                  switchStatus === true ? "!bg-green-500" : "!bg-gray-400"
                }
                checked={switchStatus}
                onChange={onChange}
                onClick={() => {
                  openModal(switchStatus);
                }}
                checkedChildren={"Active"}
                unCheckedChildren={"Inactive"}
              />
            </Space>
          </Content>
        </Content>
      </Content>
      <Content className="mx-2 contents">
        <Checkbox
          className="pr-2"
          checked={isMakeAsDefault}
          onChange={(e) => {
            openLanguageDefaultWaringModal(e.target.checked);
          }}
          disabled={switchStatus & !isMakeAsDefault ? false : true}
        ></Checkbox>
        <Typography> {t("languages:Default-Language-Label")}</Typography>
        <StoreModal
          isVisible={warningLanguageDefaultModal}
          okButtonText={t("common:Yes")}
          cancelButtonText={t("common:Cancel")}
          title={t("common:Warning")}
          okCallback={() => makeAsDefaultLanguage()}
          cancelCallback={() => {
            closeLanguageDefaultWaringModal();
            setIsMakeAsDefault(false);
          }}
          isSpin={isLoading}
          hideCloseButton={false}
        >
          {
            <div>
              <p>{t("languages:Default-Language-Warning-Msg")}</p>
            </div>
          }
        </StoreModal>
      </Content>
      {!isMakeAsDefault ? (
        <Button
          className="bg-[#FF4D4F] text-white !flex ml-2 !justify-items-center !items-center"
          onClick={() => {
            openDeleteModal(languageId);
          }}
        >
          <img
            src={crossIcon}
            alt="plusIconWithAddLanguage"
            className="!flex !mr-2 !items-center"
          />
          <div className="mr-[10px]">
            {t("languages:Remove-Language-Label")}
          </div>
        </Button>
      ) : null}
      <StoreModal
        isVisible={isDeleteLanguageModalOpen}
        okButtonText={t("common:Yes")}
        cancelButtonText={t("common:Cancel")}
        title={t("common:Warning")}
        okCallback={() => removeLanguage()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={islanguageDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{t("languages:Remove-Language-Confirmation")}</p>
            <p>{t("languages:Remove-Language-Confirmation-message")}</p>
          </div>
        }
      </StoreModal>
      <StoreModal
        isVisible={showSuccessModal}
        // title={t("approvals:Approval-Request-Submission")}
        okButtonText={null}
        hideCloseButton={false}
        cancelButtonText={null}
        isSpin={false}
      >
        <Content className="flex flex-col justify-center items-center">
          <CheckCircleFilled className=" text-[#52c41a] text-[30px]" />
          <Title level={4} className="!mt-5 !mb-0">
            {t("languages:Language-Deleted-Successfully")}
          </Title>
          <Content className="mt-3">
            <Button
              className="app-btn-primary"
              onClick={() =>
                navigate(
                  `/dashboard/languages`
                  //   ?${MarketplaceAppConfig.getStore("")}
                )
              }
            >
              {t("common:Close")}
            </Button>
          </Content>
        </Content>
      </StoreModal>
    </Content>
  );
}

export default LanguageHeaderAction;
