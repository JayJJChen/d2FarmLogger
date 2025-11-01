# IMPORTANT! 重要指示
- 你每次改完代码，都需要编译整个项目，如果有任何编译错误，你需要逐一分析原因并解决。本机的微信开发者工具安装目录是: C:\Program Files (x86)\Tencent\微信web开发者工具 或者 E:\Programs\WeChatDevTools
- 项目代码不需要行间注释，但是你需要通过合理的架构、命名等方法让代码易读且易于维护
- 在你需要获取资料或者执行一些操作时，在项目的python_scripts中写python脚本解决。本windows电脑用conda管理包，你用d2MFTool这个环境来运行python脚本
- 界面的宽度、高度需要自适应，不要出现内容、按钮超出显示区域的问题
- 你可以直接调用微信开发者工具，参考WeChatCLIDoc.txt说明进行
- 每次编译前，都需要用微信开发者工具来清理文件缓存

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

## 🚀 TypeScript项目结构开发流程

### 项目目录结构
```
d2FarmLogger/
├── src/                    # TypeScript源码目录
│   ├── services/          # 服务层
│   ├── models/            # 数据模型
│   ├── pages/             # 页面逻辑
│   ├── components/        # 组件
│   ├── utils/             # 工具函数
│   └── app.ts             # 应用入口
├── build/                 # 编译输出目录
├── miniprogram/           # 微信小程序部署目录（JS+配置+样式+模板文件）
├── typings/              # 类型定义
└── package.json          # 项目配置
```

### 开发工作流程

#### 1. 日常开发命令
```bash
# 开发模式（监听文件变化，自动编译）
npm run dev

# 生产构建
npm run build

# 完整生产构建（清理build+miniprogram+编译+部署）
npm run build:prod

# 类型检查（不生成文件）
npm run type-check

# 清理编译文件（仅build目录）
npm run clean

# 清理部署文件（仅miniprogram目录）
npm run clean:miniprogram

# 清理所有文件（build+miniprogram目录）
npm run clean:all
```

#### 2. 代码修改流程
1. **在src/目录下修改TypeScript文件或配置文件**
2. **清理旧的编译文件**：`npm run clean:all`（推荐，确保完全重新编译）
3. **编译到build目录**：`npm run build`（仅编译.ts文件）
4. **部署到miniprogram目录**：`npm run deploy`（自动复制所有必需文件）
5. **在微信开发者工具中测试功能**

⚠️ **重要提醒**：
- 修改 `.ts` 文件：只需重新编译和部署
- 修改 `.json/.scss/.wxml` 文件：必须重新部署（`npm run deploy`）
- 如果遇到缓存问题：按"常见问题3"的步骤强制刷新微信开发者工具

#### 3. 提交代码前检查
```bash
# 1. 完整清理（确保没有旧文件干扰）
npm run clean:all

# 2. TypeScript类型检查
npm run type-check

# 3. 编译测试
npm run build

# 4. ES5兼容性检查
npx tsc --noEmit --target ES5 --lib ES5

# 5. 部署到miniprogram测试（包含所有配置文件）
npm run deploy
```

### 严格开发规范

#### 1. 源码管理
- ✅ **所有TypeScript源码必须在src/目录下**
- ✅ **miniprogram/目录存放编译后的JS文件+配置+样式+模板文件**
- ✅ **build/目录作为编译中间输出**
- ❌ **禁止直接修改miniprogram/中的任何文件**
- ⚠️ **重要：TypeScript编译器不会自动复制.json/.scss/.wxml文件**

#### 2. 导入路径规范
- ✅ **使用相对路径导入模块**
- ✅ **服务层导入**：`import { Service } from '../services/service'`
- ✅ **模型导入**：`import { Model } from '../../models/model'`
- ❌ **禁止使用绝对路径或别名**

#### 2.1 模块导入导出兼容性（重要！）
- **导出语法**：使用 `module.exports = { Service }` 替代 `export { Service }`
- **导入语法**：
  - 推荐：`var { Service } = require('../services/service')`
  - 或：`var Service = require('../services/service').Service`
- ❌ **避免**：`import { Service } from '../services/service'`（可能导致兼容性问题）
- ⚠️ **原因**：确保与微信小程序的require机制完全兼容

#### 3. TypeScript配置
- **编译目标**：ES5（微信小程序兼容）
- **模块系统**：CommonJS
- **输出目录**：`./build`
- **源码目录**：`./src`

#### 4. 构建部署流程
1. **清理旧文件**：`npm run clean:all`（清理build和miniprogram目录）
2. **src/ → build/**：TypeScript编译（仅编译.ts文件）
3. **src/ → miniprogram/**：复制非TS文件（.json/.scss/.wxml等配置和模板文件）
4. **build/ → miniprogram/**：复制编译后的JS文件
5. **miniprogram/ → 微信开发者工具**：最终运行

### 优势说明

#### 1. 避免JS/TS重复维护
- **单一数据源**：只需维护TypeScript文件
- **自动同步**：编译确保一致性
- **类型安全**：TypeScript提供编译时检查

#### 2. 标准化开发体验
- **现代IDE支持**：智能提示、重构、跳转
- **代码质量**：强制类型检查和规范
- **团队协作**：统一的开发模式

#### 3. 构建自动化
- **监听编译**：开发时自动重新编译
- **一键部署**：从源码到小程序目录
- **错误检查**：编译时发现问题

### 故障排除

#### 编译错误
1. 检查TypeScript语法：`npm run type-check`
2. 验证导入路径是否正确
3. 确认src目录结构完整

#### 运行时错误
1. 检查ES5兼容性：`npx tsc --noEmit --target ES5`
2. 在微信开发者工具中调试
3. 确认部署流程完整执行

**记住：永远不要直接修改miniprogram目录中的文件！所有修改都应该在src目录中进行。**

