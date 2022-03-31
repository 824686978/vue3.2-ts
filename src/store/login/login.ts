import { Module } from 'vuex'
import {
  accountLoginRequest,
  requestUserInfoById,
  requestUserMenusByRoleId
} from '@/service/login/login'
import router from '@/router'
import localCache from '@/utils/cache'
import { IAccount } from '@/service/login/types'
import { ILoginState } from './types'
import { IRootState } from '../types'

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: '',
      userInfo: {},
      userMenus: []
    }
  },
  mutations: {
    // 保存token到state
    changeToken(state, token) {
      state.token = token
    },

    //保存用户信息
    changeUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

    //保存用户菜单
    changeUserMenus(state, userMenus) {
      state.userMenus = userMenus
    }
  },
  getters: {},
  actions: {
    // 账号登录
    async accountLoginAction({ commit }, payload: IAccount) {
      // 用户登录
      const loginResult = await accountLoginRequest(payload)
      const { id, token } = loginResult.data

      commit('changeToken', token)
      // 本地缓存token
      localCache.setCache('token', token)

      // 请求用户信息
      const userInfoResult = await requestUserInfoById(id)
      const userInfo = userInfoResult.data
      commit('changeUserInfo', userInfo)

      // 本地缓存用户信息
      localCache.setCache('userInfo', userInfo)

      // 请求用户菜单
      const userMenusResult = await requestUserMenusByRoleId(userInfo.role.id)
      const userMenus = userMenusResult.data
      commit('changeUserMenus', userMenus)

      // 本地缓存用户菜单
      localCache.setCache('userMenus', userMenus)
      console.log(userMenus)

      // 跳到首页
      router.push('./main')
    },
    
    // 防止刷新，重新请求数据
    loadLocalLogin({commit}) {

      const token = localCache.getCache('token')
      if (token) {
        commit('changeToken', token)
      }

      const userInfo = localCache.getCache('userInfo')
      if (userInfo) {
        commit('changeUserInfo', userInfo)
      }

      const userMenus = localCache.getCache('userMenus')
      if (userMenus) {
        commit('changeUserMenus', userMenus)
      }
    },

    //手机登录
    phoneLoginAction({ commit }, payload: any) {
      console.log('phoneLoginAction', payload)
    }
  }
}
export default loginModule
