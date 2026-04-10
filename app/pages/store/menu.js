import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // 菜单列表
  const menuList = ref([])

  // 设置菜单列表
  const setMenuList = (list) => {
    menuList.value = list
  }

  /**
   * 找出菜单目录
   * @param  key 菜单目录的 key
   * @param  value 菜单目录的 value
   * @param  mList 菜单列表
   */
  const findMenuItem = ({ key, value }, mList = menuList.value) => {
    for (let i = 0; i < mList.length; i++) {
      const menuItem = mList[i]
      if (!menuItem) continue

      const { menuType, moduleType } = menuItem

      if (menuItem[key] === value) {
        return menuItem
      }
      if (menuType === 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu)
        if (mItem) return mItem
      }
      if (moduleType === 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu)
        if (mItem) return mItem
      }
    }
    return null
  }

  /**
   * 找出菜单列表中的第一个菜单项
   * @param  mList 菜单列表
   */
  const findFirstMenuItem = (mList = menuList.value) => {
    if (!mList || mList.length === 0) return null
    let firstMenuItem = mList[0]
    if (firstMenuItem.subMenu && firstMenuItem.subMenu.length > 0) {
      firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu)
    }
    return firstMenuItem
  }
  return { menuList, setMenuList, findMenuItem, findFirstMenuItem }
})
