import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import styles from './index.module.scss'
import XxxNavHeader from '../../components/XxxNavHeader'

const BMap = window.BMap

class Map extends Component {
  state = {
    houseList: [],
    showHouseList: false
  }

  getTypeAndZoom = () => {
    const zoom = this.map.getZoom()
    let overlaysType, nextZoom
    if (zoom >= 10 && zoom < 12) {
      overlaysType = 'circle'
      nextZoom = 13 
    } else if (zoom >= 12 && zoom < 14) {
      overlaysType = 'circle'
      nextZoom = 15 
    } else if (zoom >= 14 && zoom < 16) {
      overlaysType = 'rect' 
    }
    return { overlaysType, nextZoom }
  }

  renderOverlays = async (id) => {
    try {
      const { overlaysType, nextZoom } = this.getTypeAndZoom()
      Toast.loading('加载中...', 0, null, true)
      const { body: areaList } = await this.$request(`/area/map?id=${id}`)
      Toast.hide()
      areaList.forEach(item => {
        this.createOverlays(item, overlaysType, nextZoom)
      })
    } catch (err) {
      console.log(err)
      Toast.hide()
    }
  }

  createOverlays = (item, overlaysType, nextZoom) => {
    // item是区或镇或小区的房源数据、overlaysType是覆盖物类型、nextZoom是下一级缩放级别
    const { coord: { longitude, latitude }, count, label: areaName, value: id } = item
    const point = new BMap.Point(longitude, latitude)
    overlaysType === 'circle'
    ? this.createCircleOverlays(point, areaName, count, id, nextZoom)
    : this.createRectOverlays(point, areaName, count, id)
  }

  createCircleOverlays = (point, areaName, count, id, nextZoom) => {
    const label = new BMap.Label('', { 
      position: point, 
      offset: new BMap.Size(-35, -35) }
    )
    label.id = id
    label.setContent(`
      <div class="${styles['circle']}">
        <p class="${styles['name']}">${ areaName }</p>
        <p>${ count }套</p>
      </div>
    `)
    label.setStyle({
      padding: 0,
      color: '#fff',
      fontSize: '12px',
      cursor: 'pointer',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      border: '0 solid #f00',
    })

    label.addEventListener('click', () => {
      this.renderOverlays(id)
      this.map.centerAndZoom(point, nextZoom)
      setTimeout(() => (this.map.clearOverlays()), 0) 
      // 之所以此处将清除覆盖物的方法加入定时器中，是为了解决直接修改引发的dom操作导致百度地图API报错的问题
    })
    this.map.addOverlay(label)
  }

