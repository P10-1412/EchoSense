import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Brain, Briefcase, Heart, Radio, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { DisciplineType, DisciplineRecord } from '@/types/podcast';

interface DisciplineProfileProps {
  records: DisciplineRecord[];
  customDisciplines?: { name: string; records: DisciplineRecord[] }[];
}

export default function DisciplineProfile({ records, customDisciplines }: DisciplineProfileProps) {
  // 按学科分组
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.discipline]) {
      acc[record.discipline] = [];
    }
    acc[record.discipline].push(record);
    return acc;
  }, {} as Record<DisciplineType, DisciplineRecord[]>);

  // 学科配置
  const disciplineConfig = {
    [DisciplineType.LAW]: {
      icon: Scale,
      label: '法律画像',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      description: '记录潜在违法表达、事实性风险、责任归属模糊表述'
    },
    [DisciplineType.PSYCHOLOGY]: {
      icon: Brain,
      label: '心理画像',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      description: '记录信念模式、情绪叙事特点、潜在认知偏差'
    },
    [DisciplineType.BUSINESS]: {
      icon: Briefcase,
      label: '商业/会计画像',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      description: '记录认知误区、低级错误、商业模式漏洞'
    },
    [DisciplineType.HEALTH]: {
      icon: Heart,
      label: '健康/医学画像',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      borderColor: 'border-pink-200 dark:border-pink-800',
      description: '记录身体状态、生活习惯，提示潜在健康风险'
    },
    [DisciplineType.COMMUNICATION]: {
      icon: Radio,
      label: '传播学画像',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: '记录账号风格、受众特征、传播效果'
    }
  };

  // 严重程度徽章
  const getSeverityBadge = (severity?: 'low' | 'medium' | 'high') => {
    if (!severity) return null;
    const config = {
      low: { variant: 'secondary' as const, label: '低风险', icon: Info },
      medium: { variant: 'default' as const, label: '中风险', icon: AlertTriangle },
      high: { variant: 'destructive' as const, label: '高风险', icon: AlertTriangle }
    };
    const { variant, label, icon: Icon } = config[severity];
    return (
      <Badge variant={variant} className="ml-2">
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  if (records.length === 0 && (!customDisciplines || customDisciplines.length === 0)) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex min-h-48 flex-col items-center justify-center py-12 text-center">
          <Brain className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            暂无学科画像记录<br />
            完成首次分析后，系统将自动建立您的全科画像
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          全科画像记录
        </CardTitle>
        <CardDescription>
          基于五大核心学科的长期追踪，帮助您建立多维度的专业认知
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* 五大核心学科 */}
          {Object.entries(disciplineConfig).map(([discipline, config]) => {
            const disciplineRecords = groupedRecords[discipline as DisciplineType] || [];
            if (disciplineRecords.length === 0) return null;

            const Icon = config.icon;

            return (
              <AccordionItem key={discipline} value={discipline}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {disciplineRecords.length} 条记录
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-13 pt-2">
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                    
                    {disciplineRecords.map((record) => (
                      <Alert key={record.id} className={`${config.borderColor} border-l-4`}>
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{record.date}</span>
                                <span className="text-xs font-medium">{record.podcastTitle}</span>
                                {getSeverityBadge(record.severity)}
                              </div>
                            </div>
                            
                            {record.findings.length > 0 && (
                              <div>
                                <strong className="text-sm">核心记录：</strong>
                                <ul className="mt-1 space-y-1 text-sm">
                                  {record.findings.map((finding, idx) => (
                                    <li key={idx} className="ml-4 list-disc">{finding}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {record.suggestions.length > 0 && (
                              <div>
                                <strong className="text-sm text-green-700 dark:text-green-400">
                                  <CheckCircle className="mr-1 inline h-3 w-3" />
                                  建议：
                                </strong>
                                <ul className="mt-1 space-y-1 text-sm">
                                  {record.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="ml-4 list-disc">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          {/* 动态主题学科 */}
          {customDisciplines && customDisciplines.map((custom, index) => (
            <AccordionItem key={`custom-${index}`} value={`custom-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{custom.name}画像</div>
                    <div className="text-xs text-muted-foreground">
                      {custom.records.length} 条记录
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-13 pt-2">
                  {custom.records.map((record) => (
                    <Alert key={record.id} className="border-l-4 border-orange-200 dark:border-orange-800">
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{record.date}</span>
                            <span className="text-xs font-medium">{record.podcastTitle}</span>
                          </div>
                          
                          {record.findings.length > 0 && (
                            <div>
                              <strong className="text-sm">核心记录：</strong>
                              <ul className="mt-1 space-y-1 text-sm">
                                {record.findings.map((finding, idx) => (
                                  <li key={idx} className="ml-4 list-disc">{finding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {record.suggestions.length > 0 && (
                            <div>
                              <strong className="text-sm text-green-700 dark:text-green-400">
                                <CheckCircle className="mr-1 inline h-3 w-3" />
                                建议：
                              </strong>
                              <ul className="mt-1 space-y-1 text-sm">
                                {record.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="ml-4 list-disc">{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
