1.登录验证码的网站 http://toutiao.itheima.net/

2.使用 useEffect 出现 React Hook useEffect has a missing dependency 警告
可以在 useEffect 后加入
// eslint-disable-line

3.redux 的操作流程
在 types/data.d.ts 中，根据接口准备好返回数据类型
在 actions/profile.ts 中，创建获取编辑时个人信息的 action
在 types/store.d.ts 中，创建相应的 redux action 类型
在 actions 中分发修改 redux 状态的 action
在 reducers 中处理该 action，并将状态存储到 redux 中

4. Edit index logout 命名重复出错

5.渲染数据过程（1）先写数据去 data.d.ts (2)去 store.d.ts 写动作类型 (3)去 reducer 合并类型 (4)去 action 写 （5）回到 reducer 写 swtich 和 case
(6)回到主页面写 use。。
