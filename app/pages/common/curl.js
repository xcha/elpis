import axios from 'axios'
import md5 from 'md5'
import { ElMessage } from 'element-plus'
/**
 * 封装curl
 */
const curl = ({
  url,
  method = 'post',
  headers = {},
  query = {},
  data = {},
  responseType = 'json',
  timeout = 60000,
  errorMessage = '网络异常'
}) => {
  //接口
  const signKey = 'b4f00857d45ea9ea2ec28cbf43b3c543'
  const st = Date.now()

  const dtoHeaders = {
    ...headers,
    s_t: st,
    s_sign: md5(`${signKey}_${st}`)
  }
  if (url.indexOf('/api/proj/') > -1 && window.__ELPIS_PROJ_KEY__) {
    dtoHeaders.proj_key = window.__ELPIS_PROJ_KEY__
  }

  const ajaxSetting = {
    url,
    method,
    headers: dtoHeaders,
    params: query,
    data,
    responseType,
    timeout
  }
  return axios
    .request(ajaxSetting)
    .then((response) => {
      const resData = response.data || {}
      const { success, code, message } = resData
      if (!success) {
        if (code === 442) {
          ElMessage.error('请求参数异常')
        } else if (code === 445) {
          ElMessage.error('请求不合法')
        } else if (code === 446) {
          ElMessage.error('缺少项目标识')
        } else if (code === 50000) {
          ElMessage.error(message)
        } else {
          ElMessage.error(errorMessage)
        }
        console.error(message)
        return Promise.resolve({ success, code, message })
      }

      const { data, metadata } = resData
      return Promise.resolve({ success, data, metadata })
    })
    .catch((error) => {
      console.log(error)
      const { message } = error
      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: 'Request Timeout',
          code: 504
        })
      }
      return Promise.resolve(error)
    })
}

export default curl
