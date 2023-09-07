import { toast } from "react-toastify";

const popToast = (responseObj) => {
  console.log("responseObj", responseObj);
  toast(responseObj.response_description, {
    position: toast.POSITION.TOP_RIGHT,
    type: getErrorType(responseObj.error_type.toUpperCase()),
  });
};

const getErrorType = (key) => {
  switch (key) {
    case "ERROR":
      return "error";
    case "WARNING":
      return "warning";
    case "INFO":
      return "info";
    default:
      return "success";
  }
};

const MarketplaceToaster = {
  popToast,
};

export default MarketplaceToaster;
