import React from 'react'
import Animate from 'rc-animate';

import TimePicker from './TimePicker'
import DatePicker from './DatePicker'
import ConfirmPanel from './calendar/ConfirmPanel'
import ShortcutPanel from './calendar/ShortcutPanel'
import AnimateWrapper from './calendar/AnimateWrapper'
import Header from './calendar/Header'
import { Models } from './date/DataTypes'
import PropsType from './CalendarProps'

import { mergeDateTime, formatDate } from './util'

import defaultLocale from './locale/zh_CN'

export type ExtraData = Models.ExtraData
export { PropsType }

export class StateType {
  today?: boolean = false
  showTimePicker?: boolean = false
  showDate?: Date = undefined
  headerTitle?: string
  startDate?: Date = undefined
  endDate?: Date = undefined
  disConfirmBtn?: boolean = true
  clientHight?: number = 0
}
export default class Calendar extends React.PureComponent<
  PropsType,
  StateType
> {
  public static DefaultHeader = Header
  public static DefaultShortcut = ShortcutPanel

  datePicker: any

  static defaultProps = {
    visible: false,
    showHeader: true,
    locale: defaultLocale,
    showShortcut: false,
    prefixCls: 'rmc-calendar',
    type: 'one',
    defaultTimeValue: new Date(),
  } as PropsType

  constructor(props: PropsType) {
    super(props)

    this.state = new StateType()
    if (props.value || props.defaultValue) {
      const { locale } = props
      const value = props.value || props.defaultValue
      this.state = {
        ...this.state,
        ...this.selectDate(
          value[1],
          true,
          { startDate: value[0], showDate: value[0], headerTitle: formatDate(value[0], locale ? locale.monthTitle : 'yyyy/MM', locale), today: false },
          props,
        ),
      }
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (!this.props.visible && nextProps.visible && (nextProps.value || nextProps.defaultValue)) {
      const value = nextProps.value || nextProps.defaultValue
      this.shortcutSelect(
        value[0],
        value[1],
        nextProps,
      )
    }
  }

  selectDate = (
    date: Date,
    useDateTime = false,
    oldState: { startDate?: Date; endDate?: Date, showDate?: Date } = {},
    props = this.props,
  ) => {
    if (!date) return {} as StateType
    let newState = {} as StateType
    const {
      type,
      defaultTimeValue,
      locale = {} as Models.Locale,
    } = props
    const newDate = !useDateTime ? mergeDateTime(date, defaultTimeValue) : date
    const { startDate, endDate } = oldState

    switch (type) {
      case 'one':
        newState = {
          ...newState,
          startDate: newDate,
          showDate: newDate,
          disConfirmBtn: false,
        }
        break

      case 'range':
        if (!startDate || endDate) {
          newState = {
            ...newState,
            startDate: newDate,
            endDate: undefined,
            showDate: newDate,
            disConfirmBtn: true,
          }
        } else {
          newState = {
            ...newState,
            disConfirmBtn: false,
            endDate:
              !useDateTime && +newDate >= +startDate
                ? new Date(+mergeDateTime(newDate, startDate) + 3600000)
                : newDate,
          }
        }
        break
    }
    return newState
  };

  onSelectedDate = (date: Date) => {
    const { startDate, endDate } = this.state
    const { onSelect } = this.props
    onSelect && onSelect(date, [startDate, endDate])
    this.setState(this.selectDate(date, false, { startDate, endDate }))
  }

  onSelectMonth = () => {
    this.setState({
      showTimePicker: true,
    })
  }

  onClose = () => {
    this.setState(new StateType())
  };

  onCancel = () => {
    this.props.onCancel && this.props.onCancel()
    this.onClose()
  };

  onOk = () => {
    const { onOk } = this.props
    const { startDate, endDate } = this.state
    if (startDate && endDate && +startDate > +endDate) {
      return onOk && onOk(endDate, startDate)
    }
    onOk && onOk(startDate, endDate)
    this.onClose()
  }

  onTimeOk = (date: Date) => {
    const { locale } = this.props
    this.setState({
      showTimePicker: false,
      showDate: date,
      headerTitle: formatDate(date, locale ? locale.monthTitle : 'yyyy/MM', locale),
    })
  }

  onTimeCancel = () => {
    this.setState({
      showTimePicker: false,
    })
  }

  onChangeShowDateInfo = (showDate = new Date(), headerTitle = '') => {
    this.setState({ showDate, headerTitle })
  }

  onComeToday = () => {
    console.log(this.datePicker)
    this.setState({ showDate: new Date(), today: true }, () => {
      this.setState({ today: false })
    })
  }

  onClear = () => {
    this.setState({
      startDate: undefined,
      endDate: undefined,
      showTimePicker: false,
      showDate: new Date(),
    })
    this.props.onClear && this.props.onClear()
  };

  shortcutSelect = (startDate: Date, endDate: Date, props = this.props) => {
    this.setState({
      startDate,
      headerTitle: formatDate(startDate, props.locale ? props.locale.monthTitle : 'yyyy/MM', props.locale),
      ...this.selectDate(endDate, true, { startDate }, props),
      showTimePicker: false,
    })
  };

  setClientHeight = (height: number) => {
    this.setState({
      clientHight: height,
    })
  };

  render() {
    const {
      type,
      locale = {} as Models.Locale,
      prefixCls,
      visible,
      showShortcut,
      renderHeader,
      infiniteOpt,
      initalMonths,
      validRange = [],
      disabledDate,
      renderDateCellExtra,
      renderDateFullCell,
      renderShortcut,
      timePickerPrefixCls,
      timePickerPickerPrefixCls,
      style,
      title,
      firstDayOfMonth,
      firstDayOfWeek,
    } = this.props
    const {
      today,
      showTimePicker,
      startDate,
      endDate,
      showDate,
      headerTitle,
      disConfirmBtn,
      clientHight,
    } = this.state

    const headerProps = {
      locale,
      showDate,
      headerTitle,
      showClear: !!startDate,
      onClear: this.onClear,
      onComeToday: this.onComeToday,
      onSelectMonth: this.onSelectMonth,
    }

    return (
      <div className={`${prefixCls}`} style={style}>
        <Animate showProp="visible" transitionName="fade">
          <AnimateWrapper className="mask" visible={!!visible} />
        </Animate>
        <Animate showProp="visible" transitionName="slideV">
          <AnimateWrapper className="content" visible={!!visible && !showTimePicker}>
            {renderHeader ? (
              renderHeader(headerProps)
            ) : (
              <Header {...headerProps} />
            )}
            {
              !today
                ? <DatePicker
                  ref={(node) => (this.datePicker = node)}
                  locale={locale}
                  type={type}
                  prefixCls={prefixCls}
                  infiniteOpt={infiniteOpt}
                  initalMonths={initalMonths}
                  defaultDate={showDate}
                  minDate={validRange[0]}
                  maxDate={validRange[1]}
                  onLayout={this.setClientHeight}
                  startDate={startDate}
                  endDate={endDate}
                  firstDayOfMonth={firstDayOfMonth}
                  firstDayOfWeek={firstDayOfWeek}
                  disabledDate={disabledDate}
                  renderDateCellExtra={renderDateCellExtra}
                  renderDateFullCell={renderDateFullCell}
                  onChangeShowDateInfo={this.onChangeShowDateInfo}
                  onCellClick={this.onSelectedDate}
                /> : null
            }
            {showShortcut &&
              !showTimePicker &&
              (renderShortcut ? (
                renderShortcut(this.shortcutSelect)
              ) : (
                <ShortcutPanel locale={locale} onSelect={this.shortcutSelect} />
              ))}
            <ConfirmPanel
              type={type}
              locale={locale}
              startDateTime={startDate}
              endDateTime={endDate}
              onOk={this.onOk}
              onCancel={this.onCancel}
              disableBtn={disConfirmBtn}
              formatStr={locale.dateFormat}
            />
          </AnimateWrapper>
        </Animate>
        <Animate showProp="visible" transitionName="slideV">
          <AnimateWrapper className="picker" visible={!!showTimePicker}>
            <TimePicker
              prefixCls={timePickerPrefixCls}
              pickerPrefixCls={timePickerPickerPrefixCls}
              locale={locale}
              title={title}
              defaultValue={showDate}
              minDate={validRange[0]}
              maxDate={validRange[1]}
              clientHeight={clientHight}
              onTimeOk={this.onTimeOk}
              onCancel={this.onTimeCancel}
            />
          </AnimateWrapper>
        </Animate>
      </div>
    )
  }
}
