MHA VERSION 36 — SUPABASE PACKAGE
=================================

یہ ورژن MHA Version 35 کو بنیاد بنا کر تیار کیا گیا ہے۔ پرانا Firebase پروجیکٹ یا موجودہ Supabase ڈیٹا حذف کرنے والا کوئی SQL اس پیکج میں شامل نہیں۔

نئی تبدیلیاں:
1) Admin Navigation اور Dashboard Quick Access میں Daily Dispatch شامل ہے۔
2) روزانہ کی تاریخ کے مطابق کھلی انوائسز منتخب کی جا سکتی ہیں۔
3) منتخب انوائسز کے پروڈکٹس، مانگی گئی مقدار اور دستیاب مقدار سامنے آتی ہے۔
4) سپلائی بھیجتے وقت اصل بھیجی جانے والی مقدار تبدیل کی جا سکتی ہے۔
5) دستیاب اسٹاک سے زیادہ مقدار نہیں بھیجی جا سکتی۔ باقی مقدار کو No Stock Available یا Partially Unavailable کی وجہ کے ساتھ ریکارڈ کیا جاتا ہے۔
6) کامیاب ڈسپیچ کے بعد انوائس کا اسٹیٹس Invoice Complete ہو جاتا ہے۔
7) اسٹور کے حساب سے مشترکہ روزانہ چالان بنتا ہے؛ اس میں انوائس نمبر، اسٹور، پروڈکٹ/مقدار، رقم اور مجموعی رقم آتی ہے۔
8) چالان کو HD PNG یا Print میں نکالنے کے بٹن شامل ہیں۔
9) Dashboard میں چھ ماہ کی سیلز بار گراف، Top Selling Products اور Quick Access Tiles شامل ہیں۔
10) نئی انوائس نمبرنگ 001، 002، 003 ... کے فارمیٹ میں ہے۔ اگلا نمبر settings/invoiceSequence میں محفوظ کیا جاتا ہے تاکہ عام حذف کے بعد بھی نمبر دوبارہ استعمال نہ ہو۔
11) آرڈر بناتے وقت مطلوبہ مقدار اسٹاک سے زیادہ بھی درج کی جا سکتی ہے؛ اصل اسٹاک کی حد Daily Dispatch میں لگتی ہے۔

اہم احتیاط / موجودہ حدود:
- یہ سورس کوڈ کی تبدیلی ہے؛ Supabase/Vercel پر Live Login، RLS، حقیقی ڈیٹا اور PNG پرنٹ کی مکمل عملی جانچ اس پیکج میں نہیں کی گئی۔ پہلے ٹیسٹ اکاؤنٹ اور چند فرضی آرڈرز کے ساتھ جانچیں۔
- Daily Dispatch صرف Admin Mode میں دستیاب ہے۔ Booker Mode میں نظر نہیں آئے گا۔
- اگر ایک ہی دن کے کئی آرڈرز ہیں تو اسٹاک کی منصفانہ تقسیم کے لیے اسی دن کی متعلقہ تمام انوائسز منتخب کریں۔ غیر منتخب آرڈرز اسٹاک ریزرویشن میں شمار ہوتے رہیں گے۔
- یہ ورژن موجودہ compatibility adapter استعمال کرتا ہے۔ یہ خود بخود Supabase کی الگ relational tables (مثلاً products/orders) پر migrate نہیں کرتا۔
- فی اسٹور الگ Warranty/Terms اور Excel template کو ایپ میں import کرکے invoice layout بدلنے کی سہولت ابھی شامل نہیں۔ Excel template الگ فائل ہے۔
- انوائس نمبر counter کے لیے settings/invoiceSequence ڈاکیومنٹ استعمال ہوتا ہے۔ Supabase RLS میں اس ڈاکیومنٹ پر Admin/Booker کے مناسب read/write اختیارات ضروری ہیں۔

اپ لوڈ کرنے کا طریقہ:
1) ZIP کو Extract کریں۔
2) اندر موجود فولڈر کے تمام project files کو GitHub repository کے root میں اپ لوڈ/Replace کریں؛ صرف ZIP فائل repository میں ڈالنا کافی نہیں۔
3) Vercel میں اسی GitHub repository سے نیا deployment کریں۔
4) موبائل پر پرانی PWA cache ہو تو ایپ بند کرکے دوبارہ کھولیں، یا browser سے hard refresh کریں۔
5) پہلے Daily Dispatch میں ایک test invoice منتخب کرکے 2-3 عدد کی partial supply test کریں۔

MHA — WASI MEDICOS
