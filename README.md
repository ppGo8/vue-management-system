# vue-manage-system

<a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/static/v1?label=vue&message=2.6.14&color=green"/>
 </a><a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/static/v1?label=element-ui&message=2.15.13&color=green"/> 
</a>

基于vue2+ Element UI开发的后台管理系统。项目功能较为完善，实现逻辑简单。

## 技术栈

- UI：Element-ui
- Vue全家桶：vue2、vue-router、vuex、axios
- 后台接口：nodejs、express、mysql，编写Restful风格接口
- 打包上线：使用webpack优化项目打包，申请、配置阿里云服务器，将项目打包上线。（服务器申请不到3个月不能进行ICP备案，所以还不能访问）

## 功能 

-  登录/登出
-  注册
-  首页与个人中心
-  tags
-  面包屑
    - 显示当前用户所在的路径
-  表单功能
      - 支持增删改查
      - 支持分页显示、设置页码大小
      - 支持搜索查询
-  文件管理
    - 文件上传、多文件上传
    - 大文件上传，支持断点续传和进度条功能
    - excel上传和下载，支持拖拽上传
-  富文本/markdown编辑器
-  权限管理和动态路由
   - 分为管理员和普通员工两个权限
     - 不同权限可访问的url不同
     - 不同权限会显示不同的内容

## 项目运行

数据都是从后端获得得到，因此该项目的运行需要和[后端项目](https://github.com/ppGo8/vue-management-system-api)相互配合。

:sunflower: 最近会写`mock`拦截ajax请求，生成数据，使得项目可以单独运行。

## 项目截图

### 登录&&注册

![image-20230823103236030](README.assets/image-20230823103236030.png)

![image-20230823103618077](README.assets/image-20230823103618077.png)

### 首页

![image-20230823103659944](README.assets/image-20230823103659944.png)

### 用户管理

![image-20230823103320955](README.assets/image-20230823103320955.png)

### 资金管理

![image-20230823103348474](README.assets/image-20230823103348474.png)

### 文件管理

#### 文件上传

![image-20230823103403470](README.assets/image-20230823103403470.png)

#### 上传excel

![image-20230823103420559](README.assets/image-20230823103420559.png)

#### 导出excel

![image-20230823103509770](README.assets/image-20230823103509770.png)

### 上传excel

![image-20230823103432894](README.assets/image-20230823103432894.png)

### 编辑器

#### 富文本编辑器

![image-20230823103517073](README.assets/image-20230823103517073.png)

#### markdown编辑器

![image-20230823103532887](README.assets/image-20230823103532887.png)
