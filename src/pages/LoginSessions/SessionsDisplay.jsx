import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '../../shadcnComponents/ui/separator'
import { Button } from '../../shadcnComponents/ui/button'
import { Alert, AlertTitle, AlertDescription } from '../../shadcnComponents/ui/alert'
import StoreModal from '../../components/storeModal/StoreModal'
import './LoginSessions.css'
import { useSession } from './useSession'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { XCircle } from 'lucide-react'
import { Check } from 'lucide-react'
import { X } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../shadcnComponents/ui/input-otp'
import Spin from '../../shadcnComponents/customComponents/Spin'
import ListSession from './ListSession'
const SessionsDisplay = () => {
    const resendSeconds = 30
    const { t } = useTranslation()
    const [openRemoveHandler, setOpenRemoveHandler] = useState(false)
    const [openOtpHandler, setOpenOtpHandler] = useState(false)
    const [seconds, setSeconds] = useState(resendSeconds)
    const [sessionId, setSessionId] = useState(null)
    const [resendMessage, setResendMessage] = useState('')
    const [resendingOtp, setResendingOtp] = useState(false)
    const {
        data: sessions,
        isError,
        error,
        isLoading,
        sendOtp,
        otpLoading,
        submitOtp,
        otpConfirmLoading,
        refetch,
    } = useSession()
    useEffect(() => {
        if (seconds <= 0) {
            return
        }
        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [seconds])
    const [otp, setOtp] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleOtpChange = (newOtp) => {
        setOtp(newOtp)
        setErrorMessage('')
        setResendMessage('')
    }
    async function submitHandler() {
        try {
            setErrorMessage('')
            setResendMessage('')

            await submitOtp(
                { sessionId, otp },
                {
                    onSuccess: () => {
                        setErrorMessage('')
                        setResendMessage('')
                        setOpenOtpHandler(false)
                        refetch()
                    },
                    onError: () => {
                        setErrorMessage(t('labels:invalid_otp'))
                        setResendMessage('')
                    },
                }
            )
        } catch (err) {
            setErrorMessage(t('labels:unexpected_error'))
        }
    }

    async function resendHandler() {
        try {
            setErrorMessage('')
            setResendMessage('')
            setResendingOtp(true)
            await sendOtp(sessionId, {
                onSuccess: () => {
                    setResendMessage(t('labels:otp_sent'))
                    setResendingOtp(false)
                },
                onError: () => {
                    setErrorMessage(t('labels:resend_failed'))
                    setResendingOtp(false)
                },
            })
        } catch (err) {
            console.error(t('labels:unexpected_resend_error'), err)
            setErrorMessage(t('labels:unexpected_error'))
        }
    }

    if (isError) {
        const errorMessage = error?.message || t('labels:something_went_wrong')

        return (
            <Alert variant='destructive' className='mt-4'>
                <XCircle className='h-5 w-5 text-red-600' />
                <div className='flex flex-col ml-2'>
                    <AlertTitle className='text-red-600'>{t('labels:error')}</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </div>
            </Alert>
        )
    }

    if (isLoading || sessions == null || sessions == undefined) {
        return (
            <div className='flex flex-col gap-2 space-y-1 mt-5'>
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
            </div>
        )
    }
    return (
        <div className='h-[100vh] overflow-auto bg-white border mx-5  rounded-lg  custom-scrollbar m-5'>
            <div className='p-4'>
                <p className='!text-xl font-bold'>{t('labels:logged_in_devices')}</p>
            </div>
            <Separator className='my-0' />
            <ListSession setSessionId={setSessionId} setOpenRemoveHandler={setOpenRemoveHandler} />
            <StoreModal
                title={t('labels:logged_out_confirmation_title')}
                isVisible={openRemoveHandler}
                cancelCallback={() => setOpenRemoveHandler(false)}
                isSpin={false}
                width={600}>
                <div className='!pb-0'>
                    <p>{t('labels:logged_out_confirmation_description')}</p>
                    <div className='flex items-end justify-end mt-4'>
                        <Button
                            className='ml-auto'
                            onClick={() => {
                                setSeconds(resendSeconds)
                                setOpenOtpHandler(true)
                                setOpenRemoveHandler(false)
                                sendOtp(sessionId)
                                setErrorMessage('')
                                setResendMessage('')
                            }}>
                            {t('labels:confirm')}
                        </Button>
                    </div>
                </div>
            </StoreModal>

            <StoreModal
                title={t('labels:otp_verification')}
                isVisible={openOtpHandler}
                cancelCallback={() => setOpenOtpHandler(false)}
                isSpin={false}
                width={600}>
                <div className='!pb-0 '>
                    <p>{t('labels:otp_message')}</p>
                    <div className='flex flex-col mt-4'>
                        {errorMessage && (
                            <Alert className='mb-4 flex items-center gap-2 bg-red-100' variant='destructive'>
                                <div className='flex items-center justify-center h-4 w-4 rounded-full bg-red-500'>
                                    <X className='h-3 w-3 text-white' />
                                </div>
                                <span className='text-sm'>{errorMessage}</span>
                            </Alert>
                        )}
                        {resendMessage && (
                            <Alert className='mb-4 flex items-center gap-2 bg-green-100 ' variant='success'>
                                <div className='flex items-center justify-center h-4 w-4 rounded-full bg-green-500'>
                                    <Check className='h-3 w-3 text-white' />
                                </div>
                                <span className='text-sm'>{resendMessage}</span>
                            </Alert>
                        )}

                        <div>{t('labels:enter_otp')}</div>
                        <InputOTP className='max-w-[500px]' maxLength={6} onChange={handleOtpChange}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {seconds > 0 && (
                            <div className='flex flex-row items-start justify-start mt-5 gap-2'>
                                <span>{t('labels:resend_countdown', { seconds })}</span>
                            </div>
                        )}
                        {resendingOtp && (
                            <span className='mt-5 text-brandGray1'>
                                {t('labels:sending_otp')} <Spin />
                            </span>
                        )}
                        {seconds === 0 && !resendingOtp && (
                            <Button
                                className='flex justify-start text-primary t items-start h-2 p-0 m-0 mt-5 hover:bg-inherit hover:text-mp-primary-background-h'
                                onClick={resendHandler}
                                variant='ghost'>
                                {t('labels:resend_otp')}
                            </Button>
                        )}
                    </div>
                </div>
                <div className='w-full flex justify-end'>
                    <Button className='' disabled={otp.length !== 6} onClick={submitHandler}>
                        {otpConfirmLoading ? t('labels:verifying') : t('labels:remove')}
                    </Button>
                </div>
            </StoreModal>
        </div>
    )
}

export default SessionsDisplay
