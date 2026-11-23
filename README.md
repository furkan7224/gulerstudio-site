# gulerstudio.dev

Güler Studio'nun oyun sitesi: Büyük Yemin ve Gece Avcıları için mağaza linkleri, Android kapalı beta kayıt formları, gizlilik ve destek sayfaları.

Derleme adımı yok. Bağımlılığı olmayan küçük bir Node.js sunucusu (`server.js`) hem sayfaları sunar hem beta kayıtlarını alır.

```
site/
  index.html              ana sayfa
  js/oyunlar.js           ← OYUNLAR, LİNKLER, BETA AYARLARI BURADA
  js/site.js              sayfayı oyunlar.js'ten oluşturur
  css/stil.css            tasarım
  img/                    ikonlar, ekran görüntüleri, paylaşım görseli
  fonts/                  yerel yazı tipleri (SIL OFL)
  app-ads.txt             AdMob / Unity / Liftoff yetkili satıcı listesi
  gizlilik.html           Büyük Yemin gizlilik politikası
  gece-avcilari/          Gece Avcıları destek + gizlilik sayfaları
server.js                 sunucu + beta API
Dockerfile
```

## Link eklemek / güncellemek

Sadece `site/js/oyunlar.js` dosyasını düzenle. Her oyunun `linkler` kısmı:

| Alan | Ne için | Örnek |
|---|---|---|
| `appStore` | App Store sayfası | `https://apps.apple.com/tr/app/id6830630846` |
| `googlePlay` | Google Play sayfası | `https://play.google.com/store/apps/details?id=com.gulergamestudios.buyukyemin` |
| `testflight` | iPhone beta | `https://testflight.apple.com/join/XXXXXXXX` |

Boş bırakılan linkin düğmesi görünmez. `androidBeta: true` olan oyunun altında kayıt formu çıkar;
oyun Google Play'de yayınlanınca `false` yapıp `googlePlay` linkini doldurman yeterli.

## Beta kayıtlarını almak

Formdan gelen adresler sunucuda `/data/beta-kayitlari.json` dosyasına yazılır.

- Listeyi indir: **https://gulerstudio.dev/yonetim/beta.csv** (kullanıcı adı önemsiz, şifre `BETA_SIFRE`)
- Tek oyun: `https://gulerstudio.dev/yonetim/beta.csv?oyun=buyuk-yemin`
- CSV'deki e-postaları Play Console → Test → Kapalı test → **Test kullanıcıları** listesine yapıştır
  (ya da bir Google Grubu kullanıyorsan gruba ekle).

## Coolify'a kurulum

1. Coolify → projen → **+ New** → **Public Repository** (gizli repo ise **Private Repository (with GitHub App)**).
2. Repo adresi, branch `main`. **Build Pack: Dockerfile**. **Port: 3000**.
3. **Domains:** `https://gulerstudio.dev,https://www.gulerstudio.dev`
4. **Environment Variables:**
   - `BETA_SIFRE` → uzun, rastgele bir şifre (beta listesini indirmek için)
   - `BETA_WEBHOOK` → (isteğe bağlı) Discord kanal webhook URL'si; her yeni kayıtta bildirim gelir
5. **Persistent Storage** → **+ Add** → Volume. Destination path: **`/data`**
   (Bunu yapmazsan her yeniden yayınlamada beta listesi silinir.)
6. **Health Check** yolu: `/saglik` (isteğe bağlı, Dockerfile'da da tanımlı).
7. **Deploy**.

## DNS ayarı

| Tür | Ad | Değer |
|---|---|---|
| A | `@` | Coolify sunucunun IPv4 adresi |
| CNAME | `www` | `gulerstudio.dev` |

- `.dev` uzantısında HTTPS zorunludur; Coolify Let's Encrypt sertifikasını alana kadar site açılmaz.
- Cloudflare kullanıyorsan ilk kurulumda kayıtları **DNS only** (gri bulut) yap. Sonra turuncu buluta geçersen SSL/TLS: **Full (strict)**.
- Kontrol: `dig +short gulerstudio.dev`

## Yayından sonra

- App Store Connect ve Google Play Console'da **Pazarlama / Web sitesi** alanını `https://gulerstudio.dev` yap.
  AdMob `app-ads.txt` dosyasını bu adreste arar: `https://gulerstudio.dev/app-ads.txt`
- Gizlilik politikası adreslerini güncelle:
  - Büyük Yemin: `https://gulerstudio.dev/gizlilik.html`
  - Gece Avcıları: `https://gulerstudio.dev/gece-avcilari/gizlilik.html`
- Eski `furkan7224.github.io` sitesini, mağazalar yeni adresi gösterene kadar kapatma.
  (Oyunlar oradaki `ads.json` dosyasını okuyorsa onu da yerinde bırak.)

## Bilgisayarında denemek

```bash
docker build -t gulerstudio .
docker run --rm -p 3000:3000 -e BETA_SIFRE=deneme -v gulerstudio-data:/data gulerstudio
# http://localhost:3000
```

Docker olmadan: `VERI_DIZINI=./veri BETA_SIFRE=deneme node server.js`
