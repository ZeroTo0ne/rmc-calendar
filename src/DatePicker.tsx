import React from 'react'
import RMCDatePicker from 'rmc-date-picker'

import { Models } from './panel/DataTypes'
import ConfirmPanel from './panel/ConfirmPanel'

export interface PropsType {
  locale: Models.Locale;
  title?: string;
  prefixCls?: string;
  pickerPrefixCls?: string;
  defaultValue?: Date;
  onTimeOk: (date: Date) => void;
  onCancel: () => void;

  minDate?: Date;
  maxDate?: Date;
  clientHeight?: number;
}

export default class DatePicker extends React.PureComponent<PropsType, {}> {
  static defaultProps = {
    defaultValue: new Date(),
  } as PropsType;

  state = {
    date: this.props.defaultValue,
  }

  onDateChange = (date: Date) => {
    this.setState({ date })
  }

  onOk = () => {
    const { onTimeOk } = this.props
    const { date } = this.state
    onTimeOk && date && onTimeOk(date)
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  render() {
    const {
      locale,
      title,
      prefixCls,
      pickerPrefixCls,
      clientHeight,
      minDate,
      maxDate,
    } = this.props
    const { date } = this.state
    const height = (clientHeight && clientHeight * 5 / 8 - 52) || Number.POSITIVE_INFINITY

    return (
      <div className="time-picker">
        <div className="header">
          <div className="title">{title || locale.title}</div>
          {date ? <div className="time-show">{`${date.getFullYear()}-${date.getMonth() + 1}`}</div> : null}
        </div>
        <RMCDatePicker
          prefixCls={prefixCls}
          pickerPrefixCls={pickerPrefixCls}
          style={{
            height: height > 164 || height < 0 ? 164 : height,
            overflow: 'hidden',
          } as React.CSSProperties}
          mode="month"
          date={date}
          locale={locale}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={this.onDateChange}
        />
        <ConfirmPanel
          type="one"
          locale={locale}
          onOk={this.onOk}
          onCancel={this.onCancel}
        />
      </div>
    )
  }
}
