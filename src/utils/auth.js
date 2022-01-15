const TOKEN_NAME = 'hkzf_token'

const getToken = () => localStorage.getItem(TOKEN_NAME)

const setToken = (value) => localStorage.setItem(TOKEN_NAME, value)

const removeToken = () => localStorage.removeItem(TOKEN_NAME)

const isAuth = () => !!getToken()

export { getToken, setToken, removeToken, isAuth }

// 1、将数据转换成布尔值，只需要在数据前面加上两个取反的 '!!'
