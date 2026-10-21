import { PushNotifications } from '@capacitor/push-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Capacitor } from '@capacitor/core';

export async function registerPushNotifications(deviceId: string) {
  if (!Capacitor.isNativePlatform()) return;

  // 1. طلب إذن الإشعارات
  let permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  if (permStatus.receive !== 'granted') {
    alert('لم يتم منح إذن الإشعارات. يرجى تفعيله من إعدادات الهاتف.');
    return;
  }

  // 2. تسجيل الجهاز في Firebase
  await PushNotifications.register();

  // 3. الاستماع لحدث التسجيل واستخراج الرمز
  PushNotifications.addListener('registration', async (token) => {

    // حفظ الرمز في قاعدة البيانات (Firestore)
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

  // في حال حدوث خطأ
  PushNotifications.addListener('registrationError', (error) => {
    alert('حدث خطأ أثناء تسجيل الإشعارات: ' + JSON.stringify(error));
  });
}
