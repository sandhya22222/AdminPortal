import React, { useState } from 'react'
import { Card, CardContent } from '../../shadcnComponents/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shadcnComponents/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shadcnComponents/ui/table'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { Separator } from '../../shadcnComponents/ui/separator'
import { FaPlus, FaMinus } from 'react-icons/fa'
import util from '../../util/common'

export default function PaymentSettings() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    React.useEffect(() => {
        window.scroll(0, 0)
    }, [])

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className=' mt-10 w-full flex flex-col gap-[10px]'>
            <HeaderForTitle
                className=''
                title={
                    <div className=''>
                        <div className='!font-semibold text-2xl mb-4 text-regal-blue'>
                            {t('labels:payment_settings')}
                        </div>
                    </div>
                }
            />
            <div className='p-3 mt-24'>
    <Card className='w-full p-3 bg-white shadow-lg'>
        <CardContent className='!p-0'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className={`w-full !p-[16px] ${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'text-right' : 'text-left'
                            }`}
                        >
                            {t('labels:payment_types')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell
                            className={`${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'pr-[46px]' : 'pl-[46px]'
                            } pb-4`}
                        >
                            {t('labels:cash_on_delivery')}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='!p-0'>
                            <Accordion type='single' collapsible className='w-full'>
                                <AccordionItem value='online-payment' className='!border-none'>
                                    <AccordionTrigger
                                        className={`!m-[16px] flex items-center justify-start gap-2 hover:no-underline`}
                                        onClick={toggleAccordion}
                                    >
                                        <span
                                            className={`${
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-3'
                                                    : 'ml-3'
                                            } p-[2px] transition-transform duration-300 border rounded-[4px] ${
                                                isOpen ? 'rotate-180 border-regal-orange' : 'rotate-0'
                                            } group hover:border-regal-orange`}
                                        >
                                            {isOpen ? (
                                                <FaMinus className='text-[10px] text-regal-orange group-hover:text-regal-orange transition-colors duration-200' />
                                            ) : (
                                                <FaPlus
                                                    className={`text-[10px] ${
                                                        isOpen
                                                            ? 'text-regal-orange'
                                                            : 'text-brandGray1'
                                                    } group-hover:text-regal-orange transition-colors duration-200`}
                                                />
                                            )}
                                        </span>
                                        <span>{t('labels:online_payment')}</span>
                                    </AccordionTrigger>

                                    <Separator />

                                    <AccordionContent>
                                        <div className='pl-0'>
                                            <p
                                                className={`py-[16px] ${
                                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                        ? 'pr-[70px]'
                                                        : 'pl-[70px]'
                                                }`}
                                            >
                                                {t('labels:stripe')}
                                            </p>
                                            <Separator />
                                            <p
                                                className={`py-[16px] ${
                                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                        ? 'pr-[60px]'
                                                        : 'pl-[60px]'
                                                }`}
                                            >
                                                {t('labels:cash_free')}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</div>

        </div>
    )
}
