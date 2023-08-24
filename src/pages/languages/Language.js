//! Import libraries
import React from "react";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  Layout,
  Breadcrumb,
  Table,
  Row,
  Col,
  Button,
  Typography,
  Skeleton,
  Space,
  Input,
  Tooltip,
  Tag,
} from "antd";
import axios from "axios";
import { makeHttpRequestForRefreshToken } from "../../util/unauthorizedControl";
import {
  Navigate,
  useNavigate,
  Link,
  useSearchParams,
  useParams,
} from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { MdEdit, MdDelete } from "react-icons/md";
//! Import user defined components
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import StoreModal from "../../components/storeModal/StoreModal";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import DmPagination from "../../components/DmPagination/DmPagination";
import { usePageTitle } from "../../hooks/usePageTitle";
import "./language.css";
import { use } from "i18next";
import useAuthorization from "../../hooks/useAuthorization";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import {
  EditIcon,
  DeleteIcon,
  plusIcon,
  tableDropDownArrow,
  DownloadIcon,
  DownloadIconDisable,
} from "../../constants/media";
const { Title, Text } = Typography;
const { Content } = Layout;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);
const languageSupportDocTemplateDownload =
  process.env.REACT_APP_LANGUAGE_SUPPORT_DOCS_CSV_DOWNLOAD;
const languageAbsoluteDocumentDownload =
  process.env.REACT_APP_LANGUAGE_ABSOLUTE_DOCUMENT_DOWNLOAD;
