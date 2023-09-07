import { Layout, Typography } from "antd";
import React from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./header2.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function HeaderForTitle({
  title,
  headerContent,
  type,
  saveFunction,
  cloneFunction,
  showArrowIcon,
  action,
}) {
  const navigate = useNavigate();
  return (
    <Content className="fixed !h-auto top-[3.0rem] headerWidth z-10 !py-4 !px-6 bg-white drop-shadow">
      <Content className="flex justify-between">
        <Content className={`${showArrowIcon === true ? "flex" : ""}`}>
          {showArrowIcon === true ? (
            <ArrowLeftOutlined
              className="mr-4 mt-2"
              onClick={() => navigate(-1)}
            />
          ) : null}

          <Title level={4} className="!m-0 !p-0 font-semibold">
            {title}
          </Title>
        </Content>
      </Content>
      {headerContent !== null && headerContent !== undefined ? (
        <Content className="mt-4">{headerContent}</Content>
      ) : null}
    </Content>
  );
}

export default HeaderForTitle;
