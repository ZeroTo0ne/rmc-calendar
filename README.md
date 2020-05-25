# rmc-calendar
---

React Mobile Calendar Component (web)


[![NPM version][npm-image]][npm-url]
![react](https://img.shields.io/badge/react-%3E%3D_15.2.0-green.svg)
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/@gem-mine/rmc-calendar.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@gem-mine/rmc-calendar
[travis-image]: https://img.shields.io/travis/@gem-mine/rmc-calendar.svg?style=flat-square
[travis-url]: https://travis-ci.org/@gem-mine/rmc-calendar
[coveralls-image]: https://img.shields.io/coveralls/@gem-mine/rmc-calendar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/@gem-mine/rmc-calendar?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@gem-mine/rmc-calendar.svg?style=flat-square
[download-url]: https://npmjs.org/package/@gem-mine/rmc-calendar

## Screenshots

<!-- <img src="https://os.alipayobjects.com/rmsportal/fOaDvpIJukLYznc.png" width="288"/> -->


## Development

```
npm i 
npm start
```

## Example

http://localhost:8021/examples/

online example: http://gem-mine.github.io/rmc-calendar/

## install

[![rmc-calendar](https://nodei.co/npm/@gem-mine/rmc-calendar.png)](https://npmjs.org/package/@gem-mine/rmc-calendar)


# docs

## Usage
```jsx
import React, { Component } from 'react';

import { Calendar } from '@gem-mine/rmc-calendar';
import '@gem-mine/rmc-calendar/assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  setVisiable = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <div className="App">
        <Calendar
          visible={this.state.visible}
          onCancel={this.setVisiable}
          onOk={this.setVisiable}
        />
      </div>
    );
  }
}

export default App;
```

## API

### Calendar props
```ts
interface PropsType {
    /** 本地化 */
  locale?: Models.Locale;
  /** 关闭时回调 */
  onCancel?: () => void;
  /** 清除时回调 */
  onClear?: () => void;
  /** 确认时回调 */
  onOk?: (startDateTime?: Date, endDateTime?: Date) => void;
  /** (web only) 样式前缀，default: rmc-calendar */
  prefixCls?: string;
  /** 附加样式名称, default: '' */
  className?: string;
  /** 替换快捷选择栏，需要设置showShortcut: true */
  renderShortcut?: (select: (startDate?: Date, endDate?: Date) => void) => React.ReactNode;
  /** 替换标题栏 */
  renderHeader?: (prop: HeaderPropsType) => React.ReactNode;
  /** 快捷日期选择， default: false */
  showShortcut?: boolean;
  style?: React.CSSProperties;
  /** header title, default: {locale.title} */
  title?: string;
  /** 选择类型，default: range，one: 单日，range: 日期区间 */
  type?: 'one' | 'range';
  /** 是否显示，default: false */
  visible?: boolean;
  /** 选中日期, 开始时间, 结束时间 */
  value?: SelectDateType;
  /** 默认展示，开始时间、结束时间 */
  defaultValue?: SelectDateType;

  // DatePicker
  /** 显示开始日期，default: today */
  defaultDate?: Date;
  /** 自定义内容追加到单元格内 */
  renderDateCellExtra?: (date: Date) => Models.ExtraData,
  /** 自定义内容覆盖单元格 */
  renderDateFullCell?: (date: Date) => React.ReactNode,
  /** 无限滚动优化（大范围选择），default: false */
  infiniteOpt?: boolean;
  /** 初始化月个数，default: 6 */
  initalMonths?: number;
  /** 可显示日期 */
  validRange?: [Date | undefined, Date | undefined];
  /** 不可选日期 */
  disabledDate?: (current: Date) => boolean;
  /** 设置月起始日(1-28)，default: 1 */
  firstDayOfMonth?: number;
  /** 设置周起始日(0-6)，default: 0 */
  firstDayOfWeek?: number;
  /** 选择日期回调，如果有返回值，选择范围将使用返回值 */
  onSelect?: (date: Date, state?: [Date | undefined, Date | undefined]) => SelectDateType | void;
}
```

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-calendar is released under the MIT license.
