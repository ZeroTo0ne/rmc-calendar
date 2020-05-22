import { Models } from './date/DataTypes'

export default interface PropsType {
  /** 默认日期，default: today */
  defaultDate?: Date;
  /** 选择值 */
  startDate?: Date;
  /** 选择值 */
  endDate?: Date;
  /** 不可选日期 */
  disabledDate?: (current: Date) => boolean;
  /** 自定义内容追加到单元格内 */
  renderDateCellExtra?: (date: Date) => Models.ExtraData;
  /** 自定义内容覆盖单元格 */
  renderDateFullCell?: (date: Date) => React.ReactNode;
  /** 无限滚动优化（大范围选择），default: false */
  infiniteOpt?: boolean;
  /** 初始化月个数，default: 6 */
  initalMonths?: number;
  /** 本地化 */
  locale?: Models.Locale;
  /** 最大日期 */
  maxDate?: Date;
  /** 最小日期 */
  minDate?: Date;
  /** 设置月起始日(1-28)，default: 1 */
  firstDayOfMonth?: number;
  /** 设置周起始日(0-6)，default: 0 */
  firstDayOfWeek?: number;
  /** 日期点击回调 */
  onCellClick?: (date: Date) => void;
  onLayout?: (clientHight: number) => void;
  /** 选择区间包含不可用日期 */
  onSelectHasDisableDate?: (date: Date[]) => void;
  /** 改变展示信息, 日期和头部标题 */
  onChangeShowDateInfo?: (showDate: Date, headerTitle: string) => void;
  /** (web only) 样式前缀 */
  prefixCls?: string;
  /** 选择类型，default: range，one: 单日，range: 日期区间 */
  type?: 'one' | 'range';
}
