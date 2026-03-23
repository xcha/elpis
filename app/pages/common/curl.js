/**
 * 前端封装curl方法
 *
 */
const md5 = require("md5");
import Axios from "axios";

import { ElMessage, messageConfig } from "element-plus";
const curl = ({
  url,
  method = "post",
  headers = {},
  query = {},
  data = {},
  responseType = "json",
  timeout = 60000,
  errorMessage = "网络异常",
}) => {
  // 接口签名处理(让接口变动态)
  const signKey = "zdx20040921";
  const st = Date.now();
  // 构造请求参数(把参数转换为Axios参数 )
  const ajaxSetting = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: {
      ...headers,
      s_sign: md5(`${signKey}_${st}`),
      s_st: st,
    },
  };

  return Axios.request(ajaxSetting)
    .then((res) => {
      const resData = res.data || {};
      const { success, code, msg: message } = resData;

      if (!success) {
        if (code === 442) {
          ElMessage.error("请求参数异常");
        } else if (code === 445) {
          ElMessage.error("请求不合法");
        } else if (code === 50000) {
          ElMessage.error(message);
        } else {
          ElMessage.error(errorMessage);
        }
        console.log(message);
        return Promise.resolve({ success, code, message });
      }
      const { data, metadata } = resData;
      return Promise.resolve({ success, code, message, data, metadata });
    })
    .catch((e) => {
      const { message } = e;
      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: "请求超时",
          code: 504,
        });
      }

      return Promise.resolve({ e });
    });
};

export default curl;
