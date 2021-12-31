import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

const XxxFilterFooter = ({ sureText = '确定', cancelText = '取消', className, onSure, onCancel }) => {
  return (
    <Flex className={ [styles['xxx-filter-footer'], className || ''].join(' ') } align="center">
      <span className={ styles['cancel'] } onClick={ onCancel }>{ cancelText }</span>
      <span className={ styles['sure'] } onClick={ onSure }>{ sureText }</span>
    </Flex>
  )
}

XxxFilterFooter.propTypes = {
  onSure: PropTypes.func,
  onCancel: PropTypes.func,
  className: PropTypes.string,
  sureText: PropTypes.string,
  cancelText: PropTypes.string
}

export default XxxFilterFooter

// 1、当前组件是封装的全局通用的底部按钮
// 2、在react项目中封装组件时建议使用 prop-types 对组件的数据进行类型检查，提示使用者传入符合要求的数据格式
// -、prop-types导入时变量名称可以随意，但是组件点出的那个属性必须是小写字母开头的propTypes，这个属性是固定写法