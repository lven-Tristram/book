import axios from 'axios'
import {getCategoryName} from '@/utils/store'
import {setLocalForage} from '@/utils/localForage'
export function home(){
    return axios({
        method: 'get',
        url:`${process.env.VUE_APP_BASE_URL}/book/home`
    })
}
export function detail(book){
    return axios({
        method:'get',
        url:`${process.env.VUE_APP_BOOK_URL}/book/detail`,
        params:{
            fileName:book.fileName
        }
    })
}
export function list(){
    return axios({
        method:'get',
        url:`${process.env.VUE_APP_BASE_URL}/book/list`
    })
}
export function flatList() {
    return axios({
      method: 'get',
      url: `${process.env.VUE_APP_BOOK_URL}/book/list`
    })
}
export function shelf() {
    return axios({
      method: 'get',
      url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
    })
}
export function download(item, onSuccess, onFailed, onError, onProgress) {
    axios.create({
      baseURL: process.env.VUE_APP_RES_URL,
      method: 'get',
      responseType: 'blob',
      timeout: 180 * 1000,
      onDownloadProgress: progressEvent => {
        if (onProgress) onProgress(progressEvent)
      }
    }).get(`${getCategoryName(item.category)}/${item.fileName}.epub`)
      .then(res => {
        const blob = new Blob([res.data])
        setLocalForage(item.fileName, blob, () => {
          if (onSuccess) onSuccess(item)
        }, err => {
          if (onFailed) onFailed(err)
        })
      })
      .catch(err => {
        if (onError) onError(err)
      })
}
//新添加的请求
export function home2() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/home2`
  })
}
