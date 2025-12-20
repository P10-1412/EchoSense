// ==================== 核心枚举 ====================

export enum InputMode {
  URL = 'url',
  TRANSCRIPT = 'transcript'
}

export enum SuggestionType {
  COMMERCIAL = 'commercial',
  VIRAL = 'viral',
  RISK = 'risk',
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum DisciplineType {
  LAW = 'law',
  PSYCHOLOGY = 'psychology',
  BUSINESS = 'business',
  HEALTH = 'health',
  COMMUNICATION = 'communication'
}

// ==================== 相对价值评估 ====================

export interface ReferenceCase {
  id: string;
  description: string;
  context: string;
  audienceSize: string;
  priceRange?: string;
  effectData?: string;
  source: string;
}

export interface RelativeValue {
  percentile: number;
  rank: string;
  referenceCases: ReferenceCase[];
  explanation: string;
  adoptionCost: {
    timeRequired: string;
    difficulty: 'easy' | 'medium' | 'hard';
    resources: string[];
  };
}

// ==================== 画像系统（仅记录客观事实） ====================

export interface DisciplineRecord {
  id: string;
  discipline: DisciplineType;
  date: string;
  podcastTitle: string;
  observations: string[]; // 客观观察，不包含建议
  severity?: 'low' | 'medium' | 'high';
}

export interface PsychologyProfile {
  emotionalPatterns: string[];
  cognitiveTraits: string[];
  beliefSystems: string[];
  stressResponses: string[];
}

export interface CommunicationProfile {
  accountStyle: string;
  audienceProfile: {
    demographics: string;
    interests: string[];
    engagementPatterns: string;
  };
  contentThemes: string[];
  avgEngagement: number;
  contentStyle: string;
  updateFrequency: string;
}

export interface LawProfile {
  riskAreas: string[];
  complianceIssues: string[];
  disclaimerUsage: string;
}

export interface BusinessProfile {
  investmentDiscount: number;
  riskTolerance: 'low' | 'medium' | 'high';
  monetizationHistory: string[];
  businessKnowledge: string[];
  financialLiteracy: string;
}

export interface HealthProfile {
  lifestylePatterns: string[];
  stressIndicators: string[];
  healthAwareness: string;
}

export interface UserProfile {
  userId: string;
  psychology: PsychologyProfile;
  communication: CommunicationProfile;
  law: LawProfile;
  business: BusinessProfile;
  health: HealthProfile;
  disciplineHistory: {
    law: DisciplineRecord[];
    psychology: DisciplineRecord[];
    business: DisciplineRecord[];
    health: DisciplineRecord[];
    communication: DisciplineRecord[];
  };
  customDisciplines?: {
    name: string;
    records: DisciplineRecord[];
  }[];
}

// ==================== 建议类型 ====================

export interface CommercialSuggestion {
  id: string;
  type: SuggestionType.COMMERCIAL;
  position: string;
  timeRange: string;
  content: string;
  title: string;
  compatibility: {
    naturalEmbedding: number;
    audienceClarity: number;
    viewpointCompleteness: number;
    overallScore: number;
  };
  relativeValue?: RelativeValue;
  adFormats: string[];
  actionableAdvice: string;
  scriptSample: string;
  priority: Priority;
}

export interface ViralSuggestion {
  id: string;
  type: SuggestionType.VIRAL;
  position: string;
  timeRange: string;
  content: string;
  title: string;
  viralPotential: {
    counterIntuitive: number;
    conflictLevel: number;
    clipability: number;
    overallScore: number;
  };
  relativeValue?: RelativeValue;
  distributionPaths: string[];
  contentStrategy: string;
  actionableAdvice: string;
  priority: Priority;
}

export interface RiskSuggestion {
  id: string;
  type: SuggestionType.RISK;
  position: string;
  timeRange: string;
  content: string;
  title: string;
  riskAnalysis: {
    extremism: number;
    uncertainty: number;
    groupSensitivity: number;
    overallScore: number;
  };
  relativeValue?: RelativeValue;
  potentialImpact: string;
  originalStatement: string;
  revisedStatement: string;
  actionableAdvice: string;
  priority: Priority;
}

export type Suggestion = CommercialSuggestion | ViralSuggestion | RiskSuggestion;

// ==================== 历史记录 ====================

export interface AnalysisHistory {
  id: string;
  date: string;
  inputMode: InputMode;
  inputContent: string;
  podcastTitle: string;
  suggestions: Suggestion[];
  disciplineRecords: DisciplineRecord[];
  timestamp: number;
}

// ==================== 案例数据库 ====================

export interface CaseDatabase {
  id: string;
  type: 'commercial' | 'viral' | 'risk';
  date: string;
  accountInfo: {
    name: string;
    followers: string;
    category: string;
    style: string;
  };
  eventDescription: string;
  eventResult: {
    outcome: 'positive' | 'negative' | 'neutral';
    revenue?: number;
    loss?: number;
    fansChange?: number;
    engagementChange?: number;
    details: string;
  };
  tags: string[];
  source: string;
}

// ==================== 用户设置 ====================

export interface UserSettings {
  alertThreshold: {
    percentile: number;
    enabled: boolean;
  };
  suggestionTypes: {
    commercial: boolean;
    viral: boolean;
    risk: boolean;
  };
  disciplines: {
    law: boolean;
    psychology: boolean;
    business: boolean;
    health: boolean;
    communication: boolean;
  };
  analysisDepth: 'basic' | 'standard' | 'detailed';
  targetAudience: {
    demographics: string; // 人口统计特征
    interests: string; // 兴趣爱好
    painPoints: string; // 痛点需求
    consumptionHabits: string; // 消费习惯
    mediaPreferences: string; // 媒体偏好
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  alertThreshold: {
    percentile: 1,
    enabled: true
  },
  suggestionTypes: {
    commercial: true,
    viral: true,
    risk: true
  },
  disciplines: {
    law: true,
    psychology: true,
    business: true,
    health: true,
    communication: true
  },
  analysisDepth: 'standard',
  targetAudience: {
    demographics: '25-35岁职场人士，一二线城市，本科及以上学历',
    interests: '职场发展、个人成长、知识学习',
    painPoints: '职业瓶颈、时间管理、技能提升',
    consumptionHabits: '愿意为优质内容付费，注重性价比',
    mediaPreferences: '播客、视频号、公众号、小红书'
  }
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'default',
  psychology: {
    emotionalPatterns: [],
    cognitiveTraits: [],
    beliefSystems: [],
    stressResponses: []
  },
  communication: {
    accountStyle: '知识分享型',
    audienceProfile: {
      demographics: '25-35岁职场人士',
      interests: ['职场发展', '个人成长'],
      engagementPatterns: '高互动，喜欢深度内容'
    },
    contentThemes: ['职场发展', '个人成长'],
    avgEngagement: 3.5,
    contentStyle: '深度分析型',
    updateFrequency: '每周2-3次'
  },
  law: {
    riskAreas: [],
    complianceIssues: [],
    disclaimerUsage: '偶尔使用'
  },
  business: {
    investmentDiscount: 10,
    riskTolerance: 'medium',
    monetizationHistory: [],
    businessKnowledge: [],
    financialLiteracy: '中等'
  },
  health: {
    lifestylePatterns: [],
    stressIndicators: [],
    healthAwareness: '中等'
  },
  disciplineHistory: {
    law: [],
    psychology: [],
    business: [],
    health: [],
    communication: []
  }
};

// ==================== 参考案例库 ====================

export const COMMERCIAL_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'comm_001',
    description: '职场效率工具推荐',
    context: '在讨论工作效率提升时自然引入工具推荐',
    audienceSize: '5-10万粉丝',
    priceRange: '8000-15000元',
    effectData: '转化率2-4%',
    source: '2024年职场类播客商业合作数据'
  },
  {
    id: 'comm_002',
    description: '生活方式品牌植入',
    context: '分享个人生活方式时植入品牌',
    audienceSize: '10-30万粉丝',
    priceRange: '15000-30000元',
    effectData: '品牌认知度提升15-25%',
    source: '2024年生活方式类播客数据'
  },
  {
    id: 'comm_003',
    description: '知识付费课程推广',
    context: '深度内容延伸至付费课程',
    audienceSize: '3-8万粉丝',
    priceRange: '5000-12000元',
    effectData: '课程转化率5-10%',
    source: '2024年知识类播客数据'
  },
  {
    id: 'comm_004',
    description: '消费品测评合作',
    context: '产品使用体验分享',
    audienceSize: '8-20万粉丝',
    priceRange: '10000-25000元',
    effectData: '互动率提升4-7%',
    source: '2024年测评类播客数据'
  }
];

