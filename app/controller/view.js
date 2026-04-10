module.exports = (app) => {
  return class ViewController {
    /**
     * 从路径中提取入口名称
     * @param {string} path 完整路径
     * @returns {string} 入口名称
     */
    getEntryName(path) {
      // 移除开头的 /view/
      const pathWithoutPrefix = path.replace(/^\/view\//, '')
      // 获取第一个 / 之前的内容，如果没有 / 则返回整个字符串
      const entryName = pathWithoutPrefix.split('/')[0]
      return entryName || 'projectList' // 如果没有找到入口名称，默认返回 projectList
    }

    /**
     * 渲染页面
     * @param {Object} ctx 上下文对象
     */
    async renderPage(ctx) {
      const path = ctx.path
      const entryName = this.getEntryName(path)
      const { query, params } = ctx.request

      app.logger.info(`[ViewController] projKey: ${ctx.query?.proj_key}`)
      app.logger.info(`[ViewController] query: ${JSON.stringify(query)}`)
      app.logger.info(`[ViewController] params: ${JSON.stringify(params)}`)
      app.logger.info(`[ViewController] path: ${JSON.stringify(path)}`)
      await ctx.render(`dist/entry.${entryName}`, {
        __ELPIS_PROJ_KEY__: ctx.query?.proj_key,
        __ELPIS_NAME__: app.options?.name,
        __ELPIS_OPTIONS__: JSON.stringify(app.options),
        __ELPIS_ENTRY_NAME__: entryName
      })
    }
  }
}
