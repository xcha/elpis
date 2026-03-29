const _ = require("lodash");
const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 *解析model配置，并返回组织继承后的数据结构
 [{
  module:${model}
  project:{
    proj1Key:${proj1}
    proj2Key:${proj2}
    }
 }]
 */
// project 继承 model 方法
const projectExtendModel = (model, project) => {
  return _.mergeWith({}, model, project, (modelVal, projVal) => {
    if (Array.isArray(modelVal) && Array.isArray(projVal)) {
      let res = [];
      // 因为project继承model，所以需要处理修改和新增内容的情况
      // project有的键值，model也有=>修改（重载）
      // project有的键值，model没有=>新增
      // model有的键值，project没有=>保留（继承）

      // 处理修改
      for (let i = 0; i < modelVal.length; i++) {
        let modelItem = modelVal[i];
        let projItem = projVal.find((item) => item.key === modelItem.key);
        // 处理修改
        res.push(
          projItem ? projectExtendModel(modelItem, projItem) : modelItem,
        ); //project有的键值,model也有,则递归调用projectExtendModel覆盖
      }
      // 处理新增
      for (let i = 0; i < projVal.length; i++) {
        let projItem = projVal[i];
        let modelItem = modelVal.find((item) => item.key === projItem.key);
        // 处理新增 (如果 model 中没有该项，则添加)
        if (!modelItem) {
          res.push(projItem);
        }
      }
      return res;
    }
    // 对于非数组类型，返回 undefined 会让 lodash 使用默认的合并行为
    return undefined;
  });
};

module.exports = (app) => {
  const modelList = [];
  //遍历当前文件夹，构造模型数据结构，挂载到modelList上
  const modelPath = path.resolve(app.baseDir, `.${sep}model`);
  const fileList = glob.sync(path.resolve(modelPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    if (file.indexOf("index.js") > -1) {
      // 忽略index.js
      return;
    }
    const type = file.indexOf(`/project/`) > -1 ? "project" : "model";

    if (type === "project") {
      const modelKey = file.match(/\/model\/(.*?)\/project/)?.[1];
      const projKey = file.match(/\/project\/(.*?)\.js/)?.[1];
      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      if (!modelItem) {
        // 初始化结构
        modelItem = {};
        modelList.push(modelItem);
      }
      if (!modelItem.project) modelItem.project = {};
      modelItem.project[projKey] = require(path.resolve(file));
      modelItem.project[projKey].key = projKey; // 注入projKey
      modelItem.project[projKey].modelKey = modelKey; // 注入modelKey
    }

    if (type === "model") {
      const modelKey = file.match(/\/model\/(.*?)\/model\.js/)?.[1];
      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      if (!modelItem) {
        // 初始化结构
        modelItem = {};
        modelList.push(modelItem);
      }
      modelItem.model = require(path.resolve(file));
      modelItem.model.key = modelKey;
    }
  });

  modelList.forEach((item) => {
    const { model, project } = item;
    for (const key in project) {
      project[key] = projectExtendModel(model, project[key]);
    }
  });

  return modelList;
};
