import dayjs from "dayjs";

export const dateFormatter = (date) => {
  return date ? dayjs(date).format("D MMMM YYYY - h:mm A") : null;
};
