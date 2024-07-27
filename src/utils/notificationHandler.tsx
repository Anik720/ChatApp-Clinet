import { message } from "antd";

const NotoficationHandler = (data: any, typrOfError: any) => {
  if (typrOfError === "error") {
    message.error(data?.message || "Something went wrong, please try again");
  } else if (typrOfError === "success") {
    message.success(data?.message || "Something went wrong, please try again");
  } else if (typrOfError === "warning") {
    message.warning(data?.message || "Something went wrong, please try again");
  } else if (typrOfError === "info") {
    message.info(data?.message || "Something went wrong, please try again");
  } else {
    message.error("Something went wrong, please try again");
  }
};

export default NotoficationHandler;
