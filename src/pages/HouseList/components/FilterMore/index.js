import { Component } from 'react'
import XxxFilterFooter from '../../../../components/XxxFilterFooter'
import styles from './index.module.scss'

class FilterMore extends Component {
  renderFilters = () => {
    return (
      <span className={ [styles['tag'], styles['tag-active']].join(' ') }>2居</span>
    )
  }

  render () {
    return (
      <div className={ styles['filter-more-container'] }>
        {/* 遮罩层 */}
        <div className={ styles['mask'] } onClick={ this.props.onCancel }></div>

        {/* 条件内容 */}
        <div className={ styles['content'] }>
          <dl className={ styles['dl'] }>
            <dt className={ styles['dt'] }>户型</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters() }</dd>

            <dt className={ styles['dt'] }>户型</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters() }</dd>

            <dt className={ styles['dt'] }>户型</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters() }</dd>

            <dt className={ styles['dt'] }>户型</dt>
            <dd className={ styles['dd'] }>{ this.renderFilters() }</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <XxxFilterFooter className={ styles['footer'] } onCancel={ this.props.onCancel } onSure={ this.props.onSure } />
      </div>
    )
  }
}

export default FilterMore