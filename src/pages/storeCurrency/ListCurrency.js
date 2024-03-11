import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Row, Col, Tag, Tooltip } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

//! Import user defined components
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { useTranslation } from "react-i18next";
import MarketplaceToaster from "../../util/marketplaceToaster";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import DmPagination from "../../components/DmPagination/DmPagination";
import util from "../../util/common";
import { EditIcon, starIcon } from "../../constants/media";

const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);

const { Content } = Layout;
const { Title, Text } = Typography;
const ListCurrency = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [listCurrencyData, setListCurrencyData] = useState([]);
  const [currencyCount, setCurrencyCount] = useState();
  const [currencyPaginationData, setCurrencyPaginationData] = useState({
    pageNumber: 1,
    pageSize: pageLimit,
  });

  const columns = [
    {
      title: `${t("labels:currency_name")}`,
      dataIndex: "currencyName",
      key: "currencyName",
      width: "20%",
      ellipsis: true,
      render: (text, record) => {
        return (
          <Content className="inline-block">
            <Tooltip
              title={record.currencyName}
              overlayStyle={{ zIndex: 1 }}
              placement={
                util.getSelectedLanguageDirection()?.toUpperCase() === "RTL"
                  ? "left"
                  : "right"
              }
            >
              <Text
                className={`mx-1
                   ${
                     record.isDefault === true
                       ? "!max-w-[80px]"
                       : "!max-w-[150px]"
                   } `}
                ellipsis={true}
              >
                {record.currencyName}
              </Text>
            </Tooltip>
            {record.isDefault === true ? (
              <Tag
                icon={
                  <img src={starIcon} className="mr-1 flex !items-center" />
                }
                className="inline-flex items-center"
                color="#FB8500"
              >
                {t("labels:default")}
              </Tag>
            ) : (
              ""
            )}
          </Content>
        );
      },
    },
    {
      title: `${t("labels:code")}`,
      dataIndex: "currency_code",
      key: "currency_code",
      width: "8%",
      render: (text, record) => {
        return (
          <>
            <Tooltip title={record.currencyCode}>
              <Text
                className="max-w-xs"
                ellipsis={{ tooltip: record.currencyCode }}
              >
                {record.currencyCode}
              </Text>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: `${t("labels:conversation")}`,
      dataIndex: "conversation",
      key: "conversation",
      ellipsis: true,
      width: "12%",
      render: (text, record) => {
        return <>{record.conversation}</>;
      },
    },
    {
      title: `${t("labels:unit_price_name")}`,
      dataIndex: "unitPriceName",
      key: "unitPriceName",
      width: "16%",
      render: (text, record) => {
        return <>{record.priceName}</>;
      },
    },
    {
      title: `${t("labels:min_amount")}`,
      dataIndex: "minAmount",
      key: "minAmount",
      width: "12%",
      render: (text, record) => {
        return <>{record.minAmount}</>;
      },
    },
    {
      title: `${t("labels:symbol")}`,
      dataIndex: "symbol",
      key: "symbol",
      width: "10%",
      render: (text, record) => {
        return <>{record.symbol}</>;
      },
    },
    {
      title: `${t("labels:no_of_decimals")}`,
      dataIndex: "noOfDecimals",
      key: "noOfDecimals",
      width: "14%",
      render: (text, record) => {
        return <>{record.noOfDecimals}</>;
      },
    },
    {
      title: `${t("labels:action")}`,
      dataIndex: "",
      key: "",
      width: "8%",
      align: "center",
      render: (text, record) => {
        return (
          <Col className="whitespace-nowrap !text-center">
            <Tooltip title={t("labels:edit_currency")}>
              <Button
                type="text"
                className="app-btn-icon"
                onClick={() => {
                  navigate(`/dashboard/currency/edit-currency?k=${record.key}`);
                }}
              >
                <Content className=" flex justify-center align-items-center">
                  <img
                    src={EditIcon}
                    alt="Edit Icon"
                    className=" !w-[12px] !text-center !text-sm cursor-pointer"
                  />
                </Content>
              </Button>
            </Tooltip>
          </Col>
        );
      },
    },
  ];

  //!currency  to get the table data
  const currencyTableData = (filteredData) => {
    const tempArray = [];
    if (filteredData && filteredData.length > 0) {
      filteredData &&
        filteredData.length > 0 &&
        filteredData.map((element, index) => {
          var id = element.id;
          var currencyName = element.currency_name;
          var currencyCode = element.iso_currency_code;
          var conversation = element.unit_conversion;
          var priceName = element.unit_price_name;
          var minAmount = element.minimum_amount;
          var symbol = element.symbol;
          var noOfDecimals = element.no_of_decimal;
          var isDefault = element.is_default;
          tempArray &&
            tempArray.push({
              key: id,
              currencyName: currencyName,
              currencyCode: currencyCode,
              conversation: conversation,
              priceName: priceName,
              minAmount: minAmount,
              symbol: symbol,
              noOfDecimals: noOfDecimals,
              isDefault: isDefault,
            });
        });
      return tempArray;
    } else {
      return tempArray;
    }
  };

  const ProductSortingOption = [
    {
      sortType: "asc",
      sortKey: "id",
      title: "Title A-Z",
      default: true,
    },
    {
      sortType: "desc",
      sortKey: "id",
      title: "Title Z-A",
      default: false,
    },
  ];

  //!dynamic table data
  const tablePropsData = {
    table_header: columns,
    table_content: listCurrencyData,
    search_settings: {
      is_enabled: false,
      search_title: "Search by language",
      search_data: ["language"],
    },
    filter_settings: {
      is_enabled: false,
      filter_title: "filter by",
      filter_data: [],
    },
    sorting_settings: {
      is_enabled: false,
      sorting_title: "Sorting by",
      sorting_data: ProductSortingOption,
    },
  };

  //!get call of list language
  const findByPageCurrencyData = (page, limit) => {
    // enabling spinner
    setIsLoading(true);
    setIsNetworkError(true);
    MarketplaceServices.findByPage(currencyAPI, null, page, limit, false)
      .then(function (response) {
        setIsLoading(false);
        setIsNetworkError(false);
        console.log(
          "server Success response from currency API call",
          response.data.response_body
        );
        if (response && response.data.response_body.data.length > 0) {
          setListCurrencyData(
            currencyTableData(response.data.response_body.data)
          );
        }
        setCurrencyCount(response.data.response_body.count);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkError(false);
        console.log(
          "server error response from currency API call",
          error.response
        );
        // MarketplaceToaster.showToast(error.response);
        if (error && error.response && error.response.status === 401) {
          MarketplaceToaster.showToast(
            util.getToastObject(`${t("messages:session_expired")}`, "error")
          );
        } else {
          if (error.response) {
            setErrorMessage(error.response.data.response_body.message);
          }
          if (
            error.response.data.response_body.message ===
            "That page contains no results"
          ) {
            setSearchParams({
              page: 1,
              limit: parseInt(searchParams.get("limit")),
            });
          }
        }
      });
  };

  //!InvoiceDetails pagination onchange function
  const handleCurrencyPageNumberChange = (page, pageSize) => {
    setCurrencyPaginationData({
      pageNumber: page,
      pageSize: pageSize,
    });
  };

  useEffect(() => {
    findByPageCurrencyData(
      currencyPaginationData.pageNumber,
      currencyPaginationData.pageSize
    );
  }, [currencyPaginationData]);

  return (
    <Content>
      <Content>
        <HeaderForTitle
          title={
            <Content className="">
              <Title level={3} className="!font-normal">
                {t("labels:currency")}
              </Title>
            </Content>
          }
          titleContent={
            <Content className=" !flex items-center !justify-end gap-3">
              {/* <Button
                className="app-btn-primary flex align-items-center"
                onClick={() =>
                  navigate("/dashboard/language/language-settings")
                }
              >
                <img
                  src={plusIcon}
                  alt="plusIconWithAddLanguage"
                  className=" !w-3 mr-2 items-center"
                />
                <div className="mr-[10px]">{t("labels:add_language")}</div>
              </Button> */}
            </Content>
          }
        />
      </Content>
      <Content className="p-3 mt-[7.0rem]">
        {isLoading ? (
          <Content className=" bg-white text-center !p-2">
            <SkeletonComponent />
          </Content>
        ) : isNetworkError ? (
          <Content className="pt-[2.3rem] px-3 pb-3 text-center ml-2">
            <p>{`${t("common:network_error")}`}</p>
          </Content>
        ) : (
          <>
            <DynamicTable tableComponentData={tablePropsData} />
            {currencyCount && currencyCount >= pageLimit ? (
              <Content className=" grid justify-items-end">
                <DmPagination
                  currentPage={currencyPaginationData.pageNumber}
                  totalItemsCount={currencyCount}
                  pageSize={currencyPaginationData.pageSize}
                  handlePageNumberChange={handleCurrencyPageNumberChange}
                  showSizeChanger={true}
                  showTotal={true}
                />
              </Content>
            ) : null}
          </>
        )}
      </Content>
    </Content>
  );
};

export default ListCurrency;
