import { Component } from 'react'
import { NavBar } from 'antd-mobile'
import { getCurrentCity } from '../../utils/citydata'
import styles from './index.module.scss'

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
    const { body: result } = await this.$request('/area/hot')

    cityListData['hot'] = result
    cityIndexList.unshift('hot')

    const { label: currentCityName } = await getCurrentCity()
    console.log(currentCityName)
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
