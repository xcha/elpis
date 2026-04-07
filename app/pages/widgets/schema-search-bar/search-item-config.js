import input from "./complex-view/input/input.vue";
import select from "./complex-view/select/select.vue";
import dynamicSelect from "./complex-view/dynamic-select/dynamic-select.vue";

const SearchItemConfig = {
  input: {
    component: input,
  },
  select: {
    component: select,
  },
  dynamicSelect: {
    component: dynamicSelect,
  },
};
export default SearchItemConfig;
