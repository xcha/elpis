module.exports = (app) => {
  const BaseService = require("./base")(app);
  const modelList = require("../../model/index")(app);
  return class ProjectService extends BaseService {
    get(projKey) {
      let projConfig;

      modelList.forEach((modelItem) => {
        if (modelItem.project[projKey]) {
          projConfig = modelItem.project[projKey];
        }
      });
      return projConfig;
    }

    async getModelList() {
      return modelList;
    }

    getList({ projKey }) {
      return modelList.reduce((preList, modelItem) => {
        const { project } = modelItem;

        // 如果有传 projKey 则只去当前同模型下的项目，不传的情况下则取全量。
        if (projKey && !project[projKey]) {
          return preList;
        }

        for (const pKey in project) {
          preList.push(project[pKey]);
        }

        return preList;
      }, []);
    }
  };
};
