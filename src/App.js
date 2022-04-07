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

const App = () => {
  return (
    <Suspense fallback={<LoadingMarkup />}>
      <Router>
        <ToastContainer />
        <Header />
        <Container fluid className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to={"/"} />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </Suspense>
  );
};

export default App;
