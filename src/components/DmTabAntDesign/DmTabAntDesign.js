import React from "react";
import { Tabs } from "antd";
import "./DmTabAntDesign.css";

/**
 * ? Use of this component
 * ! Tab is a reusable component designed to perform selection functionality according to Tab-Change.
 * ?  Props required to use this component (orderWise).
 * 1) tabData -Should be array of object and each object must contain tabId and tabTitle.
 *     ! example =>[
 *     !             {
 *     !               tabId: 0,
 *     !               tabTitle: "All Images",
 *     !             },
 *     !             {
 *     !               tabId: 1,
 *     !               tabTitle: "Category Image",
 *     !             },
 *     !             ----
 *     !             ----
 *     !             ----
 *     !           ]
 *     ? suggest to set "All" Tab   as tabId = 0
 *
 * 2) handleTabChangeFunction - function to handle tabChange (you will receive selected tabId)
 *
 * 3) defaultSelectedTabKey - tabId, which you want to select as default i.e during initial render respective tab will be selected According to tabId.
 *      ! Note=>  If you pass random tabId  as defaultSelectedTabKey, it will consider first object as defaultSelectedTab (order wise).
 * 4) tabBarPosition - It is to get the position of the Tab.
 *      ?top - The border line will be at Bottom.
 *      ?bottom -  The border line will be at Top.
 * 5) tabType - If you want border to the tabs then give tabType = "line".
 * */

const { TabPane } = Tabs;

const DmTabAntDesign = ({
  tabData,
  handleTabChangeFunction,
  defaultSelectedTabKey,
  activeKey,
  tabBarPosition,
  tabType,
}) => {
  return (
    <Tabs
      defaultActiveKey={defaultSelectedTabKey}
      onTabClick={handleTabChangeFunction}
      tabPosition={tabBarPosition}
      activeKey={activeKey}
      type={tabType}
    >
      {tabData &&
        tabData.length > 0 &&
        tabData.map((element) => {
          return (
            <TabPane
              tab={element.tabTitle}
              key={element.tabId}
              style={{ outline: "none" }}
            ></TabPane>
          );
        })}
    </Tabs>
  );
};

export default DmTabAntDesign;

//! Note- it there will be card in type then tabPosition
