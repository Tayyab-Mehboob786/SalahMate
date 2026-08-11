import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import notificationService from '@/services/notifications/notification.service';

interface NotificationContextProps {
  notificationsEnabled: boolean;
  permissionStatus: Notifications.PermissionStatus;
  requestPermission: () => Promise<void>;
  sendTestNotification: (seconds?: number) => Promise<void>;
  isInitializing: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus>(
    'undetermined' as any
  );
  const [isInitializing, setIsInitializing] = useState(true);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      // 1. Initialize Android channel and foreground behavior
      await notificationService.initializeNotifications();

      // 2. Check current status without requesting
      const currentStatus = await notificationService.getNotificationPermissionStatus();
      
      if (isMounted) {
        setPermissionStatus(currentStatus);
        setNotificationsEnabled(currentStatus === ('granted' as any));
      }

      // 3. First-launch permission check (if undetermined, ask immediately)
      // On web, this might immediately resolve or fail gracefully
      if (Platform.OS !== 'web' && currentStatus === ('undetermined' as any)) {
        const requestedStatus = await notificationService.requestNotificationPermission();
        if (isMounted) {
          setPermissionStatus(requestedStatus);
          setNotificationsEnabled(requestedStatus === ('granted' as any));
        }
      }

      // 4. Setup listeners for incoming notifications while app is running
      // But skip this in Expo Go to prevent crashing
      const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
      if (!isExpoGo) {
        const ExpoNotifications = require('expo-notifications');
        notificationListener.current = ExpoNotifications.addNotificationReceivedListener((notification: any) => {
          console.log('[Notifications] Notification received in foreground:', notification);
        });

        responseListener.current = ExpoNotifications.addNotificationResponseReceivedListener((response: any) => {
          console.log('[Notifications] Notification response received (user tapped):', response);
        });
      }

      if (isMounted) setIsInitializing(false);
    };

    setupNotifications();

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const requestPermission = async () => {
    const status = await notificationService.requestNotificationPermission();
    setPermissionStatus(status);
    setNotificationsEnabled(status === ('granted' as any));
  };

  const sendTestNotification = async (seconds = 2) => {
    if (notificationsEnabled) {
      await notificationService.sendTestNotification(seconds);
    } else {
      console.warn('[Notifications] Cannot send test notification: permissions not granted');
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        permissionStatus,
        requestPermission,
        sendTestNotification,
        isInitializing,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
