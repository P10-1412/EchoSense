import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Users, TrendingUp, Star, AlertTriangle, Sparkles, Lightbulb } from 'lucide-react';
import { AnalysisSuggestion, SuggestionType } from '@/types/podcast';

interface SuggestionCardProps {
  suggestion: AnalysisSuggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  // 根据类型获取图标和颜色
  const getTypeConfig = () => {
    switch (suggestion.type) {
      case SuggestionType.AD_PLACEMENT:
        return {
          icon: DollarSign,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          label: '广告位机会',
          emoji: '💰'
        };
      case SuggestionType.RISK_WARNING:
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          label: '风险预警',
          emoji: '⚠️'
        };
      case SuggestionType.VIRAL_POINT:
        return {
          icon: Sparkles,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950',
          borderColor: 'border-purple-200 dark:border-purple-800',
          label: '传播爆点',
          emoji: '🚀'
        };
      case SuggestionType.CONTENT_OPTIMIZATION:
        return {
          icon: Lightbulb,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: '内容优化',
          emoji: '💡'
        };
      default:
        return {
          icon: Lightbulb,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-950',
          borderColor: 'border-gray-200 dark:border-gray-800',
          label: '建议',
          emoji: '📝'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  // 优先级徽章
  const getPriorityBadge = () => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      high: { variant: 'destructive', label: '高优先级' },
      medium: { variant: 'default', label: '中优先级' },
      low: { variant: 'secondary', label: '低优先级' }
    };
    const { variant, label } = variants[suggestion.priority];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Card className={`${config.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
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
        {/* 建议描述 */}
        <div>
          <p className="text-sm text-foreground">{suggestion.description}</p>
        </div>

        {/* 量化价值 */}
        <div className={`rounded-lg ${config.bgColor} p-4`}>
          <h4 className="mb-3 text-sm font-semibold text-foreground">📈 预估价值</h4>
          <div className="grid grid-cols-2 gap-3">
            {suggestion.value.money !== undefined && suggestion.value.money > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong className="text-green-600">¥{suggestion.value.money.toLocaleString()}</strong>
                </span>
              </div>
            )}
            {suggestion.value.fans !== undefined && suggestion.value.fans > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  <strong className="text-blue-600">{suggestion.value.fans.toLocaleString()}</strong> 粉丝
                </span>
              </div>
            )}
            {suggestion.value.engagementRate !== undefined && suggestion.value.engagementRate > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm">
                  <strong className="text-purple-600">{suggestion.value.engagementRate}%</strong> 互动率
                </span>
              </div>
            )}
            {suggestion.value.brandValue !== undefined && suggestion.value.brandValue > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">
                  <strong className="text-yellow-600">{suggestion.value.brandValue}</strong> 品牌指数
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 详细建议 */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>💡 详细建议：</strong>
            <p className="mt-2 whitespace-pre-wrap">{suggestion.detailedAdvice}</p>
          </AlertDescription>
        </Alert>

        {/* 广告位专用：口播文案 */}
        {suggestion.type === SuggestionType.AD_PLACEMENT && suggestion.scriptSample && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <AlertDescription className="text-sm">
              <strong className="text-green-700 dark:text-green-400">🎙️ 口播文案示例：</strong>
              <p className="mt-2 whitespace-pre-wrap italic text-green-900 dark:text-green-200">
                "{suggestion.scriptSample}"
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* 风险预警专用：风险原因和修改建议 */}
        {suggestion.type === SuggestionType.RISK_WARNING && (
          <>
            {suggestion.riskReason && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertDescription className="text-sm">
                  <strong className="text-red-700 dark:text-red-400">⚠️ 风险原因：</strong>
                  <p className="mt-2 whitespace-pre-wrap text-red-900 dark:text-red-200">
                    {suggestion.riskReason}
                  </p>
                </AlertDescription>
              </Alert>
            )}
            {suggestion.modificationSuggestion && (
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertDescription className="text-sm">
                  <strong className="text-orange-700 dark:text-orange-400">🔧 修改建议：</strong>
                  <p className="mt-2 whitespace-pre-wrap text-orange-900 dark:text-orange-200">
                    {suggestion.modificationSuggestion}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* 传播爆点专用：推广策略 */}
        {suggestion.type === SuggestionType.VIRAL_POINT && suggestion.promotionStrategy && (
          <Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
            <AlertDescription className="text-sm">
              <strong className="text-purple-700 dark:text-purple-400">🚀 推广策略：</strong>
              <p className="mt-2 whitespace-pre-wrap text-purple-900 dark:text-purple-200">
                {suggestion.promotionStrategy}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
