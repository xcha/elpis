module.exports = (app) => {
  return class ProjectService {
    async getList() {
      return [
        {
          name: "projectl",
          desc: "projectl desc",
        },
        {
          name: "project2",
          desc: "project2 desc",
        },
        {
          name: "project3",
          desc: "project3 desc",
        },
      ];
    }
  };
};
