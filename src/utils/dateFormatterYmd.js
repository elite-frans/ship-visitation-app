import dayjs from "dayjs";

export const dateFormatterYmd = (date) => {
  return date ? dayjs(date).format("YYYY-MM-DD") : null;
};
