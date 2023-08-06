import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Button,
  Upload,
  Spin,
  Switch,
  Tag,
  Skeleton,
  Space,
  Tooltip,
  Divider,
  InputNumber,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { toast } from "react-toastify";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import { useTranslation } from "react-i18next";
import useAuthorization from "../../hooks/useAuthorization";
import StoreModal from "../../components/storeModal/StoreModal";
import StoreImages from "./StoreImages";
import Status from "../Stores/Status";
import Preview from "./Preview";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API;
const storeAPI = process.env.REACT_APP_STORE_API;
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API;
const storeAbsoluteImgesAPI =
  process.env.REACT_APP_STORE_ABSOLUTE_STORE_IMAGES_API;
const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API;

const StoreSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const authorizationHeader = useAuthorization();

  const [storeData, setStoreData] = useState();
  const [storeName, setStoreName] = useState();
  const [inValidStoreData, setInValidStoreData] = useState(false);
  const [storeId, setstoreId] = useState("Choose Store");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [inValidCurrencySymbol, setInValidCurrencySymbol] = useState(false);
  const [currencyIsoCode, setCurrencyIsoCode] = useState("");
  const [inValidCurrencyIsoCode, setInValidCurrencyIsoCode] = useState(false);
  const [fractionalUnit, setFractionalUnit] = useState("");
  const [inValidFractionalUnit, setInValidFractionalUnit] = useState(false);
  const [numberToBasic, setNumberToBasic] = useState("");
  const [inValidNumberToBasic, setInValidNumberToBasic] = useState(false);
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#EBEBEB");
  const [pageBgColor, setPageBgColor] = useState("#EBEBEB");
  const [foreGroundColor, setForeGroundColor] = useState("#333333");
  const [pageFgColor, setPageFgColor] = useState("#333333");
  const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] =
    useState("#000000");
  const [btnPrimaryBgColor, setbtnPrimaryBgColor] = useState("#000000");
  const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] =
    useState("#000000");
  const [btnSecondaryBgColor, setbtnSecondaryBgColor] = useState("#000000");
  const [buttonTeritaryBackgroundColor, setButtonTeritaryBackgroundColor] =
    useState("#000000");
  const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState("#000000");
  const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] =
    useState("#000000");
  const [btnPrimaryFgColor, setbtnPrimaryFgColor] = useState("#000000");
  const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] =
    useState("#000000");
  const [btnSecondaryFgColor, setbtnSecondaryFgColor] = useState("#000000");
  const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] =
    useState("#000000");
  const [btnTeritaryFgColor, setbtnTeritaryFgColor] = useState("#000000");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("#000000");
  const [footerBgColor, setFooterBgColor] = useState("#000000");
  const [footerForegroundColor, setFooterForegroundColor] = useState("#000000");
  const [footerFgColor, setFooterFgColor] = useState("#000000");
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#000000");
  const [headerBgColor, setHeaderBgColor] = useState("#000000");
  const [headerForegroundColor, setHeaderForegroundColor] = useState("#000000");
  const [headerFgColor, setHeaderFgColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [getImageData, setGetImageData] = useState([]);
  const [validStoreLogo, setValidStoreLogo] = useState(false);
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");
  const [addCodes, setAddCodes] = useState([]);
  const [regionCode, setRegionCode] = useState("");
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [
    copyImageOfStoreSettingsCurrency,
    setCopyImageOfStoreSettingsCurrency,
  ] = useState();
  const [
    copyImageOfStoreSettingsPageTheme,
    setCopyImageOfStoreSettingsPageTheme,
  ] = useState();
  const [copyImageOfStoreHeaderSetting, setCopyImageOfStoreHeaderSetting] =
    useState();
  const [copyImageOfStoreFooterSetting, setCopyImageOfStoreFooterSetting] =
    useState();
  const [imageOfStoreSettingsCurrency, setImageOfStoreSettingsCurrency] =
    useState();
  const [imageOfStoreSettingsPageTheme, setImageOfStoreSettingsPageTheme] =
    useState();
  const [imageOfStoreHeaderSettings, setImageOfStoreHeaderSettings] =
    useState();
  const [imageOfStoreFooterSettings, setImageOfStoreFooterSettings] =
    useState();
  const [bannerAbsoluteImage, setBannerAbsoluteImage] = useState([]);
  const [updateBannerImage, setUpdateBannerImage] = useState([]);
  // const [isEditStoreSetting, setIsEditStoreSetting] = useState([]);
  const [colorCodeValidation, setColorCodeValidation] = useState({
    pageBgColorValidation: false,
    pageTextColorValidation: false,
    primaryBgValidation: false,
    secondaryBgValidation: false,
    tertiaryBgValidation: false,
    primaryTextValidation: false,
    secondaryTextValidation: false,
    tertiaryTextValidation: false,
    headerBgValidation: false,
    headerTextValidation: false,
    footerBgValidation: false,
    footerTextValidation: false,
  });
  const [onChangeValues, setOnChangeValues] = useState(false);
  const [imageChangeValues, setImageChangeValues] = useState(false);
  let sampleobject = {};
  //! get call of  getStoreSettingApi
  const findAllWithoutPageStoreSettingApi = (storeId) => {
    // axios
    //   .get(
    //     storeSettingAPI,
    //     {
    //       params: {
    //         "store-id": storeId,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.findAllWithoutPage(storeSettingAPI, {
      store_id: storeId,
    })
      .then(function (response) {
        console.log(
          "Get response of Store setting--->",
          response.data.store_settings_data[0]
        );
        setCopyImageOfStoreSettingsCurrency(
          response.data.store_settings_data[0].store_currency[0]
        );
        setImageOfStoreSettingsCurrency(
          response.data.store_settings_data[0].store_currency[0]
        );
        setCopyImageOfStoreSettingsPageTheme(
          response.data.store_settings_data[0].store_page_settings[0]
        );
        setImageOfStoreSettingsPageTheme(
          response.data.store_settings_data[0].store_page_settings[0]
        );
        setCopyImageOfStoreHeaderSetting(
          response.data.store_settings_data[0].store_header_settings[0]
        );
        setImageOfStoreHeaderSettings(
          response.data.store_settings_data[0].store_header_settings[0]
        );
        setCopyImageOfStoreFooterSetting(
          response.data.store_settings_data[0].store_footer_settings[0]
        );
        setImageOfStoreFooterSettings(
          response.data.store_settings_data[0].store_footer_settings[0]
        );
        setCurrencySymbol(
          response.data.store_settings_data[0].store_currency[0].symbol
        );
        setCurrencyIsoCode(
          response.data.store_settings_data[0].store_currency[0].iso_code
        );
        setFractionalUnit(
          response.data.store_settings_data[0].store_currency[0].fractional_unit
        );
        setNumberToBasic(
          response.data.store_settings_data[0].store_currency[0].number_to_basic
        );
        setPageBackgroundColor(
          response.data.store_settings_data[0].store_page_settings[0].bg_color
        );
        setPageBgColor(
          response.data.store_settings_data[0].store_page_settings[0].bg_color
        );
        setForeGroundColor(
          response.data.store_settings_data[0].store_page_settings[0].fg_color
        );
        setPageFgColor(
          response.data.store_settings_data[0].store_page_settings[0].fg_color
        );
        setButtonPrimaryBackgroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_primary_bg_color
        );
        setbtnPrimaryBgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_primary_bg_color
        );
        setButtonPrimaryForegroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_primary_fg_color
        );
        setbtnPrimaryFgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_primary_fg_color
        );
        setButtonSecondaryBackgroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_secondary_bg_color
        );
        setbtnSecondaryBgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_secondary_bg_color
        );
        setButtonSecondaryForegroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_secondary_fg_color
        );
        setbtnSecondaryFgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_secondary_fg_color
        );
        setButtonTeritaryBackgroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_tertiary_bg_color
        );
        setbtnTeritaryBgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_tertiary_bg_color
        );
        setButtonTeritaryForegroundColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_tertiary_fg_color
        );
        setbtnTeritaryFgColor(
          response.data.store_settings_data[0].store_page_settings[0]
            .btn_tertiary_fg_color
        );
        setHeaderBackgroundColor(
          response.data.store_settings_data[0].store_header_settings[0].bg_color
        );
        setHeaderBgColor(
          response.data.store_settings_data[0].store_header_settings[0].bg_color
        );
        setHeaderForegroundColor(
          response.data.store_settings_data[0].store_header_settings[0].fg_color
        );
        setHeaderFgColor(
          response.data.store_settings_data[0].store_header_settings[0].fg_color
        );
        setFooterBackgroundColor(
          response.data.store_settings_data[0].store_footer_settings[0].bg_color
        );
        setFooterBgColor(
          response.data.store_settings_data[0].store_footer_settings[0].bg_color
        );
        setFooterForegroundColor(
          response.data.store_settings_data[0].store_footer_settings[0].fg_color
        );
        setFooterFgColor(
          response.data.store_settings_data[0].store_footer_settings[0].fg_color
        );
      })
      .catch((error) => {
        console.log("errorresponse--->", error.response);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response === undefined) {
            setCurrencySymbol("");
            setCurrencyIsoCode("");
            setFractionalUnit("");
            setNumberToBasic("");
            setPageBackgroundColor("#EBEBEB");
            setButtonPrimaryBackgroundColor("#000000");
            setButtonSecondaryBackgroundColor("#000000");
            setButtonTeritaryBackgroundColor("#000000");
            setButtonPrimaryForegroundColor("#000000");
            setButtonSecondaryForegroundColor("#000000");
            setButtonTeritaryForegroundColor("#000000");
            setForeGroundColor("#333333");
            setFooterBackgroundColor("#000000");
            setFooterForegroundColor("#000000");
            setHeaderForegroundColor("#000000");
            setHeaderBackgroundColor("#000000");
          }
        }
      });
  };

  //! get call of store API
  const findAllStoreApi = () => {
    // setIsLoading(true);
    // axios
    //   .get(storeAPI, {
    //     params: {
    //       "page-number": -1,
    //     },
    //   })
    MarketplaceServices.findAll(storeAPI)
      .then(function (response) {
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data.data
        );
        setStoreData(response.data.data);
      })
      .catch((error) => {
        console.log("Server error from getStoreApi Function ", error.response);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
      });
  };

  useEffect(() => {
    if (storeData && storeData.length > 0) {
      var storeApiData =
        storeData &&
        storeData.length > 0 &&
        storeData.filter((element) => element.store_uuid === id);
      if (storeApiData && storeApiData.length > 0) {
        setStoreName(storeApiData[0].name);
        setChangeSwitchStatus(storeApiData[0].status);
      }
    }
  }, [storeData]);

  //! post call for store settings
  const saveStoreSettingsCall = () => {
    const postBody = {
      store_id: id,
      store_currency: [
        {
          symbol: currencySymbol,
          iso_code: currencyIsoCode,
          fractional_unit: fractionalUnit,
          number_to_basic: numberToBasic,
        },
      ],
      store_page_settings: [
        {
          bg_color: pageBackgroundColor,
          fg_color: foreGroundColor,
          btn_primary_bg_color: buttonPrimaryBackgroundColor,
          btn_secondary_bg_color: buttonSecondaryBackgroundColor,
          btn_tertiary_bg_color: buttonTeritaryBackgroundColor,
          btn_primary_fg_color: buttonPrimaryForegroundColor,
          btn_secondary_fg_color: buttonSecondaryForegroundColor,
          btn_tertiary_fg_color: buttonTeritaryForegroundColor,
        },
      ],
      store_header_settings: [
        {
          bg_color: headerBackgroundColor,
          fg_color: headerForegroundColor,
        },
      ],
      store_footer_settings: [
        {
          bg_color: footerBackgroundColor,
          fg_color: footerForegroundColor,
        },
      ],
    };
    setIsLoading(true);
    // axios
    //   .post(storeSettingAPI, postBody, authorizationHeader)
    MarketplaceServices.save(storeSettingAPI, postBody)
      .then((response) => {
        if (sampleobject["settings"] === "contentSettings") {
          toast(`${t("stores:Store-settings-saved-successfully")}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
          // if (Object.keys(sampleobject).length === 2) {
          //   toast("Media and store settings saved successfully", {
          //     position: toast.POSITION.TOP_RIGHT,
          //     type: "success",
          //   });
          // } else {
          //   if (Object.keys(sampleobject).length > 0) {
          //     if (sampleobject["settings"] === "contentSettings") {
          //       toast("Store settings saved successfully", {
          //         position: toast.POSITION.TOP_RIGHT,
          //         type: "success",
          //       });
          //     }
          //   }
          // } else {
          //   if (Object.keys(sampleobject).length > 0) {
          //     if (sampleobject["settings"] === "contentSettings") {
          //       toast("Store settings saved successfully", {
          //         position: toast.POSITION.TOP_RIGHT,
          //         type: "success",
          //         autoClose: 10000,
          //       });
          //     }
          //   }
        }
        // toast("Store Settings Created Successfully.", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   type: "success",
        // });
        setIsLoading(false);
        console.log(
          "Server Success Response From storeSettingPostCall",
          response.data
        );
        setCopyImageOfStoreSettingsCurrency(response.data.store_currency[0]);
        setImageOfStoreSettingsCurrency(response.data.store_currency[0]);
        setCopyImageOfStoreSettingsPageTheme(
          response.data.store_page_settings[0]
        );
        setImageOfStoreSettingsPageTheme(response.data.store_page_settings[0]);
        setCopyImageOfStoreHeaderSetting(
          response.data.store_header_settings[0]
        );
        setImageOfStoreHeaderSettings(response.data.store_header_settings[0]);
        setCopyImageOfStoreFooterSetting(
          response.data.store_footer_settings[0]
        );
        setImageOfStoreFooterSettings(response.data.store_footer_settings[0]);
        setCurrencySymbol(response.data.store_currency[0].symbol);
        setCurrencyIsoCode(response.data.store_currency[0].iso_code);
        setFractionalUnit(response.data.store_currency[0].fractional_unit);
        setNumberToBasic(response.data.store_currency[0].number_to_basic);
        setPageBackgroundColor(response.data.store_page_settings[0].bg_color);
        setPageBgColor(response.data.store_page_settings[0].bg_color);
        setForeGroundColor(response.data.store_page_settings[0].fg_color);
        setPageFgColor(response.data.store_page_settings[0].fg_color);
        setButtonPrimaryBackgroundColor(
          response.data.store_page_settings[0].btn_primary_bg_color
        );
        setbtnPrimaryBgColor(
          response.data.store_page_settings[0].btn_primary_bg_color
        );
        setButtonPrimaryForegroundColor(
          response.data.store_page_settings[0].btn_primary_fg_color
        );
        setbtnPrimaryFgColor(
          response.data.store_page_settings[0].btn_primary_fg_color
        );
        setButtonSecondaryBackgroundColor(
          response.data.store_page_settings[0].btn_secondary_bg_color
        );
        setbtnSecondaryBgColor(
          response.data.store_page_settings[0].btn_secondary_bg_color
        );
        setButtonSecondaryForegroundColor(
          response.data.store_page_settings[0].btn_secondary_fg_color
        );
        setbtnSecondaryFgColor(
          response.data.store_page_settings[0].btn_secondary_fg_color
        );
        setButtonTeritaryBackgroundColor(
          response.data.store_page_settings[0].btn_tertiary_bg_color
        );
        setbtnTeritaryBgColor(
          response.data.store_page_settings[0].btn_tertiary_bg_color
        );
        setButtonTeritaryForegroundColor(
          response.data.store_page_settings[0].btn_tertiary_fg_color
        );
        setbtnTeritaryFgColor(
          response.data.store_page_settings[0].btn_tertiary_fg_color
        );
        setHeaderBackgroundColor(
          response.data.store_header_settings[0].bg_color
        );
        setHeaderBgColor(response.data.store_header_settings[0].bg_color);
        setHeaderForegroundColor(
          response.data.store_header_settings[0].fg_color
        );
        setHeaderFgColor(response.data.store_header_settings[0].fg_color);
        setFooterBackgroundColor(
          response.data.store_footer_settings[0].bg_color
        );
        setFooterBgColor(response.data.store_footer_settings[0].bg_color);
        setFooterForegroundColor(
          response.data.store_footer_settings[0].fg_color
        );
        setFooterFgColor(response.data.store_footer_settings[0].fg_color);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            toast(`${error.response.statusText}`, {
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
        // setInValidName(true)
        // onClose();
      });
  };
  //! validations of store settings API
  const validatePostStoreSetting = () => {
    let count = 4;
    if (
      currencySymbol === "" &&
      currencyIsoCode === "" &&
      fractionalUnit === "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidCurrencyIsoCode(true);
      setInValidFractionalUnit(true);
      setInValidNumberToBasic(true);
      toast("Please enter the values for the mandatory field", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol !== "" &&
      currencyIsoCode === "" &&
      fractionalUnit === "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidNumberToBasic(true);
      setInValidCurrencyIsoCode(true);
      setInValidFractionalUnit(true);
      toast(
        "Please enter the ISO Code, Fractional Unit, and Number to Basic fields",
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (
      currencySymbol === "" &&
      currencyIsoCode !== "" &&
      fractionalUnit === "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidNumberToBasic(true);
      setInValidCurrencySymbol(true);
      setInValidFractionalUnit(true);
      toast(
        "Please enter the Symbol, Fractional Unit, and Number to Basic fields",
        {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
          autoClose: 10000,
        }
      );
    } else if (
      currencySymbol === "" &&
      currencyIsoCode == "" &&
      fractionalUnit !== "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidNumberToBasic(true);
      setInValidCurrencySymbol(true);
      setInValidCurrencyIsoCode(true);
      toast("Please enter the Symbol, ISO Code, and Number to Basic fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode == "" &&
      fractionalUnit === "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidFractionalUnit(true);
      setInValidCurrencySymbol(true);
      setInValidCurrencyIsoCode(true);
      toast("Please enter the Symbol, ISO Code, and Fractional Unit fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode === "" &&
      fractionalUnit !== "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidCurrencyIsoCode(true);
      toast("Please enter the Symbol and ISO Code fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode !== "" &&
      fractionalUnit === "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidFractionalUnit(true);
      toast("Please enter the Symbol and Fractional Unit fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode !== "" &&
      fractionalUnit !== "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidNumberToBasic(true);
      toast("Please enter the Symbol and Number to Basic fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode === "" &&
      fractionalUnit !== "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidCurrencyIsoCode(true);
      toast("Please enter the Symbol and ISO Code fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol !== "" &&
      currencyIsoCode === "" &&
      fractionalUnit === "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidCurrencyIsoCode(true);
      setInValidFractionalUnit(true);
      toast("Please enter the ISO Code and Fractional Unit fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol !== "" &&
      currencyIsoCode === "" &&
      fractionalUnit !== "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidCurrencyIsoCode(true);
      setInValidNumberToBasic(true);
      toast("Please enter the ISO Code and Number to Basic fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" &&
      currencyIsoCode !== "" &&
      fractionalUnit === "" &&
      numberToBasic !== ""
    ) {
      count--;
      setInValidCurrencySymbol(true);
      setInValidFractionalUnit(true);
      toast("Please enter the Symbol and Fractional Unit fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol !== "" &&
      currencyIsoCode !== "" &&
      fractionalUnit === "" &&
      numberToBasic === ""
    ) {
      count--;
      setInValidFractionalUnit(true);
      setInValidNumberToBasic(true);
      toast("Please enter the Fractional unit and Number to Basic fields", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencySymbol === "" ||
      currencySymbol === undefined ||
      currencySymbol === null
    ) {
      count--;
      setInValidCurrencySymbol(true);
      toast("Please enter the Symbol", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      currencyIsoCode === "" ||
      currencyIsoCode === undefined ||
      currencyIsoCode === null
    ) {
      count--;
      setInValidCurrencyIsoCode(true);
      toast("Please enter the ISO code", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      fractionalUnit === "" ||
      fractionalUnit === undefined ||
      fractionalUnit === null
    ) {
      count--;
      setInValidFractionalUnit(true);
      toast("Please enter the Fractional Unit", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      numberToBasic === "" ||
      numberToBasic === undefined ||
      numberToBasic === null
    ) {
      count--;
      setInValidNumberToBasic(true);
      toast("Please enter the Number to Basic", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (
      (imageOfStoreSettingsCurrency && imageOfStoreSettingsCurrency.symbol) ===
        (copyImageOfStoreSettingsCurrency &&
          copyImageOfStoreSettingsCurrency.symbol) &&
      (imageOfStoreSettingsCurrency &&
        imageOfStoreSettingsCurrency.iso_code) ===
        (copyImageOfStoreSettingsCurrency &&
          copyImageOfStoreSettingsCurrency.iso_code) &&
      (imageOfStoreSettingsCurrency &&
        imageOfStoreSettingsCurrency.fractional_unit) ===
        (copyImageOfStoreSettingsCurrency &&
          copyImageOfStoreSettingsCurrency.fractional_unit) &&
      (imageOfStoreSettingsCurrency &&
        imageOfStoreSettingsCurrency.number_to_basic) ===
        (copyImageOfStoreSettingsCurrency &&
          copyImageOfStoreSettingsCurrency.number_to_basic) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.bg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.bg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_primary_bg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_primary_bg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_primary_fg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_primary_fg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_secondary_bg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_secondary_bg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_secondary_fg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_secondary_fg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_tertiary_bg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_tertiary_bg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.btn_tertiary_fg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.btn_tertiary_fg_color) &&
      (imageOfStoreSettingsPageTheme &&
        imageOfStoreSettingsPageTheme.fg_color) ===
        (copyImageOfStoreSettingsPageTheme &&
          copyImageOfStoreSettingsPageTheme.fg_color) &&
      (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.bg_color) ===
        (copyImageOfStoreHeaderSetting &&
          copyImageOfStoreHeaderSetting.bg_color) &&
      (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.fg_color) ===
        (copyImageOfStoreHeaderSetting &&
          copyImageOfStoreHeaderSetting.fg_color) &&
      (imageOfStoreFooterSettings && imageOfStoreFooterSettings.bg_color) ===
        (copyImageOfStoreFooterSetting &&
          copyImageOfStoreFooterSetting.bg_color) &&
      (imageOfStoreFooterSettings && imageOfStoreFooterSettings.fg_color) ===
        (copyImageOfStoreFooterSetting &&
          copyImageOfStoreFooterSetting.fg_color) &&
      imagesUpload.length === 0
    ) {
      toast("No changes were detected", {
        position: toast.POSITION.TOP_RIGHT,
        type: "info",
        autoClose: 10000,
      });
    }
    //else if (
    //   (imageOfStoreSettingsCurrency && imageOfStoreSettingsCurrency.symbol) ===
    //     (copyImageOfStoreSettingsCurrency &&
    //       copyImageOfStoreSettingsCurrency.symbol) &&
    //   (imageOfStoreSettingsCurrency &&
    //     imageOfStoreSettingsCurrency.iso_code) ===
    //     (copyImageOfStoreSettingsCurrency &&
    //       copyImageOfStoreSettingsCurrency.iso_code) &&
    //   (imageOfStoreSettingsCurrency &&
    //     imageOfStoreSettingsCurrency.fractional_unit) ===
    //     (copyImageOfStoreSettingsCurrency &&
    //       copyImageOfStoreSettingsCurrency.fractional_unit) &&
    //   (imageOfStoreSettingsCurrency &&
    //     imageOfStoreSettingsCurrency.number_to_basic) ===
    //     (copyImageOfStoreSettingsCurrency &&
    //       copyImageOfStoreSettingsCurrency.number_to_basic) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.bg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.bg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_primary_bg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_primary_bg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_primary_fg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_primary_fg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_secondary_bg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_secondary_bg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_secondary_fg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_secondary_fg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_tertiary_bg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_tertiary_bg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.btn_tertiary_fg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.btn_tertiary_fg_color) &&
    //   (imageOfStoreSettingsPageTheme &&
    //     imageOfStoreSettingsPageTheme.fg_color) ===
    //     (copyImageOfStoreSettingsPageTheme &&
    //       copyImageOfStoreSettingsPageTheme.fg_color) &&
    //   (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.bg_color) ===
    //     (copyImageOfStoreHeaderSetting &&
    //       copyImageOfStoreHeaderSetting.bg_color) &&
    //   (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.fg_color) ===
    //     (copyImageOfStoreHeaderSetting &&
    //       copyImageOfStoreHeaderSetting.fg_color) &&
    //   (imageOfStoreFooterSettings && imageOfStoreFooterSettings.bg_color) ===
    //     (copyImageOfStoreFooterSetting &&
    //       copyImageOfStoreFooterSetting.bg_color) &&
    //   (imageOfStoreFooterSettings && imageOfStoreFooterSettings.fg_color) ===
    //     (copyImageOfStoreFooterSetting &&
    //       copyImageOfStoreFooterSetting.fg_color) &&
    //   isEditStoreSetting
    // ) {
    //   count--;
    // }
    else if (
      colorCodeValidation.pageBgColorValidation === true ||
      colorCodeValidation.pageTextColorValidation === true ||
      colorCodeValidation.primaryBgValidation === true ||
      colorCodeValidation.secondaryBgValidation === true ||
      colorCodeValidation.tertiaryBgValidation === true ||
      colorCodeValidation.primaryTextValidation === true ||
      colorCodeValidation.secondaryTextValidation === true ||
      colorCodeValidation.tertiaryTextValidation === true ||
      colorCodeValidation.headerBgValidation === true ||
      colorCodeValidation.headerTextValidation === true ||
      colorCodeValidation.footerBgValidation === true ||
      colorCodeValidation.footerTextValidation === true
    ) {
      toast("Please provide the valid color value", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        autoClose: 10000,
      });
    } else if (count === 4) {
      // let temp = [...isEditStoreSetting];
      // console.log("isEditStoreSetting456", temp);
      // temp.push({ id: 2 });
      // setIsEditStoreSetting(temp);
      sampleobject["settings"] = "contentSettings";
      saveStoreSettingsCall();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    // setValidStoreLogo(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const storeLogoModal = () => {
    if (
      storeId === "Choose Store" ||
      storeId === "" ||
      storeId === undefined ||
      storeId === null
    ) {
      setInValidStoreData(true);
      toast("Please select the store", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    } else {
      openModal();
    }
  };

  //! get call of store images
  const findAllWithoutPageStoreImagesApi = (storeId) => {
    // axios
    //   .get(
    //     storeImagesAPI,
    //     {
    //       params: {
    //         "store-id": storeId,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.findAllWithoutPage(storeImagesAPI, {
      store_id: storeId,
    })
      .then(function (response) {
        console.log("Get response of Store setting Images--->", response.data);
        setGetImageData([response.data]);
      })
      .catch((error) => {
        console.log("errorresponse from images--->", error);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
        setGetImageData([]);
      });
  };

  //! post call of store images
  const saveStoreLogoImageCall = () => {
    const formData = new FormData();
    if (imagesUpload && imagesUpload.length > 0) {
      for (var i = 0; i < imagesUpload.length; i++) {
        if (imagesUpload[i].type == "store_logo") {
          formData.append("store_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "banner_images") {
          formData.append("banner_images", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "search_logo") {
          formData.append("search_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "customer_logo") {
          formData.append("customer_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "cart_logo") {
          formData.append("cart_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "wishlist_logo") {
          formData.append("wishlist_logo", imagesUpload[i].imageValue);
        }
      }
      formData.append("store_id", id);
    }
    // axios
    //   .post(
    //     storeImagesAPI,
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     },
    //     authorizationHeader
    //   )
    setIsUpLoading(true);
    MarketplaceServices.save(
      storeImagesAPI,
      formData
      //   {
      //   headers: { "Content-Type": "multipart/form-data" },
      // }
    )
      .then((response) => {
        if (
          Object.keys(sampleobject).length > 0 &&
          Object.keys(sampleobject).length !== 2
        ) {
          if (sampleobject["images"] === "images") {
            toast("Images saved successfully", {
              position: toast.POSITION.TOP_RIGHT,
              type: "success",
              autoClose: 10000,
            });
          }
        }
        setIsUpLoading(false);
        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePostCall",
          response.data
        );
        setGetImageData([response.data]);
        setImagesUpload([]);
        // findAllWithoutPageStoreImagesApi(id);
      })
      .catch((error) => {
        setIsUpLoading(false);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            toast(`${error.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            });
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
        console.log(error.response.data);
        setIsLoading(false);
      });
  };
  console.log("getImageData", getImageData);
  useEffect(() => {
    if (getImageData && getImageData.length > 0) {
      findAllWithoutPageStoreBannerImageApi(id);
    }
  }, [getImageData]);
  //!put call of store images
  const updateStoreLogoImageCall = () => {
    const formData = new FormData();
    if (imagesUpload && imagesUpload.length > 0) {
      for (var i = 0; i < imagesUpload.length; i++) {
        if (imagesUpload[i].type == "store_logo") {
          formData.append("store_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "banner_images") {
          // if (updateBannerImage && updateBannerImage.length > 0) {
          //   updateBannerImage.push(imagesUpload[i].imageValue);
          //   for (var i = 0; i < updateBannerImage.length; i++) {
          //     formData.append("banner_images", updateBannerImage[i]);
          //   }
          // } else {
          formData.append("banner_images", imagesUpload[i].imageValue);
          // }
        } else if (imagesUpload[i].type == "search_logo") {
          formData.append("search_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "customer_logo") {
          formData.append("customer_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "cart_logo") {
          formData.append("cart_logo", imagesUpload[i].imageValue);
        } else if (imagesUpload[i].type == "wishlist_logo") {
          formData.append("wishlist_logo", imagesUpload[i].imageValue);
        }
      }
      formData.append("store_id", id);
    }
    // axios
    //   .put(
    //     storeImagesAPI,
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     },
    //     authorizationHeader
    //   )
    setIsUpLoading(true);
    MarketplaceServices.update(
      storeImagesAPI,
      formData
      //   {
      //   headers: { "Content-Type": "multipart/form-data" },
      // }
    )
      .then((response) => {
        if (
          Object.keys(sampleobject).length > 0 &&
          Object.keys(sampleobject).length !== 2
        ) {
          if (sampleobject["images"] === "images") {
            toast("Images saved successfully", {
              position: toast.POSITION.TOP_RIGHT,
              type: "success",
              autoClose: 10000,
            });
          }
        }
        setGetImageData([response.data]);
        setImagesUpload([]);
        // !TODO: Update response is not , backend is giving null for previously updated images So we are doing get call here again.
        // findAllWithoutPageStoreImagesApi(id);
        //window.location.reload();
        setIsUpLoading(false);
        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePutCall",
          response.data
        );
        // setImagesUpload([]);
      })
      .catch((error) => {
        setIsUpLoading(false);
        console.log(error.response);
        setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            toast(`${error.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            });
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
      });
  };

  const postImageOnClickSave = () => {
    // let temp = [...isEditStoreSetting];
    // temp.push({ id: 1 });
    // setIsEditStoreSetting(temp);
    sampleobject["images"] = "images";
    if (getImageData && getImageData.length > 0) {
      updateStoreLogoImageCall();
    } else {
      // let count = 1;
      // if (imagesUpload && imagesUpload.length === 0) {
      //   count--;
      //   setValidStoreLogo(true);
      //   toast("Please upload the store logo", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     type: "error",
      //   });
      // }
      // if (count === 1) {
      saveStoreLogoImageCall();
      // }
    }
  };
  console.log("updateBannerImage,", updateBannerImage);
  const findAllWithoutPageStoreBannerImageApi = (storeId) => {
    // setIsLoading(true);
    // axios
    //   .get(storeBannerImageAPI, {
    //     params: {
    //       "store-id": storeId,
    //     },
    //     authorizationHeader,
    //   })
    MarketplaceServices.findAllWithoutPage(storeBannerImageAPI, {
      store_id: storeId,
    })
      .then(function (response) {
        console.log(
          "Server Response from getstoreBannerImageApi Function: ",
          response.data
        );
        // if (response.data.length > 0) {
        //   let temp = [];
        //   for (var i = 0; i < response.data.length; i++) {
        //     temp.push(response.data[i].path);
        //   }
        //   setUpdateBannerImage(temp);
        // }
        setBannerAbsoluteImage(response.data);
        // setStoreData(response.data.data);
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } 
        console.log("Server error from getStoreApi Function ", error.response);
      });
  };

  useEffect(() => {
    findAllStoreApi();
    window.scroll(0, 0);
    if (id) {
      findAllWithoutPageStoreSettingApi(id);
      findAllWithoutPageStoreImagesApi(id);
      // findAllWithoutPageStoreBannerImageApi(id);
    }
  }, []);

  // const handleStoreChange = (value) => {
  //   if (value) {
  //     getStoreSettingApi(value);
  //     findAllWithoutPageStoreImagesApi(value);
  //   }
  //   setstoreId(value);
  //   setInValidStoreData(false);
  // };

  // const onChange = (checked) => {
  //   // console.log(`switch to ${checked}`);
  //   setChangeSwitchStatus (checked)
  // };

  const storeSettingsHeader = () => {
    return (
      <>
        <Row justify={"space-between"} className="!w-[80%] !mt-[60px]">
          <Col>
            <Content className=" text-right !ml-2 flex items-center ">
              <Link to="/dashboard/store">
                <ArrowLeftOutlined
                  role={"button"}
                  className={"text-black text-lg -translate-y-1 ml-2"}
                />
              </Link>
              <Title level={3} className=" ml-3 inline-block  !font-normal">
                {storeName}
              </Title>
            </Content>
          </Col>

          <Col>
            <Content className="text-right  flex items-center">
              {/* <Switch
                className="bg-gray-400"
                checked={changeSwitchStatus === 1 ? true : false}
              /> */}
              <Status
                storeId={id}
                storeStatus={changeSwitchStatus === 1 ? true : false}
                storeApiData={storeData}
              />
              {/* <Content className="pl-1 ">
                {changeSwitchStatus === 1 ? "Active" : "Inactive"}
              </Content> */}
            </Content>
          </Col>
        </Row>
      </>
    );
  };

  const numberToBasicLimit = (e) => {
    const { key, keyCode } = e;
    const { value } = e.target;
    if (value.length >= 5 && keyCode !== 8) {
      e.preventDefault(); // Prevents the input event from being fired, except for Backspace key
    }
    if (
      !(
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Tab" ||
        (e.key >= "0" && e.key <= "9")
      )
    ) {
      e.preventDefault();
    }
  };

  const validateRegionCode = () => {
    if (regionCode !== undefined && regionCode !== null && regionCode !== "") {
      let temp = [...addCodes];
      temp.push(regionCode);
      setAddCodes(temp);
      setRegionCode("");
    } else {
      setRegionCode("");
    }
  };

  const log = (e) => {
    console.log(e);
  };
  console.log("imageChangeValues", imageChangeValues);
  return (
    <Content>
      <HeaderForTitle
        title={
          <Content className="flex">
            <Content className="flex text-left self-center items-center pr-3">
              <Link to="/dashboard/store">
                <ArrowLeftOutlined
                  role={"button"}
                  className={"text-black text-lg -translate-y-1"}
                />
              </Link>
              <Title level={3} className="!font-normal mb-0 ml-4">
                {storeName}
              </Title>
            </Content>
            <Content className="text-right flex flex-row-reverse items-center">
              <Status
                storeId={id}
                storeStatus={changeSwitchStatus === 1 ? true : false}
                storeApiData={storeData}
                className="!inline-block"
              />
            </Content>
          </Content>
        }
      />
      <Content className="p-3 mt-[7rem]">
        {/* <Spin tip="Please wait!" size="large" spinning={isLoading}> */}
        {/* <Content className="bg-white mt-2 p-3"> */}
        {/* <span className="text-red-600 text-sm !text-center">*</span>
          <label className="text-[16px] mb-2 ml-1 font-bold">Store</label>
          <Content>
            <Select
              allowClear
              placeholder={"Choose Store"}
              value={storeId}
              onChange={handleStoreChange}
              className={`${
                inValidStoreData
                  ? "!border-red-400 !border-solid !border-[0.5px] focus:border-red-400 hover:border-red-400 w-[33%]"
                  : "w-[33%]"
              }`}
            >
              {storeData &&
                storeData.length > 0 &&
                storeData.map((e) => (
                  <Select.Option value={e.id} id={e.id} key={e.id}>
                    {e.name}
                  </Select.Option>
                ))}
            </Select>
            <Button className="float-right" onClick={() => storeLogoModal()}>
              + Store media
            </Button>
            <StoreModal
              // closeModal="!overflow-y-auto !h-96"
              isVisible={isModalOpen}
              okButtonText={"Save"}
              title={"Store Images"}
              width={900}
              cancelButtonText={"Cancel"}
              okCallback={() => {
                postImageOnClickSave();
              }}
              cancelCallback={() => closeModal()}
              isSpin={false}
            >
              <Row>
                <Col>
                  <StoreImages
                    title={"Store Logo"}
                    type={"store_logo"}
                    storeId={storeId}
                    imagesUpload={imagesUpload}
                    setImagesUpload={setImagesUpload}
                    getImageData={getImageData}
                    isSingleUpload={true}
                    validStoreLogo={validStoreLogo}
                    setValidStoreLogo={setValidStoreLogo}
                  />
                </Col>
                <Col>
                  <StoreImages
                    title={"Search Logo"}
                    type={"search_logo"}
                    storeId={storeId}
                    imagesUpload={imagesUpload}
                    getImageData={getImageData}
                    setImagesUpload={setImagesUpload}
                    isSingleUpload={true}
                  />
                </Col>
                <Col>
                  <StoreImages
                    title={"Customer Logo"}
                    type={"customer_logo"}
                    storeId={storeId}
                    imagesUpload={imagesUpload}
                    getImageData={getImageData}
                    setImagesUpload={setImagesUpload}
                    isSingleUpload={true}
                  />
                </Col>
                <Col>
                  <StoreImages
                    title={"Cart Logo"}
                    type={"cart_logo"}
                    storeId={storeId}
                    imagesUpload={imagesUpload}
                    getImageData={getImageData}
                    setImagesUpload={setImagesUpload}
                    isSingleUpload={true}
                  />
                </Col>
                <Col>
                  <StoreImages
                    title={"Wishlist Logo"}
                    type={"wishlist_logo"}
                    storeId={storeId}
                    imagesUpload={imagesUpload}
                    getImageData={getImageData}
                    setImagesUpload={setImagesUpload}
                    isSingleUpload={true}
                  />
                </Col>
              </Row>
              <StoreImages
                title={"Banner Logo"}
                type={"banner_images"}
                storeId={storeId}
                imagesUpload={imagesUpload}
                setImagesUpload={setImagesUpload}
                isSingleUpload={false}
              />
            </StoreModal>
          </Content> */}
        <Spin tip="Please wait!" size="large" spinning={isUpLoading}>
          <Content className="bg-white p-3 !rounded-md">
            <label className="text-[20px] mb-2 font-bold">
              {t("stores:Media")}
            </label>
            <Row class="flex space-x-4">
              <Col>
                <StoreImages
                  title={`${t("stores:Store-Logo")}`}
                  type={"store_logo"}
                  storeId={id}
                  imagesUpload={imagesUpload}
                  setImagesUpload={setImagesUpload}
                  getImageData={getImageData && getImageData[0]}
                  isSingleUpload={true}
                  validStoreLogo={validStoreLogo}
                  setValidStoreLogo={setValidStoreLogo}
                  InfoCircleText={`${t("stores:Store-Logo-Info")}`}
                  setImageChangeValues={setImageChangeValues}
                />
              </Col>
              {/* <Col className="!ml-10">
                <StoreImages
                  title={`${t("stores:Search-Logo")}`}
                  type={"search_logo"}
                  storeId={id}
                  imagesUpload={imagesUpload}
                  getImageData={getImageData && getImageData[0]}
                  setImagesUpload={setImagesUpload}
                  isSingleUpload={true}
                  InfoCircleText={`${t("stores:Search-Logo-Info")}`}
                  setImageChangeValues={setImageChangeValues}
                />
              </Col>
              <Col className="!ml-10">
                <StoreImages
                  title={`${t("stores:Customer-Logo")}`}
                  type={"customer_logo"}
                  storeId={id}
                  imagesUpload={imagesUpload}
                  getImageData={getImageData && getImageData[0]}
                  setImagesUpload={setImagesUpload}
                  isSingleUpload={true}
                  InfoCircleText={`${t("stores:Customer-Logo-info")}`}
                  setImageChangeValues={setImageChangeValues}
                />
              </Col>
              <Col className="!ml-10">
                <StoreImages
                  title={`${t("stores:Cart-Logo")}`}
                  type={"cart_logo"}
                  storeId={id}
                  imagesUpload={imagesUpload}
                  getImageData={getImageData && getImageData[0]}
                  setImagesUpload={setImagesUpload}
                  isSingleUpload={true}
                  InfoCircleText={`${t("stores:Cart-Logo-info")}`}
                  setImageChangeValues={setImageChangeValues}
                />
              </Col>
              <Col className="!ml-10">
                <StoreImages
                  title={`${t("stores:Wishlist-Logo")}`}
                  type={"wishlist_logo"}
                  storeId={id}
                  imagesUpload={imagesUpload}
                  getImageData={getImageData && getImageData[0]}
                  setImagesUpload={setImagesUpload}
                  isSingleUpload={true}
                  InfoCircleText={`${t("stores:Wishlist-Logo-Info")}`}
                  setImageChangeValues={setImageChangeValues}
                />
              </Col> */}
            </Row>
            <StoreImages
              title={`${t("stores:Banner-Logo")}`}
              type={"banner_images"}
              storeId={id}
              imagesUpload={imagesUpload}
              bannerAbsoluteImage={bannerAbsoluteImage}
              setImagesUpload={setImagesUpload}
              isSingleUpload={false}
              InfoCircleText={`${t("stores:Banner-Logo-Info")}`}
              setImageChangeValues={setImageChangeValues}
            />
            <Content className="mt-4">
              <Row>
                <Col>
                  <Button
                    // className="app-btn-primary"
                    className={
                      imageChangeValues ? "app-btn-primary" : "!opacity-75"
                    }
                    disabled={!imageChangeValues}
                    onClick={() => {
                      if (imagesUpload && imagesUpload.length > 0) {
                        postImageOnClickSave();
                      } else {
                        toast(`${t("common:No-Changes-Detected")}`, {
                          position: toast.POSITION.TOP_RIGHT,
                          type: "info",
                          autoClose: 10000,
                        });
                      }
                    }}
                  >
                    {t("common:Save")}
                  </Button>
                </Col>
                <Col className="pl-2">
                  <Button
                    // className=" app-btn-secondary"
                    className={
                      imageChangeValues ? "app-btn-secondary" : "!opacity-75"
                    }
                    disabled={!imageChangeValues}
                    onClick={() => {
                      navigate("/dashboard/store");
                    }}
                  >
                    {t("common:Discard")}
                  </Button>
                </Col>
              </Row>
            </Content>
          </Content>
        </Spin>
        <Content className="bg-white mt-3 p-3 rounded-lg">
          <label className="text-[20px] font-bold !text-center">
            {t("stores:Currency")}
          </label>
          <Divider className="!my-4" />
          <Row
            className="mt-2"
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col span={4} className="gutter-row">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("stores:Symbol")}
              </label>
              <Input
                placeholder={t("stores:Enter-currency-symbol")}
                className={`${
                  inValidCurrencySymbol
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                // defaultValue={storeSettingData.store_currency["symbol"]}
                value={currencySymbol}
                maxLength={3}
                onChange={(e) => {
                  const regex = /^[A-Za-z $£€¥₹]*$/;
                  const inputValue = e.target.value.replace(/\!/g, "");

                  if (regex.test(inputValue) || inputValue === "") {
                    setCurrencySymbol(inputValue);
                    setOnChangeValues(true);
                    setInValidCurrencySymbol(false);
                    let temp = { ...copyImageOfStoreSettingsCurrency };
                    temp["symbol"] = inputValue;
                    setCopyImageOfStoreSettingsCurrency(temp);
                  } else {
                    setInValidCurrencySymbol(true);
                  }
                }}
                onBlur={() => {
                  const trimmed = currencySymbol.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setCurrencySymbol(trimmedUpdate);
                }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("stores:ISO-Code")}
              </label>
              <Input
                placeholder={t("stores:Enter-ISO-code")}
                value={currencyIsoCode}
                maxLength={3}
                onChange={(e) => {
                  const regex = /^[A-Za-z]*$/;
                  if (regex.test(e.target.value)) {
                    setCurrencyIsoCode(e.target.value);
                    setInValidCurrencyIsoCode(false);
                    setOnChangeValues(true);
                    let temp = { ...copyImageOfStoreSettingsCurrency };
                    temp["iso_code"] = e.target.value;
                    setCopyImageOfStoreSettingsCurrency(temp);
                  } else {
                    // setCurrencyIsoCode("");
                    setInValidCurrencyIsoCode(true);
                  }
                }}
                onBlur={() => {
                  const trimmed = currencyIsoCode.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setCurrencyIsoCode(trimmedUpdate);
                }}
                className={`${
                  inValidCurrencyIsoCode
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            {/* </Row>
          <Row className="mt-4"> */}
            <Col span={4} className="gutter-row">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("stores:Fractional-Unit")}
              </label>
              <Input
                placeholder={t("stores:Enter-fractional-unit")}
                value={fractionalUnit}
                maxLength={10}
                onChange={(e) => {
                  const regex = /^[A-Za-z]*$/;
                  if (regex.test(e.target.value)) {
                    setFractionalUnit(e.target.value);
                    setInValidFractionalUnit(false);
                    setOnChangeValues(true);
                    let temp = { ...copyImageOfStoreSettingsCurrency };
                    temp["fractional_unit"] = e.target.value;
                    setCopyImageOfStoreSettingsCurrency(temp);
                  } else {
                    setInValidFractionalUnit(true);
                  }
                }}
                onBlur={() => {
                  const trimmed = fractionalUnit.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setFractionalUnit(trimmedUpdate);
                }}
                className={`${
                  inValidFractionalUnit
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={4} className="gutter-row">
              {" "}
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("stores:Number-to-Basic")}
              </label>
              <InputNumber
                placeholder={t("stores:Enter-number-to-basic")}
                value={numberToBasic}
                min={0}
                onChange={(e) => {
                  // setNumberToBasic(e);
                  if (e !== null) {
                    setNumberToBasic(e);
                    setInValidNumberToBasic(false);
                  } else {
                    setNumberToBasic(e);
                    setInValidNumberToBasic(true);
                  }
                  let temp = { ...copyImageOfStoreSettingsCurrency };
                  temp["number_to_basic"] = e;
                  setCopyImageOfStoreSettingsCurrency(temp);
                  setOnChangeValues(true);
                }}
                onBlur={() => {
                  const trimmed = numberToBasic.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setNumberToBasic(trimmedUpdate);
                }}
                onKeyDown={numberToBasicLimit}
                className={`${
                  inValidNumberToBasic
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>

          {/* <Content className="bg-white mt-2 p-3 ">
          <label className="text-[20px] mb-2 mt-4 font-bold">Region Code</label>
          <Content className="flex">
            <Input
              placeholder="Enter region code here"
              className="w-64 "
              onChange={(e) => setRegionCode(e.target.value)}
            />
            <Button className="ml-1 " onClick={() => validateRegionCode()}>
              + Add
            </Button>
          </Content>
          <Content
            className="border-solid border-2 !max-h-[900px] mt-2 p-1"
            style={{
              height: 120,
            }}
          >
            <Content>
              <div className="p-1 ml">Codes</div>
              <div
                className="text-sky-500 float-right cursor-pointer text-lg mt-[-29px]"
                onClick={() => {
                  setAddCodes([]);
                }}
              >
                clear
              </div>
            </Content>
            <Content className="mt-2 -translate-y-0.4">
              {addCodes &&
                addCodes.length > 0 &&
                addCodes.map((ele) => {
                  return (
                    <Tag closable onClose={log}>
                      {ele}
                    </Tag>
                  );
                })}
            </Content>
          </Content>
        </Content> */}
          <Content className="">
            <Content className="">
              <Row className="!mb-4">
                <label className="text-[20px]  mt-2 font-bold select-none">
                  {t("stores:Page-Theme")}
                </label>
                <Content className="text-right">
                  <Button className="!text-right" onClick={() => openModal()}>
                    <EyeOutlined className="!text-center -translate-y-0.5" />{" "}
                    {t("stores:Preview")}
                  </Button>
                  <StoreModal
                    isVisible={isModalOpen}
                    title={`${t("stores:Sample-Preview-Page-For-Store-Front")}`}
                    width={1000}
                    cancelCallback={() => closeModal()}
                    isSpin={false}
                    className="!h-96"
                    // hideCloseButton={false}
                  >
                    <Preview
                      headerBackgroundColor={headerBackgroundColor}
                      headerForegroundColor={headerForegroundColor}
                      footerBackgroundColor={footerBackgroundColor}
                      footerForegroundColor={footerForegroundColor}
                      pageBackgroundColor={pageBackgroundColor}
                      foreGroundColor={foreGroundColor}
                      buttonPrimaryBackgroundColor={
                        buttonPrimaryBackgroundColor
                      }
                      buttonSecondaryBackgroundColor={
                        buttonSecondaryBackgroundColor
                      }
                      buttonTeritaryBackgroundColor={
                        buttonTeritaryBackgroundColor
                      }
                      buttonPrimaryForegroundColor={
                        buttonPrimaryForegroundColor
                      }
                      buttonSecondaryForegroundColor={
                        buttonSecondaryForegroundColor
                      }
                      buttonTeritaryForegroundColor={
                        buttonTeritaryForegroundColor
                      }
                      getImageData={getImageData}
                    />
                  </StoreModal>
                </Content>
              </Row>
              <Divider className="!my-4" />
              <Row className="mt-2">
                <Col span={8} className="mr-2 ">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      value={pageBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["pageBgColorValidation"] = true;
                          setColorCodeValidation(temp);
                          setPageBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["pageBgColorValidation"] = false;
                          setColorCodeValidation(temp);
                          setPageBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setPageBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                      className="w-9 p-0"
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={pageBackgroundColor}
                        maxLength={7}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["pageBgColorValidation"] = true;
                            setColorCodeValidation(temp);
                            setPageBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["pageBgColorValidation"] = false;
                            setColorCodeValidation(temp);
                            setPageBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setPageBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["bg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setPageBackgroundColor(pageBgColor);
                                let temp = { ...colorCodeValidation };
                                temp["pageBgColorValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setPageBackgroundColor(pageBgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.pageBgColorValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #0000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={8} className="ml-1">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      value={foreGroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["pageTextColorValidation"] = true;
                          setColorCodeValidation(temp);
                          setForeGroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["pageTextColorValidation"] = false;
                          setColorCodeValidation(temp);
                          setForeGroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setForeGroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                      className="w-9 p-0"
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={foreGroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["pageTextColorValidation"] = true;
                            setColorCodeValidation(temp);
                            setForeGroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["pageTextColorValidation"] = false;
                            setColorCodeValidation(temp);
                            setForeGroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setForeGroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["fg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                let temp = { ...colorCodeValidation };
                                temp["pageTextColorValidation"] = false;
                                setColorCodeValidation(temp);
                                setForeGroundColor(pageFgColor);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setForeGroundColor(pageFgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.pageTextColorValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
              </Row>
              <Row className="mt-4">
                {/* <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonPrimaryBackgroundColor(btnPrimaryBgColor);
                  }}
                >
                  Reset
                </Button>

                <label className="text-[13px] mb-2 ml-1">
                  Button Primary Background Color
                </label>

                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonPrimaryBackgroundColor}
                  onChange={(e) => {
                    setButtonPrimaryBackgroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
              <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonSecondaryBackgroundColor(btnSecondaryBgColor);
                  }}
                >
                  Reset
                </Button>
                <label className="text-[13px] mb-2 ml-1">
                  Button Secondary Background Color
                </label>
                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonSecondaryBackgroundColor}
                  onChange={(e) => {
                    setButtonSecondaryBackgroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col> */}
                <Col span={8} className="mr-2 ">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Primary-Button-Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={buttonPrimaryBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["primaryBgValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonPrimaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["primaryBgValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonPrimaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonPrimaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_primary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonPrimaryBackgroundColor}
                        maxLength={7}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["primaryBgValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonPrimaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["primaryBgValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonPrimaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setButtonPrimaryBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_primary_bg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonPrimaryBackgroundColor(
                                  btnPrimaryBgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["primaryBgValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonPrimaryBackgroundColor(
                                btnPrimaryBgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.primaryBgValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={8} className="ml-1">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Secondary-Button-Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={buttonSecondaryBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["secondaryBgValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonSecondaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["secondaryBgValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonSecondaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonSecondaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_secondary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonSecondaryBackgroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["secondaryBgValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonSecondaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["secondaryBgValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonSecondaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }

                          // setButtonSecondaryBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_secondary_bg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonSecondaryBackgroundColor(
                                  btnSecondaryBgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["secondaryBgValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonSecondaryBackgroundColor(
                                btnSecondaryBgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.secondaryBgValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={7} className="ml-2">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Tertiary-Button-Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={buttonTeritaryBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["tertiaryBgValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonTeritaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["tertiaryBgValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonTeritaryBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonTeritaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_tertiary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonTeritaryBackgroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["tertiaryBgValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonTeritaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["tertiaryBgValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonTeritaryBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setButtonTeritaryBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_tertiary_bg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonTeritaryBackgroundColor(
                                  btnTeritaryBgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["tertiaryBgValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonTeritaryBackgroundColor(
                                btnTeritaryBgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.tertiaryBgValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
              </Row>
              <Row className="mt-4">
                {/* <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonTeritaryBackgroundColor(btnTeritaryBgColor);
                  }}
                >
                  Reset
                </Button>
                <label className="text-[13px] mb-2 ml-1">
                  Button Teritary Background Color
                </label>

                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonTeritaryBackgroundColor}
                  onChange={(e) => {
                    setButtonTeritaryBackgroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
              <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonPrimaryForegroundColor(btnPrimaryFgColor);
                  }}
                >
                  Reset
                </Button>
                <label className="text-[13px] mb-2 ml-1">
                  Button Primary Foreground Color
                </label>

                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonPrimaryForegroundColor}
                  onChange={(e) => {
                    setButtonPrimaryForegroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col> */}
                <Col span={8} className="mr-2 ">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Primary-Button-Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={buttonPrimaryForegroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["primaryTextValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonPrimaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["primaryTextValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonPrimaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonPrimaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_primary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonPrimaryForegroundColor}
                        maxLength={7}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["primaryTextValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonPrimaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["primaryTextValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonPrimaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setButtonPrimaryForegroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_primary_fg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonPrimaryForegroundColor(
                                  btnPrimaryFgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["primaryTextValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonTeritaryBackgroundColor(
                                btnTeritaryBgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.primaryTextValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={8} className="ml-1">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Secondary-Button-Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={buttonSecondaryForegroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["secondaryTextValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonSecondaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["secondaryTextValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonSecondaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonSecondaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_secondary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonSecondaryForegroundColor}
                        maxLength={7}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["secondaryTextValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonSecondaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["secondaryTextValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonSecondaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setButtonSecondaryForegroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_secondary_fg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonSecondaryForegroundColor(
                                  btnSecondaryFgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["secondaryTextValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonPrimaryForegroundColor(
                                btnPrimaryFgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.secondaryTextValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={7} className="ml-2">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Tertiary-Button-Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      maxLength={7}
                      value={buttonTeritaryForegroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["tertiaryTextValidation"] = true;
                          setColorCodeValidation(temp);
                          setButtonTeritaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["tertiaryTextValidation"] = false;
                          setColorCodeValidation(temp);
                          setButtonTeritaryForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setButtonTeritaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_tertiary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={buttonTeritaryForegroundColor}
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["tertiaryTextValidation"] = true;
                            setColorCodeValidation(temp);
                            setButtonTeritaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["tertiaryTextValidation"] = false;
                            setColorCodeValidation(temp);
                            setButtonTeritaryForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setButtonTeritaryForegroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreSettingsPageTheme };
                          temp["btn_tertiary_fg_color"] = e.target.value;
                          setCopyImageOfStoreSettingsPageTheme(temp);
                        }}
                        className="w-[150px]"
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setButtonTeritaryForegroundColor(
                                  btnTeritaryFgColor
                                );
                                let temp = { ...colorCodeValidation };
                                temp["tertiaryTextValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setButtonTeritaryForegroundColor(
                                btnTeritaryFgColor
                              );
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.tertiaryTextValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
              </Row>
              {/* <Row className="mt-4">
              <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonSecondaryForegroundColor(btnSecondaryFgColor);
                  }}
                >
                  Reset
                </Button>
                <label className="text-[13px] mb-2 ml-1">
                  Button Secondary Foreground Color
                </label>

                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonSecondaryForegroundColor}
                  onChange={(e) => {
                    setButtonSecondaryForegroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
              <Col span={8} className="mr-2">
                <Button
                  className="float-right mb-1"
                  onClick={() => {
                    setButtonTeritaryForegroundColor(btnTeritaryFgColor);
                  }}
                >
                  Reset
                </Button>

                <label className="text-[13px] mb-2 ml-1">
                  Button Teritary Foreground Color
                </label>

                <Input
                  placeholder="Enter header background color"
                  maxLength={255}
                  minLength={1}
                  value={buttonTeritaryForegroundColor}
                  onChange={(e) => {
                    setButtonTeritaryForegroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
            </Row> */}
            </Content>
            <Content>
              <label className="text-[20px] mb-2 mt-4 font-bold select-none">
                {t("stores:Store-Header-Setting")}
              </label>
              <Row className="mt-2">
                <Col span={8} className="mr-2 ">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={headerBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["headerBgValidation"] = true;
                          setColorCodeValidation(temp);
                          setHeaderBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["headerBgValidation"] = false;
                          setColorCodeValidation(temp);
                          setHeaderBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setHeaderBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreHeaderSetting };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreHeaderSetting(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={headerBackgroundColor}
                        maxLength={7}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["headerBgValidation"] = true;
                            setColorCodeValidation(temp);
                            setHeaderBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["headerBgValidation"] = false;
                            setColorCodeValidation(temp);
                            setHeaderBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setHeaderBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreHeaderSetting };
                          temp["bg_color"] = e.target.value;
                          setCopyImageOfStoreHeaderSetting(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setHeaderBackgroundColor(headerBgColor);
                                let temp = { ...colorCodeValidation };
                                temp["headerBgValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setHeaderBackgroundColor(headerBgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.headerBgValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={8} className="ml-1">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {" "}
                    {t("stores:Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      maxLength={255}
                      minLength={1}
                      value={headerForegroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["headerTextValidation"] = true;
                          setColorCodeValidation(temp);
                          setHeaderForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["headerTextValidation"] = false;
                          setColorCodeValidation(temp);
                          setHeaderForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setHeaderForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreHeaderSetting };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreHeaderSetting(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={headerForegroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["headerTextValidation"] = true;
                            setColorCodeValidation(temp);
                            setHeaderForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["headerTextValidation"] = false;
                            setColorCodeValidation(temp);
                            setHeaderForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setHeaderForegroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreHeaderSetting };
                          temp["fg_color"] = e.target.value;
                          setCopyImageOfStoreHeaderSetting(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setHeaderForegroundColor(headerFgColor);
                                let temp = { ...colorCodeValidation };
                                temp["headerTextValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setHeaderForegroundColor(headerFgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.headerTextValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
              </Row>
            </Content>
            <Content>
              <label className="text-[20px] mb-2 mt-4 font-bold select-none">
                {t("stores:Store-Footer-Setting")}
              </label>
              <Row className="mt-2">
                <Col span={8} className="mr-2 ">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Background-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={footerBackgroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["footerBgValidation"] = true;
                          setColorCodeValidation(temp);
                          setFooterBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["footerBgValidation"] = false;
                          setColorCodeValidation(temp);
                          setFooterBackgroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setFooterBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreFooterSetting };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreFooterSetting(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={footerBackgroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["footerBgValidation"] = true;
                            setColorCodeValidation(temp);
                            setFooterBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["footerBgValidation"] = false;
                            setColorCodeValidation(temp);
                            setFooterBackgroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setFooterBackgroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreFooterSetting };
                          temp["bg_color"] = e.target.value;
                          setCopyImageOfStoreFooterSetting(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setFooterBackgroundColor(headerFgColor);
                                let temp = { ...colorCodeValidation };
                                temp["footerBgValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setFooterBackgroundColor(headerFgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.footerBgValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
                <Col span={8} className="ml-1">
                  <label className="text-[13px] mb-2 ml-1 select-none">
                    {t("stores:Text-Color")}
                  </label>
                  <Content className="flex">
                    <Input
                      type="color"
                      className="w-9 p-0"
                      value={footerForegroundColor}
                      onChange={(e) => {
                        const patternName = /^#([A-Fa-f0-9]{6})$/;
                        if (patternName.test(e.target.value) === false) {
                          let temp = { ...colorCodeValidation };
                          temp["footerTextValidation"] = true;
                          setColorCodeValidation(temp);
                          setFooterForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        } else {
                          let temp = { ...colorCodeValidation };
                          temp["footerTextValidation"] = false;
                          setColorCodeValidation(temp);
                          setFooterForegroundColor(e.target.value);
                          setOnChangeValues(true);
                        }
                        // setFooterForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreFooterSetting };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreFooterSetting(temp);
                      }}
                    />
                    <Space.Compact className="ml-2">
                      <Input
                        value={footerForegroundColor}
                        className="w-[150px]"
                        onChange={(e) => {
                          const patternName = /^#([A-Fa-f0-9]{6})$/;
                          if (patternName.test(e.target.value) === false) {
                            let temp = { ...colorCodeValidation };
                            temp["footerTextValidation"] = true;
                            setColorCodeValidation(temp);
                            setFooterForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          } else {
                            let temp = { ...colorCodeValidation };
                            temp["footerTextValidation"] = false;
                            setColorCodeValidation(temp);
                            setFooterForegroundColor(e.target.value);
                            setOnChangeValues(true);
                          }
                          // setFooterForegroundColor(e.target.value);
                          let temp = { ...copyImageOfStoreFooterSetting };
                          temp["fg_color"] = e.target.value;
                          setCopyImageOfStoreFooterSetting(temp);
                        }}
                        addonAfter={
                          <Tooltip
                            title={t("stores:Reset-to-the-original-value")}
                          >
                            <UndoOutlined
                              onClick={() => {
                                setFooterForegroundColor(footerFgColor);
                                let temp = { ...colorCodeValidation };
                                temp["footerTextValidation"] = false;
                                setColorCodeValidation(temp);
                              }}
                            />
                          </Tooltip>
                        }
                      />
                      {/* <Input
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setFooterForegroundColor(footerFgColor);
                            }}
                          />
                        </Tooltip>
                      }
                      defaultValue="100%"
                      className="w-24"
                    /> */}
                    </Space.Compact>
                  </Content>
                  {colorCodeValidation.footerTextValidation === true ? (
                    <p className="text-red-600 text-sm">
                      Please enter valid Hexadecimal Color code <br />
                      ex. #ffffff for white, #000000 for black
                    </p>
                  ) : null}
                </Col>
              </Row>
            </Content>
            <Content className="mt-4">
              <Row>
                <Col>
                  <Button
                    // className="app-btn-primary"
                    className={
                      onChangeValues ? "app-btn-primary " : "!opacity-75"
                    }
                    disabled={!onChangeValues}
                    onClick={() => {
                      validatePostStoreSetting();
                      // if (imagesUpload && imagesUpload.length > 0) {
                      //   postImageOnClickSave();
                      // }
                    }}
                  >
                    {t("common:Save")}
                  </Button>
                </Col>
                <Col className="pl-2">
                  <Button
                    // className=" app-btn-secondary"
                    className={
                      onChangeValues === true
                        ? "app-btn-secondary "
                        : "!opacity-75"
                    }
                    disabled={!onChangeValues}
                    onClick={() => {
                      navigate("/dashboard/store");
                      // setFractionalUnit("");
                      // setNumberToBasic("");
                      // setCurrencyIsoCode("");
                      // setCurrencySymbol("");
                      // setPageBackgroundColor("#EBEBEB");
                      // setButtonPrimaryBackgroundColor("#000000");
                      // setButtonSecondaryBackgroundColor("#000000");
                      // setButtonTeritaryBackgroundColor("#000000");
                      // setButtonPrimaryForegroundColor("#000000");
                      // setButtonSecondaryForegroundColor("#000000");
                      // setButtonTeritaryForegroundColor("#000000");
                      // setForeGroundColor("#333333");
                      // setFooterBackgroundColor("#000000");
                      // setFooterForegroundColor("#000000");
                      // setHeaderForegroundColor("#000000");
                      // setHeaderBackgroundColor("#000000");
                      // setImagesUpload([]);
                    }}
                  >
                    {t("common:Discard")}
                  </Button>
                </Col>
              </Row>
            </Content>
          </Content>
        </Content>
      </Content>
      {/* </Spin> */}
    </Content>
  );
};

export default StoreSettings;
