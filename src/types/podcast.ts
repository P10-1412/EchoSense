// 量化指标类型
export interface QuantifiedValue {
  money?: number; // 金钱价值（元）
  fans?: number; // 粉丝影响数
  engagementRate?: number; // 互动率（%）
  brandValue?: number; // 品牌价值指数（0-100）
}

// 建议类型枚举
export enum SuggestionType {
  AD_PLACEMENT = 'ad_placement', // 广告位
  RISK_WARNING = 'risk_warning', // 风险预警
  VIRAL_POINT = 'viral_point', // 传播爆点
  CONTENT_OPTIMIZATION = 'content_optimization' // 内容优化
}

// 单条分析建议
export interface AnalysisSuggestion {
  id: string;
  type: SuggestionType;
  position: string; // 位置描述（如："第5分钟"、"开场白部分"）
  timeRange?: string; // 时间范围（如："05:23-06:15"）
  title: string; // 建议标题
  description: string; // 建议描述
  value: QuantifiedValue; // 量化价值
  detailedAdvice: string; // 详细建议
  scriptSample?: string; // 口播文案示例（广告位专用）
  riskReason?: string; // 风险原因（风险预警专用）
  modificationSuggestion?: string; // 修改建议（风险预警专用）
  promotionStrategy?: string; // 推广策略（传播爆点专用）
  priority: 'high' | 'medium' | 'low'; // 优先级
}

// 分析结果汇总
export interface AnalysisResult {
  suggestions: AnalysisSuggestion[];
  totalValue: QuantifiedValue; // 总价值
  summary: string; // 总结
  timestamp: number; // 分析时间戳
}

// 用户阈值设置
export interface ThresholdSettings {
  money: number; // 金钱阈值（元）
  fans: number; // 粉丝阈值
  engagementRate: number; // 互动率阈值（%）
  brandValue: number; // 品牌价值阈值（0-100）
}

// 默认阈值设置
export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  money: 5000, // 5000元
  fans: 1000, // 1000粉丝
  engagementRate: 5, // 5%互动率
  brandValue: 70 // 70分品牌价值
};

// 输入模式
export enum InputMode {
  URL = 'url',
  TRANSCRIPT = 'transcript'
}
