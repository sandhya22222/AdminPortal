import { Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'
import { sanitizeHtml } from '../../util/util'

const DisplayPolicy = ({ policy }) => {
    console.log(typeof policy?.consent_description, 'description')
    const { t } = useTranslation()

    return (
        <>
            {policy?.consent_description ? (
                <ReactQuill value={sanitizeHtml(policy?.consent_description)} modules={{ toolbar: false }} readOnly />
            ) : (
                <div className='  flex justify-center pt-20'>
                    <Empty description={t('messages:policies_description_Not_available')} />
                </div>
            )}
        </>
    )
}
export default DisplayPolicy
