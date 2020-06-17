import React from 'react'
import Animate from 'rc-animate';

import DatePicker from './DatePicker'
import CalendarPanel from './panel/CalendarPanel'
import ConfirmPanel from './panel/ConfirmPanel'
import AnimateWrapper from './panel/AnimateWrapper'
import Header from './panel/Header'
import { Models } from './panel/DataTypes'
import PropsType from './CalendarProps'

import { mergeDateTime, formatDate } from './util'

import defaultLocale from './locale/zh_CN'

export type ExtraData = Models.ExtraData
export type CellData = Models.CellData

// 用于保存body元素的位置信息, 处理iOS滚动穿透问题
type BodyStyle = {
  position: string
  overflowY: string
  width: string
  height: string
}

export { PropsType }

export class StateType {
  returnToday?: boolean = false
  showDatePicker?: boolean = false
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

  datePicker: any

  bodyElement: HTMLBodyElement | null
  originBodyStyle: BodyStyle

  static defaultProps = {
    visible: false,
    showHeader: true,
    locale: defaultLocale,
    prefixCls: 'rmc-calendar',
    type: 'one',
    value: [],
    validRange: [new Date(1900, 0, 1, 0, 0, 0), new Date(2100, 11, 31, 23, 59, 59)],
    firstDayOfMonth: 1,
  } as PropsType

