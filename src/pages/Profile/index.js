import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Button } from 'antd-mobile'
import { getToken, isAuth } from '../../utils/auth'
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
    }
  }
  componentDidMount () {
    this.getUserInfo()
  }
  render () {
    return (
      <div className={styles['root']}>
      {/* 个人信息 */}
        <div className={styles['title']}>
        <img
          className={styles['bg']}
          src={process.env.REACT_APP_URL + '/img/profile/bg.png'}
          alt="背景图"
        />
        <div className={styles['info']}>
          <div className={styles['myIcon']}>
            <img
              className={styles['avatar']}
              src={this.state.avatar || DEFAULT_AVATAR}
              alt="icon"
            />
          </div>
          <div className={styles['user']}>
            <div className={styles['name']}>{ this.state.nickname || '游客'}</div>
            {
              this.state.isLogin ? 
              (
                // 用户登录后的渲染结构
                <>
                  <div className={styles['auth']}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles['edit']}>
                    编辑个人资料
                    <span className={styles['arrow']}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                // 用户未登录时的渲染结构
                <div className={styles['edit']}>
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={() => this.props.history.push('/login')}
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
        data={menus}
        columnNum={3}
        hasLine={false}
        renderItem={item =>
          item.to ? (
            <Link to={item.to}>
              <div className={styles['menuItem']}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            </Link>
          ) : (
            <div className={styles['menuItem']}>
              <i className={`iconfont ${item.iconfont}`} />
              <span>{item.name}</span>
            </div>
          )
        }
      />

      {/* 加入我们 */}
      <div className={styles['ad']}>
        <img src={process.env.REACT_APP_URL + '/img/profile/join.png'} alt="" />
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
