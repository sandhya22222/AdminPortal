import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Layout, Typography } from "antd";
import { Column } from "@ant-design/plots";

const { Content } = Layout;
const { Title, Text } = Typography;

const SalesReportGraph = () => {
  const data = [
    {
      name: "Current Year",
      type: "Jan",
      value: 700000,
    },
    {
      name: "Current Year",
      type: "Feb",
      value: 800000,
    },
    {
      name: "Current Year",
      type: "Mar",
      value: 250000,
    },
    {
      name: "Current Year",
      type: "Apl",
      value: 1200000,
    },
    {
      name: "Current Year",
      type: "May",
      value: 100000,
    },
    {
      name: "Current Year",
      type: "June",
      value: 200000,
    },
    {
      name: "Current Year",
      type: "Jly",
      value: 400000,
    },
    {
      name: "Current Year",
      type: "Aug",
      value: 600000,
    },
    {
      name: "Current Year",
      type: "Sep",
      value: 800000,
    },
    {
      name: "Current Year",
      type: "Oct",
      value: 100000,
    },
    {
      name: "Current Year",
      type: "Nov",
      value: 120000,
    },
    {
      name: "Current Year",
      type: "Dec",
      value: 140000,
    },
    {
      name: "Previous Year",
      type: "Jan",
      value: 400000,
    },
    {
      name: "Previous Year",
      type: "Feb",
      value: 600000,
    },
    {
      name: "Previous Year",
      type: "Mar",
      value: 350000,
    },
    {
      name: "Previous Year",
      type: "Apl",
      value: 100000,
    },
    {
      name: "Previous Year",
      type: "May",
      value: 200000,
    },
    {
      name: "Previous Year",
      type: "June",
      value: 100000,
    },
    {
      name: "Previous Year",
      type: "Oct",
      value: 100000,
    },
    {
      name: "Previous Year",
      type: "Nov",
      value: 120000,
    },
    {
      name: "Previous Year",
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