  constructor(props: PropsType) {
    super(props)

    this.state = new StateType()
    const { locale, firstDayOfMonth = 1 } = props
    const value = props.value || props.defaultValue
    let showDate: Date
    if (value && value.length > 0) {
      showDate = this.getShowDate(value[0], firstDayOfMonth)
      this.state = {
        ...this.state,
        showDate,
        ...this.selectDate(
          value[1],
          { startDate: value[0], headerTitle: formatDate(showDate, locale ? locale.monthTitle : 'yyyy/MM', locale), returnToday: false },
          props,
        ),
      }
    } else {
      showDate = this.getShowDate(new Date(), firstDayOfMonth)
      this.state = {
        ...this.state,
        headerTitle: formatDate(showDate, locale ? locale.monthTitle : 'yyyy/MM', locale),
        showDate
      }
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const { locale, firstDayOfMonth = 1 } = nextProps
    const value = nextProps.value || nextProps.defaultValue
    if(!value) return
    let showDate: Date
    if (value.length > 0) {
      showDate = this.getShowDate(value[0], firstDayOfMonth)
      this.setState({
        startDate: value[0],
        showDate,
        headerTitle: formatDate(showDate, locale ? locale.monthTitle : 'yyyy/MM', locale),
        ...this.selectDate(
          value[1],
          { startDate: value[0], returnToday: false },
          nextProps,
        )
      })
    } else if(value.length === 0) {
      showDate = this.getShowDate(new Date(), firstDayOfMonth)
      this.setState({
        showDate,
        startDate: undefined,
        endDate: undefined,
        headerTitle: formatDate(showDate, locale ? locale.monthTitle : 'yyyy/MM', locale)
      })
    }

    if(this.bodyElement && nextProps.visible) {
      const { position, overflowY, height, width } = this.bodyElement.style
      this.originBodyStyle = { position, overflowY, height, width }
      this.bodyElement.style.position = 'fixed'
      this.bodyElement.style.overflowY = 'hidden'
      this.bodyElement.style.width = '100%'
      this.bodyElement.style.height = '100%'
    }
  }

  componentDidMount() {
    this.bodyElement = document.getElementsByTagName('body')[0]
  }

  componentWillUnmount() {
    if(this.bodyElement) {
      const { position, overflowY, height, width } = this.originBodyStyle
      this.bodyElement.style.position = position
      this.bodyElement.style.overflowY = overflowY
      this.bodyElement.style.width = height
      this.bodyElement.style.height = width
      this.bodyElement = null
    }
  }

  selectDate = (
    date: Date | undefined,
    oldState: { startDate?: Date; endDate?: Date, showDate?: Date, headerTitle?: string, returnToday?: boolean } = {},
    props = this.props,
  ) => {
    if (!date) return {} as StateType
    let newState = {} as StateType
    const {
      type,
    } = props
    const { startDate, endDate } = oldState

    switch (type) {
      case 'one':
        newState = {
          ...newState,
          startDate: date,
          disConfirmBtn: false,
        }
        break

      case 'range':
        if (!startDate || endDate) {
          newState = {
            ...newState,
            startDate: date,
            endDate: undefined,
            disConfirmBtn: true,
          }
        } else {
          newState = {
            ...newState,
            disConfirmBtn: false,
            endDate: date,
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
    this.setState(this.selectDate(date, { startDate, endDate }))
  }

  onSelectMonth = () => {
    this.setState({
      showDatePicker: true,
    })
  }

  onClose = () => {
    this.setState(new StateType(), () => {
      if(this.bodyElement) {
        const { position, overflowY, height, width } = this.originBodyStyle
        this.bodyElement.style.position = position
        this.bodyElement.style.overflowY = overflowY
        this.bodyElement.style.width = height
        this.bodyElement.style.height = width
      }
    })
  };

  onCancel = () => {
    this.props.onCancel && this.props.onCancel()
    this.onClose()
  };

  onOk = () => {
    const { onOk } = this.props
    const { startDate, endDate } = this.state
    if (startDate && endDate && +startDate > +endDate) {
      onOk && onOk(endDate, startDate)
      this.onClose()
      return
    }
    onOk && onOk(startDate, endDate)
    this.onClose()
  }

  onTimeOk = (date: Date) => {
    const { locale } = this.props
    this.setState({
      showDatePicker: false,
      showDate: date,
      headerTitle: formatDate(date, locale ? locale.monthTitle : 'yyyy/MM', locale),
    })
  }

  onTimeCancel = () => {
    this.setState({
      showDatePicker: false,
    })
  }

  onChangeShowDateInfo = (showDate = new Date(), headerTitle = '') => {
    this.setState({ showDate, headerTitle })
  }

  onComeToday = () => {
    const { locale, type, firstDayOfMonth = 1 } = this.props
    const today = new Date()
    const showDate = this.getShowDate(today, firstDayOfMonth)
    this.setState({ 
      showDate,
      startDate: today, 
      endDate: type === 'one' ? undefined : today, 
      returnToday: true, 
      disConfirmBtn: false,
      headerTitle: formatDate(showDate, locale ? locale.monthTitle : 'yyyy/MM', locale)
    }, () => {
      this.setState({ returnToday: false })
    })
  }

  onClear = () => {
    this.setState({
      startDate: undefined,
      endDate: undefined,
      showDatePicker: false,
      showDate: new Date(),
      disConfirmBtn: true
    })
    this.props.onClear && this.props.onClear()
  };

  setClientHeight = (height: number) => {
    this.setState({
      clientHight: height,
    })
  };

  getShowDate = (defaultDate: Date, firstDayOfMonth: number) => {
    const startMonthNum = defaultDate.getMonth()
    const startDateNum = defaultDate.getDate()
    return startDateNum >= firstDayOfMonth ? defaultDate : new Date(defaultDate.getFullYear(), startMonthNum - 1, firstDayOfMonth)
  }

  render() {
    const {
      type,
      locale = {} as Models.Locale,
      prefixCls,
      visible,
      infinite,
      initalMonths,
      validRange = [],
      disabledDate,
      renderDateCellExtra,
      renderDateFullCell,
      datePickerPrefixCls,
      datePickerPickerPrefixCls,
      style,
      title,
      firstDayOfMonth,
      firstDayOfWeek,
    } = this.props
    const {
      returnToday,
      showDatePicker,
      startDate,
      endDate,
      showDate,
      headerTitle,
      disConfirmBtn,
      clientHight,
    } = this.state

    return (
      <div className={`${prefixCls}`} style={style}>
        <Animate showProp="visible" transitionName="fade">
          <AnimateWrapper className="mask" visible={!!visible} onClose={this.onCancel} />
        </Animate>
        <Animate showProp="visible" transitionName="slideV">
          <AnimateWrapper className="content" visible={!!visible && !showDatePicker}>
            <Header
              locale={locale}
              headerTitle={headerTitle}
              showClear={!!startDate}
              onClear={this.onClear}
              onComeToday={this.onComeToday}
              onSelectMonth={this.onSelectMonth}
            />
            {
              !returnToday
                ? <CalendarPanel
                  ref={(node) => (this.datePicker = node)}
                  locale={locale}
                  type={type}
                  prefixCls={prefixCls}
                  infinite={infinite}
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
          <AnimateWrapper className="picker" visible={!!showDatePicker}>
            <DatePicker
              prefixCls={datePickerPrefixCls}
              pickerPrefixCls={datePickerPickerPrefixCls}
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
