// 引入登录、退出登录、获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 货物token、设置token、删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 模块中重置路由的方法
import { resetRouter, asyncRoutes, constantRoutes,anyRoutes } from '@/router'
import router from '@/router'


const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 服务器返回的菜单信息
    routes:[],
    // 按钮权限信息
    buttons:[],
    // 角色信息
    roles:'',
    resultAsyncRoutes:[],
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO:(state,userInfo) => {
    // 用户名字
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限信息
    state.routes = userInfo.routes
    // 按钮权限信息
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    // 注意：一个用户需要展示完整的路由，包括：商量路由、异步路由、任意路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
// 计算异步路由和服务器返回的路由信息比较
const computedAsyncRoutes = (asyncRoutes,routes) => {
  return asyncRoutes.filter(item=>{
    // 数组当中没有这个元素返回-1，如果有这个元素返回的一定不是-1
    if(routes.indexOf(item.name)!=-1){
      // 递归
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }  
  })
}


const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 注意：当前登录的请求是使用mock数据，mock数据code是20000
    if(result.code == 20000){
      // vuex存储token
      commit('SET_TOKEN',result.data.token)
      // 本地持久化存储token
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 获取用户信息,在permission.js调用的
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 获取用户信息：返回数据包含：用户名name、用户头像avatar、roles用户角色、routes【返回的标记：不同的用户应该展示哪些菜单】、buttons【按钮的信息：按钮使用的标记】
        // vuex存储用户的全部信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

