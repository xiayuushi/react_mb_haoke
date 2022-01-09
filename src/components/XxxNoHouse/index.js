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
  children: PropTypes.string.isRequired
}

export default XxxNoHouse