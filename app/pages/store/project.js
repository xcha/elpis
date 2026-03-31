import { defineStore } from "pinia";
import { ref } from "vue";
export const useProjectStore = defineStore("Project", () => {
  //菜单列表
  const projectList = ref([]);
  //设置菜单列表
  const setProjectList = function (list) {
    projectList.value = list;
  };

  return {
    projectList,
    setProjectList,
  };
});