  createRectOverlays = (point, areaName, count, id) => {
    const label = new BMap.Label('', {
      position: point, 
      offset: new BMap.Size(-50, -28) }
    )
    label.id = id
    label.setContent(`
      <div class="${styles['rect']}">
        <span class="${styles['housename']}">${ areaName }</span>
        <span class="${styles['housecount']}">${ count }套</span>
        <i class="${styles['arrow']}"></i>
      </div>
    `)
    label.setStyle({
      padding: 0,
      color: '#fff',
      fontSize: '12px',
      cursor: 'pointer',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      border: '0 solid #f00',
    })
    label.addEventListener('click', e => {
      this.getHouseList(id)
      // 获取当前点击项，移动当前点击的这个（最后一级小区级）地图覆盖物到中间位置
      const target = e.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 -target.clientY
      )
    })
    this.map.addOverlay(label)
  }

  getHouseList = async (id) => {
    try {
      Toast.loading('加载中...', 0, null, true)
      const { body: { list } } = await this.$request(`/houses?cityId=${id}`)
      Toast.hide()
      this.setState(() => ({ houseList: list, showHouseList: true }))
    } catch (err) {
      console.log(err)
      Toast.hide()
    }
  }

  initMap = () => {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

    const map = new BMap.Map(styles['map'])
    this.map = map 
    // 将当前方法中的map对象挂载到this中，让组件实例中的其他方法也能够通过this.map使用
    // 之所以不将上面的new BMap赋值直接改成this.map，是不想大动干戈将当前函数中的map依次改成this.map

    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(label, async (point) => {      
      if (point) {
        map.centerAndZoom(point, 11)  
        map.addOverlay(new BMap.Marker(point))
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        this.renderOverlays(value)
      }      
    }, label)

    this.map.addEventListener('movestart', () => {
      if (this.state.showHouseList) {
        this.setState(() => ({ showHouseList: false }))
      }
    })
  }

  renderHouseList = () => {
    return (
      this.state.houseList.map(item => (
        <li className={ styles['item'] } key={ item.houseCode }>
          <img src={ process.env.REACT_APP_URL + item.houseImg } alt="" />
          <div className={ styles['content'] }>
          <h1 className={ styles['title'] }>{ item.title }</h1>
          <div className={ styles['desc'] }>{ item.desc }</div>
            <div className={ styles['tags'] }>
             {
               item.tags.map((v, i) => {
                const className = 'tag' + (i + 1)
                return (
                  <span className={ styles[className] } key={ v }>{ v }</span>
                )
               })
             }
            </div>
            <div className={ styles['price'] }>{ item.price }<span>元/月</span></div>
          </div>
        </li>
      ))
    )
  }

  componentDidMount () {
    this.initMap()
  }

  render () {
    return (
      <div className={ styles['map-container'] }>

        {/* 顶部导航栏 */}
        <div className={ styles['mt'] }>
          <XxxNavHeader>地图找房</XxxNavHeader>
        </div>

        {/* 地图 */}
        <div id={ styles['map'] }></div>

        {/* 房源列表 */}
        <div className={ [styles['houselist'], this.state.showHouseList === true ? styles['show'] : ''].join(' ') }>
          <div className={ styles['top'] }>
            <h1>房屋列表</h1>
            <Link to="/home/list">更多房源</Link>
          </div>
          <ul className={ styles['bottom'] }>{ this.renderHouseList() }</ul>
        </div>
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

// N8、点击覆盖物时，会以当前覆盖物为中心放大比例，然后进入子级区域的同时清除掉所有覆盖物
// N8、调用map.clearOverlays()清除覆盖物时，百度地图会报错，此时必须将该方法放入定时器延迟调用才可以解决该报错
// N9、const { coord: { longitude } } = item是ES6对象的解构语法，此处相当于二次解构，即 const logitude = item.coord.logitude
// N10、map.getZoom()是百度地图API用于获取地图缩放级别

// 1、点击当前区级覆盖物，会以当前覆盖物为中心点放大缩放比例进入下一子级（镇级）覆盖物，子级覆盖物也是如此，直到进入到最后一级小区覆盖物
// 2、区级与镇级覆盖物都是圆形的，而最后一级覆盖物是方形的
// 3、以上会出现大量逻辑重复，因此可以封装进行代码简化
// 3、1 getTypeAndZoom()根据当前地图缩放级别决定下一子级区域的缩放级别与覆盖物类型，该方法会在renderOverlays()内部调用
// 3、1 if (zoom >= 10 && zoom < 12) 当前zoom=11（默认值11）是区，会展示所有区的覆盖物，下一缩放级别nextZoom=13
// 3、1 if (zoom >= 12 && zoom < 14) 当前zoom=13是镇，下一缩放级别nextZoom=15
// 3、1 if (zoom >= 14 && zoom < 16) 当前zoom=15是小区，没有下一级缩放级别nextZoom 

// 3、2 renderOverlays()渲染覆盖物，会根据传入的区域、镇或者小区的id生成对应的覆盖物

// 3、3 createOverlays()根据传入的类型，调用相应的方法创建对应的覆盖物，因为逻辑比较多抽离为两个方法
// 3、3 区或镇则调用createCircleOverlays()创建圆形覆盖物
// 3、3 最后一级小区则调用createRectOverlays()创建方形覆盖物

// 3、4 createCircleOverlays()用于创建圆形覆盖物，根据数据创建覆盖物，绑定事件（以当前坐标为中心放大比例，清除之前上一级别的覆盖物，渲染下一级别数据）
// 3、5 createRectOverlays()用于创建方形覆盖物，即最后一级覆盖物，绑定事件（点击当前覆盖物并将它移动到地图中间，渲染房源列表数据）
// 3、5 createRectOverlays()内点击事件监听中通过事件对象e获取当前点击的覆盖物，调用地图实例的panBy(水平位移,垂直位移)将其移动到地图中间位置
// 3、5 map.panBy(水平位移像素,垂直位移像素)
// 3、5 水平位移像素 = (window.innerWidth窗口可视区宽度含滚动条 / 2) - e.changedTouches[0].clientX点击项水平可视区宽度
// 3、5 垂直位移像素 = (window.innerHeight窗口可视区高度含滚动条 -下方房源盒子高度) / 2 - e.changedTouches[0].clientY点击项垂直可视区高度
// 3、6 map.addEventListener('movestart', () => {}) 为地图添加移动监听，当开始移动时，让下方的房源列表消失
