import { Button, Col, Input, Layout, Radio, Row, Typography, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import validator from "validator";
import MarketplaceServices from "../../services/axios/MarketplaceServices";
import MarketplaceToaster from "../../util/marketplaceToaster";
import util from "../../util/common";
import { useNavigate } from "react-router-dom";
const titleMinLength = process.env.REACT_APP_TITLE_MIN_LENGTH;
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH;
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API;

const LanguageForm = ({
  languageCode,
  languageId,
  setLanguageName,
  languageStatus,
  setLanguageStatus,
  languageName,
}) => {
  const navigate = useNavigate();
  const [txtLanguage, setTxtLanguage] = useState("");
  const [txtLanguageCode, setTxtLanguageCode] = useState("");
  const [scriptDirection, setScriptDirection] = useState("LTR");
  const [defaultTxtLanguage, setDefaultTxtLanguage] = useState("");
  const [defaultTxtLanguageCode, setDefaultTxtLanguageCode] = useState("");
  const [defaultScriptDirection, setDefaultScriptDirection] = useState("LTR");
  const [isEditLanguageFieldEmpty, setIsEditLanguageFieldEmpty] =
    useState(false);
  const [isEditLanguageCodeFieldEmpty, setIsEditLanguageCodeFieldEmpty] =
    useState(false);
  const [onChangeValues, setOnChangeValues] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const { Content } = Layout;

  //! Language post function
  const handleServerCall = () => {
    const postBody = {};
    postBody["language"] = txtLanguage.trim();
    postBody["language_code"] = txtLanguageCode.trim();
    postBody["writing_script_direction"] = scriptDirection;
    setIsLoading(true);
    {
      languageCode === undefined || languageCode === null
        ? MarketplaceServices.save(languageAPI, postBody)
            .then((res) => {
              console.log("Language API post call response", res.data);
              MarketplaceToaster.showToast(res);
              if (res.status === 201) {
                if (res.data) {
                  MarketplaceToaster.showToast(res);
                  setOnChangeValues(false);
                  navigate(
                    `/dashboard/language/language-settings?k=${
                      res.data.response_body[0].id
                    }&n=${res.data.response_body[0].language}&c=${
                      res.data.response_body[0].language_code
                    }&s=${res.data.response_body[0].status}&d=${
                      res.data.response_body[0].is_default === false ? 0 : 1
                    }`
                  );
                  setLanguageName(res.data.response_body[0].language);
                  setLanguageStatus(res.data.response_body[0].status);
                }
                // disabling spinner
                setIsLoading(false);
              }
            })
            .catch((error) => {
              // disabling spinner
              setIsLoading(false);
              console.log(
                "error response of post language API",
                error.response
              );
              MarketplaceToaster.showToast(error.response);
            })
        : MarketplaceServices.update(languageAPI, postBody, { _id: languageId })
            .then((res) => {
              console.log(
                "Language API put call response",
                res.data.response_body[0]
              );
              MarketplaceToaster.showToast(res);
              if (res.status === 201) {
                if (res.data) {
                  MarketplaceToaster.showToast(res);
                  navigate(
                    `/dashboard/languages/language-settings?k=${
                      res.data.response_body[0].id
                    }&n=${res.data.response_body[0].language}&c=${
                      res.data.response_body[0].language_code
                    }&s=${languageStatus}&d=${
                      res.data.response_body[0].is_default === false ? 0 : 1
                    }`
                  );
                  setLanguageName(res.data.response_body[0].language);
                  setDefaultScriptDirection(
                    res.data.response_body[0].writing_script_direction
                  );
                  setDefaultTxtLanguage(res.data.response_body[0].language);
                  setDefaultTxtLanguageCode(
                    res.data.response_body[0].language_code
                  );
                }
                setOnChangeValues(false);
                // disabling spinner
                setIsLoading(false);
              }
            })
            .catch((error) => {
              // disabling spinner
              setIsLoading(false);
              console.log("error response of put language API", error.response);

              MarketplaceToaster.showToast(error.response);
            });
    }
  };

  //!Validation for language post call
  const validateLanguageFieldEmptyOrNot = () => {
    let validValues = 2;
    if (txtLanguage.trim() === "" && txtLanguageCode.trim() === "") {
      setIsEditLanguageFieldEmpty(true);
      setIsEditLanguageCodeFieldEmpty(true);
      validValues--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("languages:please_enter_the_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (txtLanguage.trim() === "" && txtLanguageCode.trim() !== "") {
      setIsEditLanguageFieldEmpty(true);
      validValues--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("languages:please_enter_the_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (txtLanguageCode.trim() === "" && txtLanguage.trim() !== "") {
      setIsEditLanguageCodeFieldEmpty(true);
      validValues--;
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t("languages:please_enter_the_values_for_the_mandatory_fields")}`,
          "error"
        )
      );
    } else if (
      validator.isLength(txtLanguage.trim(), {
        min: titleMinLength,
        max: titleMaxLength,
      }) === false
    ) {
      validValues--;
      setIsEditLanguageFieldEmpty(true);
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "languages:language_must_contain_minimum_of"
          )} ${titleMinLength}, ${t(
            "languages:maximum_of"
          )} ${titleMaxLength} ${t("languages:characters")}`,
          "error"
        )
      );
    } else if (
      validator.isLength(txtLanguageCode.trim(), {
        min: 2,
        max: 5,
      }) === false
    ) {
      validValues--;
      setIsEditLanguageCodeFieldEmpty(true);
      MarketplaceToaster.showToast(
        util.getToastObject(
          `${t(
            "languages:language_code_must_contain_minimum_of_2_maximum_of_5_characters"
          )}`,
          "error"
        )
      );
    }
    if (validValues === 2) {
      handleServerCall();
    }
  };

  //! handle script direction change
  const handleScriptDirectionChange = (value) => {
    setScriptDirection(value);
  };

  //!get call of list language
  const findAllLanguageData = () => {
    setIsLoading(true);
    MarketplaceServices.findAll(languageAPI, null, false)
      .then(function (response) {
        setIsLoading(false);
        console.log(
          "server Success response from language get API call",
          response.data
        );
        let serverLanguageData = response.data.response_body.data;
        if (serverLanguageData && serverLanguageData.length > 0) {
          const filteredLanguageData = serverLanguageData.filter(
            (ele) => ele.language_code === languageCode
          );
          console.log("filteredLanguageData", filteredLanguageData);
          setTxtLanguage(filteredLanguageData[0].language);
          setTxtLanguageCode(filteredLanguageData[0].language_code);
          setScriptDirection(filteredLanguageData[0].writing_script_direction);
          setDefaultTxtLanguage(filteredLanguageData[0].language);
          setDefaultTxtLanguageCode(filteredLanguageData[0].language_code);
          setDefaultScriptDirection(
            filteredLanguageData[0].writing_script_direction
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(
          "server error response from language API call",
          error.response
        );
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (languageCode !== undefined && languageCode !== null) {
      findAllLanguageData();
    }
    if (languageCode !== undefined && languageName !== undefined) {
      setIsEditLanguageCodeFieldEmpty(false);
      setIsEditLanguageFieldEmpty(false);
    }
  }, [languageCode]);

  console.log("onChangeValues", onChangeValues);
  return (
    <Content>
      <Spin tip={t("languages:please_wait")} size="large" spinning={isLoading}>
        <Row>
          <Col span={8} className="pr-2 mb-3">
            <Content className="">
              <span className="text-red-600 text-sm !text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("languages:language")}
              </label>
              <Input
                placeholder={t("languages:enter_language_name")}
                value={txtLanguage}
                minLength={titleMinLength}
                maxLength={titleMaxLength}
                className={`${
                  isEditLanguageFieldEmpty
                    ? "border-red-400 !border-[0.5px] border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                onChange={(e) => {
                  if (
                    e.target.value !== "" &&
                    validator.isAlpha(e.target.value)
                  ) {
                    setTxtLanguage(e.target.value);
                    setOnChangeValues(true);
                  } else if (e.target.value === "") {
                    setTxtLanguage(e.target.value);
                    setOnChangeValues(true);
                  }
                  setIsEditLanguageFieldEmpty(false);
                }}
                onBlur={() => {
                  const trimmed = txtLanguage.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setTxtLanguage(trimmedUpdate);
                }}
              />
            </Content>
          </Col>
          <Col span={3} className="pl-2 mb-3">
            <Content className="">
              <span className="text-red-600 text-sm text-center">*</span>
              <label className="text-[13px] mb-2 ml-1">
                {t("languages:language_code")}
              </label>
              <Input
                placeholder={t("languages:enter_code")}
                value={txtLanguageCode}
                minLength={2}
                maxLength={5}
                className={`${
                  isEditLanguageCodeFieldEmpty
                    ? "border-red-400 border-solid focus:border-red-400 hover:border-red-400"
                    : ""
                }`}
                onChange={(e) => {
                  const languageCodeRegex = /^[a-zA-Z\-]+$/;
                  if (
                    e.target.value !== "" &&
                    validator.matches(e.target.value, languageCodeRegex)
                  ) {
                    setTxtLanguageCode(e.target.value);
                    setOnChangeValues(true);
                  } else if (e.target.value === "") {
                    setTxtLanguageCode(e.target.value);
                    setOnChangeValues(true);
                  }
                  setIsEditLanguageCodeFieldEmpty(false);
                }}
                onBlur={() => {
                  const trimmed = txtLanguageCode.trim();
                  const trimmedUpdate = trimmed.replace(/\s+/g, " ");
                  setTxtLanguageCode(trimmedUpdate);
                }}
              />
            </Content>
          </Col>
        </Row>
        <Content className="w-[50%] ">
          <label className="text-[13px] !mb-2">
            {t("languages:script_direction")}
          </label>
          <Radio.Group
            optionType="button"
            style={{ display: "flex" }}
            value={scriptDirection}
            onChange={(e) => {
              handleScriptDirectionChange(e.target.value);
              if (e.target.value !== defaultScriptDirection) {
                setOnChangeValues(true);
              }
            }}
          >
            <Radio.Button value="LTR">
              {t("languages:left_to_right")}
            </Radio.Button>
            <Radio.Button value="RTL">
              {t("languages:right_to_left")}
            </Radio.Button>
          </Radio.Group>
        </Content>
        {(txtLanguageCode === "" && txtLanguage === "") ||
        onChangeValues === false ||
        (txtLanguage === defaultTxtLanguage &&
          txtLanguageCode === defaultTxtLanguageCode &&
          scriptDirection === defaultScriptDirection) ? null : (
          <Row>
            <Col>
              <Button
                className={"app-btn-primary !mt-5"}
                onClick={() => {
                  if (
                    txtLanguage === defaultTxtLanguage &&
                    txtLanguageCode === defaultTxtLanguageCode &&
                    scriptDirection === defaultScriptDirection
                  ) {
                    MarketplaceToaster.showToast(
                      util.getToastObject(
                        `${t("languages:no_changes_were_detected")}`,
                        "warning"
                      )
                    );
                  } else {
                    validateLanguageFieldEmptyOrNot();
                  }
                }}
              >
                {languageCode !== undefined && languageCode !== null
                  ? `${t("common:Update")}`
                  : `${t("common:Save")}`}
              </Button>
            </Col>
            <Col className="pl-2">
              <Button
                onClick={() => {
                  if (languageCode === undefined || languageCode === null) {
                    setTxtLanguageCode("");
                    setTxtLanguage("");
                    setIsEditLanguageFieldEmpty(false);
                    setIsEditLanguageCodeFieldEmpty(false);
                  } else {
                    setTxtLanguage(defaultTxtLanguage);
                    setTxtLanguageCode(defaultTxtLanguageCode);
                    setScriptDirection(defaultScriptDirection);
                    setIsEditLanguageFieldEmpty(false);
                    setIsEditLanguageCodeFieldEmpty(false);
                  }
                }}
                className={"app-btn-secondary !mt-5"}
              >
                {t("common:Cancel")}
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
    </Content>
  );
};

export default LanguageForm;
