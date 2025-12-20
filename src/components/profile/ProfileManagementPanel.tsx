import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Brain, Briefcase, Heart, Radio, Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  // 传播学画像
  communication: {
    accountName: string;
    followers: string;
    category: string;
    style: string;
    audienceAge: string;
    audienceInterests: string;
    contentThemes: string;
    updateFrequency: string;
    avgEngagement: string;
  };
  // 心理画像
  psychology: {
    emotionalPatterns: string;
    cognitiveTraits: string;
    beliefSystem: string;
    stressResponse: string;
  };
  // 商业画像
  business: {
    businessKnowledge: string;
    financialLiteracy: string;
    monetizationHistory: string;
    riskTolerance: string;
  };
  // 健康画像
  health: {
    lifestylePatterns: string;
    stressLevel: string;
    healthAwareness: string;
  };
  // 法律画像
  law: {
    legalRisks: string;
    complianceIssues: string;
    disclaimerUsage: string;
  };
}

interface ProfileManagementPanelProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

const DEFAULT_PROFILE: ProfileData = {
  communication: {
    accountName: '',
    followers: '',
    category: '',
    style: '',
    audienceAge: '',
    audienceInterests: '',
    contentThemes: '',
    updateFrequency: '',
    avgEngagement: '',
  },
  psychology: {
    emotionalPatterns: '',
    cognitiveTraits: '',
    beliefSystem: '',
    stressResponse: '',
  },
  business: {
    businessKnowledge: '',
    financialLiteracy: '',
    monetizationHistory: '',
    riskTolerance: '',
  },
  health: {
    lifestylePatterns: '',
    stressLevel: '',
    healthAwareness: '',
  },
  law: {
    legalRisks: '',
    complianceIssues: '',
    disclaimerUsage: '',
  },
};

