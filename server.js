// Güler Studio sitesi: statik dosyalar + beta kayıt formu.
// Bağımlılık yok, sadece Node.js (>=18).
//
// Ortam değişkenleri:
//   PORT            dinlenecek port (varsayılan 3000)
//   VERI_DIZINI     kayıtların tutulduğu klasör (varsayılan /data; Coolify'da kalıcı depolama olarak bağla)
//   BETA_SIFRE      /yonetim/beta.csv için şifre (boşsa yönetim sayfası kapalı)
//   BETA_WEBHOOK    (isteğe bağlı) yeni kayıtta bildirim için Discord webhook URL'si
//   SHEETS_WEBHOOK  (isteğe bağlı) Google Sheets'e yazan Apps Script web uygulaması URL'si.
//                   Her yeni kayıt anında gönderilir; sunucu açılırken mevcut kayıtlar da
//                   bir kez gönderilir (tablo aynı adresi iki kez eklemez).

"use strict";

const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const KOK = path.join(__dirname, "site");
const VERI_DIZINI = process.env.VERI_DIZINI || "/data";
const KAYIT_DOSYASI = path.join(VERI_DIZINI, "beta-kayitlari.json");
const BETA_SIFRE = process.env.BETA_SIFRE || "";
const BETA_WEBHOOK = process.env.BETA_WEBHOOK || "";
// Coolify'a yapıştırırken gelebilecek tırnak ve boşlukları temizle
const SHEETS_WEBHOOK = String(process.env.SHEETS_WEBHOOK || "").trim().replace(/^["']+|["']+$/g, "").trim();
const SHEETS_ACIK = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(SHEETS_WEBHOOK);

const TURLER = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

// Ana site sıkı CSP ile; eski gizlilik/destek sayfaları satır içi stil, script ve Google Fonts kullanıyor.
const CSP_SIKI = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
const CSP_ESKI = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
const ESKI_SAYFALAR = new Set(["/gizlilik.html", "/gece-avcilari/", "/gece-avcilari/index.html", "/gece-avcilari/gizlilik.html"]);

function ortakBasliklar(res, yol) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", ESKI_SAYFALAR.has(yol) ? CSP_ESKI : CSP_SIKI);
}

function json(res, kod, veri) {
  const govde = JSON.stringify(veri);
  res.writeHead(kod, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(govde);
}

// ── Geçerli oyun kimlikleri site/js/oyunlar.js içinden okunur
function oyunKimlikleri() {
  try {
    const metin = fs.readFileSync(path.join(KOK, "js", "oyunlar.js"), "utf8");
    return new Set([...metin.matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]));
  } catch {
    return new Set();
  }
}
const OYUNLAR = oyunKimlikleri();

// ── Kayıt deposu (tek süreç; yazmalar sıraya alınır)
let kayitlar = [];
let yazmaZinciri = Promise.resolve();

async function kayitlariYukle() {
  try {
    await fsp.mkdir(VERI_DIZINI, { recursive: true });
    kayitlar = JSON.parse(await fsp.readFile(KAYIT_DOSYASI, "utf8"));
    if (!Array.isArray(kayitlar)) kayitlar = [];
  } catch (e) {
    if (e.code !== "ENOENT") console.error("Kayıt dosyası okunamadı:", e.message);
    kayitlar = [];
  }
  console.log(`${kayitlar.length} beta kaydı yüklendi (${KAYIT_DOSYASI})`);
}

function kayitlariYaz() {
  yazmaZinciri = yazmaZinciri.then(async () => {
    const gecici = KAYIT_DOSYASI + ".tmp";
    await fsp.writeFile(gecici, JSON.stringify(kayitlar, null, 2));
    await fsp.rename(gecici, KAYIT_DOSYASI);
  });
  return yazmaZinciri;
}

// ── Google Sheets'e gönderim. Başarısız olursa kayıt yine dosyada durur;
// bir sonraki yeniden başlatmada bütün liste tekrar gönderilir.
async function sheeteGonder(liste) {
  if (!SHEETS_ACIK || !liste.length) return;
  try {
    const yanit = await fetch(SHEETS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kayitlar: liste }),
      redirect: "follow",
      signal: AbortSignal.timeout(20000)
    });
    const metin = await yanit.text();
    if (!yanit.ok || !metin.includes('"tamam":true')) {
      console.error("Sheets gönderimi başarısız: HTTP", yanit.status, metin.slice(0, 200));
    } else {
      console.log(`Sheets: ${liste.length} kayıt gönderildi -> ${metin}`);
    }
  } catch (e) {
    console.error("Sheets gönderimi başarısız:", e.message);
  }
}

