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
  if (permStatus.receive !== 'granted') {
    alert('صلاحيات الإشعارات مرفوضة!');
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', async (token) => {
    // ✅ رسالة 1: إظهار التوكن
    alert('تم جلب التوكن بنجاح: ' + token.value);
    
    try {
      await setDoc(doc(db, 'users', deviceId), {
        fcmToken: token.value,
        platform: Capacitor.getPlatform(),
        updatedAt: Date.now(),
      }, { merge: true });
      
      // ✅ رسالة 2: تأكيد الحفظ في قاعدة البيانات
      alert('تم حفظ التوكن في قاعدة البيانات بنجاح!');
    } catch (e: any) {
      // ✅ رسالة 3: إذا فشل الحفظ (غالباً بسبب قواعد Firestore)
      alert('خطأ في الحفظ: ' + e.message);
    }
  });

  PushNotifications.addListener('registrationError', (error) => {
    alert('خطأ في تسجيل الإشعارات: ' + JSON.stringify(error));
  });
}
