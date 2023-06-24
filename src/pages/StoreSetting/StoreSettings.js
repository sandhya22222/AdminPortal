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
  Space,
  Tooltip,
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
import useAuthorization from "../../hooks/useAuthorization";
import StoreModal from "../../components/storeModal/StoreModal";
import StoreImages from "./StoreImages";
import Status from "../Stores/Status";
import Preview from "./Preview";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API;
const storeAPI = process.env.REACT_APP_STORE_API;
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API;
const storeAbsoluteImgesAPI =
  process.env.REACT_APP_STORE_ABSOLUTE_STORE_IMAGES_API;
const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API;

const StoreSettings = () => {
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
    useState("#00000");
  const [btnPrimaryBgColor, setbtnPrimaryBgColor] = useState("#00000");
  const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] =
    useState("#00000");
  const [btnSecondaryBgColor, setbtnSecondaryBgColor] = useState("#00000");
  const [buttonTeritaryBackgroundColor, setButtonTeritaryBackgroundColor] =
    useState("#00000");
  const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState("#00000");
  const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] =
    useState("#00000");
  const [btnPrimaryFgColor, setbtnPrimaryFgColor] = useState("#00000");
  const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] =
    useState("#00000");
  const [btnSecondaryFgColor, setbtnSecondaryFgColor] = useState("#00000");
  const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] =
    useState("#00000");
  const [btnTeritaryFgColor, setbtnTeritaryFgColor] = useState("#00000");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("#00000");
  const [footerBgColor, setFooterBgColor] = useState("#00000");
  const [footerForegroundColor, setFooterForegroundColor] = useState("#00000");
  const [footerFgColor, setFooterFgColor] = useState("#00000");
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#00000");
  const [headerBgColor, setHeaderBgColor] = useState("#00000");
  const [headerForegroundColor, setHeaderForegroundColor] = useState("#00000");
  const [headerFgColor, setHeaderFgColor] = useState("#00000");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [getImageData, setGetImageData] = useState([]);
  const [validStoreLogo, setValidStoreLogo] = useState(false);
  const [changeSwitchStatus, setChangeSwitchStatus] = useState("");
  const [addCodes, setAddCodes] = useState([]);
  const [regionCode, setRegionCode] = useState("");
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
        if (error.response === undefined) {
          setCurrencySymbol("");
          setCurrencyIsoCode("");
          setFractionalUnit("");
          setNumberToBasic("");
          setPageBackgroundColor("#EBEBEB");
          setButtonPrimaryBackgroundColor("#00000");
          setButtonSecondaryBackgroundColor("#00000");
          setButtonTeritaryBackgroundColor("#00000");
          setButtonPrimaryForegroundColor("#00000");
          setButtonSecondaryForegroundColor("#00000");
          setButtonTeritaryForegroundColor("#00000");
          setForeGroundColor("#333333");
          setFooterBackgroundColor("#00000");
          setFooterForegroundColor("#00000");
          setHeaderForegroundColor("#00000");
          setHeaderBackgroundColor("#00000");
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
        if (Object.keys(sampleobject).length === 2) {
          toast("Media and store settings saved successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        } else {
          if (Object.keys(sampleobject).length > 0) {
            if (sampleobject["settings"] === "contentSettings") {
              toast("Store settings saved successfully", {
                position: toast.POSITION.TOP_RIGHT,
                type: "success",
              });
            }
          }
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
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
        console.log(error.response);
        setIsLoading(false);
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
        autoClose: false,
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
          autoClose: false,
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
          autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
        autoClose: false,
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
    else if (count === 4) {
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
            });
          }
        }

        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePostCall",
          response.data
        );
        setGetImageData([response.data]);
        // findAllWithoutPageStoreImagesApi(id);
      })
      .catch((error) => {
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
        console.log(error.response);
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
            });
          }
        }
        // setGetImageData([response.data]);
        // !TODO: Update response is not , backend is giving null for previously updated images So we are doing get call here again.
        // findAllWithoutPageStoreImagesApi(id);
        // window.location.reload();
        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePutCall",
          response.data
        );
        setImagesUpload([]);
      })
      .catch((error) => {
        if (error.response) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else if (error && error.response && error.response.status === 400) {
          toast(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        } else {
          toast("Something went wrong, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: false,
          });
        }
        console.log(error.response);
        setIsLoading(false);
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

  console.log("changeSeitchstore", changeSwitchStatus);
  const storeSettingsHeader = () => {
    return (
      <>
        <Row justify={"space-between"} className="!w-[80%] !mt-[95px]">
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
  console.log("getImageData123", imagesUpload);
  return (
    <Content>
      <Content className="mb-1">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Store Setting", navigationPath: "", displayOrder: 2 },
          ]}
        />
      </Content>
      <Content className="bg-white !w-full !fixed !z-10">
        {storeSettingsHeader()}
        {/* <Content className="flex-end">
          <Status storeId={storeId} storeApiData={storeData} />
        </Content> */}
      </Content>
      <Content className="p-3 mt-36">
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
        <Content className="bg-white p-3">
          <label className="text-[20px] mb-2 mt-4 font-bold">Media</label>
          <Row class="flex space-x-4">
            <Col>
              <StoreImages
                title={"Store Logo"}
                type={"store_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                setImagesUpload={setImagesUpload}
                getImageData={getImageData && getImageData[0]}
                isSingleUpload={true}
                validStoreLogo={validStoreLogo}
                setValidStoreLogo={setValidStoreLogo}
                InfoCircleText={"This logo will be used as Store's logo"}
              />
            </Col>
            <Col className="!ml-10">
              <StoreImages
                title={"Search Logo"}
                type={"search_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                getImageData={getImageData && getImageData[0]}
                setImagesUpload={setImagesUpload}
                isSingleUpload={true}
                InfoCircleText={
                  "The search icon will be visible in areas where the search functionality is implemented"
                }
              />
            </Col>
            <Col className="!ml-10">
              <StoreImages
                title={"Customer Logo"}
                type={"customer_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                getImageData={getImageData && getImageData[0]}
                setImagesUpload={setImagesUpload}
                isSingleUpload={true}
                InfoCircleText={
                  "This image will be displayed as the default avatar for customers"
                }
              />
            </Col>
            <Col className="!ml-10">
              <StoreImages
                title={"Cart Logo"}
                type={"cart_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                getImageData={getImageData && getImageData[0]}
                setImagesUpload={setImagesUpload}
                isSingleUpload={true}
                InfoCircleText={
                  "The cart icon will be visible in areas where the cart functionality is implemented"
                }
              />
            </Col>
            <Col className="!ml-10">
              <StoreImages
                title={"Wishlist Logo"}
                type={"wishlist_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                getImageData={getImageData && getImageData[0]}
                setImagesUpload={setImagesUpload}
                isSingleUpload={true}
                InfoCircleText={
                  "The wishlist icon will be visible in areas where the wishlist functionality is implemented"
                }
              />
            </Col>
          </Row>
          <StoreImages
            title={"Banner Logo"}
            type={"banner_images"}
            storeId={id}
            imagesUpload={imagesUpload}
            bannerAbsoluteImage={bannerAbsoluteImage}
            setImagesUpload={setImagesUpload}
            isSingleUpload={false}
            InfoCircleText={
              "These images will be used in the carousel of the store front"
            }
          />
          <Content className="mt-5 mb-6">
            <Row>
              <Col>
                <Button
                  style={{ backgroundColor: "#393939" }}
                  className="app-btn-primary"
                  onClick={() => {
                    if (imagesUpload && imagesUpload.length > 0) {
                      postImageOnClickSave();
                    } else {
                      toast("No changes were detected", {
                        position: toast.POSITION.TOP_RIGHT,
                        type: "info",
                      });
                    }
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col className="pl-4">
                <Button
                  className=" app-btn-secondary"
                  onClick={() => {
                    navigate("/dashboard/store");
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Content>
        </Content>
        <Content className="bg-white mt-3 p-3">
          <label className="text-[20px] mb-2 mt-4 font-bold">Currency</label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Symbol</label>
              <Input
                placeholder="Enter currency symbol (eg: ₹, $, £)"
                className={`${
                  inValidCurrencySymbol
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                // defaultValue={storeSettingData.store_currency["symbol"]}
                value={currencySymbol}
                onChange={(e) => {
                  setCurrencySymbol(e.target.value);
                  setInValidCurrencySymbol(false);
                  let temp = { ...copyImageOfStoreSettingsCurrency };
                  temp["symbol"] = e.target.value;
                  setCopyImageOfStoreSettingsCurrency(temp);
                }}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">ISO Code</label>
              <Input
                placeholder="Enter ISO code (eg: INR, USP ,GBP)"
                value={currencyIsoCode}
                onChange={(e) => {
                  setCurrencyIsoCode(e.target.value);
                  setInValidCurrencyIsoCode(false);
                  let temp = { ...copyImageOfStoreSettingsCurrency };
                  temp["iso_code"] = e.target.value;
                  setCopyImageOfStoreSettingsCurrency(temp);
                }}
                className={`${
                  inValidCurrencyIsoCode
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Fractional Unit</label>
              <Input
                placeholder="Enter fractional unit (eg: paisa, cent)"
                value={fractionalUnit}
                onChange={(e) => {
                  setFractionalUnit(e.target.value);
                  setInValidFractionalUnit(false);
                  let temp = { ...copyImageOfStoreSettingsCurrency };
                  temp["fractional_unit"] = e.target.value;
                  setCopyImageOfStoreSettingsCurrency(temp);
                }}
                className={`${
                  inValidFractionalUnit
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              {" "}
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Number to Basic</label>
              <Input
                placeholder="Enter number to basic (eg: 100)"
                value={numberToBasic}
                onChange={(e) => {
                  setNumberToBasic(e.target.value);
                  setInValidNumberToBasic(false);
                  let temp = { ...copyImageOfStoreSettingsCurrency };
                  temp["number_to_basic"] = e.target.value;
                  setCopyImageOfStoreSettingsCurrency(temp);
                }}
                className={`${
                  inValidNumberToBasic
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>
          {/* </Content> */}
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
          {/* <Content className="bg-white mt-3 p-3 "> */}
          <Content className="mt-3">
            <Row className="!mb-4">
              <label className="text-[20px]  mt-2 font-bold">Page Theme</label>
              <Content className="text-right">
                <Button className="!text-right" onClick={() => openModal()}>
                  <EyeOutlined className="!text-center -translate-y-0.5" />{" "}
                  Preview
                </Button>
                <StoreModal
                  isVisible={isModalOpen}
                  title={"Sample Preview Page For Store Front"}
                  width={1000}
                  cancelCallback={() => closeModal()}
                  isSpin={false}
                  className="!h-96"
                >
                  <Preview
                    headerBackgroundColor={headerBackgroundColor}
                    headerForegroundColor={headerForegroundColor}
                    footerBackgroundColor={footerBackgroundColor}
                    footerForegroundColor={footerForegroundColor}
                    pageBackgroundColor={pageBackgroundColor}
                    foreGroundColor={foreGroundColor}
                    buttonPrimaryBackgroundColor={buttonPrimaryBackgroundColor}
                    buttonSecondaryBackgroundColor={
                      buttonSecondaryBackgroundColor
                    }
                    buttonTeritaryBackgroundColor={
                      buttonTeritaryBackgroundColor
                    }
                    buttonPrimaryForegroundColor={buttonPrimaryForegroundColor}
                    buttonSecondaryForegroundColor={
                      buttonSecondaryForegroundColor
                    }
                    buttonTeritaryForegroundColor={
                      buttonTeritaryForegroundColor
                    }
                  />
                </StoreModal>
              </Content>
            </Row>
            <Row className="mt-2">
              {/* <Col span={8} className="mr-2">
              <Button
                className="float-right mb-1"
                onClick={() => {
                  setPageBackgroundColor(pageBgColor);
                }}
              >
                Reset
              </Button>
              <label className="text-[13px] mb-2 ml-1">Background Color</label>

              <Input
                placeholder="Enter header color"
                maxLength={255}
                minLength={1}
                value={pageBackgroundColor}
                onChange={(e) => {
                  setPageBackgroundColor(e.target.value);
                }}
                type="color"
              />
            </Col> */}
              {/* <Col span={8} className="ml-1">
              <Button
                className="float-right mb-1"
                onClick={() => {
                  setForeGroundColor(pageFgColor);
                }}
              >
                Reset
              </Button>
              <label className="text-[13px] mb-2 ml-1">Foreground Color</label>
              <Input
                placeholder="Enter foreground color"
                maxLength={255}
                minLength={1}
                value={foreGroundColor}
                onChange={(e) => {
                  setForeGroundColor(e.target.value);
                }}
                type="color"
              />
            </Col> */}
              <Col span={8} className="mr-2 ">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    value={pageBackgroundColor}
                    onChange={(e) => {
                      setPageBackgroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreSettingsPageTheme };
                      temp["bg_color"] = e.target.value;
                      setCopyImageOfStoreSettingsPageTheme(temp);
                    }}
                    className="w-9 p-0"
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={pageBackgroundColor}
                      className="w-[150px]"
                      onChange={(e) => {
                        setPageBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setPageBackgroundColor(pageBgColor);
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">Text Color</label>
                <Content className="flex">
                  <Input
                    type="color"
                    maxLength={255}
                    minLength={1}
                    value={foreGroundColor}
                    onChange={(e) => {
                      setForeGroundColor(e.target.value);
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
                        setForeGroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
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
                <label className="text-[13px] mb-2 ml-1">
                  Primary Button Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonPrimaryBackgroundColor}
                    onChange={(e) => {
                      setButtonPrimaryBackgroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreSettingsPageTheme };
                      temp["btn_primary_bg_color"] = e.target.value;
                      setCopyImageOfStoreSettingsPageTheme(temp);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={buttonPrimaryBackgroundColor}
                      className="w-[150px]"
                      onChange={(e) => {
                        setButtonPrimaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_primary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Secondary Button Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={buttonSecondaryBackgroundColor}
                    onChange={(e) => {
                      setButtonSecondaryBackgroundColor(e.target.value);
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
                        setButtonSecondaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_secondary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
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
              </Col>
              <Col span={7} className="ml-2">
                <label className="text-[13px] mb-2 ml-1">
                  Tertiary Button Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonTeritaryBackgroundColor}
                    onChange={(e) => {
                      setButtonTeritaryBackgroundColor(e.target.value);
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
                        setButtonTeritaryBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_tertiary_bg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
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
                <label className="text-[13px] mb-2 ml-1">
                  Primary Button Text Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={buttonPrimaryForegroundColor}
                    onChange={(e) => {
                      setButtonPrimaryForegroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreSettingsPageTheme };
                      temp["btn_primary_fg_color"] = e.target.value;
                      setCopyImageOfStoreSettingsPageTheme(temp);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={buttonPrimaryForegroundColor}
                      className="w-[150px]"
                      onChange={(e) => {
                        setButtonPrimaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_primary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Secondary Button Text Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonSecondaryForegroundColor}
                    onChange={(e) => {
                      setButtonSecondaryForegroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreSettingsPageTheme };
                      temp["btn_secondary_fg_color"] = e.target.value;
                      setCopyImageOfStoreSettingsPageTheme(temp);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={buttonSecondaryForegroundColor}
                      className="w-[150px]"
                      onChange={(e) => {
                        setButtonSecondaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_secondary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
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
              </Col>
              <Col span={7} className="ml-2">
                <label className="text-[13px] mb-2 ml-1">
                  Tertiary Button Text Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={buttonTeritaryForegroundColor}
                    onChange={(e) => {
                      setButtonTeritaryForegroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreSettingsPageTheme };
                      temp["btn_tertiary_fg_color"] = e.target.value;
                      setCopyImageOfStoreSettingsPageTheme(temp);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={buttonTeritaryForegroundColor}
                      onChange={(e) => {
                        setButtonTeritaryForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreSettingsPageTheme };
                        temp["btn_tertiary_fg_color"] = e.target.value;
                        setCopyImageOfStoreSettingsPageTheme(temp);
                      }}
                      className="w-[150px]"
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
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Header Setting
            </label>
            <Row className="mt-2">
              <Col span={8} className="mr-2 ">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={headerBackgroundColor}
                    onChange={(e) => {
                      setHeaderBackgroundColor(e.target.value);
                      let temp = { ...copyImageOfStoreHeaderSetting };
                      temp["bg_color"] = e.target.value;
                      setCopyImageOfStoreHeaderSetting(temp);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input
                      value={headerBackgroundColor}
                      className="w-[150px]"
                      onChange={(e) => {
                        setHeaderBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreHeaderSetting };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreHeaderSetting(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setHeaderBackgroundColor(headerBgColor);
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">Text Color</label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={headerForegroundColor}
                    onChange={(e) => {
                      setHeaderForegroundColor(e.target.value);
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
                        setHeaderForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreHeaderSetting };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreHeaderSetting(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setHeaderForegroundColor(headerFgColor);
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
              </Col>
            </Row>
          </Content>
          <Content>
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Footer Setting
            </label>
            <Row className="mt-2">
              <Col span={8} className="mr-2 ">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={footerBackgroundColor}
                    onChange={(e) => {
                      setFooterBackgroundColor(e.target.value);
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
                        setFooterBackgroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreFooterSetting };
                        temp["bg_color"] = e.target.value;
                        setCopyImageOfStoreFooterSetting(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setFooterBackgroundColor(headerFgColor);
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">Text Color</label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    value={footerForegroundColor}
                    onChange={(e) => {
                      setFooterForegroundColor(e.target.value);
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
                        setFooterForegroundColor(e.target.value);
                        let temp = { ...copyImageOfStoreFooterSetting };
                        temp["fg_color"] = e.target.value;
                        setCopyImageOfStoreFooterSetting(temp);
                      }}
                      addonAfter={
                        <Tooltip title="Reset to the original value">
                          <UndoOutlined
                            onClick={() => {
                              setFooterForegroundColor(footerFgColor);
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
              </Col>
            </Row>
          </Content>
          <Content className="mt-5 mb-6">
            <Row>
              <Col>
                <Button
                  style={{ backgroundColor: "#393939" }}
                  className="app-btn-primary"
                  onClick={() => {
                    validatePostStoreSetting();
                    // if (imagesUpload && imagesUpload.length > 0) {
                    //   postImageOnClickSave();
                    // }
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col className="pl-4">
                <Button
                  className=" app-btn-secondary"
                  onClick={() => {
                    navigate("/dashboard/store");
                    // setFractionalUnit("");
                    // setNumberToBasic("");
                    // setCurrencyIsoCode("");
                    // setCurrencySymbol("");
                    // setPageBackgroundColor("#EBEBEB");
                    // setButtonPrimaryBackgroundColor("#00000");
                    // setButtonSecondaryBackgroundColor("#00000");
                    // setButtonTeritaryBackgroundColor("#00000");
                    // setButtonPrimaryForegroundColor("#00000");
                    // setButtonSecondaryForegroundColor("#00000");
                    // setButtonTeritaryForegroundColor("#00000");
                    // setForeGroundColor("#333333");
                    // setFooterBackgroundColor("#00000");
                    // setFooterForegroundColor("#00000");
                    // setHeaderForegroundColor("#00000");
                    // setHeaderBackgroundColor("#00000");
                    // setImagesUpload([]);
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Content>
        </Content>
        {/* </Spin> */}
      </Content>
    </Content>
  );
};

export default StoreSettings;
