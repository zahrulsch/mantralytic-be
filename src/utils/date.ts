import dayjs from "dayjs";

export const onlyDate = (add: number = 0, minus: number = 0) => {
  return dayjs()
    .add(add, "day")
    .subtract(minus, "day")
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .toDate()
    .getTime()
}

export const fullDate = () => {
  return dayjs()
    .toDate()
    .getTime()
}