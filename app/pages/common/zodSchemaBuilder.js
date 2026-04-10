import { z } from 'zod'
import { zodI18nMap } from './utils'

z.setErrorMap(zodI18nMap)

/**
 * 根据 JSON Schema 构建对应的 Zod Schema
 * @param {Object} schema - JSON Schema 对象
 * @returns {z.ZodType} Zod Schema
 */
export const buildZodSchema = (schema) => {
  const {
    type,
    minimum,
    maximum,
    minLength,
    maxLength,
    pattern,
    enum: enumValues,
    format,
    multipleOf,
    exclusiveMinimum,
    exclusiveMaximum,
    minItems,
    maxItems,
    uniqueItems,
    items,
    properties,
    required,
    minProperties,
    maxProperties,
    const: constValue
  } = schema

  let zodSchema

  // 根据类型创建基础 schema
  switch (type) {
    case 'string':
      zodSchema = z.string()
      break
    case 'number':
      zodSchema = z.number()
      break
    case 'integer':
      zodSchema = z.number().int()
      break
    case 'boolean':
      zodSchema = z.boolean()
      break
    case 'array':
      zodSchema = z.array(z.any())
      break
    case 'object':
      zodSchema = z.object({})
      break
    case 'null':
      zodSchema = z.null()
      break
    default:
      zodSchema = z.any()
  }

  // 1. 数值验证 (number, integer)
  if (type === 'number' || type === 'integer') {
    // 最小值验证
    if (minimum !== undefined) {
      if (exclusiveMinimum) {
        zodSchema = zodSchema.gt(minimum, `必须大于 ${minimum}`)
      } else {
        zodSchema = zodSchema.min(minimum, `最小值应为 ${minimum}`)
      }
    }

    // 最大值验证
    if (maximum !== undefined) {
      if (exclusiveMaximum) {
        zodSchema = zodSchema.lt(maximum, `必须小于 ${maximum}`)
      } else {
        zodSchema = zodSchema.max(maximum, `最大值应为 ${maximum}`)
      }
    }

    // 倍数验证
    if (multipleOf !== undefined) {
      zodSchema = zodSchema.refine((val) => val % multipleOf === 0, `必须是 ${multipleOf} 的倍数`)
    }
  }

  // 2. 字符串验证
  if (type === 'string') {
    // 长度验证
    if (minLength !== undefined) {
      zodSchema = zodSchema.min(minLength, `最小长度应为 ${minLength}`)
    }

    if (maxLength !== undefined) {
      zodSchema = zodSchema.max(maxLength, `最大长度应为 ${maxLength}`)
    }

    // 正则表达式验证
    if (pattern) {
      zodSchema = zodSchema.regex(new RegExp(pattern), '格式不正确')
    }

    // 格式验证
    if (format) {
      switch (format) {
        case 'email':
          zodSchema = zodSchema.email('邮箱格式不正确')
          break
        case 'url':
          zodSchema = zodSchema.url('URL格式不正确')
          break
        case 'uri':
          zodSchema = zodSchema.url('URI格式不正确')
          break
        case 'date':
          zodSchema = zodSchema.regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确 (YYYY-MM-DD)')
          break
        case 'date-time':
          zodSchema = zodSchema.regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
            '日期时间格式不正确'
          )
          break
        case 'time':
          zodSchema = zodSchema.regex(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
            '时间格式不正确 (HH:MM:SS)'
          )
          break
        case 'ipv4':
          zodSchema = zodSchema.regex(
            /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            'IPv4格式不正确'
          )
          break
        case 'ipv6':
          zodSchema = zodSchema.regex(
            /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
            'IPv6格式不正确'
          )
          break
        case 'uuid':
          zodSchema = zodSchema.uuid('UUID格式不正确')
          break
        case 'phone':
          zodSchema = zodSchema.regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
          break
        case 'idcard':
          zodSchema = zodSchema.regex(
            /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            '身份证号格式不正确'
          )
          break
      }
    }
  }

  // 3. 数组验证
  if (type === 'array') {
    // 数组长度验证
    if (minItems !== undefined) {
      zodSchema = zodSchema.min(minItems, `最少需要 ${minItems} 个元素`)
    }

    if (maxItems !== undefined) {
      zodSchema = zodSchema.max(maxItems, `最多只能有 ${maxItems} 个元素`)
    }

    // 唯一性验证
    if (uniqueItems) {
      zodSchema = zodSchema.refine((arr) => arr.length === new Set(arr).size, '数组元素必须唯一')
    }

    // 数组元素验证
    if (items) {
      if (Array.isArray(items)) {
        // 元组验证
        const tupleSchema = items.map((item) => buildZodSchema(item))
        zodSchema = z.tuple(tupleSchema)
      } else {
        // 统一元素验证
        const itemSchema = buildZodSchema(items)
        zodSchema = z.array(itemSchema)
      }
    }
  }

  // 4. 对象验证
  if (type === 'object') {
    if (properties || required) {
      const objectSchema = {}

      // 构建对象属性
      if (properties) {
        Object.keys(properties).forEach((key) => {
          const isRequired = required && required.includes(key)
          const propSchema = buildZodSchema(properties[key])
          objectSchema[key] = isRequired ? propSchema : propSchema.optional()
        })
      }

      zodSchema = z.object(objectSchema)

      // 属性数量验证
      if (minProperties !== undefined) {
        zodSchema = zodSchema.refine(
          (obj) => Object.keys(obj).length >= minProperties,
          `至少需要 ${minProperties} 个属性`
        )
      }

      if (maxProperties !== undefined) {
        zodSchema = zodSchema.refine(
          (obj) => Object.keys(obj).length <= maxProperties,
          `最多只能有 ${maxProperties} 个属性`
        )
      }
    }
  }

  // 5. 枚举验证
  if (enumValues && Array.isArray(enumValues)) {
    if (type === 'string') {
      zodSchema = z.enum(enumValues, {
        errorMap: () => ({ message: '取值超出枚举范围' })
      })
    } else {
      zodSchema = zodSchema.refine((val) => enumValues.includes(val), '取值超出枚举范围')
    }
  }

  // 6. 常量验证
  if (constValue !== undefined) {
    zodSchema = zodSchema.refine((val) => val === constValue, `值必须等于 ${constValue}`)
  }

  return zodSchema
}

/**
 * 验证数据并返回错误信息
 * @param {Object} schema - JSON Schema 对象
 * @param {any} value - 要验证的值
 * @returns {Object} { isValid: boolean, errorMessage: string }
 */
export const validateWithZod = (schema, value) => {
  try {
    const zodSchema = buildZodSchema(schema)
    zodSchema.parse(value)
    return { isValid: true, errorMessage: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { isValid: false, errorMessage: firstError.message }
    }
    return { isValid: false, errorMessage: '验证失败' }
  }
}
