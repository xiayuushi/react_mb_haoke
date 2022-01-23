import React, { Component } from 'react'
import { Flex, List, InputItem, Picker, ImagePicker, TextareaItem, Modal, Toast } from 'antd-mobile'

import XxxNavHeader from '../../../components/XxxNavHeader'
import XxxHousePackge from '../../../components/XxxHousePackage'
import styles from './index.module.scss'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    const community = { name: '', id: '' }
    // 有小区信息数据才存储到状态中
    if (props.location.state) {
      community.name = props.location.state.name
      community.id = props.location.state.id
    }
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  getValue = (name, val) => {
    this.setState({
      [name]: val
    })
  } 

  getSupporting = selectedList => {
    this.setState({
      supporting: selectedList.join('|')
    })
  }

  imgPickerChange = (files, type, index) => {
    // console.log(files, type, index)
    this.setState({
      tempSlides: files
    })
  }

  submitHandler = async () => {
    if (this.state.tempSlides.length > 0) {
      const formdata = new FormData()
      this.state.tempSlides.forEach(v => formdata.append('file', v.file))
      const { body, status } = await this.$request('/houses/image', 'post', formdata, {
        'Content-Type': 'multipart/form-data'
      })
      if (status === 200) {
        this.setState({
          houseImg: body.join('|')
        }, async () => {
          const { title, description, houseImg, oriented, supporting, price, roomType, size, floor, community } = this.state
          const { status } = await this.$request('/user/houses', 'post', 
            { title, description, houseImg, oriented, supporting, price, roomType, size, floor, community: community.id }
          )
          if (status === 200) {
            Toast.info('发布房屋出租信息成功', 2, () => this.props.history.push('/rent'), false)
          } else {
            Toast.info('发布房屋出租信息失败，请稍后再试', 2, null, false)
          }
        })
      }
    }
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const { community, price, size, roomType, floor, oriented, description, tempSlides, title } = this.state

    return (
      <div className={styles.root}>
        <XxxNavHeader onLeftClick={this.onCancel}>发布房源</XxxNavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" value={price} onChange={ val => this.getValue('price', val) }>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" value={size} onChange={ val => this.getValue('size', val) }>
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1} onChange={ val => this.getValue('roomType', val[0]) }>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1} onChange={ val => this.getValue('floor', val[0]) }>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1} onChange={ val => this.getValue('oriented', val[0]) }>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={ val => this.getValue('title', val) }
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={ this.imgPickerChange }
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <XxxHousePackge select onSelect={ this.getSupporting } />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={ val => this.getValue('description', val) }
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.submitHandler}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}

// 1、antd-mobile的InputItem、TextareaItem、Picker组件都是受控组件的方式绑定状态值的，且各自都有onChange事件用于获取输入的值
// -、因此可以通过onChange事件的回调获取它们各自的字段以及相应的值，达到为以上表单元素绑定并更新状态数据的目的

  /* 
    获取表单数据：
    1 创建方法 getValue 作为三个组件的事件处理程序。
    2 该方法接收两个参数：1 name 当前状态名 2 value 当前输入值或选中值。
    3 分别给 InputItem / TextareaItem / Picker 组件，添加 onChange 配置项。
    4 分别调用 getValue 并传递 name 和 value 两个参数（注意：Picker 组件选中值为数组，而接口需要字符串，所以，取索引号为 0 的值即可）。
  */

  /* 
    获取房屋图片：
    1 给 ImagePicker 组件添加 onChange 配置项。
    2 通过 onChange 的参数，获取到上传的图片，并存储到状态 tempSlides 中。
  */

  /* 
    上传房屋图片：
    1 给提交按钮，绑定单击事件。
    2 在事件处理程序中，判断是否有房屋图片。
    3 如果没有，不做任何处理。
    4 如果有，就创建 FormData 的实例对象（form）。
    5 遍历 tempSlides 数组，分别将每一个图片对象，添加到 form 中（键为： file，根据接口文档获得）。
    6 调用图片上传接口，传递form参数，并设置请求头 Content-Type 为 multipart/form-data。
    7 通过接口返回值获取到的图片路径。
  */

  /* 
    发布房源：
    1 在 addHouse 方法中，从 state 里面获取到所有房屋数据。
    2 使用 API 调用发布房源接口，传递所有房屋数据。
    3 根据接口返回值中的状态码，判断是否发布成功。
    4 如果状态码是 200，表示发布成功，就提示：发布成功，并跳转到已发布房源页面。
    4 Toast.info()第三参数是一个回调，为了避免一提示就立即跳转，可以在第三参数回调中去进行路由跳转
    5 否则，就提示：服务器偷懒了，请稍后再试~。
  */