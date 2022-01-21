import PropTypes from 'prop-types'
import styles from './index.module.scss'

const XxxNoHouse = ({ children }) => {
  return (
    <div className={ styles['xxx-no-house'] }>
      <img className={ styles['img'] } src={ process.env.REACT_APP_URL + '/img/not-found.png' } alt="暂无数据" />
      <p className={ styles['msg'] }>{ children }</p>
    </div>
  )
}

XxxNoHouse.propTypes = {
  children: PropTypes.node.isRequired
}

export default XxxNoHouse

// 1、children: PropTypes.string.isRequired 改成 children: PropTypes.node.isRequired
// -、前者是children只能传入字符串
// -、后者是children可以传入任意可以渲染的内容
// 2、之所以这么改是为了更好的复用该组件，后续在使用时可以传入更复杂的节点形式（而不是局限于只能传入字符串）
