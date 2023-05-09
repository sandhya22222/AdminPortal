import { Layout } from "antd";
import React from "react";

const { Header } = Layout;

function HeaderForTitle({ headerContent }) {
  return (
    <Header className="fixed top-20 px-4 py-2 !h-auto !w-[80%] bg-white z-10 drop-shadow">
      {headerContent}
    </Header>
  );
}

export default HeaderForTitle;
