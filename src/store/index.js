import { defineStore } from 'pinia'
import { getToken , setToken,removeToken} from '@/utils/token'

export const useUserDataStore = defineStore('userData', {
  state: () => {
    return {   
        token:getToken(),
        loading: false,
        themeObj: 0,//主题
        keywords:'',//关键词
        errorImg: new URL('@/assets/img/default.png',import.meta.url).href,
        baseURL:'http://127.0.0.1:13000/',

        haslogin:false
    }
  },
  actions:{
    setUserToken(token){
      setToken(token)
    },
    removeUserToken(){
      removeToken()
    },
    setUserHasLogin(bool){
      this.haslogin = bool
    }
  }
})