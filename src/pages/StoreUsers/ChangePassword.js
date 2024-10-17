import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StoreModal from '../../components/storeModal/StoreModal'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { Input } from '../../shadcnComponents/ui/input'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import MarketplaceServices from '../../services/axios/MarketplaceServices'

const changePasswordAPI = process.env.REACT_APP_CHANGE_PASSWORD_API
const minPasswordLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH

const ChangePassword = ({ isPasswordChangeModalOpen, setIsPasswordChangeModalOpen }) => {
    const { t } = useTranslation()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(true)
    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true)

    const currPassword = useRef(null)
    const newPassword = useRef(null)
    const confPassword = useRef(null)

    function validatePassword() {
        // Check for at least 12 characters
        if (password.length < 12) {
            return false
        }
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return false
        }
        // Check for at least one special character or symbol
        if (!/[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
            return false
        }
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return false
        }
        // Check for at least one number
        if (!/\d/.test(password)) {
            return false
        }
        return true
    }

    // checking whether the password is valid or not
    useEffect(() => {
        setIsPasswordValid(validatePassword())
    }, [password])

    const changePasswordAPICall = () => {
        MarketplaceServices.save(
            changePasswordAPI,
            {
                old_password: currentPassword,
                new_password: password,
            },
            false
        )
            .then(function (response) {
                console.log('get from  store user server response-----> ', response.data)
                MarketplaceToaster.showToast(response)
                setPassword('')
                setCurrentPassword('')
                setConfirmPassword('')
                setIsPasswordChangeModalOpen(false)
            })
            .catch((error) => {
                console.log('error from store all users API ====>', error.response)
                MarketplaceToaster.showToast(error.response)
                if (error.response.status === 400 && error.response.data.response_code === 'UMS-000079-09') {
                    setIsCurrentPasswordValid(false)
                }
                if (Number(error.response.status) === 400 && error.response.data.response_code === 'UMS-000079-04') {
                    setIsConfirmPasswordValid(false)
                    setIsNewPasswordValid(false)
                }
                setPassword('')
                setCurrentPassword('')
                setConfirmPassword('')
            })
    }

    // saving password
    const handleOkPasswordChangeModal = () => {
        //check wether the current password is same as in api call
        // check wether the new password is equal to confirm password
        // make the api call for changing the password
        setIsConfirmPasswordValid(true)
        setIsCurrentPasswordValid(true)
        setIsNewPasswordValid(true)
        if (currentPassword === '') {
            setIsCurrentPasswordValid(false)
        }
        if (password === '') {
            setIsNewPasswordValid(false)
        }
        if (confirmPassword === '') {
            setIsConfirmPasswordValid(false)
        }
        if (currentPassword !== null && currentPassword !== '' && currentPassword.length > 0) {
            if (validatePassword()) {
                if (password === confirmPassword) {
                    changePasswordAPICall()
                } else {
                    MarketplaceToaster.showToast(
                        util.getToastObject(`${t('labels:new_password_and_confirm_password_should_be_same')}`, 'error')
                    )
                }
            } else {
                MarketplaceToaster.showToast(
                    util.getToastObject(`${t('labels:please_enter_a_valid_password')}`, 'error')
                )
            }
        } else {
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('labels:please_enter_your_current_password')}`, 'error')
            )
        }
    }

    // handling Closing password modal
    const handleCancelPasswordChangeModal = () => {
        setIsPasswordChangeModalOpen(false)
        setIsConfirmPasswordValid(true)
        setIsCurrentPasswordValid(true)
        setIsNewPasswordValid(true)
        setPassword('')
        setConfirmPassword('')
        setCurrentPassword('')
    }

    const handleCurrentPasswordChange = (e) => {
        const newPassword = e.target.value
        setCurrentPassword(newPassword)
        if (e.target.value !== '') {
            if (String(e.target.value) === String(confirmPassword)) {
                setIsConfirmPasswordValid(false)
            } else {
                setIsConfirmPasswordValid(true)
            }
            if (String(e.target.value) === String(password)) {
                setIsNewPasswordValid(false)
            } else {
                setIsNewPasswordValid(true)
            }
        }
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        if (e.target.value !== '') {
            if (String(e.target.value) === String(currentPassword)) {
                setIsNewPasswordValid(false)
            } else {
                setIsNewPasswordValid(true)
            }
        }
    }

    const handleConfirmPasswordChange = (e) => {
        const newPassword = e.target.value
        setConfirmPassword(newPassword)
        if (e.target.value !== '') {
            if (String(e.target.value) === currentPassword) {
                setIsConfirmPasswordValid(false)
            } else {
                setIsConfirmPasswordValid(true)
            }
        }
    }

    return (
        <>
            {isPasswordChangeModalOpen ? (
                <StoreModal
                    className='bg-black w-[80%] h-[80%]'
                    width='w-4/5 min-w-[80%]'
                    isVisible={isPasswordChangeModalOpen}
                    title={<div className=' font-bold text-[18px] leading-[26px]'>{t('labels:change_password')}</div>}
                    okCallback={() => handleOkPasswordChangeModal()}
                    cancelCallback={() => handleCancelPasswordChangeModal()}
                    okButtonText={`${t('labels:save')}`}
                    cancelButtonText={`${t('labels:cancel')}`}
                    isOkButtonDisabled={
                        password === '' ||
                        confirmPassword === '' ||
                        currentPassword === '' ||
                        confirmPassword !== password ||
                        !validatePassword()
                    }>
                    <hr />
                    <div className=' flex items-center justify-between w-full h-full'>
                        <div className='flex-row mt-2 w-[45%] min-w-[400px]'>
                            {/*Current Password*/}
                            <div className='space-y-1'>
                                <label className='input-label-color py-2'>
                                    {t('labels:current_password')}
                                    <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                </label>
                                <Input
                                    ref={currPassword}
                                    variant='password'
                                    placeholder={t('placeholders:enter_password')}
                                    value={currentPassword}
                                    onChange={(e) => {
                                        handleCurrentPasswordChange(e)
                                        console.log(e)
                                    }}
                                    className={isCurrentPasswordValid ? '' : 'error'}
                                />
                            </div>
                            {/*New Password Input*/}
                            <div className='space-y-1 mt-6 mb-2'>
                                <label className='input-label-color py-2'>
                                    {t('labels:new_password')}
                                    <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                </label>

                                <Input
                                    ref={newPassword}
                                    variant='password'
                                    placeholder={t('placeholders:enter_your_new_password')}
                                    value={password}
                                    className={
                                        isNewPasswordValid ? (password && !isPasswordValid ? 'error' : '') : 'error'
                                    }
                                    onChange={(e) => handlePasswordChange(e)}
                                />
                                {password && !isPasswordValid && (
                                    <div style={{ color: 'red' }}>{t('labels:please_enter_a_valid_password')}</div>
                                )}
                                {password && password === currentPassword && (
                                    <div style={{ color: 'red' }}>{t('labels:password_should_not_be_same')}</div>
                                )}
                            </div>
                            {/* Confirm Password Input */}
                            <div className='space-y-1 py-4'>
                                <label className='input-label-color py-2'>
                                    {t('labels:confirm_password')}
                                    <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                </label>
                                <Input
                                    ref={confPassword}
                                    variant='password'
                                    placeholder={t('placeholders:enter_your_confirm_password')}
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e)}
                                    className={
                                        password && confirmPassword && password !== confirmPassword
                                            ? 'custom-error-input'
                                            : ''
                                    }
                                />
                                {password &&
                                    confirmPassword &&
                                    password !== '' &&
                                    confirmPassword !== '' &&
                                    password !== confirmPassword && (
                                        <div style={{ color: 'red' }}>{t('messages:password_mismatch')}</div>
                                    )}
                                {confirmPassword && confirmPassword === currentPassword && (
                                    <div style={{ color: 'red' }}>{t('labels:password_should_not_be_same')}</div>
                                )}
                            </div>
                        </div>
                        {/* Password Requirements */}
                        <div className='flex-row  border-l-2 border-gray-300 pl-4 w-[45%] min-w-[400px]'>
                            <h5 className='text-lg font-semibold text-regal-blue'>
                                {t('labels:your_password_must_contain')}
                            </h5>
                            <p
                                className={`!mb-0 pb-2 ${password && password.length >= minPasswordLength ? 'text-green-400' : 'text-brandGray1'}`}>
                                <IoMdCheckmarkCircleOutline
                                    style={{
                                        color: `${password && password.length >= minPasswordLength ? 'lightgreen' : 'gray'}`,
                                        display: 'inline',
                                    }}
                                />{' '}
                                {t('messages:at_least_12_characters')}
                            </p>
                            <p
                                className={`!mb-0 pb-2 ${password && /[A-Z]/.test(password) ? 'text-green-400' : 'text-brandGray1'} `}>
                                <IoMdCheckmarkCircleOutline
                                    style={{
                                        color: `${password && /[A-Z]/.test(password) ? 'lightgreen' : 'gray'}`,
                                        display: 'inline',
                                    }}
                                />{' '}
                                {t('messages:one_or_more_upper_case_letter')}
                            </p>
                            <p
                                className={`!mb-0 pb-2 ${
                                    password && /[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)
                                        ? 'text-green-400'
                                        : 'text-brandGray1'
                                } `}>
                                <IoMdCheckmarkCircleOutline
                                    style={{
                                        color: `${
                                            password && /[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)
                                                ? 'lightgreen'
                                                : 'gray'
                                        }`,
                                        display: 'inline',
                                    }}
                                />{' '}
                                {t('messages:one_or_more_special_character_or_symbols')}
                            </p>
                            <p
                                className={`!mb-0 pb-2 ${password && /[a-z]/.test(password) ? 'text-green-400' : 'text-brandGray1'}`}>
                                <IoMdCheckmarkCircleOutline
                                    style={{
                                        color: `${password && /[a-z]/.test(password) ? 'lightgreen' : 'gray'}`,
                                        display: 'inline',
                                    }}
                                />{' '}
                                {t('messages:one_or_more_lower_case_letters')}
                            </p>
                            <p
                                className={`!mb-0 pb-2 ' ${password && /[\d]/.test(password) ? 'text-green-400' : 'text-brandGray1'} `}>
                                <IoMdCheckmarkCircleOutline
                                    style={{
                                        color: `${password && /[\d]/.test(password) ? 'lightgreen' : 'gray'}`,
                                        display: 'inline',
                                    }}
                                />{' '}
                                {t('messages:one_or_more_numbers')}
                            </p>
                        </div>
                    </div>
                    <hr />
                </StoreModal>
            ) : null}
            <hr />
        </>
    )
}
export default ChangePassword
