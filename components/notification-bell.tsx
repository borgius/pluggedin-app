'use client';

import { formatDistanceToNow } from 'date-fns';
import { enUS, hi,ja, nl, tr, zhCN } from 'date-fns/locale';
import { Bell, Circle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@/components/providers/notification-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t, i18n } = useTranslation('notifications');
  
  // Get date locale based on current language
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'tr': return tr;
      case 'nl': return nl;
      case 'zh': return zhCN;
      case 'ja': return ja;
      case 'hi': return hi;
      default: return enUS;
    }
  };
  
  // Removed unused getVariantByType function
  
  // Function to get icon color based on notification type
  const getColorByType = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SUCCESS':
        return 'text-green-500';
      case 'WARNING':
        return 'text-amber-500';
      case 'ALERT':
        return 'text-red-500';
      case 'INFO':
        return 'text-blue-500';
      case 'CUSTOM':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };
  
  // Function to get icon based on notification type
  const getIconByType = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CUSTOM':
        return <Circle className="h-4 w-4 mr-2 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">{t('notifications.title')}</div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => markAllAsRead()}
            >
              {t('notifications.actions.markAllAsRead')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('notifications.empty.title')}
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`p-3 focus:bg-accent border-b last:border-b-0 cursor-pointer ${
                  !notification.read ? 'bg-accent/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getIconByType(notification.type)}
                      <span className={`font-medium ${getColorByType(notification.type)}`}>
                        {notification.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true,
                        locale: getDateLocale() 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  
                  {notification.link && (
                    <Link 
                      href={notification.link} 
                      className="text-xs text-primary hover:underline mt-1"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {t('notifications.actions.viewDetails')}
                    </Link>
                  )}
                  
                  {!notification.read && (
                    <div className="flex justify-end mt-1">
                      <Badge variant="secondary" className="text-xs">{t('notifications.status.unread')}</Badge>
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Link href="/notifications" className="block w-full">
            <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
              {t('notifications.actions.viewAll')}
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
