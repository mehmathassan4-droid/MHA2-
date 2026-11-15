MHA VERSION 37 — UI / MOBILE LAYOUT UPDATE

اس ورژن میں مرکزی Dashboard کو ایک ہی vertical-scroll صفحہ بنایا گیا ہے: 7 دن کا تاریخ وار Sales Graph، Product Sales Graph (نام اور مقدار کے ساتھ)، Expense Graph، چھ ماہ کا Sales Trend، KPI خلاصہ، اور تمام ماڈیولز کے چھوٹے ٹائل۔ Dashboard پر اوپر horizontal navigation چھپائی گئی ہے تاکہ موبائل پر غیر ضروری الگ scroll bar نہ آئے۔

Products صفحہ میں افقی اسکرول والی چوڑی جدول کی جگہ موبائل-فٹ کارڈز ہیں۔ نمبر 1،2،3... نظر آتے ہیں؛ پروڈکٹ نام کے پہلے حرف کے مطابق ترتیب ہے۔ ہر کارڈ میں MRP، Cost، Sale، Pack، Batch اور Expiry، ساتھ چھوٹے Edit/Delete بٹن ہیں۔ Product فارم میں Expiry Date بھی شامل ہے۔

Green theme اور MHA app icon refresh کیا گیا ہے۔ Service worker cache version v37 کیا گیا ہے۔

اہم: یہ UI/فرنٹ اینڈ اپ ڈیٹ ہے۔ Supabase credentials، profiles، موجودہ ریکارڈز یا SQL schema کو reset نہیں کیا گیا۔ Deployment کے بعد موبائل پر hard refresh / app cache clear کریں۔ Live Supabase login، RLS، حقیقی ڈیٹا اور ہر کاروباری workflow کی مکمل جانچ ابھی باقی ہے۔
