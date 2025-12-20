import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Bell, Filter, BookOpen, Gauge, Trash2, AlertTriangle } from 'lucide-react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/podcast';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SettingsPanelProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onClearHistory?: () => void;
  onClearProfile?: () => void;
}

export default function SettingsPanel({ settings, onSettingsChange, onClearHistory, onClearProfile }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const { toast } = useToast();

  const handleSave = () => {
    onSettingsChange(localSettings);
    toast({
      title: '设置已保存',
      description: '您的偏好设置已成功更新',
    });
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    toast({
      title: '设置已重置',
      description: '所有设置已恢复为默认值',
    });
  };

  const handleClearHistory = () => {
    if (onClearHistory) {
      onClearHistory();
      toast({
        title: '历史记录已清空',
        description: '所有分析历史记录已被删除',
      });
    }
  };

  const handleClearProfile = () => {
    if (onClearProfile) {
      onClearProfile();
      toast({
        title: '画像数据已清空',
        description: '所有学科画像记录已被删除',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 弹窗阈值设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            弹窗提醒设置
          </CardTitle>
          <CardDescription>
            控制何时触发高价值内容弹窗提醒
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="alert-enabled">启用弹窗提醒</Label>
            <Switch
              id="alert-enabled"
              checked={localSettings.alertThreshold.enabled}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  alertThreshold: { ...localSettings.alertThreshold, enabled: checked }
                })
              }
            />
          </div>

          {localSettings.alertThreshold.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>触发阈值：前 {localSettings.alertThreshold.percentile}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {localSettings.alertThreshold.percentile === 1 && '极高价值'}
                    {localSettings.alertThreshold.percentile === 5 && '很高价值'}
                    {localSettings.alertThreshold.percentile === 10 && '高价值'}
                    {localSettings.alertThreshold.percentile === 20 && '较高价值'}
                  </span>
                </div>
                <Slider
                  value={[localSettings.alertThreshold.percentile]}
                  onValueChange={([value]) =>
                    setLocalSettings({
                      ...localSettings,
                      alertThreshold: { ...localSettings.alertThreshold, percentile: value }
                    })
                  }
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  仅当内容价值排名在历史前 {localSettings.alertThreshold.percentile}% 时弹窗提醒
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 建议类型开关 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            分析内容筛选
          </CardTitle>
          <CardDescription>
            选择您关注的分析维度
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="commercial-switch">💰 商业化价值分析</Label>
              <p className="text-xs text-muted-foreground">识别广告植入和商业合作机会</p>
            </div>
            <Switch
              id="commercial-switch"
              checked={localSettings.suggestionTypes.commercial}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  suggestionTypes: { ...localSettings.suggestionTypes, commercial: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="viral-switch">🚀 传播价值分析</Label>
              <p className="text-xs text-muted-foreground">识别可出圈的观点和话题</p>
            </div>
            <Switch
              id="viral-switch"
              checked={localSettings.suggestionTypes.viral}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  suggestionTypes: { ...localSettings.suggestionTypes, viral: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="risk-switch">⚠️ 风险预警分析</Label>
              <p className="text-xs text-muted-foreground">检测潜在的舆论和法律风险</p>
            </div>
            <Switch
              id="risk-switch"
              checked={localSettings.suggestionTypes.risk}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  suggestionTypes: { ...localSettings.suggestionTypes, risk: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 学科画像开关 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            学科画像设置
          </CardTitle>
          <CardDescription>
            选择您关注的学科视角
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="law-switch">⚖️ 法律画像</Label>
              <p className="text-xs text-muted-foreground">记录法律风险和合规问题</p>
            </div>
            <Switch
              id="law-switch"
              checked={localSettings.disciplines.law}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  disciplines: { ...localSettings.disciplines, law: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="psychology-switch">🧠 心理画像</Label>
              <p className="text-xs text-muted-foreground">记录播主心理状态和认知模式</p>
            </div>
            <Switch
              id="psychology-switch"
              checked={localSettings.disciplines.psychology}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  disciplines: { ...localSettings.disciplines, psychology: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="business-switch">💼 商业画像</Label>
              <p className="text-xs text-muted-foreground">记录商业认知和财务素养</p>
            </div>
            <Switch
              id="business-switch"
              checked={localSettings.disciplines.business}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  disciplines: { ...localSettings.disciplines, business: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="health-switch">❤️ 健康画像</Label>
              <p className="text-xs text-muted-foreground">记录健康状态和生活方式</p>
            </div>
            <Switch
              id="health-switch"
              checked={localSettings.disciplines.health}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  disciplines: { ...localSettings.disciplines, health: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="communication-switch">📡 传播学画像</Label>
              <p className="text-xs text-muted-foreground">记录账号风格和受众特征</p>
            </div>
            <Switch
              id="communication-switch"
              checked={localSettings.disciplines.communication}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  disciplines: { ...localSettings.disciplines, communication: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 分析详细程度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            分析详细程度
          </CardTitle>
          <CardDescription>
            控制AI分析的深度和详细程度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={localSettings.analysisDepth}
            onValueChange={(value: 'basic' | 'standard' | 'detailed') =>
              setLocalSettings({ ...localSettings, analysisDepth: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">基础分析 - 快速识别关键点</SelectItem>
              <SelectItem value="standard">标准分析 - 平衡速度和深度</SelectItem>
              <SelectItem value="detailed">详细分析 - 全面深入评估</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-muted-foreground">
            {localSettings.analysisDepth === 'basic' && '快速分析，仅识别最关键的高价值内容'}
            {localSettings.analysisDepth === 'standard' && '标准分析，提供全面的价值评估和建议'}
            {localSettings.analysisDepth === 'detailed' && '深度分析，包含详细的案例匹配和多维度评估'}
          </p>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            数据管理
          </CardTitle>
          <CardDescription>
            清空历史数据和画像记录（此操作不可恢复）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">清空历史分析报告</p>
              <p className="text-sm text-muted-foreground">删除所有历史分析记录和建议</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  清空历史
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认清空历史记录？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除所有历史分析报告，无法恢复。建议在清空前先导出备份。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    确认清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">清空学科画像</p>
              <p className="text-sm text-muted-foreground">删除所有学科画像记录</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  清空画像
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认清空画像数据？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除所有学科画像记录，无法恢复。建议在清空前先导出备份。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearProfile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    确认清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          <Settings className="mr-2 h-4 w-4" />
          保存设置
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          重置为默认
        </Button>
      </div>
    </div>
  );
}
