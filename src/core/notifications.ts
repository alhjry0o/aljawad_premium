import { PushNotifications } from '@capacitor/push-notifications';
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
