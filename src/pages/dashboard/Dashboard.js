//! Import libraries & components
import React, { useEffect, useState } from "react";
import { Layout, Typography, Skeleton, Image } from "antd";
import { useNavigate } from "react-router-dom";

import { Profit, Positive, Payment } from "../../constants/media";
import { toast } from "react-toastify";

import { MdStore } from "react-icons/md";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from "../../hooks/usePageTitle";
//! Import user defined functions

//! Import user defined CSS
import "./dashboard.css";

//! Get all required details from .env file
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import util from "../../util/common";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

const storeAdminDashboardAPI =
  process.env.REACT_APP_STORE_ADMIN_DASHBOARD_DATA_API;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;
// const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const auth = useAuth();
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState();
  const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
  const [dashboardDataNetWorkError, setDashboardDataNetWorkError] =
    useState(false);

  useEffect(() => {
    if (auth && auth.user && auth.user?.access_token) {
      util.setAuthToken(auth.user?.access_token);
    }
  }, [auth]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      getDashBoardData();
    }
    window.scrollTo(0, 0);
  }, []);

  const getDashBoardData = () => {
    MarketplaceServices.findAllWithoutPage(storeAdminDashboardAPI, null, true)
      .then(function (response) {
        setDashboardData(response.data);
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(false);
      })
      .catch((error) => {
        setDashboardDataLoading(false);
        setDashboardDataNetWorkError(true);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
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
            <Content className="flex">
              <Content className="p-3 w-[7%] mr-4 shadow-sm rounded-md justify-center !bg-[var(--mp-bright-color)]">
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
                    <Link
                      className="!text-[var(--mp-link-color)] float-right font-semibold"
                      onClick={() => navigate("/dashboard/store")}
                    >
                      {t("labels:view_all")}
                    </Link>
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
              <Content className="p-3 w-[26%] mr-4 shadow-sm rounded-md justify-center !bg-[var(--mp-bright-color)]">
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
