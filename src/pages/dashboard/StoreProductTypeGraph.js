import React, { useState, useEffect } from "react";
import { Bar, Pie, Column } from "@ant-design/plots";
import { Layout, Typography, Spin } from "antd";
import Language from "../languagee/Language";
//npm installl     npm i @ant-design/plots

const { Title, Text } = Typography;
const { Content } = Layout;

const StoreProductTypeGraph = ({ storeProductTypeData }) => {
  const [storeProductTypeColumnGraphData, setStoreProductTypeColumnGraphData] =
    useState();

  const dataProcessorForLangugaes = (storeProductTypeData) => {
    let temp = [];
    if (storeProductTypeData && storeProductTypeData.length > 0) {
      for (var i = 0; i < storeProductTypeData.length > 0; i++) {
        let localObject = {};
        localObject["type"] = storeProductTypeData[i].store_id;
        localObject["value"] = storeProductTypeData[i].store_product_type_count;
        temp.push(localObject);
      }
    }
    return temp;
  };

  useEffect(() => {
    if (storeProductTypeData !== undefined) {
      let data = dataProcessorForLangugaes(
        storeProductTypeData && storeProductTypeData.store_product_type
      );

      const paletteSemanticRed = "#F4664A";
      const brandColor = "#5B8FF9";
      const config = {
        data,
        xField: "type",
        yField: "value",
        seriesField: "",
        color: ({ type }) => {
          if (type === "Active" || type === "InActive") {
            return paletteSemanticRed;
          }

          return brandColor;
        },
        label: {
          content: (originData) => {
            const val = parseFloat(originData.value);

            if (val < 0.05) {
              return (val * 100).toFixed(1) + "%";
            }
          },
          offset: 10,
        },
        legend: true,
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
      };

      setStoreProductTypeColumnGraphData(config);
    }
  }, []);
  return (
    <Content>
      {storeProductTypeColumnGraphData !== undefined ? (
        <>
          <Content>
            <Column {...storeProductTypeColumnGraphData} />
          </Content>
          <Content>
            <Title level={3} className="mt-3 !font-normal text-md">
              Store Product Type
            </Title>
          </Content>
        </>
      ) : null}
    </Content>
  );
};

export default StoreProductTypeGraph;
