import { Button } from '../../../shadcnComponents/ui/button'
import { Card, CardContent } from '../../../shadcnComponents/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shadcnComponents/ui/dialog'
import { Skeleton } from '../../../shadcnComponents/ui/skeleton'
import { ShadCNTabs, ShadCNTabsTrigger } from '../../../shadcnComponents/customComponents/ShadCNTabs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useGetUserConsentVersionDetails from '../hooks/useGetUserConsentVersionDetails'
import AddVersion from './AddVersion'
import '../policiesSettings.css'

export default function VersionHistory({ userConsentId, refetchUserConsent, setVersionHistory }) {
    const { t } = useTranslation()
    const {
        data: userConsentVersionData,
        status: userConsentVersionStatus,
        isFetched: isUserConsentVersionDetailsFetched,
    } = useGetUserConsentVersionDetails({
        userConsentId,
    })
    const [activeKey, setActiveKey] = useState('0')
    const [userConsentVersionDetails, setUserConsentVersionDetails] = useState(null)
    const [versionTabData, setVersionTabData] = useState([])
    const [addVersion, setAddVersion] = useState(false)

    const getDate = (date) => {
        try {
            return moment(date).format('D MMM YYYY h:mm:ss')
        } catch (error) {
            return ''
        }
    }

    const handleTabChange = (key) => {
        setActiveKey(key)
        setUserConsentVersionDetails(
            userConsentVersionData?.userconsent_version_details?.find((data) => String(data.id) === key)
        )
    }

    useEffect(() => {
        if (userConsentVersionStatus === 'success' || isUserConsentVersionDetailsFetched) {
            const versionData = userConsentVersionData?.userconsent_version_details
                ?.sort((a, b) => b.id - a.id)
                ?.map((data) => ({
                    id: data.id,
                    version: data.version_number,
                    created_on: data.created_on,
                }))
            setVersionTabData(versionData)
            setUserConsentVersionDetails(userConsentVersionData?.userconsent_version_details?.[0])
            setActiveKey(String(userConsentVersionData?.userconsent_version_details?.[0]?.id))
        }
    }, [userConsentVersionData, userConsentVersionStatus, isUserConsentVersionDetailsFetched])

    return (
        <div className='p-4 h-[400px] w-[950px] overflow-hidden'>
            {userConsentVersionStatus === 'pending' ? (
                <Skeleton className='w-full h-[400px]' />
            ) : userConsentVersionStatus === 'success' ? (
                <div className='flex gap-6'>
                    {/* Tab Card */}
                    <Card className='w-[300px] h-[300px] border-none'>
                        <CardContent className='p-0'>
                            <ShadCNTabs
                                value={activeKey}
                                onTabClick={handleTabChange}
                                orientation='vertical'
                                borderPosition='right'
                                className='h-full'>
                                {versionTabData?.map((data) => (
                                    <ShadCNTabsTrigger
                                        key={data?.id}
                                        value={String(data?.id)}
                                        className='w-full text-left'>
                                        <div className='flex flex-col items-start'>
                                            <div className='font-semibold truncate'>
                                                {data?.version === 1 ? 'V1.0' : 'V' + data?.version}
                                            </div>
                                            <span className='text-sm text-muted-foreground'>
                                                {getDate(data?.created_on)}
                                            </span>
                                        </div>
                                    </ShadCNTabsTrigger>
                                ))}
                            </ShadCNTabs>
                        </CardContent>
                    </Card>

                    {/* Content Section */}
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold mb-3'>
                            {userConsentVersionDetails?.consent_display_name}
                        </h3>
                        <Card className='w-[550px] h-[250px] overflow-hidden'>
                            <CardContent className='p-0 h-full'>
                                <div className='h-full overflow-y-auto'>
                                    <ReactQuill
                                        value={userConsentVersionDetails?.consent_display_description}
                                        modules={{ toolbar: false }}
                                        readOnly={true}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <p className='py-2 text-muted-foreground'>
                            {t('labels:last_updated') + ': ' + getDate(userConsentVersionDetails?.updated_on)}
                        </p>
                        <div className='mr-10 flex justify-end'>
                            <Button variant='default' onClick={() => setAddVersion(true)}>
                                {t('labels:create_new_version')}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Dialog for Adding New Version */}
            <Dialog open={addVersion} onOpenChange={setAddVersion}>
                <DialogContent className='sm:max-w-[400px]'>
                    <DialogHeader>
                        <DialogTitle className='font-bold text-lg'>{t('labels:add_version')}</DialogTitle>
                    </DialogHeader>
                    <AddVersion
                        versionNumber={userConsentVersionDetails?.version_number}
                        storeId={userConsentVersionDetails?.store_id}
                        consentId={userConsentId}
                        refetchUserConsent={refetchUserConsent}
                        setAddVersion={setAddVersion}
                        setVersionHistory={setVersionHistory}
                        versionId={userConsentVersionDetails?.id}
                        versionfrom={true}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
