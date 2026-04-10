import input from './components/input'
import inputNumber from './components/inputNumber'
import select from './components/select'
import textarea from './components/textarea'

// 业务拓展 form-item 配置
import BussinessFormItemConfig from '@bussinessFormItemConfig'

const FormItemConfig = {
  input: {
    component: input
  },
  inputNumber: {
    component: inputNumber
  },
  select: {
    component: select
  },
  textarea: {
    component: textarea
  }
}

export default {
  ...FormItemConfig,
  ...BussinessFormItemConfig
}
