import { Layout, Typography, Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./header2.css";

const { Content } = Layout;
const { Title } = Typography;

function HeaderForTitle({
  title,
  headerContent,
  titleContent,
  type,
  saveFunction,
  cloneFunction,
  showArrowIcon,
  backNavigationPath,
  action,
  previewFunction,
  isVisible,
  showButtons,
  disableSave,
  disableDiscard,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onMenuClick = (e) => {
    previewFunction();
  };
  const handleNavigationBack = () => {
    if (
      backNavigationPath !== undefined &&
      backNavigationPath !== null &&
      backNavigationPath !== ""
    ) {
      navigate(backNavigationPath);
    } else {
      navigate(-1);
    }
  };
  return (
    <Content className="">
      <Content className="fixed !h-auto top-[3.0rem] z-10 bg-white flex justify-between headerWidth !px-5 pt-3 pb-1">
        <Content className={`${showArrowIcon === true ? "flex items-center" : ""}`}>
          {showArrowIcon === true ? (
            <ArrowLeftOutlined
              className="mr-4"
              onClick={handleNavigationBack}
            />
          ) : null}

          {/* <Title level={4} className="!m-0 !p-0 !font-semibold"> */}
            {title}
          {/* </Title> */}
          {titleContent}
        </Content>
        {showArrowIcon === true ? (
          <>
            {showButtons === false ? (
              ""
            ) : (
              <Content className="flex justify-end">
                {" "}
                {disableDiscard === true ? null : (
                  <Button className="mx-2" onClick={() => navigate(-1)}>
                    {t("labels:discard")}
                  </Button>
                )}
                {isVisible !== false ? (
                  <Button
                    disabled={disableSave === true ? true : false}
                    onClick={() => saveFunction()}
                    //className="app-btn-primary opacity-50"
                    className={`${
                      disableSave === true
                        ? "app-btn-primary opacity-50"
                        : "app-btn-primary"
                    }`}
                  >
                    {/* // !This Button Renders on Store Product Type */}
                    {action === "add" ? t("labels:save") : t("labels:update")}
                  </Button>
                ) : null}
              </Content>
            )}
          </>
        ) : null}
      </Content>
      {headerContent !== null && headerContent !== undefined ? (
        <Content className="mt-[4.0rem] bg-white !px-5 !pt-3 !pb-1">
          {headerContent}
        </Content>
      ) : null}
    </Content>
  );
}

export default HeaderForTitle;
