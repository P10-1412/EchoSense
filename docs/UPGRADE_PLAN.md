# choSense 2.1 升级方案

## 一、核心概念重构

### 1.1 画像系统重新定义

**原则**：画像仅记录客观事实和历史信息，不包含建议

#### 心理画像（绑定用户）
- **目的**：分析播主个人的心理状态、情绪模式、认知特征
- **记录内容**：
  - 情绪表达模式（如：经常表现焦虑、完美主义倾向）
  - 信念系统（如：强调"必须完美"、"不能失败"）
  - 认知偏差（如：灾难化思维、黑白思维）
  - 压力应对方式
  - 自我认知特点
- **不包含**：心理建议、改善方案

#### 健康/医学画像（绑定用户）
- **目的**：记录播主提及的身体状况、生活习惯
- **记录内容**：
  - 提及的身体症状（如：经常提到头痛、失眠）
  - 生活习惯（如：熬夜工作、久坐）
  - 饮食模式
  - 运动频率
  - 既往病史提及
- **不包含**：医疗建议、诊断结论

#### 传播学画像（绑定栏目）
- **目的**：总结该播客栏目的受众特征、传播效果
- **记录内容**：
  - 受众年龄分布（基于内容推断）
  - 受众职业特征
  - 受众兴趣偏好
  - 内容风格特点
  - 历史传播效果数据
  - 互动模式特征
- **不包含**：传播建议、优化方案

#### 法律画像（绑定栏目）
- **目的**：记录该栏目历史上的法律风险点
- **记录内容**：
  - 曾出现的法律风险表述
  - 事实核查问题
  - 版权相关问题
  - 广告合规问题
- **不包含**：法律建议

#### 商业/会计画像（绑定栏目）
- **目的**：记录该栏目的商业化历史和财务特征
- **记录内容**：
  - 历史商业合作类型
  - 变现模式
  - 商业化频率
  - 受众付费意愿特征
- **不包含**：商业建议

### 1.2 用户与栏目管理

#### 用户（播主个人）
```typescript
interface User {
  id: string;
  name: string;
  createdAt: string;
  // 绑定的画像
  psychologyProfile: PsychologyRecord[];
  healthProfile: HealthRecord[];
}
```

#### 栏目（播客节目）
```typescript
interface Program {
  id: string;
  name: string;
  userId: string; // 所属用户
  createdAt: string;
  episodes: Episode[]; // 多期节目
  // 绑定的画像
  communicationProfile: CommunicationRecord[];
  lawProfile: LawRecord[];
  businessProfile: BusinessRecord[];
}
```

#### 单期节目
```typescript
interface Episode {
  id: string;
  programId: string;
  title: string;
  date: string;
  analysisResults: AnalysisResult;
}
```

## 二、设置系统

### 2.1 分析设置
```typescript
interface AnalysisSettings {
  // 弹窗阈值（百分位数）
  alertThreshold: number; // 默认90，表示前10%
  criticalThreshold: number; // 默认99，表示前1%
  
  // 主题建议开关
  enableCommercial: boolean; // 商业化建议
  enableViral: boolean; // 传播价值建议
  enableRisk: boolean; // 风险预警
  
  // 学科画像开关
  enablePsychology: boolean;
  enableHealth: boolean;
  enableCommunication: boolean;
  enableLaw: boolean;
  enableBusiness: boolean;
  
  // 分析详细程度
  detailLevel: 'simple' | 'standard' | 'detailed';
  
  // 是否显示参考案例
  showReferenceCases: boolean;
  
  // 是否显示采纳成本
  showAdoptionCost: boolean;
}
```

### 2.2 默认设置
```typescript
const DEFAULT_SETTINGS: AnalysisSettings = {
  alertThreshold: 90,
  criticalThreshold: 99,
  enableCommercial: true,
  enableViral: true,
  enableRisk: true,
  enablePsychology: true,
  enableHealth: true,
  enableCommunication: true,
  enableLaw: true,
  enableBusiness: true,
  detailLevel: 'standard',
  showReferenceCases: true,
  showAdoptionCost: true
};
```

## 三、案例数据库

