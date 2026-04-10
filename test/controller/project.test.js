const { describe, it, beforeAll } = require('@jest/globals')
const supertest = require('supertest')
const md5 = require('md5')
const elpisCore = require('../../elpis-core')

const sigbKey = 'b4f00857d45ea9ea2ec28cbf43b3c543'
const st = Date.now()

describe('测试 project 相关接口', () => {
  let modelList
  const projectList = []

  let request

  jest.setTimeout(60000)

  beforeAll(async () => {
    const app = await elpisCore.start()
    modelList = require('../../model/index.js')(app)
    projectList.push(...modelList.flatMap((m) => Object.values(m.project)))
    request = supertest(app.listen())
  })

  // 提取公共请求配置
  const getSignature = () => ({
    s_sign: md5(`${sigbKey}_${st}`),
    s_t: st
  })

  it('GET /api/project without proj_key', async () => {
    const res = await request.get('/api/project').set(getSignature())
    expect(res.body).toEqual({
      success: false,
      code: 442,
      message: expect.stringContaining("required property 'proj_key'")
    })
  })

  it('GET /api/project fail', async () => {
    const res = await request.get('/api/project').set(getSignature()).query({
      proj_key: 'xxxxx'
    })
    expect(res.body).toEqual({
      success: false,
      code: 50000,
      message: expect.stringContaining('获取项目异常')
    })
  })

  it('GET /api/project with proj_key', async () => {
    // 校验 menu 菜单
    const checkMenuItem = (menuItem) => {
      console.log('--------------- GET /api/project with proj_key: menuKey:', menuItem.key)
      expect(menuItem).toMatchObject({
        key: expect.any(String),
        name: expect.any(String),
        menuType: expect.stringMatching(/group|module/)
      })

      if (menuItem.menuType === 'group') {
        expect(Array.isArray(menuItem.subMenu)).toBe(true)
        menuItem.subMenu.forEach((subMenuItem) => {
          expect(subMenuItem.key).toBeTruthy()
          expect(subMenuItem.name).toBeTruthy()
          expect(subMenuItem.menuType).toBe('module')
          checkMenuItem(subMenuItem)
        })
      }

      if (menuItem.menuType === 'module') {
        checkModule(menuItem)
      }
    }

    // 检查 module 菜单配置
    const checkModule = (menuItem) => {
      const { moduleType } = menuItem
      expect(moduleType).toBeTruthy()

      if (moduleType === 'sider') {
        const { siderConfig } = menuItem
        expect(typeof siderConfig).toBe('object')
        expect(Array.isArray(siderConfig.menu)).toBe(true)
        siderConfig.menu.forEach((menuItem) => {
          checkMenuItem(menuItem)
        })
      }

      if (moduleType === 'iframe') {
        const { iframeConfig } = menuItem
        expect(typeof iframeConfig).toBe('object')
        expect(iframeConfig.path).toBeTruthy()
      }

      if (moduleType === 'custom') {
        const { customConfig } = menuItem
        expect(typeof customConfig).toBe('object')
        expect(customConfig.path).toBeTruthy()
      }

      if (moduleType === 'schema') {
        const { schemaConfig } = menuItem
        expect(typeof schemaConfig).toBe('object')
        expect(schemaConfig.api).toBeDefined()
        expect(schemaConfig.schema).toBeTruthy()
      }
    }

    for (const projItem of projectList) {
      console.log('--------------- GET /api/project with proj_key:', projItem.key)
      const res = await request
        .get('/api/project')
        .set(getSignature())
        .query({ proj_key: projItem.key })

      expect(res.body.success).toBe(true)

      const resData = res.body.data
      expect(resData.key).toBe(projItem.key)
      expect(resData.modelKey).toBeTruthy()
      expect(resData.name).toBeTruthy()
      expect(resData.desc).toBeDefined()
      expect(resData.homePage).toBeDefined()

      const { menu } = res.body.data
      menu.forEach((menuItem) => {
        checkMenuItem(menuItem)
      })
    }
  })

  it('GET /api/project/list without proj_key', async () => {
    const res = await request.get('/api/project/list').set(getSignature())
    expect(res.body.success).toBe(true)

    const resData = res.body.data
    expect(resData.length).toBe(projectList.length)
    resData.forEach((item) => {
      expect(item.key).toBeTruthy()
      expect(item.modelKey).toBeTruthy()
      expect(item.name).toBeTruthy()
      expect(item.desc).toBeDefined()
      expect(item.homePage).toBeDefined()
    })
  })

  it('GET /api/project/list with proj_key', async () => {
    const { key: projKey } = projectList[Math.floor(Math.random() * projectList.length)]
    const { modelKey } = projectList.find((item) => item.key === projKey)

    const res = await request.get('/api/project/list').set(getSignature()).query({
      proj_key: projKey
    })
    expect(res.body.success).toBe(true)

    const resData = res.body.data
    expect(projectList.filter((item) => item.modelKey === modelKey).length).toBe(resData.length)
    resData.forEach((item) => {
      expect(item.modelKey).toBeTruthy()
      expect(item.key).toBeTruthy()
      expect(item.name).toBeTruthy()
      expect(item.desc).toBeDefined()
      expect(item.homePage).toBeDefined()
    })
  })

  it('GET /api/project/model_list', async () => {
    const res = await request.get('/api/project/model_list').set(getSignature())
    expect(res.body.success).toBe(true)

    const resData = res.body.data
    expect(resData.length).toBeGreaterThan(0)

    resData.forEach((item) => {
      expect(item.model).toBeDefined()
      expect(item.model.key).toBeTruthy()
      expect(item.model.name).toBeTruthy()
      expect(item.project).toBeDefined()
      Object.values(item.project).forEach((project) => {
        expect(project.key).toBeTruthy()
        expect(project.name).toBeTruthy()
      })
    })
  })
})
