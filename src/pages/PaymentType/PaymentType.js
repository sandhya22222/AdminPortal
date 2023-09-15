import React, { useEffect } from "react";
import { Layout, Typography } from "antd";

import DynamicTable from "../../components/DynamicTable/DynamicTable";
import HeaderForTitle from "../../components/header/HeaderForTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
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
        payment_type: "Cash On Delivery",
        is_payment_gateway: false,
      },
      {
        id: 2,
        payment_type: "Online Payment",
        is_payment_gateway: true,
      },
      // {
      //   id: 3,
      //   payment_type: "Purchase Order",
      //   is_payment_gateway: true,
      // },
    ],
  },
];

const PaymentType = () => {
  usePageTitle("Payment Type");
  const { t } = useTranslation();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const paymentTypeColumns = [
    {
      title: `${t("labels:payment_types")}`,
      dataIndex: "paymentType",
      key: "paymentType",
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
    <Content className="">
      <HeaderForTitle
        title={
          <Content>
            <Title level={3} className="!font-normal">
              {t("labels:payment_type")}
            </Title>
          </Content>
        }
      />
      <Content className="!p-3 !mt-[7.4rem] ">
        <DynamicTable tableComponentData={tablePropsData} />
      </Content>
    </Content>
  );
};

export default PaymentType;
