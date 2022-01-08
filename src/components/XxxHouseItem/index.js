import styles from './index.module.scss'
import PropTypes from 'prop-types'

const XxxHouseItem = ({ src, title, desc, tags, price, onClick, style }) => {
  return (
    <div className={ styles['item'] } onClick={ onClick } style={ style }>
      <img src={ src } alt="" />
      <div className={ styles['content'] }>
      <h1 className={ styles['title'] }>{ title }</h1>
      <div className={ styles['desc'] }>{ desc }</div>
        <div className={ styles['tags'] }>
          {
            tags.map((v, i) => {
            const className = 'tag' + (i + 1)
            return (
              <span className={ styles[className] } key={ v }>{ v }</span>
            )
            })
          }
        </div>
        <div className={ styles['price'] }>{ price }<span>元/月</span></div>
      </div>
    </div>
  )
}

XxxHouseItem.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  price: PropTypes.number,
  onClick: PropTypes.func,
  tags: PropTypes.array.isRequired,
}

export default XxxHouseItem
