import { Component } from 'react'
import { Flex } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import styles from './index.module.scss'
import Filter from './components/Filter'
import XxxHouseItem from '../../components/XxxHouseItem'
import XxxSearchHeader from '../../components/XxxSearchHeader'

const { label, value: cityId } = JSON.parse(localStorage.getItem('hkzf_city'))

class HouseList extends Component {
  state = {
    list: [],
    count: 0
  }

  filtersParams = {}

  onFiltersParams = (filtersParams) => {
    this.filtersParams = filtersParams
    this.getHouseList()
  }

  getHouseList = async() => {
    const { body } = await this.$request('/houses', 'get', { cityId, ...this.filtersParams, start: 1, end: 20 })
    const { list, count } = body
    this.setState(() => ({ list, count }))
  }

  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]
    // 增加判断，防止当数据请求回来不及时，导致undefined取值报错
    if (!item) {
      return (
        <div key={ key } style={ style }>
          <p className={ styles['loading'] }></p>
        </div>
      )
    }
    return (
      // 因为XxxHouseItem是与react-virtualized的List组件配合使用
      // 因此封装XxxHouseItem时，也要考虑接收List组件的style属性
      <XxxHouseItem 
        key={ key }
        style={ style }
        tags={ item.tags }
        desc={ item.desc }
        title={ item.title }
        price={ item.price }
        src={ process.env.REACT_APP_URL + item.houseImg }
      />
    )
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve, reject) => {
      this.$request('/houses', 'get', {
        cityId,
        start: startIndex,
        end: stopIndex,
        ...this.filtersParams
      }).then(res => {
        // 此处是数据拼接，基于this.getHouseList()请求回来的20条数据基础上做数据拼接
        // this.getHouseList()请求回来的20条数据在前，基于它重新请求回来的数据在后（每次10条），新旧数据都需要展开
        // 如果需要更改重新请求回来的数据条数（默认10条），可以在InfiniteLoader中添加minimumBatchSize属性设置新的每次请求条数
        this.setState(state => ({ list: [...state.list, ...res.body.list] }))
        resolve()
      }).catch(err => reject(err))
    })
  }

  componentDidMount () {
    this.getHouseList()
  }

  render () {
    return (
      <div className={ styles['house-list-container'] }>

        {/* 顶部搜索栏 */}
        <Flex className={ styles['top-search'] }>
          <i className="iconfont icon-back" onClick={ () => this.props.history.go(-1) } />
          <XxxSearchHeader currentCityName={ label } className={ styles['xxx-search-header'] } />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter onFiltersParams={ this.onFiltersParams } />

        {/* 房源列表 */}
        <div className={ styles['bottom'] }>
          <InfiniteLoader isRowLoaded={ this.isRowLoaded } loadMoreRows={ this.loadMoreRows } rowCount={ this.state.count } minimumBatchSize={10}>
            {
              ({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {
                    ({ height, isScrolling, scrollTop }) => (
                      <AutoSizer>
                        {
                          ({ width }) => (
                            <List 
                              width={ width }
                              height={ height }
                              rowCount={ this.state.count }  
                              rowHeight={ 120 }
                              rowRenderer={ this.rowRenderer }
                              autoHeight
                              isScrolling={ isScrolling }
                              scrollTop={ scrollTop }
                              onRowsRendered={ onRowsRendered }
                              ref={ registerChild }
                            />
                          )
                        }
                      </AutoSizer>
                    )
                  }
                </WindowScroller>
              )
            }
          </InfiniteLoader>
        </div>
      </div>
    )
  }
}

export default HouseList

// 1、react控制通用组件样式的思路一般有两种
// -、Q1 直接在当前组件定义样式名来作用到通用组件，对通用组件中的样式进行改写或者覆盖
// -、Q2 传入属性的方式来改写通用组件的样式，例如此处在当前组件书写样式并通过给XxxSearchHeader组件定义属性className的方式传入
// -、Q2 （如果是传入属性的方式改写样式，则必须在XxxSearchHeader组件内部props接收该属性并置于其容器原有样式之后，以便进行覆盖样式操作）
// -、Q2 （例如：在XxxSearchHeader组件内部的最外层容器上 className={ [styles['search-wrap'], this.props.className || ''].join(' ') } ）
// 2、onFiltersParams用于接收子组件Filter.js中拼接好的用于获取房屋列表的参数filtersParams，并将该参数绑定到组件this实例中以便组件其他方法中使用
// 3、初始化this.filtersParams是为了避免子组件Filter中如果没有获取到时，而在一进入当前HouseList页面componentDidMount时导致报错 
// 4、List组件自身会有一个滚动条，这个滚动条并非是页面级的，如果要与顶部筛选栏做吸顶效果，则必须将List组件的滚动条转成页面级的滚动条，让其跟随整个页面滚动
// 5、react-virtualized提供WindowScroller这个HOC支持让List跟随页面滚动（该HOC为List提供render-props以便让List的滚动条跟随页面滚动，必须给List组件设置autoHeight属性）
// -、WindowScroller配合List进行使用时，必须在List组件中设置autoHeight属性（List组件只有与WindowScroller配合使用时才需要设置该属性）
// -、使用WindowScroller时，在List组件设置autoHeight属性，可以让List组件适配其外层容器的高度
// -、WindowScroller提供的height属性，可以获取视口的高度（List组件做的是可视区渲染，即出现在视口中的内容才会进行渲染）
// -、WindowScroller提供的isScrolling属性，可以监听页面是否正在滚动，用于覆盖List自身的滚动状态
// -、WindowScroller提供的scrollTop属性，可以监听页面的滚动距离，用于同步List滚动距离
// 6、react-virtualized中的WindowScroller只提供height，没有width属性，因此实现width适应必须使用另一个高阶组件AutoSizer来完成List组件与页面宽度的同步
// 7、List组件的width与height分别用于设置可视区宽高（看的到的区域）
// -、List组件的autoHeight属性是配合WindowScroller使用时才必须的属性，该属性用于设置List组件的高度为WindowScroller最终渲染的列表高度（列表可能的高度包含看不到的部分）
// 8、在使用react-virtualized的InfiniteLoader做无限加载之前，会报错'Cannot read properties of undefined (reading 'tags')'，原因是请求回来的数据一开始只有20条，加载完这20条后没数据导致undefined
// 9、react-virtualized的InfiniteLoader也是一个HOC，用于包裹List组件，当滚动列表时加载更多数据实现无限加载
// -、InfiniteLoader的isRowLoaded属性表示每一行数据是否加载完毕，值是一个回调
// -、InfiniteLoader的loadMoreRows属性表示是否加载更多数据，值是一个回调，再需要加载数据时会调用该函数，该回调返回一个Promise对象
// -、InfiniteLoader的rowCount属性表示列表数据的总条数
// -、InfiniteLoader提供的render-props中onRowsRendered用于设置给List，当List加载时也会触发加载函数
// -、InfiniteLoader提供的render-props中registerChild用于设置给List的ref属性，相当于是绑定子元素
