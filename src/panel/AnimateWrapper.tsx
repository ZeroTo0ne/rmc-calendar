import React from 'react'

export interface PropsType {
  visible: boolean;
  className?: string;
  displayType?: string;
  onClose?: () => void;
}
export default class AnimateWrapper extends React.PureComponent<PropsType, {}> {
  static defaultProps = {
    className: '',
    displayType: 'flex',
  } as PropsType

  render() {
    const { className, displayType, visible, onClose } = this.props

    return (
      <div
        className={className + ' animate'}
        style={{ display: visible ? displayType : 'none' }}
        onClick={onClose}
      >
        {visible && this.props.children}
      </div>
    )
  }
}
