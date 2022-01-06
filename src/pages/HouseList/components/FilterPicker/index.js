import { Component } from 'react'
import { PickerView } from 'antd-mobile'
import XxxFilterFooter from '../../../../components/XxxFilterFooter'

class FilterPicker extends Component {
  state = {
    value: this.props.currentTypeSelectedVal,
  }
  render () {
    return (
      <>
      {/* 选择器 */}
        <PickerView
          value={ this.state.value }
          data={ this.props.data }
          cols={ this.props.cols } 
          onChange={ val => { this.setState(() => ({ value: val })) } } 
        />

        {/* 底部按钮 */}
        <XxxFilterFooter
          onCancel={ this.props.onCancel }
          onSure={ () => this.props.onSure(this.props.type, this.state.value) } 
        />
      </>
    )
  }
}

export default FilterPicker

// 1、<></>是React.Fragment的语法糖，作用是不用添加额外元素，用于返回多个节点
// 2、当前组件之所以在使用state与props数据时不进行ES6语法简化，是为了便于直观查看数据，省去写多余的注释
// 3、PickerView组件提供onChange事件，事件回调形参就是pickerView组件选择的值
// 4、因为前三个筛选值都是同一个pickerView组件控制，因此也应该将筛选数据（选中项的值集合）进行状态提升，放到它们的公共父组件中去定义
// 5、this.props.xxx 其中xxx是组件中定义的属性或者方法，组件内部使用必须通过this.props点出
