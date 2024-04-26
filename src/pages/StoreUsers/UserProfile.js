import React, { useEffect, useState } from 'react'
import { Layout, Typography, Row, Input, Button, Col, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { getGenerateDateAndTime } from '../../util/util'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePageTitle } from '../../hooks/usePageTitle'
import util from '../../util/common'
import StoreModal from '../../components/storeModal/StoreModal'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import MarketplaceToaster from '../../util/marketplaceToaster'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'

const { Content } = Layout
const { Title } = Typography
const changePasswordAPI = process.env.REACT_APP_CHANGE_PASSWORD_API
const storeUsersAPI = process.env.REACT_APP_USERS_API
const maxPasswordLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH
const minPasswordLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH

const UserProfile = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:my_profile'))
    const [storeUsersData, setStoreUsersData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState()
    const [relmname, setRelmName] = useState()
    const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(true)
    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true)
    const showPasswordChangeModal = () => {
        setIsPasswordChangeModalOpen(true)
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

    // function to validate password
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

    // checking whether the password is valid or not
    useEffect(() => {
        setIsPasswordValid(validatePassword())
    }, [password])

    const findAllWithoutPageStoreUsers = () => {
        MarketplaceServices.findAllWithoutPage(storeUsersAPI, null, false)
            .then(function (response) {
                console.log('get from  store user server response-----> ', response.data)
                setStoreUsersData(response.data.response_body)
                setIsNetworkError(false)
                setIsLoading(false)
                const name = response.data.response_body.username
                setUserName(name)
                console.log('Username ---->: ', userName)
                setRelmName(response.data.response_body.relmname)
                console.log('Relm Name : ', relmname)
                const email = response.data.response_body.email
                setEmail(email)
            })
            .catch((error) => {
                console.log('error from store all users API ====>', error.response)
                setIsNetworkError(true)
                setIsLoading(false)
                if (error && error.response && error.response.status === 401) {
                    toast('Session expired', {
                        position: toast.POSITION.TOP_RIGHT,
                        type: 'error',
                        autoClose: 10000,
                    })
                }
            })
    }
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

    useEffect(() => {
        findAllWithoutPageStoreUsers()
        window.scroll(0, 0)
    }, [])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <Title level={3} className='!font-normal'>
                            {t('labels:profile')}
                        </Title>
                    </Content>
                }
            />
            <Content className='mt-[9rem] '>
                {isLoading ? (
                    <Content className=' bg-white p-3 !mx-4 '>
                        <SkeletonComponent />
                    </Content>
                ) : isNetworkError ? (
                    <Content className='p-3 text-center !mx-4 bg-[#F4F4F4]'>
                        <p>{t('messages:network_error')}</p>
                    </Content>
                ) : (
                    <Content className='mx-3 my-24'>
                        <Content className='w-[100%] bg-white my-3 p-2 rounded-md shadow-sm'>
                            <div className='flex gap-2'>
                                <Avatar size={64} icon={<UserOutlined />} />
                                <div className='flex flex-col justify-center'>
                                    <Typography className='input-label-color  m-0 items-center'>
                                        <span className='text-3xl'>
                                            {storeUsersData &&
                                            storeUsersData.username &&
                                            storeUsersData.username.length > 0
                                                ? storeUsersData.username.slice(0, 1).toUpperCase() +
                                                  storeUsersData.username.slice(1)
                                                : null}
                                        </span>{' '}
                                        <span>
                                            {t('labels:onboarded_on')}{' '}
                                            {getGenerateDateAndTime(
                                                storeUsersData && storeUsersData.createdTimestamp,
                                                'MMM D YYYY'
                                            ).replace(/(\w{3} \d{1,2}) (\d{4})/, '$1, $2')}
                                        </span>
                                    </Typography>
                                    <Typography className='text-black !mt-1 !mb-0 !mx-0'>
                                        {storeUsersData &&
                                            storeUsersData.groups.length > 0 &&
                                            storeUsersData.groups.map((ele) => (
                                                <span>{ele.name.replace(/-/g, ' ')}</span>
                                            ))}
                                    </Typography>
                                </div>
                            </div>
                        </Content>

                        <Content className='w-[100%] bg-white my-4 p-3 rounded-md shadow-sm'>
                            <Row gutter={25} className='pb-2'>
                                <Col span={12}>
                                    <Typography className='input-label-color'>{t('labels:first_name')}</Typography>
                                </Col>
                                <Col>
                                    <Typography className='input-label-color'>{t('labels:last_name')}</Typography>
                                </Col>
                            </Row>
                            <Row gutter={25} className='pb-2'>
                                <Col span={12}>
                                    <Input value={storeUsersData && storeUsersData.firstName} disabled />
                                </Col>
                                <Col span={12}>
                                    <Input value={storeUsersData && storeUsersData.lastName} disabled />
                                </Col>
                            </Row>
                            <Row className='pb-2'>
                                <Col>
                                    <Typography className='input-label-color'>{t('labels:email')}</Typography>
                                </Col>
                            </Row>
                            <Row gutter={25}>
                                <Col span={12}>
                                    <Input value={email} disabled />
                                </Col>
                                <Col>
                                    <Button onClick={showPasswordChangeModal} className='app-btn-secondary'>
                                        {t('labels:change_password')}
                                    </Button>
                                </Col>
                            </Row>
                            <Typography className='input-label-color py-2'>{t('labels:profile_picture')}</Typography>
                            <Avatar shape='square' size={64} icon={<UserOutlined />} />
                        </Content>
                    </Content>
                )}
            </Content>
            {/* Change password modal */}
            {isPasswordChangeModalOpen ? (
                <StoreModal
                    isVisible={isPasswordChangeModalOpen}
                    title={t('labels:change_password')}
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
                    }
                    hideCloseButton={false}
                    isSpin={''}
                    width={1000}>
                    <hr />
                    <Content className='mt-2'>
                        <Row gutter={50}>
                            <Col span={12}>
                                <Content>
                                    <Typography className='input-label-color py-2'>
                                        {t('labels:current_password')}
                                        <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                    </Typography>
                                    <Input.Password
                                        placeholder={t('placeholders:enter_password')}
                                        value={currentPassword}
                                        status={isCurrentPasswordValid ? '' : 'error'}
                                        maxLength={maxPasswordLength}
                                        minLength={minPasswordLength}
                                        onChange={handleCurrentPasswordChange}
                                    />
                                </Content>
                            </Col>
                        </Row>
                        <Row gutter={50} className='mt-6 mb-2'>
                            <Col span={12}>
                                <Content className='mb-2'>
                                    <Typography className='input-label-color py-2'>
                                        {t('labels:new_password')}
                                        <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                    </Typography>

                                    <Input.Password
                                        placeholder={t('placeholders:enter_your_new_password')}
                                        value={password}
                                        maxLength={maxPasswordLength}
                                        minLength={minPasswordLength}
                                        status={
                                            isNewPasswordValid ? (password && !isPasswordValid ? 'error' : '') : 'error'
                                        }
                                        onChange={handlePasswordChange}
                                    />
                                    {password && !isPasswordValid && (
                                        <div style={{ color: 'red' }}>{t('labels:please_enter_a_valid_password')}</div>
                                    )}
                                    {password && password === currentPassword && (
                                        <div style={{ color: 'red' }}>{t('labels:password_should_not_be_same')}</div>
                                    )}
                                </Content>
                                <Content>
                                    <Typography className='input-label-color py-2'>
                                        {t('labels:confirm_password')}
                                        <span className='mandatory-symbol-color text-sm mx-1'>*</span>
                                    </Typography>
                                    <Input.Password
                                        placeholder={t('placeholders:enter_your_confirm_password')}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        status={isConfirmPasswordValid ? '' : 'error'}
                                        maxLength={maxPasswordLength}
                                        minLength={minPasswordLength}
                                        className={
                                            password &&
                                            confirmPassword &&
                                            password !== '' &&
                                            confirmPassword !== '' &&
                                            password !== confirmPassword
                                                ? 'custom-error-input'
                                                : null
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
                                </Content>
                            </Col>
                            <Col span={12} className=' border-l-2 border-gray-300'>
                                <Content>
                                    <Title level={5}>{t('labels:your_password_must_contain')}</Title>
                                    <p>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && password.length >= 12 ? 'green' : 'initial'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:at_least_12_characters')}
                                    </p>
                                    <p>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[A-Z]/.test(password) ? 'green' : 'initial'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_upper_case_letter')}
                                    </p>
                                    <p>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${
                                                    password && /[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)
                                                        ? 'green'
                                                        : 'initial'
                                                }`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_special_character_or_symbols')}
                                    </p>
                                    <p>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[a-z]/.test(password) ? 'green' : 'initial'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_lower_case_letters')}
                                    </p>
                                    <p>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[\d]/.test(password) ? 'green' : 'initial'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_numbers')}
                                    </p>
                                </Content>
                            </Col>
                        </Row>
                    </Content>
                    <hr />
                </StoreModal>
            ) : null}
        </Content>
    )
}

export default UserProfile
