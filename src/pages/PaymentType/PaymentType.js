import React, { useState } from 'react'
import { Card, CardContent } from '../../shadcnComponents/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shadcnComponents/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shadcnComponents/ui/table'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { Separator } from '../../shadcnComponents/ui/separator'
import { Layout } from 'antd'
import { FaPlus, FaMinus } from 'react-icons/fa' // Import plus and minus icons

const { Content } = Layout

export default function PaymentSettings() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false) // Track if accordion is open or closed

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
                titleContent={<Content className=' !flex items-center !justify-end gap-3'></Content>}
            />
            <div className='p-3 mt-24'>
                <Card className='w-full p-3 bg-white shadow-lg'>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-full bg-[#f0f0f0]'>{t('labels:payment_types')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className='text-[#4a4a4a] pl-[48px] pb-4 '>
                                        {t('labels:cash_on_delivery')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem value='online-payment'>
                                                <AccordionTrigger
                                                    className='text-[#4a4a4a] pl-3 mt-2 flex items-center justify-start gap-3'
                                                    onClick={toggleAccordion}>
                                                    <span
                                                        className={`ml-2 transition-transform duration-300 border p-1 rounded-[7px]  ${
                                                            isOpen ? 'rotate-180' : 'rotate-0'
                                                        }`}>
                                                        {isOpen ? (
                                                            <FaMinus className='text-[8px]' />
                                                        ) : (
                                                            <FaPlus className='text-[8px]' />
                                                        )}
                                                    </span>
                                                    <span>{t('labels:online_payment')}</span>
                                                </AccordionTrigger>
                                                <Separator />

                                                <AccordionContent>
                                                    <div className='pl-0 space-y-2 '>
                                                        <p className='text-[#4a4a4a] p-2 mt-3 mb-3 mr-3 ml-[55px]'>
                                                            {t('labels:stripe')}
                                                        </p>
                                                        <Separator />
                                                        <p className='text-[#4a4a4a] mt-3 mb-3 mr-3 ml-[55px] pl-2 pt-3 pr-2 pb-5'>
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
