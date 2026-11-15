MHA VERSION 38 — ROLE, PRICE, THEME AND MOBILE REPORT UPDATE

شامل تبدیلیاں:
1) Booker Dashboard پر صرف اپنے آرڈرز کی ماہانہ Submitted Sales گراف؛ کمپنی کے سیلز، پروڈکٹ، اخراجات اور منافع کے گراف Booker کو نہیں دکھائے جاتے۔
2) Booker کے لیے محدود ماڈیول: اپنے Stores، Store Prices کی درخواست، Orders، My Invoices اور محدود My Backup۔
3) Booker کی نئی Store Price براہ راست فعال نہیں ہوتی؛ priceRequests میں pending درخواست جاتی ہے۔ Owner Admin منظوری دے تو storePrices میں فعال ہوتی ہے۔
4) Booker کے Backup میں صرف اپنے stores، orders اور invoicePayments شامل ہیں؛ Restore صرف Admin UI میں دستیاب ہے۔
5) System theme: فون/سسٹم کی Light/Dark ترجیح خود استعمال ہوتی ہے؛ Settings میں الگ Dark/Light سوئچ نہیں۔ Dark palette میں کارڈ، ٹیبل، فیلڈ اور متن کے contrast کو بہتر کیا گیا۔
6) قیمت/رقم کی display دو decimal places تک؛ calculated store prices بھی دو decimals پر round ہوتے ہیں۔
7) Order cart میں ہر شامل product کے ساتھ Remove بٹن۔
8) Product list میں Edit/Delete بٹن نام اور MRP کے ساتھ، نیچے الگ row نہیں۔
9) Supplier statement موبائل اسکرین میں fit؛ Letter print/PNG کے لیے export وقت پر مقررہ Letter dimensions۔
10) Service worker cache v38۔

اہم سیکیورٹی نوٹ:
یہ ZIP فرنٹ اینڈ کے رول/فلٹرز اور price approval workflow کو اپ ڈیٹ کرتی ہے۔ اس ZIP کے SUPABASE_SETUP.sql کے آخر میں v38 کی write policies شامل ہیں۔ انہیں Supabase SQL Editor میں چلانا ضروری ہے؛ صرف GitHub پر فائل اپ لوڈ کرنے سے database policies خود تبدیل نہیں ہوتیں۔ اہم: موجودہ legacy adapter میں approved users کی read policy ابھی وسیع ہے کیونکہ آرڈر اسکرین global stock availability کے لیے تمام stock receipts/orders پڑھتی ہے۔ اس لیے Booker کے لیے menus اور screens محدود ہیں، لیکن مکمل backend data isolation ابھی مکمل نہیں۔ اسے محفوظ بنانے کے لیے اگلے مرحلے میں server-side safe stock-balance RPC/view اور scoped reads درکار ہیں۔

No database reset or deletion is performed by this version.
