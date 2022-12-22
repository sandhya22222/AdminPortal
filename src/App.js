import React, { Suspense } from "react";
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
import LoadingMarkup from "./components/loader/LoadingMarkup";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Signin from "./pages/signin/Signin";
import PageNotFound from "./pages/404/PageNotFound";
import { useFavicon } from "./hooks/useFavicon";
import axios from "axios";
// import Language from "./pages/Language";
import Store from "./pages/Stores/Store";
import Sidebar from "./components/sidebar/Sidebar";
import Language from "./pages/languagee/Language";
import AddLanguage from "./pages/languagee/AddLanguage";
import EditLanguage from "./pages/languagee/EditLanguage";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const App = () => {
  useFavicon();
  return (
    <Suspense fallback={<LoadingMarkup />}>
      <Router>
        <ToastContainer />
        <Header />
        <Container fluid className="p-0 bg-[#F4F4F4] text-[#393939]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to={"/"} />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Sidebar color="light" />}>
              <Route path="" element={<Dashboard />} />
              <Route path="language" element={<Language />} />
              <Route path="language/edit_language" element={<EditLanguage />} />
              <Route path="language/add_language" element={<AddLanguage />} />
              <Route path="store" element={<Store />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Container>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
