MHA VERSION 34 — SUPABASE BUILD

یہ آپ کے پرانے MHA VERSION 33.1 پروجیکٹ کی اپڈیٹ ہے۔ موجودہ MHA ڈیزائن، آئیکنز، انوائس لے آؤٹ اور کاروباری ماڈیولز برقرار رکھے گئے ہیں۔ اب لاگ اِن اور ایپ کا نیا ڈیٹا Supabase کے ذریعے چلتا ہے۔ پرانا Firebase ڈیٹا نہ حذف کیا گیا ہے، نہ تبدیل، نہ منتقل۔

اہم فائلیں
- index.html — ایپ کا صفحہ اور ہلکا سبز/سفید ڈیزائن
- app.js — MHA کے موجودہ ماڈیولز اور کاروباری منطق
- supabase-adapter.js — پرانے MHA ڈیٹا آپریشنز کو Supabase سے جوڑنے والا پل
- SUPABASE_SETUP.sql — Supabase میں درکار ٹیبل، RLS اور اکاؤنٹ درخواست کا سیٹ اپ
- manifest.webmanifest / sw.js / icons — PWA اور آئیکنز

پہلی بار چلانے کا طریقہ
1) ZIP extract کریں۔ تمام فائلیں اپنے اسی GitHub MHA repository کے root میں رکھیں اور نئی فائلیں upload/commit کریں۔
2) Supabase Dashboard کھولیں → SQL Editor → New query۔ SUPABASE_SETUP.sql کی پوری عبارت paste کرکے Run کریں۔ یہ صرف mha_documents ٹیبل اور اس کی policies بناتا ہے؛ آپ کی پرانی Firebase معلومات کو ہاتھ نہیں لگاتا۔
3) Supabase Authentication → Users میں اپنا موجودہ اکاؤنٹ mehmathassan4@gmail.com موجود اور confirmed ہونا چاہیے۔ اس ایپ میں یہی مرکزی Owner Admin ہے۔
4) GitHub commit کے بعد Vercel deployment مکمل ہونے دیں، پھر اپنی MHA ویب سائٹ کھول کر اسی email سے Sign In کریں۔
5) دوسری email سے نیا اکاؤنٹ بنانے پر Booker یا Admin Request منتخب کیا جا سکتا ہے۔ Admin کی درخواست مرکزی Owner Admin کے User Approval صفحے پر آئے گی؛ منظوری کے بعد ہی Admin بنے گا۔

اس ورژن کی نئی تبدیلیاں
- ہلکا سبز اور سفید رنگ، موبائل responsive fields۔
- Products کو A، B، C ... پھر AA، AB ... serial دیا جاتا ہے۔
- آرڈر لیتے وقت ہر پروڈکٹ کا موجودہ دستیاب stock دکھتا ہے؛ stock ختم ہو یا quantity زیادہ ہو تو آرڈر روکا جاتا ہے۔
- Stock & Purchases میں supplier، received quantity، purchase rate، batch اور expiry محفوظ ہوتے ہیں؛ موجودہ receipt کا purchase rate Edit Rate سے بدلا جا سکتا ہے۔
- Supplier Statement میں موجودہ ماہ کی تاریخیں پہلے سے منتخب ہیں، supplier-wise purchase total، پچھلا balance، خریداری، ادائیگی اور باقی رقم دکھتی ہے۔
- Supplier report کو Letter سائز PNG کے طور پر محفوظ اور Letter paper پر Print کیا جا سکتا ہے۔
- Admin درخواست صرف مرکزی Owner Admin منظور/بند کر سکتا ہے۔

ڈیٹا اسٹوریج کی وضاحت
یہ build موجودہ MHA screens کو کم سے کم دوبارہ لکھنے کے لیے Supabase کے public.mha_documents میں collection-style JSON records محفوظ کرتا ہے۔ آپ کے Supabase میں پہلے سے موجود relational tables کو اس build میں خودکار طور پر drop، reset یا populate نہیں کیا جاتا۔ پرانا Firebase project الگ اور غیر متاثر رہے گا۔

اہم ٹیسٹ
- پہلے Sign In، Products، Stores، Store Prices، Stock & Purchases کھول کر ایک test product، supplier receipt اور store price بنا کر دیکھیں۔
- پھر order میں stock available اور insufficient stock دونوں چیک کریں۔
- Supplier report میں تاریخ/سپلائر بدل کر PNG اور Print ٹیسٹ کریں۔
- کسی دوسری email سے Admin Request بھیجیں، پھر مرکزی Owner email سے User Approval میں منظور کریں۔

حدود / احتیاط
- یہاں سے آپ کے GitHub یا Vercel پر براہ راست deploy نہیں کیا گیا؛ ZIP میں فائلیں تیار ہیں، آپ کو اپنے connected GitHub repo میں commit کرنا ہوگا۔
- live Supabase/Vercel credentials کے ساتھ end-to-end runtime test نہیں کیا جا سکا۔ پہلے test records سے جانچیں۔
- Supabase publishable key browser میں استعمال ہوتی ہے؛ کبھی بھی service_role یا secret key فرنٹ اینڈ میں نہ ڈالیں۔
- پہلی مرتبہ app load اور login کے لیے انٹرنیٹ ضروری ہے۔
