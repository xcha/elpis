import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "$store/menu.js";

export const useSchema = function () {
  const route = useRoute();
  const menuStore = useMenuStore();
  const api = ref("");
  const tableSchema = ref({});
  const tableConfig = ref({});

  // 构造 schemaConfig 相关配置，输送给 schemaView 解释。
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query;
    const mItem = menuStore.findMenuItem({
      key: "key",
      value: siderKey ?? key,
    });

    if (mItem?.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;
      api.value = sConfig.api ?? "";
      // ✅ 修正：清空后重新赋值
      tableSchema.value = {};
      tableConfig.value = undefined;

      nextTick(() => {
        // ✅ 修正：传入正确的参数
        tableSchema.value = buildDtoSchema(sConfig, "table");
        tableConfig.value = sConfig.tableConfig;
      });
    }
  };

  /**
   * 通用构建 schema 方法
   * @param {Object} schemaConfig - 原始 schema 配置
   * @param {string} comName - 组件名称（如 'table'、'form' 等）
   * @returns {Object} 处理后的 schema
   */
  const buildDtoSchema = (schemaConfig, comName) => {
    // ✅ 修正：使用传入的参数
    if (!schemaConfig?.schema?.properties) {
      return { type: "object", properties: {} };
    }

    const sourceProperties = schemaConfig.schema.properties;
    const dtoSchema = {
      type: "object",
      properties: {},
    };

    // 提取有效 schema 字段信息
    for (const key in sourceProperties) {
      const props = sourceProperties[key];
      const optionKey = `${comName}Option`; // 如 'tableOption'

      // 检查是否有对应的 Option 配置
      if (props[optionKey]) {
        // 提取 props 中非 option 的部分
        const dtoProps = {};

        for (const pKey in props) {
          // 跳过以 Option 结尾的属性
          if (!pKey.endsWith("Option")) {
            dtoProps[pKey] = props[pKey];
          }
        }

        // 添加 option 属性
        dtoSchema.properties[key] = {
          ...dtoProps,
          option: props[optionKey],
        };
      }
    }

    return dtoSchema;
  };

  // 监听路由和菜单变化
  watch(
    [
      () => route.query.key,
      () => route.query.sider_key,
      () => menuStore.menuList,
    ],
    () => {
      buildData();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    buildData();
  });

  return {
    api,
    tableConfig,
    tableSchema,
  };
};
