import * as React from 'react'
import { Models } from '../date/DataTypes'

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
        <div className="come-today" onClick={this.onComeToday}>今天</div>
        <span className="title" onClick={this.onSelectMonth}>{headerTitle || locale.title}</span>
        <span
          className="right"
          onClick={() => onClear && onClear()}
        >
          {showClear && (clearIcon || locale.clear)}
        </span>
      </div>
    )
  }
}
