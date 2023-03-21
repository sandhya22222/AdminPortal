import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Button,
  Form,
} from "antd";
import { Colorpicker, ColorPickerValue } from "antd-colorpicker";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import { toast } from "react-toastify";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
const { Content } = Layout;
const { Title } = Typography;

const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API;
const storeAPI = process.env.REACT_APP_STORE_API;

const StoreSettings = () => {
  const [storeData, setStoreData] = useState();
  const [inValidStoreData, setInValidStoreData] = useState(false);
  const [storeId, setstoreId] = useState("Choose Store");
  const [primaryColor, setPrimaryColor] = useState("#f4f4f4");
  const [inValidPrimaryColor, setInValidPrimaryColor] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#f4f4f4");
  const [inValidBackgroundColor, setInValidBackgroundColor] = useState(false);
  const [buttonColor, setButtonColor] = useState("#1677ff");
  const [inValidButtonColor, setInValidButtonColor] = useState(false);
  const [buttonTextColor, setButtonTextColor] = useState("#181819");
  const [inValidButtonTextColor, setInValidButtonTextColor] = useState(false);
  const [headerColor, setHeaderColor] = useState("#f4f4f4");
  const [inValidHeaderColor, setInValidHeaderColor] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState("#181819");
  const [inValidHeaderTextColor, setInValidHeaderTextColor] = useState(false);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#f4f4f4");
  const [inValidHeaderBackgroundColor, setInValidHeaderBackgroundColor] =
    useState(false);
  const [footerColor, setFooterColor] = useState("#6F6F6F");
  const [inValidFooterColor, setInValidFooterColor] = useState(false);
  const [footerTextColor, setFooterTextColor] = useState("#C6B69F");
  const [inValidFooterTextColor, setInValidFooterTextColor] = useState(false);
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("#6F6F6F");
  const [inValidFooterBackgroundTextColor, setInValidFooterBackgrondTextColor] =
    useState(false);
  const [headerType, setHeaderType] = useState("");
  const [inValidHeaderType, setInValidHeaderType] = useState(false);
  const [headerAction, setHeaderAction] = useState("");
  const [inValidHeaderAction, setInValidHeaderAction] = useState(false);
  const [headerValue, setHeaderValue] = useState("");
  const [inValidHeaderValue, setInValidHeaderValue] = useState(false);
  const [headerIcon, setHeaderIcon] = useState("");
  const [inValidHeaderIcon, setInValidHeaderIcon] = useState(false);
  const [footerType, setFooterType] = useState("");
  const [inValidFooterType, setInValidFooterType] = useState(false);
  const [footerAction, setFooterAction] = useState("");
  const [inValidFooterAction, setInValidFooterAction] = useState(false);
  const [footerValue, setFooterValue] = useState("");
  const [inValidFooterValue, setInValidFooterValue] = useState(false);
  const [footerIcon, setFooterIcon] = useState("");
  const [inValidFooterIcon, setInValidFooterIcon] = useState(false);
  const [footerPositionValue, setFooterPositionValue] = useState("right");
  const [inValidFooterPositionValue, SetInValidFooterPositionValue] =
    useState(false);
  const [headerPositionValue, setHeaderPositionValue] = useState("right");
  const [inValidHeaderPositionValue, SetInValidHeaderPositionValue] =
    useState(false);

  const getStoreSettingApi = () => {
    axios
      .get(storeSettingAPI, {
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
      basic: [
        {
          primarycolor: primaryColor,
          backgroundcolor: backgroundColor,
          buttoncolor: buttonColor,
          buttontextcolor: buttonTextColor,
        },
      ],
      header: [
        {
          header_color: headerColor,
          header_text_color: headerTextColor,
          header_background_color: headerBackgroundColor,
          header_content: [
            {
              header_position: headerPositionValue,
              header_type: headerType,
              header_action: headerAction,
              header_value: headerValue,
              header_icon: headerIcon,
            },
          ],
        },
      ],
      footer: [
        {
          footer_color: footerColor,
          footer_text_color: footerTextColor,
          footer_background_color: footerBackgroundColor,
          footer_content: [
            {
              footer_position: footerPositionValue,
              footer_type: footerType,
              footer_action: footerAction,
              footer_value: footerValue,
              footer_icon: footerIcon,
            },
          ],
        },
      ],
    };
    // setIsUpLoading(true);
    axios
      .post(storeSettingAPI, postBody)
      .then((response) => {
        toast("Store Setting created successfully.", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
        });
        // setIsUpLoading(false);
        console.log("Server Success Response From stores", response.data);
        // setPostData(response.data);
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
        // setIsUpLoading(false);
        // setInValidName(true)
        // onClose();
        if (error && error.response && error.response.status === 401) {
          makeHttpRequestForRefreshToken();
        }
      });
  };

  const validatePostStoreSetting = () => {
    let count = 21;
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
      headerPositionValue === "" ||
      headerPositionValue === undefined ||
      headerPositionValue === null
    ) {
      count--;
      SetInValidHeaderPositionValue(true);
      toast("Please select header position value", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerPositionValue === "" ||
      headerPositionValue === undefined ||
      headerPositionValue === null
    ) {
      count--;
      SetInValidFooterPositionValue(true);
      toast("Please select footer position value", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      primaryColor === "" ||
      primaryColor === undefined ||
      primaryColor === null
    ) {
      count--;
      setInValidPrimaryColor(true);
      toast("Please provide the primary color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      backgroundColor === "" ||
      backgroundColor === undefined ||
      backgroundColor === null
    ) {
      count--;
      setInValidBackgroundColor(true);
      toast("Please provide the background color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      buttonColor === "" ||
      buttonColor === undefined ||
      buttonColor === null
    ) {
      count--;
      setInValidButtonColor(true);
      toast("Please provide the button color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      buttonTextColor === "" ||
      buttonTextColor === undefined ||
      buttonTextColor === null
    ) {
      count--;
      setInValidButtonTextColor(true);
      toast("Please provide the button text color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerColor === "" ||
      headerColor === undefined ||
      headerColor === null
    ) {
      count--;
      setInValidHeaderColor(true);
      toast("Please provide the header color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerTextColor === "" ||
      headerTextColor === undefined ||
      headerTextColor === null
    ) {
      count--;
      setInValidHeaderTextColor(true);
      toast("Please provide the header text color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerBackgroundColor === "" ||
      headerBackgroundColor === undefined ||
      headerBackgroundColor === null
    ) {
      count--;
      setInValidHeaderBackgroundColor(true);
      toast("Please provide the header background color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      footerColor === "" ||
      footerColor === undefined ||
      footerColor === null
    ) {
      count--;
      setInValidFooterColor(true);
      toast("Please provide the footer color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      footerBackgroundColor === "" ||
      footerBackgroundColor === undefined ||
      footerBackgroundColor === null
    ) {
      count--;
      setInValidFooterBackgrondTextColor(true);
      toast("Please provide the footer background color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      footerTextColor === "" ||
      footerTextColor === undefined ||
      footerTextColor === null
    ) {
      count--;
      setInValidFooterTextColor(true);
      toast("Please provide the footer text color", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerAction === "" ||
      headerAction === undefined ||
      headerAction === null
    ) {
      count--;
      setInValidHeaderAction(true);
      toast("Please provide the header action", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      headerValue === "" ||
      headerValue === undefined ||
      headerValue === null
    ) {
      count--;
      setInValidHeaderValue(true);
      toast("Please provide the header value", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (headerType === "" || headerType === undefined || headerType === null) {
      count--;
      setInValidHeaderType(true);
      toast("Please provide the header type", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (headerIcon === "" || headerIcon === undefined || headerIcon === null) {
      count--;
      setInValidHeaderIcon(true);
      toast("Please provide the header icon", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      footerAction === "" ||
      footerAction === undefined ||
      footerAction === null
    ) {
      count--;
      setInValidFooterAction(true);
      toast("Please provide the footer action", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (
      footerValue === "" ||
      footerValue === undefined ||
      footerValue === null
    ) {
      count--;
      setInValidFooterValue(true);
      toast("Please provide the footer value", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (footerType === "" || footerType === undefined || footerType === null) {
      count--;
      setInValidFooterType(true);
      toast("Please provide the footer type", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (footerIcon === "" || footerIcon === undefined || footerIcon === null) {
      count--;
      setInValidFooterIcon(true);
      toast("Please provide the footer icon", {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
    if (count === 21) {
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

  const handleFooterChange = (value) => {
    setFooterPositionValue(value);
    SetInValidFooterPositionValue(false);
  };

  const handleHeaderChange = (value) => {
    setHeaderPositionValue(value);
    setInValidHeaderValue(false);
  };

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
      <Content className="bg-white mt-2 p-3">
        <label className="text-[16px] mb-2 ml-1 font-bold">Store</label>
        <Content>
          <Select
            allowClear
            placeholder={"Choose Store"}
            value={storeId}
            onChange={handleStoreChange}
            className={`${
              inValidStoreData
                ? "!border-red-400 !border-solid !border-[1px] focus:border-red-400 hover:border-red-400 w-[33%]"
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
          <label className="text-[20px] mb-2 mt-4 font-bold">Basic</label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Primary Color</label>
              <Input
                placeholder="Enter primary color"
                maxLength={255}
                minLength={1}
                className={`${
                  inValidPrimaryColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  setInValidPrimaryColor(false);
                }}
                type="color"
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Background Color</label>
              <Input
                placeholder="Enter backgroud color"
                maxLength={255}
                minLength={1}
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  setInValidBackgroundColor(false);
                }}
                className={`${
                  inValidBackgroundColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                type="color"
              />
              {/* <Colorpicker
                popup={true}
                blockStyles={{
                  width: "30px",
                  height: "30px",
                  // borderRadius: "50%",
                }}
                picker={"ChromePicker"}
                value={color}
                onChange={onChange}  
                onColorResult={(color) => color.rgb}               
              /> */}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Button Color</label>
              <Input
                placeholder="Enter button color"
                maxLength={255}
                minLength={1}
                value={buttonColor}
                type="color"
                onChange={(e) => {
                  setButtonColor(e.target.value);
                  setInValidButtonColor(false);
                }}
                className={`${
                  inValidButtonColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              {" "}
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Button text color</label>
              <Input
                placeholder="Enter button text color"
                maxLength={255}
                minLength={1}
                value={buttonTextColor}
                onChange={(e) => {
                  setButtonTextColor(e.target.value);
                  setInValidButtonTextColor(false);
                }}
                className={`${
                  inValidButtonTextColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                type="color"
              />
            </Col>
          </Row>
        </Content>
        <Content>
          <label className="text-[20px] mb-2 mt-4 font-bold">Header</label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Color</label>
              <Input
                placeholder="Enter header color"
                maxLength={255}
                minLength={1}
                value={headerColor}
                onChange={(e) => {
                  setHeaderColor(e.target.value);
                  setInValidHeaderColor(false);
                }}
                className={`${
                  inValidHeaderColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
                type="color"
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Text Color</label>
              <Input
                placeholder="Enter header text color"
                maxLength={255}
                minLength={1}
                value={headerTextColor}
                onChange={(e) => {
                  setHeaderTextColor(e.target.value);
                  setInValidHeaderTextColor(false);
                }}
                className={`${
                  inValidHeaderTextColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
                type="color"
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                Header Background Color
              </label>
              <Input
                placeholder="Enter header background color"
                maxLength={255}
                minLength={1}
                value={headerBackgroundColor}
                onChange={(e) => {
                  setHeaderBackgroundColor(e.target.value);
                  setInValidHeaderBackgroundColor(false);
                }}
                className={`${
                  inValidHeaderBackgroundColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
                type="color"
              />
            </Col>
            {/* <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Content</label>
              <Input placeholder="Enter header content" />
            </Col> */}
          </Row>
        </Content>
        <Content>
          <label className="text-[15px] mb-2 mt-4 font-bold">
            Header Content
          </label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Type</label>
              <Input
                placeholder="Enter header type"
                maxLength={255}
                minLength={1}
                value={headerType}
                onChange={(e) => {
                  setHeaderType(e.target.value);
                  setInValidHeaderType(false);
                }}
                className={`${
                  inValidHeaderType
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Action</label>
              <Input
                placeholder="Enter header action"
                maxLength={255}
                minLength={1}
                value={headerAction}
                onChange={(e) => {
                  setHeaderAction(e.target.value);
                  setInValidHeaderAction(false);
                }}
                className={`${
                  inValidHeaderAction
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Value</label>
              <Input
                placeholder="Enter header value"
                maxLength={255}
                minLength={1}
                value={headerValue}
                onChange={(e) => {
                  setHeaderValue(e.target.value);
                  setInValidHeaderValue(false);
                }}
                className={`${
                  inValidHeaderValue
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Header Icon</label>
              <Input
                placeholder="Enter header icon"
                maxLength={255}
                minLength={1}
                value={headerIcon}
                onChange={(e) => {
                  setHeaderIcon(e.target.value);
                  setInValidHeaderIcon(false);
                }}
                className={`${
                  inValidHeaderIcon
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
              />
            </Col>
          </Row>
          <Row>
            <label className="text-[13px] mb-2 mt-4">Header Position</label>
          </Row>
          <Row className="mt-1">
            <Content>
              <Select
                // value={storeId}
                placeholder={"Please select header position"}
                onChange={handleHeaderChange}
                // className="w-[33%]"
                className={`${
                  inValidHeaderPositionValue
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 w-[33%]"
                    : "w-[33%]"
                }`}
                allowClear
                value={headerPositionValue}
                options={[
                  {
                    value: "right",
                    label: "right",
                  },
                  {
                    value: "left",
                    label: "left",
                  },
                  {
                    value: "center",
                    label: "center",
                  },
                  {
                    value: "top",
                    label: "top",
                  },
                  {
                    value: "bottom",
                    label: "bottom",
                  },
                ]}
                defaultValue={{
                  value: "right",
                  label: "right",
                }}
              />
            </Content>
          </Row>
        </Content>
        <Content>
          <label className="text-[20px] mb-2 mt-4 font-bold">Footer</label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Color</label>
              <Input
                placeholder="Enter footer color"
                maxLength={255}
                minLength={1}
                value={footerColor}
                onChange={(e) => {
                  setFooterColor(e.target.value);
                  setInValidFooterColor(false);
                }}
                className={`${
                  inValidFooterColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                type="color"
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Text Color</label>
              <Input
                placeholder="Enter footer text color"
                maxLength={255}
                minLength={1}
                value={footerTextColor}
                onChange={(e) => {
                  setFooterTextColor(e.target.value);
                  setInValidFooterTextColor(false);
                }}
                className={`${
                  inValidFooterTextColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                type="color"
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                Footer Background Color
              </label>
              <Input
                placeholder="Enter footer background color"
                maxLength={255}
                minLength={1}
                value={footerBackgroundColor}
                onChange={(e) => {
                  setFooterBackgroundColor(e.target.value);
                  setInValidFooterBackgrondTextColor(false);
                }}
                className={`${
                  inValidFooterBackgroundTextColor
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 "
                    : ""
                }`}
                type="color"
              />
            </Col>
            {/* <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Content</label>
              <Input placeholder="Enter footer content" />
            </Col> */}
          </Row>
        </Content>
        <Content>
          <label className="text-[15px] mb-2 mt-4 font-bold">
            Footer Content
          </label>
          <Row className="mt-2">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Type</label>
              <Input
                placeholder="Enter footer type"
                maxLength={255}
                minLength={1}
                value={footerType}
                onChange={(e) => {
                  setFooterType(e.target.value);
                  setInValidFooterType(false);
                }}
                className={`${
                  inValidFooterType
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Action</label>
              <Input
                placeholder="Enter footer action"
                maxLength={255}
                minLength={1}
                value={footerAction}
                onChange={(e) => {
                  setFooterAction(e.target.value);
                  setInValidFooterAction(false);
                }}
                className={`${
                  inValidFooterAction
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={8} className="mr-2">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Value</label>
              <Input
                placeholder="Enter footer value"
                maxLength={255}
                minLength={1}
                value={footerValue}
                onChange={(e) => {
                  setFooterValue(e.target.value);
                  setInValidFooterValue(false);
                }}
                className={`${
                  inValidFooterValue
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
            <Col span={8} className="ml-1">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">Footer Icon</label>
              <Input
                placeholder="Enter footer icon"
                maxLength={255}
                minLength={1}
                value={footerIcon}
                onChange={(e) => {
                  setFooterIcon(e.target.value);
                  setInValidFooterIcon(false);
                }}
                className={`${
                  inValidFooterIcon
                    ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
              />
            </Col>
          </Row>
          <Row>
            <label className="text-[13px] mb-2 mt-4">Header Position</label>
          </Row>
          <Row className="mt-1">
            {/* <label className="text-[13px] mb-2 mt-4">Header Position</label> */}
            <Select
              // value={storeId}
              placeholder={"Please select footer position"}
              onChange={handleFooterChange}
              // className="w-[40%]"
              className={`${
                inValidFooterPositionValue
                  ? "border-red-400  border-solid focus:border-red-400 hover:border-red-400 w-[33%]"
                  : "w-[33%]"
              }`}
              allowClear
              value={footerPositionValue}
              options={[
                {
                  value: "right",
                  label: "right",
                },
                {
                  value: "left",
                  label: "left",
                },
                {
                  value: "center",
                  label: "center",
                },
                {
                  value: "top",
                  label: "top",
                },
                {
                  value: "bottom",
                  label: "bottom",
                },
              ]}
              defaultValue={{
                value: "right",
                label: "right",
              }}
            />
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
            {/* <Link to="/dashboard/language"> */}
            <Button
              className=" app-btn-secondary"
              onClick={() => {
                setButtonColor("");
                setButtonTextColor("");
                setBackgroundColor("");
                setPrimaryColor("");
                setHeaderColor("");
                setHeaderBackgroundColor("");
                setHeaderTextColor("");
                setFooterColor("");
                setFooterBackgroundColor("");
                setFooterTextColor("");
                setstoreId("Choose Store");
              }}
            >
              Discard
            </Button>
            {/* </Link> */}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default StoreSettings;
