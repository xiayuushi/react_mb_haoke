import { Component } from 'react'
import XxxFilterFooter from '../../../../components/XxxFilterFooter'
import styles from './index.module.scss'

class FilterMore extends Component {
  state = {
    selectedValsList: this.props.defaultSelectedValsList
  }

  onTagClick = (value) => {
    const { selectedValsList } = this.state
    const newSelectedValsList = [...selectedValsList]
    if (newSelectedValsList.includes(value)) {
      const index = newSelectedValsList.findIndex(item => item === value)
      newSelectedValsList.splice(index, 1)
    } else {
      newSelectedValsList.push(value)
    }
    this.setState({ selectedValsList: newSelectedValsList })
  }

  onClear = () => {
    this.setState(() => ({selectedValsList: []}))
  }

  onSure = () => {
    const { type, onSure } = this.props
    const { selectedValsList } = this.state
    onSure(type, selectedValsList)
  }

  renderFilters = (list) => {
    const { selectedValsList } = this.state
    return list.map(item => {
      const isSelected = selectedValsList.includes(item.value)
      return (
        <span className={ [styles['tag'], isSelected ? styles['tag-active'] : ' '].join(' ') } key={ item.value } onClick={ () => this.onTagClick(item.value) }>{ item.label }</span>
      )
    })
  }

  render () {
    const { data: { characteristic, floor, oriented, roomType }, onCancel } = this.props
    return (
      <div className={ styles['filter-more-container'] }>
        {/* 遮罩层 */}
        <div className={ styles['mask'] } onClick={ onCancel }></div>

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
        <XxxFilterFooter 
          className={ styles['footer'] }
          onCancel={ this.onClear }
          onSure={ this.onSure }
          cancelText="清除"
        />
      </div>
    )
  }
}

export default FilterMore