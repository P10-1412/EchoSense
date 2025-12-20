// ==================== 核心枚举 ====================

// 输入模式
export enum InputMode {
  URL = 'url',
  TRANSCRIPT = 'transcript'
}

// 建议类型
export enum SuggestionType {
  COMMERCIAL = 'commercial', // 商业化价值
  VIRAL = 'viral', // 传播价值
  RISK = 'risk', // 风险预警
}

// 优先级
export enum Priority {
  CRITICAL = 'critical', // 极高（前1%）
  HIGH = 'high', // 高（前10%）
  MEDIUM = 'medium', // 中
  LOW = 'low' // 低
}

// 五大核心学科
export enum DisciplineType {
  LAW = 'law', // 法律
  PSYCHOLOGY = 'psychology', // 心理
  BUSINESS = 'business', // 商业/会计
  HEALTH = 'health', // 健康/医学
  COMMUNICATION = 'communication' // 传播学
}

// ==================== 相对价值评估体系 ====================

// 参考案例
export interface ReferenceCase {
  id: string;
  description: string; // 案例描述
  context: string; // 相似场景
  audienceSize: string; // 受众规模（如"5-10万粉丝"）
  priceRange?: string; // 报价区间（如"8000-15000元"）
  effectData?: string; // 效果数据（如"互动率提升3-5%"）
  source: string; // 数据来源
}

// 相对价值（不输出绝对值）
export interface RelativeValue {
  percentile: number; // 历史分位数（0-100）
  rank: string; // 排名描述（如"前1%"、"前10%"）
  referenceCases: ReferenceCase[]; // 参考案例
  explanation: string; // 可解释路径
  adoptionCost: {
    timeRequired: string; // 所需时间（如"30分钟"）
    difficulty: 'easy' | 'medium' | 'hard'; // 执行难度
    resources: string[]; // 所需资源
  };
}

// ==================== 全科画像系统 ====================

// 学科记录
export interface DisciplineRecord {
  id: string;
  discipline: DisciplineType;
  date: string;
  podcastTitle: string;
  findings: string[]; // 核心发现
  suggestions: string[]; // 建议
  severity?: 'low' | 'medium' | 'high'; // 严重程度（风险类）
}

// 用户画像
export interface UserProfile {
  userId: string;
  // 传播学画像
  communication: {
    accountStyle: string; // 账号风格
    audienceProfile: string; // 受众画像
    contentThemes: string[]; // 内容主题
    avgEngagement: number; // 平均互动率
  };
  // 商业画像
  business: {
    investmentDiscount: number; // 投资贴现率
    riskTolerance: 'low' | 'medium' | 'high'; // 风险承受能力
    monetizationHistory: string[]; // 变现历史
  };
  // 五大学科历史记录
  disciplineHistory: {
    law: DisciplineRecord[];
    psychology: DisciplineRecord[];
    business: DisciplineRecord[];
    health: DisciplineRecord[];
    communication: DisciplineRecord[];
  };
  // 动态主题学科（最多2个）
  customDisciplines?: {
    name: string;
    records: DisciplineRecord[];
  }[];
}

// ==================== 分析建议 ====================

// 商业化建议
export interface CommercialSuggestion {
  id: string;
  type: SuggestionType.COMMERCIAL;
  position: string; // 位置（如"第15分钟30秒"）
  timeRange: string; // 时间范围
  content: string; // 段落内容
  title: string;
  
  // 商业适配度分析
  compatibility: {
    naturalEmbedding: number; // 自然嵌入可能性（0-100）
    audienceClarity: number; // 受众明确度（0-100）
    viewpointCompleteness: number; // 观点闭环完整性（0-100）
    overallScore: number; // 综合评分
  };
  
  // 相对价值
  relativeValue: RelativeValue;
  
  // 适配广告形态
  adFormats: string[]; // 如["中插口播广告", "品牌共创测评"]
  
  // 可操作建议
  actionableAdvice: string;
  scriptSample: string; // 口播脚本示例
  
  priority: Priority;
}

// 传播价值建议
export interface ViralSuggestion {
  id: string;
  type: SuggestionType.VIRAL;
  position: string;
  timeRange: string;
  content: string;
  title: string;
  
  // 传播潜力分析
  viralPotential: {
    counterIntuitive: number; // 反直觉程度（0-100）
    conflictLevel: number; // 与主流叙事冲突性（0-100）
    clipability: number; // 可切片性（0-100）
    overallScore: number;
  };
  
  // 相对价值
  relativeValue: RelativeValue;
  
  // 传播路径
  distributionPaths: string[]; // 如["小红书观点共鸣", "知乎话题讨论"]
  
  // 可操作建议
  actionableAdvice: string;
  contentStrategy: string; // 内容策略
  
  priority: Priority;
}

