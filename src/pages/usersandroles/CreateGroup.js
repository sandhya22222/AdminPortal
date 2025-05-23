import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import API_ENDPOINTS from '../../services/API/apis'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { Button } from '../../shadcnComponents/ui/button'
import { Input } from '../../shadcnComponents/ui/input'
import Spin from '../../shadcnComponents/customComponents/Spin'
const groupsAPI = API_ENDPOINTS.REACT_APP_GROUPS_API

const CreateGroup = ({ groupNameProps, setShowGroupModal }) => {
    const { t } = useTranslation()

    const [groupName, setGroupName] = useState('')
    const [invalidGroupName, setInvalidGroupName] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [setKey] = useState(0)

    //!Handle discard button
    const handleDiscardBtn = () => {
        setShowGroupModal()
        setGroupName('')
        setInvalidGroupName(false)
    }

    //! validation for the group here we are deciding the post call /put call
    const handleValidationGroup = () => {
        let count = 1
        if (groupName === '') {
            count--
            setInvalidGroupName(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('common:values_for_mandatory_fields')}`, 'error'))
        } else if (groupName === groupNameProps) {
            count--
            MarketplaceToaster.showToast(util.getToastObject(`${t('common:no_change_detected')}`, 'warning'))
        }
        if (count === 1) {
            if (groupNameProps === '') {
                handleServerGroupData()
            } else {
                handleUpdateServerGroupData()
            }
        }
    }

    //Post call group
    const handleServerGroupData = () => {
        setIsLoading(true)
        let dataObject = {}
        dataObject['name'] = groupName
        MarketplaceServices.save(groupsAPI, dataObject, null)
            .then(function (response) {
                console.log('server response of group post call', response)
                MarketplaceToaster.showToast(response)
                setIsLoading(false)
                setShowGroupModal(false)
                window.location.reload()
            })
            .catch((error) => {
                console.log('server error response of group post call')
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
            })
    }

    //Put call group
    const handleUpdateServerGroupData = () => {
        setIsLoading(true)
        let dataObject = {}
        dataObject['name'] = groupName
        MarketplaceServices.update(groupsAPI, dataObject, {
            group_name: groupNameProps,
        })
            .then(function (response) {
                console.log('update server response of group post call', response)
                MarketplaceToaster.showToast(response)
                setIsLoading(false)
                setShowGroupModal(false)
                window.location.reload()
            })
            .catch((error) => {
                console.log('update server error response of group post call')
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
            })
    }

    //useeffect will trigger when groupNameProps value changes
    useEffect(() => {
        setGroupName(groupNameProps)
        setKey((prevKey) => prevKey + 1)
    }, [groupNameProps])

    return (
        <div className='pb-4'>
            {isLoading ? (
                <Spin />
            ) : (
                <>
                    <label className='text-xl font-semibold'>
                        {groupNameProps === '' ? t('users_roles:add_group') : t('users_roles:edit_group')}
                    </label>
                    <div>
                        <div className='my-3'>
                            <p className='input-label-color mb-2 flex gap-1'>
                                {t('users_roles:group_name')}
                                <span className='mandatory-symbol-color text-sm '>*</span>
                            </p>
                            <div>
                                <Input
                                    className={`${
                                        invalidGroupName
                                            ? 'border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400'
                                            : ' border-solid border-[#C6C6C6]'
                                    }`}
                                    value={groupName}
                                    onChange={(e) => {
                                        setGroupName(e.target.value)
                                        setInvalidGroupName(false)
                                    }}
                                    placeholder={t('users_roles:enter_the_group_name')}
                                />
                            </div>
                        </div>
                        <div className='float-right'>
                            <Button className='mr-2 app-btn-secondary' onClick={() => handleDiscardBtn()}>
                                {t('common:discard')}
                            </Button>
                            <Button className='app-btn-primary' onClick={() => handleValidationGroup()}>
                                {groupNameProps === '' ? t('common:save') : t('common:update')}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default CreateGroup
