import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, Calendar, FileText, TrendingUp, AlertTriangle, DollarSign, Eye } from 'lucide-react';
import { AnalysisHistory, SuggestionType } from '@/types/podcast';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryPanelProps {
  history: AnalysisHistory[];
  onViewDetail: (item: AnalysisHistory) => void;
}

export default function HistoryPanel({ history, onViewDetail }: HistoryPanelProps) {
  const [filter, setFilter] = useState<'all' | SuggestionType>('all');

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.suggestions.some(s => s.type === filter);
  });

  const getSuggestionTypeIcon = (type: SuggestionType) => {
    switch (type) {
      case SuggestionType.COMMERCIAL:
        return <DollarSign className="h-4 w-4" />;
      case SuggestionType.VIRAL:
        return <TrendingUp className="h-4 w-4" />;
      case SuggestionType.RISK:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSuggestionTypeLabel = (type: SuggestionType) => {
    switch (type) {
      case SuggestionType.COMMERCIAL:
        return '商业化';
      case SuggestionType.VIRAL:
        return '传播';
      case SuggestionType.RISK:
        return '风险';
    }
  };

  const getSuggestionTypeColor = (type: SuggestionType) => {
    switch (type) {
      case SuggestionType.COMMERCIAL:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case SuggestionType.VIRAL:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case SuggestionType.RISK:
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
    }
  };

  const getSuggestionStats = (item: AnalysisHistory) => {
    const stats = {
      commercial: 0,
      viral: 0,
      risk: 0
    };
    item.suggestions.forEach(s => {
      if (s.type === SuggestionType.COMMERCIAL) stats.commercial++;
      if (s.type === SuggestionType.VIRAL) stats.viral++;
      if (s.type === SuggestionType.RISK) stats.risk++;
    });
    return stats;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            分析历史记录
          </CardTitle>
          <CardDescription>
            查看您的历史分析记录和生成的建议
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 筛选器 */}
          <div className="mb-4 flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={filter === SuggestionType.COMMERCIAL ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(SuggestionType.COMMERCIAL)}
            >
              <DollarSign className="mr-1 h-3 w-3" />
              商业化
            </Button>
            <Button
              variant={filter === SuggestionType.VIRAL ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(SuggestionType.VIRAL)}
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              传播
            </Button>
            <Button
              variant={filter === SuggestionType.RISK ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(SuggestionType.RISK)}
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              风险
            </Button>
          </div>

          <Separator className="my-4" />

          {/* 历史记录列表 */}
          <ScrollArea className="h-[600px] pr-4">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <History className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  暂无历史记录
                </h3>
                <p className="text-sm text-muted-foreground">
                  开始分析播客内容后，历史记录将显示在这里
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => {
                  const stats = getSuggestionStats(item);
                  return (
                    <Card key={item.id} className="hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              {item.podcastTitle || '未命名播客'}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(item.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {item.inputMode === 'url' ? (
                              <><FileText className="mr-1 h-3 w-3" />URL</>
                            ) : (
                              <><FileText className="mr-1 h-3 w-3" />文字稿</>
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* 建议统计 */}
                        <div className="flex gap-2">
                          {stats.commercial > 0 && (
                            <Badge className={getSuggestionTypeColor(SuggestionType.COMMERCIAL)}>
                              {getSuggestionTypeIcon(SuggestionType.COMMERCIAL)}
                              <span className="ml-1">{stats.commercial}</span>
                            </Badge>
                          )}
                          {stats.viral > 0 && (
                            <Badge className={getSuggestionTypeColor(SuggestionType.VIRAL)}>
                              {getSuggestionTypeIcon(SuggestionType.VIRAL)}
                              <span className="ml-1">{stats.viral}</span>
                            </Badge>
                          )}
                          {stats.risk > 0 && (
                            <Badge className={getSuggestionTypeColor(SuggestionType.RISK)}>
                              {getSuggestionTypeIcon(SuggestionType.RISK)}
                              <span className="ml-1">{stats.risk}</span>
                            </Badge>
                          )}
                        </div>

                        {/* 学科记录 */}
                        {item.disciplineRecords.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            学科记录：{item.disciplineRecords.length} 条
                          </div>
                        )}

                        {/* 查看详情按钮 */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onViewDetail(item)}
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          查看详情
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
