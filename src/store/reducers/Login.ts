//reducer函数 根据输入的类型参数 返回特定的结果
import { Token } from '@/types/data'
import { LoginAction } from '@/types/store';
import { getToken } from '@/utils/auth';

const initialState: Token =  getToken()

export default function Login(state = initialState, action:LoginAction):Token {
    switch (action.type) {
        case "login/token":
            return action.payload
        case "login/logout":
            return {token:'123', refresh_token:'123'}
        default:
            return state
    }
}
