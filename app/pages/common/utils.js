import zhCN from './zod.json'

// 防抖处理
export const debounce = (fn, delay = 100) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 格式化列表数据
 */
export const buildTableData = (listData = [], schema = {}) => {
  if (!schema?.properties) return listData
  return listData.map((rowData) => {
    const newRow = { ...rowData }
    for (const key in newRow) {
      const schemaItem = schema.properties[key]
      // 处理 toFixed
      if (schemaItem?.option?.toFixed !== undefined) {
        newRow[key] = Number(newRow[key]).toFixed(schemaItem.option.toFixed)
      }
    }
    return newRow
  })
}

/**
 * zod 中文转换专用
 */
const formatValue = (value, format) => {
  if (!format) return value

  // 日期格式化
  if (format === 'datetime') {
    if (!value) return ''
    // 你可以用 dayjs、moment 或原生 Date 格式化
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
    if (isNaN(date.getTime())) return value
    return date.toLocaleString('zh-CN', { hour12: false })
  }

  // 数组格式化
  if (format === 'array') {
    return Array.isArray(value) ? value.join(', ') : value
  }

  if (format === 'boolean') return value ? '是' : '否'

  if (format === 'number') return Number(value).toLocaleString('zh-CN')

  // 其他自定义格式
  // if (format === 'xxx') { ... }

  return value
}
const template = (str, params = {}) => {
  return str.replace(/\{\{(-)?\s*([\w,]+)\s*(?:,\s*(\w+))?\s*\}\}/g, (_, dash, key, format) => {
    let value = params[key.trim()] ?? ''
    value = formatValue(value, format)
    return value
  })
}
export const zodI18nMap = (issue, ctx) => {
  const errors = zhCN.errors
  let message = ctx.defaultError

  // 处理 invalid_type_received_undefined/null
  if (
    issue.code === 'invalid_type' &&
    issue.received === 'undefined' &&
    errors.invalid_type_received_undefined
  ) {
    message = errors.invalid_type_received_undefined
  } else if (
    issue.code === 'invalid_type' &&
    issue.received === 'null' &&
    errors.invalid_type_received_null
  ) {
    message = errors.invalid_type_received_null
  } else if (issue.code === 'invalid_type') {
    message = template(errors.invalid_type, {
      expected: zhCN.types[issue.expected] || issue.expected,
      received: zhCN.types[issue.received] || issue.received
    })
  } else if (issue.code === 'invalid_literal') {
    message = template(errors.invalid_literal, { expected: issue.expected })
  } else if (issue.code === 'unrecognized_keys') {
    message = template(errors.unrecognized_keys, { keys: issue.keys?.join(', ') })
  } else if (issue.code === 'invalid_enum_value') {
    message = template(errors.invalid_enum_value, {
      received: issue.received,
      options: issue.options?.join(', ')
    })
  } else if (issue.code === 'invalid_string') {
    const validation = issue.validation
    if (errors.invalid_string && errors.invalid_string[validation]) {
      message = template(errors.invalid_string[validation], {
        validation: zhCN.validations[validation] || validation
      })
    } else {
      message = errors.invalid_string?.regex || ctx.defaultError
    }
  } else if (issue.code === 'too_small' || issue.code === 'too_big') {
    const type = issue.type
    const inclusive = issue.inclusive
    const exact = issue.exact
    let errorObj = errors[issue.code]?.[type]
    if (errorObj) {
      if (exact) {
        message = template(errorObj.exact, issue)
      } else if (inclusive) {
        message = template(errorObj.inclusive, issue)
      } else {
        message = template(errorObj.not_inclusive, issue)
      }
    }
  } else if (errors[issue.code]) {
    message = errors[issue.code]
  }

  return { message }
}
