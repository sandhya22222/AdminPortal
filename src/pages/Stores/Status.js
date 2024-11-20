import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '../../shadcnComponents/ui/switch'
import { Button } from '../../shadcnComponents/ui/button'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { storeActiveConfirmationImage } from '../../constants/media'
const storeEditStatusAPI = process.env.REACT_APP_STORE_STATUS_API

function Status({
    storeId,
    storeStatus,
    selectedTabTableContent,
    setSelectedTabTableContent,
    storeApiData,
    setStoreApiData,
    tabId,
    activeCount,
    setActiveCount,
    disableStatus,
    statusInprogress,
    setStatusInprogressData,
    statusInprogressData,
    setPreviousStatus,
    setDuplicateStoreStatus,
    previousStatus,
    isDistributor,
    isCancelButtonDisabled,
}) {
    const { t } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [switchStatus, setSwitchStatus] = useState(storeStatus)
    const [changeSwitchStatus, setChangeSwitchStatus] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [activeConfirmationModalOpen, setActiveConfirmationModalOpen] = useState(false)
    const [storeCheckStatus, setStoreCheckStatus] = useState()

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const closeModalconfirmation = () => {
        setActiveConfirmationModalOpen(false)
    }
    useEffect(() => {
        setSwitchStatus(storeStatus)
    }, [storeStatus])

    useEffect(() => {
        setIsLoading(false)
        if (statusInprogress === 1 || statusInprogress === 2) {
            setActiveConfirmationModalOpen(false)
        }
    }, [])

    const updateStoreStatus = async () => {
        const reqBody = {
            status: isDistributor ? 1 : changeSwitchStatus === true ? 1 : 2,
        }
        setIsLoading(true)
        MarketplaceServices.update(storeEditStatusAPI, reqBody, {
            store_id: storeId,
        })
            .then((response) => {
                console.log('response from store status update API', response.data.response_body)
                setSwitchStatus(false)
                closeModal()
                setIsLoading(false)
                if (!isDistributor) {
                    if (
                        (response && response.data.response_body.status === 5) ||
                        (response && response.data.response_body.status === 4)
                    ) {
                        setActiveConfirmationModalOpen(true)
                    }
                }
                setStoreCheckStatus(response.data.response_body?.status)
                let temp = [...storeApiData]
                let index = temp.findIndex((ele) => ele.id === response.data.response_body.id)
                temp[index]['status'] = response.data.response_body.status

                setStoreApiData(temp)
                if (statusInprogressData !== undefined && statusInprogressData !== null) {
                    let statusData = [...statusInprogressData]
                    statusData.push(response.data.response_body)
                    setStatusInprogressData(statusData)
                }

                if (setPreviousStatus !== undefined && setPreviousStatus !== null) {
                    let previousData = [...previousStatus]
                    let temp = {
                        store_id: storeId,
                        status: response.data.response_body.status,
                    }
                    previousData.push(temp)
                    setPreviousStatus(previousData)
                }
                if (setDuplicateStoreStatus !== undefined && setDuplicateStoreStatus !== null) {
                    setDuplicateStoreStatus(response.data.response_body.status)
                }

                let duplicateActiveCall = { ...activeCount }
                if (duplicateActiveCall && duplicateActiveCall.activeStores !== undefined) {
                    if (changeSwitchStatus === true) {
                        duplicateActiveCall['activeStores'] = activeCount && activeCount.activeStores + 1
                        duplicateActiveCall['inactiveStores'] = activeCount && activeCount.inactiveStores - 1
                        setActiveCount(duplicateActiveCall)
                    } else {
                        duplicateActiveCall['activeStores'] = activeCount && activeCount.activeStores - 1
                        duplicateActiveCall['inactiveStores'] = activeCount && activeCount.inactiveStores + 1
                        setActiveCount(duplicateActiveCall)
                    }
                }
                if (tabId > 0 && selectedTabTableContent && selectedTabTableContent.length > 0) {
                    setSelectedTabTableContent(
                        selectedTabTableContent.filter((element) => element.id !== response.config.params.store_id)
                    )
                } else {
                    if (selectedTabTableContent && selectedTabTableContent.length > 0) {
                        let temp = [...selectedTabTableContent]
                        let index = temp.findIndex((ele) => ele.id === response.config.params.store_id)
                        temp[index]['status'] = changeSwitchStatus === true ? 1 : 2
                        setSelectedTabTableContent(temp)
                    }
                }
            })
            .catch((error) => {
                setIsLoading(false)
                closeModal()
                MarketplaceToaster.showToast(error.response)
                console.log('Error from the status response ===>', error)
            })
    }
    

    const onChange = (checked) => {
        setChangeSwitchStatus(checked)
        setIsModalOpen(true)
    }

    console.log(
        'switchStatus',
        statusInprogress,
        disableStatus || statusInprogress === 3 || (isDistributor && switchStatus)
    )
    return (
        <div>
            <StoreModal
                isVisible={isModalOpen}
                okButtonText={t('labels:proceed')}
                title={
                    changeSwitchStatus ? (
                        <span className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                            {t('messages:store_activation_confirmation')}
                        </span>
                    ) : (
                        <span className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                            {t('messages:store_deactivation_confirmation')}
                        </span>
                    )
                }
                cancelButtonText={t('labels:cancel')}
                okCallback={() => updateStoreStatus()}
                cancelCallback={() => closeModal()}
                isSpin={isLoading}
                hideCloseButton={true}>
                {changeSwitchStatus ? (
                    <div className='text-brandGray1'>
                        <p className='!mb-0'>{t('messages:store_active_confirmation_message')}</p>
                        <p className='!m-0 !p-0'>{t('messages:are_you_sure_you_like_to_proceed')}</p>
                    </div>
                ) : (
                    <div className='text-brandGray1'>
                        <p>{t('messages:store_deactivation_confirmation_message')}</p>
                    </div>
                )}
            </StoreModal>

            <div className='flex gap-1'>
                <div className='relative inline-flex items-center'>
                    {statusInprogress === 4 || statusInprogress === 5 ? (
                        <div className='absolute  flex items-center justify-center animate-spin rounded-full h-6 w-6 border-b-2 border-brandPrimaryColor border-t-transparent border-solid  opacity-75 !mb-3'></div>
                    ) : !isDistributor ? (
                        <Switch
                            checked={switchStatus}
                            onCheckedChange={onChange}
                            disabled={
                                disableStatus ||
                                statusInprogress === 3 ||
                                (isDistributor && switchStatus) ||
                                statusInprogress === 4 ||
                                statusInprogress === 5
                            }
                        />
                    ) : (
                        <Button size='sm' onClick={() => updateStoreStatus()} disabled={disableStatus}>
                            {t('labels:restart')}
                        </Button>
                    )}
                </div>
            </div>
            <StoreModal
                isVisible={activeConfirmationModalOpen}
                isSpin={false}
                hideCloseButton={true}
                cancelCallback={() => closeModalconfirmation()}
                width={800}>
                {storeCheckStatus === 4 ? (
                    <div className='text-center'>
                        <div className='text-lg leading-[26px] font-bold text-regal-blue'>
                            {t('labels:activating_store')}
                        </div>
                        <div className='flex justify-center mt-5 mb-3'>
                            <img src={storeActiveConfirmationImage} alt='storeActiveConfirmationImage' />
                        </div>
                        <div className='mb-3 text-brandGray1'>
                            <p className='!mb-0'>{t('messages:patience_is_a_virtue')}</p>
                            <p className='!mb-0'>{t('messages:activation_message')}</p>
                        </div>
                        <Button
                            className='app-btn-primary'
                            onClick={() => {
                                setActiveConfirmationModalOpen(false)
                            }}>
                            {t('labels:close_message')}
                        </Button>
                    </div>
                ) : null}
                {storeCheckStatus === 5 ? (
                    <div className='!text-center'>
                        <div className='text-lg leading-[26px] font-bold text-regal-blue'>
                            {t('labels:deactivating_store')}
                        </div>
                        <div className='flex justify-center mt-5 mb-3'>
                            <img src={storeActiveConfirmationImage} alt='storeActiveConfirmationImage' />
                        </div>
                        <div className='mb-3 text-brandGray1'>
                            <p className='!mb-0'>{t('messages:patience_is_a_virtue')}</p>
                            <p className='!mb-0'>{t('messages:deactivation_message')}</p>
                        </div>
                        <Button
                            className='app-btn-primary'
                            onClick={() => {
                                setActiveConfirmationModalOpen(false)
                            }}>
                            {t('labels:close_message')}
                        </Button>
                    </div>
                ) : null}
            </StoreModal>
        </div>
    )
}

export default Status
