import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: 'primary' | 'success' | 'warning' | 'info' | 'accent';
  className?: string;
}

const colorVariants = {
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  success: 'bg-success/10 text-success hover:bg-success/20',
  warning: 'bg-warning/10 text-warning hover:bg-warning/20',
  info: 'bg-info/10 text-info hover:bg-info/20',
  accent: 'bg-accent/10 text-accent hover:bg-accent/20',
};

const iconColorVariants = {
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  accent: 'bg-accent text-accent-foreground',
};

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  color,
  className,
}: QuickActionCardProps) {
  return (
    <Link to={href}>
      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-border',
          colorVariants[color],
          className
        )}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
              iconColorVariants[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
