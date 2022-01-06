import { Component } from 'react'
import XxxFilterFooter from '../../../../components/XxxFilterFooter'
import styles from './index.module.scss'

class FilterMore extends Component {
  renderFilters = (list) => {
    return list.map(item => {
      return (
        <span className={ [styles['tag'], styles['tag-active']].join(' ') } key={ item.value }>{ item.label }</span>
      )
    })
  }

  render () {
    const { data: { characteristic, floor, oriented, roomType } } = this.props
    return (
      <div className={ styles['filter-more-container'] }>
        {/* 遮罩层 */}
        <div className={ styles['mask'] } onClick={ this.props.onCancel }></div>

        {/* 条件内容 */}
        <div className={ styles['content'] }>
          <dl className={ styles['dl'] }>
            <dt className={ styles['dt'] }>户型</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters(roomType) }</dd>

            <dt className={ styles['dt'] }>朝向</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters(oriented) }</dd>

            <dt className={ styles['dt'] }>楼层</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters(floor) }</dd>

            <dt className={ styles['dt'] }>房屋亮点</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters(characteristic) }</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <XxxFilterFooter className={ styles['footer'] } onCancel={ this.props.onCancel } onSure={ this.props.onSure } />
      </div>
    )
  }
}

export default FilterMore