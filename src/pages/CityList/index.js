import { Component, createRef } from 'react'
import { NavBar, Toast } from 'antd-mobile'
import { getCurrentCity } from '../../utils/citydata'
import { List, AutoSizer } from 'react-virtualized'
import styles from './index.module.scss'

const TITLE_HEIGHT = 20 
const CITY_HEIGHT = 40

const processCityData = (cityList) => {
  const cityListData = {}

  cityList.forEach(item => {
    const first = item.short.substring(0, 1)
    cityListData[first]
    ? cityListData[first].push(item)
    : cityListData[first] = [item]
  })

  const cityIndexList = Object.keys(cityListData).sort()

  return {
    cityListData,
    cityIndexList
  }
}

class CityList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cityListData: {},
      cityIndexList: [],
      activeIndex: 0
    }
    this.listComponentRef = createRef()
  }

  getCityList = async (level = 1) => {
    const { body } = await this.$request('/area/city', 'get', { level })
    const { cityListData, cityIndexList } = processCityData(body)
    const { body: hotCityList } = await this.$request('/area/hot')

    cityListData['hot'] = hotCityList
    cityIndexList.unshift('hot')

    const currentCity = await getCurrentCity()
    cityListData['#'] = [currentCity]
    cityIndexList.unshift('#')

    this.setState(() => ({
      cityListData,
      cityIndexList
    }))
  }

  rowRenderer = ({ key, index, isScrolling,  isVisible,  style }) => {
    const letter = this.state.cityIndexList[index]
    const format = (letter) => {
      switch (letter) {
        case '#':
          return '当前城市'
        case 'hot':
          return '热门城市'
        default:
          return letter.toUpperCase()
      }
    }
    const changeCity = (currentChangeCityData) => {
      const hasHouseCityList = ['北京', '上海', '广州', '深圳']
      if (!hasHouseCityList.includes(currentChangeCityData.label)) {
        return Toast.offline('当前城市暂无房源', 1, null, true)
      }
      localStorage.setItem('hkzf_city', JSON.stringify(currentChangeCityData))
      this.props.history.go(-1)
    }
    return (
      <div className={ styles['row'] } key={key} style={style}>
        <div className={ styles['title'] }>{ format(letter) }</div>
        {
          this.state.cityListData[letter].map(v => 
            (<div className={ styles['city'] } key={ v.value } onClick={ () => changeCity(v) }>{ v.label }</div>)
          )
        }
      </div>
    )
  }

  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState(() => ({ activeIndex: startIndex }))
    }
  }

  rowHeight = ({ index }) => {
    const { cityListData, cityIndexList } = this.state
    return TITLE_HEIGHT + CITY_HEIGHT * cityListData[cityIndexList[index]].length
  }

  renderRightIndex = () => {
    const rightIndexClickHandler = (i) => {
      this.listComponentRef.current.scrollToRow(i)
    }
    return (
      this.state.cityIndexList.map((v, i) => (
        <li className={ styles['li'] } key={ v } onClick={ () => rightIndexClickHandler(i) }>
          <span className={ i === this.state.activeIndex ? styles['active'] : '' }>
            { v === 'hot' ? '热' : v.toUpperCase() }
          </span>
        </li>
      ))
    )
  }

  async componentDidMount () {
    await this.getCityList()
    this.listComponentRef.current.measureAllRows()
  }

  render () {
    return (
      <div className={ styles['city-list-container'] }>

        {/* 顶部导航栏 */}
        <NavBar
          className={ styles['navbar'] }
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >城市选择</NavBar>

        {/* 内容区 左侧城市列表 */}
        <AutoSizer>
        {({ width, height }) => (
          <List
            width={ width }
            height={ height }
            rowCount={ this.state.cityIndexList.length }
            rowHeight={ this.rowHeight }
            rowRenderer={ this.rowRenderer }
            onRowsRendered={ this.onRowsRendered }
            scrollToAlignment='start'
            ref={ this.listComponentRef }
          />)
        }
        </AutoSizer> 

        {/* 内容区 右侧字母 */}
        <ul className={ styles['ul'] }>
          { this.renderRightIndex() }
        </ul>
      </div>
    )
  }
}

export default CityList

// 1、接口返回的原始数据不能直接用于渲染
// 1、原始数据格式： [{label: "北京", pinyin: "beijing", short: "bj", value…},{...},...]
// 1、需要处理成两个部分cityListData与cityIndexList.分别用于渲染城市列表与城市对应的索引
// 2、渲染左侧城市列表需要的数据  cityListData
// 2、格式: {a:[{},..], b:[{label: "北京", pinyin: "beijing", short: "bj", value…},,{},..], ...}
// 3、渲染右侧城市索引需要的数据 cityIndexList
// 3、格式： [a', 'b', ...]

