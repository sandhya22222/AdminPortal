import React, { useEffect } from "react";
import { Layout, Typography } from "antd";

import DynamicTable from "../../components/DynamicTable/DynamicTable";
import AntDesignBreadcrumbs from "../../components/ant-design-breadcrumbs/AntDesignBreadcrumbs";

const { Content } = Layout;
const { Title } = Typography;

const paymentTypesData = [
  {
    count: 3,
    page_number: 1,
    page_limit: 20,
    data: [
      {
        id: 1,
        payment_type: "COD",
        is_payment_gateway: false,
      },
      {
        id: 2,
        payment_type: "Online Payment",
        is_payment_gateway: true,
      },
      {
        id: 3,
        payment_type: "Purchase Order",
        is_payment_gateway: true,
      },
    ],
  },
];

const PaymentType = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const paymentTypeColumns = [
    {
      title: "Payment Type",
      dataIndex: "paymenttype",
      key: "paymenttype",
      width: "40%",
      render: (text, record) => {
        return <>{record.name}</>;
      },
    },
  ];

  const tempArray = [];
  paymentTypesData[0] &&
    paymentTypesData[0].data.map((element, index) => {
      var tempId = element.id;
      var paymentTypeName = element.payment_type;
      tempArray.push({
        key: index,
        name: paymentTypeName,
        id: tempId,
      });
    });
  console.log("first", tempArray);

  const tablePropsData = {
    table_header: paymentTypeColumns,
    table_content: tempArray,
    pagenationSettings: false,
    search_settings: {
      is_enabled: false,
      search_title: "Search by name",
      search_data: ["name"],
    },
    filter_settings: {
      is_enabled: false,
      filter_title: "Filter's",
      filter_data: [],
    },
    sorting_settings: {
      is_enabled: false,
      sorting_title: "Sorting by",
      sorting_data: [],
    },
  };

  return (
    <Content className="p-3">
      <Content className="mb-1">
        <AntDesignBreadcrumbs
          data={[
            { title: "Home", navigationPath: "/", displayOrder: 1 },
            { title: "Payment Types", navigationPath: "", displayOrder: 2 },
          ]}
        />
      </Content>
      <Content className="">
        <Title level={3} className="!font-normal">
          Payment Types
        </Title>
      </Content>
      <Content className="pt-3">
        <DynamicTable tableComponentData={tablePropsData} />
      </Content>
    </Content>
  );
};

export default PaymentType;
