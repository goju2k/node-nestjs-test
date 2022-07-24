import axios from 'axios'
import { getHeader } from 'src/common/header/header';
import LogUtil from '../util/log'

//interceptor : request
axios.interceptors.request.use((config)=>{
  !config.url.includes('rfind') && (config.headers['Authorization'] = getHeader().token)
  LogUtil.log(`[axios][req][${config.url}]`, config.data || config.params);
  return config
})

//interceptor : response 
axios.interceptors.response.use(

  //success
  (res)=>{
    LogUtil.log(`[axios][res][${res.config.url}]${res.config.headers.goju}`, res.data);
    return res.data
  },

  //error
  (error)=>{
    const {response} = error
    const data = response && response.data ? response.data : error
    LogUtil.error(`[axios][err][${response.config.url}]`, data);
    throw error
  }

)
