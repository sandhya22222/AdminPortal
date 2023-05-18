import React, { Suspense, useState } from "react";
import { Container } from "reactstrap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./core-ui/app.css";
import "./core-ui/buttons.css";
import LoadingMarkup from "./components/loader/LoadingMarkup";
import Header from "./components/header/Header";
import Header2 from "./components/header/Header2";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Signin from "./pages/signin/Signin";
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
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const auth = process.env.REACT_APP_AUTH;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let keycloakData = false;
  useFavicon();
  let isLoggedInFromSession;

  if (auth === "true") {
    axios.defaults.headers.common["Authorization"] =
      sessionStorage.getItem("access_token");
    isLoggedInFromSession = sessionStorage.getItem("is_loggedIn");
    if (sessionStorage.getItem("keycloakData")) {
      keycloakData = true;
    }
  } else {
    isLoggedInFromSession = false;
  }

  return (
    <Suspense fallback={<LoadingMarkup />}>
      <Router>
        <ToastContainer />
        <Header2 />
        <Container fluid className="p-0 bg-[#F4F4F4] text-[#393939]">
          {auth === "true" && (
            <Routes>
              <Route
                path="/"
                element={
                  <Home setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
                }
              />
              <Route path="/home" element={<Navigate to={"/"} />} />
              <Route path="/signin" element={<Signin />} />
              {keycloakData ? (
                <Route path="/dashboard" element={<SidebarNew color="light" />}>
                  <Route
                    path=""
                    element={
                      <Dashboard
                        setIsLoggedIn={setIsLoggedIn}
                        isLoggedIn={isLoggedIn}
                      />
                    }
                  />
                  {isLoggedInFromSession ? (
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
                      <Route
                        path="onlinepaymentconnector"
                        element={<OnlinePaymentConnector />}
                      />
                      <Route path="*" element={<PageNotFound />} />
                    </>
                  ) : (
                    <Route path="*" element={<PageNotFound />} />
                  )}
                </Route>
              ) : (
                <Route path="*" element={<PageNotFound />} />
              )}
              {/* ) :  <Route path="*" element={<PageNotFound />} />} */}
            </Routes>
          )}
          {auth === "false" && (
            <Routes>
              <Route path="/" element={<Home isLoggedIn={true} />} />
              <Route path="/home" element={<Navigate to={"/"} />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={<SidebarNew color="light" />}>
                <Route path="" element={<Dashboard />} />
                <Route path="language" element={<Language />} />
                <Route
                  path="language/edit_language"
                  element={<EditLanguage />}
                />
                <Route path="language/add_language" element={<AddLanguage />} />
                <Route path="store" element={<Store />} />
                <Route path="store/storesetting" element={<StoreSettings />} />
                <Route path="preview" element={<Preview />} />
                <Route path="paymenttype" element={<PaymentType />} />
                <Route
                  path="onlinepaymentconnector"
                  element={<OnlinePaymentConnector />}
                />
                <Route path="*" element={<PageNotFound />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          )}
        </Container>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
