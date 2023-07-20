import React, { Suspense, useState } from "react";
import { Container } from "reactstrap";
import { Layout, Spin } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./core-ui/app.css";
import "./core-ui/buttons.css";
import LoadingMarkup from "./components/loader/LoadingMarkup";
import Header2 from "./components/header/Header2";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import PageNotFound from "./pages/404/PageNotFound";
import { useFavicon } from "./hooks/useFavicon";
import axios from "axios";
import Store from "./pages/Stores/Store";
// import Sidebar from "./components/sidebar/Sidebar";
import Language from "./pages/languages/Language";
import AddLanguage from "./pages/languages/AddLanguage";
import EditLanguage from "./pages/languages/EditLanguage";
import SidebarNew from "./components/Sidebar2.0.js/SidebarNew";
import PaymentType from "./pages/PaymentType/PaymentType";
import OnlinePaymentConnector from "./pages/OnlinePaymentConnector/OnlinePaymentConnector";
import StoreSettings from "./pages/StoreSetting/StoreSettings";
import Preview from "./pages/StoreSetting/Preview";
import UserProfile from "./pages/StoreUsers/UserProfile";
import { LoadingOutlined } from "@ant-design/icons";
import LogOut from "./components/LogOut";

import { useAuth } from "react-oidc-context";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// const authFromEnv = process.env.REACT_APP_AUTH;

const { Content } = Layout;
const App = () => {
  const auth = useAuth();
  useFavicon();

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 54,
      }}
      spin
    />
  );

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div></div>;
    case "signoutRedirect":
      return <div></div>;
  }

  if (auth.isLoading) {
    return (
      <Layout className="h-[100vh]">
        <Content className="grid justify-items-center align-items-center h-full">
          <Spin indicator={antIcon} />
        </Content>
      </Layout>
    );
  }

  if (auth.error) {
    return void auth.signoutRedirect();
  }
  return (
    <Suspense fallback={<LoadingMarkup />}>
      <Router>
        <ToastContainer />
        <Header2 />
        <Container fluid className="p-0 bg-[#F4F4F4] text-[#393939]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<LogOut />} />

            {auth.isAuthenticated ? (
              <Route path="/dashboard" element={<SidebarNew />}>
                <Route path="" element={<Dashboard />} />
                <>
                  <Route path="language" element={<Language />} />
                  <Route
                    path="language/edit_language"
                    element={<EditLanguage />}
                  />
                  <Route
                    path="language/add_language"
                    element={<AddLanguage />}
                  />
                  <Route path="store" element={<Store />} />
                  <Route
                    path="store/storesetting"
                    element={<StoreSettings />}
                  />
                  <Route path="preview" element={<Preview />} />
                  <Route path="paymenttype" element={<PaymentType />} />
                  <Route path="userprofile" element={<UserProfile />} />
                  <Route
                    path="onlinepaymentconnector"
                    element={<OnlinePaymentConnector />}
                  />
                </>
              </Route>
            ) : (
              <>{void auth.signinRedirect()}</>
            )}
          </Routes>
        </Container>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
