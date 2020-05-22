import * as React from 'react'
import { formatDate } from '../util'
import { Models } from '../date/DataTypes'

export interface ConfirmPanelPropsType {
  type?: 'one' | 'range';
  locale: Models.Locale;
  onlyConfirm?: boolean;
  disableBtn?: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
  formatStr?: string;
  onOk: () => void;
  onCancel: () => void;
}
export default class ConfirmPanel extends React.PureComponent<ConfirmPanelPropsType, {}> {
  static defaultProps = {
    formatStr: 'yyyy-MM-dd hh:mm',
  } as ConfirmPanelPropsType

  onOk = () => {
    const { onOk, disableBtn } = this.props
    !disableBtn && onOk()
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  formatDate(date: Date) {
    const { formatStr = '', locale } = this.props
    return formatDate(date, formatStr, locale)
  }

  render() {
    const { type, locale, disableBtn } = this.props
    let { startDateTime, endDateTime } = this.props
    if (startDateTime && endDateTime && +startDateTime > +endDateTime) {
      const tmp = startDateTime
      startDateTime = endDateTime
      endDateTime = tmp
    }

    const startTimeStr = startDateTime ? this.formatDate(startDateTime) : locale.noChoose
    const endTimeStr = endDateTime ? this.formatDate(endDateTime) : locale.noChoose
    let btnCls = disableBtn ? 'button button-disable' : 'button confirm'
    let btnCancelCls = 'button'
    if (type === 'one') {
      btnCls += ' button-full'
      btnCancelCls += ' button-full'
    }

    return (
      <div className="confirm-panel">
        {
          type === 'range' &&
          <div className="info">
            <p>{locale.start}: <span className={!startDateTime ? 'grey' : ''}>{startTimeStr}</span></p>
            <p>{locale.end}: <span className={!endDateTime ? 'grey' : ''}>{endTimeStr}</span></p>
          </div>
        }
        <div className={btnCancelCls} onClick={this.onCancel}>
          {locale.cancel}
        </div>
        <div className={btnCls} onClick={this.onOk}>
          {locale.confirm}
        </div>
      </div>
    )
  }
}
