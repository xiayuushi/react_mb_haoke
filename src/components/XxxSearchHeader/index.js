import propsType from 'prop-types'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

const XxxSearchHeader = ({ history, currentCityName, className }) => {
  return (
    <Flex className={ [styles['search-wrap'], className || ''].join(' ') }>
      <Flex className={ styles['search'] }>
        <div className={ styles['location'] } onClick={ () => history.push('/citylist') }>
          <span>{ currentCityName }</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className={ styles['form'] } onClick={ () => history.push('/search') }>
          <i className="iconfont icon-seach" />
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i className={ [styles['map'], "iconfont icon-map"].join(' ') } onClick={ () => history.push('/map') } />
    </Flex>
  )
}

XxxSearchHeader.propsType = {
  className: propsType.string,
  currentCityName: propsType.string.isRequired
}

export default withRouter(XxxSearchHeader)

// 1、当前封装的是顶部导航栏组件
// 2、参数history是由react-router-dom控制的路由组件提供的对象，对于不是路由渲染的当前组件，则必须使用react-router-dom提供的高阶组件withRouter来为其增加路由功能以便使用路由对象
// 3、参数currentCityName是外部传入的城市名
// 4、参数className是外部传入的样式，用于覆盖当前组件原本的样式，以便适应在其他组件中的布局
// 4、className={ [styles['search-wrap'], className || ''].join(' ') 表示在当前组件原本的'search-wrap'样式基础上，可由使用者传入className属性对其进行覆盖改写样式
// 5、react中的组件封装一般都要使用prop-types进行props属性验证，以便给组件传入正确格式的参数
