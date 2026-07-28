Harness 图表资产说明
====================

每张发布图片都有三种同名资产：

- .mmd：位于文章源目录中，便于代码审查和差异比较的 Mermaid 文本源。
- .drawio：可在 Draw.io 中继续编辑的发布源文件。
- .png：文章直接引用的渲染结果。

修改流程固定为：审查并修改 .mmd，重新生成 .drawio，再从该 .drawio
导出 .png。因此 .mmd 记录可审查的语义，.drawio 是最终可编辑发布源，
二者不应手工产生分歧。

资产映射：

- 01-harness-overview：第 1 篇，Harness 边界与模型—工具循环
- 02-enterprise-architecture：第 2 篇，企业分层、模型、Runtime、子代理与持久化
- 03-context-memory-skills：第 6 篇，上下文、技能、短期状态与长期记忆
- 04-sandbox-hitl：第 7 篇，沙箱和 LangGraph interrupt / Command 恢复
- 05-async-subagents：第 9 篇，异步子代理任务生命周期
- 06-procurement-flow：第 10 篇，采购缺口、供应商筛选和审批流程

图中的边界以固定版本示例和官方文档为准；业务示例数据不是原课程提供的数据。
