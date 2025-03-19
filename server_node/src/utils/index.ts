import dayjs from 'dayjs';

/**
 * 获取指定日期的CD范围
 *
 * @description 以周二为分界线，获取指定日期的CD范围，now 默认为当前时间
 */
export const getRaidDateRange = (now?: Date) => {
  now ??= new Date();
  const currentDay = now.getDay();

  const perv = (currentDay - 2 + 7) % 7;

  const startDate = dayjs(now).subtract(perv, 'd').startOf('d');
  const endDate = dayjs(startDate).add(6, 'd').endOf('d');

  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
};
