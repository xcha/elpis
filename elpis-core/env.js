module.exports = () => {
  return {
    isLocal() {
      return process.env._ENV === "local";
    },
    isBeta() {
      return process.env._ENV === "beta";
    },
    isProduction() {
      return process.env._ENV === "prod";
    },
    get() {
      return process.env._ENV ?? "local1";
    },
  };
};
