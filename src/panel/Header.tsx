import * as React from 'react'
import { Models } from './DataTypes'

export interface PropsType {
  headerTitle?: string;
  locale?: Models.Locale;
  showClear?: boolean;
  onClear?: () => void;
  onComeToday?: () => void;
  onSelectMonth?: () => void;
  clearIcon?: React.ReactNode;
}

export default class Header extends React.PureComponent<PropsType, {}> {
  onComeToday = () => {
    const { onComeToday } = this.props
    onComeToday && onComeToday()
  }

  onSelectMonth = () => {
    const { onSelectMonth } = this.props
    onSelectMonth && onSelectMonth()
  }

  render() {
    const {
      headerTitle,
      locale = {} as Models.Locale,
      onClear,
      showClear,
      clearIcon,
    } = this.props

    return (
      <div className="header">
        <span
          className="left"
          onClick={() => onClear && onClear()}
        >
          {showClear && (clearIcon || locale.clear)}
        </span>
        <span className="title" onClick={this.onSelectMonth}>{headerTitle || locale.title}</span>
        <div className="come-today" onClick={this.onComeToday}>{locale.today}</div>
      </div>
    )
  }
}
