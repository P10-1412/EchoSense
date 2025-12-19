import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Sparkles, TrendingUp, AlertTriangle, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api, { WENXIN_CHAT_ENDPOINT } from '@/services/api';
import { sendChatStream } from '@/services/chatStream';
import { Streamdown } from 'streamdown';

const APP_ID = import.meta.env.VITE_APP_ID;

export default function PodcastAnalysis() {
  const [podcastUrl, setPodcastUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generalAnalysis, setGeneralAnalysis] = useState('');
  const [highValueContent, setHighValueContent] = useState('');
  const [showHighValueDialog, setShowHighValueDialog] = useState(false);
  const { toast } = useToast();

  const analyzePodcast = async () => {
    if (!podcastUrl.trim()) {
      toast({
        title: '请输入播客URL',
        description: '请提供有效的播客网址以进行分析',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setGeneralAnalysis('');
    setHighValueContent('');
    setShowHighValueDialog(false);

    try {
      // 第一步：提取播客内容
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

      const podcastContent = summaryResponse.data?.webSummary || '';

      if (!podcastContent) {
        throw new Error('未能提取到播客内容');
      }

      // 第二步：AI分析播客内容
      toast({
        title: '正在进行AI智能分析...',
        description: '分析商业化价值、传播价值和潜在风险',
      });

      const analysisPrompt = `你是choSense播客分析助手，专为播客创作者提供专业的内容价值评估。请对以下播客内容进行全面分析：

播客内容：
${podcastContent}

请从以下三个维度进行深度分析：

1. **商业化价值评估**
   - 识别可商业化的情绪高峰点
   - 评估内容的变现潜力（广告植入、品牌合作、付费内容等）
   - 给出商业化价值评分（1-10分）

2. **传播价值评估**
   - 识别可传播的观点爆点
   - 分析内容的出圈潜力和病毒传播可能性
   - 评估社交媒体传播适配度
   - 给出传播价值评分（1-10分）

3. **风险评估**
   - 检测潜在的舆论风险点
   - 识别可能导致掉粉的敏感内容
   - 提供风险规避建议
   - 给出风险等级（低/中/高）

请以结构化的方式呈现分析结果，包含具体的时间点或内容片段引用。如果发现显著高价值内容（商业化或传播价值评分≥8分），请在分析开头用【高价值内容】标记。`;

      let fullAnalysis = '';
      let isHighValue = false;

      await sendChatStream({
        endpoint: WENXIN_CHAT_ENDPOINT,
        apiId: APP_ID,
        messages: [
          {
            role: 'system',
            content: '你是choSense播客分析专家，专注于帮助创作者识别内容的商业价值、传播潜力和风险点。'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        onUpdate: (content: string) => {
          fullAnalysis = content;
          // 检测是否包含高价值标记
          if (content.includes('【高价值内容】')) {
            isHighValue = true;
          }
          setGeneralAnalysis(content);
        },
        onComplete: () => {
          setIsAnalyzing(false);
          
          // 如果是高价值内容，显示弹窗
          if (isHighValue) {
            setHighValueContent(fullAnalysis);
            setShowHighValueDialog(true);
            toast({
              title: '🎉 发现高价值内容！',
              description: '检测到显著的商业化或传播价值，已为您重点标注',
            });
          } else {
            toast({
              title: '分析完成',
              description: '播客内容分析已完成，请查看右侧结果',
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
        description: error.message || '处理播客时出现错误，请检查URL是否正确',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Radio className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">choSense</h1>
              <p className="text-sm text-muted-foreground">播客创作副驾驶 · AI驱动的价值分析</p>
            </div>
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
              输入播客URL，AI将自动提取内容并进行商业化价值、传播价值和风险评估
            </CardDescription>
          </CardHeader>
          <CardContent>
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

            {/* 功能说明 */}
            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              <Alert className="border-primary/20 bg-primary/5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="text-primary">商业化价值</strong>
                  <br />
                  识别可变现的情绪高峰和商业机会
                </AlertDescription>
              </Alert>
              <Alert className="border-secondary/20 bg-secondary/5">
                <Sparkles className="h-4 w-4 text-secondary" />
                <AlertDescription className="text-sm">
                  <strong className="text-secondary">传播价值</strong>
                  <br />
                  发现可出圈的观点爆点和传播潜力
                </AlertDescription>
              </Alert>
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-sm">
                  <strong className="text-destructive">风险评估</strong>
                  <br />
                  检测舆论风险和潜在掉粉因素
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* 分析结果区域 */}
        {generalAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>分析结果</CardTitle>
              <CardDescription>
                基于AI驱动的多维度内容价值评估
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Streamdown>{generalAnalysis}</Streamdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {!generalAnalysis && !isAnalyzing && (
          <Card className="border-dashed">
            <CardContent className="flex min-h-96 flex-col items-center justify-center py-16 text-center">
              <Radio className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                开始分析您的播客内容
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                输入播客URL，让AI帮您识别商业化机会、传播爆点和潜在风险，
                助力您更安全地表达、更聪明地变现
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 高价值内容弹窗 */}
      <Dialog open={showHighValueDialog} onOpenChange={setShowHighValueDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              发现高价值内容！
            </DialogTitle>
            <DialogDescription>
              检测到显著的商业化或传播价值，建议重点关注以下分析结果
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Streamdown>{highValueContent}</Streamdown>
          </div>
        </DialogContent>
      </Dialog>

      {/* 页脚 */}
      <footer className="mt-16 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 choSense · 不替代创作，不打断表达，隐形辅助您的播客创作之路</p>
        </div>
      </footer>
    </div>
  );
}
