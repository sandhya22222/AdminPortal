//! Import libraries
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Layout, Breadcrumb, Table, Row, Col, Button, Typography } from "antd";
import axios from "axios";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

//! Import user defined components
import DynamicTable from "../DynamicTable/DynamicTable";
import StoreModal from "../../components/storeModal/StoreModal";

const { Title } = Typography;
toast.configure();

const languageAPI = process.env.REACT_APP_DM_LANGUAGE_API;

const Language = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState([]);
  const [isNetworkErrorLanguage, setIsNetworkErrorLanguage] = useState(false);
  const [error, setError] = useState(false);
  const [deleteLanguageModal, setDeleteLanguageModal] = useState(false);
  const [languageListAPIData, setLanguageListAPIData] = useState();
  const { Content } = Layout;
  const navigate = useNavigate();

  // closing the delete popup model
  const closeDeleteModal = () => {
    setDeleteLanguageModal(false);
  };

  // opening the delete popup model
  const openDeleteModal = () => {
    setDeleteLanguageModal(true);
  };

  const columns = [
    {
      title: "Language Id",
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
      title: "Language Support Documents",
      dataIndex: "lang_support_docs",
      key: "lang_support_docs",
      render: (text, record) => {
        return <>{record.lang_support_docs}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (text, record) => {
        return (
          <Col span={20}>
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
              <StoreModal
                isVisible={deleteLanguageModal}
                okButtonText={"Ok"}
                cancelButtonText={"Cancel"}
                title={"Warning"}
                okCallback={() => deleteLanguage(record.id)}
                cancelCallback={() => closeDeleteModal()}
              >
                {<div>{"Are you sure you want to delete the language ?"}</div>}
              </StoreModal>
              <DeleteOutlined
                className="app-delete-icon"
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
  const deleteLanguage = (id) => {
    axios
      .delete(languageAPI, {
        params: {
          _id: id,
        },
      })
      .then((response) => {
        console.log("response from delete===>", response);
        if (response.status === 202) {
          setDeleteLanguageModal(false);
          toast("Language Deleted Successfully", {
            position: toast.POSITION.TOP_RIGHT,
            type: "success",
          });
        }
      })
      .catch((error) => {
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
  }, []);

  const getLanguageData = () => {
    axios
      .get(languageAPI)
      .then(function (response) {
        console.log("response", response);
        setIsLoading(false);
        setError(false);
        setIsNetworkErrorLanguage(false);
        console.log(
          "response status language list-------------------",
          response.data
        );
        setResponse(response.data);
        // setIsNetworkErrorLanguage(false);
      })
      .catch((error) => {
        setIsLoading(true);
        setError(true);
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
    table_content: response,
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

  return isLoading ? (
    <div>
      <h1>Loading....</h1>
    </div>
  ) : isNetworkErrorLanguage ? (
    <Layout className="p-0 text-center mb-3 bg-[#F4F4F4]">
      <h5>
        Your's back-end server/services seems to be down, please start your
        server/services and try again.
      </h5>
    </Layout>
  ) : (
    <Layout>
      <Content className="p-2">
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Language</Breadcrumb.Item>
        </Breadcrumb>
      </Content>
      <Content className="ml-[12px]">
        <Row>
          <Col span={17}>
            <Content className=" float-left mt-3 ">
              <Title level={5} className="">
                Language
              </Title>
            </Content>
          </Col>
          <Col span={7}>
            <Row>
              <Col span={12}>
                <Content className="text-right mt-2 mb-2">
                  <Button
                    onClick={() => navigate("add_language")}
                    type="primary"
                    style={{
                      marginTop: "10px",
                      marginLeft: "195px",
                      background: "black",
                    }}
                  >
                    Add Language
                  </Button>
                </Content>
              </Col>
            </Row>
          </Col>
        </Row>
        <DynamicTable tableComponentData={tablepropsData} />
      </Content>
    </Layout>
  );
};

export default Language;