// ── Basit hız sınırı: IP başına 10 dakikada 12 istek
const istekler = new Map();
function hizSiniri(ip) {
  const simdi = Date.now();
  const pencere = 10 * 60 * 1000;
  const liste = (istekler.get(ip) || []).filter((t) => simdi - t < pencere);
  liste.push(simdi);
  istekler.set(ip, liste);
  return liste.length > 12;
}
setInterval(() => {
  const simdi = Date.now();
  for (const [ip, l] of istekler) if (!l.some((t) => simdi - t < 600000)) istekler.delete(ip);
}, 600000).unref();

function istemciIp(req) {
  const xff = req.headers["x-forwarded-for"];
  // Coolify'ın proxy'si (Traefik/Caddy) gerçek IP'yi listenin sonuna ekler; baştaki değerler taklit edilebilir.
  if (xff) { const l = String(xff).split(","); return l[l.length - 1].trim(); }
  return (req.socket.remoteAddress || "").trim();
}

function govdeOku(req, sinir = 4096) {
  return new Promise((coz, reddet) => {
    let boyut = 0;
    const parcalar = [];
    req.on("data", (p) => {
      boyut += p.length;
      if (boyut > sinir) { reddet(new Error("buyuk")); req.destroy(); return; }
      parcalar.push(p);
    });
    req.on("end", () => coz(Buffer.concat(parcalar).toString("utf8")));
    req.on("error", reddet);
  });
}

const EPOSTA_RE = /^[^\s@<>"',;]{1,64}@[a-z0-9.-]{1,190}\.[a-z]{2,24}$/i;

async function betaKaydi(req, res) {
  if (hizSiniri(istemciIp(req))) return json(res, 429, { hata: "Çok fazla deneme yaptın. Birkaç dakika sonra tekrar dene." });

  let veri;
  try {
    veri = JSON.parse(await govdeOku(req));
  } catch {
    return json(res, 400, { hata: "İstek okunamadı." });
  }

  // Bot tuzağı doluysa sessizce başarılı dön
  if (veri.site) return json(res, 200, { tamam: true });

  const eposta = String(veri.eposta || "").trim().toLowerCase();
  const oyun = String(veri.oyun || "");
  const platform = veri.platform === "ios" ? "ios" : "android";

  if (!EPOSTA_RE.test(eposta)) return json(res, 400, { hata: "Geçerli bir e-posta adresi yaz." });
  if (!OYUNLAR.has(oyun)) return json(res, 400, { hata: "Bilinmeyen oyun." });

  if (kayitlar.some((k) => k.eposta === eposta && k.oyun === oyun)) {
    return json(res, 409, { hata: "Bu adres zaten listede." });
  }

  const kayit = { eposta, oyun, platform, tarih: new Date().toISOString() };
  kayitlar.push(kayit);
  try {
    await kayitlariYaz();
  } catch (e) {
    kayitlar.pop();
    console.error("Kayıt yazılamadı:", e.message);
    return json(res, 500, { hata: "Kayıt şu an alınamıyor. Biraz sonra tekrar dene." });
  }

  sheeteGonder([kayit]);

  if (BETA_WEBHOOK.startsWith("https://")) {
    const toplam = kayitlar.filter((k) => k.oyun === oyun).length;
    fetch(BETA_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `Yeni beta kaydı: **${oyun}** (${platform}). Bu oyunda toplam ${toplam} kayıt.` })
    }).catch(() => {});
  }

  return json(res, 201, { tamam: true });
}

