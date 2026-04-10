# 接口404处理指南

## 概述

本文档介绍了在Elpis项目中如何处理接口404错误的完整方案。

## 处理策略

### 1. 路由层面处理

在 `elpis-core/loader/router.js` 中，我们实现了智能的404处理：

- **API请求** (`/api/*`): 返回JSON格式的404错误信息
- **页面请求**: 重定向到首页

### 2. 中间件层面处理

在 `app/middleware/error-handler.js` 中，我们统一处理所有404错误：

```javascript
// 处理404错误（如果路由没有匹配到任何处理器）
if (ctx.status === 404) {
  // 判断是否为API请求
  if (ctx.path.startsWith('/api/')) {
    ctx.body = {
      success: false,
      code: 40400,
      message: '接口不存在',
      path: ctx.path,
      method: ctx.method
    }
  } else {
    // 页面404处理
    ctx.body = {
      success: false,
      code: 40400,
      message: '页面不存在',
      path: ctx.path
    }
  }
  return
}
```

### 3. 控制器层面处理

在控制器中，可以使用以下方法处理404：

```javascript
// 检查资源是否存在
const product = await this.service.business.getById(id)
if (!product) {
  // 使用404处理
  this.handleApi404(ctx, ctx.path, ctx.method)
  return
}
```

## 工具函数

### 基础工具函数 (`app/common/utils.js`)

- `success(ctx, data, metadata)`: 统一成功响应
- `fail(ctx, message, code, data)`: 统一错误响应
- `handleApi404(ctx, path, method)`: 处理API 404错误
- `handlePage404(ctx, path)`: 处理页面404错误
- `isApiRequest(path)`: 检查是否为API请求

### 基础控制器 (`app/controller/base.js`)

所有控制器都继承自BaseController，可以直接使用：

```javascript
class BusinessController extends BaseController(app) {
  async getDetail(ctx) {
    const { id } = ctx.params
    const data = await this.service.business.getById(id)

    if (!data) {
      // 使用404处理
      this.handleApi404(ctx, ctx.path, ctx.method)
      return
    }

    this.success(ctx, data)
  }
}
```

## 响应格式

### API 404响应格式

```json
{
  "success": false,
  "code": 40400,
  "message": "接口不存在",
  "path": "/api/nonexistent",
  "method": "GET"
}
```

### 页面404响应格式

```json
{
  "success": false,
  "code": 40400,
  "message": "页面不存在",
  "path": "/nonexistent-page"
}
```

## 最佳实践

### 1. 在控制器中使用404处理

```javascript
async getResource(ctx) {
  const { id } = ctx.params
  const resource = await this.service.getById(id)

  if (!resource) {
    this.handleApi404(ctx, ctx.path, ctx.method)
    return
  }

  this.success(ctx, resource)
}
```

### 2. 自定义404消息

```javascript
// 可以自定义404消息
ctx.body = {
  success: false,
  code: 40400,
  message: '用户不存在',
  path: ctx.path,
  method: ctx.method
}
```

### 3. 日志记录

建议在404处理时记录日志：

```javascript
app.logger.warn(`404错误: ${ctx.method} ${ctx.path}`, {
  userAgent: ctx.headers['user-agent'],
  ip: ctx.ip
})
```

## 注意事项

1. **区分API和页面请求**: 使用路径前缀 `/api/` 来区分
2. **统一响应格式**: 所有404响应都遵循统一的JSON格式
3. **包含必要信息**: 响应中包含路径、方法等信息
4. **适当的日志记录**: 记录404错误以便调试和监控
5. **用户体验**: 页面404可以重定向到首页，API 404返回JSON格式错误信息
