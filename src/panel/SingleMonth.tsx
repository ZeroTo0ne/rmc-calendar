import * as React from 'react'
import { Models } from './DataTypes'

export interface PropsType {
  locale: Models.Locale;
  monthData: Models.MonthData;
  today?: Date;
  disabledDate?: (current: Date) => boolean;
  renderDateCellExtra?: (date: Date) => Models.ExtraData | void;
  renderDateFullCell?: (data: Models.CellData) => React.ReactNode | void;
  onCellClick?: (data: Models.CellData, monthData: Models.MonthData) => void;
}
export default class SingleMonth extends React.PureComponent<PropsType, {
  weekComponents: React.ReactNode[]
}> {
  public wrapperDivDOM: HTMLDivElement | null;

  constructor(props: PropsType) {
    super(props)

    this.state = {
      weekComponents: [],
    }
  }

  componentWillMount() {
    this.props.monthData.weeks.forEach((week, index) => {
      this.genWeek(week, index)
    })
  }

  genWeek = (weeksData: Models.CellData[], index: number) => {
    const { renderDateCellExtra, renderDateFullCell, monthData, onCellClick, locale, today, disabledDate } = this.props
    this.state.weekComponents[index] = (
      <div key={index} className="row">
        {
          weeksData.map((day, dayOfWeek) => {
            const extra = (renderDateCellExtra && renderDateCellExtra(new Date(day.tick))) || {}
            let info = extra.info
            const superscrip = extra.superscrip
            const disable = extra.disable || day.outOfDate || (disabledDate && disabledDate(new Date(day.tick)))

            let cls = 'date'
            let lCls = 'left'
            let rCls = 'right'
            let infoCls = 'info'
            let superscripCls = 'superscrip'
            superscripCls += extra.superscripCls ? ' ' + extra.superscripCls : ''

            if (disable) {
              cls += ' disable'
            }

            if (today && +today === day.tick) {
              cls += ' today'
            }

            if (day.selected) {
              cls += ' date-selected'
              let styleType = day.selected
              switch (styleType) {
                case Models.SelectType.Only:
                  info = locale.begin
                  infoCls += ' date-selected'
                  superscripCls += ' date-selected'
                  break
                case Models.SelectType.All:
                  info = locale.begin_over
                  infoCls += ' date-selected'
                  superscripCls += ' date-selected'
                  break

                case Models.SelectType.Start:
                  info = locale.begin
                  infoCls += ' date-selected'
                  superscripCls += ' date-selected'
                  if (dayOfWeek === 6 || day.isLastOfMonth) {
                    styleType = Models.SelectType.All
                  }
                  break
                case Models.SelectType.Middle:
                  if (dayOfWeek === 0 || day.isFirstOfMonth) {
                    if (day.isLastOfMonth || dayOfWeek === 6) {
                      styleType = Models.SelectType.All
                    } else {
                      styleType = Models.SelectType.Start
                    }
                  } else if (dayOfWeek === 6 || day.isLastOfMonth) {
                    styleType = Models.SelectType.End
                  }
                  break
                case Models.SelectType.End:
                  info = locale.over
                  infoCls += ' date-selected'
                  superscripCls += ' date-selected'
                  if (dayOfWeek === 0 || day.isFirstOfMonth) {
                    styleType = Models.SelectType.All
                  }
                  break
              }

              switch (styleType) {
                case Models.SelectType.Single:
                case Models.SelectType.Only:
                case Models.SelectType.All:
                  cls += ' selected-single'
                  break
                case Models.SelectType.Start:
                  cls += ' selected-start'
                  rCls += ' date-selected'
                  break
                case Models.SelectType.Middle:
                  cls += ' selected-middle'
                  lCls += ' date-selected'
                  rCls += ' date-selected'
                  break
                case Models.SelectType.End:
                  cls += ' selected-end'
                  lCls += ' date-selected'
                  break
              }
            }

            const defaultContent = [
              <div key="superscrip" className={superscripCls}>{superscrip}</div>,
              <div key="wrapper" className="date-wrapper">
                <span className={lCls} />
                <div className={cls}>
                  {day.dayOfMonth}
                </div>
                <span className={rCls} />
              </div>,
              <div key="info" className={infoCls}>{info}</div>,
              extra.extRender && extra.extRender(new Date(day.tick))
            ]

            return (
              <div key={dayOfWeek} className={`cell ${extra.cellCls || ''}`} onClick={() => {
                !disable && onCellClick && onCellClick(day, monthData)
              }}
              >
                {renderDateFullCell ? renderDateFullCell(day) : defaultContent}
              </div>
            )
          })
        }
      </div>
    )
  }

  updateWeeks = (monthData?: Models.MonthData) => {
    (monthData || this.props.monthData).weeks.forEach((week, index) => {
      this.genWeek(week, index)
    })
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (this.props.monthData !== nextProps.monthData) {
      this.updateWeeks(nextProps.monthData)
    }
  }

  setWarpper = (dom: HTMLDivElement) => {
    this.wrapperDivDOM = dom
  }

  render() {
    const { title } = this.props.monthData
    const { weekComponents } = this.state

    return (
      <div className="single-month" ref={this.setWarpper}>
        <div className="month-title">
          <div className="title-line" />
          <div className="title-space">{title && title[5] === '0' ? title.slice(6) : title.slice(5)}</div>
        </div>
        <div className="date-panel" data-title={title && title[5] === '0' ? title.slice(6, 7) : title.slice(5, 7)}>
          {weekComponents}
        </div>
      </div>
    )
  }
}