// 4、整体思路：
// 4、1 遍历城市列表，通过每一项的short（城市名简写字母）使用String.substring()获取每一项的城市首字母，该首字母作为cityListData对象的字段名
// 4、2 将首字母作为对象cityListData的字段名，
// 4、2 Q1：如果cityListData中存在该字段，则说明以该字母开头的城市列表数组已存在，则可以将遍历出的数据push到该字段的值数组中
// 4、2 Q2：如果cityListData中不存在该字段，则说明以该字段开头的数城市列表数组不存在，需要定义一个空数组来初始化该字段，并将遍历的数据添加进去（该操作只会有一次）
// 5、ES6对象解构：const { xxx: abc } = obj 表示将obj.xxx解构出来赋值给变量abc 
// 6、cityListData['hot'] = result 表示往对象cityListData添加一个hot字段，值result是一个数组
// 7、cityIndexList.unshift('hot') 表示往数组前面插入一个'hot'字段，作为cityListData['hot']的索引
// 8、cityIndexList数组与cityListData对象是对应的关系，通过数组索引可以查询到对象中对应的数据
// 9、react-virtualized适用于可视区加载，通过可视区来加载数据比懒加载性能要高，适用于大量数据的列表或者表格组件，它比懒加载更加高性能的地方是在于它不会操作多余的dom

// 10、react-virtualized的使用流程
// 10、st1 安装react-virtualized
// 10、st2 将react-virtualized的样式导入到入口（导入一次，后续不需要在使用组件的地方再次导入）
// 10、st3 在需要使用react-virtualized组件的地方导入相应的使用到的组件（例如List、AutoSizer等）

// N1、react-virtualized中的List组件就是用于渲染的列表组件，它有5个必选属性width、height、rowCount、rowHeight、rowRenderer
// N2、react-virtualized中的List组件需要与AutoSizer高阶组件配合使用（AutoSizer用于做List组件与页面容器的自适应）
// N3、List组件必选属性width（整体宽度）、height（整体高度）、rowCount（行数）、rowHeight（每行行高）、rowRenderer（渲染出的遍历的内容，值是一个函数，函数返回JSX结构）
// N4、List组件属性width（整体宽度）取决于AutoSizer组件获取的页面容器宽度、height（整体高度）取决于AutoSizer组件获取的页面容器高度
// N4、List组件属性rowCount（行数）取决于遍历数组的长度、rowHeight（每行行高）需要根据内容进行计算，通常不会直接写成数值类型，而是需要定义为函数进行计算
// N4、List组件属性rowHeight如果值是函数时，其自带一个参数对象，可从参数对象中解构出index用于记录当前行的索引
// N4、城市列表行高 = 固定的数量1个标题 + 不固定的数量的若干城市名（即 rowheight= 标体高度 + 单个城市高度 * 城市数量 ）
// N4、List组件属性onRowsRendered的值是一个回调函数，形参对象可以获取List组件渲染行的相关的信息，可以解构出对象中的startIndex（起始索引，List组件可视区最顶部那一行的索引）与右侧字母索引建立联系
// N4、List组件属性onRowsRendered的回调中可以实现滚动城市列表时让右侧对应的字母高亮
// N5、AutoSizer是个高阶组件，内部使用到了render-props模式，可以通过解构width与height的方式将获取到的页面容器宽高设置给List组件的整体宽高，让List组件整体宽高与容器做适配
// N6、因为rowRenderer需要使用到类组件state状态中的数据，因此必须将其从类组件外部移到类组件内部，这样子才能使用类组件state中的数据
// N7、react-virtualized的List实例化方法（Public Methods）中的各个方法，必须通过List组件实例去调用，因此必须先获取List组件实例（即，上面的listComponentRef）
// N8、react-virtualized的List实例化方法measureAllRows()在使用时报错：Uncaught Error: Requested index -1 is outside of range 0..0
// N8、原因是获取List渲染数据的this.getCityList()是异步的，而同步的measureAllRows()先执行时，数据还未拿到，因此报错索引范围不正确
// N8、解决方法：只需要等this.getCityList()拿到数据后再执行react-virtualized的List组件的实例化方法measureAllRows()即可
// N9、List组件的实例方法必须通过组件实例点出来，因此必须获取到List组件实例
// N10、List组件的实例方法scrollToRow(index)用于滚动到指定的行，该方法生效的前提是必须是预览过的行
// N10、List组件的实例方法measureAllRows()用于提前预览所有List组件的渲染行，会与scrollToRow(index)搭配使用，实现点击右侧字母索引时滚动到List组件对应的行
// N10、List组件属性scrollToAlignment用于设置滚动行的对齐方式，'start'表示指定List组件中的行出现在可视区的最上方（当点击右侧字母索引时，对应的List行会滚动到可视区最上方）


