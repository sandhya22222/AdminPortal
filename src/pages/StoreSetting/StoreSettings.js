import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Button,
  Spin,
} from "antd";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { toast } from "react-toastify";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import useAuthorization from "../../hooks/useAuthorization";
const { Content } = Layout;
const { Title } = Typography;

const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API;
const storeAPI = process.env.REACT_APP_STORE_API;

const StoreSettings = () => {
  const authorizationHeader = useAuthorization();

  const [storeData, setStoreData] = useState();
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
  const [foreGroundColor, setForeGroundColor] = useState("#333333");
  const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] =
    useState("");
  const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] =
    useState("");
  const [buttonTeritaryBackgroundColor, setButtonTeritaryBackgroundColor] =
    useState("");
  const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] =
    useState("");
  const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] =
    useState("");
  const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] =
    useState("");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("");
  const [footerForegroundColor, setFooterForegroundColor] = useState("");
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");
  const [headerForegroundColor, setHeaderForegroundColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const storeSettingData = [
    {
      store_currency: {
        symbol: "₹",
        iso_code: "INR",
        fractional_unit: "Paisa",
        number_to_basic: 100,
      },
      store_page_settings: {
        bg_color: "#EBEBEB",
        fg_color: "#333333",
        btn_primary_bg_color: "",
        btn_secondary_bg_color: "",
        btn_tertiary_bg_color: "",
        btn_primary_fg_color: "",
        btn_secondary_fg_color: "",
        btn_tertiary_fg_color: "",
      },
      store_header_settings: { bg_color: "", fg_color: "" },
      store_footer_settings: { bg_color: "", fg_color: "" },
    },
  ];

  const getStoreSettingApi = () => {
    axios
      .get(storeSettingAPI, authorizationHeader, {
        params: {
          "store-id": 1,
        },
      })
      .then(function (response) {
        console.log("responseofdashboard--->", response);
      })
      .catch((error) => {
        console.log("errorresponse--->", error);
      });
  };

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
  //! post call for store settings
  const storeSettingsPostCall = () => {
    const postBody = {
      store: storeId,
      store_currency: {
        symbol: currencySymbol,
        iso_code: currencyIsoCode,
        fractional_unit: fractionalUnit,
        number_to_basic: numberToBasic,
      },
      store_page_settings: {
        bg_color: pageBackgroundColor,
        fg_color: foreGroundColor,
        btn_primary_bg_color: buttonPrimaryBackgroundColor,
        btn_secondary_bg_color: buttonSecondaryBackgroundColor,
        btn_tertiary_bg_color: buttonTeritaryBackgroundColor,
        btn_primary_fg_color: buttonPrimaryForegroundColor,
        btn_secondary_fg_color: buttonSecondaryForegroundColor,
        btn_tertiary_fg_color: buttonTeritaryForegroundColor,
      },
      store_header_settings: {
        bg_color: headerBackgroundColor,
        fg_color: headerForegroundColor,
      },
      store_footer_settings: {
        bg_color: footerBackgroundColor,
        fg_color: footerForegroundColor,
      },
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
        console.log("Server Success Response From stores", response.data);
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

  const validatePostStoreSetting = () => {
    let count = 5;
    // debugger
    if (
      storeId === "Choose Store" ||
      storeId === "" ||
      storeId === undefined ||
      storeId === null
    ) {
      count--;
      setInValidStoreData(true);
      toast("Please select the store", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
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

  useEffect(() => {
    // getStoreSettingApi();
    getStoreApi();
    window.scroll(0, 0);
  }, []);

  const handleStoreChange = (value) => {
    setstoreId(value);
    setInValidStoreData(false);
  };

  // const handleFooterChange = (value) => {
  //   setFooterPositionValue(value);
  //   SetInValidFooterPositionValue(false);
  // };

  // const handleHeaderChange = (value) => {
  //   setHeaderPositionValue(value);
  //   SetInValidHeaderPositionValue(false);
  // };

  return (
    <Layout className="p-3">
      <Content className="mb-1">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Store Setting", navigationPath: "", displayOrder: 2 },
          ]}
        />
        <Row justify={"space-between"}>
          <Col>
            <Content className="float-left mt-3">
              <Title level={3} className="!font-normal">
                Store Setting
              </Title>
            </Content>
          </Col>
        </Row>
      </Content>
      <Content>
        {/* <Spin tip="Please wait!" size="large" spinning={isLoading}> */}
        <Content className="bg-white mt-2 p-3">
          <span className="text-red-600 text-sm !text-center">*</span>
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
          </Content>
          <Content>
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Currency
            </label>
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
          <Content>
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Page Setting
            </label>
            <Row className="mt-2">
              <Col span={8} className="mr-2">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
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
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
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
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={8} className="mr-2">
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
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={8} className="mr-2">
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
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={8} className="mr-2">
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
            </Row>
          </Content>
          <Content>
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Header Setting
            </label>
            <Row className="mt-2">
              <Col span={8} className="mr-2">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
                <Input
                  placeholder="Enter header type"
                  maxLength={255}
                  minLength={1}
                  value={headerBackgroundColor}
                  onChange={(e) => {
                    setHeaderBackgroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
                <Input
                  placeholder="Enter header action"
                  maxLength={255}
                  minLength={1}
                  value={headerForegroundColor}
                  onChange={(e) => {
                    setHeaderForegroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
            </Row>
          </Content>
          <Content>
            <label className="text-[20px] mb-2 mt-4 font-bold">
              Store Footer Setting
            </label>
            <Row className="mt-2">
              <Col span={8} className="mr-2">
                <label className="text-[13px] mb-2 ml-1">
                  Background Color
                </label>
                <Input
                  placeholder="Enter footer backgrond color"
                  maxLength={255}
                  minLength={1}
                  value={footerBackgroundColor}
                  onChange={(e) => {
                    setFooterBackgroundColor(e.target.value);
                  }}
                  type="color"
                />
              </Col>
              <Col span={8} className="ml-1">
                <label className="text-[13px] mb-2 ml-1">
                  Foreground Color
                </label>
                <Input
                  placeholder="Enter footer foreground color"
                  maxLength={255}
                  minLength={1}
                  value={footerForegroundColor}
                  onChange={(e) => {
                    setFooterForegroundColor(e.target.value);
                  }}
                  type="color"
                />
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
                onClick={() => validatePostStoreSetting()}
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
