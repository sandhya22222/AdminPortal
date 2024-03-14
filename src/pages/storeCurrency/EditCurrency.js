import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Space,
  Checkbox,
  Button,
  Input,
  Col,
  Row,
  Spin,
  InputNumber,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
//! Import user defined components
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { useTranslation } from "react-i18next";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import { crossIcon } from "../../constants/media";
import StoreModal from "../../components/storeModal/StoreModal";
import MarketplaceToaster from "../../util/marketplaceToaster";
import util from "../../util/common";
const { Content } = Layout;
const { Title } = Typography;

const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API;
const defaultCurrencyAPI = process.env.REACT_APP_DEFAULT_CURRENCY_API;

const EditCurrency = () => {
  const { t } = useTranslation();
  const search = useLocation().search;
  const navigate = useNavigate();
  const cId = new URLSearchParams(search).get("k");

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteCurrencyModalOpen, setIsDeleteCurrencyModalOpen] =
    useState(false);
  const [isCurrencyDeleting, setIsCurrencyDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [warningCurrencyDefaultModal, setWarningCurrencyDefaultModal] =
    useState(false);
  const [onChangeDisable, setOnChangeDisable] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState({
    currency_name: "",
    symbol: "",
    iso_currency_code: "",
    unit_conversion: "",
    minimum_amount: 0,
    unit_price_name: "",
    no_of_decimal: 1,
    is_default: false,
  });
  const [responseCurrencyData, setResponseCurrencyData] = useState([]);
  const [defaultLoader, setDefaultLoader] = useState(false);
  //!get call of list language
  const findByPageCurrencyData = () => {
    // enabling spinner
    setIsLoading(true);
    MarketplaceServices.findAll(currencyAPI, null, false)
      .then(function (response) {
        setIsLoading(false);
        console.log(
          "server Success response from currency API call",
          response.data.response_body.data
        );
        const currencyData = response.data.response_body.data;

        const filteredCurrencyData =
          currencyData &&
          currencyData.length > 0 &&
          currencyData.filter((ele) => ele.id === parseInt(cId));
        setResponseCurrencyData(filteredCurrencyData);
        let copyOfCurrencyDetails = { ...currencyDetails };
        copyOfCurrencyDetails.currency_name =
          filteredCurrencyData[0].currency_name;
        copyOfCurrencyDetails.symbol = filteredCurrencyData[0].symbol;
        copyOfCurrencyDetails.iso_currency_code =
          filteredCurrencyData[0].iso_currency_code;
        copyOfCurrencyDetails.unit_price_name =
          filteredCurrencyData[0].unit_price_name;
        copyOfCurrencyDetails.unit_conversion =
          filteredCurrencyData[0].unit_conversion;
        copyOfCurrencyDetails.minimum_amount =
          filteredCurrencyData[0].minimum_amount;
        copyOfCurrencyDetails.no_of_decimal =
          filteredCurrencyData[0].no_of_decimal;
        copyOfCurrencyDetails.is_default = filteredCurrencyData[0].is_default;
        setCurrencyDetails(copyOfCurrencyDetails);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(
          "server error response from currency API call",
          error.response
        );
      });
  };

  //!delete function of language
  const removeCurrency = () => {
    setIsCurrencyDeleting(true);
    MarketplaceServices.remove(currencyAPI, { _id: cId })
      .then((response) => {
        console.log("response from delete===>", response.data, cId);
        if (response.status === 200 || response.status === 201) {
          setIsCurrencyDeleting(false);
        }
        setShowSuccessModal(true);
        // disabling spinner
        setIsCurrencyDeleting(false);
        // MarketplaceToaster.showToast(response);
      })
      .catch((error) => {
        // disabling spinner
        setIsCurrencyDeleting(false);
        // console.log("response from delete===>", error.response);
        MarketplaceToaster.showToast(error.response);
      });
  };

  const makeAsDefaultCurrency = () => {
    let reqBody = {};
    if (onChangeDisable === true) {
      setIsLoading(true);
      reqBody = {
        no_of_decimal: currencyDetails.no_of_decimal,
      };
    } else {
      setDefaultLoader(true);
      reqBody = {
        is_default: defaultChecked,
      };
    }
    MarketplaceServices.update(defaultCurrencyAPI, reqBody, {
      _id: cId,
    })
      .then((response) => {
        setIsLoading(false);
        console.log(
          "Currency Default API success response",
          response.data.response_body
        );
        MarketplaceToaster.showToast(response);
        setOnChangeDisable(false);
        const copyOfCurrencyDetails = { ...currencyDetails };
        copyOfCurrencyDetails.is_default =
        response && response.data.response_body.is_default;
        copyOfCurrencyDetails.no_of_decimal =
        response && response.data.response_body.no_of_decimal;
        setCurrencyDetails(copyOfCurrencyDetails);      
        setDefaultChecked(response && response.data.response_body.is_default);
        closeCurrencyDefaultWaringModal(false);
        setDefaultLoader(false);
      })
      .catch((error) => {
        console.log("Currency Default API error response", error);
        setIsLoading(false);
        setDefaultLoader(false);
        setOnChangeDisable(false);
        closeCurrencyDefaultWaringModal(false);
        MarketplaceToaster.showToast(error.response);
      });
  };

  const currencyHandler = (fieldName, value) => {
    const copyOfCurrencyDetails = { ...currencyDetails };
    if (fieldName === "no_of_decimal") {
      copyOfCurrencyDetails.no_of_decimal = value;
    }
    setCurrencyDetails(copyOfCurrencyDetails);
  };

  const openDeleteModal = () => {
    setIsDeleteCurrencyModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteCurrencyModalOpen(false);
  };

  // opening the default currency warning model pop up
  const openCurrencyDefaultWaringModal = (e) => {
    setWarningCurrencyDefaultModal(true);
    setDefaultChecked(e);
  };

  // closing the default currency warning model pop up
  const closeCurrencyDefaultWaringModal = () => {
    setWarningCurrencyDefaultModal(false);
  };


  // const validationForCurrencyPutCall = () => {
  //   console.log(
  //     "responseCurrencyData",
  //     responseCurrencyData[0].no_of_decimal === currencyDetails.no_of_decimal
  //   );
  //   if (
  //     responseCurrencyData[0].no_of_decimal === currencyDetails.no_of_decimal
  //   ) {
  //     MarketplaceToaster.showToast(
  //       util.getToastObject(`${t("messages:no_changes_were_detected")}`, "info")
  //     );
  //   } else {
  //     makeAsDefaultCurrency();
  //   }
  // };

  useEffect(() => {
    findByPageCurrencyData();
    window.scroll(0, 0);
  }, [cId]);

  return (
    <Content>
      <Content>
        <HeaderForTitle
          title={
            <Content className="">
              <Title level={3} className="!font-normal ">
                {currencyDetails.currency_name}
              </Title>
            </Content>
          }
          titleContent={
            <Content className="!flex gap-3 items-center">
              {/* This content is related to currency checkbox default currency */}
              <Content className="">
                <Space direction="horizontal">
                  <Checkbox
                    className=""
                    checked={currencyDetails.is_default}
                    onChange={(e) => {
                      openCurrencyDefaultWaringModal(e.target.checked);
                    }}
                    disabled={!currencyDetails.is_default ? false : true}
                  ></Checkbox>
                  <Typography>
                    {" "}
                    {t("labels:make_currency_as_default")}
                  </Typography>
                </Space>
              </Content>
              {/* This content is related to currency remove */}
              {/* <Content>
                {/* {!isMakeAsDefault ? ( 
              <Button
                className="app-btn-danger  flex gap-2 !justify-items-center !items-center"
                onClick={() => {
                  openDeleteModal();
                }}
              >
                <img
                  src={crossIcon}
                  alt="plusIconWithAddLanguage"
                  className=""
                />
                <div className="">{t("labels:delete_currency")}</div>
              </Button>
               ) : null}
              </Content>  */}
            </Content>
          }
          backNavigationPath={`/dashboard/currency`}
          showArrowIcon={true}
          showButtons={false}
        />
      </Content>
      <Content className="!p-3 !mt-[7.5rem] !min-h-screen ">
        <Spin tip="Please wait!" size="large" spinning={isLoading}>
          <Content className=" !bg-white !p-4">
            <Col span={12} className="mb-4">
              <label className="text-[14px] mb-2 ml-1 input-label-color">
                {t("labels:currency_name")}
              </label>
              <Input
                className=""
                disabled
                value={currencyDetails.currency_name}
                placeholder={t("messages:enter_currency_name")}
              />
            </Col>
            <Row className="mb-4 gap-4">
              <Col span={3}>
                <label className="text-[14px] mb-2 ml-1 input-label-color">
                  {t("labels:currency_code")}
                </label>
                <Input
                  className=""
                  disabled
                  placeholder={t("messages:enter_currency_code")}
                  value={currencyDetails.symbol}
                />
              </Col>
              <Col span={4}>
                <label className="text-[14px] mb-2 ml-1 input-label-color">
                  {t("labels:unit_conversation")}
                </label>
                <Input
                  className=""
                  disabled
                  placeholder={t("messages:enter_unit_conversation")}
                  value={currencyDetails.unit_conversion}
                />
              </Col>
              <Col span={3}>
                <label className="text-[14px] mb-2 ml-1 input-label-color">
                  {t("labels:min_amount")}
                </label>
                <Input
                  className=""
                  disabled
                  placeholder={t("messages:enter_min_amount")}
                  value={currencyDetails.minimum_amount}
                />
              </Col>
            </Row>
            <Col span={12} className="mb-4">
              <label className="text-[14px] mb-2 ml-1 input-label-color">
                {t("labels:unit_price_name")}
              </label>
              <Input
                disabled
                className=""
                value={currencyDetails.unit_price_name}
                placeholder={t("messages:enter_unit_price_name")}
              />
            </Col>
            <Row className="mb-6 gap-4">
              <Col span={3}>
                <label className="text-[14px] mb-2 ml-1 input-label-color">
                  {t("labels:currency_symbol")}
                </label>
                <Input
                  className=""
                  disabled
                  placeholder="Enter currency symbol"
                  value={currencyDetails.symbol}
                />
              </Col>
              <Col span={3}>
                <label className="text-[14px] mb-2 ml-1 input-label-color">
                  {t("labels:no_of_decimals")}
                </label>
                <InputNumber
                  className=""
                  min={1}
                  max={4294967295}
                  minLength={1}
                  maxLength={4294967295}
                  placeholder="Enter no of decimals"
                  value={currencyDetails.no_of_decimal}
                  onChange={(e) => {
                    if (e !== "" && e !== null && e !== undefined) {
                      currencyHandler("no_of_decimal", e);
                      setOnChangeDisable(true);
                    }
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3 gap-3">
              <Col>
                <Button
                  className="app-btn-primary"
                  disabled={!onChangeDisable}
                  onClick={() => makeAsDefaultCurrency()}
                >
                  {t("labels:save")}
                </Button>
              </Col>
              <Col>
                <Button
                  className="app-btn-secondary"
                  disabled={!onChangeDisable}
                  onClick={() => navigate(`/dashboard/currency`)}
                >
                  {t("labels:discard")}
                </Button>
              </Col>
            </Row>
          </Content>
        </Spin>
      </Content>
      <StoreModal
        isVisible={isDeleteCurrencyModalOpen}
        okButtonText={t("labels:yes")}
        cancelButtonText={t("labels:cancel")}
        title={t("labels:warning")}
        okCallback={() => removeCurrency()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={isCurrencyDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{t("messages:remove_language_confirmation")}</p>
            <p>{t("messages:remove_language_confirmation_message")}</p>
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
            {t("messages:language_deleted_successfully")}
          </Title>
          <Content className="mt-3">
            <Button
              className="app-btn-primary"
              onClick={() => {
                navigate(`/dashboard/currency`);
              }}
            >
              {t("labels:close")}
            </Button>
          </Content>
        </Content>
      </StoreModal>
      <StoreModal
        isVisible={warningCurrencyDefaultModal}
        okButtonText={t("labels:yes")}
        cancelButtonText={t("labels:cancel")}
        title={t("labels:warning")}
        okCallback={() => makeAsDefaultCurrency()}
        cancelCallback={() => {
          closeCurrencyDefaultWaringModal();
          // setIsMakeAsDefault(false);
        }}
        isSpin={defaultLoader}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{t("messages:default_currency_warning_msg")}</p>
          </div>
        }
      </StoreModal>
    </Content>
  );
};

export default EditCurrency;
