# gulerstudio.dev

Güler Studio'nun oyun sitesi: Gece Avcıları ve Büyük Yemin için mağaza linkleri ve beta katılım linkleri.

Saf HTML/CSS/JS. Derleme adımı yok. nginx'li küçük bir Docker imajıyla sunulur.

```
site/
  index.html        sayfa
  js/oyunlar.js     ← OYUNLAR VE LİNKLER BURADA
  js/site.js        sayfayı oyunlar.js'ten oluşturur
  css/stil.css      tasarım
  img/              ikonlar, ekran görüntüleri, paylaşım görseli
  fonts/            yerel yazı tipleri (SIL OFL)
nginx/              nginx ayarları
Dockerfile
```

## Link eklemek / güncellemek

Sadece `site/js/oyunlar.js` dosyasını düzenle. Her oyunun `linkler` kısmında dört alan var:

| Alan | Ne için | Örnek |
|---|---|---|
| `appStore` | App Store sayfası | `https://apps.apple.com/tr/app/.../id123` |
| `googlePlay` | Google Play sayfası | `https://play.google.com/store/apps/details?id=com.gulergamestudios.buyukyemin` |
| `testflight` | iPhone beta | `https://testflight.apple.com/join/XXXXXXXX` |
| `playBeta` | Android beta | `https://play.google.com/apps/testing/com.gulergamestudios.buyukyemin` |

Boş bırakılan link sitede "Yakında" olarak görünür. Linkler `https://` ile başlamalı.
GitHub'a gönderdiğinde Coolify otomatik yeniden yayınlar.

Yeni oyun eklemek için `oyunlar` listesine bir blok daha kopyala. `tema` alanı şimdilik
`"gece"` ya da `"yemin"` olabilir; yeni bir dünya için `stil.css`'e `.oyun[data-tema="..."]` bloğu ekle.

## Bilgisayarında denemek

```bash
docker build -t gulerstudio .
docker run --rm -p 8080:80 gulerstudio
# http://localhost:8080
```

## Coolify'a kurulum

1. Coolify → **Projects** → projeni seç → **+ New** → **Public Repository**
   (repo gizliyse **Private Repository (with GitHub App)**).
2. Repo adresini yapıştır, branch: `main`.
3. **Build Pack: Dockerfile** seç. Port: **80**.
4. **Domains** alanına yaz: `https://gulerstudio.dev,https://www.gulerstudio.dev`
5. İstersen **Health Check** bölümünde yol olarak `/saglik` gir.
6. **Deploy**.

Coolify Let's Encrypt sertifikasını kendisi alır. Bunun için DNS'in önceden sunucuyu göstermesi gerekir.

## DNS ayarı

Domain sağlayıcının DNS panelinde:

| Tür | Ad | Değer |
|---|---|---|
| A | `@` | Coolify sunucunun IPv4 adresi |
| CNAME | `www` | `gulerstudio.dev` |
| AAAA | `@` | (sunucunun IPv6'sı varsa) |

- `.dev` uzantısı tarayıcılarda **zorunlu HTTPS** listesindedir. Sertifika alınana kadar site açılmaz; bu normal.
- **Cloudflare** kullanıyorsan: ilk kurulumda kayıtları **DNS only** (gri bulut) yap ve Coolify sertifikayı alsın.
  Sonra turuncu buluta geçeceksen SSL/TLS modunu **Full (strict)** yap.
- DNS değişikliğinin yayılması birkaç dakikayla birkaç saat arasında sürebilir. Kontrol: `dig +short gulerstudio.dev`
