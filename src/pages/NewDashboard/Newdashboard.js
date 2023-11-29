//! Import libraries & components
import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Skeleton,
  Image,
  Button,
  Tabs,
  Tooltip,
  Table,
  Tag,
  Empty,
  Progress,
  Divider,
  Statistic,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Profit, Positive, Payment } from "../../constants/media";
import { toast } from "react-toastify";
import { MdStore } from "react-icons/md";
import { useDispatch } from "react-redux";

import axios from "axios";
import { StarTwoTone, ReloadOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";
//! Import user defined functions

//! Import user defined CSS
// import "./dashboard.css";

import MarketplaceServices from "../../services/axios/MarketplaceServices";
import util from "../../util/common";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import MarketplaceToaster from "../../util/marketplaceToaster";
import {
  fnSelectedLanguage,
  fnStoreLanguage,
  fnDefaultLanguage,
} from "../../services/redux/actions/ActionStoreLanguage";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

//! Get all required details from .env file
const storeAdminDashboardAPI =
  process.env.REACT_APP_STORE_ADMIN_DASHBOARD_DATA_API;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;

const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL;
const dm4sightGetWidgetIdAPI = process.env.REACT_APP_4SIGHT_GETWIDGETID_API;
const dm4sightGetGraphDataAPI = process.env.REACT_APP_4SIGHT_GETGRAPHDATA_API;
const dm4sightGetDetailsByQueryAPI =
  process.env.REACT_APP_4SIGHT_GETDETAILSBYQUERY_API;
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID;
const dm4sightEnabled = process.env.REACT_APP_4SIGHT_DATA_ENABLED;
const dm4sightGetAnalysisDetailAPI =
  process.env.REACT_APP_4SIGHT_GETANALYSISDETAIL_API;

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
// const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text, Link } = Typography;
const { Content } = Layout;
const instance = axios.create();

const Newdashboard = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState();
  const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
  const [dashboardDataNetWorkError, setDashboardDataNetWorkError] =
    useState(false);

  const [fetchTopProductsData, setFetchTopProductsData] = useState(true);
  const [fetchTopStoresData, setFetchTopStoresData] = useState(false);
  const [fetchTopVendorsData, setFetchTopVendorsData] = useState(false);
  const [fetchProductTypesData, setFetchProductTypesData] = useState(false);
  const [refetcher, setRefetcher] = useState();
  const [permissionValue, setGetPermissionsData] = useState(
    util.getPermissionData() || []
  );
  const [spinLoading, setSpinLoading] = useState(true);
  const [updatedTimeState, setUpdatedTimeState] = useState("products");
  const [updatedTimes, setUpdatedTimes] = useState({
    products: undefined,
    stores: undefined,
    vendors: undefined,
    types: undefined,
  });
  const [activeStoreCount, setActiveStoreCount] = useState();
  const [inActiveStoreCount, setInActiveStoreCount] = useState();
  const [tableData, setTableData] = useState([]);

  const [storeLimitValues, setStoreLimitValues] = useState([]);

  let keyCLoak = sessionStorage.getItem("keycloakData");
  keyCLoak = JSON.parse(keyCLoak);
  let realmName = keyCLoak.clientId.replace(/-client$/, "");

  const dm4sightHeaders = {
    headers: {
      token: auth.user && auth.user?.access_token,
      realmname: realmName,
      dmClientId: dm4sightClientID,
      client: "admin",
    },
  };

  useEffect(() => {
    // console.log("storeLimitApi", storeLimitApi);
    MarketplaceServices.findAll("/ams/rest/v3/store-limit")
      .then(function (response) {
        console.log("rexxxx", response.data.response_body);
        setStoreLimitValues(response.data.response_body);
      })
      .catch((error) => {
        console.log("Server error from store limit API ", error.response);
      });
  }, []);

  const getPermissions = () => {
    let baseurl = `${umsBaseUrl}${getPermissionsUrl}`;
    MarketplaceServices.findAll(baseurl, null, false)
      .then((res) => {
        console.log("get access token res", res);
        setGetPermissionsData(res.data);
        setSpinLoading(false);
        util.setPermissionData(res.data);
      })
      .catch((err) => {
        console.log("get access token err", err);
        // if (err && err.response && err.response.status === 401) {
        //   makeHttpRequestForRefreshToken();
        // }
      });
  };

  useEffect(() => {
    if (auth && auth.user && auth.user?.access_token) {
      util.setAuthToken(auth.user?.access_token);
      util.setIsAuthorized(true);
      // getPermissions(auth.isAuthenticated);
    } else {
      util.removeAuthToken();
      util.removeIsAuthorized();
    }
  }, [auth]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      getDashBoardData();
    }
    window.scrollTo(0, 0);
    // findAllLanguages();
  }, []);

  const getDashBoardData = () => {
    MarketplaceServices.findAllWithoutPage(storeAdminDashboardAPI, null, true)
      .then(function (response) {
        console.log(
          "Dashboard APi success response data",
          response.data.response_body
        );
        setDashboardData(response.data.response_body);
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(false);
      })
      .catch((error) => {
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(true);
      });
  };

  const getActiveInactiveData = () => {
    instance
      .get(
        dm4sightBaseURL + dm4sightGetAnalysisDetailAPI
        //   dm4sightHeaders
      )
      .then((response) => {
        setActiveStoreCount(response.data.active_store_count);
        setInActiveStoreCount(response.data.inactive_store_count);
        console.log("resdooooo", response.data.count_info);

        //   convert the response to table readable format

        //   console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
        // Object.entries converts key-value to array of key,value
        //   key --> first value of Array
        //   value ---> second value of array
        const transformedData = Object.entries(response.data.count_info).map(
          ([key, value]) => ({
            key: key,
            store_name: value.name,
            orders: value.count_order,
            vendors: value.count_vendor,
            products: value.count_product,
            product_templates: value.count_template,
          })
        );

        setTableData(transformedData);
        console.log(transformedData);
      });
  };

  useEffect(() => {
    getActiveInactiveData();
  }, []);

  const getTopProductsData = async () => {
    const topProductsPayload = {
      names: ["top_products_ap", "common_query_ap"],
    };

    try {
      const resWidgetIDs = await instance.post(
        dm4sightBaseURL + dm4sightGetWidgetIdAPI,
        topProductsPayload,
        dm4sightHeaders
      );

      const widgetIds = resWidgetIDs.data.widget_details.data.map(
        (ele) => ele.id
      );
      const topProductID = widgetIds[0];

      const resProducts = await instance.post(
        dm4sightBaseURL + dm4sightGetGraphDataAPI + `?widgetId=${topProductID}`,
        {},
        dm4sightHeaders
      );

      const productNames = resProducts.data.data.data[0]
        .slice(0, 5)
        .map((ele) => ele.name);

      const storeIds = [
        ...new Set(
          resProducts.data.data.data[0]
            .slice(0, 5)
            .map((ele) => ele.min_store_id)
        ),
      ];

      const vendorIds = [
        ...new Set(
          resProducts.data.data.data[0]
            .slice(0, 5)
            .map((ele) => ele.min_vendor_id)
        ),
      ];

      const queryID = widgetIds[1];
      // QUERY TO FETCH VENDORNAME,STORENAME using storeids and vendorids taken from resProducts
      const resQuery = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI + `?id=${queryID}`,
        {
          query: "",
          query_type: "store_and_vendor_names",
          store_ids: storeIds,
          vendor_ids: vendorIds,
          product_names: [],
        },
        dm4sightHeaders
      );

      const resTypeQuery = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI + `?id=${queryID}`,

        {
          query: "",
          query_type: "product_name_type",
          store_ids: [],
          vendor_ids: [],
          product_names: productNames,
        },

        dm4sightHeaders
      );

      const resCurrencies = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI + `?id=${topProductID}`,
        {
          query: "",
          query_type: "currency",
          store_ids: storeIds,
          vendor_ids: [],
          product_names: [],
        },

        dm4sightHeaders
      );

      // Add 'product_type' and 'order_placed' key to the 'resProducts' array based on 'id' and 'min_store_id'
      const updatedResProducts = resProducts.data.data.data[0].map(
        (product) => {
          const matchingType = resTypeQuery.data.data[0].find(
            (type) => type.name === product.name
          );
          if (matchingType) {
            return {
              ...product,
              product_type: matchingType.name0 ? matchingType.name0 : "Unknown",
              order_placed: matchingType.order_placed
                ? matchingType.order_placed
                : "null",
            };
          }
          return product;
        }
      );

      const storeNameAdded = updatedResProducts.map((obj) => {
        const correspondingData = resQuery.data.data[0].find(
          (data) => data.store_id === obj.min_store_id
        );
        return {
          ...obj,
          store_name: correspondingData
            ? correspondingData.name0
            : "Unknown Store",
          vendor_name: correspondingData
            ? correspondingData.name
            : "Unknown Vendor",
        };
      });

      // Add 'symbol' key to the 'updated' array based on 'id' and 'min_store_id'
      let symbolAdded = storeNameAdded.map((item) => {
        const matchingCurrency = resCurrencies.data.data[0].find(
          (currency) => currency.id === item.min_store_id
        );
        if (matchingCurrency) {
          item.symbol = matchingCurrency.symbol;
        }
        return item;
      });
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setRefetcher(null);
      setUpdatedTimes({
        ...updatedTimes,
        products: currentTime,
      });
      if (symbolAdded) {
        return symbolAdded;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("Error fetching top products data");
    }
  };

  const getTopStoresData = async () => {
    const payload = {
      names: ["top_stores_ap", "common_query_ap"],
    };

    try {
      const resWidgetIDs = await instance.post(
        dm4sightBaseURL + dm4sightGetWidgetIdAPI,
        payload,
        dm4sightHeaders
      );

      const widgetIds = resWidgetIDs.data.widget_details.data.map(
        (ele) => ele.id
      );
      let topStoresID = widgetIds[0];
      let queryID = widgetIds[1];

      const topStoresUrl =
        dm4sightBaseURL + dm4sightGetGraphDataAPI + `?widgetId=${topStoresID}`;

      const resStore = await instance.post(topStoresUrl, {}, dm4sightHeaders);

      const storeIds = resStore.data.data.data[0]
        .slice(0, 5)
        .map((ele) => ele.store_id);
      const nullRemovedStoreIds = storeIds.filter((value) => value !== null);

      const resQuery = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI + `?id=${queryID}`,
        {
          query: "",
          query_type: "currency",
          store_ids: nullRemovedStoreIds,
          vendor_ids: [],
          product_names: [],
        },
        dm4sightHeaders
      );

      // combine resStore & resQuery data - add respective storenames and currencies(from resquery)
      const storeNameAdded = resStore.data.data.data[0]
        .slice(0, 5)
        .map((obj) => {
          const correspondingData = resQuery.data.data[0].find(
            (data) => data.id === obj.store_id
          );

          console.log("correspondingData", correspondingData);

          return {
            ...obj,
            symbol: correspondingData ? correspondingData.symbol : "",
            store_name: correspondingData
              ? correspondingData.name
              : "Unknown Store",
          };
        });

      console.log("str", storeNameAdded);

      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setRefetcher(null);
      setUpdatedTimes({
        ...updatedTimes,
        stores: currentTime,
      });
      if (storeNameAdded) {
        return storeNameAdded;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("Error fetching top stores data");
    }
  };

  const getTopVendorsData = async () => {
    const payload = {
      names: ["top_vendors_ap", "common_query_ap"],
    };

    try {
      const resWidgetIDs = await instance.post(
        dm4sightBaseURL + dm4sightGetWidgetIdAPI,
        payload,
        dm4sightHeaders
      );

      const widgetIds = resWidgetIDs.data.widget_details.data.map(
        (ele) => ele.id
      );
      let topVendorsID = widgetIds[0];
      let queryID = widgetIds[1];
      const topVendorsUrl =
        dm4sightBaseURL + dm4sightGetGraphDataAPI + `?widgetId=${topVendorsID}`;

      const resVendors = await instance.post(
        topVendorsUrl,
        {},
        dm4sightHeaders
      );

      const storeIds = resVendors.data.data.data[0]
        .slice(0, 5)
        .map((ele) => ele.min_store_id);
      const nullRemovedStoreIds = storeIds.filter((value) => value !== null);

      const resQuery = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI + `?id=${queryID}`,
        {
          query: "",
          query_type: "currency",
          store_ids: nullRemovedStoreIds,
          vendor_ids: [],
          product_names: [],
        },
        dm4sightHeaders
      );

      const storeNameAdded = resVendors.data.data.data[0]
        .slice(0, 5)
        .map((obj) => {
          const correspondingData = resQuery.data.data[0].find(
            (data) => data.id === obj.min_store_id
          );
          return {
            ...obj,
            symbol: correspondingData ? correspondingData.symbol : "",
            store_name: correspondingData
              ? correspondingData.name
              : "Unknown Store",
          };
        });

      console.log("stna", storeNameAdded);
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setRefetcher(null);
      setUpdatedTimes({
        ...updatedTimes,
        vendors: currentTime,
      });
      if (storeNameAdded) {
        return storeNameAdded;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("Error fetching top vendors data");
    }
  };

  const getProductTypesData = async () => {
    try {
      const resProdType = await instance.post(
        dm4sightBaseURL + dm4sightGetDetailsByQueryAPI,
        {
          query: "",
          query_type: "product_type",
          store_ids: [],
          vendor_ids: [],
          product_names: [],
        },
        dm4sightHeaders
      );

      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setRefetcher(null);
      setUpdatedTimes({
        ...updatedTimes,
        types: currentTime,
      });

      if (resProdType.data.data) {
        return resProdType.data.data[0];
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("Error fetching product types data");
    }
  };

  const {
    data: topProductsData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isFetched: isFetchedProducts,
    // isError,
    // error,
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useQuery("topProductsData", getTopProductsData, {
    enabled:
      !!fetchTopProductsData && !!dashboardData && dm4sightEnabled === "true",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: topStoresData,
    isLoading: isLoadingStores,
    isFetching: isFetchingStores,
    isFetched: isFetchedStores,
    // isError,
    // error,
    refetch: refetchStores,
    isRefetching: isRefetchingStores,
  } = useQuery("topStoresData", getTopStoresData, {
    enabled: !!fetchTopStoresData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: topVendorsData,
    isLoading: isLoadingVendors,
    isFetching: isFetchingVendors,
    isFetched: isFetchedVendors,
    // isError,
    // error,
    refetch: refetchVendors,
    isRefetching: isRefetchingVendors,
  } = useQuery("topVendorsData", getTopVendorsData, {
    enabled: !!fetchTopVendorsData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: productTypesData,
    isLoading: isLoadingProductTypes,
    isFetching: isFetchingProductTypes,
    isFetched: isFetchedProductTypes,
    // isError,
    // error,
    refetch: refetchTypes,
    isRefetching: isRefetchingProductTypes,
  } = useQuery("productTypesData", getProductTypesData, {
    enabled: !!fetchProductTypesData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  let productDataSource = topProductsData?.map((item, index) => {
    return {
      key: index,
      rank: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{index + 1}</div>
          {index === 0 ? (
            <div role="img" aria-label="star">
              <StarTwoTone
                twoToneColor="#FAAD14"
                style={{
                  fontSize: "large",
                  marginLeft: "7px",
                  display: "flex",
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ),

      name: (
        <Tooltip title={item.name}>
          <div className="flex items-center gap-2">
            <Image
              style={{ minWidth: "32px" }}
              preview={false}
              width={32}
              height={32}
              src={process.env.REACT_APP_BASE_URL + item.min_image}
              fallback="data:image/png;base64,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"
            />

            {item.name.length > 30 ? `${item.name.slice(0, 20)}...` : item.name}
          </div>
        </Tooltip>
      ),
      store: (
        <Tooltip title={item.store_name ? item.store_name : "null"}>
          <span className="flex items-center gap-2">
            {/* <Image
              className="rounded-full"
              preview={false}
              width={32}
              height={32}
              src=""
              fallback="data:image/png;base64,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"
            /> */}
            {item.store_name && item.store_name.length > 20
              ? `${item.store_name.slice(0, 20)}...`
              : item.store_name
              ? item.store_name
              : "null"}
          </span>
        </Tooltip>
      ),
      vendor: (
        <Tooltip title={item.vendor_name ? item.vendor_name : "null"}>
          <span>
            {item.vendor_name && item.vendor_name.length > 20
              ? `${item.vendor_name.slice(0, 20)}...`
              : item.vendor_name
              ? item.vendor_name
              : "null"}
          </span>
        </Tooltip>
      ),
      product_type: (
        <Tag color="magenta">
          {item.product_type ? item.product_type.split(" ")[0] : "null"}
        </Tag>
      ),
      units: item.order_placed ? item.order_placed : "null",
      sales: (
        <span style={{ color: "#52C41A" }}>{`${
          item.symbol ? item.symbol : ""
        }${item.sum_amount.toFixed(2)}`}</span>
      ),
    };
  });

  let storeDataSource = topStoresData?.map((item, index) => {
    return {
      key: index,
      rank: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{index + 1}</div>
          {index === 0 ? (
            <div role="img" aria-label="star">
              <StarTwoTone
                twoToneColor="#FAAD14"
                style={{
                  fontSize: "large",
                  marginLeft: "7px",
                  display: "flex",
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ),

      name: (
        <Tooltip title={item.store_name}>
          <span className="flex items-center gap-2">
            {/* <Image
              className="rounded-full"
              preview={false}
              width={32}
              height={32}
              src=""
              // fallback="data:image/png;base64,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"
            /> */}
            {item.store_name && item.store_name.length > 20
              ? `${item.store_name.slice(0, 20)}...`
              : item.store_name
              ? item.store_name
              : "null"}
          </span>
        </Tooltip>
      ),

      product_type: <Tag color="magenta">Physical</Tag>,
      units: item.sum_quantity,
      sales: (
        <span style={{ color: "#52C41A" }}>{`${
          item.symbol
        } ${item.sum_amount.toFixed(2)}`}</span>
      ),
    };
  });

  let vendorDataSource = topVendorsData?.map((item, index) => {
    return {
      key: index,
      rank: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{index + 1}</div>
          {index === 0 ? (
            <div role="img" aria-label="star">
              <StarTwoTone
                twoToneColor="#FAAD14"
                style={{
                  fontSize: "large",
                  marginLeft: "7px",
                  display: "flex",
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ),

      name: (
        <Tooltip title={item.vendor_name}>
          <span>
            {item.vendor_name && item.vendor_name.length > 20
              ? `${item.min_store_id.slice(0, 20)}...`
              : item.vendor_name
              ? item.vendor_name
              : "null"}
          </span>
        </Tooltip>
      ),
      store: (
        <Tooltip title={item.store_name ? item.store_name : "null"}>
          <span>
            {item.store_name && item.store_name.length > 20
              ? `${item.min_store_id.slice(0, 20)}...`
              : item.store_name
              ? item.store_name
              : "null"}
          </span>
        </Tooltip>
      ),

      units: item.sum_quantity,
      sales: (
        <span style={{ color: "#52C41A" }}>{`${
          item.symbol
        } ${item.sum_amount.toFixed(2)}`}</span>
      ),
    };
  });

  let productTypeDataSource = productTypesData?.map((item, index) => {
    return {
      key: index,
      rank: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{index + 1}</div>
          {index === 0 ? (
            <div role="img" aria-label="star">
              <StarTwoTone
                twoToneColor="#FAAD14"
                style={{
                  fontSize: "large",
                  marginLeft: "7px",
                  display: "flex",
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ),

      product_type: <span>{item.name}</span>,

      units: item.order_placed,
    };
  });

  const productColumns = [
    {
      title: t("labels:rank"),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t("labels:product_name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("labels:store"),
      dataIndex: "store",
      key: "store",
    },
    {
      title: t("labels:vendor"),
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: t("labels:product_type"),
      dataIndex: "product_type",
      key: "product_type",
    },
    {
      title: t("labels:units_sold"),
      dataIndex: "units",
      key: "units",
    },
    {
      title: t("labels:sales"),
      dataIndex: "sales",
      key: "sales",
    },
  ];

  const storeColumns = [
    {
      title: t("labels:rank"),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t("labels:store_name"),
      dataIndex: "name",
      key: "name",
    },

    {
      title: t("labels:units"),
      dataIndex: "units",
      key: "units",
      width: "25%",
    },
    {
      title: t("labels:sales"),
      dataIndex: "sales",
      key: "sales",
      width: "25%",
    },
  ];

  const vendorColumns = [
    {
      title: t("labels:rank"),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t("labels:vendor_name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("labels:store"),
      dataIndex: "store",
      key: "store",
    },

    {
      title: t("labels:units"),
      dataIndex: "units",
      key: "units",
    },
    {
      title: t("labels:sales"),
      dataIndex: "sales",
      key: "sales",
      width: "25%",
    },
  ];

  const productTypeColumns = [
    {
      title: t("labels:rank"),
      dataIndex: "rank",
      key: "rank",
    },

    {
      title: t("labels:product_type"),
      dataIndex: "product_type",
      key: "product_type",
    },
    {
      title: t("labels:units"),
      dataIndex: "units",
      key: "units",
      width: "25%",
    },
  ];

  const items = [
    {
      key: "1",
      label: t("labels:products"),
      children: (
        <Content>
          {!isFetchedProducts || refetcher === "products" ? (
            <Skeleton
              className="p-3"
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
          ) : productDataSource?.length > 0 ? (
            <Table
              responsive
              dataSource={productDataSource}
              columns={productColumns}
              pagination={false}
            />
          ) : (
            <Content className="mt-5">
              <Empty />
            </Content>
          )}
        </Content>
      ),
    },
    {
      key: "2",
      label: t("labels:stores"),
      children: (
        <Content>
          {!isFetchedStores || refetcher === "stores" ? (
            <Skeleton
              className="p-3"
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
          ) : storeDataSource?.length > 0 ? (
            <Table
              dataSource={storeDataSource}
              columns={storeColumns}
              pagination={false}
            />
          ) : (
            <Content className="mt-5">
              <Empty />
            </Content>
          )}
        </Content>
      ),
    },
    {
      key: "3",
      label: t("labels:vendors"),
      children: (
        <Content>
          {!isFetchedVendors || refetcher === "vendors" ? (
            <Skeleton
              className="p-3"
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
          ) : vendorDataSource?.length > 0 ? (
            <Table
              dataSource={vendorDataSource}
              columns={vendorColumns}
              pagination={false}
            />
          ) : (
            <Content className="mt-5">
              <Empty />
            </Content>
          )}
        </Content>
      ),
    },
    {
      key: "4",
      label: t("labels:product_type"),
      children: (
        <Content>
          {!isFetchedProductTypes || refetcher === "types" ? (
            <Skeleton
              className="p-3"
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
          ) : productTypeDataSource?.length > 0 ? (
            <Table
              dataSource={productTypeDataSource}
              columns={productTypeColumns}
              pagination={false}
            />
          ) : (
            <Content className="mt-5">
              <Empty />
            </Content>
          )}
        </Content>
      ),
    },
  ];

  const renderUpdatedTime = (state, time, refetchFunction) => {
    if (state && time) {
      return (
        <div className="flex items-center ml-2 mt-1">
          <Text className="text-zinc-400"> {t("labels:last_update")}</Text>
          <Text className="ml-1">
            {t("labels:today")}, {time}
          </Text>
          <div className="border border-gray-400 inline-flex p-1 ml-2">
            <ReloadOutlined
              onClick={() => {
                refetchFunction();
                setRefetcher(state);
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const findAllLanguages = () => {
    MarketplaceServices.findAll(languageAPI, { "language-status": 1 }, false)
      .then((response) => {
        console.log(
          "Server response from findAllStoreLanguages",
          response.data.response_body
        );
        const storeLanguages = response.data.response_body;
        const defaultLanguage = storeLanguages.find((item) => item.is_default);

        const userSelectedLanguageCode = util.getUserSelectedLngCode();
        if (userSelectedLanguageCode === undefined) {
          const userSelectedLanguage = defaultLanguage;
          dispatch(fnSelectedLanguage(userSelectedLanguage));
          document.body.style.direction =
            userSelectedLanguage &&
            userSelectedLanguage.writing_script_direction?.toLowerCase();
          // Cookies.set("mpaplng", defaultLanguage.language_code);
          // localStorage.setItem("mpaplng", defaultLanguage.language_code);
        }
        if (util.getUserSelectedLngCode()) {
          let selectedLanguagePresentOrNot =
            storeLanguages &&
            storeLanguages.length > 0 &&
            storeLanguages.filter(
              (ele) => ele.language_code === util.getUserSelectedLngCode()
            );
          if (
            selectedLanguagePresentOrNot &&
            selectedLanguagePresentOrNot.length > 0
          ) {
            const alreadySelectedLanguage = storeLanguages.find(
              (item) => item.language_code === util.getUserSelectedLngCode()
            );
            dispatch(fnSelectedLanguage(alreadySelectedLanguage));
            document.body.style.direction =
              alreadySelectedLanguage &&
              alreadySelectedLanguage.writing_script_direction?.toLowerCase();
          } else {
            const defaultLanguageSelectedLanguage = defaultLanguage;
            console.log(
              "testInDahsboardSelectedLangInHeader#",
              defaultLanguageSelectedLanguage
            );
            dispatch(fnSelectedLanguage(defaultLanguageSelectedLanguage));
            util.setUserSelectedLngCode(
              defaultLanguageSelectedLanguage.language_code
            );
            document.body.style.direction =
              defaultLanguageSelectedLanguage &&
              defaultLanguageSelectedLanguage.writing_script_direction?.toLowerCase();

            // setDependencyForPageRefreshForInvalidSelectedLanguage(true);
            setTimeout(function () {
              navigate(0);
            }, 2000);
          }
        }

        dispatch(fnStoreLanguage(storeLanguages));
        dispatch(fnDefaultLanguage(defaultLanguage));
        // dispatch(fnSelectedLanguage(defaultLanguage));
      })
      .catch((error) => {
        console.log("error-->", error.response);
      });
  };

  const columns = [
    {
      title: t("labels:store_name"),
      dataIndex: "store_name",
      key: "store_name",
    },
    {
      title: (
        <span>
          {t("labels:orders")}{" "}
          <Text className="text-zinc-400"> (Last 7 days)</Text>
        </span>
      ),
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Product Templates",
      dataIndex: "product_templates",
      key: "product_templates",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Vendors",
      dataIndex: "vendors",
      key: "vendors",
    },
  ];

  return (
    <Content className="mb-2">
      <Content className="mb-2">
        <HeaderForTitle
          title={
            <Content className="flex z-20 mb-3  !justify-between">
              <Content className="!w-[10%] flex  align-start">
                <Space direction="vertical" size={16}>
                  <Space wrap size={16}>
                    <Avatar size={64} icon={<UserOutlined />} />
                  </Space>
                </Space>
              </Content>
              <Content className="!w-[80%] mr-2 ">
                <Title level={3} className="!text-black">
                  Hello Loganathan B,
                </Title>
                <Text className="!text-sm mb-2 text-zinc-400 ">
                  {t("messages:dashboard_welcome_message")}
                  {/* Greetings and welcome to your administrative console where you
                  can access and manage various features and settings for
                  optimal control and optimization. */}
                </Text>
              </Content>
              <Content className="!w-[20%] flex flex-col justify-center items-center">
                <Text className="!text-md mb-2 text-zinc-400 flex justify-left gap-1 items-center">
                  <Content class="w-2 h-2 bg-lime-500 rounded-full"></Content>{" "}
                  Total stores Published
                </Text>

                <Content className="flex flex-col  items-center h-4">
                  <Content className="flex justify-between items-baseline gap-2 ">
                    <Title style={{ color: "#4A2D73" }} level={2}>
                      {activeStoreCount ? activeStoreCount : 0}{" "}
                    </Title>
                    <Text level={5} className="text-zinc-400 !font-semibold ">
                      {" "}
                      {t("labels:of")}{" "}
                      {storeLimitValues?.store_limit
                        ? storeLimitValues?.store_limit
                        : 0}{" "}
                      {t("labels:stores")}
                    </Text>
                  </Content>
                  <Progress
                    style={{ paddingTop: "10px", marginTop: "30px" }}
                    strokeColor={"#4A2D73"}
                    className="w-32 "
                    size="small"
                    percent={
                      (activeStoreCount / storeLimitValues?.store_limit) * 100
                    }
                    showInfo={false}
                  />
                </Content>
              </Content>

              <Divider className="h-20" type="vertical" />

              <Content className="!w-[20%] pl-3 flex flex-col justify-center">
                {/* <Content class="w-2 h-2 bg-lime-500 rounded-full"></Content>{" "} */}
                <Content>
                  <Text className="!text-md mb-2 text-zinc-400 flex justify-left gap-1 items-center">
                    <Content class="w-2 h-2  bg-neutral-400 rounded-full"></Content>{" "}
                    {t("labels:inactive_sores")}
                  </Text>
                  <Content className="flex items-center ml-2">
                    <Title class="text-zinc-400" level={2}>
                      {" "}
                      {inActiveStoreCount ? inActiveStoreCount : 0}{" "}
                    </Title>
                  </Content>
                </Content>
              </Content>
            </Content>
          }
        />
      </Content>
      <Content className="!p-3 !mt-[7.8rem]">
        {dashboardDataLoading ? (
          <Content className="!bg-[var(--mp-bright-color)] !p-3 !rounded-md">
            <Content className="flex justify-between">
              {" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />{" "}
            </Content>
            <Content className="flex justify-between my-16">
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
              <Skeleton
                paragraph={{
                  rows: 1,
                }}
              />
            </Content>
          </Content>
        ) : dashboardDataNetWorkError ? (
          <Content className="text-center !bg-[var(--mp-bright-color)] !p-3 mt-5 !rounded-md">
            {t("messages:dashboard_network_error")}
          </Content>
        ) : (
          <Content>
            <Content className="flex gap-3"></Content>

            <Content
              hidden={dm4sightEnabled === "true" ? false : true}
              className="flex justify-between !mt-14"
            >
              <Content className="!w-[20%]  bg-[#ffff] p-4  shadow-sm rounded-md justify-center">
                <Content className="flex items-center justify-between mb-1">
                  <Title level={4} className="!m-0  !text-black">
                    {t("labels:store_overview")}
                  </Title>
                  <Button type="link">{t("labels:more")}</Button>
                </Content>
                <Divider className="w-10" />
                <Content>
                  <Table
                    pagination={false}
                    dataSource={tableData}
                    columns={columns}
                  />
                </Content>
              </Content>
            </Content>
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default Newdashboard;
