import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'

const DisplayPolicy = ({ policy }) => {
    console.log(typeof policy?.consent_description, 'description')
    const { t } = useTranslation()

    return (
        <>
            {policy?.consent_description ? (
                <ReactQuill value={policy?.consent_description} modules={{ toolbar: false }} readOnly />
            ) : (
                <div className='  flex justify-center pt-20 text-lg '>
                    {t('messages:policies_description_Not_available')}
                </div>
            )}
        </>
    )
}
export default DisplayPolicy
