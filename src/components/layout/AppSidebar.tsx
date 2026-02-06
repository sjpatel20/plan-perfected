import {
  LayoutDashboard,
  Cloud,
  Leaf,
  TrendingUp,
  FileText,
  User,
  Settings,
  LogOut,
  Sparkles,
  MapPinned,
} from 'lucide-react';
import smartKisanLogo from '@/assets/smart-kisan-logo.jpg';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const collapsed = state === 'collapsed';

  const mainNavItems = [
    { title: t('dashboard'), url: '/', icon: LayoutDashboard },
    { title: 'My Plots', url: '/plots', icon: MapPinned },
    { title: t('weather'), url: '/weather', icon: Cloud },
    { title: t('cropHealth'), url: '/crop-health', icon: Leaf },
    { title: t('market'), url: '/market', icon: TrendingUp },
    { title: 'AIkosh', url: '/expert-chat', icon: Sparkles },
    { title: t('schemes'), url: '/schemes', icon: FileText },
  ];

  const accountItems = [
    { title: t('profile'), url: '/profile', icon: User },
    { title: t('settings'), url: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarContent className="pt-4">
        {/* Logo - visible in expanded state */}
        {!collapsed && (
          <div className="px-4 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <img 
                src={smartKisanLogo} 
                alt="Smart किसान" 
                className="w-14 h-14 object-contain rounded-xl"
              />
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">{t('appName')}</h2>
                <p className="text-xs text-sidebar-foreground/70">{t('appTagline')}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed && 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed && 'Account'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={collapsed ? t('logout') : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t('logout')}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
