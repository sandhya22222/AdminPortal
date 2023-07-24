import React from "react";
import { Typography, Layout } from "antd";
const { Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

const NewFooter = () => {
  return (
    <Content className="bg-[#D9D9D9] !h-[48px] max-h-[48px]  bottom-0">
      <div className=" flex items-center justify-center">
        <Paragraph className="text-[#000000] text-xs ml-[52px] !mt-3  ">
          Copyright (2023) - Torry Harris Integration Solutions - Torry Harris
          Marketplace - {portalInfo.title} Version {portalInfo.version} |
          Credits
        </Paragraph>
      </div>
    </Content>
  );
};

export default NewFooter;
