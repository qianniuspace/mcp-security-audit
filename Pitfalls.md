# 开发注意事项

## MCP 规范
- 执行代码中不能打印日志
- 可以 catch 异常或抛出异常
- 只能返回结果

## npm audit 优化
使用 npm-registry-fetch 远程调用 npm audit api，替代本地 npm audit 执行

## npm 包发布
- 使用 GitHub Actions 自动发布 npm 包
- 参考文档：https://juejin.cn/post/7457070778098892840

## npm scripts 注意事项
- 使用 `--ignore-scripts` 禁用 npm 生命周期脚本的自动执行
- 在 Docker 多阶段构建中尤其重要，避免生产环境重复执行编译

## 接口规范
返回格式固定为：
```json
{
    "content": [{
        // ... 数据结构
    }]
}
```