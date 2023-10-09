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
import "./dashboard.css";

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

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;
const getPermissionsUrl = process.env.REACT_APP_PERMISSIONS;
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL;
// const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text, Link } = Typography;
const { Content } = Layout;
const instance = axios.create();

const Dashboard = () => {
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

  let keyCLoak = sessionStorage.getItem("keycloakData");
  keyCLoak = JSON.parse(keyCLoak);
  let realmName = keyCLoak.clientId.replace(/-client$/, "");

  const dm4sightHeaders = {
    headers: {
      token: sessionStorage.getItem("access_token"),
      realmname: realmName,
      dmClientId: dm4sightClientID,
      client: "admin",
    },
  };

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
    findAllLanguages();
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
      return symbolAdded;
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
      return storeNameAdded;
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
      return storeNameAdded;
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
      return resProdType.data.data[0];
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
    retry: false,
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
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      width: "25%",
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      width: "25%",
    },
  ];

  const vendorColumns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
    },

    {
      title: "Units",
      dataIndex: "units",
      key: "units",
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      width: "25%",
    },
  ];

  const productTypeColumns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },

    {
      title: "Product Type",
      dataIndex: "product_type",
      key: "product_type",
    },
    {
      title: "Units",
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
          ) : (
            productDataSource?.length > 0 && (
              <Table
                responsive
                dataSource={productDataSource}
                columns={productColumns}
                pagination={false}
              />
            )
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
          ) : (
            storeDataSource?.length > 0 && (
              <Table
                dataSource={storeDataSource}
                columns={storeColumns}
                pagination={false}
              />
            )
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
          ) : (
            vendorDataSource?.length > 0 && (
              <Table
                dataSource={vendorDataSource}
                columns={vendorColumns}
                pagination={false}
              />
            )
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
          ) : (
            productTypeDataSource?.length > 0 && (
              <Table
                dataSource={productTypeDataSource}
                columns={productTypeColumns}
                pagination={false}
              />
            )
          )}
        </Content>
      ),
    },
  ];

  useEffect(() => {
    console.log(
      "isFetched",
      isFetchedProducts,
      isFetchedStores,
      isFetchedVendors,
      isFetchedProductTypes
    );
    console.log(
      "refetching",
      isRefetchingProducts,
      isRefetchingStores,
      isRefetchingVendors,
      isRefetchingProductTypes
    );
  });

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
          const alreadySelectedLanguage = storeLanguages.find(
            (item) => item.language_code === util.getUserSelectedLngCode()
          );
          dispatch(fnSelectedLanguage(alreadySelectedLanguage));
          document.body.style.direction =
            alreadySelectedLanguage &&
            alreadySelectedLanguage.writing_script_direction?.toLowerCase();
        }
        dispatch(fnStoreLanguage(storeLanguages));
        dispatch(fnDefaultLanguage(defaultLanguage));
        // dispatch(fnSelectedLanguage(defaultLanguage));
      })
      .catch((error) => {
        console.log("error-->", error.response);
      });
  };

  return (
    <Content className="mb-2">
      <Content className="mb-2">
        <HeaderForTitle
          title={
            <Content className="flex z-20 !justify-between">
              <Content className="!w-[80%]">
                <Title level={3} className="!font-normal">
                  {t("labels:dashboard")}
                </Title>
              </Content>
              <Content className="!w-[20%] text-right !right-0"></Content>
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
          <Content className="text-center !bg-[var(--mp-bright-color)] !p-3 !rounded-md">
            {t("messages:dashboard_network_error")}
          </Content>
        ) : (
          <Content>
            <Content className="flex gap-3">
              <Content className="p-3 w-[7%]  shadow-sm rounded-md justify-center !bg-[var(--mp-bright-color)]">
                <Content className="flex mb-3">
                  <Content className="flex items-center">
                    <Title
                      level={3}
                      className="!text-[#1A5692] mb-0 !font-semibold mt-0 !inline-block"
                    >
                      {dashboardData &&
                        dashboardData.store_data &&
                        dashboardData.store_data.total_count}
                    </Title>
                    <Text className="font-semibold text-lg ml-2">
                      {t("labels:stores")}
                    </Text>
                  </Content>
                  <Content className="flex flex-row-reverse items-center">
                    <Button className="app-btn-link" type="link">
                      <Link
                        className="float-right app-btn-link font-semibold"
                        onClick={() => navigate("/dashboard/store")}
                      >
                        {t("labels:view_all")}
                      </Link>
                    </Button>
                  </Content>
                </Content>
                <Content className="flex">
                  <Content className="flex">
                    <Content className="!inline-block w-[40%]">
                      <MdStore className="!text-5xl !inline-block !text-[#FCC32A]" />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#8C8C8C] ml-3">
                        {t("labels:active")}
                      </Text>
                      <Title level={5} className="!text-black mt-0 ml-3">
                        {dashboardData &&
                          dashboardData.store_data &&
                          dashboardData.store_data.active_stores}
                      </Title>
                    </Content>
                  </Content>
                  <Content className="flex">
                    <Content className="!inline-block w-[40%]">
                      <MdStore className="!text-5xl !inline-block !text-[#8C8C8C]" />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#8C8C8C] ml-3">
                        {" "}
                        {t("labels:inactive")}
                      </Text>
                      <Title level={5} className="!text-black mt-0 ml-3">
                        {dashboardData &&
                          dashboardData.store_data &&
                          dashboardData.store_data.inactive_store}
                      </Title>
                    </Content>
                  </Content>
                </Content>
              </Content>
              <Content className="p-3 w-[26%] shadow-sm rounded-md justify-center !bg-[var(--mp-bright-color)]">
                <Content className="flex items-center">
                  <Content className="flex-1 w-[50%]">
                    <Content className="!inline-block w-[40%]">
                      <Image
                        width={75}
                        preview={false}
                        src={Positive}
                        className="cursor-default"
                      />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                        {t("labels:total_revenue")}
                      </Text>
                      <Title
                        level={3}
                        className="!text-[#7CB305] mb-2 !font-semibold mt-0"
                      >
                        {currencySymbol}
                        {dashboardData &&
                        dashboardData.store_revenue &&
                        dashboardData.store_revenue.total_amount !== null
                          ? parseInt(dashboardData.store_revenue.total_amount)
                          : 0}
                      </Title>
                      <Text className="!text-[#000000D9] text-sm">
                        {t("labels:monthly_revenue")}
                      </Text>
                      <Title level={5} className="!text-[#7CB305] mt-0">
                        {currencySymbol}
                        {dashboardData &&
                        dashboardData.store_revenue &&
                        dashboardData.store_revenue.total_amount_last_month !==
                          null
                          ? parseInt(
                              dashboardData.store_revenue
                                .total_amount_last_month
                            )
                          : 0}
                      </Title>
                    </Content>
                  </Content>
                  <Content className="flex-1 w-[50%]">
                    <Content className="!inline-block w-[40%]">
                      <Image
                        width={75}
                        preview={false}
                        src={Profit}
                        className="cursor-default"
                      />
                    </Content>
                    <Content className="!inline-block w-[60%]">
                      <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                        {t("labels:total_profit")}
                      </Text>
                      <Title
                        level={3}
                        className="!text-[#7CB305] mb-2 !font-semibold mt-0"
                      >
                        {currencySymbol}
                        {dashboardData &&
                        dashboardData.store_revenue &&
                        dashboardData.store_revenue.store_commision_amount !==
                          null
                          ? parseInt(
                              dashboardData.store_revenue.store_commision_amount
                            )
                          : 0}
                      </Title>
                      <Text className="!text-[#000000D9] text-sm">
                        {t("labels:monthly_profit")}
                      </Text>
                      <Title level={5} className="!text-[#7CB305] mt-0">
                        {currencySymbol}
                        {dashboardData &&
                        dashboardData.store_revenue &&
                        dashboardData.store_revenue
                          .store_commision_last_month !== null
                          ? parseInt(
                              dashboardData.store_revenue
                                .store_commision_last_month
                            )
                          : 0}
                      </Title>
                    </Content>
                  </Content>
                </Content>
              </Content>
              <Content className="p-3 w-[7%] shadow-sm rounded-md justify-center !bg-[var(--mp-bright-color)]">
                <Content className="flex items-center">
                  <Content className="flex-1 w-[40%]">
                    <Image
                      width={75}
                      preview={false}
                      src={Payment}
                      className="cursor-default"
                    />
                  </Content>
                  <Content className="flex-1 w-[60%]">
                    <Text className="!text-[#00000073] text-md mb-2 !font-medium">
                      {t("labels:total_products")}
                    </Text>
                    <Title
                      level={3}
                      className="!text-[#1A5692] mb-2 !font-semibold mt-0"
                    >
                      {dashboardData && dashboardData.total_products}
                    </Title>
                    <Text className="!text-[#000000D9] text-sm">
                      {t("labels:last_30_days")}
                    </Text>
                    <Title level={5} className="!text-[#1A5692] mt-0">
                      {dashboardData && dashboardData.total_products_last_month}
                    </Title>
                  </Content>
                </Content>
              </Content>
            </Content>

            <Content
              hidden={dm4sightEnabled === "true" ? false : true}
              className="flex justify-between !mt-6"
            >
              <Content className=" bg-[#ffff] p-3  shadow-sm rounded-md justify-center">
                <div className="flex items-center">
                  <Title level={4} className="!m-0 !text-black">
                    {t("labels:ranking")}{" "}
                    <span>
                      <Text type="secondary">
                        {"("}
                        {t("labels:previous_month")}
                        {")"}
                      </Text>
                    </span>
                  </Title>
                  {updatedTimeState === "products"
                    ? renderUpdatedTime(
                        "products",
                        updatedTimes.products,
                        refetchProducts
                      )
                    : updatedTimeState === "stores"
                    ? renderUpdatedTime(
                        "stores",
                        updatedTimes.stores,
                        refetchStores
                      )
                    : updatedTimeState === "vendors"
                    ? renderUpdatedTime(
                        "vendors",
                        updatedTimes.vendors,
                        refetchVendors
                      )
                    : updatedTimeState === "types"
                    ? renderUpdatedTime(
                        "types",
                        updatedTimes.types,
                        refetchTypes
                      )
                    : null}
                </div>

                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  onChange={(key) => {
                    if (key == 1) {
                      setUpdatedTimeState("products");
                      setFetchTopProductsData(true);
                    } else if (key == 2) {
                      setFetchTopStoresData(true);
                      setUpdatedTimeState("stores");
                    } else if (key == 3) {
                      setFetchTopVendorsData(true);
                      setUpdatedTimeState("vendors");
                    } else if (key == 4) {
                      setFetchProductTypesData(true);
                      setUpdatedTimeState("types");
                    }
                  }}
                />
              </Content>
            </Content>

            {/* <Content className="flex justify-between !mt-6">
              <Content className="bg-[#ffff] p-3 mr-5 shadow-sm rounded-md justify-center">
                <Title level={3} className="!font-normal">
                  Dashboard
                </Title>
                <Content>
                  <Text level={2} className="!text-black !text-lg flex ">
                    <img className="mr-2 !w-12" src={AdminIcon} />
                    Hello Logonathan B, have a great day!
                  </Text>
                </Content>
              </Content>
              <Content className=" bg-[#ffff] p-3 mr-5 shadow-sm rounded-md">
                <p className="!text-[#cdcdcd] text-lg ">
                  Total sales this month
                </p>
                <Text className="text-xl !text-black">$ 126,560</Text>
                <Divider plain />
                <Text className="font-semibold"> Daily Sales $12,423</Text>
              </Content>
              <Content className=" bg-[#ffff] p-3 mr-5 shadow-sm rounded-md">
                <div>
                  <Text className="text-lg !text-[#cdcdcd]">Total Stores</Text>
                </div>
                <Text className="text-xl !text-black">
                  {dashboardData &&
                    dashboardData.store_data &&
                    dashboardData.store_data.total_count}
                </Text>
                <Divider plain />
                <Text className="text-[#7dc1ff]">View Storelist </Text>
              </Content>
            </Content> */}
            {/* <Watermark content="Sample Data" fontSize={18}>
              <Content className="mt-6">
                <Content>
                  <StoreGraph storeData={dashboardData.store_data} />
                  <Content className="flex ">
                    <Content className="!bg-white shadow-sm p-3 ">
                      <Text className="!font-semibold text-lg">Ranking</Text>
                      <Text className="text-slate-600"> (Previous Month)</Text>
                      <Text
                      className="cursor-pointer linkColor float-right font-semibold"
                      onClick={() => navigate("/dashboard/store")}
                    >
                      View All
                    </Text>
                      <Content>
                        <DmTabAntDesign
                          tabType={"line"}
                          tabBarPosition={"top"}
                          tabData={storeTabData}
                          handleTabChangeFunction={(value) => tabId(value)}
                        />
                        <Content>
                          <DynamicTable tableComponentData={tablePropsData} />
                        </Content>
                        <Text
                        className="cursor-pointer text-blue-400"
                        onClick={() => navigate("/dashboard/store")}
                      >
                        Explore All Stores
                      </Text>
                      </Content>
                    </Content>
                  </Content>
                </Content>
                <Content className="bg-white !mt-6 p-2">
                <div>
                  <Text className="text-lg font-semibold p-2">
                    Total Languages
                  </Text>
                </div>
                <Text className="text-xl !text-black p-2">
                  {dashboardData &&
                    dashboardData.language_data &&
                    dashboardData.language_data.total_count}
                </Text>
                <StoreGraph languageData={dashboardData.language_data} />
                </Content>
              </Content>
            </Watermark> */}
            {/* <Watermark content="Sample Data" fontSize={18}>
              <Content className="p-3 shadow-sm bg-white !mt-6">
                <SalesReportGraph />
                <LanguageGraph languageData={dashboardData.language_data} />
              </Content>
            </Watermark> */}
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default Dashboard;
