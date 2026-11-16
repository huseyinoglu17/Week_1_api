# Week_1_api — TaskFlow REST API

Node.js ve Express.js ile geliştirilmiş; kullanıcı, görev ve raporlama işlemlerini HTTP endpoint'leri üzerinden sunan eğitim amaçlı bir REST API projesidir. Uygulama, görevlerin oluşturulması, listelenmesi, güncellenmesi, silinmesi, kullanıcılara atanması ve durumlarının takip edilmesi işlemlerini destekler.

**GitHub:** https://github.com/huseyinoglu17/Week_1_api

## Özellikler

- **Kullanıcı yönetimi:** Kullanıcı listeleme, detay, ekleme, güncelleme ve silme.
- **Görev yönetimi:** Görev listeleme, detay, ekleme, güncelleme ve silme.
- **Görev atama:** Belirtilen görevi kullanıcıya atama.
- **Durum yönetimi:** Görevi `in-progress` veya `completed` durumuna taşıma.
- **Arama ve filtreleme:** Görevleri `status`, `priority`, `userId` ve `keyword` ile sorgulama.
- **Sayfalama:** Görev listesinde `page` ve `limit` parametreleri.
- **Raporlama:** Görev durumlarına göre sayılar ve genel özet.
- **Middleware:** HTTP isteği loglama, 404 ve genel hata cevapları.

> **Veri saklama notu:** Veriler `data/data.js` içinde başlangıç dizileri olarak tanımlanır ve uygulama çalışırken bellekte değiştirilir. Veritabanı veya kalıcı dosya kaydı bulunmadığı için sunucu yeniden başladığında yapılan değişiklikler kaybolur.

## Teknolojiler

| Teknoloji | Kullanımı |
| --- | --- |
| Node.js | JavaScript çalışma ortamı |
| Express.js 5 | API ve yönlendirme altyapısı |
| JavaScript / CommonJS | Uygulama ve modüller |
| Nodemon | Geliştirme sırasında otomatik yeniden başlatma |
| Node.js `crypto.randomUUID()` | Yeni kayıtlar için benzersiz ID oluşturma |

## Kurulum ve çalıştırma

**Gereksinim:** Node.js ve npm.

```bash
git clone https://github.com/huseyinoglu17/Week_1_api.git
cd Week_1_api
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır. Normal başlatma için:

```bash
npm start
```

Port değiştirmek için `PORT` ortam değişkeni kullanılabilir (örneğin macOS/Linux'ta `PORT=4000 npm start`, PowerShell'de `$env:PORT=4000; npm start`).

**Not:** Projede henüz otomatik test paketi tanımlı değildir (`npm test` bir test çalıştırmaz).

## Klasör yapısı

```text
Week_1_api/
├── app.js                 # Express ayarları, route ve middleware bağlantıları
├── server.js              # HTTP sunucusu ve PORT ayarı
├── routes/
│   ├── users.js           # Kullanıcı endpoint'leri
│   ├── tasks.js           # Görev endpoint'leri
│   └── reports.js         # Rapor endpoint'leri
├── operations/
│   ├── users.js           # Kullanıcı iş mantığı
│   ├── tasks.js           # Görev iş mantığı ve filtreler
│   └── reports.js         # Durum bazlı raporlar
├── middleware/
│   ├── logger.js          # HTTP istek kaydı
│   └── errorHandler.js    # Hata yönetimi
├── data/
│   ├── store.js           # Başlangıç verilerini dışa aktarır
│   └── data.js            # Bellek içi örnek kullanıcı ve görevler
└── package.json
```

## API endpoint'leri

### Kullanıcılar (`/users`)

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/users` | Tüm kullanıcıları listeler |
| GET | `/users/:id` | ID ile kullanıcı getirir |
| POST | `/users` | Yeni kullanıcı oluşturur |
| PUT | `/users/:id` | Kullanıcı günceller |
| DELETE | `/users/:id` | Kullanıcı siler (204) |

Yeni kullanıcı örneği:

```http
POST /users
Content-Type: application/json

{"name":"Ali","surname":"Yılmaz"}
```

