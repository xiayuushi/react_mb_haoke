import { Flex } from 'antd-mobile'
import styles from './index.module.scss'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

const FilterTitle = ({ titleSelectedStatus, onTitleClick }) => {
  return (
    <Flex className={ styles['filter-title'] } align="center">
      {
        titleList.map(item => {
          const isSelected = titleSelectedStatus[item.type]
          return (
            <Flex.Item key={ item.type } onClick={ () => onTitleClick(item.type) }>
              <div className={ [styles['dropdown'], isSelected ? styles['selected'] : ''].join(' ') }>
                <span>{ item.title }</span>
                <i className="iconfont icon-arrow" />
              </div>
            </Flex.Item>
          )
        })
      }
    </Flex>
  )
}

export default FilterTitle
