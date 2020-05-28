import { Models } from './panel/DataTypes'

export type SelectDateType = [Date, Date] | [Date];

export default interface PropsType {
  /** 本地化 */
  locale?: Models.Locale;
  /** 关闭时回调 */
  onCancel?: () => void;
  /** 清除时回调 */
  onClear?: () => void;
  /** 确认时回调 */
  onOk?: (startDateTime?: Date, endDateTime?: Date) => void;
  /** (web only) 样式前缀，default: rmc-calendar */
  prefixCls?: string;
  /** 附加样式名称, default: '' */
  className?: string;
  style?: React.CSSProperties;
  /** header title, default: {locale.title} */
  title?: string;
  /** 选择类型，default: range，one: 单日，range: 日期区间 */
  type?: 'one' | 'range';
  /** 是否显示，default: false */
  visible?: boolean;
  /** 选中日期, 开始时间, 结束时间 */
  value?: SelectDateType;
  /** 默认展示，开始时间、结束时间 */
  defaultValue?: SelectDateType;

  // CalendarPanel
  /** 显示开始日期，default: today */
  defaultDate?: Date;
  /** 自定义内容追加到单元格内 */
  renderDateCellExtra?: (date: Date) => Models.ExtraData,
  /** 自定义内容覆盖单元格 */
  renderDateFullCell?: (date: Date) => React.ReactNode,
  /** 无限滚动优化（大范围选择），default: false */
  infinite?: boolean;
  /** 初始化月个数，default: 6 */
  initalMonths?: number;
  /** 可显示日期 */
  validRange?: [Date | undefined, Date | undefined];
  /** 不可选日期 */
  disabledDate?: (current: Date) => boolean;
  /** 设置月起始日(1-28)，default: 1 */
  firstDayOfMonth?: number;
  /** 设置周起始日(0-6)，default: 0 */
  firstDayOfWeek?: number;
  /** 选择日期回调，如果有返回值，选择范围将使用返回值 */
  onSelect?: (date: Date, state?: [Date | undefined, Date | undefined]) => SelectDateType | void;

  // DatePicker
  /** 默认时间选择值 */
  defaultTimeValue?: Date;
}
