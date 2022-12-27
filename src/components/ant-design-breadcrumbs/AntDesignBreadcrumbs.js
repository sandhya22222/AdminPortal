import React from "react";
import { Breadcrumb, Layout } from "antd";

import "./antDesignBreadcrumbs.css"
const { Content } = Layout;
const { Item } = Breadcrumb;
 
//! like below json array of objects should be passed as props to use AntDesignBreadcrumb
//! title- value is like home, product what ever you want to display in BreadCrumbs
//! navigationPath- value should be a path of particular BreadCrumbs or navigationPath should be like '' to disable
//! displayOrder- value should be in ascending order

//! AntDesignBreadcrumb component with props
//<AntDesignBreadcrumb
// data={[
//   { title: "Home", navigationPath:'/',displayOrder:1},
//   { title: "Product",navigationPath:'',displayOrder:2 },
//   { title: "List products", navigationPath:'/',displayOrder:3},
//   { title: "List products", navigationPath:'',displayOrder:4}
// ]}
// />

const AntDesignBreadcrumbs = ({ data }) => {
  return (
    <Content>
      <Breadcrumb>
        {data.map((val, index) => {
          return val.navigationPath === "" ? (
            <Item key={index}>{val.title}</Item>
          ) : (
            <Item key={index} href={val.navigationPath}>
              {val.title}
            </Item>
          );
        })}
      </Breadcrumb>
    </Content>
  );
};

export default AntDesignBreadcrumbs;