### 3.1 案例数据结构
```typescript
interface CaseRecord {
  id: string;
  type: 'commercial' | 'viral' | 'risk'; // 案例类型
  
  // 时间信息
  date: string; // 发生时间
  
  // 账号信息
  account: {
    name: string; // 账号名称
    platform: string; // 平台（小宇宙、喜马拉雅等）
    audienceSize: string; // 受众规模（如"5-10万"）
    category: string; // 类别（职场、生活、科技等）
  };
  
  // 事件描述
  event: {
    title: string; // 事件标题
    description: string; // 详细描述
    context: string; // 背景信息
    contentSnippet?: string; // 内容片段
  };
  
  // 事件结果
  result: {
    // 商业化结果
    revenue?: number; // 收益（元）
    revenueRange?: string; // 收益区间
    
    // 传播结果
    reach?: number; // 触达人数
    engagementRate?: number; // 互动率
    viralScore?: number; // 传播指数
    
    // 风险结果
    loss?: number; // 损失（元）
    lossRange?: string; // 损失区间
    fansLost?: number; // 掉粉数
    reputationImpact?: string; // 声誉影响
    
    // 通用结果
    outcome: 'positive' | 'negative' | 'neutral'; // 结果性质
    notes: string; // 结果说明
  };
  
  // 元数据
  source: string; // 数据来源
  verified: boolean; // 是否经过验证
  tags: string[]; // 标签
}
```

### 3.2 案例导入格式（JSON）
```json
{
  "cases": [
    {
      "type": "commercial",
      "date": "2024-06-15",
      "account": {
        "name": "职场进化论",
        "platform": "小宇宙",
        "audienceSize": "8-12万",
        "category": "职场"
      },
      "event": {
        "title": "办公软件中插广告",
        "description": "在讨论远程办公效率时自然植入协作工具广告",
        "context": "第45期节目，讨论远程办公的挑战",
        "contentSnippet": "我最近在用XX协作工具，团队沟通效率提升了很多..."
      },
      "result": {
        "revenue": 12000,
        "revenueRange": "10000-15000",
        "outcome": "positive",
        "notes": "广告植入自然，听众反馈良好，转化率3.2%"
      },
      "source": "播客商业化报告2024",
      "verified": true,
      "tags": ["中插广告", "工具类", "职场"]
    },
    {
      "type": "risk",
      "date": "2024-03-20",
      "account": {
        "name": "创业内幕",
        "platform": "喜马拉雅",
        "audienceSize": "15-20万",
        "category": "创业"
      },
      "event": {
        "title": "行业绝对化评价引发争议",
        "description": "对某行业进行极端负面评价，引发从业者反感",
        "context": "第28期节目，讨论行业现状",
        "contentSnippet": "这个行业就是在割韭菜，没有例外"
      },
      "result": {
        "fansLost": 5000,
        "reputationImpact": "负面评论增加，部分听众取关",
        "outcome": "negative",
        "notes": "评论区出现大量争议，互动率下降8%，用时2周恢复"
      },
      "source": "播客舆情监测2024Q1",
      "verified": true,
      "tags": ["舆论风险", "行业评价", "掉粉"]
    }
  ]
}
```

### 3.3 案例导入界面
- 支持JSON文件上传
- 支持手动添加单条案例
- 显示导入格式说明
- 验证数据格式
- 显示导入成功/失败统计

### 3.4 案例查看界面
- 按类型筛选（商业/传播/风险）
- 按时间筛选
- 按结果筛选（正面/负面/中性）
- 按账号类别筛选
- 搜索功能
- 详情查看
- 导出功能

## 四、历史记录系统

### 4.1 历史记录对话框
- 显示所有用户和栏目列表
- 支持切换查看不同用户/栏目
- 显示该用户/栏目的完整画像历史
- 按学科分类展示
- 按时间倒序排列
- 支持搜索和筛选

### 4.2 栏目内多期节目管理
- 显示栏目下所有期数
- 每期显示：标题、日期、分析摘要
- 点击查看该期的完整分析结果
- 支持对比不同期数的画像变化

## 五、价值分析升级

### 5.1 综合画像分析
```typescript
// 分析时考虑
- 用户心理画像：播主的心理特征是否影响内容表达
- 用户健康画像：播主的身体状况是否影响创作状态
- 栏目传播画像：该栏目的受众特征是否匹配当前内容
- 栏目法律画像：该栏目历史上的法律风险倾向
- 栏目商业画像：该栏目的商业化历史和受众付费意愿
```

### 5.2 案例数据库匹配
```typescript
// 匹配逻辑
1. 按类型匹配（商业/传播/风险）
2. 按账号类别匹配（职场/生活/科技等）
3. 按受众规模匹配（相近规模）
4. 按内容相似度匹配
5. 优先选择verified=true的案例
6. 返回最相关的3-5个案例
```

## 六、实施优先级

### P0（核心功能）
1. 重构画像类型定义（仅记录事实）
2. 实现用户和栏目管理
3. 修复画像重复显示bug
4. 创建设置系统基础框架

### P1（重要功能）
5. 实现历史记录查看对话框
6. 实现案例数据库基础结构
7. 创建案例导入界面
8. 升级价值分析逻辑

### P2（增强功能）
9. 完善设置选项
10. 案例查看和筛选功能
11. 栏目内多期节目对比
12. 数据导出功能