// 风险预警建议
export interface RiskSuggestion {
  id: string;
  type: SuggestionType.RISK;
  position: string;
  timeRange: string;
  content: string;
  title: string;
  
  // 风险分析
  riskAnalysis: {
    extremism: number; // 观点极端度（0-100）
    uncertainty: number; // 事实不确定性（0-100）
    groupSensitivity: number; // 群体标签触及度（0-100）
    overallScore: number;
  };
  
  // 相对风险
  relativeRisk: RelativeValue;
  
  // 潜在影响
  potentialImpact: string; // 如"评论区极化，互动率下降3-8%"
  
  // 可操作建议
  actionableAdvice: string;
  originalStatement: string; // 原表述
  revisedStatement: string; // 修改后表述
  
  priority: Priority;
}

// 统一建议类型
export type Suggestion = CommercialSuggestion | ViralSuggestion | RiskSuggestion;

// ==================== 分析结果 ====================

export interface AnalysisResult {
  // 高价值建议（仅前1%或前10%）
  highValueSuggestions: Suggestion[];
  
  // 全科画像更新
  disciplineUpdates: DisciplineRecord[];
  
  // 内容结构总结
  structureSummary: string;
  
  // 分析时间戳
  timestamp: number;
  
  // 是否触发弹窗
  shouldTriggerAlert: boolean;
}

// ==================== 参考案例库 ====================

// 商业化案例库
export const COMMERCIAL_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'comm_001',
    description: '职场效率工具推荐场景',
    context: '创业者讨论办公软件使用体验，自然过渡到产品推荐',
    audienceSize: '5-10万粉丝',
    priceRange: '8000-15000元',
    source: '2024年职场类播客商业合作数据'
  },
  {
    id: 'comm_002',
    description: '生活方式品牌植入',
    context: '分享个人生活习惯时提及产品使用感受',
    audienceSize: '10-30万粉丝',
    priceRange: '15000-30000元',
    source: '2024年生活方式类播客商业合作数据'
  },
  {
    id: 'comm_003',
    description: '知识付费课程推广',
    context: '深度讲解某专业领域知识后推荐系统课程',
    audienceSize: '3-8万粉丝',
    priceRange: '5000-12000元',
    source: '2024年知识类播客商业合作数据'
  },
  {
    id: 'comm_004',
    description: '消费品测评合作',
    context: '真实使用体验分享，包含产品优缺点',
    audienceSize: '8-20万粉丝',
    priceRange: '10000-25000元',
    source: '2024年测评类播客商业合作数据'
  }
];

// 传播案例库
export const VIRAL_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'viral_001',
    description: '反常识职场观点',
    context: '提出与主流认知相反的职场发展路径',
    audienceSize: '触达10-50万人',
    effectData: '小红书传播，互动率提升5-8%',
    source: '2024年职场话题传播数据'
  },
  {
    id: 'viral_002',
    description: '代际认知差异讨论',
    context: '揭示不同年龄段的隐蔽差异',
    audienceSize: '触达20-100万人',
    effectData: '知乎话题讨论，引用量300+',
    source: '2024年社会话题传播数据'
  },
  {
    id: 'viral_003',
    description: '行业内幕揭秘',
    context: '从业者视角分享行业真实情况',
    audienceSize: '触达15-80万人',
    effectData: '多平台传播，视频播放量100万+',
    source: '2024年行业话题传播数据'
  }
];

// 风险案例库
export const RISK_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'risk_001',
    description: '行业绝对化评价',
    context: '对某行业进行极端负面评价',
    audienceSize: '影响3000-8000粉丝',
    effectData: '评论区极化，互动率下降3-8%',
    source: '2024年播客争议事件数据'
  },
  {
    id: 'risk_002',
    description: '未经证实的事实陈述',
    context: '传播未经核实的信息或数据',
    audienceSize: '影响5000-15000粉丝',
    effectData: '可能面临法律风险，需公开澄清',
    source: '2024年播客法律风险案例'
  },
  {
    id: 'risk_003',
    description: '敏感群体标签化',
    context: '对特定群体进行刻板印象描述',
    audienceSize: '影响2000-10000粉丝',
    effectData: '引发群体反感，掉粉率2-5%',
    source: '2024年播客舆论风险案例'
  }
];

// ==================== 默认用户画像 ====================

export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'default',
  communication: {
    accountStyle: '知识分享型',
    audienceProfile: '25-35岁职场人士',
    contentThemes: ['职场发展', '个人成长'],
    avgEngagement: 3.5
  },
  business: {
    investmentDiscount: 0.1, // 10%贴现率
    riskTolerance: 'medium',
    monetizationHistory: []
  },
  disciplineHistory: {
    law: [],
    psychology: [],
    business: [],
    health: [],
    communication: []
  }
};
