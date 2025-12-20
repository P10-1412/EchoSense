import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Upload, Download, Trash2, Plus, FileJson, FileSpreadsheet, Sparkles } from 'lucide-react';
import { CaseDatabase } from '@/types/podcast';
import { useToast } from '@/hooks/use-toast';

interface CaseDatabasePanelProps {
  cases: CaseDatabase[];
  onCasesChange: (cases: CaseDatabase[]) => void;
}

export default function CaseDatabasePanel({ cases, onCasesChange }: CaseDatabasePanelProps) {
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  // 导入JSON格式案例
  const handleImportJSON = () => {
    try {
      const imported = JSON.parse(importText);
      const newCases = Array.isArray(imported) ? imported : [imported];
      
      // 验证数据格式
      const validCases = newCases.filter((c: any) => 
        c.id && c.type && c.date && c.accountInfo && c.eventDescription && c.eventResult
      );

      if (validCases.length === 0) {
        throw new Error('没有找到有效的案例数据');
      }

      onCasesChange([...cases, ...validCases]);
      setImportText('');
      toast({
        title: '导入成功',
        description: `成功导入 ${validCases.length} 条案例`,
      });
    } catch (error: any) {
      toast({
        title: '导入失败',
        description: error.message || 'JSON格式错误，请检查数据格式',
        variant: 'destructive',
      });
    }
  };

  // AI辅助整合（模拟）
  const handleAIAssist = () => {
    setIsImporting(true);
    toast({
      title: 'AI整合中...',
      description: '正在分析和结构化您的数据',
    });

    // 模拟AI处理
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: 'AI整合完成',
        description: '数据已自动结构化，请检查并确认导入',
      });
    }, 2000);
  };

  // 导出案例数据
  const handleExport = () => {
    const dataStr = JSON.stringify(cases, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chosense-cases-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: '导出成功',
      description: `已导出 ${cases.length} 条案例数据`,
    });
  };

  // 删除案例
  const handleDelete = (id: string) => {
    onCasesChange(cases.filter(c => c.id !== id));
    toast({
      title: '删除成功',
      description: '案例已从数据库中移除',
    });
  };

  // 清空数据库
  const handleClearAll = () => {
    if (confirm('确定要清空所有案例数据吗？此操作不可恢复。')) {
      onCasesChange([]);
      toast({
        title: '数据库已清空',
        description: '所有案例数据已被删除',
      });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commercial': return '商业化';
      case 'viral': return '传播';
      case 'risk': return '风险';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commercial': return 'bg-green-500/10 text-green-700';
      case 'viral': return 'bg-purple-500/10 text-purple-700';
      case 'risk': return 'bg-red-500/10 text-red-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case 'positive': return '正面';
      case 'negative': return '负面';
      case 'neutral': return '中性';
      default: return outcome;
    }
  };

  return (
    <div className="space-y-6">
      {/* 导入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            导入案例数据
          </CardTitle>
          <CardDescription>
            支持JSON格式导入，或使用AI辅助整合非结构化数据
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              <strong>数据格式要求：</strong>
              <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
{`{
  "id": "case_001",
  "type": "commercial | viral | risk",
  "date": "2024-12-19",
  "accountInfo": {
    "name": "账号名称",
    "followers": "10-30万",
    "category": "内容类别",
    "style": "内容风格"
  },
  "eventDescription": "事件描述",
  "eventResult": {
    "outcome": "positive | negative | neutral",
    "revenue": 15000,
    "details": "详细结果描述"
  },
  "tags": ["标签1", "标签2"],
  "source": "数据来源"
}`}
              </pre>
            </AlertDescription>
          </Alert>

          <Textarea
            placeholder="粘贴JSON格式的案例数据，或粘贴非结构化文本后使用AI辅助整合..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="min-h-48 font-mono text-sm"
          />

          <div className="flex gap-2">
            <Button onClick={handleImportJSON} disabled={!importText.trim()}>
              <FileJson className="mr-2 h-4 w-4" />
              导入JSON
            </Button>
            <Button 
              onClick={handleAIAssist} 
              disabled={!importText.trim() || isImporting}
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI辅助整合
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 案例数据库 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                案例数据库
              </CardTitle>
              <CardDescription>
                共 {cases.length} 条案例数据
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm" disabled={cases.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
              <Button onClick={handleClearAll} variant="outline" size="sm" disabled={cases.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                清空
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {cases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Database className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  数据库为空
                </h3>
                <p className="text-sm text-muted-foreground">
                  导入案例数据后，将用于更精准的价值评估和案例匹配
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <Card key={caseItem.id} className="border-l-4" style={{
                    borderLeftColor: caseItem.type === 'commercial' ? 'rgb(34 197 94)' :
                                    caseItem.type === 'viral' ? 'rgb(168 85 247)' :
                                    'rgb(239 68 68)'
                  }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge className={getTypeColor(caseItem.type)}>
                              {getTypeLabel(caseItem.type)}
                            </Badge>
                            <Badge variant="outline">
                              {getOutcomeLabel(caseItem.eventResult.outcome)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{caseItem.date}</span>
                          </div>
                          <CardTitle className="text-base">
                            {caseItem.accountInfo.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {caseItem.accountInfo.followers} · {caseItem.accountInfo.category} · {caseItem.accountInfo.style}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(caseItem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <strong>事件描述：</strong>
                        <p className="mt-1 text-muted-foreground">{caseItem.eventDescription}</p>
                      </div>
                      <div>
                        <strong>结果：</strong>
                        <p className="mt-1 text-muted-foreground">{caseItem.eventResult.details}</p>
                        {caseItem.eventResult.revenue && (
                          <p className="mt-1 text-green-600">收益：¥{caseItem.eventResult.revenue.toLocaleString()}</p>
                        )}
                        {caseItem.eventResult.loss && (
                          <p className="mt-1 text-red-600">损失：¥{caseItem.eventResult.loss.toLocaleString()}</p>
                        )}
                        {caseItem.eventResult.fansChange && (
                          <p className="mt-1">粉丝变化：{caseItem.eventResult.fansChange > 0 ? '+' : ''}{caseItem.eventResult.fansChange.toLocaleString()}</p>
                        )}
                        {caseItem.eventResult.engagementChange && (
                          <p className="mt-1">互动率变化：{caseItem.eventResult.engagementChange > 0 ? '+' : ''}{caseItem.eventResult.engagementChange}%</p>
                        )}
                      </div>
                      {caseItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {caseItem.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        来源：{caseItem.source}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
