import { Component } from 'react'
import { Button } from 'antd-mobile'

class CityList extends Component {
  goHome = () => {
    this.props.history.push('/home')
  }
  render () {
    return (
      <div className='city-list-container'>
        城市列表组件
        <Button onClick={this.goHome}>回首页</Button>
      </div>
    )
  }
}

export default CityList
