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

  // ✅ استقبال الإشعار أثناء فتح التطبيق
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    if (notification.title && notification.body) {
      onNotificationReceived({ 
        title: notification.title, 
        body: notification.body,
        screen: notification.data?.screen // ✅ قراءة العلامة
      });
    }
  });

  // ✅ عند فتح التطبيق من خلال الضغط على الإشعار
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    // 🚨 رسالة تشخيصية 1: ماذا استلم التطبيق؟
    alert('بيانات الإشعار المستلمة: ' + JSON.stringify(action.notification.data));
    
    if (action.notification.title && action.notification.body) {
      onNotificationReceived({ 
        title: action.notification.title, 
        body: action.notification.body,
        screen: action.notification.data?.screen
      });
      PushNotifications.removeAllDeliveredNotifications();
    }
  });
} 

// ✅ مسح جميع الإشعارات من شريط إشعارات الهاتف
export async function clearSystemNotifications() {
  if (Capacitor.isNativePlatform()) {
    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (e) {
      console.error('Error clearing notifications:', e);
    }
  }
}
