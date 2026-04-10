module.exports = () => ({
  isLocal: () => process.env.NODE_ENV === 'local',
  isBeta: () => process.env.NODE_ENV === 'beta',
  isProd: () => process.env.NODE_ENV === 'production',
  get: () => process.env.NODE_ENV ?? 'local'
})
