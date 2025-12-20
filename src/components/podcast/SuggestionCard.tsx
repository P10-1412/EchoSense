import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Sparkles, AlertTriangle, TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { Suggestion, SuggestionType, Priority, CommercialSuggestion, ViralSuggestion, RiskSuggestion } from '@/types/podcast';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  // 根据类型获取配置
  const getTypeConfig = () => {
    switch (suggestion.type) {
      case SuggestionType.COMMERCIAL:
        return {
          icon: DollarSign,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          label: '商业化价值',
          emoji: '💰'
        };
      case SuggestionType.VIRAL:
        return {
          icon: Sparkles,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950',
          borderColor: 'border-purple-200 dark:border-purple-800',
          label: '传播价值',
          emoji: '🚀'
        };
      case SuggestionType.RISK:
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          label: '风险预警',
          emoji: '⚠️'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  // 优先级徽章
  const getPriorityBadge = () => {
    const variants: Record<Priority, { variant: 'default' | 'secondary' | 'destructive', label: string }> = {
      [Priority.CRITICAL]: { variant: 'destructive', label: '极高价值（前1%）' },
      [Priority.HIGH]: { variant: 'default', label: '高价值（前10%）' },
      [Priority.MEDIUM]: { variant: 'secondary', label: '中等价值' },
      [Priority.LOW]: { variant: 'secondary', label: '参考价值' }
    };
    const { variant, label } = variants[suggestion.priority];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // 难度徽章
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    const config = {
      easy: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', label: '易' },
      medium: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', label: '中' },
      hard: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', label: '难' }
    };
    return (
      <span className={`rounded px-2 py-0.5 text-xs font-medium ${config[difficulty].color}`}>
        {config[difficulty].label}
      </span>
    );
  };

  return (
    <Card className={`${config.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">
                {config.emoji} {suggestion.title}
              </CardTitle>
              <CardDescription className="mt-1">
                <Badge variant="outline" className="mr-2">{config.label}</Badge>
                {suggestion.position}
                {suggestion.timeRange && ` · ${suggestion.timeRange}`}
              </CardDescription>
            </div>
          </div>
          {getPriorityBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 段落内容 */}
        <Alert className={config.bgColor}>
          <AlertDescription className="text-sm">
            <strong>内容片段：</strong>
            <p className="mt-2 italic">"{suggestion.content}"</p>
          </AlertDescription>
        </Alert>

        {/* 商业化价值详情 */}
        {suggestion.type === SuggestionType.COMMERCIAL && (
          <CommercialDetails suggestion={suggestion as CommercialSuggestion} config={config} getDifficultyBadge={getDifficultyBadge} />
        )}

        {/* 传播价值详情 */}
        {suggestion.type === SuggestionType.VIRAL && (
          <ViralDetails suggestion={suggestion as ViralSuggestion} config={config} getDifficultyBadge={getDifficultyBadge} />
        )}

        {/* 风险预警详情 */}
        {suggestion.type === SuggestionType.RISK && (
          <RiskDetails suggestion={suggestion as RiskSuggestion} config={config} getDifficultyBadge={getDifficultyBadge} />
        )}
      </CardContent>
    </Card>
  );
}

// 商业化价值详情组件
function CommercialDetails({ 
  suggestion, 
  config,
  getDifficultyBadge 
}: { 
  suggestion: CommercialSuggestion; 
  config: any;
  getDifficultyBadge: (difficulty: 'easy' | 'medium' | 'hard') => React.ReactElement;
}) {
  return (
    <>
      {/* 商业适配度分析 */}
      <div className={`rounded-lg ${config.bgColor} p-4`}>
        <h4 className="mb-3 text-sm font-semibold">📊 商业适配度分析</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>自然嵌入可能性</span>
            <span className="font-medium">{suggestion.compatibility.naturalEmbedding}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>受众明确度</span>
            <span className="font-medium">{suggestion.compatibility.audienceClarity}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>观点闭环完整性</span>
            <span className="font-medium">{suggestion.compatibility.viewpointCompleteness}/100</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>综合评分</span>
            <span className={config.color}>{suggestion.compatibility.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* 相对价值评估 */}
      <RelativeValueDisplay relativeValue={suggestion.relativeValue} getDifficultyBadge={getDifficultyBadge} />

      {/* 适配广告形态 */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">🎯 适配广告形态</h4>
        <div className="flex flex-wrap gap-2">
          {suggestion.adFormats.map((format, idx) => (
            <Badge key={idx} variant="secondary">{format}</Badge>
          ))}
        </div>
      </div>

      {/* 可操作建议 */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>💡 可操作建议：</strong>
          <p className="mt-2 whitespace-pre-wrap">{suggestion.actionableAdvice}</p>
        </AlertDescription>
      </Alert>

      {/* 口播脚本示例 */}
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <AlertDescription className="text-sm">
          <strong className="text-green-700 dark:text-green-400">🎙️ 口播脚本示例：</strong>
          <p className="mt-2 whitespace-pre-wrap italic text-green-900 dark:text-green-200">
            "{suggestion.scriptSample}"
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
}

// 传播价值详情组件
function ViralDetails({ 
  suggestion, 
  config,
  getDifficultyBadge 
}: { 
  suggestion: ViralSuggestion; 
  config: any;
  getDifficultyBadge: (difficulty: 'easy' | 'medium' | 'hard') => React.ReactElement;
}) {
  return (
    <>
      {/* 传播潜力分析 */}
      <div className={`rounded-lg ${config.bgColor} p-4`}>
        <h4 className="mb-3 text-sm font-semibold">📊 传播潜力分析</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>反直觉程度</span>
            <span className="font-medium">{suggestion.viralPotential.counterIntuitive}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>与主流叙事冲突性</span>
            <span className="font-medium">{suggestion.viralPotential.conflictLevel}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>可切片性</span>
            <span className="font-medium">{suggestion.viralPotential.clipability}/100</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>综合评分</span>
            <span className={config.color}>{suggestion.viralPotential.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* 相对价值评估 */}
      <RelativeValueDisplay relativeValue={suggestion.relativeValue} getDifficultyBadge={getDifficultyBadge} />

      {/* 传播路径 */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">🚀 核心传播路径</h4>
        <div className="flex flex-wrap gap-2">
          {suggestion.distributionPaths.map((path, idx) => (
            <Badge key={idx} variant="secondary">{path}</Badge>
          ))}
        </div>
      </div>

      {/* 可操作建议 */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>💡 可操作建议：</strong>
          <p className="mt-2 whitespace-pre-wrap">{suggestion.actionableAdvice}</p>
        </AlertDescription>
      </Alert>

      {/* 内容策略 */}
      <Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
        <AlertDescription className="text-sm">
          <strong className="text-purple-700 dark:text-purple-400">📋 内容策略：</strong>
          <p className="mt-2 whitespace-pre-wrap text-purple-900 dark:text-purple-200">
            {suggestion.contentStrategy}
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
}

// 风险预警详情组件
function RiskDetails({ 
  suggestion, 
  config,
  getDifficultyBadge 
}: { 
  suggestion: RiskSuggestion; 
  config: any;
  getDifficultyBadge: (difficulty: 'easy' | 'medium' | 'hard') => React.ReactElement;
}) {
  return (
    <>
      {/* 风险分析 */}
      <div className={`rounded-lg ${config.bgColor} p-4`}>
        <h4 className="mb-3 text-sm font-semibold">📊 风险分析</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>观点极端度</span>
            <span className="font-medium">{suggestion.riskAnalysis.extremism}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>事实不确定性</span>
            <span className="font-medium">{suggestion.riskAnalysis.uncertainty}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>群体标签触及度</span>
            <span className="font-medium">{suggestion.riskAnalysis.groupSensitivity}/100</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>综合风险</span>
            <span className={config.color}>{suggestion.riskAnalysis.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* 相对风险评估 */}
      <RelativeValueDisplay relativeValue={suggestion.relativeRisk} getDifficultyBadge={getDifficultyBadge} isRisk />

      {/* 潜在影响 */}
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <AlertDescription className="text-sm">
          <strong className="text-red-700 dark:text-red-400">⚠️ 潜在影响：</strong>
          <p className="mt-2 text-red-900 dark:text-red-200">
            {suggestion.potentialImpact}
          </p>
        </AlertDescription>
      </Alert>

      {/* 可操作建议 */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>💡 可操作建议：</strong>
          <p className="mt-2 whitespace-pre-wrap">{suggestion.actionableAdvice}</p>
        </AlertDescription>
      </Alert>

      {/* 表述对比 */}
      <div className="space-y-3">
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertDescription className="text-sm">
            <strong className="text-red-700 dark:text-red-400">❌ 原表述：</strong>
            <p className="mt-2 italic text-red-900 dark:text-red-200">
              "{suggestion.originalStatement}"
            </p>
          </AlertDescription>
        </Alert>
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <AlertDescription className="text-sm">
            <strong className="text-green-700 dark:text-green-400">✅ 修改后表述：</strong>
            <p className="mt-2 italic text-green-900 dark:text-green-200">
              "{suggestion.revisedStatement}"
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}

// 相对价值展示组件
function RelativeValueDisplay({ 
  relativeValue, 
  getDifficultyBadge,
  isRisk = false
}: { 
  relativeValue: any; 
  getDifficultyBadge: (difficulty: 'easy' | 'medium' | 'hard') => React.ReactElement;
  isRisk?: boolean;
}) {
  return (
    <>
      {/* 历史分位数 */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            {isRisk ? '📉 相对风险等级' : '📈 相对价值等级'}
          </h4>
          <Badge variant="outline" className="text-base font-bold">
            {relativeValue.rank}
          </Badge>
        </div>
        <div className="mb-3 text-xs text-muted-foreground">
          历史分位数：{relativeValue.percentile}%
        </div>
        <p className="text-sm">{relativeValue.explanation}</p>
      </div>

      {/* 参考案例 */}
      {relativeValue.referenceCases && relativeValue.referenceCases.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold">📚 参考案例</h4>
          <div className="space-y-2">
            {relativeValue.referenceCases.map((refCase: any, idx: number) => (
              <Alert key={idx} variant="default">
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p><strong>场景：</strong>{refCase.context}</p>
                    <p><strong>受众规模：</strong>{refCase.audienceSize}</p>
                    {refCase.priceRange && <p><strong>报价区间：</strong>{refCase.priceRange}</p>}
                    {refCase.effectData && <p><strong>效果数据：</strong>{refCase.effectData}</p>}
                    <p className="text-xs text-muted-foreground">数据来源：{refCase.source}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* 采纳成本 */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h4 className="mb-3 text-sm font-semibold">⏱️ 采纳成本</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              所需时间
            </span>
            <span className="font-medium">{relativeValue.adoptionCost.timeRequired}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              执行难度
            </span>
            {getDifficultyBadge(relativeValue.adoptionCost.difficulty)}
          </div>
          <div className="text-sm">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              所需资源
            </span>
            <ul className="ml-6 mt-1 list-disc space-y-1">
              {relativeValue.adoptionCost.resources.map((resource: string, idx: number) => (
                <li key={idx}>{resource}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
