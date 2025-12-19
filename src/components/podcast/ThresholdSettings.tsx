import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { ThresholdSettings, DEFAULT_THRESHOLDS } from '@/types/podcast';

const STORAGE_KEY = 'chosense_threshold_settings';

interface ThresholdSettingsProps {
  onSettingsChange?: (settings: ThresholdSettings) => void;
}

export default function ThresholdSettingsDialog({ onSettingsChange }: ThresholdSettingsProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);

  // 从本地存储加载设置
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        onSettingsChange?.(parsed);
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }
  }, [onSettingsChange]);

  // 保存设置
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    onSettingsChange?.(settings);
    setOpen(false);
  };

  // 重置为默认值
  const handleReset = () => {
    setSettings(DEFAULT_THRESHOLDS);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          阈值设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>价值阈值设置</DialogTitle>
          <DialogDescription>
            设置触发高价值弹窗提示的阈值，当分析结果超过任一阈值时将自动弹窗提醒
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 金钱阈值 */}
          <div className="space-y-2">
            <Label htmlFor="money">
              💰 金钱价值阈值（元）
            </Label>
            <Input
              id="money"
              type="number"
              min="0"
              step="100"
              value={settings.money}
              onChange={(e) => setSettings({ ...settings, money: Number(e.target.value) })}
              placeholder="如：5000"
            />
            <p className="text-xs text-muted-foreground">
              广告位、商业合作等预估收益超过此金额时弹窗提示
            </p>
          </div>

          {/* 粉丝阈值 */}
          <div className="space-y-2">
            <Label htmlFor="fans">
              👥 粉丝影响阈值（人）
            </Label>
            <Input
              id="fans"
              type="number"
              min="0"
              step="100"
              value={settings.fans}
              onChange={(e) => setSettings({ ...settings, fans: Number(e.target.value) })}
              placeholder="如：1000"
            />
            <p className="text-xs text-muted-foreground">
              预估影响粉丝数或潜在掉粉风险超过此数量时弹窗提示
            </p>
          </div>

          {/* 互动率阈值 */}
          <div className="space-y-2">
            <Label htmlFor="engagement">
              📊 互动率阈值（%）
            </Label>
            <Input
              id="engagement"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={settings.engagementRate}
              onChange={(e) => setSettings({ ...settings, engagementRate: Number(e.target.value) })}
              placeholder="如：5"
            />
            <p className="text-xs text-muted-foreground">
              预估互动率（点赞、评论、转发）提升超过此百分比时弹窗提示
            </p>
          </div>

          {/* 品牌价值阈值 */}
          <div className="space-y-2">
            <Label htmlFor="brand">
              ⭐ 品牌价值指数阈值（0-100）
            </Label>
            <Input
              id="brand"
              type="number"
              min="0"
              max="100"
              step="5"
              value={settings.brandValue}
              onChange={(e) => setSettings({ ...settings, brandValue: Number(e.target.value) })}
              placeholder="如：70"
            />
            <p className="text-xs text-muted-foreground">
              品牌形象提升指数超过此分数时弹窗提示
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={handleReset}>
            恢复默认
          </Button>
          <Button onClick={handleSave}>
            保存设置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 导出获取当前设置的工具函数
export function getCurrentThresholds(): ThresholdSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }
  return DEFAULT_THRESHOLDS;
}
