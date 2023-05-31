import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Layout, Typography } from "antd";
import { Column } from "@ant-design/plots";

const { Content } = Layout;
const { Title, Text } = Typography;

const SalesReportGraph = () => {
  const data = [
    {
      name: "Current year",
      type: "Jan",
      value: 700000,
    },
    {
      name: "Current year",
      type: "Feb",
      value: 800000,
    },
    {
      name: "Current year",
      type: "Mar",
      value: 250000,
    },
    {
      name: "Current year",
      type: "Apl",
      value: 1200000,
    },
    {
      name: "Current year",
      type: "May",
      value: 100000,
    },
    {
      name: "Current year",
      type: "June",
      value: 200000,
    },
    {
      name: "Current year",
      type: "Jly",
      value: 400000,
    },
    {
      name: "Current year",
      type: "Aug",
      value: 600000,
    },
    {
      name: "Current year",
      type: "Sep",
      value: 800000,
    },
    {
      name: "Current year",
      type: "Oct",
      value: 100000,
    },
    {
      name: "Current year",
      type: "Nov",
      value: 120000,
    },
    {
      name: "Current year",
      type: "Dec",
      value: 140000,
    },
    {
      name: "Previous year",
      type: "Jan",
      value: 400000,
    },
    {
      name: "Previous year",
      type: "Feb",
      value: 600000,
    },
    {
      name: "Previous year",
      type: "Mar",
      value: 350000,
    },
    {
      name: "Previous year",
      type: "Apl",
      value: 100000,
    },
    {
      name: "Previous year",
      type: "May",
      value: 200000,
    },
    {
      name: "Previous year",
      type: "June",
      value: 100000,
    },
    {
      name: "Previous year",
      type: "Oct",
      value: 100000,
    },
    {
      name: "Previous year",
      type: "Nov",
      value: 120000,
    },
    {
      name: "Previous year",
      type: "Dec",
      value: 800000,
    },
  ];

  const config = {
    data,
    isGroup: true,
    xField: "type",
    yField: "value",
    seriesField: "name",

    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  return (
    <>
      <Title level={3} className="mb-3 !text-lg !text-start">
        Monthly Sales Report
      </Title>
      <Content>
        <Column {...config} />
      </Content>
    </>
  );
};

export default SalesReportGraph;
