import { toast } from "react-toastify";

const showToast = (object) => {
  console.log("object", object);
  try {
    //Remove all the toast already displaying on the screen before displaying new one
    toast.dismiss();

    const message = object.data.response_message;
    const errorType = object.data.error_type;

    toast(message, {
      // position: toast.POSITION.TOP_RIGHT,
      type: errorType.toLowerCase(),
      autoClose: getToastTimeoutDuration(errorType.toUpperCase()),
    });
  } catch (error) {
    console.log("error from toast", error);
    toast("Please try again after a while. Something went wrong", {
      type: "error",
      autoClose: false,
    });
  }
};

const getToastTimeoutDuration = (key) => {
  switch (key) {
    case "ERROR":
      return 10000;
    case "WARNING":
      return 5000;
    case "INFO":
      return 5000;
    case "SUCCESS":
      return 5000;
    default:
      return false;
  }
};

const MarketplaceToaster = {
  showToast,
};

export default MarketplaceToaster;
