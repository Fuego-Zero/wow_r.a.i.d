import dayjs from 'dayjs';

/**
 * 获取指定日期的CD范围
 *
 * @description 以周四为分界线，获取指定日期的CD范围，now 默认为当前时间
 */
export const getRaidDateRange = (now?: Date) => {
  now ??= new Date();
  const currentDay = now.getDay();

  let perv = 0;

  if (currentDay >= 4) {
    perv = currentDay - 4;
  } else {
    perv = 7 - 4 + currentDay;
  }

  const startDate = dayjs(now).subtract(perv, 'd').startOf('d');
  const endDate = dayjs(startDate).add(6, 'd').endOf('d');

  return {
    start: startDate.toDate(),
    end: endDate.toDate(),
  };
};
