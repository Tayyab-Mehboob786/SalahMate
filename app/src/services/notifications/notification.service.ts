import type * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export class NotificationService {
  private static instance: NotificationService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initializes the notification service.
   * Sets up Android channels and defines foreground handler behavior.
   */
  public async initializeNotifications(): Promise<void> {
    if (this.initialized) return;

    // SDK 53+: Expo Go does not support Android Push Notifications.
    // We gracefully exit here so the app doesn't fatally crash.
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (isExpoGo) {
      console.warn('[Notifications] Running in Expo Go. Notifications are disabled to prevent crashes.');
      this.initialized = true;
      return;
    }

    // Define how notifications behave when the app is in the foreground
    const ExpoNotifications = require('expo-notifications');
    ExpoNotifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === 'android') {
      try {
        const ExpoNotifications = require('expo-notifications');
        await ExpoNotifications.setNotificationChannelAsync('salahmate-default', {
          name: 'SalahMate Notifications',
          description: 'Default notifications for SalahMate',
          importance: ExpoNotifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#15803d',
        });
      } catch (error) {
        console.error('[Notifications] Failed to create Android notification channel:', error);
      }
    }

    this.initialized = true;
  }

  /**
   * Checks the current notification permission status without requesting it.
   */
  public async getNotificationPermissionStatus(): Promise<Notifications.PermissionStatus> {
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (isExpoGo) return 'undetermined' as any;

    const ExpoNotifications = require('expo-notifications');
    const { status } = await ExpoNotifications.getPermissionsAsync();
    return status;
  }

  /**
   * Requests notification permissions from the user.
   */
  public async requestNotificationPermission(): Promise<Notifications.PermissionStatus> {
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (isExpoGo) return 'undetermined' as any;

    try {
      const ExpoNotifications = require('expo-notifications');
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      return status;
    } catch (error) {
      console.error('[Notifications] Failed to request notification permission:', error);
      return 'undetermined' as any;
    }
  }

  /**
   * Sends a development/test local notification.
   * @param seconds - Number of seconds to delay the notification (default 2s)
   */
  public async sendTestNotification(seconds = 2): Promise<void> {
    try {
      const ExpoNotifications = require('expo-notifications');
      await ExpoNotifications.scheduleNotificationAsync({
        content: {
          title: 'SalahMate',
          body: 'Notifications are working correctly.',
          sound: true,
        },
        trigger: {
          type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
        },
      });
      console.log(`[Notifications] Scheduled test notification for ${seconds}s from now.`);
    } catch (error) {
      console.error('[Notifications] Failed to send test notification:', error);
    }
  }

  /**
   * Cancels a specific scheduled notification by ID.
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      const ExpoNotifications = require('expo-notifications');
      await ExpoNotifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error(`[Notifications] Failed to cancel notification ${notificationId}:`, error);
    }
  }

  /**
   * Cancels all scheduled notifications.
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      const ExpoNotifications = require('expo-notifications');
      await ExpoNotifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[Notifications] Failed to cancel all notifications:', error);
    }
  }

  /**
   * Gets a list of all currently scheduled notifications.
   */
  public async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const ExpoNotifications = require('expo-notifications');
      return await ExpoNotifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[Notifications] Failed to get scheduled notifications:', error);
      return [];
    }
  }
}

export default NotificationService.getInstance();