### Görevler (`/tasks`)

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/tasks` | Görevleri listeler, filtreler ve arar |
| GET | `/tasks/:id` | Görev detayı getirir |
| GET | `/tasks/assignee/:userName` | Kullanıcı adına göre görevleri getirir |
| POST | `/tasks` | Görev oluşturur (201) |
| PUT | `/tasks/:id` | Görev günceller |
| DELETE | `/tasks/:id` | Görev siler (204) |
| POST | `/tasks/:taskId/assign/:userId` | Görevi kullanıcıya atar |
| POST | `/tasks/:taskId/complete` | Görevi tamamlar |
| POST | `/tasks/:taskId/progress` | Görevi devam ediyor durumuna getirir |

Yeni görev örneği:

```http
POST /tasks
Content-Type: application/json

{"title":"README hazırla","description":"API belgelerini tamamla","priority":"high"}
```

`title` ve `description` alanları gereklidir. `priority` gönderildiğinde `low`, `medium` veya `high` değerlerinden biri olmalıdır. Yeni görevlerin ilk durumu `pending` olur. Kaynak kodda `priority` alanı oluşturma sırasında zorunlu olarak denetlenmediğinden bu örnekte açıkça verilmiştir.

**Filtreleme örnekleri:**

```http
GET /tasks?status=pending
GET /tasks?priority=high
GET /tasks?userId=user-001
GET /tasks?keyword=API
GET /tasks?status=completed&priority=high&page=1&limit=5
```

`page` veya `limit` verildiğinde yanıt `{ "data": [...] }` biçimindedir; aksi halde doğrudan görev dizisi döner. Sayfalama için `limit` 1–100 arasında olmalıdır.

**Örnek görev atama:**

```http
POST /tasks/TASK_ID/assign/USER_ID
```

Buradaki `TASK_ID` ve `USER_ID` değerlerini sistemde mevcut kayıtların ID'leriyle değiştirin. Başlangıç verilerindeki görevlerin çoğu zaten bir kullanıcıya atanmıştır; atama işlemini denemek için yeni, atanmamış görev oluşturabilirsiniz.

### Raporlar (`/reports`)

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/reports/completed` | Tamamlanan görev sayısı |
| GET | `/reports/pending` | Bekleyen görev sayısı |
| GET | `/reports/in-progress` | Devam eden görev sayısı |
| GET | `/reports/summary` | Tüm durumların toplam özeti |

Özet yanıt şeması:

```json
{
  "total": 30,
  "byStatus": {
    "pending": 0,
    "in-progress": 0,
    "completed": 0
  }
}
```

Yukarıdaki sayılar **örnek şemadır**; `byStatus` alanındaki gerçek sayılar başlangıç verilerine ve yapılan işlemlere bağlıdır.

## Örnek cURL istekleri

```bash
curl http://localhost:3000/users
curl "http://localhost:3000/tasks?status=pending&limit=5&page=1"
curl http://localhost:3000/reports/summary
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Sunum","description":"Proje PDF dosyasını hazırla","priority":"medium"}'
```

## HTTP cevapları ve hata yönetimi

- `200`: Başarılı okuma/güncelleme ve ilgili işlem yanıtları.
- `201`: Yeni kayıt oluşturuldu.
- `204`: Silme başarılı, yanıtta içerik yok.
- `400`: Bazı doğrulama hataları veya geçersiz parametreler.
- `404`: Kayıt ya da endpoint bulunamadı.
- `500`: Beklenmeyen sunucu hatası (genel hata middleware'i).

İstekler `middleware/logger.js` üzerinden yöntem, URL, durum kodu ve süre bilgisiyle konsola loglanır.

## Mimari akış

`HTTP Request → app.js → routes → operations → data/store.js → JSON Response`

Uygulama routing, iş mantığı ve örnek veri katmanlarını ayrı dosyalarda tutarak modüler bir yapı sunar.

## Sınırlamalar ve olası geliştirmeler

- Kalıcı veritabanı (ör. PostgreSQL veya MongoDB) eklenebilir.
- Girdi doğrulaması ve kullanıcı-görev ilişki kontrolleri güçlendirilebilir.
- Otomatik testler, API dokümantasyonu (OpenAPI/Swagger) ve kimlik doğrulama eklenebilir.
- `node_modules/` klasörü Git üzerinden izlenmemeli; `.gitignore` içinde tutulmalıdır.

## Proje bağlantısı

[GitHub — huseyinoglu17/Week_1_api](https://github.com/huseyinoglu17/Week_1_api)
