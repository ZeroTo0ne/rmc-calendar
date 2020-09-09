/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import '../assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { RMCCalendar, CellData, CalendarPropsType } from '../src';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
const en = location.search.indexOf('en') !== -1;
const now = new Date();

class BasicDemo extends React.Component<{}, {
  show: boolean;
  config?: CalendarPropsType;
  startTime?: Date;
  endTime?: Date;
}> {

  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      config: {},
    };
  }

  renderDateFullCell = (data: CellData) => {
    if (!data.tick) return null;
    let style = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 53,
      height: 62,
      flexShink: 0,
      color: '#068EEF',
      fontWeight: 'bold',
      fontSize: 18
    } as React.CSSProperties

    if (data.selected) {
      style = {...style, width: 45, height: 45, color: '#000', border: '2px solid #000'}
    }

    return (<div style={style}>{data.dayOfMonth}</div>)
  }

  renderBtn(text: string, text2: string, config: CalendarPropsType = {}) {
    return <div style={{ background: '#1A7BE6', padding: 5, margin: 10, textAlign: 'center' }}
      onClick={() => {
        this.setState({
          show: true,
          config,
        });
      }}>
      <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text}</p>
      <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text2}</p>
    </div>;
  }

  renderDateCellExtra = (date: Date) => {
    if (date.getDay() === 6) return { superscrip: '班' }
    if (date.getDay() === 1) return { info: '调休' }
  };

  disabledDate = (date: Date) => {
    const disableStart = new Date(+now + 2 * 24 * 3600 * 1000);
    const disableEnd = new Date(+now + 4 * 24 * 3600 * 1000);
    if (date > disableStart && date < disableEnd) return true;
    return false
  }

  render() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }} >
        {this.renderBtn('选择日期', 'Select Date')}
        {this.renderBtn('选择日期区间', 'Select Date Range', { type: 'range' })}
        {this.renderBtn('默认选择范围', 'Selected Date Range', { type: 'range', value: [new Date(+new Date - 1 * 24 * 3600 * 1000), new Date(+new Date - 4 * 24 * 3600 * 1000)] })}
        {this.renderBtn('无限滚动优化', 'infinity scroll', { infinite: true })}
        {this.renderBtn('月起始和周起始', 'Select Start Date', { firstDayOfMonth: 21, firstDayOfWeek: 1 })}
        {this.renderBtn('设置不可选日期', 'Set Disabled Date', { disabledDate: this.disabledDate })}
        {this.renderBtn('设置日期角标和底部信息', 'Set Superscrip and Info', { renderDateCellExtra: this.renderDateCellExtra })}
        {this.renderBtn('自定义单元格', 'cell render by youself', { renderDateFullCell: this.renderDateFullCell })}
        {this.renderBtn('onSelectAPI', 'onSelectAPI', {
          onSelect: (date) => {
            console.log('onSelect', date);
            return [date, new Date(+new Date - 7 * 24 * 3600 * 1000)];
          }
        })}
        <div style={{ marginLeft: 10, fontSize: 14 }}>
          {
            this.state.startTime &&
            <p>开始时间：{this.state.startTime.toLocaleString()}</p>
          }
          {
            this.state.endTime &&
            <p>结束时间：{this.state.endTime.toLocaleString()}</p>
          }
        </div>
        <RMCCalendar
          locale={en ? enUS : zhCN}
          {...this.state.config}
          visible={this.state.show}
          onCancel={() => {
            this.setState({
              show: false,
              startTime: undefined,
              endTime: undefined,
            });
          }}
          onOk={(startTime: Date, endTime) => {
            console.log('onConfirm', startTime, endTime);
            this.setState({
              show: false,
              startTime,
              endTime
            });
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<BasicDemo />, document.getElementById('__react-content'));
