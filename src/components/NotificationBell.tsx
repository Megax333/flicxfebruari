import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { cn } from '../utils/cn';
import CoinIcon from './CoinIcon';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // When the notification panel is opened, mark all as read
  const handleOpenPanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      handleMarkAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpenPanel}
        className="relative p-2 hover:bg-white/5 rounded-lg transition-colors group"
      >
        <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1E1E2A] rounded-xl overflow-hidden shadow-xl z-50">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-gray-400 hover:text-white"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-white/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-white/5 transition-colors relative group",
                      !notification.read && "bg-purple-600/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {notification.type === 'ad_reward' || notification.type === 'welcome_bonus' ? (
                        <div className="relative mt-1">
                          <CoinIcon size={20} />
                          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm"></div>
                        </div>
                      ) : (
                        <Bell size={20} className="mt-1 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-400">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        >
                          <Check size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;