import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Brain, Briefcase, Heart, Radio } from 'lucide-react';
import { DisciplineRecord, DisciplineType } from '@/types/podcast';

interface DisciplineProfileProps {
  records: DisciplineRecord[];
  customDisciplines?: { name: string; records: DisciplineRecord[] }[];
}

export default function DisciplineProfile({ records, customDisciplines }: DisciplineProfileProps) {
  // 按学科分组，去重
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.discipline]) {
      acc[record.discipline] = [];
    }
    // 检查是否已存在相同ID的记录
    if (!acc[record.discipline].some(r => r.id === record.id)) {
      acc[record.discipline].push(record);
    }
    return acc;
  }, {} as Record<DisciplineType, DisciplineRecord[]>);

  // 学科配置
  const disciplineConfig = {
    [DisciplineType.LAW]: {
      name: '法律画像',
      icon: Scale,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      description: '记录法律风险、合规问题等客观事实'
    },
    [DisciplineType.PSYCHOLOGY]: {
      name: '心理画像',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      description: '记录播主心理状态、情绪模式、认知特征等客观观察'
    },
    [DisciplineType.BUSINESS]: {
      name: '商业画像',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      description: '记录商业认知水平、财务素养等客观事实'
    },
    [DisciplineType.HEALTH]: {
      name: '健康画像',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-500/10',
      description: '记录生活方式、健康状态等客观观察'
    },
    [DisciplineType.COMMUNICATION]: {
      name: '传播学画像',
      icon: Radio,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      description: '记录账号风格、受众特征、传播效果等客观数据'
    }
  };

  const getSeverityBadge = (severity?: 'low' | 'medium' | 'high') => {
    if (!severity) return null;
    const config = {
      low: { label: '低', className: 'bg-green-500/10 text-green-700' },
      medium: { label: '中', className: 'bg-yellow-500/10 text-yellow-700' },
      high: { label: '高', className: 'bg-red-500/10 text-red-700' }
    };
    const { label, className} = config[severity];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>全科画像档案</CardTitle>
        <CardDescription>
          从五大学科视角记录的客观事实，不包含建议
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {Object.entries(disciplineConfig).map(([discipline, config]) => {
            const disciplineRecords = groupedRecords[discipline as DisciplineType] || [];
            const Icon = config.icon;

            return (
              <AccordionItem key={discipline} value={discipline}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <span className="font-semibold">{config.name}</span>
                    <Badge variant="secondary">{disciplineRecords.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                    
                    {disciplineRecords.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        暂无记录
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {disciplineRecords.map((record) => (
                          <div
                            key={record.id}
                            className={`rounded-lg ${config.bgColor} p-4`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{record.podcastTitle}</span>
                                {record.severity && getSeverityBadge(record.severity)}
                              </div>
                              <span className="text-xs text-muted-foreground">{record.date}</span>
                            </div>
                            
                            <div>
                              <h4 className="mb-1 text-sm font-semibold">客观观察：</h4>
                              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                {record.observations.map((obs, idx) => (
                                  <li key={idx}>{obs}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          {/* 动态主题学科 */}
          {customDisciplines && customDisciplines.map((custom) => (
            <AccordionItem key={custom.name} value={custom.name}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">{custom.name}</span>
                  <Badge variant="secondary">{custom.records.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {custom.records.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      暂无记录
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {custom.records.map((record) => (
                        <div
                          key={record.id}
                          className="rounded-lg bg-orange-500/10 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">{record.podcastTitle}</span>
                            <span className="text-xs text-muted-foreground">{record.date}</span>
                          </div>
                          
                          <div>
                            <h4 className="mb-1 text-sm font-semibold">客观观察：</h4>
                            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                              {record.observations.map((obs, idx) => (
                                <li key={idx}>{obs}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