const Language = () => {
  usePageTitle("Languages");
  const authorizationHeader = useAuthorization();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [islanguageDeleting, setIslanguageDeleting] = useState(false);
  const [languageData, setLanguageData] = useState([]);
  const [isNetworkErrorLanguage, setIsNetworkErrorLanguage] = useState(false);
  const [deleteLanguageID, setDeleteLanguageID] = useState("");
  const [isDeleteLanguageModalOpen, setIsDeleteLanguageModalOpen] =
    useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalLanguageCount, setTotalLanguageCount] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            className="app-btn-primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // closing the delete popup model
  const closeDeleteModal = () => {
    setIsDeleteLanguageModalOpen(false);
  };

  // opening the delete popup model
  const openDeleteModal = (id) => {
    setIsDeleteLanguageModalOpen(true);
    setDeleteLanguageID(id);
  };

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text, record) => {
    //     return <div>{record.id}</div>;
    //   },
    // },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: "23%",
      ellipsis: true,
      // sorter: (name1, name2) => name1.language.localeCompare(name2.language),
      // sortDirections: ["descend", "ascend"],
      // showSorterTooltip: false,
      render: (text, record) => {
        return (
          <>
            <Tooltip title={record.language}>
              <Text
                className="max-w-xs"
                ellipsis={{ tooltip: record.language }}
              >
                {record.language}
              </Text>
            </Tooltip>
          </>
        );
        // <>{record.language}</>;
      },
      // ...getColumnSearchProps("language"),
    },
    {
      title: "Code",
      dataIndex: "language_code",
      key: "language_code",
      width: "10%",
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
        //  <>{record.language_code}</>;
      },
    },
    {
      title: "Script Direction",
      dataIndex: "writing_script_direction",
      key: "writing_script_direction",
      ellipsis: true,
      width: "20%",
      render: (text, record) => {
        return (
          <>
            {record.writing_script_direction === "LTR" ? (
              <Tag color="success">Left To Right</Tag>
            ) : (
              <Tag color="warning">Right To Left</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Native Name",
      dataIndex: "native_name",
      key: "native_name",
      width: "15%",
      ellipsis: true,
      render: (text, record) => {
        return (
          // {record.native_name}
          <>
            <Tooltip title={record.native_name}>
              <Text
                className="max-w-xs"
                ellipsis={{ tooltip: record.native_name }}
              >
                {record.native_name}
              </Text>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Support Document",
      dataIndex: "lang_support_docs",
      key: "lang_support_docs",
      render: (text, record) => {
        return (
          <>
            {record.lang_support_docs_path !== null ? (
              <Content
                className="whitespace-nowrap flex align-middle cursor-pointer"
                onClick={() => {
                  findMediaAbsoluteDocumentDownload(
                    record.lang_support_docs_path,
                    record.lang_support_docs
                  );
                }}
              >
                <img
                  src={DownloadIcon}
                  className="!text-xs !w-3 mr-1 !items-center"
                />
                <div className="text-[#0246bb] !ml-[10px]">
                  Download Document
                </div>
              </Content>
            ) : (
              <Content className="whitespace-nowrap flex align-middle cursor-not-allowed">
                <img
                  src={DownloadIconDisable}
                  className="!text-xs !w-3 mr-1 !items-center"
                />
                <div className="text-[#cbd5e1] !ml-[10px]">
                  Download Document
                </div>
              </Content>
            )}
          </>
        );
      },
    },
    // {
    //   title: "Language Regex",
    //   dataIndex: "dm_language_regex",
    //   key: "dm_language_regex",
    //   render: (text, record) => {
    //     return <>{record.dm_language_regex}</>;
    //   },
    // },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "12%",
      render: (text, record) => {
        return (
          <Col span={20} className="whitespace-nowrap flex align-middle">
            {record.language_code.toLowerCase() !== "en" ? (
              <Link
                to={{
                  pathname: "edit_language",
                  search: `?_id=${record.id}&page=${
                    searchParams.get("page") ? searchParams.get("page") : 1
                  }&limit=${
                    searchParams.get("limit")
                      ? searchParams.get("limit")
                      : pageLimit
                  }`,
                }}
                className=" pl-[10px] font-semibold app-table-data-title"
              >
                <Tooltip title="Edit Language">
                  <img src={EditIcon} alt="edit" className="!text-sm !w-5" />
                </Tooltip>
              </Link>
            ) : (
              ""
            )}

            {record.language_code.toLowerCase() !== "en" ? (
              <Tooltip title="Delete Language">
                <img
                  src={DeleteIcon}
                  alt="delete"
                  className="!text-sm ml-5 cursor-pointer !w-4"
                  onClick={() => {
                    openDeleteModal(record.id);
                  }}
                />
              </Tooltip>
            ) : (
              ""
            )}
          </Col>
        );
      },
    },
  ];

  let tempArray = [];
  {
    languageData &&
      languageData.length > 0 &&
      languageData.map((element, index) => {
        var Id = element.id;
        var Language = element.language;
        var LanguageCode = element.language_code;
        var Writing_script_direction = element.writing_script_direction;
        var Native_name = element.native_name;
        var Lang_support_docs = element.lang_support_docs;
        var Language_document_path = element.lang_support_docs_path;
        var Dm_language_regex = element.language_regex;
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
          });
      });
    console.log("tempArray", tempArray);
  }

  //!delete function of language
  const removeLanguage = () => {
    setIslanguageDeleting(true);
    // axios
    //   .delete(
    //     languageAPI,
    //     {
    //       params: {
    //         _id: deleteLanguageID,
    //       },
    //     },
    //     authorizationHeader
    //   )
    MarketplaceServices.remove(languageAPI, { _id: deleteLanguageID })
      .then((response) => {
        console.log("response from delete===>", response, deleteLanguageID);
        if (response.status === 200 || response.status === 201) {
          setIsDeleteLanguageModalOpen(false);
          let removedData = languageData.filter(
            ({ id }) => id !== deleteLanguageID
          );
          setLanguageData(removedData);
          setTotalLanguageCount(totalLanguageCount - 1);
          toast("Language deleted successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
            autoClose: 10000,
          });
        }
        // disabling spinner
        setIslanguageDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        setIslanguageDeleting(false);
        console.log("response from delete===>", error.response);
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else if (error && error.response && error.response.status === 409) {
          toast(
            "Language cannot be deleted since there is a reference in the store",
            {
              position: toast.POSITION.TOP_RIGHT,
              type: "error",
              autoClose: 10000,
            }
          );
        } else {
          toast("Deletion unsuccessful, please try again later", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        }
      });
  };

  //!get call of list language
  const findByPageLanguageData = (page, limit) => {
    // enabling spinner
    setIsLoading(true);
    // axios
    //   .get(languageAPI, {
    //     params: {
    //       "page-number": page,
    //       "page-limit": limit,
    //     },
    //   })
    MarketplaceServices.findByPage(languageAPI, null, page, limit, false)
      .then(function (response) {
        setIsLoading(false);
        setIsNetworkErrorLanguage(false);
        console.log(
          "server Success response from language API call",
          response.data.data
        );
        //TODO: Remove line 252,253 and setLanguageData(response.data)
        // let allLanguagesData = response.data;
        // allLanguagesData = { ...allLanguagesData, count: 21 };
        setLanguageData(response.data.data);
        // console.log("allLanguagesData", allLanguagesData);
        setTotalLanguageCount(response.data.count);
        // setIsNetworkErrorLanguage(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkErrorLanguage(true);
        console.log(
          "server error response from language API call",
          error.response
        );
        if (error && error.response && error.response.status === 401) {
          toast("Session expired", {
            position: toast.POSITION.TOP_RIGHT,
            type: "error",
            autoClose: 10000,
          });
        } else {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          }
          if (error.response.data.message === "That page contains no results") {
            setSearchParams({
              page: 1,
              limit: parseInt(searchParams.get("limit")),
            });
          }
        }
      });
  };

  console.log("languageData", languageData);
  //! get call of get document template API
  const findAllSupportDocumentTemplateDownload = () => {
    MarketplaceServices.findMedia(languageSupportDocTemplateDownload, {
      " is-format": 1,
    })
      .then(function (response) {
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "key_value_format.csv";
        alink.click();
      })
      .catch((error) => {
        console.log("Server error from getStoreApi Function ", error.response);
      });
  };

  //! get call of get document template API
  const findMediaAbsoluteDocumentDownload = (documentPath, documentName) => {
    MarketplaceServices.findMedia(languageSupportDocTemplateDownload, {
      "document-path": documentPath,
      // responseType: "blob",
    })
      .then(function (response) {
        console.log(
          "Server Response from getStoreApi Function: ",
          response.data
        );
        const fileURL = window.URL.createObjectURL(response.data);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = documentName;
        alink.click();
      })
      .catch((error) => {
        console.log("Server error from getStoreApi Function ", error.response);
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
  const tablepropsData = {
    table_header: columns,
    table_content: tempArray && tempArray,
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
    <Content className="">
      <StoreModal
        isVisible={isDeleteLanguageModalOpen}
        okButtonText={"Yes"}
        cancelButtonText={"Cancel"}
        title={"Warning"}
        okCallback={() => removeLanguage()}
        cancelCallback={() => closeDeleteModal()}
        isSpin={islanguageDeleting}
        hideCloseButton={false}
      >
        {
          <div>
            <p>{`Confirm Language Deletion`}</p>
            <p>{`Are you absolutely sure you want to delete the language? This action cannot be undone.`}</p>
          </div>
        }
      </StoreModal>
      {/* <Content className="mb-3"> */}
      <AntDesignBreadcrumbs
        data={[
          { title: "Home", navigationPath: "/", displayOrder: 1 },
          { title: "Language", navigationPath: "", displayOrder: 3 },
        ]}
      />
      <Content>
        <HeaderForTitle
          title={
            <Content className="flex !justify-between">
              <Content className="!w-[80%]">
                <Title level={3} className="!font-normal">
                  Languages
                </Title>
              </Content>
              <Content>
                <Button
                  className="app-btn-secondary mr-2 !flex !justify-items-center"
                  onClick={() => findAllSupportDocumentTemplateDownload()}
                >
                  <img
                    src={tableDropDownArrow}
                    className="!text-xs !w-4 my-1 mr-1 !items-center"
                  />
                  <div className=" !mr-[10px]">
                    Download Support Document Template
                  </div>
                </Button>
              </Content>
              <Content className="!w-[20%] text-right !right-0">
                <Button
                  className=" app-btn-primary !flex !justify-items-center"
                  onClick={() => navigate("add_language")}
                >
                  <img
                    src={plusIcon}
                    className="!text-xs !w-3 my-1 mr-2 !items-center"
                  />
                  <div className="mr-[10px]">Add Language</div>
                </Button>
              </Content>
            </Content>
          }
        />
      </Content>

      <Content className="!p-3 mt-[7.8rem] ">
        {isLoading ? (
          <Content className="bg-white p-3 !rounded-md">
            <Skeleton
              active
              paragraph={{
                rows: 6,
              }}
            ></Skeleton>
          </Content>
        ) : isNetworkErrorLanguage ? (
          <Content className="p-3 text-center bg-white !rounded-md">
            Unfortunately, we were unable to retrieve language information.
            Please try again later.
          </Content>
        ) : (
          <Layout className="">
            <Content>
              <DynamicTable tableComponentData={tablepropsData} />
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
          </Layout>
        )}
      </Content>
    </Content>
  );
};

export default Language;
