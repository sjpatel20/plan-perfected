import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationBell } from '@/components/market/NotificationBell';
import { useLanguage } from '@/contexts/LanguageContext';
import smartKisanLogo from '@/assets/smart-kisan-logo.jpg';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img 
                  src={smartKisanLogo} 
                  alt="Smart किसान" 
                  className="w-8 h-8 object-contain rounded-lg"
                />
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg text-foreground">{t('appName')}</h1>
                  <p className="text-xs text-muted-foreground">{t('appTagline')}</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
