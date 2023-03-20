import React, { useState, useEffect } from "react";
import { Layout, Typography, Spin } from "antd";
import { Bar, Pie, Column } from "@ant-design/plots";

const { Title, Text } = Typography;
const { Content } = Layout;

const StoreGraph = ({ storeData }) => {
  const [pieStoreGraphData, setPieStoreGraphData] = useState();

  useEffect(() => {
    if (storeData !== undefined) {
      let data = [
        {
          type: "Active",
          value: storeData && storeData.active_stores,
        },
        {
          type: "Inactive",
          value: storeData && storeData.inactive_store,
        },
      ];

      const config = {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        legend: {
          position: "bottom",
        },
        label: {
          type: "inner",
          offset: "-30%",
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: "center",
          },
        },
        interactions: [
          {
            type: "element-active",
          },
        ],
      };

      setPieStoreGraphData(config);
    }
  }, []);
  return (
    <Content>
      {" "}
      {pieStoreGraphData !== undefined ? (
        <>
          <Title level={3} className="mb-3 text-center !font-normal">
            Stores
          </Title>
          <Content>
            <Pie {...pieStoreGraphData} />
          </Content>
          {/* <Content>
            <Title level={3} className="mt-3 !font-normal text-md text-center">
              Stores
            </Title>
          </Content> */}
        </>
      ) : null}
    </Content>
  );
};

export default StoreGraph;
