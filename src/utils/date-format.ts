import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatUtcString(
  UtcStr: string,
  format: string = DATE_TIME_FORMAT
) {
  return dayjs.utc(UtcStr).utcOffset(8).format(format)
}
