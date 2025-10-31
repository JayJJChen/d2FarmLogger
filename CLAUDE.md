# IMPORTANT! 重要指示
- 你每次改完代码，都需要编译整个项目，如果有任何编译错误，你需要逐一分析原因并解决。本机的微信开发者工具安装目录是: C:\Program Files (x86)\Tencent\微信web开发者工具 或者 E:\Programs\WeChatDevTools
- 项目代码不需要行间注释，但是你需要通过合理的架构、命名等方法让代码易读且易于维护
- 在你需要获取资料或者执行一些操作时，在项目的python_scripts中写python脚本解决。本windows电脑用conda管理包，你用d2MFTool这个环境来运行python脚本
- 界面的宽度、高度需要自适应，不要出现内容、按钮超出显示区域的问题

## 微信小程序编译和开发注意事项
### 编译流程
1. **TypeScript编译检查**：使用 `npx tsc --noEmit` 检查TypeScript编译错误
2. **ES5兼容性检查**：使用 `npx tsc --noEmit --target ES5 --lib ES5` 确保ES5兼容性
3. **微信开发者工具预览**：在工具中打开项目进行实际编译和测试

### 关键配置要求
- **project.config.json**：必须设置 `"es6": true` 启用ES6支持
- **避免复杂wxml表达式**：微信小程序wxml不支持复杂表达式如 `array.findIndex()`

### 代码开发严格规范
#### 禁止使用的ES6+特性（必须用ES5替代）
1. **可选链操作符 `?.`**
   - ❌ `obj?.prop?.toString()`
   - ✅ `(obj && obj.prop && obj.prop.toString()) || ''`

2. **扩展运算符 `...`**
   - ❌ `[...arr, item]`
   - ✅ `arr.concat([item])`
   - ❌ `{...obj1, ...obj2}`
   - ✅ 使用自定义 `extendObject` 方法或 `Object.assign`（需polyfill）

3. **模板字符串**
   - ❌ `` `${var} text` ``
   - ✅ `var + ' text'`

4. **解构赋值中的保留字**
   - ❌ `const { class: characterClass } = obj`
   - ✅ `const formData = obj; // 直接使用 formData.class`

#### wxml文件严格规范
1. **特殊字符限制**
   - ❌ 使用Unicode符号如 ▷、▼
   - ✅ 使用普通文字或字母替代

2. **表达式限制**
   - ❌ 复杂表达式如 `array.findIndex(...)`
   - ✅ 使用预计算的数据字段如 `selectedClassIndex`

#### 数据处理规范
1. **undefined值处理**
   - 避免直接使用undefined，使用条件判断
   - ❌ `level: level ? Number(level) : undefined`
   - ✅ 条件添加：`if (level) { obj.level = Number(level) }`

2. **对象合并**
   - 使用ES5兼容的对象合并方法
   - 自定义 `extendObject(target, source)` 替代 `Object.assign`

### 推荐开发模式
- 先用现代TypeScript语法开发
- 保持代码可读性的同时确保微信小程序兼容性

