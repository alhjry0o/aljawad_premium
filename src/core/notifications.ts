import { PushNotifications, Channel } from '@capacitor/push-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Capacitor } from '@capacitor/core';

export async function setupPushNotifications(
  deviceId: string,
  onNotificationReceived: (notif: { title: string; body: string; screen?: string }) => void
) {
  if (!Capacitor.isNativePlatform()) return;

  let permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  if (permStatus.receive !== 'granted') return;

  const channel: Channel = {
    id: 'aljawad_high_importance',
    name: 'إشعارات الجواد',
    description: 'إشعارات التحديثات والطلبات',
    importance: 5,
    visibility: 1,
    vibration: true,
    lights: true,
  };

  await PushNotifications.createChannel(channel);
  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    try {
      await setDoc(doc(db, 'users', deviceId), {
        fcmToken: token.value,
        platform: Capacitor.getPlatform(),
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.error('FCM Token error', e);
    }
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    if (notification.title && notification.body) {
      onNotificationReceived({ 
        title: notification.title, 
        body: notification.body,
        screen: notification.data?.screen
      });
    }
  });

  // ✅ الحل السحري: حفظ نية الانتقال في الذاكرة قبل أن يستيقظ التطبيق
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    if (action.notification.title && action.notification.body) {
      const screen = action.notification.data?.screen;
      if (screen) {
        localStorage.setItem('aljawad.pending_route', screen);
      }
      onNotificationReceived({ 
        title: action.notification.title, 
        body: action.notification.body,
        screen: screen
      });
      PushNotifications.removeAllDeliveredNotifications();
    }
  });
}

export async function clearSystemNotifications() {
  if (Capacitor.isNativePlatform()) {
    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (e) {
      console.error('Error clearing notifications:', e);
    }
  }
}
