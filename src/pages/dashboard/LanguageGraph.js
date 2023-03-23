import React, { useState, useEffect } from "react";
import { Bar, Pie, Column } from "@ant-design/plots";
import { Layout, Typography, Spin } from "antd";
import Language from "../languagee/Language";
//npm installl     npm i @ant-design/plots

const { Title, Text } = Typography;
const { Content } = Layout;

const LanguageGraph = ({ languageData }) => {
  const [languageColumnGraphData, setLanguageColumnGraphData] = useState();

  const dataProcessorForLangugaes = (languageData) => {
    let temp = [];
    if (languageData && languageData.length > 0) {
      for (var i = 0; i < languageData.length > 0; i++) {
        let localObject = {};
        localObject["type"] = languageData[i].store_id;
        localObject["value"] = languageData[i].language_count;
        temp.push(localObject);
      }
    }
    return temp;
  };

  useEffect(() => {
    if (languageData !== undefined) {
      let data = dataProcessorForLangugaes(
        languageData && languageData.store_language
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

      setLanguageColumnGraphData(config);
    }
  }, []);
  return (
    <Content>
      {languageColumnGraphData !== undefined ? (
        <>
          <Title level={3} className="mb-3 text-center !font-normal">
            Languages
          </Title>
          <Content>
            <Column {...languageColumnGraphData} />
          </Content>
          {/* <Content>
            <Title level={3} className="mt-3 !font-normal text-md">
              Languages
            </Title>
          </Content> */}
        </>
      ) : null}
    </Content>
  );
};

export default LanguageGraph;
