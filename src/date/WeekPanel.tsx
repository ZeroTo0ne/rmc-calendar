import * as React from 'react'
import { Models } from './DataTypes'

export interface PropsType {
  locale: Models.Locale
  firstDayOfWeek?: number
}

export default class WeekPanel extends React.PureComponent<PropsType, {}> {
  getWeekDayIndex = (i: number) => {
    const { firstDayOfWeek = 0 } = this.props
    const weekDay = i + firstDayOfWeek
    return weekDay > 6 ? weekDay - 7 : weekDay
  }

  render() {
    const { locale } = this.props
    const { week } = locale
    return (
      <div className="week-panel">
        <div className="cell cell-grey">{week[this.getWeekDayIndex(0)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(1)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(2)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(3)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(4)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(5)]}</div>
        <div className="cell cell-grey">{week[this.getWeekDayIndex(6)]}</div>
      </div>
    )
  }
}
