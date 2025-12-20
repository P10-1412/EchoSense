import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Radio, Link2, FileText, Sparkles, Eye, EyeOff, Settings, History, Database, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api, { WENXIN_CHAT_ENDPOINT } from '@/services/api';
import { sendChatStream } from '@/services/chatStream';
import SuggestionCard from '@/components/podcast/SuggestionCard';
import DisciplineProfile from '@/components/podcast/DisciplineProfile';
import SettingsPanel from '@/components/settings/SettingsPanel';
import HistoryPanel from '@/components/history/HistoryPanel';
import CaseDatabasePanel from '@/components/database/CaseDatabasePanel';
import ProfileManagementPanel, { DEFAULT_PROFILE, ProfileData } from '@/components/profile/ProfileManagementPanel';
import { 
  InputMode, 
  Suggestion, 
  DisciplineRecord,
  UserProfile,
  DEFAULT_USER_PROFILE,
  COMMERCIAL_CASE_LIBRARY,
  VIRAL_CASE_LIBRARY,
  RISK_CASE_LIBRARY,
  UserSettings,
  DEFAULT_SETTINGS,
  AnalysisHistory,
  CaseDatabase
} from '@/types/podcast';

const APP_ID = import.meta.env.VITE_APP_ID;
const USER_PROFILE_KEY = 'chosense_user_profile';
const PERSONAL_PROFILE_KEY = 'chosense_personal_profile';
const SETTINGS_KEY = 'chosense_settings';
const HISTORY_KEY = 'chosense_history';
const CASES_KEY = 'chosense_cases';

