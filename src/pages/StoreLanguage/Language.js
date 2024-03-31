//! Import libraries
import {
  Badge,
  Button,
  Col,
  Image,
  Layout,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
//! Import user defined components
import DmPagination from "../../components/DmPagination/DmPagination";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import util from "../../util/common";
import {
  DownloadIcon,
  EditIcon,
  plusIcon,
  starIcon,
} from "../../constants/media";
import { usePageTitle } from "../../hooks/usePageTitle";
import MarketplaceServices from "../../services/axios/MarketplaceServices";

import LanguageBanner from "./LanguageBanner";
import MarketplaceToaster from "../../util/marketplaceToaster";
const { Title, Text } = Typography;
const { Content } = Layout;

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);
const LanguageDownloadAPI =
  process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV;

const Language = () => {
  const { t } = useTranslation();

  usePageTitle(t("labels:language_settings"));
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [languageData, setLanguageData] = useState([]);
  const [isNetworkErrorLanguage, setIsNetworkErrorLanguage] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalLanguageCount, setTotalLanguageCount] = useState();

  const StarIcon = () => {
    return (
      <>
        <Image
          src={starIcon}
          className="mr-1 flex !items-center"
          preview={false}
        />
      </>
    );
  };

  const columns = [
    {
      title: `${t("labels:language")}`,
      dataIndex: "language",
      key: "language",
      width: "20%",
      ellipsis: true,
      render: (text, record) => {
        return (
          <Content className="inline-block">
            <Tooltip
              title={record.language}
              overlayStyle={{ zIndex: 1 }}
              placement={
                util.getSelectedLanguageDirection()?.toUpperCase() === "RTL"
                  ? "left"
                  : "right"
              }
            >
              <Text
                className={`mx-1 ${
                  record.is_default ? "!max-w-[80px]" : "!max-w-[150px]"
                } `}
                ellipsis={true}
              >
                {record.language}
              </Text>
            </Tooltip>
            {record.is_default ? (
              <Tag
                icon={<StarIcon />}
                className="inline-flex items-center gap-1"
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
      dataIndex: "language_code",
      key: "language_code",
      width: "12%",
      render: (text, record) => {
        return (
          <>
            <Tooltip title={record.language_code}>
              <Text
                className="max-w-xs"
                ellipsis={{ tooltip: record.language_code }}
              >
                {record.language_code}
              </Text>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: `${t("labels:script_direction")}`,
      dataIndex: "writing_script_direction",
      key: "writing_script_direction",
      ellipsis: true,
      width: "20%",
      render: (text, record) => {
        return (
          <>
            {record.writing_script_direction === "LTR" ? (
              <Tag color="success">{t("labels:left_to_right")}</Tag>
            ) : (
              <Tag color="warning">{t("labels:right_to_left")}</Tag>
            )}
          </>
        );
      },
    },
    {
      title: `${t("labels:status")}`,
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (text, record) => {
        return (
          <>
            <Text>
              {record.status === "2" ? (
                <Badge status="default" text={t("labels:inactive")} />
              ) : (
                <Badge status="success" text={t("labels:active")} />
              )}
            </Text>
          </>
        );
      },
    },
    {
      title: `${t("labels:support_document")}`,
      dataIndex: "lang_support_docs",
      key: "lang_support_docs",
      width: "28%",
      render: (text, record) => {
        return (
          <Button
            type="text"
            className="app-btn-text gap-1"
            onClick={() => {
              findAllSupportDocumentTemplateDownload(2, record.language_code);
            }}
          >
            <Image
              src={DownloadIcon}
              className="!text-xs !w-[10px]  !items-center"
              preview={false}
            />
            {t("labels:download_document")}
          </Button>
        );
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
            <Tooltip title={t("labels:edit_language")}>
              <Button
                type="text"
                className="app-btn-icon"
                onClick={() => {
                  navigate(
                    `/dashboard/language/language-settings?k=${record.id}&n=${
                      record.language
                    }&c=${record.language_code}&s=${record.status}&d=${
                      record.is_default === false ? 0 : 1
                    }`
                  );
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
  const languageTableData = (filteredData) => {
    let tempArray = [];
    if (filteredData && filteredData.length > 0) {
      filteredData &&
        filteredData.length > 0 &&
        filteredData.map((element, index) => {
          var Id = element.id;
          var Language = element.language;
          var LanguageCode = element.language_code;
          var Writing_script_direction = element.writing_script_direction;
          var Native_name = element.native_name;
          var Lang_support_docs = element.lang_support_docs;
          var Language_document_path = element.lang_support_docs_path;
          var Dm_language_regex = element.language_regex;
          var is_default = element.is_default;
          var status = element.status;
          tempArray &&
            tempArray.push({
              key: index,
              id: Id,
              language: Language,
              language_code: LanguageCode,
              writing_script_direction: Writing_script_direction,
              native_name: Native_name,
              lang_support_docs: Lang_support_docs,
              dm_language_regex: Dm_language_regex,
              lang_support_docs_path: Language_document_path,
              is_default: is_default,
              status: status,
            });
        });
      return tempArray;
    } else {
      return tempArray;
    }
  };
  //!get call of list language
  const findByPageLanguageData = (page, limit) => {
    // enabling spinner
    setIsLoading(true);
    MarketplaceServices.findByPage(languageAPI, null, page, limit, false)
      .then(function (response) {
        setIsLoading(false);
        setIsNetworkErrorLanguage(false);
        console.log(
          "server Success response from language API call",
          response.data.response_body.data
        );
        if (response && response.data.response_body.data.length > 0) {
          setLanguageData(languageTableData(response.data.response_body.data));
        }
        setTotalLanguageCount(response.data.response_body.count);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkErrorLanguage(true);
        console.log(
          "server error response from language API call",
          error.response
        );
        // MarketplaceToaster.showToast(error.response);
        if (error && error.response && error.response.status === 401) {
          MarketplaceToaster.showToast(
            util.getToastObject(`${t("messages:session_expired")}`, "error")
          );
        } else {
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

  //! get call of get document template API
  const findAllSupportDocumentTemplateDownload = (formatOption, langCode) => {
    MarketplaceServices.findMedia(LanguageDownloadAPI, {
      "is-format": formatOption,
      language_code: langCode,
    })
      .then(function (response) {
        console.log(
          "Server Response from DocumentTemplateDownload Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "frontend_keys_document.csv";
        alink.click();
      })
      .catch((error) => {
        console.log(
          "Server error from DocumentTemplateDownload Function ",
          error.response
        );
      });
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
    table_content: languageData,
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

  const handlePageNumberChange = (page, pageSize) => {
    setSearchParams({
      page: parseInt(page) ? parseInt(page) : 1,
      limit: parseInt(pageSize) ? parseInt(pageSize) : pageLimit,
    });
  };

  useEffect(() => {
    findByPageLanguageData(
      searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : pageLimit
    );
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <Content>
      <Content>
        <HeaderForTitle
          title={
            <Content className="">
              <Title level={3} className="!font-normal">
                {t("labels:languages")}
              </Title>
            </Content>
          }
          titleContent={
            <Content className=" !flex items-center !justify-end gap-3">
              {/* <Button
                className="app-btn-secondary"
                onClick={() => findAllSupportDocumentTemplateDownload(1, "en")}
              >
                <Content className=" flex gap-2">
                  <img
                    src={tableDropDownArrow}
                    className=" !w-4 !items-center"
                  />

                  {t("labels:download_support_document_template")}
                </Content>
              </Button> */}
              {/* <Dropdown
                menu={{
                  items,
                  onClick: handleOnclickForDownloadDocument,
                }}
                className="app-btn-link"
                placement="bottomRight"
                arrow
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {t("labels:download_support_document_template")}
                    <DownOutlined className="!ml-[4px]" />
                  </Space>
                </a>
              </Dropdown> */}
              <Button
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
              </Button>
            </Content>
          }
        />
      </Content>
      <Content className="p-3 mt-[7.0rem]">
        {isLoading ? (
          <Content className=" bg-white p-3 ">
            <SkeletonComponent />
          </Content>
        ) : isNetworkErrorLanguage ? (
          <Content className="p-3 text-center mb-3 bg-[#F4F4F4]">
            <p>{t("messages:network_error")}</p>
          </Content>
        ) : (
          <Content>
            <Content className="bg-white p-2">
              <Content>
                <DynamicTable tableComponentData={tablePropsData} />
                {totalLanguageCount && totalLanguageCount >= pageLimit ? (
                  <Content className=" grid justify-items-end">
                    <DmPagination
                      currentPage={
                        searchParams.get("page")
                          ? parseInt(searchParams.get("page"))
                          : 1
                      }
                      presentPage={
                        searchParams.get("page")
                          ? parseInt(searchParams.get("page"))
                          : 1
                      }
                      totalItemsCount={totalLanguageCount}
                      pageLimit={pageLimit}
                      pageSize={
                        searchParams.get("limit")
                          ? parseInt(searchParams.get("limit"))
                          : pageLimit
                      }
                      handlePageNumberChange={handlePageNumberChange}
                      showSizeChanger={true}
                      showTotal={true}
                    />
                  </Content>
                ) : null}
              </Content>
            </Content>
            {languageData &&
            languageData.length === 1 &&
            languageData[0].language_code &&
            totalLanguageCount &&
            totalLanguageCount <= pageLimit ? (
              <Content className="bg-white mt-4 p-2">
                <LanguageBanner></LanguageBanner>
              </Content>
            ) : null}
          </Content>
        )}
      </Content>
    </Content>
  );
};

export default Language;
