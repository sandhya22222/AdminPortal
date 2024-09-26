import React, { useEffect, useState } from 'react'
import { Typography, Row, Input, Col } from 'antd'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { getGenerateDateAndTime } from '../../util/util'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePageTitle } from '../../hooks/usePageTitle'
import util from '../../util/common'
import StoreModal from '../../components/storeModal/StoreModal'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import MarketplaceToaster from '../../util/marketplaceToaster'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import useGetStoreUserData from '../../hooks/useGetStoreUsersData'
import './UserProfile.css'
import ProfileImage from './ProfileImage'
import { Button } from '../../shadcnComponents/ui/button'

const { Title } = Typography
const changePasswordAPI = process.env.REACT_APP_CHANGE_PASSWORD_API
const storeUsersAPI = process.env.REACT_APP_USERS_API
const maxPasswordLength = process.env.REACT_APP_PASSWORD_MAX_LENGTH
const minPasswordLength = process.env.REACT_APP_PASSWORD_MIN_LENGTH

const UserProfile = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:profile'))
    const { data: storeUsersData, status: userDataStatus, refetch: refetchUserData } = useGetStoreUserData()

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
                // setStoreUsersData(response.data.response_body)
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
        // findAllWithoutPageStoreUsers()
        window.scroll(0, 0)
    }, [])

    return (
        <div className='my-4 mx-3'>
            <div>
                {userDataStatus === 'pending' ? (
                    <div className=' bg-white p-3 !mx-4 '>
                        <SkeletonComponent />
                    </div>
                ) : userDataStatus === 'error' ? (
                    <div className='p-3 text-center !mx-4 bg-[#F4F4F4]'>
                        <p>{t('messages:network_error')}</p>
                    </div>
                ) : (
                    <div className=' border-1 border-solid border-brandGray rounded-lg'>
                        <div className='  border-b border-solid border-brandGray'>
                            <div className='!mb-4 !mt-6 !mx-3 !font-semibold !text-lg !text-regal-blue'>
                                {t('labels:profile_information')}
                            </div>
                        </div>
                        <div className='mx-6 mb-6'>
                            <div className='my-6 flex gap-4 items-center'>
                                <ProfileImage
                                    imagePath={storeUsersData?.attributes?.profile_image_path?.[0]}
                                    refetchUserData={refetchUserData}
                                />
                            </div>
                            <hr className='text-brandGray1' />
                            <div className='mt-3 flex flex-col gap-6'>
                                {storeUsersData && storeUsersData?.username && (
                                    <div>
                                        <p className='input-label-color !text-[16px]'>{t('labels:user_name')}</p>
                                        <p className='text-regal-blue text-lg font-semibold'>
                                            {storeUsersData && storeUsersData.username}
                                        </p>
                                    </div>
                                )}
                                {storeUsersData && storeUsersData?.firstName && (
                                    <div>
                                        <p className='input-label-color !text-[16px]'>{t('labels:first_name')}</p>
                                        <p className='text-regal-blue text-lg font-semibold'>
                                            {storeUsersData && storeUsersData.firstName}
                                        </p>
                                    </div>
                                )}
                                {storeUsersData && storeUsersData?.lastName && (
                                    <div>
                                        <p className='input-label-color !text-[16px]'>{t('labels:last_name')}</p>
                                        <p className='text-regal-blue text-lg font-semibold'>
                                            {storeUsersData.lastName}
                                        </p>
                                    </div>
                                )}
                                {storeUsersData && storeUsersData?.email && (
                                    <div>
                                        <p className='input-label-color !text-[16px]'>{t('labels:email')}</p>
                                        <p className='text-regal-blue text-lg font-semibold'>{storeUsersData.email}</p>
                                    </div>
                                )}
                                {storeUsersData && storeUsersData?.attributes?.mobile && (
                                    <div>
                                        <p className='input-label-color !text-[16px]'>{t('labels:mobile_number')}</p>
                                        <p className='text-regal-blue text-lg font-semibold'>
                                            {storeUsersData.attributes.mobile && storeUsersData.attributes.mobile[0]}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className='input-label-color !text-[16px]'>{t('labels:role')}</p>
                                    <p className='text-regal-blue text-lg font-semibold'>
                                        {storeUsersData &&
                                            storeUsersData.groups.length > 0 &&
                                            storeUsersData.groups.map((ele, index) => (
                                                <span key={index}>{ele.name.replace(/-/g, ' ')}</span>
                                            ))}
                                    </p>
                                </div>
                                <div>
                                    <p className='input-label-color !text-[16px]'>{t('labels:onboarded_on')}</p>
                                    <p className='text-regal-blue text-lg font-semibold'>
                                        {getGenerateDateAndTime(
                                            storeUsersData && storeUsersData.createdTimestamp,
                                            'MMM D YYYY'
                                        ).replace(/(\w{3} \d{1,2}) (\d{4})/, '$1, $2')}
                                    </p>
                                </div>
                                <Button
                                    onClick={showPasswordChangeModal}
                                    variant='outline'
                                    className='changePasswordBtn flex items-center justify-center gap-1 max-w-min min-h-10 hover:text-brandPrimaryColor'>
                                    <svg
                                        width='14'
                                        height='14'
                                        viewBox='0 0 14 14'
                                        fill='none'
                                        className='inline-block'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <g clip-path='url(#clip0_2047_16641)'>
                                            <path
                                                d='M13.3882 2.84355C12.6882 2.0998 11.9445 1.35605 11.2007 0.63418C11.0476 0.481055 10.8726 0.393555 10.6757 0.393555C10.4789 0.393555 10.282 0.45918 10.1507 0.612305L1.90386 8.79356C1.77261 8.9248 1.68511 9.07793 1.61949 9.23106L0.416363 12.9061C0.350738 13.0811 0.394488 13.2561 0.481988 13.3873C0.591363 13.5186 0.744488 13.6061 0.941363 13.6061H1.02886L4.76949 12.3592C4.94449 12.2936 5.09761 12.2061 5.20699 12.0748L13.4101 3.89355C13.5414 3.7623 13.6289 3.56543 13.6289 3.36855C13.6289 3.17168 13.5414 2.99668 13.3882 2.84355ZM4.50699 11.3967C4.48511 11.4186 4.46324 11.4186 4.44136 11.4404L1.61949 12.3811L2.56011 9.55918C2.56011 9.5373 2.58199 9.51543 2.60386 9.49356L8.61949 3.4998L10.5226 5.40293L4.50699 11.3967ZM11.2007 4.70293L9.29761 2.7998L10.632 1.46543C11.2664 2.07793 11.9007 2.73418 12.5132 3.36855L11.2007 4.70293Z'
                                                fill='#023047'
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id='clip0_2047_16641'>
                                                <rect width='14' height='14' fill='white' />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    {t('labels:change_password')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Change password modal */}
            {isPasswordChangeModalOpen ? (
                <StoreModal
                    isVisible={isPasswordChangeModalOpen}
                    title={
                        <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                            {t('labels:change_password')}
                        </div>
                    }
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
                    <div className='mt-2'>
                        <Row gutter={50}>
                            <Col span={12}>
                                <div>
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
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={50} className='mt-6 mb-2'>
                            <Col span={12}>
                                <div className='mb-2'>
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
                                </div>
                                <div>
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
                                </div>
                            </Col>
                            <Col span={12} className=' border-l-2 border-gray-300'>
                                <div>
                                    <Title level={5} className='!text-regal-blue'>
                                        {t('labels:your_password_must_contain')}
                                    </Title>
                                    <p className='!mb-0 pb-2 text-brandGray1'>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && password.length >= 12 ? 'green' : 'text-brandGray1'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:at_least_12_characters')}
                                    </p>
                                    <p className='!mb-0 pb-2 text-brandGray1'>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[A-Z]/.test(password) ? 'green' : 'text-brandGray1'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_upper_case_letter')}
                                    </p>
                                    <p className='!mb-0 pb-2 text-brandGray1'>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${
                                                    password && /[!@#$%^&*"'()_+{}\[\]:;<>,.?~\\/-]/.test(password)
                                                        ? 'green'
                                                        : 'text-brandGray1'
                                                }`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_special_character_or_symbols')}
                                    </p>
                                    <p className='!mb-0 pb-2 text-brandGray1'>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[a-z]/.test(password) ? 'green' : 'text-brandGray1'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_lower_case_letters')}
                                    </p>
                                    <p className='!mb-0 pb-2 text-brandGray1'>
                                        <IoMdCheckmarkCircleOutline
                                            style={{
                                                color: `${password && /[\d]/.test(password) ? 'green' : 'text-brandGray1'}`,
                                                display: 'inline',
                                            }}
                                        />{' '}
                                        {t('messages:one_or_more_numbers')}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <hr />
                </StoreModal>
            ) : null}
        </div>
    )
}

export default UserProfile