export default function PodcastAnalysis() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.URL);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 分析结果
  const [highValueSuggestions, setHighValueSuggestions] = useState<Suggestion[]>([]);
  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>([]);
  const [showHighValueDialog, setShowHighValueDialog] = useState(false);
  
  // 用户画像（AI生成的学科画像）
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  
  // 个人画像（用户手动填写）
  const [personalProfile, setPersonalProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  
  // 用户设置
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  
  // 历史记录
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  
  // 案例数据库
  const [cases, setCases] = useState<CaseDatabase[]>([]);
  
  // UI状态
  const [showDisciplineProfile, setShowDisciplineProfile] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showCasesDialog, setShowCasesDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  const { toast } = useToast();

  // 加载所有数据
  useEffect(() => {
    // 加载用户画像（AI生成）
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('加载用户画像失败:', error);
      }
    }
    
    // 加载个人画像（用户填写）
    const storedPersonalProfile = localStorage.getItem(PERSONAL_PROFILE_KEY);
    if (storedPersonalProfile) {
      try {
        setPersonalProfile(JSON.parse(storedPersonalProfile));
      } catch (error) {
        console.error('加载个人画像失败:', error);
      }
    }
    
    // 加载设置
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }
    
    // 加载历史记录
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    }
    
    // 加载案例数据库
    const storedCases = localStorage.getItem(CASES_KEY);
    if (storedCases) {
      try {
        setCases(JSON.parse(storedCases));
      } catch (error) {
        console.error('加载案例数据库失败:', error);
      }
    }
  }, []);

  // 保存用户画像（AI生成）
  const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setUserProfile(profile);
  };
  
  // 保存个人画像（用户填写）
  const savePersonalProfile = (profile: ProfileData) => {
    localStorage.setItem(PERSONAL_PROFILE_KEY, JSON.stringify(profile));
    setPersonalProfile(profile);
  };
  
  // 保存设置
  const saveSettings = (newSettings: UserSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  };
  
  // 保存历史记录
  const saveHistory = (newHistory: AnalysisHistory[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };
  
  // 保存案例数据库
  const saveCases = (newCases: CaseDatabase[]) => {
    localStorage.setItem(CASES_KEY, JSON.stringify(newCases));
    setCases(newCases);
  };
  
  // 清空历史记录
  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };
  
  // 清空画像数据
  const clearProfile = () => {
    localStorage.removeItem(USER_PROFILE_KEY);
    setUserProfile(DEFAULT_USER_PROFILE);
  };

  // 解析AI返回的JSON
  const parseAIResponse = (content: string): { suggestions: Suggestion[]; disciplines: DisciplineRecord[] } => {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*"suggestions"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        return {
          suggestions: parsed.suggestions || [],
          disciplines: parsed.disciplines || []
        };
      }
      return { suggestions: [], disciplines: [] };
    } catch (error) {
      console.error('解析AI响应失败:', error);
      return { suggestions: [], disciplines: [] };
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
    setHighValueSuggestions([]);
    setDisciplineRecords([]);
    setShowHighValueDialog(false);

    try {
      let podcastContent = '';

      // 根据输入模式获取内容
      if (inputMode === InputMode.URL) {
        toast({
          title: '正在提取播客内容...',
          description: 'choSense 静默运行中，仅在检测到关键节点时出现',
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

      // AI分析
      toast({
        title: '静默分析中...',
        description: '正在进行全科视角的价值评估与风险识别',
      });

      const analysisPrompt = `你是choSense播客分析专家，专注于"静默运行、精准识别"的价值雷达系统。

【核心理念】
- 不替代创作、不打断表达
- 仅识别前1%极高价值或前10%高价值内容
- 提供相对价值评估（不输出绝对金额）
- 整合五大学科视角（法律、心理、商业、健康、传播）
- 综合用户画像和案例数据库进行精准评估

【用户个人画像】（用户主动提供）
传播学画像：
- 账号名称：${personalProfile.communication.accountName || '未填写'}
- 粉丝规模：${personalProfile.communication.followers || '未填写'}
- 内容类别：${personalProfile.communication.category || '未填写'}
- 内容风格：${personalProfile.communication.style || '未填写'}
- 受众年龄：${personalProfile.communication.audienceAge || '未填写'}
- 受众兴趣：${personalProfile.communication.audienceInterests || '未填写'}
- 内容主题：${personalProfile.communication.contentThemes || '未填写'}
- 更新频率：${personalProfile.communication.updateFrequency || '未填写'}
- 平均互动率：${personalProfile.communication.avgEngagement || '未填写'}

心理画像：
- 情绪模式：${personalProfile.psychology.emotionalPatterns || '未填写'}
- 认知特征：${personalProfile.psychology.cognitiveTraits || '未填写'}
- 信念系统：${personalProfile.psychology.beliefSystem || '未填写'}
- 压力反应：${personalProfile.psychology.stressResponse || '未填写'}

商业画像：
- 商业认知：${personalProfile.business.businessKnowledge || '未填写'}
- 财务素养：${personalProfile.business.financialLiteracy || '未填写'}
- 变现历史：${personalProfile.business.monetizationHistory || '未填写'}
- 风险承受：${personalProfile.business.riskTolerance || '未填写'}

健康画像：
- 生活方式：${personalProfile.health.lifestylePatterns || '未填写'}
- 压力水平：${personalProfile.health.stressLevel || '未填写'}
- 健康意识：${personalProfile.health.healthAwareness || '未填写'}

法律画像：
- 法律风险：${personalProfile.law.legalRisks || '未填写'}
- 合规问题：${personalProfile.law.complianceIssues || '未填写'}
- 免责声明：${personalProfile.law.disclaimerUsage || '未填写'}

【AI生成的学科画像】（历史积累）
账号风格：${userProfile.communication.accountStyle}
受众画像：${userProfile.communication.audienceProfile}
内容主题：${userProfile.communication.contentThemes.join('、')}
平均互动率：${userProfile.communication.avgEngagement}%
风险承受能力：${userProfile.business.riskTolerance}
投资贴现率：${userProfile.business.investmentDiscount}

【案例数据库】（${cases.length}个案例）
${cases.length > 0 ? `
商业化案例：${cases.filter(c => c.type === 'commercial').length}个
传播案例：${cases.filter(c => c.type === 'viral').length}个
风险案例：${cases.filter(c => c.type === 'risk').length}个

最近案例示例：
${cases.slice(0, 3).map(c => `- [${c.type}] ${c.accountInfo.name}: ${c.eventDescription}`).join('\n')}
` : '暂无案例数据'}

【播客内容】
${podcastContent}

【价值评估要求】
1. **综合画像分析**：结合用户个人画像和AI生成画像，全面了解创作者特征
2. **案例匹配**：从案例数据库中寻找相似案例，作为价值评估的参考基准
3. **相对价值计算**：基于相似案例的历史表现，评估当前内容的相对价值
4. **风险评估**：结合用户的法律画像和风险承受能力，评估潜在风险
5. **个性化建议**：根据用户的心理画像、商业画像，提供可执行的建议

【分析要求】
请严格按照以下JSON格式输出（必须是有效的JSON）：

\`\`\`json
{
  "suggestions": [
    {
      "id": "唯一标识",
      "type": "commercial | viral | risk",
      "position": "第X分钟Y秒",
      "timeRange": "XX:XX-XX:XX",
      "content": "段落原文",
      "title": "建议标题",
      "priority": "critical | high | medium | low",
      
      // 商业化类型专用字段
      "compatibility": {
        "naturalEmbedding": 85,
        "audienceClarity": 90,
        "viewpointCompleteness": 88,
        "overallScore": 88
      },
      "adFormats": ["中插口播广告", "品牌共创测评"],
      "scriptSample": "口播脚本示例",
      
      // 传播类型专用字段
      "viralPotential": {
        "counterIntuitive": 85,
        "conflictLevel": 75,
        "clipability": 90,
        "overallScore": 83
      },
      "distributionPaths": ["小红书观点共鸣", "知乎话题讨论"],
      "contentStrategy": "内容策略详细说明",
      
      // 风险类型专用字段
      "riskAnalysis": {
        "extremism": 75,
        "uncertainty": 60,
        "groupSensitivity": 70,
        "overallScore": 68
      },
      "potentialImpact": "评论区极化，互动率下降3-8%",
      "originalStatement": "原表述",
      "revisedStatement": "修改后表述",
      
      // 通用字段：相对价值评估
      "relativeValue": {
        "percentile": 95,
        "rank": "前5%",
        "referenceCases": [
          {
            "id": "case_001",
            "description": "案例描述",
            "context": "相似场景",
            "audienceSize": "5-10万粉丝",
            "priceRange": "8000-15000元",
            "effectData": "互动率提升3-5%",
            "source": "数据来源"
          }
        ],
        "explanation": "可解释路径：为什么这个内容有价值",
        "adoptionCost": {
          "timeRequired": "30分钟",
          "difficulty": "easy | medium | hard",
          "resources": ["所需资源1", "所需资源2"]
        }
      },
      "actionableAdvice": "详细的可操作建议"
    }
  ],
  "disciplines": [
    {
      "id": "discipline_law_001",
      "discipline": "law",
      "date": "2025-12-19",
      "podcastTitle": "播客标题",
      "observations": [
        "在推荐产品时未使用免责声明",
        "对某行业做出绝对化评价，可能涉及商业诋毁风险",
        "引用数据时未注明来源"
      ],
      "severity": "medium"
    },
    {
      "id": "discipline_psychology_001",
      "discipline": "psychology",
      "date": "2025-12-19",
      "podcastTitle": "播客标题",
      "observations": [
        "在讨论工作话题时，多次使用'必须'、'一定要'等绝对化表述",
        "对失败的容忍度较低，表现出明显的完美主义倾向",
        "情绪波动较大，从兴奋到沮丧转换迅速"
      ],
      "severity": "low"
    },
    {
      "id": "discipline_communication_001",
      "discipline": "communication",
      "date": "2025-12-19",
      "podcastTitle": "播客标题",
      "observations": [
        "受众主要为25-35岁职场人士",
        "内容风格偏向深度分析，单期时长30-45分钟",
        "平均互动率3.5%，高于行业平均水平",
        "受众更喜欢实用技巧类内容，理论讨论互动较低"
      ]
    }
  ]
}
\`\`\`

【关键规则】
1. **触发标准**：仅输出历史分位数≥90%的内容（前10%），percentile≥99为critical，≥90为high
2. **相对价值**：必须从案例库匹配参考案例，不输出绝对金额，仅提供区间和可解释路径
3. **采纳成本**：必须考虑用户的时间成本、执行难度、所需资源
4. **用户画像**：评估时必须结合用户的账号风格、受众特征、风险承受能力
5. **全科视角（必须）**：必须从五大学科角度记录客观事实，每个学科至少2-3条observations
6. **画像记录要求（强制）**：
   - 法律画像：记录法律风险、合规问题、免责声明使用情况等客观事实
   - 心理画像：记录播主心理状态、情绪模式、认知特征、压力反应等客观观察
   - 商业画像：记录商业认知水平、财务素养、变现历史等客观事实
   - 健康画像：记录生活方式、压力指标、健康意识等客观观察
   - 传播学画像：记录账号风格、受众特征、内容风格、传播效果等客观数据
7. **observations字段（必填）**：每个discipline记录必须包含observations数组，至少2-3条具体观察
8. **案例库参考**：
   - 商业化：${JSON.stringify(COMMERCIAL_CASE_LIBRARY.slice(0, 2))}
   - 传播：${JSON.stringify(VIRAL_CASE_LIBRARY.slice(0, 2))}
   - 风险：${JSON.stringify(RISK_CASE_LIBRARY.slice(0, 2))}

只输出JSON，不要有其他文字。`;

      let fullResponse = '';

      await sendChatStream({
        endpoint: WENXIN_CHAT_ENDPOINT,
        apiId: APP_ID,
        messages: [
          {
            role: 'system',
            content: 'you are choSense播客分析专家，专注于静默运行的价值雷达系统。你的输出必须是严格的JSON格式。'
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
          
          const { suggestions, disciplines } = parseAIResponse(fullResponse);
          
          // 更新建议
          setHighValueSuggestions(suggestions);
          setDisciplineRecords(disciplines);

          // 更新用户画像
          if (disciplines.length > 0) {
            const updatedProfile = { ...userProfile };
            disciplines.forEach(record => {
              if (record.discipline in updatedProfile.disciplineHistory) {
                updatedProfile.disciplineHistory[record.discipline].push(record);
              }
            });
            saveUserProfile(updatedProfile);
          }

          // 保存历史记录（无论是否有建议都保存）
          const newHistoryItem: AnalysisHistory = {
            id: `history_${Date.now()}`,
            date: new Date().toISOString(),
            inputMode: inputMode,
            podcastTitle: inputMode === InputMode.URL ? podcastUrl : '手动输入的播客内容',
            inputContent: inputMode === InputMode.URL ? podcastUrl : transcript.substring(0, 200) + '...',
            suggestions: suggestions,
            disciplineRecords: disciplines,
            timestamp: Date.now(),
          };
          
          const updatedHistory = [newHistoryItem, ...history];
          saveHistory(updatedHistory);

          // 显示结果提示
          if (suggestions.length === 0 && disciplines.length === 0) {
            toast({
              title: '分析完成',
              description: '未检测到需要重点关注的内容，您的播客整体表现良好',
            });
            return;
          }

          // 检查是否有极高价值内容（前1%）
          const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
          
          if (criticalSuggestions.length > 0) {
            setShowHighValueDialog(true);
            toast({
              title: '🎯 检测到极高价值内容！',
              description: `发现 ${criticalSuggestions.length} 条前1%的关键节点，建议重点关注`,
            });
          } else if (suggestions.length > 0) {
            toast({
              title: '✨ 分析完成',
              description: `识别到 ${suggestions.length} 条高价值建议`,
            });
          }

          if (disciplines.length > 0) {
            toast({
              title: '📚 全科画像已更新',
              description: `新增 ${disciplines.length} 条学科记录`,
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

  // 获取所有学科记录（仅从历史中获取，避免重复）
  const getAllDisciplineRecords = (): DisciplineRecord[] => {
    const allRecords: DisciplineRecord[] = [];
    Object.values(userProfile.disciplineHistory).forEach(records => {
      allRecords.push(...records);
    });
    // 不再添加当前的disciplineRecords，因为它们已经被保存到历史中了
    return allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* 第一行：Logo和标题 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Radio className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">choSense</h1>
                  <p className="text-sm text-muted-foreground">静默运行内容价值雷达 · 不替代创作，不打断表达</p>
                </div>
              </div>
              <Button
                variant={showDisciplineProfile ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowDisciplineProfile(!showDisciplineProfile)}
              >
                {showDisciplineProfile ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showDisciplineProfile ? '隐藏' : '查看'}全科画像
              </Button>
            </div>
            
            {/* 第二行：操作按钮 */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileDialog(true)}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                个人画像
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettingsDialog(true)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                设置
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryDialog(true)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                历史分析报告
                {history.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {history.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCasesDialog(true)}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                案例数据库
                {cases.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {cases.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 xl:grid-cols-3">
          {/* 左侧：输入区域 + 高价值建议 */}
          <div className="space-y-8 xl:col-span-2">
            {/* 输入区域 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  播客内容分析
                </CardTitle>
                <CardDescription>
                  choSense 默认静默运行，仅在检测到高价值或高风险节点时出现，不打扰你的创作节奏
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
                        placeholder="请输入播客网址"
                        value={podcastUrl}
                        onChange={(e) => setPodcastUrl(e.target.value)}
                        disabled={isAnalyzing}
                        className="flex-1"
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

                {/* 核心理念提示 */}
                <Alert className="mt-6">
                  <AlertDescription className="text-sm">
                    <strong>💡 静默运行模式：</strong>
                    choSense 仅推送历史分位数前1%的极高价值内容和前10%的高价值内容，
                    确保每一条提示都值得您的关注。其余时间保持静默，让您专注创作。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 高价值建议列表 */}
            {highValueSuggestions.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  🎯 高价值节点识别
                </h2>
                {highValueSuggestions.map(suggestion => (
                  <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            )}

            {/* 空状态 */}
            {!isAnalyzing && highValueSuggestions.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex min-h-96 flex-col items-center justify-center py-16 text-center">
                  <Radio className="mb-4 h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    开始分析您的播客内容
                  </h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    输入播客URL或粘贴文字稿，choSense将以全科视角进行静默分析，
                    仅在检测到极高价值或高风险节点时主动提示
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：全科画像（可折叠） */}
          {showDisciplineProfile && (
            <div className="xl:col-span-1">
              <DisciplineProfile 
                records={getAllDisciplineRecords()}
                customDisciplines={userProfile.customDisciplines}
              />
            </div>
          )}
        </div>
      </main>

      {/* 极高价值内容弹窗（前1%） */}
      <Dialog open={showHighValueDialog} onOpenChange={setShowHighValueDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              检测到极高价值内容！（前1%）
            </DialogTitle>
            <DialogDescription>
              以下内容在历史数据中排名前1%，建议重点关注并优先采纳
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {highValueSuggestions
              .filter(s => s.priority === 'critical')
              .map(suggestion => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 个人画像对话框 */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>个人画像管理</DialogTitle>
            <DialogDescription>
              填写您的个人信息，系统将根据这些信息提供更精准的价值评估
            </DialogDescription>
          </DialogHeader>
          <ProfileManagementPanel profile={personalProfile} onProfileChange={savePersonalProfile} />
        </DialogContent>
      </Dialog>

      {/* 设置对话框 */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>系统设置</DialogTitle>
            <DialogDescription>
              自定义分析行为和显示偏好
            </DialogDescription>
          </DialogHeader>
          <SettingsPanel 
            settings={settings} 
            onSettingsChange={saveSettings}
            onClearHistory={clearHistory}
            onClearProfile={clearProfile}
          />
        </DialogContent>
      </Dialog>

      {/* 历史分析报告对话框 */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>历史分析报告</DialogTitle>
            <DialogDescription>
              查看所有历史分析记录和建议
            </DialogDescription>
          </DialogHeader>
          <HistoryPanel 
            history={history} 
            onViewDetail={(item) => {
              toast({
                title: '查看详情',
                description: `播客：${item.podcastTitle}`,
              });
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* 案例数据库对话框 */}
      <Dialog open={showCasesDialog} onOpenChange={setShowCasesDialog}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>案例数据库</DialogTitle>
            <DialogDescription>
              导入和管理历史案例数据，用于更精准的价值评估
            </DialogDescription>
          </DialogHeader>
          <CaseDatabasePanel cases={cases} onCasesChange={saveCases} />
        </DialogContent>
      </Dialog>

      {/* 页脚 */}
      <footer className="mt-16 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 choSense · 静默运行内容价值雷达 · 让创作更纯粹、变现更高效、表达更安全</p>
        </div>
      </footer>
    </div>
  );
}
