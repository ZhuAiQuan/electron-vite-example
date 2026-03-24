# Electron 主进程架构升级 - 简历描述

## 一、一句话版（技术栈 / 项目简介）

Electron 主进程采用类 Nest 的 IoC/DI 与装饰器驱动的 IPC 通道注册架构，Preload 按 Main 下发的通道表自动生成渲染进程 API，实现声明式、可扩展的进程间通信。

---

## 二、技术亮点 / 负责内容（3～5 条）

- **主进程架构升级**：在 Electron Main 中引入类 Nest 的 IoC 容器（ServiceManage/ControllerManage）与模块化注册（Module → register(ctx)），实现依赖注入与分层清晰的主进程结构。
- **声明式 IPC 通道**：通过 `@Controller(name)`、`@Handle()` 装饰器收集 IPC 处理方法，在 ControllerManage 中统一注册到 `ipcMain.handle`，并统一错误包装与返回格式，避免散落手写 channel。
- **Preload 与 Main 协同**：Main 通过 `getAllHandle` 将当前注册的 channel 表下发给 Preload，Preload 根据表动态生成 `api[module][method]` 并 expose 到渲染进程，新增/删除 Controller 无需改 Preload 代码。
- **生命周期与资源释放**：在 ControllerManage 的 cleanup 中按注册记录统一 `removeHandler` 所有 channel 并调用各 Controller 的 dispose，避免 IPC 监听残留。
- **可维护性与扩展性**：新业务只需新增带 `@Controller`/`@Handle` 的 Controller 并在对应 Module 中 register，即可自动完成 channel 注册与渲染端 API 暴露，便于团队协作与后续迭代。

---

## 三、完整一段话（项目描述 / 技术方案）

在 Electron 项目中主导了主进程架构升级：引入类 Nest 的 IoC/DI 设计（ServiceManage、ControllerManage、Module 注册），并采用装饰器（`@Controller`、`@Handle`）在元数据中收集 IPC 处理方法，由 ControllerManage 统一完成 channel 注册与错误包装。Preload 在初始化时向 Main 拉取已注册的 channel 表（getAllHandle），据此动态生成 `window.api[module][method]` 并通过 contextBridge 暴露给渲染进程，实现「声明式定义、自动注册、自动暴露」的进程间通信链路；同时在应用退出/窗口关闭时统一移除 IPC 监听并执行 Controller 的 dispose，保证资源释放。该方案提升了主进程的可测试性、可扩展性和团队协作效率，新功能只需新增 Controller 与 Module 注册即可接入，无需手写 channel 与 Preload 暴露逻辑。

---

## 四、简历条目示例

**项目 / 技术描述：**

- 设计并落地 Electron 主进程架构升级：类 Nest 的 IoC/DI + 装饰器驱动 IPC 通道注册，Preload 按 Main 下发的通道表自动生成渲染端 API，实现声明式、可扩展的进程间通信与统一资源释放。

**技术栈可补充：**

- Electron、IoC/DI、TypeScript 装饰器、IPC 架构设计、进程间通信
