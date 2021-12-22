import { Component } from 'react'
import { NavBar } from 'antd-mobile'
import { getCurrentCity } from '../../utils/citydata'
import { List, AutoSizer } from 'react-virtualized'
import styles from './index.module.scss'

const list = Array(100).fill('测试')

const rowRenderer = ({ key, index, isScrolling,  isVisible,  style, }) => {
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  )
}

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
  state = {
    cityList: []
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
  }
  componentDidMount () {
    this.getCityList()
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

        {/* 内容区 */}
        <AutoSizer>
        {({ width, height }) => (
          <List
            width={ width }
            height={ height }
            rowCount={ list.length }
            rowHeight={ 20 }
            rowRenderer={ rowRenderer }
         />)
        }
        </AutoSizer> 
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
// N3、List组件必选属性width（每行宽度）、height（每行高度）、rowCount（行数）、rowHeight（每行行高）、rowRenderer（渲染出的遍历的内容，值是一个函数，函数返回JSX结构）
// N4、AutoSizer是个高阶组件，内部使用到了render-props模式，可以通过解构width与height的方式将获取到的页面容器宽高设置给List组件的整体宽高，让List组件整体宽高与容器做适配
