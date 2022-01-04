import { Component } from 'react'
import { PickerView } from 'antd-mobile'
import XxxFilterFooter from '../../../../components/XxxFilterFooter'

class FilterPicker extends Component {
  state = {
    value: null,
  };
  render () {
    return (
      <>
      {/* 选择器 */}
        <PickerView value={ this.state.value } data={ this.props.data } cols={ this.props.cols } />

        {/* 底部按钮 */}
        <XxxFilterFooter onCancel={ this.props.onCancel } onSure={ this.props.onSure } />
      </>
    )
  }
}

export default FilterPicker

// 1、<></>是React.Fragment的语法糖，作用是不用添加额外元素，用于返回多个节点
// 2、当前组件之所以在使用state与props数据时不进行ES6语法简化，是为了便于直观查看数据，省去写多余的注释