export const VIRAL_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'viral_001',
    description: '反常识职场观点',
    context: '挑战传统职场认知',
    audienceSize: '触达10-50万人',
    effectData: '互动率提升5-8%，分享率提升10-15%',
    source: '2024年职场话题传播数据'
  },
  {
    id: 'viral_002',
    description: '代际认知差异讨论',
    context: '不同年龄层价值观碰撞',
    audienceSize: '触达20-100万人',
    effectData: '知乎引用量300+，微博讨论量5000+',
    source: '2024年社会话题传播数据'
  },
  {
    id: 'viral_003',
    description: '行业内幕揭秘',
    context: '披露行业不为人知的真相',
    audienceSize: '触达15-80万人',
    effectData: '视频播放量100万+，评论量2000+',
    source: '2024年深度内容传播数据'
  }
];

export const RISK_CASE_LIBRARY: ReferenceCase[] = [
  {
    id: 'risk_001',
    description: '行业绝对化评价',
    context: '对某行业做出过于绝对的负面评价',
    audienceSize: '影响3000-8000粉丝',
    effectData: '互动率下降3-8%，掉粉率1-3%',
    source: '2024年舆论风险案例'
  },
  {
    id: 'risk_002',
    description: '未经证实的事实陈述',
    context: '传播未经核实的信息',
    audienceSize: '影响5000-15000粉丝',
    effectData: '可能面临法律风险，信誉受损',
    source: '2024年内容合规案例'
  },
  {
    id: 'risk_003',
    description: '敏感群体标签化',
    context: '对特定群体使用刻板印象标签',
    audienceSize: '影响2000-10000粉丝',
    effectData: '掉粉率2-5%，评论区负面情绪增加',
    source: '2024年社交媒体风险案例'
  }
];
