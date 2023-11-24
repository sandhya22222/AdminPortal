import React from 'react';
import { Button, Col, Input, Layout, Row, Spin, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import HeaderForTitle from '../../components/header/HeaderForTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceToaster from '../../util/marketplaceToaster';
import MarketplaceServices from '../../services/axios/MarketplaceServices';
import { useEffect } from 'react';
const { Content } = Layout;
const { Text, Title } = Typography;
const storeLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API;

function StoreLimitComponent() {
    const [isStoreLimitChanged, setIsStoreLimitChanged] = useState(false);
    const [isStoreLimitSaving, setIsStoreLimitSaving] = useState(false);
    const defaultStoreLimitValues = {
        store_limit: 0,
        dm_language_limit: 0,
        admin_user_limit: 0
    }
    const [storeLimitValues, setStoreLimitValues] = useState(defaultStoreLimitValues);
    const { t } = useTranslation();
    // const navigate = useNavigate();

       //! get call of store limit API
  const findAllStoreLimit = () => {
    MarketplaceServices.findAll(storeLimitApi)
    .then(function (response) {
      console.log(
        "Server Response from store limit API: ",
        response.data.response_body
      );
      if (
        response &&
        response.data.response_body &&
        response.data.response_body.data.length > 0
      ) {
        // let selectedStoreDataLimit = response.data.response_body.data.filter(
        //   (element) => element.store == storeIdFromUrl
        // );
        // if (selectedStoreDataLimit.length > 0) {
        //   let selectedDataLimit = selectedStoreDataLimit[0];
        //   selectedDataLimit.default_store_commission = selectedDataLimit.default_store_commission == null ? 0 : selectedDataLimit.default_store_commission;
        //   selectedDataLimit.max_products_per_vendor = selectedDataLimit.max_products_per_vendor == null ? 0 : selectedDataLimit.max_products_per_vendor;
        //   selectedDataLimit.max_templates_per_vendor = selectedDataLimit.max_templates_per_vendor == null ? 0 : selectedDataLimit.max_templates_per_vendor;
        //   setStoreDataLimitValues(selectedDataLimit);
        // }
      }
    })
    .catch((error) => {
      console.log("Server error from store limit API ", error.response);
    });
  }


    //! Post call for the store data limit api
    const saveStoreLimit = () => {
        const postBody = {
            store_limit: storeLimitValues.store_limit == "" ? 0 : parseInt(storeLimitValues.store_limit),
            dm_language_limit: storeLimitValues.dm_language_limit == "" ? 0 : parseInt(storeLimitValues.dm_language_limit),
            //  admin_user_limit: storeLimitValues.admin_user_limit == "" ? 0 : parseInt(storeLimitValues.admin_user_limit)
        }
        setIsStoreLimitSaving(true);
        MarketplaceServices.save(storeLimitApi, postBody)
            .then((response) => {
                console.log(
                    "Server Success Response From store data limit",
                    response.data.response_body
                );
                MarketplaceToaster.showToast(response);
                let responseData = response.data.response_body;
                setIsStoreLimitSaving(false);
                let copyofStoreLimitValue = { ...storeLimitValues };
                copyofStoreLimitValue.store_limit = responseData.store_limit;
                copyofStoreLimitValue.dm_language_limit = responseData.dm_language_limit;
                setStoreLimitValues(copyofStoreLimitValue);
                setIsStoreLimitChanged(false);
            })
            .catch((error) => {
                console.log("Error Response From storeSettingPostCall", error.response);
                setIsStoreLimitSaving(false);
                MarketplaceToaster.showToast(error.response);
            });
    };

    useEffect(() => {
        // Once api is ready will enable this 
        // findAllStoreLimit();
    }, [])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className="">
                        <Title level={3} className="!font-normal">
                            {t("labels:admin_menu")}
                        </Title>
                    </Content>
                }
            />
            <Spin tip="Please wait!" size="large" spinning={isStoreLimitSaving}>
                <Content className="bg-white mt-[9rem] px-3 py-4 !rounded-md">
                    <Content className='flex flex-col'>
                        <label className="text-[13px] mb-2 ml-1 input-label-color">
                            {t("labels:store_limit")}
                        </label>
                        <Input
                            className='w-[50%]'
                            placeholder={t("labels:placeholder_unlimited")}
                            // defaultValue={storeSettingData.store_currency["symbol"]}
                            value={storeLimitValues.store_limit > 0 ? storeLimitValues.store_limit : ""}
                            onChange={(e) => {
                                let number = /^[0-9]*$/.test(e.target.value);
                                let copyofStoreLimitValue = { ...storeLimitValues };
                                // to allow only 10 digits
                                if (number && e.target.value.length <= 10) {
                                    copyofStoreLimitValue.store_limit = e.target.value;
                                    setIsStoreLimitChanged(true);
                                    setStoreLimitValues(copyofStoreLimitValue);
                                } else if (e.target.value === "") {
                                    // setIsStoreDataLimitChanged(false);
                                    copyofStoreLimitValue.store_limit = e.target.value;
                                    setStoreLimitValues(copyofStoreLimitValue);
                                }
                            }
                            }
                        />
                    </Content>
                    <Content className='mt-[1rem] flex flex-col'>
                        <label className="text-[13px] mb-2 ml-1 input-label-color">
                            {t("labels:dm_language_limit")}
                        </label>
                        <Input
                            className='w-[50%]'
                            placeholder={t("labels:placeholder_unlimited")}
                            // defaultValue={storeSettingData.store_currency["symbol"]}
                            value={storeLimitValues.dm_language_limit > 0 ? storeLimitValues.dm_language_limit : ""}
                            onChange={(e) => {
                                let number = /^[0-9]*$/.test(e.target.value);
                                let copyofStoreLimitValue = { ...storeLimitValues };
                                // to allow only 10 digits
                                if (number && e.target.value.length <= 10) {
                                    copyofStoreLimitValue.dm_language_limit = e.target.value;
                                    setIsStoreLimitChanged(true);
                                    setStoreLimitValues(copyofStoreLimitValue);
                                } else if (e.target.value === "") {
                                    // setIsStoreDataLimitChanged(false);
                                    copyofStoreLimitValue.dm_language_limit = e.target.value;
                                    setStoreLimitValues(copyofStoreLimitValue);
                                }
                            }
                            }
                        />
                    </Content>
                    <Content className='mt-[1rem] flex flex-col'>
                        <label className="text-[13px] mb-2 ml-1 input-label-color">
                            {t("labels:admin_user_limit")}
                        </label>
                        <Input
                            className='w-[50%]'
                            placeholder={t("labels:placeholder_unlimited")}
                            // defaultValue={storeSettingData.store_currency["symbol"]}
                            value={storeLimitValues.admin_user_limit > 0 ? storeLimitValues.admin_user_limit : ""}
                            onChange={(e) => {
                                let number = /^[0-9]*$/.test(e.target.value);
                                let copyofStoreLimitValue = { ...storeLimitValues };
                                // to allow only 10 digits
                                if (number && e.target.value.length <= 10) {
                                    copyofStoreLimitValue.admin_user_limit = e.target.value;
                                    setIsStoreLimitChanged(true);
                                    setStoreLimitValues(copyofStoreLimitValue);
                                } else if (e.target.value === "") {
                                    // setIsStoreDataLimitChanged(false);
                                    copyofStoreLimitValue.admin_user_limit = e.target.value;
                                    setStoreLimitValues(copyofStoreLimitValue);
                                }
                            }
                            }
                        />
                    </Content>
                    <Content className="mt-4">
                        <Row className="gap-2">
                            <Col>
                                <Button
                                    className={
                                        isStoreLimitChanged ? "app-btn-primary" : "!opacity-75"
                                    }
                                    disabled={!isStoreLimitChanged}
                                    onClick={() => {
                                        saveStoreLimit()
                                    }}
                                >
                                    {t("labels:save")}
                                </Button>
                            </Col>
                            {/* <Col className="">
                  <Button
                    // className=" app-btn-secondary"
                    className={
                        isStoreLimitChanged ? "app-btn-secondary" : "!opacity-75"
                    }
                    disabled={!isStoreLimitChanged}
                    onClick={() => {
                      navigate("/dashboard/adminsettings");
                    }}
                  >
                    {t("labels:discard")}
                  </Button>
                </Col> */}
                        </Row>
                    </Content>
                </Content>
            </Spin>
        </Content>
    )
}

export default StoreLimitComponent