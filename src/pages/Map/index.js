import { Component } from 'react'
import styles from './index.module.scss'
import XxxNavHeader from '../../components/XxxNavHeader'

class Map extends Component {
  componentDidMount () {
    const map = new window.BMap.Map(styles['map'])
    const myCity = new window.BMap.LocalCity()
    myCity.get(({ center, level, name }) => {
      const point = new window.BMap.Point(center.lng, center.lat)
      map.centerAndZoom(point, level)
      map.setCenter(name)
    })
  }
  render () {
    return (
      <div className={ styles['map-container'] }>
        <div className={ styles['mt'] }>
          <XxxNavHeader>地图找房</XxxNavHeader>
        </div>
        <div id={ styles['map'] }></div>
      </div>
    )
  }
}

export default Map

// 百度地图在react项目的使用流程
// st1、在百度地图开放平台注册账号并获取AK
// st2、在项目惟一静态页public/index.html中使用script标签引入百度地图API文件，将自己账号的AK密钥替换到相应位置
// st3、设置全局样式，以便百度地图能够正常展示
// st3、例如 html,body,#root,.app-container { height: 100%; } 与 * { margin: 0; padding: 0; } 
// st3、上面提到的 #root是根容器，.app-container是根组件容器
// st4、创建使用地图的组件，配置组件路由，并在该组件中，创建一个容器用于展示地图，并让组件容器与地图容器继承根组件的100%高度
// st4、例如 .map-container, #map { height: 100%; }
// st5、在componentDidMount周期中调用百度地图对象BMap提供的Map()实例化地图对象，格式：const map = new BMap.Map('地图容器id')
// st6、在componentDidMount周期中调用百度地图对象BMap提供的Point()实例化中心坐标，格式：const point = new BMap.Point(经度，纬度)
// st7、在componentDidMount周期中调用百度地图对象BMap提供的Point()初始化地图并设置缩放级别，格式：map.centerAndZoom(point,缩放级别)
// st8、在componentDidMount周期中调用百度地图对象BMap提供的定位接口LocalCity()获取当前城市，格式：new BMap.LocalCity().get(res=>{回调形参res就是ip定位获取的城市定位信息})

// N01、当前组件因为使用了css-modules方案解决样式冲突，因此st4会以变量对象的方式（即styles['xxx']的形式）点出css选择器
// N02、因为使用css-modules解决样式冲突，因此当前组件中st5传入的地图容器id也是styles['map']的形式，即new window.BMap.Map(styles['map'])
// N03、如果在样式文件中将css选择器改成css-modules的全局模式，即:global(#map)，那么st5传入的地图容器id就是 new window.BMap.Map('map')
