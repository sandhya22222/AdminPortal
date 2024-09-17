// import React from 'react';
// import Content from '../../components/Content';
// import Typography from '../../components/Typography';
// import Button from '../../components/Button';
// import Table from '../../components/Table';
// import Alert from '../../components/Alert';
// import Radio from '../../components/Radio';
// import Empty from '../../components/Empty'; // Replace with actual import paths from ShadCN
// import { MdInfo } from 'react-icons/md';
// import DmPagination from '../../components/DmPagination/DmPagination'; // Ensure the path is correct
// import { useTranslation } from 'react-i18next';

// const { Text } = Typography;

// const StoreContent = ({
//   selectedTabTableContent,
//   storeTableData,
//   searchValue,
//   handleSearchChange,
//   handleInputChange,
//   value,
//   handleRadioChange,
//   isDistributor,
//   isDistributorStoreActive,
//   countForStore,
//   pageLimit,
//   searchParams,
//   handlePageNumberChange,
//   isSearchTriggered,
// }) => {
//   const { t } = useTranslation();

//   // Convert data
//   const columns = storeTableData.table_header.map(column => ({
//     title: column.title,
//     dataIndex: column.key,
//     key: column.key,
//   }));

//   const dataSource = storeTableData.table_content.map(item => ({
//     key: item.id,
//     ...item,
//   }));

//   // Define or pass required variables
//   const searchMaxLength = 50; // Example value
//   const customButton = <Button>{t('buttons:search')}</Button>; // Example button

//   return (
//     <Content className='bg-white p-3 shadow-brandShadow rounded-md'>
//       <div className='flex w-full justify-between items-center py-3 px-3'>
//         <div className='text-base font-semibold text-regal-blue'>
//           {t('labels:my_stores')}
//         </div>
//         <div className='flex items-center justify-end gap-2 flex-row flex-grow'>
//           <Radio.Group
//             className='min-w-min'
//             optionType='button'
//             onChange={handleRadioChange}
//             value={value}>
//             <Radio value={0}>{t('labels:all')}</Radio>
//             <Radio value={1}>{t('labels:active')}</Radio>
//             <Radio value={2}>{t('labels:inactive')}</Radio>
//           </Radio.Group>
//           <Input.Search
//             placeholder={t('placeholders:please_enter_search_text_here')}
//             onSearch={handleSearchChange}
//             onChange={handleInputChange}
//             value={searchValue}
//             suffix={null}
//             maxLength={searchMaxLength}
//             enterButton={customButton}
//             allowClear
//             className='w-[250px]'
//           />
//         </div>
//       </div>

//       {selectedTabTableContent?.length === 0 && isSearchTriggered && searchValue?.length > 0 ? (
//         <Content className='text-center font-semibold ml-2 mt-3'>
//           <Text>{t('placeholders:not_able_to_find_searched_details')}</Text>
//         </Content>
//       ) : (
//         <>
//           {selectedTabTableContent?.length > 0 ? (
//             <Content>
//               {!isDistributor && (
//                 <div className='px-3 my-2'>
//                   <Alert
//                     icon={<MdInfo className='font-bold !text-center' />}
//                     message={
//                       <div>
//                         <Text className='text-brandGray1'>
//                           {t('messages:no_distributor_store_present_info')}
//                         </Text>
//                       </div>
//                     }
//                     type='info'
//                     showIcon
//                   />
//                 </div>
//               )}
//               {isDistributor && !isDistributorStoreActive && (
//                 <div className='px-3 my-2'>
//                   <Alert
//                     icon={<MdInfo className='font-bold !text-center' />}
//                     message={
//                       <div>
//                         <Text className='text-brandGray1'>
//                           {t('messages:distributor_store_inactive_msg')}
//                         </Text>
//                       </div>
//                     }
//                     type='info'
//                     showIcon
//                   />
//                 </div>
//               )}
//               <Table columns={columns} dataSource={dataSource} />
//               {parseInt(searchParams.get('m_t')) === 1 && (
//                 <Content className='grid justify-items-end mx-3 h-fit'>
//                   {countForStore && countForStore >= pageLimit && (
//                     <DmPagination
//                       currentPage={parseInt(searchParams.get('page')) || 1}
//                       presentPage={parseInt(searchParams.get('page')) || 1}
//                       totalItemsCount={countForStore}
//                       defaultPageSize={pageLimit}
//                       pageSize={parseInt(searchParams.get('limit')) || pageLimit}
//                       handlePageNumberChange={handlePageNumberChange}
//                       showSizeChanger={true}
//                       showTotal={true}
//                       showQuickJumper={true}
//                     />
//                   )}
//                 </Content>
//               )}
//             </Content>
//           ) : (
//             <Content className='pb-4'>
//               <Empty description={t('messages:no_data_available')} />
//             </Content>
//           )}
//         </>
//       )}
//     </Content>
//   );
// };

// export default StoreContent;




