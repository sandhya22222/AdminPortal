import React from "react";
import { Typography, Layout } from "antd";
const { Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

const NewFooter = () => {
  return (
    <Content className="bg-[#D9D9D9] !h-12  flex items-center justify-center ">
      <Paragraph className="text-[#000000] text-xs  !mt-3  !ml-52">
        Copyright (2023) - Torry Harris Integration Solutions - Torry Harris
        Marketplace - {portalInfo.title} Version {portalInfo.version} | Credits
      </Paragraph>
    </Content>
  );
};

export default NewFooter;
