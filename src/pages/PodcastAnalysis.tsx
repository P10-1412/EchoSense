import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, TrendingUp, AlertTriangle, Radio, Link2, FileText, DollarSign, Users, Star, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api, { WENXIN_CHAT_ENDPOINT } from '@/services/api';
import { sendChatStream } from '@/services/chatStream';
import ThresholdSettingsDialog, { getCurrentThresholds } from '@/components/podcast/ThresholdSettings';
import SuggestionCard from '@/components/podcast/SuggestionCard';
import { AnalysisSuggestion, InputMode, ThresholdSettings, QuantifiedValue, SuggestionType } from '@/types/podcast';

const APP_ID = import.meta.env.VITE_APP_ID;

export default function PodcastAnalysis() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.URL);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AnalysisSuggestion[]>([]);
  const [totalValue, setTotalValue] = useState<QuantifiedValue>({});
  const [showHighValueDialog, setShowHighValueDialog] = useState(false);
  const [highValueSuggestions, setHighValueSuggestions] = useState<AnalysisSuggestion[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(getCurrentThresholds());
  const { toast } = useToast();

  // 检查是否超过阈值
  const checkThreshold = (value: QuantifiedValue): boolean => {
    if (value.money && value.money >= thresholds.money) return true;
    if (value.fans && value.fans >= thresholds.fans) return true;
    if (value.engagementRate && value.engagementRate >= thresholds.engagementRate) return true;
    if (value.brandValue && value.brandValue >= thresholds.brandValue) return true;
    return false;
  };

  // 解析AI返回的JSON结构
  const parseAIResponse = (content: string): AnalysisSuggestion[] => {
    try {
      // 尝试提取JSON部分
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('解析AI响应失败:', error);
      return [];
    }
  };

  const analyzePodcast = async () => {
    // 验证输入
    if (inputMode === InputMode.URL && !podcastUrl.trim()) {
      toast({
        title: '请输入播客URL',
        description: '请提供有效的播客网址以进行分析',
        variant: 'destructive',
      });
      return;
    }

    if (inputMode === InputMode.TRANSCRIPT && !transcript.trim()) {
      toast({
        title: '请输入播客文字稿',
        description: '请粘贴播客的完整文字内容',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setSuggestions([]);
    setTotalValue({});
    setShowHighValueDialog(false);

    try {
      let podcastContent = '';

      // 根据输入模式获取内容
      if (inputMode === InputMode.URL) {
        toast({
          title: '正在提取播客内容...',
          description: '请稍候，正在从网页中提取文字内容',
        });

        const summaryResponse: any = await api.webSummary(
          podcastUrl,
          '请提取这个播客的完整文字内容，包括所有对话和讨论的要点'
        );

        if (summaryResponse.status !== 0) {
          throw new Error(summaryResponse.msg || '提取播客内容失败');
        }

        podcastContent = summaryResponse.data?.webSummary || '';

        if (!podcastContent) {
          throw new Error('未能提取到播客内容');
        }
      } else {
        podcastContent = transcript;
      }

      // AI分析播客内容
      toast({
        title: '正在进行AI智能分析...',
        description: '分析商业化价值、传播价值和潜在风险',
      });

      const analysisPrompt = `你是choSense播客分析助手，专为播客创作者提供量化的内容价值评估。请对以下播客内容进行全面分析：

播客内容：
${podcastContent}

请严格按照以下JSON格式输出分析结果（必须是有效的JSON数组）：

\`\`\`json
[
  {
    "id": "唯一标识符",
    "type": "ad_placement | risk_warning | viral_point | content_optimization",
    "position": "具体位置描述（如：第5分钟、开场白部分）",
    "timeRange": "时间范围（如：05:23-06:15）",
    "title": "建议标题",
    "description": "建议描述",
    "value": {
      "money": 预估金钱价值（元，数字），
      "fans": 预估粉丝影响数（数字），
      "engagementRate": 预估互动率提升（百分比数字，如5表示5%），
      "brandValue": 品牌价值指数（0-100）
    },
    "detailedAdvice": "详细建议内容",
    "scriptSample": "口播文案示例（仅广告位类型需要）",
    "riskReason": "风险原因（仅风险预警类型需要）",
    "modificationSuggestion": "修改建议（仅风险预警类型需要）",
    "promotionStrategy": "推广策略（仅传播爆点类型需要）",
    "priority": "high | medium | low"
  }
]
\`\`\`

分析要求：
1. **广告位机会（ad_placement）**：识别适合植入广告的情绪高峰点，预估广告收益（money），提供具体口播文案
2. **风险预警（risk_warning）**：检测舆论风险和掉粉风险，预估潜在损失（money为罚款/损失，fans为掉粉数），提供风险原因和修改建议
3. **传播爆点（viral_point）**：识别可出圈的观点，预估传播影响（fans、engagementRate），提供推广策略
4. **内容优化（content_optimization）**：提供内容改进建议，预估优化后的价值提升

请确保：
- 每个value对象至少包含一个有意义的数值
- money范围：1000-50000元
- fans范围：500-100000人
- engagementRate范围：1-20%
- brandValue范围：50-95分
- 优先级根据价值大小合理分配
- 只输出JSON数组，不要有其他文字`;

      let fullResponse = '';

      await sendChatStream({
        endpoint: WENXIN_CHAT_ENDPOINT,
        apiId: APP_ID,
        messages: [
          {
            role: 'system',
            content: '你是choSense播客分析专家，专注于提供结构化、量化的内容价值评估。你的输出必须是严格的JSON格式。'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        onUpdate: (content: string) => {
          fullResponse = content;
        },
        onComplete: () => {
          setIsAnalyzing(false);
          
          // 解析AI返回的建议
          const parsedSuggestions = parseAIResponse(fullResponse);
          
          if (parsedSuggestions.length === 0) {
            toast({
              title: '分析完成',
              description: '未能解析出结构化建议，请重试',
              variant: 'destructive',
            });
            return;
          }

          setSuggestions(parsedSuggestions);

          // 计算总价值
          const total: QuantifiedValue = {
            money: 0,
            fans: 0,
            engagementRate: 0,
            brandValue: 0
          };

          parsedSuggestions.forEach(s => {
            if (s.value.money) total.money = (total.money || 0) + s.value.money;
            if (s.value.fans) total.fans = (total.fans || 0) + s.value.fans;
            if (s.value.engagementRate) total.engagementRate = (total.engagementRate || 0) + s.value.engagementRate;
            if (s.value.brandValue) total.brandValue = Math.max(total.brandValue || 0, s.value.brandValue);
          });

          setTotalValue(total);

          // 检查是否有超过阈值的高价值建议
          const highValue = parsedSuggestions.filter(s => checkThreshold(s.value));
          
          if (highValue.length > 0) {
            setHighValueSuggestions(highValue);
            setShowHighValueDialog(true);
            toast({
              title: '🎉 发现高价值内容！',
              description: `检测到 ${highValue.length} 条超过阈值的重要建议`,
            });
          } else {
            toast({
              title: '分析完成',
              description: `已生成 ${parsedSuggestions.length} 条分析建议`,
            });
          }
        },
        onError: (error: Error) => {
          console.error('AI分析错误:', error);
          setIsAnalyzing(false);
          toast({
            title: '分析失败',
            description: error.message || '分析过程中出现错误，请重试',
            variant: 'destructive',
          });
        }
      });

    } catch (error: any) {
      console.error('播客分析错误:', error);
      setIsAnalyzing(false);
      toast({
        title: '分析失败',
        description: error.message || '处理播客时出现错误，请检查输入是否正确',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Radio className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">choSense</h1>
                <p className="text-sm text-muted-foreground">播客创作副驾驶 · AI驱动的量化价值分析</p>
              </div>
            </div>
            <ThresholdSettingsDialog onSettingsChange={setThresholds} />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 输入区域 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              播客内容分析
            </CardTitle>
            <CardDescription>
              输入播客URL或直接粘贴文字稿，AI将进行量化的商业价值、传播价值和风险评估
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as InputMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={InputMode.URL}>
                  <Link2 className="mr-2 h-4 w-4" />
                  播客URL
                </TabsTrigger>
                <TabsTrigger value={InputMode.TRANSCRIPT}>
                  <FileText className="mr-2 h-4 w-4" />
                  文字稿
                </TabsTrigger>
              </TabsList>

              <TabsContent value={InputMode.URL} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="请输入播客网址（如：https://example.com/podcast/episode-1）"
                    value={podcastUrl}
                    onChange={(e) => setPodcastUrl(e.target.value)}
                    disabled={isAnalyzing}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isAnalyzing) {
                        analyzePodcast();
                      }
                    }}
                  />
                  <Button
                    onClick={analyzePodcast}
                    disabled={isAnalyzing}
                    className="min-w-32"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        开始分析
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value={InputMode.TRANSCRIPT} className="space-y-4">
                <Textarea
                  placeholder="请粘贴播客的完整文字稿内容..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={isAnalyzing}
                  className="min-h-48"
                />
                <Button
                  onClick={analyzePodcast}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      开始分析
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {/* 功能说明 */}
            <div className="mt-6 grid gap-4 xl:grid-cols-4">
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <DollarSign className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <strong className="text-green-700 dark:text-green-400">广告位机会</strong>
                  <br />
                  识别可变现的情绪高峰，预估收益
                </AlertDescription>
              </Alert>
              <Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm">
                  <strong className="text-purple-700 dark:text-purple-400">传播爆点</strong>
                  <br />
                  发现可出圈的观点，预估影响力
                </AlertDescription>
              </Alert>
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm">
                  <strong className="text-red-700 dark:text-red-400">风险预警</strong>
                  <br />
                  检测舆论风险，预估潜在损失
                </AlertDescription>
              </Alert>
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <strong className="text-blue-700 dark:text-blue-400">内容优化</strong>
                  <br />
                  提供改进建议，提升整体价值
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* 总价值展示 */}
        {suggestions.length > 0 && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                总体价值评估
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 xl:grid-cols-4">
                {totalValue.money !== undefined && totalValue.money > 0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <DollarSign className="h-4 w-4" />
                      <span>预估收益</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-green-600">
                      ¥{totalValue.money.toLocaleString()}
                    </div>
                  </div>
                )}
                {totalValue.fans !== undefined && totalValue.fans > 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                      <Users className="h-4 w-4" />
                      <span>粉丝影响</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-blue-600">
                      {totalValue.fans.toLocaleString()}
                    </div>
                  </div>
                )}
                {totalValue.engagementRate !== undefined && totalValue.engagementRate > 0 && (
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
                    <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>互动率提升</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-purple-600">
                      +{totalValue.engagementRate}%
                    </div>
                  </div>
                )}
                {totalValue.brandValue !== undefined && totalValue.brandValue > 0 && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                    <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <Star className="h-4 w-4" />
                      <span>品牌价值</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-yellow-600">
                      {totalValue.brandValue}/100
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 分析建议列表 */}
        {suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                分析建议 <Badge variant="secondary">{suggestions.length} 条</Badge>
              </h2>
            </div>

            {/* 按类型分组显示 */}
            {[
              { type: SuggestionType.AD_PLACEMENT, title: '💰 广告位机会', color: 'text-green-600' },
              { type: SuggestionType.VIRAL_POINT, title: '🚀 传播爆点', color: 'text-purple-600' },
              { type: SuggestionType.RISK_WARNING, title: '⚠️ 风险预警', color: 'text-red-600' },
              { type: SuggestionType.CONTENT_OPTIMIZATION, title: '💡 内容优化', color: 'text-blue-600' }
            ].map(({ type, title, color }) => {
              const filtered = suggestions.filter(s => s.type === type);
              if (filtered.length === 0) return null;

              return (
                <div key={type} className="space-y-4">
                  <h3 className={`text-xl font-semibold ${color}`}>{title}</h3>
                  {filtered.map(suggestion => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* 空状态 */}
        {!isAnalyzing && suggestions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex min-h-96 flex-col items-center justify-center py-16 text-center">
              <Radio className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                开始分析您的播客内容
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                输入播客URL或粘贴文字稿，让AI帮您量化识别商业机会、传播爆点和潜在风险，
                助力您更安全地表达、更聪明地变现
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 高价值内容弹窗 */}
      <Dialog open={showHighValueDialog} onOpenChange={setShowHighValueDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              发现高价值内容！
            </DialogTitle>
            <DialogDescription>
              以下 {highValueSuggestions.length} 条建议超过了您设置的阈值，建议重点关注
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {highValueSuggestions.map(suggestion => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 页脚 */}
      <footer className="mt-16 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 choSense · 不替代创作，不打断表达，量化辅助您的播客创作之路</p>
        </div>
      </footer>
    </div>
  );
}
