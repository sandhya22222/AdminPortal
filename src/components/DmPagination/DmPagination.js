import React from "react";
import { Layout, Pagination } from "antd";
import { useTranslation } from "react-i18next";
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE);

const { Content } = Layout;
export default function DmPagination({
  currentPage,
  totalItemsCount,
  handlePageNumberChange,
  pageSize,
  showSizeChanger,
  defaultPageSize,
  showTotal,
  presentPage,
}) {
  const { t } = useTranslation();
  const handlePageChange = (page, pageSize) => {
    handlePageNumberChange(page, pageSize);
  };
  return (
    <Content className="mt-3 mb-5">
      <Pagination
        showSizeChanger={showSizeChanger}
        current={presentPage}
        defaultCurrent={currentPage}
        total={totalItemsCount}
        onChange={handlePageChange}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        showTotal={
          showTotal === true
            ? (total, range) =>
                `${range[0]}-${range[1]} ${t("labels:of")} ${total} ${t(
                  "labels:items"
                )}`
            : false
        }
        locale={{
          //? Here we can customize the Keys for Pagination
          prev_page: t("labels:prev_page"),
          next_page: t("labels:next_page"),
          items_per_page: t("labels:page"),
        }}
      />
    </Content>
  );
}