// <Content className='bg-white p-3 shadow-brandShadow rounded-md '>
                                    //     <div className='flex w-full justify-between items-center py-3 px-3'>
                                    //         <div className='text-base font-semibold text-regal-blue'>
                                    //             {t('labels:my_stores')}
                                    //         </div>
                                    //         <div className='flex items-center justify-end gap-2 flex-row flex-grow'>
                                    //             <Radio.Group
                                    //                 className={`min-w-min`}
                                    //                 optionType='button'
                                    //                 onChange={handleRadioChange}
                                    //                 value={value}>
                                    //                 <Radio value={0}>{t('labels:all')}</Radio>
                                    //                 <Radio value={1}>{t('labels:active')}</Radio>
                                    //                 <Radio value={2}>{t('labels:inactive')}</Radio>
                                    //             </Radio.Group>
                                    //             <Search
                                    //                 placeholder={t('placeholders:please_enter_search_text_here')}
                                    //                 onSearch={handleSearchChange}
                                    //                 onChange={handleInputChange}
                                    //                 value={searchValue}
                                    //                 suffix={null}
                                    //                 maxLength={searchMaxLength}
                                    //                 enterButton={customButton}
                                    //                 allowClear
                                    //                 className='w-[250px]'
                                    //             />
                                    //         </div>
                                    //     </div>
                                    //     {selectedTabTableContent?.length === 0 &&
                                    //     isSearchTriggered &&
                                    //     searchValue?.length > 0 ? (
                                    //         <Content className='text-center font-semibold ml-2 mt-3 '>
                                    //             <Text>{t('placeholders:not_able_to_find_searched_details')}</Text>
                                    //         </Content>
                                    //     ) : (
                                    //         <>
                                    //             {selectedTabTableContent?.length > 0 ? (
                                    //                 <Content className=''>
                                    //                     {!isDistributor && (
                                    //                         <div className='px-3 my-2'>
                                    //                             <Alert
                                    //                                 icon={<MdInfo className='font-bold !text-center' />}
                                    //                                 message={
                                    //                                     <div className=''>
                                    //                                         <Text className='text-brandGray1'>
                                    //                                             {t(
                                    //                                                 'messages:no_distributor_store_present_info'
                                    //                                             )}{' '}
                                    //                                         </Text>
                                    //                                     </div>
                                    //                                 }
                                    //                                 type='info'
                                    //                                 showIcon
                                    //                                 className=''
                                    //                             />
                                    //                         </div>
                                    //                     )}

                                    //                     {isDistributor === true &&
                                    //                         isDistributorStoreActive === false && (
                                    //                             <div className='px-3 my-2'>
                                    //                                 <Alert
                                    //                                     icon={
                                    //                                         <MdInfo className='font-bold !text-center' />
                                    //                                     }
                                    //                                     message={
                                    //                                         <div className=''>
                                    //                                             <Text className='text-brandGray1'>
                                    //                                                 {t(
                                    //                                                     'messages:distributor_store_inactive_msg'
                                    //                                                 )}{' '}
                                    //                                             </Text>
                                    //                                         </div>
                                    //                                     }
                                    //                                     type='info'
                                    //                                     showIcon
                                    //                                     className=''
                                    //                                 />
                                    //                             </div>
                                    //                         )}
                                    //                     <DynamicTable tableComponentData={storeTableData} />
                                    //                     {parseInt(m_tab_id) === 1 ? (
                                    //                         <Content className=' grid justify-items-end mx-3 h-fit'>
                                    //                             {countForStore && countForStore >= pageLimit ? (
                                    //                                 <DmPagination
                                    //                                     currentPage={
                                    //                                         parseInt(searchParams.get('page'))
                                    //                                             ? parseInt(searchParams.get('page'))
                                    //                                             : 1
                                    //                                     }
                                    //                                     presentPage={
                                    //                                         parseInt(searchParams.get('page'))
                                    //                                             ? parseInt(searchParams.get('page'))
                                    //                                             : 1
                                    //                                     }
                                    //                                     totalItemsCount={countForStore}
                                    //                                     defaultPageSize={pageLimit}
                                    //                                     pageSize={
                                    //                                         parseInt(searchParams.get('limit'))
                                    //                                             ? parseInt(searchParams.get('limit'))
                                    //                                             : pageLimit
                                    //                                     }
                                    //                                     handlePageNumberChange={handlePageNumberChange}
                                    //                                     showSizeChanger={true}
                                    //                                     showTotal={true}
                                    //                                     showQuickJumper={true}
                                    //                                 />
                                    //                             ) : null}
                                    //                         </Content>
                                    //                     ) : null}
                                    //                 </Content>
                                    //             ) : (
                                    //                 <Content className='pb-4'>
                                    //                     <Empty description={t('messages:no_data_available')} />
                                    //                 </Content>
                                    //             )}
                                    //         </>
                                    //     )}
                                    // </Content>