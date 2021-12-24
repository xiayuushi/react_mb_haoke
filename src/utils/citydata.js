import request from './request'
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))

  if (!localCity) {
    return new Promise((resolve, reject) => {
      const BMapCity = new window.BMap.LocalCity()
      BMapCity.get(async ({ name }) => {
        try {
          const { body } = await request('/area/info', 'get', { name })
          localStorage.setItem('hkzf_city', JSON.stringify(body))
          resolve(body)
        } catch (err) {
          reject(err)
        }
      })   
    })
  }

  return Promise.resolve(localCity)
}

// 1、react项目中获取全局变量必须通过window对象访问，BMap是通过静态页导入挂载到window对象上的百度sdk对象，因此必须通过window.BMap去访问该对象
// 2、BMap.LocalCity()是百度地图提供的IP定位，调用该方法会生成一个对象，通过该对象的get()可以在回调形参中获取当前的城市，即BMap.LocalCity().get(res=>形参res.name就可以获取当前IP定位的城市)
// 3、当前城市信息会在多个地方使用到，因此将其存入本地localStorage中
// 4、getCurrentCity用于获取本地城市信息
// 4、Q1 本地有当前城市信息，就从本地取，
// 4、Q2 否则调用百度地图获取本地城市信息，之所以调用自己项目服务器接口，是为了确认当前城市是否有该城市的房源数据
// 5、当本地缓存无城市信息时，调用百度API获取定位城市，但在BMapCity.get()内的回调中获取的城市数据如果直接返回，那么无法直接通过getCurrentCity这个我们自己封装的函数中拿到的
// 6、考虑到BMapCity.get()也是一个异步，因此可以通过实例化Promise对象的方式，将BMapCity.get()内的回调中获取的城市数据resolve()出去，这样子自己封装的getCurrentCity函数就能拿到数据了
// 7、BMapCity.get()内的回调是一个异步，回调内的axios请求也是一个回调，但百度地图API的回调一般不会出错，因此只对我们自己调用的aixos请求做try-catch处理即可
// 8、getCurrentCity函数封装时，因为对 !localCity 的情况使用了Promse，因此为了该封装函数返回值的统一，以便后续调用方便，也应该对 另一种相反的情况做Promise的处理
// 9、针对确定成功的情况，可以直接调用Promise.resolve()；当然对于确定会失败的情况，也可以使用Promise.reject()，对于不确定的情况则可以使用new Promise()对两种情况进行判断处理
// 10、在异步中返回结果，可以使用实例化Promise对象来实现
