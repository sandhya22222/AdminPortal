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
  Space,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { toast } from "react-toastify";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import useAuthorization from "../../hooks/useAuthorization";
import StoreModal from "../../components/storeModal/StoreModal";
import StoreImages from "./StoreImages";
import Status from "../Stores/Status";
const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API;
const storeAPI = process.env.REACT_APP_STORE_API;
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API;
const storeAbsoluteImgesAPI =
  process.env.REACT_APP_STORE_ABSOLUTE_STORE_IMAGES_API;
const StoreSettings = () => {
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
    useState("");
  const [btnPrimaryBgColor, setbtnPrimaryBgColor] = useState("");
  const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] =
    useState("");
  const [btnSecondaryBgColor, setbtnSecondaryBgColor] = useState("");
  const [buttonTeritaryBackgroundColor, setButtonTeritaryBackgroundColor] =
    useState("");
  const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState("");
  const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] =
    useState("");
  const [btnPrimaryFgColor, setbtnPrimaryFgColor] = useState("");
  const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] =
    useState("");
  const [btnSecondaryFgColor, setbtnSecondaryFgColor] = useState("");
  const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] =
    useState("");
  const [btnTeritaryFgColor, setbtnTeritaryFgColor] = useState("");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("");
  const [footerBgColor, setFooterBgColor] = useState("");
  const [footerForegroundColor, setFooterForegroundColor] = useState("");
  const [footerFgColor, setFooterFgColor] = useState("");
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");
  const [headerBgColor, setHeaderBgColor] = useState("");
  const [headerForegroundColor, setHeaderForegroundColor] = useState("");
  const [headerFgColor, setHeaderFgColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [getImageData, setGetImageData] = useState([]);
  const [validStoreLogo, setValiStoreLogo] = useState(false);
  //! get call of  getStoreSettingApi
  const getStoreSettingApi = (storeId) => {
    axios
      .get(
        storeSettingAPI,
        {
          params: {
            "store-id": storeId,
          },
        },
        authorizationHeader
      )
      .then(function (response) {
        console.log(
          "Get response of Store setting--->",
          response.data.store_settings_data[0]
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
          makeHttpRequestForRefreshToken();
        }
        if (error.response === undefined) {
          setCurrencySymbol("");
          setCurrencyIsoCode("");
          setFractionalUnit("");
          setNumberToBasic("");
          setPageBackgroundColor("#EBEBEB");
          setButtonPrimaryBackgroundColor("");
          setButtonSecondaryBackgroundColor("");
          setButtonTeritaryBackgroundColor("");
          setButtonPrimaryForegroundColor("");
          setButtonSecondaryForegroundColor("");
          setButtonTeritaryForegroundColor("");
          setForeGroundColor("#333333");
          setFooterBackgroundColor("");
          setFooterForegroundColor("");
          setHeaderForegroundColor("");
          setHeaderBackgroundColor("");
        }
      });
  };

  //! get call of store API
  const getStoreApi = () => {
    // setIsLoading(true);
    axios
      .get(storeAPI, {
        params: {
          "page-number": -1,
        },
      })
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
          makeHttpRequestForRefreshToken();
          // setErrorMessage(error.response)
        }
      });
  };

  useEffect(() => {
    if (storeData && storeData.length > 0) {
      // setStoreName(storeData[i].name);
      var storeApiData =
        storeData &&
        storeData.length > 0 &&
        storeData.filter((element) => element.id === parseInt(id));
      if (storeData && storeData.length > 0) {
        for (var i = 0; i < storeData.length; i++) {
          setStoreName(storeApiData[0].name);
        }
      }
    }
  }, [storeData]);

  //! post call for store settings
  const storeSettingsPostCall = () => {
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
    axios
      .post(storeSettingAPI, postBody, authorizationHeader)
      .then((response) => {
        toast("Store Setting created successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsLoading(false);
        console.log(
          "Server Success Response From storeSettingPostCall",
          response.data
        );
        // setPostData(response.data);
        setFractionalUnit("");
        setNumberToBasic("");
        setCurrencyIsoCode("");
        setCurrencySymbol("");
        setPageBackgroundColor("#EBEBEB");
        setButtonPrimaryBackgroundColor("");
        setButtonSecondaryBackgroundColor("");
        setButtonTeritaryBackgroundColor("");
        setButtonPrimaryForegroundColor("");
        setButtonSecondaryForegroundColor("");
        setButtonTeritaryForegroundColor("");
        setForeGroundColor("#333333");
        setFooterBackgroundColor("");
        setFooterForegroundColor("");
        setHeaderForegroundColor("");
        setHeaderBackgroundColor("");
        setstoreId("Choose Store");
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
          toast("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        console.log(error.response);
        setIsLoading(false);
        // setInValidName(true)
        // onClose();
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  //! validations of store settings API
  const validatePostStoreSetting = () => {
    let count = 4;
    // debugger
    // if (
    //   storeId === "Choose Store" ||
    //   storeId === "" ||
    //   storeId === undefined ||
    //   storeId === null
    // ) {
    //   count--;
    //   setInValidStoreData(true);
    //   toast("Please select the store", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     type: "error",
    //   });
    // }
    if (
      currencySymbol === "" ||
      currencySymbol === undefined ||
      currencySymbol === null
    ) {
      count--;
      setInValidCurrencySymbol(true);
      toast("Please provide the currency symbol", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      currencyIsoCode === "" ||
      currencyIsoCode === undefined ||
      currencyIsoCode === null
    ) {
      count--;
      setInValidCurrencyIsoCode(true);
      toast("Please provide ISO code", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      fractionalUnit === "" ||
      fractionalUnit === undefined ||
      fractionalUnit === null
    ) {
      count--;
      setInValidFractionalUnit(true);
      toast("Please provide the Fractional Unit", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      numberToBasic === "" ||
      numberToBasic === undefined ||
      numberToBasic === null
    ) {
      count--;
      setInValidNumberToBasic(true);
      toast("Please provide the number to basic", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (count === 5) {
      storeSettingsPostCall();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setValiStoreLogo(false);
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

  console.log("imagesupload", imagesUpload);

  //! get call of store images
  const getStoreImagesApi = (storeId) => {
    axios
      .get(
        storeImagesAPI,
        {
          params: {
            "store-id": storeId,
          },
        },
        authorizationHeader
      )
      .then(function (response) {
        console.log("Get response of Store setting Images--->", response);
        setGetImageData(response.data);
      })
      .catch((error) => {
        console.log("errorresponse from images--->", error);
        setGetImageData([]);
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  //! post call of store images
  const storeLogoImagePostCall = () => {
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
      formData.append("store_id", parseInt(id));
    }
    axios
      .post(
        storeImagesAPI,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        authorizationHeader
      )
      .then((response) => {
        toast("Images created successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePostCall",
          response.data
        );
        // setImagesUpload(response.data);
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
          toast("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        console.log(error.response);
        setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  const storeLogoImagePutCall = () => {
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
      formData.append("store_id", parseInt(id));
    }
    axios
      .put(
        storeImagesAPI,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        authorizationHeader
      )
      .then((response) => {
        toast("Images updated successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        setIsLoading(false);
        console.log(
          "Server Success Response From storeImagePutCall",
          response.data
        );
        // setImagesUpload(response.data);
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
          toast("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
          });
        }
        console.log(error.response);
        setIsLoading(false);
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  const postImageOnClickSave = () => {
    if (getImageData && getImageData.length !== 0) {
      storeLogoImagePutCall();
    } else {
      let count = 1;
      if (imagesUpload && imagesUpload.length === 0) {
        count--;
        setValiStoreLogo(true);
        toast("Please upload the store logo", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      }
      if (count === 1) {
        storeLogoImagePostCall();
      }
    }
  };

  useEffect(() => {
    getStoreApi();
    window.scroll(0, 0);
    if (id) {
      getStoreSettingApi(id);
      getStoreImagesApi(id);
    }
  }, []);

  const handleStoreChange = (value) => {
    if (value) {
      getStoreSettingApi(value);
      getStoreImagesApi(value);
    }
    setstoreId(value);
    setInValidStoreData(false);
  };

  const storeSettingsHeader = () => {
    return (
      <>
        <Row className="!w-full float-left flex items-center my-3">
          <Col>
            <Link to="/dashboard/store">
              <ArrowLeftOutlined
                role={"button"}
                className={"ml-4 text-black text-lg"}
              />
            </Link>
          </Col>
          <Col className="ml-4">
            <Title level={3} className="m-0 inline-block !font-normal">
              {storeName}
            </Title>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Layout>
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
      <Content className="p-3 mt-14">
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
                    setValiStoreLogo={setValiStoreLogo}
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
        <Content className="bg-white mt-2 p-3">
          <label className="text-[20px] mb-2 mt-4 font-bold">Media</label>
          <Row class="flex space-x-4">
            <Col>
              <StoreImages
                title={"Store Logo"}
                type={"store_logo"}
                storeId={id}
                imagesUpload={imagesUpload}
                setImagesUpload={setImagesUpload}
                getImageData={getImageData}
                isSingleUpload={true}
                validStoreLogo={validStoreLogo}
                setValiStoreLogo={setValiStoreLogo}
              />
            </Col>
            <Col>
              <StoreImages
                title={"Search Logo"}
                type={"search_logo"}
                storeId={id}
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
                storeId={id}
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
                storeId={id}
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
                storeId={id}
                imagesUpload={imagesUpload}
                getImageData={getImageData}
                setImagesUpload={setImagesUpload}
                isSingleUpload={true}
              />
            </Col>
          </Row>
          {/* <StoreImages
              title={"Banner Logo"}
              type={"banner_images"}
              storeId={storeId}
              imagesUpload={imagesUpload}
              setImagesUpload={setImagesUpload}
              isSingleUpload={false}
            /> */}
          <Upload
            className="w-90"
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            // defaultFileList={[...fileList]}
          >
            <Button icon={<UploadOutlined />} className="font-semibold">
              Click to Add Banner Image
            </Button>
          </Upload>
        </Content>
        <Content className="bg-white mt-2 p-3">
          <label className="text-[20px] mb-2 mt-4 font-bold">Currency</label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Symbol</label>
              <Input
                placeholder="Enter currency symbol (eg: ₹, $, £)"
                maxLength={255}
                minLength={1}
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
                }}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">ISO Code</label>
              <Input
                placeholder="Enter ISO code (eg: INR, USP ,GBP)"
                maxLength={255}
                minLength={1}
                value={currencyIsoCode}
                onChange={(e) => {
                  setCurrencyIsoCode(e.target.value);
                  setInValidCurrencyIsoCode(false);
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
                maxLength={255}
                minLength={1}
                value={fractionalUnit}
                onChange={(e) => {
                  setFractionalUnit(e.target.value);
                  setInValidFractionalUnit(false);
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
                maxLength={255}
                minLength={1}
                value={numberToBasic}
                onChange={(e) => {
                  setNumberToBasic(e.target.value);
                  setInValidNumberToBasic(false);
                }}
                className={`${
                  inValidNumberToBasic
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>
        </Content>
        <Content className="bg-white mt-2 p-3 ">
          <label className="text-[20px] mb-2 mt-4 font-bold">Region Code</label>
          <Content className="flex">
            <Input placeholder="Enter region code here" className="w-64 " />
            <Button className="ml-1 ">+ Add</Button>
          </Content>
          <TextArea
            className="mt-2"
            showCount={false}
            maxLength={100}
            style={{
              height: 120,
              resize: "none",
            }}
            onChange={(e) => e.target.value}
            placeholder="disable resize"
          >
            Codes
          </TextArea>
        </Content>
        <Content className="bg-white mt-2 p-3 ">
          <Content>
            <label className="text-[20px] mb-2 mt-2 font-bold">
              Page Theme
            </label>
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
                    maxLength={255}
                    minLength={1}
                    value={pageBackgroundColor}
                    onChange={(e) => {
                      setPageBackgroundColor(e.target.value);
                    }}
                    className="w-9 p-0"
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setPageBackgroundColor(pageBgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    maxLength={255}
                    minLength={1}
                    value={foreGroundColor}
                    onChange={(e) => {
                      setForeGroundColor(e.target.value);
                    }}
                    className="w-9 p-0"
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setForeGroundColor(pageFgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
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
                  Button Primary Background Color
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
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonPrimaryBackgroundColor(btnPrimaryBgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Button Secondary Background Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonSecondaryBackgroundColor}
                    onChange={(e) => {
                      setButtonSecondaryBackgroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonSecondaryBackgroundColor(
                              btnSecondaryBgColor
                            );
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={7} className="ml-2">
                <label className="text-[13px] mb-2 ml-1">
                  Button Teritary Background Color
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
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonTeritaryBackgroundColor(
                              btnTeritaryBgColor
                            );
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
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
                  Button Primary Foreground Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonPrimaryForegroundColor}
                    onChange={(e) => {
                      setButtonPrimaryForegroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonTeritaryBackgroundColor(
                              btnTeritaryBgColor
                            );
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Button Secondary Foreground Color
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
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonPrimaryForegroundColor(btnPrimaryFgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={7} className="ml-2">
                <label className="text-[13px] mb-2 ml-1">
                  Button Teritary Foreground Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={buttonTeritaryForegroundColor}
                    onChange={(e) => {
                      setButtonTeritaryForegroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setButtonTeritaryForegroundColor(
                              btnTeritaryFgColor
                            );
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
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
                    maxLength={255}
                    minLength={1}
                    value={headerBackgroundColor}
                    onChange={(e) => {
                      setHeaderBackgroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setHeaderBackgroundColor(headerBgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={headerForegroundColor}
                    onChange={(e) => {
                      setHeaderForegroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setHeaderForegroundColor(headerFgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
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
                    maxLength={255}
                    minLength={1}
                    value={footerBackgroundColor}
                    onChange={(e) => {
                      setFooterBackgroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setFooterBackgroundColor(headerFgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
                <Content className="flex">
                  <Input
                    type="color"
                    className="w-9 p-0"
                    maxLength={255}
                    minLength={1}
                    value={footerForegroundColor}
                    onChange={(e) => {
                      setFooterForegroundColor(e.target.value);
                    }}
                  />
                  <Space.Compact className="ml-2">
                    <Input defaultValue="0571" className="w-28" />
                    <Input
                      addonAfter={
                        <UndoOutlined
                          onClick={() => {
                            setFooterForegroundColor(footerFgColor);
                          }}
                        />
                      }
                      defaultValue="100%"
                      className="w-24"
                    />
                  </Space.Compact>
                </Content>
              </Col>
            </Row>
          </Content>
        </Content>
        <Content className="mt-3">
          <Row>
            <Col>
              <Button
                style={{ backgroundColor: "#393939" }}
                className="app-btn-primary"
                onClick={() => {
                  validatePostStoreSetting();
                  postImageOnClickSave();
                }}
              >
                Save
              </Button>
            </Col>
            <Col className="pl-4">
              <Button
                className=" app-btn-secondary"
                onClick={() => {
                  setFractionalUnit("");
                  setNumberToBasic("");
                  setCurrencyIsoCode("");
                  setCurrencySymbol("");
                  setPageBackgroundColor("#EBEBEB");
                  setButtonPrimaryBackgroundColor("");
                  setButtonSecondaryBackgroundColor("");
                  setButtonTeritaryBackgroundColor("");
                  setButtonPrimaryForegroundColor("");
                  setButtonSecondaryForegroundColor("");
                  setButtonTeritaryForegroundColor("");
                  setForeGroundColor("#333333");
                  setFooterBackgroundColor("");
                  setFooterForegroundColor("");
                  setHeaderForegroundColor("");
                  setHeaderBackgroundColor("");
                  setstoreId("Choose Store");
                }}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </Content>
        {/* </Spin> */}
      </Content>
    </Layout>
  );
};

export default StoreSettings;
