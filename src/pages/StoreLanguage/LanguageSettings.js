import { Divider, Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import HeaderForTitle from "../../components/header/HeaderForTitle";
// import MarketplaceAppConfig from "../../util/MarketplaceMutlitenancy";
import LanguageDocUpload from "./LanguageDocUpload";
import LanguageForm from "./LanguageForm";
import LanguageHeaderAction from "./LanguageHeaderAction";

function LanguageSettings() {
  const { t } = useTranslation();
  const { Content } = Layout;
  const { Title } = Typography;
  const [languageCode, setLanguageCode] = useState();
  const [languageStatus, setLanguageStatus] = useState();
  const [languageId, setLanguageId] = useState();
  const [languageName, setLanguageName] = useState();
  const [languageDefault, setLanguageDefault] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setLanguageCode(searchParams.get("c"));
    setLanguageStatus(searchParams.get("s"));
    setLanguageId(searchParams.get("k"));
    setLanguageName(searchParams.get("n"));
    setLanguageDefault(searchParams.get("d"));
  }, [searchParams]);
  return (
    <Content className="pt-1">
      <Content>
        <HeaderForTitle
          title={
            <Content className="flex !mb-[7px]">
              {/* <Content> */}
              {/**
               * Below is the part responsible for displaying the title of the page in a header.
               * If @languageName is there, which means it is a edit page so it will display the languageName for the edit page.
               * If @languageName is undefined or null means it is a add page.So it will show "Add a language"
               */}
              <Title level={3} className="!font-normal !m-[unset]">
                {languageName &&
                languageName !== undefined &&
                languageName !== null
                  ? languageName
                  : "Add Language"}
              </Title>
              {/**
               * Here below we can render the right side part of the header which renders the status and to delete the language
               * @languageId -> It is the ID of the language.
               * @languageCode -> It is the language code.
               * @languageStatus -> It is the status of the language.
               */}

              {/* </Content> */}
            </Content>
          }
          titleContent={
            languageId && languageCode && languageStatus !== null ? (
              <LanguageHeaderAction
                languageId={languageId}
                languageCode={languageCode}
                languageStatus={languageStatus}
                languageDefault={languageDefault}
              ></LanguageHeaderAction>
            ) : null
          }
          backNavigationPath={`/dashboard/languages`}
          // ?${MarketplaceAppConfig.getStore(
          //   ""
          // )}
          showArrowIcon={true}
          showButtons={false}
        />
      </Content>
      <Content className="p-3 mt-[7.4rem] !min-h-screen">
        <Content className="!bg-white">
          <Title level={4} className="p-3 !m-0">
            Language Details
          </Title>
          <Divider className="!m-0" />
          <Content className="p-3">
            <Content className="my-2">
              {/**
               * This particular container is to display the required language related fields
               * From this component we are passing @languageCode as props.
               * If @languageCode is undefined or null, then it is a add page for language.
               * If @languageCode is present, then it is a edit page.
               * ##NOTE##
               * In this parent component we are not validating whether the @languageCode is valid or exists in the server(Child page has to validate)
               */}
              <LanguageForm
                languageCode={languageCode}
                languageId={languageId}
                setLanguageName={setLanguageName}
                languageStatus={languageStatus}
                setLanguageStatus={setLanguageStatus}
                languageName={languageName}
              />
              <Content></Content>
            </Content>
            <Divider />
            {/**
             * This particular container is to display the file upload for the language
             * From this component we are passing @languageCode as props.
             * If @languageCode is undefined or null, then it is a add page for language.
             * If @languageCode is present, then it is a edit page.
             * ##NOTE##
             * In this parent component we are not validating whether the @languageCode is valid or exists in the server(Child page has to validate)
             */}
            <LanguageDocUpload langCode={languageCode}></LanguageDocUpload>
          </Content>
        </Content>
      </Content>
    </Content>
  );
}

export default LanguageSettings;
