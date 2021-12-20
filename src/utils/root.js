;(function () {
  const setRoot = () => {
    let docElement = document.documentElement
    let docElementClientWidth = document.documentElement.clientWidth
    docElement.style.fontSize = 20 * (docElementClientWidth/375) + 'px'
    console.log('当前根节点字体大小：' + docElement.style.fontSize)
  }
  setRoot()
  window.addEventListener('resize', setRoot)
})()

// 1、根据视窗调整根节点字体大小，便于rem做适配
// 2、将当前文件导入到入口文件中，后续会自动监听视窗大小更改根节点字体大小
// 3、同时设置vscode插件css-rem设置root-font-size为20（与上面代码确定的比例保持同步）
// 3、后续测量一倍图多少px就直接通过该插件转成rem单位（如果是二倍图，则将cssrem插件的root-font-size设置为 比例*2，即此时的20*2）