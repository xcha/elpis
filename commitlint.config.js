module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // 关闭 subject-case 检查
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']]
  }
}
