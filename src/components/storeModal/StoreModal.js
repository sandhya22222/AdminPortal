import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../../shadcnComponents/ui/dialog'
import { Button } from '../../shadcnComponents/ui/button'
import { useTranslation } from 'react-i18next'

const StoreModal = ({
    okCallback,
    cancelCallback,
    isVisible,
    children,
    title,
    cancelButtonText,
    okButtonText,
    hideCloseButton,
    isCancelButtonDisabled,
    isOkButtonDisabled,
    removePadding,
    width,
    height,
}) => {
    const { t } = useTranslation()

    const handleOk = () => {
        okCallback()
    }

    const handleCancel = () => {
        cancelCallback()
    }

    return (
        <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent
                className={`${removePadding ? '' : ''}`}
                style={{
                    width: width || 'auto',
                    maxWidth: '100%',
                    height: height || 'auto',
                }}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className='px-0 py-2'>{children}</div>
                <DialogFooter>
                    {cancelButtonText && (
                        <Button
                            variant='secondary'
                            className={`app-btn-secondary ${isCancelButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleCancel}
                            disabled={isCancelButtonDisabled}>
                            {cancelButtonText}
                        </Button>
                    )}
                    {okButtonText && (
                        <Button
                            variant='primary'
                            className={`app-btn-primary ${isOkButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleOk}
                            disabled={isOkButtonDisabled}>
                            {okButtonText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default StoreModal
