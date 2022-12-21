import React from "react";
import { Row, Col } from "antd";
import { Fish } from "../../constants/media";
import DynamicTable from "./DynamicTable";
const Simple = () => {
  const ProductTableColumns = [
    {
      title: "Product Name and Type",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <div>
            <Row>
              <Col>
                <div>
                  {/* <img src={baseUrl + "/" + productimage}/> */}

                  <img src={Fish} className="w-[40px] h-[40px] rounded" />
                </div>
              </Col>

              <Col className="pl-[8px]">
                {" "}
                {/* <Link
                        to={{
                          pathname: "/products/edit-product",
                          search: `?category_id=${record.category_id}&product_id=${record.product_id}`,
                        }}
                        className=" pl-[8px] font-semibold"
                      > */}
                {record.name}
                {/* </Link> */}
                <div>{record.product_type_name}</div>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category",
    },
    {
      title: "Managed By",
      dataIndex: "managedby",
      key: "managedby",
    },
  ];

  const TableData = [
    {
      key: 0,
      name: "Orient fan",
      // status: allstatus[categorystatus].status,
      status: "Activated",
      status_id:2,
      revision_status: 2,
      version: 1,
      product_type_name: "Physical Product",
      product_type:1,
      category_name: "fan",
      category_id: 11,
      product_id: 101,
      managedby: "---",
    },
    {
      key: 1,
      name: "Bazaz fan",
      // status: allstatus[categorystatus].status,
      status: "Activated",
      status_id:2,
      revision_status: 2,
      version: 1.1,
      product_type_name: "Physical Product",
      product_type:1,
      category_name: "fan",
      category_id: 11,
      product_id: 102,
      managedby: "---",
    },
    {
      key: 2,
      name: "usha fan",
      // status: allstatus[categorystatus].status,
      status: "Activated",
      status_id:2,
      revision_status: 2,
      version: 1.1,
      product_type_name: "Physical Product",
      product_type:1,
      category_name: "fan",
      category_id: 11,
      product_id: 103,
      managedby: "---",
    },
    {
      key: 3,
      name: "vivo mobile",
      // status: allstatus[categorystatus].status,
      status: "created",
      status_id:1,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Physical Product",
      product_type:1,
      category_name: "smartphones",
      category_id: 12,
      product_id: 104,
      managedby: "---",
    },
    {
      key: 4,
      name: "oneplus",
      // status: allstatus[categorystatus].status,
      status: "created",
      status_id:1,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Physical Product",
      product_type:1,
      category_name: "smartphones",
      category_id: 12,
      product_id: 105,
      managedby: "---",
    },
    {
      key: 5,
      name: "battle of pyrates",
      // status: allstatus[categorystatus].status,
      status: "published",
      status_id:4,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Subscription Product",
      product_type:5,
      category_name: "amazon",
      category_id: 13,
      product_id: 106,
      managedby: "---",
    },
    {
      key: 6,
      name: "pyrates",
      // status: allstatus[categorystatus].status,
      status: "published",
      status_id:4,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Subscription Product",
      product_type:5,
      category_name: "amazon",
      category_id: 13,
      product_id: 107,
      managedby: "---",
    },
    {
      key: 7,
      name: "Vrl logistics",
      // status: allstatus[categorystatus].status,
      status: "published",
      status_id:4,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Service Product",
      product_type:4,
      category_name: "courier",
      category_id: 14,
      product_id: 108,
      managedby: "---",
    },
    {
      key: 8,
      name: "sms logistics",
      // status: allstatus[categorystatus].status,
      status: "published",
      status_id:4,
      revision_status: 2,
      version: 1.4,
      product_type_name: "Service Product",
      product_type:4,
      category_name: "courier",
      category_id: 14,
      product_id: 109,
      managedby: "---",
    },
    {
      key: 9,
      name: "abcd logistics",
      // status: allstatus[categorystatus].status,
      status: "published",
      status_id:4,
      revision_status: 2,
      version: 1.5,
      product_type_name: "Service Product",
      product_type:4,
      category_name: "courier",
      category_id: 14,
      product_id: 110,
      managedby: "---",
    },
  ];
  const ProductSortingOption = [
    {
      sortType: "default",

      sortKey: "name",

      title: "serverData",
    },
    {
      sortType: "asc",

      sortKey: "name",

      title: "Product Title A-Z",
      default: false,
    },

    {
      sortType: "desc",

      sortKey: "name",

      title: "Product Title Z-A",
      default:true,
    },

    {
      sortType: "asc",

      sortKey: "product_type_name",

      title: "Product Type A-Z",
      default:false,
    },

    {
      sortType: "desc",

      sortKey: "product_type_name",

      title: "Product Type Z-A",
      default:false,
    },

    {
      sortType: "asc",

      sortKey: "category_name",

      title: " Product Category A-Z",
      default:false,
    },

    {
      sortType: "desc",

      sortKey: "category_name",

      title: " Product Category Z-A",
      default:false,
    },
  ];

  const productTypes = [
    {
      id: 1,
      name: "Physical Product",
      is_checked:false,
    },
    {
      id: 2,
      name: "Package Product",
      is_checked:false,
    },
    {
      id: 3,
      name: "Digital Product",
      is_checked:false,
    },
    {
      id: 4,
      name: "Service Product",
      is_checked:false,
    },
    {
      id: 5,
      name: "Subscription Product",
      is_checked:false,
    },
  ];

  const categoryList1 = [
    {
      label: "fan",
      value: "fan",
      id: 1,
    },
    {
      label: "smartphones",
      value: "smartphones",
      id: 2,
    },
    {
      label: "amazon",
      value: "amazon",
      id: 3,
    },
    {
      label: "courier",
      value: "courier",
      id: 4,
    },
  ];
  const productTypeList1 = [
    "Physical Product",
    "Package Product",
    "Digital Product",
    "Service Product",
    "Subscription Product",
  ];
  const categoryList = [
    {
      name: "fan",
      id: 11,
      is_checked:false,
    },
    {
      name: "smartphones",
      id: 12,
      is_checked:false,
    },
    {
      name: "amazon",
      id: 13,
      is_checked:false,
    },
    {
      name: "courier",
      id: 14,
      is_checked:false,
    },
    
  ];
  const Status =[
    {
      id: 1,
      name: "Created",
      is_checked:false,
    },
    {
      id: 2,
      name: "Activated",
      is_checked:false,
    },
    {
      id: 3,
      name: "Sandbox Published",
      is_checked:false,
    },
    {
      id: 4,
      name: "Published",
      is_checked:false,
    },
    {
      id: 5,
      name: "Unpublished",
      is_checked:false,
    }
    

  ]
  const Versions =[
    {
      id: 1,
      name: "1",
      is_checked:false,
    },
    {
      id: 1.1,
      name: "1.1",
      is_checked:false,
    },
    {
      id: 1.4,
      name: "1.4",
      is_checked:false,
    },
    {
      id: 1.5,
      name: "1.5",
      is_checked:false,
    }
  
  ]
  const pagination=[{

        defaultSize: 10,

        showPageSizeChanger: false,

        pageSizeOptions: ["5", "10"]
      }]

  const tablepropsData = {
    table_header: ProductTableColumns,
    table_content: TableData,
    pagenationSettings:pagination,
    

    search_settings: {
      is_enabled: true,
      search_title: "Search by name",
      search_data: ["product_type_name","category_name","name","status"],
    },
    filter_settings: {
      is_enabled: true,
      filter_title: "Filter's",
      filter_data: [{
        filter_type: "category_id",
        is_enabled: true,
        filter_title: "Product Category",
        filter_values: categoryList,
      },
      {
        filter_type: "product_type",
        is_enabled: true,
        filter_title: "Product Type",
        filter_values: productTypes,
      },
      {
        filter_type: "status_id",
        is_enabled: true,
        filter_title: "Status",
        filter_values: Status,

      },
      {
        filter_type: "version",
        is_enabled: true,
        filter_title: "version",
        filter_values: Versions,

      }
        
      ],
    },
    sorting_settings: {
      is_enabled: true,
      sorting_title: "Sorting by",
      sorting_data: ProductSortingOption,
    },
  };

  return (
    <div className="mb-[250px]">
      <DynamicTable tableComponentData={tablepropsData} />
    </div>
  );
};

export default Simple;
