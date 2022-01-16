import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'
import { getToken, isAuth, removeToken } from '../../utils/auth'
import styles from './index.module.scss'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = process.env.REACT_APP_URL + '/img/profile/avatar.png'

class Profile extends Component {
  state = {
    isLogin: isAuth(),
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }
  getUserInfo = async () => {
    if (!this.state.isLogin) {
      return
    }
    const token = getToken()
    const res = await this.$request('/user','get', null, { authorization: token })
    if (res.status === 200) {
      this.setState({ 
        userInfo: {
          avatar: process.env.REACT_APP_URL + res.body.avatar,
          nickname: res.body.nickname
        } 
      })
    } else {
      // 登录失败
      removeToken()
      this.setState({ isLogin: false })
    }
  }

  logout = () => {
    Modal.alert('提示', '是否现在退出登录?', [
      { text: '取消' },
      { text: '确定', onPress: async () => {
        await this.$request('/user/logout', 'post', null, {authorization: getToken()})
        removeToken()
        this.setState({
          isLogin: false,
          userInfo: {
            avatar: '',
            nickname: ''
          }
        })
      }}
    ])
  }

  componentDidMount () {
    this.getUserInfo()
  }
  render () {
    return (
      <div className={ styles['root'] } >
      {/* 个人信息 */}
        <div className={ styles['title'] }>
        <img
          className={ styles['bg'] }
          src={ process.env.REACT_APP_URL + '/img/profile/bg.png' }
          alt="背景图"
        />
        <div className={ styles['info']} >
          <div className={ styles['myIcon']} >
            <img
              className={ styles['avatar'] }
              src={ this.state.avatar || DEFAULT_AVATAR }
              alt="icon"
            />
          </div>
          <div className={ styles['user'] }>
            <div className={ styles['name'] }>{ this.state.nickname || '游客' }</div>
            {
              this.state.isLogin ? 
              (
                // 用户登录后的渲染结构
                <>
                  <div className={ styles['auth'] }>
                    <span onClick={ this.logout }>退出</span>
                  </div>
                  <div className={ styles['edit'] }>
                    编辑个人资料
                    <span className={ styles['arrow'] }>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                // 用户未登录时的渲染结构
                <div className={ styles['edit'] }>
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={ () => this.props.history.push('/login') }
                >
                  去登录
                </Button>
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* 九宫格菜单 */}
      {/* 需要跳转路由的使用Link包裹进行跳转，否则只渲染结构 */}
      <Grid
        data={ menus }
        columnNum={ 3 }
        hasLine={ false }
        renderItem={ item =>
          item.to ? (
            <Link to={ item.to }>
              <div className={ styles['menuItem'] }>
                <i className={ `iconfont ${item.iconfont}` } />
                <span>{ item.name }</span>
              </div>
            </Link>
          ) : (
            <div className={ styles['menuItem'] }>
              <i className={`iconfont ${item.iconfont}`} />
              <span>{ item.name }</span>
            </div>
          )
        }
      />

      {/* 加入我们 */}
      <div className={ styles['ad'] }>
        <img src={ process.env.REACT_APP_URL + '/img/profile/join.png' } alt="" />
      </div>
    </div>
    )
  }
}

export default Profile

// 1、state中获取用户是否登录，state是定义在constructor周期的，在组件结构渲染之前就会触发（比componentDidMount更早触发）
// 2、先使用isLogin布尔值判断是否登录，根据登录情况渲染不同的组件
// -、Q1 未登录 渲染未登录的组件，显示游客与默认的头像，不调用接口请求数据
// -、Q2 已登录 渲染已登录的组件，显示用户与用户的头像，要调用接口请求数据
// 3、用户退出：弹窗提示，用户点确定退出时，则调用退出接口从服务端退出，同时清理本地缓存的token
// -、另外也必须重新更新state中的状态（用于驱动视图更新，渲染退出的视图）
// 4、如果在axios请求拦截器中设置了自动添加请求头携带token，则在请求时就无需手动在调用axios发送请求时添加{ authorization: token }
// 5、如果在axios响应拦截器中设置了响应失败自动移除token，则在处理登录失败时就无需手动清理token了，此时只需要将isLogin设置为false，让其自动更新视图即可
