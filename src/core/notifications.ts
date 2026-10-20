import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Capacitor } from '@capacitor/core';

export async function registerPushNotifications(userId: string) {
  if (!Capacitor.isNativePlatform()) return;

  let permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  if (permStatus.receive !== 'granted') return;

  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    try {
      // الحصول على FCM Token (لأندرويد)
      const fcmToken = await FCM.getToken();
      // حفظ التوكن في Firestore تحت مستخدم معين (أو جهاز)
      await setDoc(doc(db, 'users', userId), {
        fcmToken: fcmToken.token,
        platform: Capacitor.getPlatform(),
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.error('FCM Token error', e);
    }
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification received:', notification);
    // يمكنك هنا تحديث الواجهة أو إظهار Toast
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Notification action:', action);
    // يمكنك هنا توجيه المستخدم لصفحة معينة
  });
}
