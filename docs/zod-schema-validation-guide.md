# Zod Schema 验证指南

## 基础用法

### 1. 基本验证

```javascript
import { validateWithZod } from '@elpis/common/zodSchemaBuilder'

// 验证数据
const schema = {
  type: 'string',
  minLength: 2,
  maxLength: 10
}

const result = validateWithZod(schema, 'hello')
console.log(result) // { isValid: true, errorMessage: null }
```

### 2. 在 Vue 组件中使用

```vue
<template>
  <el-input v-model="value" @blur="validate" :class="{ error: !isValid }" />
  <div v-if="errorMessage" class="error-tip">{{ errorMessage }}</div>
</template>

<script setup>
import { ref, inject } from 'vue'

const validateWithZod = inject('validateWithZod')
const value = ref('')
const isValid = ref(true)
const errorMessage = ref('')

const schema = {
  type: 'string',
  minLength: 2,
  maxLength: 10
}

const validate = () => {
  const result = validateWithZod(schema, value.value)
  isValid.value = result.isValid
  errorMessage.value = result.errorMessage
}
</script>
```

## 验证类型详解

### 1. 字符串验证

#### 基础字符串验证

```javascript
const stringSchema = {
  type: 'string',
  minLength: 2,
  maxLength: 50
}
```

#### 正则表达式验证

```javascript
const patternSchema = {
  type: 'string',
  pattern: '^[a-zA-Z0-9]+$',
  minLength: 6,
  maxLength: 20
}
```

#### 格式验证

```javascript
// 邮箱验证
const emailSchema = {
  type: 'string',
  format: 'email'
}

// URL 验证
const urlSchema = {
  type: 'string',
  format: 'url'
}

// 手机号验证
const phoneSchema = {
  type: 'string',
  format: 'phone'
}

// 身份证号验证
const idcardSchema = {
  type: 'string',
  format: 'idcard'
}

// UUID 验证
const uuidSchema = {
  type: 'string',
  format: 'uuid'
}

// IPv4 地址验证
const ipv4Schema = {
  type: 'string',
  format: 'ipv4'
}

// IPv6 地址验证
const ipv6Schema = {
  type: 'string',
  format: 'ipv6'
}

// 日期验证
const dateSchema = {
  type: 'string',
  format: 'date'
}

// 时间验证
const timeSchema = {
  type: 'string',
  format: 'time'
}
```

### 2. 数值验证

#### 基础数值验证

```javascript
const numberSchema = {
  type: 'number',
  minimum: 0,
  maximum: 100
}
```

#### 整数验证

```javascript
const integerSchema = {
  type: 'integer',
  minimum: 1,
  maximum: 100
}
```

#### 排他性范围验证

```javascript
const exclusiveSchema = {
  type: 'number',
  minimum: 0,
  maximum: 100,
  exclusiveMinimum: true, // 大于 0
  exclusiveMaximum: true // 小于 100
}
```

#### 倍数验证

```javascript
const multipleSchema = {
  type: 'number',
  multipleOf: 5 // 必须是 5 的倍数
}
```

### 3. 数组验证

#### 基础数组验证

```javascript
const arraySchema = {
  type: 'array',
  minItems: 1,
  maxItems: 10
}
```

#### 数组元素类型验证

```javascript
const typedArraySchema = {
  type: 'array',
  items: {
    type: 'string',
    minLength: 1
  },
  minItems: 1,
  maxItems: 5
}
```

#### 元组验证

```javascript
const tupleSchema = {
  type: 'array',
  items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
}
```

#### 唯一性验证

```javascript
const uniqueArraySchema = {
  type: 'array',
  items: { type: 'string' },
  uniqueItems: true
}
```

### 4. 对象验证

#### 基础对象验证

```javascript
const objectSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    age: {
      type: 'integer',
      minimum: 18,
      maximum: 100
    },
    email: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['name', 'age']
}
```

#### 属性数量验证

```javascript
const propertyCountSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    email: { type: 'string' },
    phone: { type: 'string' }
  },
  minProperties: 2, // 至少 2 个属性
  maxProperties: 4 // 最多 4 个属性
}
```

### 5. 枚举验证

```javascript
const enumSchema = {
  type: 'string',
  enum: ['admin', 'user', 'guest']
}
```

### 6. 常量验证

```javascript
const constSchema = {
  type: 'string',
  const: 'fixed-value'
}
```

### 7. 布尔值验证

```javascript
const booleanSchema = {
  type: 'boolean'
}
```

### 8. 空值验证

```javascript
const nullSchema = {
  type: 'null'
}
```

## 复杂验证示例

### 用户注册表单

```javascript
const userRegistrationSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 50,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$'
    },
    confirmPassword: {
      type: 'string'
    },
    age: {
      type: 'integer',
      minimum: 18,
      maximum: 100
    },
    phone: {
      type: 'string',
      format: 'phone'
    },
    interests: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['reading', 'sports', 'music', 'travel', 'cooking']
      },
      minItems: 1,
      maxItems: 3,
      uniqueItems: true
    },
    profile: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'url'
        },
        bio: {
          type: 'string',
          maxLength: 200
        }
      }
    }
  },
  required: ['username', 'email', 'password', 'confirmPassword', 'age']
}
```