function sifreDogru(req) {
  if (!BETA_SIFRE) return false;
  const h = req.headers.authorization || "";
  if (!h.startsWith("Basic ")) return false;
  const cozulmus = Buffer.from(h.slice(6), "base64").toString("utf8");
  const sifre = cozulmus.slice(cozulmus.indexOf(":") + 1);
  const a = crypto.createHash("sha256").update(sifre).digest();
  const b = crypto.createHash("sha256").update(BETA_SIFRE).digest();
  return crypto.timingSafeEqual(a, b);
}

function csvHucre(v) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // Excel formül enjeksiyonuna karşı
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function yonetimCsv(req, res, oyunFiltresi) {
  if (!BETA_SIFRE) { res.writeHead(404); return res.end(); }
  if (!sifreDogru(req)) {
    res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Guler Studio beta", charset="UTF-8"', "Cache-Control": "no-store" });
    return res.end("Şifre gerekli");
  }
  const satirlar = kayitlar
    .filter((k) => !oyunFiltresi || k.oyun === oyunFiltresi)
    .map((k) => [k.eposta, k.oyun, k.platform, k.tarih].map(csvHucre).join(","));
  const csv = "﻿" + ["eposta,oyun,platform,tarih", ...satirlar].join("\r\n") + "\r\n";
  res.writeHead(200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="beta-${oyunFiltresi || "tum"}.csv"`,
    "Cache-Control": "no-store"
  });
  res.end(csv);
}

async function statik(req, res, yol) {
  let dosya;
  try {
    dosya = path.normalize(path.join(KOK, decodeURIComponent(yol)));
  } catch {
    res.writeHead(400); return res.end();
  }
  if (dosya !== KOK && !dosya.startsWith(KOK + path.sep)) { res.writeHead(403); return res.end(); }

  try {
    let st = await fsp.stat(dosya);
    if (st.isDirectory()) {
      if (!yol.endsWith("/")) { res.writeHead(301, { Location: yol + "/" }); return res.end(); }
      dosya = path.join(dosya, "index.html");
      st = await fsp.stat(dosya);
    }
    const uzanti = path.extname(dosya).toLowerCase();
    const uzunOnbellek = [".woff2", ".webp", ".png", ".jpg", ".svg", ".ico"].includes(uzanti);
    const etag = `W/"${st.size.toString(16)}-${st.mtimeMs.toString(16)}"`;
    ortakBasliklar(res, yol);
    res.setHeader("Cache-Control", uzunOnbellek ? "public, max-age=2592000" : "no-cache");
    res.setHeader("ETag", etag);
    if (req.headers["if-none-match"] === etag) { res.writeHead(304); return res.end(); }
    res.writeHead(200, { "Content-Type": TURLER[uzanti] || "application/octet-stream", "Content-Length": st.size });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(dosya).pipe(res);
  } catch {
    ortakBasliklar(res, yol);
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    fs.createReadStream(path.join(KOK, "404.html")).on("error", () => res.end("404")).pipe(res);
  }
}

const sunucu = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, "http://yerel"); } catch { res.writeHead(400); return res.end(); }
  const yol = url.pathname;

  try {
    if (yol === "/saglik") {
      res.writeHead(200, { "Content-Type": "text/plain", "Cache-Control": "no-store" });
      return res.end(`ok\nsheets: ${SHEETS_ACIK ? "acik" : SHEETS_WEBHOOK ? "adres-gecersiz" : "kapali"}\n`);
    }
    if (yol === "/api/beta") {
      if (req.method !== "POST") { res.writeHead(405, { Allow: "POST" }); return res.end(); }
      return await betaKaydi(req, res);
    }
    if (yol === "/yonetim/beta.csv" && req.method === "GET") {
      const oyun = url.searchParams.get("oyun");
      return yonetimCsv(req, res, oyun && OYUNLAR.has(oyun) ? oyun : "");
    }
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
    return await statik(req, res, yol);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});

kayitlariYukle().then(() => {
  sunucu.listen(PORT, () => console.log(`Güler Studio sitesi ${PORT} portunda çalışıyor (Google Sheets: ${SHEETS_ACIK ? "açık" : "kapalı"})`));
  sheeteGonder(kayitlar);
});

for (const s of ["SIGTERM", "SIGINT"]) {
  process.on(s, () => { sunucu.close(() => yazmaZinciri.finally(() => process.exit(0))); setTimeout(() => process.exit(0), 5000).unref(); });
}
