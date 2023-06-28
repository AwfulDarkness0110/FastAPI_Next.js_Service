import { notifications } from "@mantine/notifications";

const colors = {
  success: "green",
  error: "red",
  warning: "yellow",
};

export const createNotification = (type: String, message: String) => {
  {
    notifications.show({
      title: type,
      message: message,
      color: type === "success" ? "green" : "red",
    });
  }
};
