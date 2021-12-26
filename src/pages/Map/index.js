import { Component } from 'react'
import styles from './index.module.scss'
import XxxNavHeader from '../../components/XxxNavHeader'

const BMap = window.BMap

class Map extends Component {
  initMap = () => {
    const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

    const map = new BMap.Map(styles['map'])
    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(label, (point) => {      
      if (point) {
        map.centerAndZoom(point, 11)  
        map.addOverlay(new BMap.Marker(point))
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        const opts = {
          position: point,
          offset: new BMap.Size(-35, -35)
        }
        const label = new BMap.Label('文本覆盖物', opts)
        label.setContent(`
          <div class="${styles['label']}">
            <p class="${styles['name']}">深圳</p>
            <p>99套</p>
          </div>
        `)
        const labelStyle = {
          padding: 0,
          color: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          border: '0 solid #f00',
        }
        label.setStyle(labelStyle)
        label.addEventListener('click', () => {
          console.log('当前覆盖物被点击了')
        }, false)
        map.addOverlay(label)
      }      
    }, label)
  }

  componentDidMount () {
    this.initMap()
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

// 百度地图在react项目的使用流程（当前采用的是百度地图JS文档API的v3版本）
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

// N1、当前组件因为使用了css-modules方案解决样式冲突，因此st4会以变量对象的方式（即styles['xxx']的形式）点出css选择器
// N2、因为使用css-modules解决样式冲突，因此当前组件中st5传入的地图容器id也是styles['map']的形式，即new window.BMap.Map(styles['map'])
// N3、如果在样式文件中将css选择器改成css-modules的全局模式，即:global(#map)，那么st5传入的地图容器id就是 new window.BMap.Map('map')
// N4、将百度地图SDK挂载到静态页script标签中的方式使用，相当于是将百度地图对象挂载到window对象中，因此百度地图对象BMap必须通过window对象访问

// N5、new BMap.Geocoder()是百度地图API，用于将文本地址解析为point坐标点，有了坐标才能进行调用展示地图的API（百度地图API不用记忆，直接参照官网示例复制使用即可）
// N6、map.centerAndZoom(point, 11)根据坐标点与缩放级别展示地图
// N6、map.addOverlay(new BMap.Marker(point))在地图特定坐标点展示定位标记
// N6、map.addControl(new BMap.NavigationControl())为地图添加平移控件
// N6、map.addControl(new BMap.ScaleControl())为地图添加比例尺控件

// N7、百度地图添加文本覆盖物流程
// N7、1 创建label文本对象（第二参数对象必须配置position选项）：const label = new BMap.Label('文本信息如果使用setContent设置了', 配置对象opts)
// N7、2 为label对象添加标签并为该标签设置自定义样式：label.setContent(`<div class="xxx">此处是HTML结构，非JSX结构</div>`)
// N7、3 为label对象设置自定义样式：label.setStyle(样式对象)
// N7、4 为覆盖物对象label添加单击事件：label.addEventListener('click',()=>{})
// N7、5 将文本覆盖物对象label添加到地图中：map.addOverlay(label)
// N7、默认情况下生产的文本覆盖物以定位坐标point的左上角为中心点，而label对象第二参数opts中的offset可以配置偏移量，置为覆盖物宽高的一半，让覆盖物偏移到中心点正中心
// N7、如果为使用label.setContent()为覆盖物添加了标签，则需要将new BMap.Label()第一参数的文本内容置为空字符串，但不能没有第一参数，因为需要引出第二参数
