import createForm from './components/createForm'
import editForm from './components/editForm'
import detailPanel from './components/detailPanel'

// 业务拓展 component 配置
import BussinessComponentConfig from '@bussinessComponentConfig'

const ComponentConfig = {
  createForm: {
    component: createForm
  },
  editForm: {
    component: editForm
  },
  detailPanel: {
    component: detailPanel
  }
}

export default {
  ...ComponentConfig,
  ...BussinessComponentConfig
}
