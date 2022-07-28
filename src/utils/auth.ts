import type {Token} from "@/types/data"

const TOKEN_KEY = 'itcast_geek_mobile'

// 获取token
const getToken = ():Token => JSON.parse(localStorage.getItem(TOKEN_KEY) || '{"token": "", "refresh_token": ""}')
// 存储token
const setToken = ( token:Token ) => localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
// 清除token
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export { getToken, setToken, clearToken }