export default function ProfileManagementPanel({ profile, onProfileChange }: ProfileManagementPanelProps) {
  const [localProfile, setLocalProfile] = useState<ProfileData>(profile);
  const { toast } = useToast();

  const handleSave = () => {
    onProfileChange(localProfile);
    toast({
      title: '保存成功',
      description: '个人画像已更新',
    });
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setLocalProfile({ ...DEFAULT_PROFILE, ...imported });
            toast({
              title: '导入成功',
              description: '画像数据已导入',
            });
          } catch (error) {
            toast({
              title: '导入失败',
              description: 'JSON格式错误',
              variant: 'destructive',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(localProfile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chosense-profile-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: '导出成功',
      description: '画像数据已导出',
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          填写您的个人画像信息，系统将根据这些信息提供更精准的价值评估和建议。所有数据仅保存在本地浏览器中。
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button onClick={handleImportJSON} variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          导入JSON
        </Button>
        <Button onClick={handleExportJSON} variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          导出JSON
        </Button>
      </div>

      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="communication">
            <Radio className="mr-2 h-4 w-4" />
            传播学
          </TabsTrigger>
          <TabsTrigger value="psychology">
            <Brain className="mr-2 h-4 w-4" />
            心理
          </TabsTrigger>
          <TabsTrigger value="business">
            <Briefcase className="mr-2 h-4 w-4" />
            商业
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="mr-2 h-4 w-4" />
            健康
          </TabsTrigger>
          <TabsTrigger value="law">
            <Scale className="mr-2 h-4 w-4" />
            法律
          </TabsTrigger>
        </TabsList>

        {/* 传播学画像 */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>传播学画像</CardTitle>
              <CardDescription>填写您的账号信息和受众特征</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>账号名称</Label>
                  <Input
                    value={localProfile.communication.accountName}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, accountName: e.target.value }
                    })}
                    placeholder="例如：职场成长笔记"
                  />
                </div>
                <div className="space-y-2">
                  <Label>粉丝规模</Label>
                  <Input
                    value={localProfile.communication.followers}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, followers: e.target.value }
                    })}
                    placeholder="例如：5-10万"
                  />
                </div>
                <div className="space-y-2">
                  <Label>内容类别</Label>
                  <Input
                    value={localProfile.communication.category}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, category: e.target.value }
                    })}
                    placeholder="例如：职场发展"
                  />
                </div>
                <div className="space-y-2">
                  <Label>内容风格</Label>
                  <Input
                    value={localProfile.communication.style}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, style: e.target.value }
                    })}
                    placeholder="例如：深度分析型"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>受众年龄段</Label>
                <Input
                  value={localProfile.communication.audienceAge}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    communication: { ...localProfile.communication, audienceAge: e.target.value }
                  })}
                  placeholder="例如：25-35岁"
                />
              </div>
              <div className="space-y-2">
                <Label>受众兴趣</Label>
                <Textarea
                  value={localProfile.communication.audienceInterests}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    communication: { ...localProfile.communication, audienceInterests: e.target.value }
                  })}
                  placeholder="例如：职场技能提升、时间管理、个人成长"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>内容主题</Label>
                <Textarea
                  value={localProfile.communication.contentThemes}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    communication: { ...localProfile.communication, contentThemes: e.target.value }
                  })}
                  placeholder="例如：职场沟通、领导力、效率工具"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>更新频率</Label>
                  <Input
                    value={localProfile.communication.updateFrequency}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, updateFrequency: e.target.value }
                    })}
                    placeholder="例如：每周2期"
                  />
                </div>
                <div className="space-y-2">
                  <Label>平均互动率</Label>
                  <Input
                    value={localProfile.communication.avgEngagement}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      communication: { ...localProfile.communication, avgEngagement: e.target.value }
                    })}
                    placeholder="例如：3.5%"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 心理画像 */}
        <TabsContent value="psychology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>心理画像</CardTitle>
              <CardDescription>描述您的情绪模式和认知特征</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>情绪模式</Label>
                <Textarea
                  value={localProfile.psychology.emotionalPatterns}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    psychology: { ...localProfile.psychology, emotionalPatterns: e.target.value }
                  })}
                  placeholder="例如：情绪稳定，偶尔在高压下会焦虑"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>认知特征</Label>
                <Textarea
                  value={localProfile.psychology.cognitiveTraits}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    psychology: { ...localProfile.psychology, cognitiveTraits: e.target.value }
                  })}
                  placeholder="例如：理性思维为主，注重逻辑和数据"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>信念系统</Label>
                <Textarea
                  value={localProfile.psychology.beliefSystem}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    psychology: { ...localProfile.psychology, beliefSystem: e.target.value }
                  })}
                  placeholder="例如：相信努力和坚持，追求持续进步"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>压力反应</Label>
                <Textarea
                  value={localProfile.psychology.stressResponse}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    psychology: { ...localProfile.psychology, stressResponse: e.target.value }
                  })}
                  placeholder="例如：压力下倾向于寻求解决方案，而非逃避"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 商业画像 */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>商业画像</CardTitle>
              <CardDescription>描述您的商业认知和变现经验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>商业认知水平</Label>
                <Textarea
                  value={localProfile.business.businessKnowledge}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    business: { ...localProfile.business, businessKnowledge: e.target.value }
                  })}
                  placeholder="例如：了解基本的商业模式，对市场营销有一定认知"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>财务素养</Label>
                <Textarea
                  value={localProfile.business.financialLiteracy}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    business: { ...localProfile.business, financialLiteracy: e.target.value }
                  })}
                  placeholder="例如：能够理解基本的财务报表，了解现金流的重要性"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>变现历史</Label>
                <Textarea
                  value={localProfile.business.monetizationHistory}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    business: { ...localProfile.business, monetizationHistory: e.target.value }
                  })}
                  placeholder="例如：曾通过广告植入获得收益，单次收益在5000-10000元"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>风险承受能力</Label>
                <Textarea
                  value={localProfile.business.riskTolerance}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    business: { ...localProfile.business, riskTolerance: e.target.value }
                  })}
                  placeholder="例如：中等风险承受能力，愿意尝试新的变现方式"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 健康画像 */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>健康画像</CardTitle>
              <CardDescription>描述您的生活方式和健康状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>生活方式模式</Label>
                <Textarea
                  value={localProfile.health.lifestylePatterns}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    health: { ...localProfile.health, lifestylePatterns: e.target.value }
                  })}
                  placeholder="例如：作息规律，每天运动30分钟，饮食均衡"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>压力水平</Label>
                <Textarea
                  value={localProfile.health.stressLevel}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    health: { ...localProfile.health, stressLevel: e.target.value }
                  })}
                  placeholder="例如：中等压力，主要来自工作和内容创作"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>健康意识</Label>
                <Textarea
                  value={localProfile.health.healthAwareness}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    health: { ...localProfile.health, healthAwareness: e.target.value }
                  })}
                  placeholder="例如：重视健康，定期体检，注意劳逸结合"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 法律画像 */}
        <TabsContent value="law" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>法律画像</CardTitle>
              <CardDescription>描述您的法律风险意识和合规情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>已知法律风险</Label>
                <Textarea
                  value={localProfile.law.legalRisks}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    law: { ...localProfile.law, legalRisks: e.target.value }
                  })}
                  placeholder="例如：曾因未注明广告标识收到警告"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>合规问题</Label>
                <Textarea
                  value={localProfile.law.complianceIssues}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    law: { ...localProfile.law, complianceIssues: e.target.value }
                  })}
                  placeholder="例如：对广告法了解不足，需要加强学习"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>免责声明使用情况</Label>
                <Textarea
                  value={localProfile.law.disclaimerUsage}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    law: { ...localProfile.law, disclaimerUsage: e.target.value }
                  })}
                  placeholder="例如：在推荐产品时会使用免责声明"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          保存画像
        </Button>
      </div>
    </div>
  );
}

export { DEFAULT_PROFILE };
export type { ProfileData };
