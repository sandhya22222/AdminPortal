import React from "react";
import { Typography, Layout } from "antd";
const { Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

const NewFooter = () => {
  return (
    <Content>
      <Content className="bg-[#6F6F6F] !h-12  flex items-center justify-center ">
        <Paragraph className="text-[#C6C6C6] text-xs  !mt-3  !ml-52">
          Copyright (2023) - Torry Harris Integration Solutions - DigitMarket
          <sup>TM</sup> {portalInfo.title} Version {portalInfo.version} |
          Credits
        </Paragraph>
      </Content>
    </Content>
  );
};

export default NewFooter;
