import { Settings as SettingsIcon, Globe, Bell, Moon, Sun, Smartphone, Wifi, Shield } from 'lucide-react';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage, LANGUAGES, Language } from '@/contexts/LanguageContext';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    weather: true,
    market: true,
    schemes: true,
    cropHealth: true,
  });
  const [offlineMode, setOfflineMode] = useState(true);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            {t('settings')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your app preferences
          </p>
        </div>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language Preferences
            </CardTitle>
            <CardDescription>
              Choose your preferred language for the app interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('selectLanguage')}</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.nativeName}</span>
                        <span className="text-muted-foreground">({lang.name})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Voice features and advisories will also be in this language
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weather Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about weather warnings and forecasts
                </p>
              </div>
              <Switch
                checked={notifications.weather}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weather: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Market Price Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Daily updates on mandi prices for your crops
                </p>
              </div>
              <Switch
                checked={notifications.market}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, market: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Government Schemes</Label>
                <p className="text-sm text-muted-foreground">
                  New schemes and application deadlines
                </p>
              </div>
              <Switch
                checked={notifications.schemes}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, schemes: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Crop Health Advisories</Label>
                <p className="text-sm text-muted-foreground">
                  Pest and disease alerts for your region
                </p>
              </div>
              <Switch
                checked={notifications.cropHealth}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, cropHealth: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Offline Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Offline Mode
            </CardTitle>
            <CardDescription>
              Use the app without internet connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Offline Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Cache data for offline access in low connectivity areas
                </p>
              </div>
              <Switch
                checked={offlineMode}
                onCheckedChange={setOfflineMode}
              />
            </div>
            {offlineMode && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Cached Data</span>
                  <span className="text-sm text-muted-foreground">12 MB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Weather, prices, and advisories cached for 7 days
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('appName')}</p>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>
              <Smartphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
