//! Import libraries
import React from "react";
import { useEffect, useState } from "react";
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
} from "antd";
import axios from "axios";
import {
  Navigate,
  useNavigate,
  Link,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

//! Import user defined components
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import StoreModal from "../../components/storeModal/StoreModal";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";
import SkeletonComponent from "../../components/Skeleton/SkeletonComponent";
import DmPagination from "../../components/DmPagination/DmPagination";
import { usePageTitle } from "../../hooks/usePageTitle";
import "./language.css";

const { Title } = Typography;
const { Content } = Layout;

const languageAPI = process.env.REACT_APP_LANGUAGE_API;
const pageLimit = process.env.REACT_APP_ITEM_PER_PAGE;

const Language = () => {
  usePageTitle("Admin Portal - Language");

  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [islanguageDeleting, setIslanguageDeleting] = useState(false);
  const [languageData, setLanguageData] = useState([]);
  const [isNetworkErrorLanguage, setIsNetworkErrorLanguage] = useState(false);
  const [deleteLanguageID, setDeleteLanguageID] = useState("");
  const [isDeleteLanguageModalOpen, setIsDeleteLanguageModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(
    params.page ? params.page.slice(5, params.page.length) : null
  );
  const [currentCount, setCurrentCount] = useState(
    params.count ? params.count.slice(6, params.count.length) : null
  );
  const [countForLanguage, setCountForLanguage] = useState();
  const navigate = useNavigate();

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
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text, record) => {
        return <div>{record.id}</div>;
      },
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (text, record) => {
        return <>{record.language}</>;
      },
    },
    {
      title: "Language Code",
      dataIndex: "language_code",
      key: "language_code",
      render: (text, record) => {
        return <>{record.language_code}</>;
      },
    },
    {
      title: "Script Direction",
      dataIndex: "writing_script_direction",
      key: "writing_script_direction",
      render: (text, record) => {
        return <>{record.writing_script_direction}</>;
      },
    },
    {
      title: "Native Name",
      dataIndex: "native_name",
      key: "native_name",
      render: (text, record) => {
        return <>{record.native_name}</>;
      },
    },
    {
      title: "Language Support Document",
      dataIndex: "lang_support_docs",
      key: "lang_support_docs",
      render: (text, record) => {
        return <>{record.lang_support_docs}</>;
      },
    },
    {
      title: "Language Regex",
      dataIndex: "dm_language_regex",
      key: "dm_language_regex",
      render: (text, record) => {
        return <>{record.dm_language_regex}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (text, record) => {
        return (
          <Col span={20} className="whitespace-nowrap">
            <Link
              to={{
                pathname: "edit_language",
                search: `?_id=${record.id}`,
              }}
              className=" pl-[8px] font-semibold app-table-data-title"
            >
              <EditOutlined
                style={{
                  color: "black",
                }}
              />
            </Link>
            <>
              <DeleteOutlined
                className="app-delete-icon pr-4"
                style={{ fontSize: "16px", marginLeft: "20px" }}
                onClick={() => {
                  openDeleteModal(record.id);
                }}
              />
            </>
          </Col>
        );
      },
    },
  ];
  //delete function
  const deleteLanguage = () => {
    // enabling spinner
    setIslanguageDeleting(true);
    axios
      .delete(languageAPI, {
        params: {
          _id: deleteLanguageID,
        },
      })
      .then((response) => {
        console.log("response from delete===>", response, deleteLanguageID);
        if (response.status === 200) {
          setIsDeleteLanguageModalOpen(false);
          let removedData = languageData.filter(
            ({ id }) => id !== deleteLanguageID
          );
          setLanguageData(removedData);
          toast("Language Deleted Successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
        // disabling spinner
        setIslanguageDeleting(false);
      })
      .catch((error) => {
        // disabling spinner
        setIslanguageDeleting(false);
        console.log("response from delete===>", error.response);
        toast("Language not deleted", {
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      });
  };

  //get function
  useEffect(() => {
    getLanguageData();
    window.scrollTo(0, 0);
  }, []);

  const getLanguageData = (page, limit) => {
    // enabling spinner
    setIsLoading(true);
    axios
      .get(languageAPI, {
        params: {
          "page-number": page,
          "page-limit": limit,
        },
      })
      .then(function (response) {
        console.log("response", response);
        setIsLoading(false);
        setIsNetworkErrorLanguage(false);
        console.log(
          "response status language list-------------------",
          response.data
        );
        setLanguageData(response.data);
        setCountForLanguage(response.data.length);
        // setIsNetworkErrorLanguage(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsNetworkErrorLanguage(true);
        console.log("Catch block of ----------------------");
      });
  };

  const pagination = [
    {
      defaultSize: 10,
      showPageSizeChanger: false,
      pageSizeOptions: ["5", "10"],
    },
  ];

  const ProductSortingOption = [
    // {
    //   sortType: "",
    //   sortKey: "",
    //   title: "Default",
    //   default: true,
    // },
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

  //dynamic table data
  const tablepropsData = {
    table_header: columns,
    table_content: languageData,
    pagenationSettings: pagination,
    search_settings: {
      is_enabled: true,
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
    if (page === 1) {
      if (pageSize != 20) {
        navigate(`/dashboard/language/page=1/count=${pageSize}`);
      } else {
        navigate("/dashboard/language");
      }
    } else {
      navigate(`/dashboard/language=${page}/count=${pageSize}`);
    }
    navigate(0);
  };

  return (
    <>
      <Layout>
        <StoreModal
          isVisible={isDeleteLanguageModalOpen}
          okButtonText={"Ok"}
          cancelButtonText={"Cancel"}
          title={"Confirmation"}
          okCallback={() => deleteLanguage()}
          cancelCallback={() => closeDeleteModal()}
          isSpin={islanguageDeleting}
        >
          {
            <div className="my-4">
              {"Are you sure you want to delete the language ?"}
            </div>
          }
        </StoreModal>
        <Content className="mb-3">
          <AntDesignBreadcrumbs
            data={[
              { title: "Home", navigationPath: "/", displayOrder: 1 },

              { title: "Language", navigationPath: "", displayOrder: 3 },
            ]}
          />
          <Row justify={"space-between"}>
            <Col>
              <Content className=" float-left mt-3 ">
                <Title level={3} className="!font-normal">
                  Language
                </Title>
              </Content>
            </Col>

            <Col>
              <Content className="text-right mt-3">
                <Button
                  className="rounded-none"
                  onClick={() => navigate("add_language")}
                  type="primary"
                  style={{
                    background: "black",
                  }}
                >
                  Add Language
                </Button>
              </Content>
            </Col>
          </Row>
        </Content>
      </Layout>
      {isLoading ? (
        <Content className=" bg-white mb-3">
          <Skeleton
            active
            paragraph={{
              rows: 6,
            }}
            className="p-3"
          ></Skeleton>
        </Content>
      ) : isNetworkErrorLanguage ? (
        <Layout className="p-0 text-center mb-3 bg-[#F4F4F4]">
          <h5>
            Your's back-end server/services seems to be down, please start your
            server/services and try again.
          </h5>
        </Layout>
      ) : (
        <Layout>
          <Content>
            <DynamicTable tableComponentData={tablepropsData} />
            {countForLanguage >= pageLimit ? (
              <Content className=" grid justify-items-end">
                <DmPagination
                  currentPage={currentPage ? currentPage : 1}
                  totalItemsCount={countForLanguage}
                  defaultPageSize={pageLimit}
                  pageSize={currentCount ? currentCount : pageLimit}
                  handlePageNumberChange={handlePageNumberChange}
                />
              </Content>
            ) : null}
          </Content>
        </Layout>
      )}
    </>
  );
};

export default Language;
