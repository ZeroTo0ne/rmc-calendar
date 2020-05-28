import { Models } from './panel/DataTypes';

export { default as Calendar, ExtraData, PropsType as CalendarPropsType } from './Calendar';
export { default as CalendarPanel, PropsType as CalendarPanelPropsType } from './panel/CalendarPanel';

import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';
const Locale = { zhCN, enUS };

type LocaleType = Models.Locale;
export { Locale, LocaleType };
