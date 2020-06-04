/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import '../assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { RMCCalendar, ExtraData, CellData, CalendarPropsType } from '../src';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
const en = location.search.indexOf('en') !== -1;

const extra: { [key: string]: ExtraData } = {
  1501516800000: { info: '建军节' },
  '2017/06/14': { info: '禁止选择', disable: true },
  '2017/06/15': { info: 'Disable', disable: true },
};

const now = new Date;
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)] = { info: '禁止选择', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)] = { info: 'Disable', disable: true };
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)] = { info: 'Disable', disable: true };

for (let key in extra) {
  if (extra.hasOwnProperty(key)) {
    let info = extra[key];
    const date = new Date(key);
    if (!Number.isNaN(+date) && !extra[+date]) {
      extra[+date] = info;
    }
  }
}

class BasicDemo extends React.Component<{}, {
  show: boolean;
  config?: CalendarPropsType;
  startTime?: Date;
  endTime?: Date;
}> {
  originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;

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
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
        this.setState({
          show: true,
          config,
        });
      }}>
      <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text}</p>
      <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text2}</p>
    </div>;
  }

  render() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }}>
        {this.renderBtn('选择日期', 'Select Date')}
        {this.renderBtn('选择日期区间', 'Select Date Range', { type: 'range' })}
        {this.renderBtn('默认选择范围', 'Selected Date Range', { type: 'range', defaultValue: [new Date(+new Date - 1 * 24 * 3600 * 1000), new Date(+new Date - 4 * 24 * 3600 * 1000)] })}
        {this.renderBtn('无限滚动优化', 'infinity scroll', { infinite: true })}
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
            document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
            this.setState({
              show: false,
              startTime: undefined,
              endTime: undefined,
            });
          }}
          onOk={(startTime: Date) => {
            console.log('onConfirm', startTime);
            document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
            this.setState({
              show: false,
              startTime,
            });
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<BasicDemo />, document.getElementById('__react-content'));