### 产品配置验证

```javascript
const productConfigSchema = {
  type: 'object',
  properties: {
    productId: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    price: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01
    },
    category: {
      type: 'string',
      enum: ['electronics', 'clothing', 'books', 'home']
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
        maxLength: 20
      },
      maxItems: 10,
      uniqueItems: true
    },
    specifications: {
      type: 'object',
      properties: {
        weight: {
          type: 'number',
          minimum: 0
        },
        dimensions: {
          type: 'array',
          items: [
            { type: 'number', minimum: 0 }, // 长
            { type: 'number', minimum: 0 }, // 宽
            { type: 'number', minimum: 0 } // 高
          ]
        },
        colors: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['red', 'blue', 'green', 'black', 'white']
          },
          minItems: 1
        }
      },
      required: ['weight', 'dimensions']
    },
    isActive: {
      type: 'boolean'
    }
  },
  required: ['productId', 'name', 'price', 'category'],
  minProperties: 4
}
```

## 错误处理

### 错误信息格式

```javascript
const result = validateWithZod(schema, value)

if (!result.isValid) {
  console.log(result.errorMessage) // 中文错误提示
}
```

### 常见错误信息

| 验证类型   | 错误信息示例                             |
| ---------- | ---------------------------------------- |
| 必填验证   | "不能为空"                               |
| 字符串长度 | "最小长度应为 2" / "最大长度应为 10"     |
| 数值范围   | "最小值应为 0" / "最大值应为 100"        |
| 格式验证   | "邮箱格式不正确" / "手机号格式不正确"    |
| 枚举验证   | "值必须是以下之一: admin, user, guest"   |
| 数组验证   | "最少需要 1 个元素" / "数组元素必须唯一" |
| 对象验证   | "至少需要 2 个属性"                      |

## 性能优化

### 1. Schema 缓存

```javascript
import { validateWithZod } from '@elpis/common/zodSchemaBuilder'

// 缓存编译后的 schema
const schemaCache = new Map()

function getCachedSchema(schema) {
  const key = JSON.stringify(schema)
  if (!schemaCache.has(key)) {
    schemaCache.set(key, buildZodSchema(schema))
  }
  return schemaCache.get(key)
}
```

### 2. 批量验证

```javascript
function validateBatch(schemas, values) {
  return schemas.map((schema, index) => validateWithZod(schema, values[index]))
}
```

## 迁移指南

### 从 AJV 迁移到 Zod

#### 1. 更新依赖

```bash
npm uninstall ajv
npm install zod
```

#### 2. 更新导入

```javascript
// 旧代码
import Ajv from 'ajv'
const ajv = new Ajv()

// 新代码
import { validateWithZod } from '@elpis/common/zodSchemaBuilder'
```

#### 3. 更新验证逻辑

```javascript
// 旧代码
const validate = ajv.compile(schema)
const valid = validate(value)
if (!valid) {
  console.log(validate.errors)
}

// 新代码
const result = validateWithZod(schema, value)
if (!result.isValid) {
  console.log(result.errorMessage)
}
```

## 最佳实践

### 1. Schema 设计原则

- 使用明确的类型定义
- 合理设置验证范围
- 提供有意义的错误信息
- 考虑用户体验

### 2. 性能考虑

- 缓存编译后的 schema
- 避免过度复杂的验证规则
- 合理使用可选验证

### 3. 错误处理

- 提供友好的错误提示
- 支持国际化
- 记录验证错误日志

### 4. 测试

```javascript
// 单元测试示例
describe('Zod Schema Validation', () => {
  test('should validate email format', () => {
    const schema = { type: 'string', format: 'email' }
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'

    expect(validateWithZod(schema, validEmail).isValid).toBe(true)
    expect(validateWithZod(schema, invalidEmail).isValid).toBe(false)
  })
})
```

## 常见问题

### Q: 如何添加自定义格式验证？

A: 在 `zodSchemaBuilder.js` 的 format 验证部分添加新的 case：

```javascript
case 'custom-format':
  zodSchema = zodSchema.regex(/your-regex/, '自定义格式错误信息')
  break
```

### Q: 如何支持条件验证？

A: 可以在组件中添加自定义验证逻辑：

```javascript
const conditionalSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['individual', 'company'] },
    companyName: { type: 'string' }
  }
}

// 在组件中添加条件验证
const validate = () => {
  const result = validateWithZod(schema, value)
  if (result.isValid && value.type === 'company' && !value.companyName) {
    return { isValid: false, errorMessage: '公司类型必须填写公司名称' }
  }
  return result
}
```

### Q: 如何处理异步验证？

A: Zod 支持异步验证，可以扩展 `validateWithZod` 函数：

```javascript
export async function validateWithZodAsync(schema, value) {
  try {
    const zodSchema = buildZodSchema(schema)
    await zodSchema.parseAsync(value)
    return { isValid: true, errorMessage: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { isValid: false, errorMessage: firstError.message }
    }
    return { isValid: false, errorMessage: '验证失败' }
  }
}
```

## 总结

Zod Schema 验证器提供了强大而灵活的验证功能，支持各种 JSON Schema 规范。通过合理使用这些验证规则，可以确保数据的完整性和一致性，提升用户体验。
