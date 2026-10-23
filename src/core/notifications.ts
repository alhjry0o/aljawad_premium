import { PushNotifications, Channel } from '@capacitor/push-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Capacitor } from '@capacitor/core';

export async function registerPushNotifications(deviceId: string) {
  if (!Capacitor.isNativePlatform()) return;

  let permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  if (permStatus.receive !== 'granted') return;

  // ✅ إنشاء قناة إشعارات مخصصة بأهمية عالية (لظهور النافذة المنبثقة والاهتزاز)
  const channel: Channel = {
    id: 'aljawad_high_importance',
    name: 'إشعارات الجواد',
    description: 'إشعارات التحديثات والطلبات',
    importance: 5, // 5 = IMPORTANCE_HIGH (نافذة منبثقة وصوت)
    visibility: 1, // 1 = VISIBILITY_PUBLIC (يظهر على شاشة القفل)
    vibration: true,
    lights: true,
  };

  try {
    await PushNotifications.createChannel(channel);
  } catch (e) {
    console.error('Error creating notification channel', e);
  }

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
}
