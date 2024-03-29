import { Component } from 'react'
import { Spring, animated  } from 'react-spring'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const selectedVals = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filtersData: {},
    selectedVals
  }

  onTitleClick = (clickItem) => {
    this.htmlBody.className = styles['overflow']
    const { titleSelectedStatus, selectedVals } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(item => {
      // 当前点击项高亮
      if (item === clickItem) {
        newTitleSelectedStatus[clickItem] = true
        return
      }
      // 非点击项则根据pickerView是否有选择到值再进行高亮
      const currentValList = selectedVals[item]
      if (item === 'area' && (currentValList[0] !=='area' || currentValList.length !== 2)) {
        newTitleSelectedStatus[item] = true
      } else if (item === 'mode' && currentValList[0] !== 'null') {
        newTitleSelectedStatus[item] = true
      } else if (item === 'price' && currentValList[0] !== 'null') {
        newTitleSelectedStatus[item] = true
      } else if (item === 'more' && currentValList.length !== 0) {
        newTitleSelectedStatus[item] = true
      } else {
        newTitleSelectedStatus[item] = false
      }
    })
    this.setState({
      openType: clickItem,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  onCancel = (openType) => {
    this.htmlBody.classList.remove(styles['overflow'])
    const { titleSelectedStatus, selectedVals } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const currentValList = selectedVals[openType]
    // 以下判断的作用：在初始默认的值时点'取消'，会根据之前选中的值的状态来将对应的标题菜单高亮
    if (openType === 'area' && (currentValList[0] !== 'area' || currentValList.length !== 2)) {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'mode' && currentValList[0] !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'price' && currentValList[0] !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'more' && currentValList.length !== 0) {
      newTitleSelectedStatus[openType] = true
    } else {
      newTitleSelectedStatus[openType] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  onSure = (openType, value) => {
    this.htmlBody.classList.remove(styles['overflow'])
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const currentValList = value
    // 以下判断的作用：在初始默认的值时点'确定'不会将对应的标题菜单高亮
    if (openType === 'area' && (currentValList[0] !== 'area' || currentValList.length !== 2)) {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'mode' && currentValList[0] !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'price' && currentValList[0] !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'more' && currentValList.length !== 0) {
      newTitleSelectedStatus[openType] = true
    } else {
      newTitleSelectedStatus[openType] = false
    }

    // 拼接获取房屋列表接口所需参数
    const newSelectedVals = {
      ...this.state.selectedVals,
      [openType]: value
    }
    const { area, mode, price, more } = newSelectedVals
    const filtersPayload = {}
    const areaKey = area[0]
    let areaVal = 'null'
    if (area.length === 3) {
      areaVal = area[2] !== 'null' ? area[2] : area[1]
    }
    filtersPayload[areaKey] = areaVal
    filtersPayload.mode = mode[0]
    filtersPayload.price = price[0]
    filtersPayload.more = more.join()

    // 调用父组件中的方法，将拼接好的获取房屋列表的参数传递给父组件
    this.props.onFiltersParams(filtersPayload)

    // 更新状态
    this.setState({
      openType: '',
      selectedVals: newSelectedVals,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  getFiltersData = async () => {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { body } = await this.$request(`/houses/condition?id=${value}`)
    this.setState(() => {
      return {
        filtersData: body
      }
    })
  }

  renderFilterPicker = () => {
    const { openType, selectedVals, filtersData: { area, subway, rentType, price } } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    let data = []
    let cols = 3
    let currentTypeSelectedVal = selectedVals[openType]
    switch (openType) {
      case 'area': 
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default: 
        break
    }
    return (
      <FilterPicker
        onCancel={ this.onCancel }
        onSure={ this.onSure }
        key={ openType }
        data={ data }
        cols={ cols }
        type={ openType }
        currentTypeSelectedVal={ currentTypeSelectedVal }
      />
    )
  }

  renderFilterMore = () => {
    const { openType, selectedVals, filtersData: { characteristic, floor, oriented, roomType } } = this.state
    const data = { characteristic, floor, oriented, roomType }
    const defaultSelectedValsList = selectedVals.more
    if (openType !== 'more') {
      return null
    }
    return (
      <FilterMore 
        onSure={ this.onSure }
        onCancel={ this.onCancel }
        data={ data }
        type={ openType }
        defaultSelectedValsList={ defaultSelectedValsList }
      />
    )
  }

  renderMask = () => {
    const isHideMask = this.state.openType === 'more' || this.state.openType === ''
    // if (isHideMask) return null
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHideMask ? 0 : 1 }}>
        { style => {
          if (isHideMask || style.opacity === 0) return null
          return (<animated.div className={ styles['mask'] } style={ style } onClick={ this.onCancel }></animated.div>)
        }}
      </Spring>
    )
  }

  componentDidMount () {
    this.htmlBody = document.body
    this.getFiltersData()
  }

  render () {
    return (
      <div className={ styles['filter-container'] }>

        {/* 前三个菜单的遮罩层 */}
        {
          this.renderMask()
        }

        <div className={ styles['content'] }>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={ this.state.titleSelectedStatus } onTitleClick={ this.onTitleClick } />

          {/* 标题栏内容 - 前三个筛选 */}
          {
            this.renderFilterPicker()
          }
          
          {/* 标题栏内容 - 后一个选项 */}
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}

export default Filter

// 1、filterTitle组件的标题高亮效果由该组件自身或该组件外的遮罩层或者其他组件兄弟控制，因此进行状态提升，将控制高亮的状态定义到共同的父组件filter组件中
// 2、父组件filter然后将控制标题高亮的方法通过props传递给需要使用的各个子组件，子组件再通过props接收进行使用
// 3、此处将标题高亮的key与filterTitle组件中的标题的key保持一致，后续为选中状态的定义提供了便利
// 4、onTitleClick是filterTitle点击事件，点击时对应的标题选项高亮并进行相关逻辑处理，形参clickItem是点击的某个具体标题选项
// -、点击时需要获取所有标题状态，因为state.titleSelectedStatus是一个对象，该对象涵盖所有标体选项的状态，然后再通过事件形参获取某个具体的点击项让它做状态改变
// -、先展开再进行针对具体标题项做改变，这个顺序不能变（先获取所有，再进行针对性的覆盖，达到改变某一个的目的）
// -、此处对象中key使用的中括号写法是ES6对象属性名表达式，即 xxx: { [a]: b } 等同于 xxx[a]=b 中括号中的a是变量
// -、ES6对象键名表达式不能与ES6简洁表达式同时使用，即直接 xxx:{ [a] } 这样子简写是错误的，必须为xxx[a]进行赋值
// 5、openType控制filterTitle对应的内容filterPicker组件与filterMore组件的展示与隐藏
// -、openType的值与标体栏filterTitle组件的选项对应，当选项值为area、mode、price时对应展示区域、方式、租金的内容，该内容都是下拉选项的形式存在的，即filterPicker组件
// -、openType的值为more时对应展示筛选的内容，该内容是与之前不同的形式存在的，即filterMore组件
// 6、renderFilterPicker()用于渲染FilterPicker组件的内容数据，因此整合了渲染FilterPicker所需的各种数据
// -、FilterPicker组件中使用到了antd-mobile的PickerView组件，该组件的data属性就是设置数据源的地方，即renderFilterPicker()中整合的data就是为了给PickerView的data属性使用的
// -、pickerView组件中如果出现内容"偏左"无法居中的情况，说明该组件的cols属性列数设置不合理（antd-mobile默认设置cols值是3），应该根据不同的内容展示合适的列数才能正常"居中"显示
// 7、Filter组件中必须定义type与currentTypeSelectedVal，将当前pickerView选择的通过props传递给FilterPicker组件内部，以便其内部使用该属性设置选中项的默认值
// 8、FilterPicker组件设置默认选中值流程：
// -、st1 在 Filter 组件中，提供选中值状态：selectedVals
// -、st2 根据 openType 获取到当前类型的选中值（currentTypeSelectedVal），通过 props 传递给 FilterPicker 组件。
// -、st3 在 FilterPicker 组件中，将 currentTypeSelectedVal 设置为状态 value 的默认值。
// -、st4 在点击确定按钮后，在父组件中更新当前 type 对应的 selectedVals 状态值。
// 9、给FilterPicker添加key属性是为了解决在不销毁FilterPicker组件时pickerView选中的数据无法重新初始化同步更新的问题
// -、因为state状态属于constructor周期，该周期只会执行一次，如果在组件不销毁的情况下切换pickerView，那么数据不会再次初始化跟随切换更新
// 10、FilterMore组件设置默认选中值：
// -、st1 在渲染 FilterMore 组件时，从 selectedValues 中，获取到当前选中值 more。
// -、st2 通过props 将选中值传递给 FilterMore 组件。
// -、st3 在FilterMore 组件中，将获取到的选中值，设置为子组件状态 selectedValues 的默认值。
// -、st4 给遮罩层绑定单击事件。
// -、st5 在单击事件中，调用父组件的方法 onCancel 关闭 FilterMore 组件。
// 11、在打开pickerView或FilterMore面板时，无论是关闭（点击遮罩层关闭或者取消按钮关闭）或者打开（点击确定按钮打开）都应该进行标题高亮判断
// -、st1 在 Filter 组件的 onTitleClick 方法中，添加 type 为 more 的判断条件。
// -、st2 当选中值数组长度不为 0 时，表示 FilterMore 组件中有选中项，此时，设置选中状态高亮。
// -、st3 在点击确定按钮时，根据参数 type 和 value，判断当前菜单是否高亮。
// -、st4 在关闭对话框时（onCancel），根据 type 和当前type的选中值，判断当前菜单是否高亮。
// -、注意：因为 onCancel 方法中，没有 openType 参数，所以，就需要在调用 onCancel 方式时，来传递 openType 参数。
// 12、拼接获取房屋列表的参数filtersParams时areaKey可能是'area'或者'subway'（二选一）因此需要使用中括号变量语法
// 13、房屋列表的参数需要交给父组件HouseList，因为获取的访问列表需要渲染到HouseList组件中，因此需要在HouseList/index.js中定义方法交给当前Filter组件调用
// 14、展示条件筛选对话框后，页面依旧可以进行上下滚动的问题
// --、st1 在componentDidMount周期中，获取body，并储存在this中
// --、st2 在展示对话框时（即调用onTitleClick方法时），给body添加预先定义好的样式类 
// --、st3 在关闭对话框时（即调用onSure或者onCancel方法时），给body移除预先定义好的样式类 
// --、注意 样式类中只需要将垂直滚动条取消即可，设置body的样式为 overflow: hidden; 
// 14、js移除类的方式有两种
// --、Q1 直接移除所有的类 DOM.className=''
// --、Q2 从多个类中移除指定的单个类 DOM.classList.remove('不带点号的样式类名')
// 15、使用react-spring动画库来实现遮罩层动画：
// --、创建方法 renderMask 来渲染遮罩层 div。
// --、修改渲染遮罩层的逻辑，保证 Spring 组件一直都被渲染（Spring 组件都被销毁了，就无法实现动画效果）。
// --、修改 to 属性的值，在遮罩层隐藏时为 0，在遮罩层展示时为 1。
// --、在 render-props 的函数内部，判断 style.opacity 是否等于 0。
// --、如果等于 0，就返回 null（不渲染遮罩层），解决遮罩层遮挡页面导致顶部导航失效问题。
// --、如果不等于 0，渲染遮罩层 div。
// --、必须确保Spring组件一直被渲染，否则消失的动画出不来，因此必须注释掉上面的 'if (isHideMask) return null'
// 16、react-spring动画库的使用流程（以Spring组件的render-props模式为例）
// --、st1、安装react-spring，并解构出Spring组件与animated修饰符
// --、st2、使用Spring组件通过render-props的方式包裹需要做动画的元素
// --、st3、Spring组件设置from属性用于初次状态（后续不会变化，因此就算from属性不设置也不影响后续动画效果）、设置to属性用于做状态变化
// --、st4、Spring组件render-props模式通过形参变量复用动画库中的样式，并设置给需要做动画的元素的style属性
// --、st5、做动画的元素前面加上animated修饰符

