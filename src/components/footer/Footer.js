import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Layout } from "antd";
const { Content, Footer } = Layout;
const { Text, Paragraph } = Typography;

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO);

const NewFooter = () => {
  const { t } = useTranslation();
  return (
    <Content className="bg-[#D9D9D9] !h-[48px] max-h-[48px]  bottom-0">
      <div className=" flex items-center justify-center">
        <Paragraph className="text-[#000000] text-xs ml-[52px] !mt-3  ">
          {t("labels:copyright")} -{" "}
          {t("labels:torry_harris_integration_solutions")} -{" "}
          {t("labels:torry_harris_marketplace")} - {t("labels:admin_portal")}{" "}
          {t("labels:version")} {portalInfo.version} |{t("labels:credits")}
        </Paragraph>
      </div>
    </Content>
  );
};

export default NewFooter;
