import input from './components/input'
import select from './components/select'
import dynamicSelect from './components/dynamicSelect'
import dateRange from './components/dateRange'

// 业务拓展 search-item 配置
import BussinessSearchItemConfig from '@bussinessSearchItemConfig'

const SearchItemConfig = {
  input: {
    component: input
  },
  select: {
    component: select
  },
  dynamicSelect: {
    component: dynamicSelect
  },
  dateRange: {
    component: dateRange
  }
}

export default {
  ...SearchItemConfig,
  ...BussinessSearchItemConfig
}
