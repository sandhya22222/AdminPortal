import React, { useState, useEffect } from "react";
import { Layout, Typography, Spin, Button } from "antd";
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
        radius: 1,
        innerRadius: 0.5,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        interactions: [
          { type: "element-selected" },
          {
            type: "element-active",
          },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            // formatter: function formatter() {
            //   return `total\n134`;
            // },
          },
        },
      };

      setPieStoreGraphData(config);
    }
  }, []);
  return (
    <Content>
      {" "}
      {pieStoreGraphData !== undefined ? (
        <>
          {/* <Title level={3} className="mb-3 text-center !font-normal">
            Stores
          </Title> */}
          <Content>
            <Pie {...pieStoreGraphData} />
            <Button className="app-btn-primary !float-right !mt-[-30px] ">
              Create New
            </Button>
          </Content>
        </>
      ) : null}
    </Content>
  );
};

export default StoreGraph;
