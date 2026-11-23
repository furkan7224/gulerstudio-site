/*
  ───────────────────────────────────────────────────────────────
  GÜLER STUDIO · SİTE AYARLARI
  Sitedeki tüm oyunlar, linkler ve beta formları bu dosyadan gelir.
  Boş bırakılan ("") mağaza linkleri sitede görünmez.
  ───────────────────────────────────────────────────────────────

  Link örnekleri:
    App Store      https://apps.apple.com/tr/app/id1234567890
    Google Play    https://play.google.com/store/apps/details?id=com.gulergamestudios.buyukyemin
    TestFlight     https://testflight.apple.com/join/XXXXXXXX

  androidBeta: true  → oyunun altında "Android kapalı beta" kayıt formu çıkar.
  Gelen kayıtları indirmek için: https://gulerstudio.dev/yonetim/beta.csv
  (Coolify'da BETA_SIFRE ortam değişkenini ayarlaman gerekir, bkz. README)
*/

window.SITE = {
  studyo: "Güler Studio",
  slogan: "Telefon için hikâyesi olan oyunlar yapan bağımsız bir stüdyo. Kararlarının önemli olduğu, uzun soluklu oyunlar.",
  eposta: "furkan.glr1@outlook.com",
  instagram: "",          // ör. "gulerstudio" (boşsa görünmez)

  oyunlar: [
    {
      id: "buyuk-yemin",
      ad: "Büyük Yemin",
      altBaslik: "Senin Hikâyen",
      etiket: "Askerî kariyer ve strateji",
      tema: "yemin",
      ozet: "Er olarak başla, harekâtları yönet, rütbe rütbe yüksel ve bir gün bütün bir ülkeyi yönet.",
      ozellikler: [
        ["⏱️", "Gerçek zamanlı harekâtlar: saniyeler içinde emir ver, timinin kaderini belirle"],
        ["🎖️", "Er'den Mareşal'e 19 rütbe ve gerçek terfi törenleri"],
        ["🗺️", "Strateji ve diplomasi: cepheyi çiz, ittifak kur"],
        ["🏛️", "Devlet yönetimi: seçime gir, münazarayı kazan, ülkeni yönet"],
        ["📖", "Hikâye modu: kararlarınla sonu değişen 4 özgün hikâye"]
      ],
      ikon: "img/buyuk-yemin-ikon.webp",
      ekranlar: [
        { src: "img/buyuk-yemin-1.webp", alt: "Terfi töreni: Teğmen rütbesi" },
        { src: "img/buyuk-yemin-2.webp", alt: "Gerçek zamanlı harekâtta emir seçimi" },
        { src: "img/buyuk-yemin-3.webp", alt: "Hikâye modu: Efsane Birlik" }
      ],
      linkler: {
        appStore: "https://apps.apple.com/tr/app/id6830630846",
        googlePlay: "",
        testflight: ""
      },
      androidBeta: true,
      gizlilik: "/gizlilik.html",
      destek: ""
    },
    {
      id: "gece-avcilari",
      ad: "Gece Avcıları",
      altBaslik: "Doğaüstü av ve gizem",
      etiket: "Gizem ve avcılık",
      tema: "gece",
      ozet: "Siyah klasik araban, sahte rozetlerin ve bagajındaki silahlarla dünyanın dört bir yanından gelen vakaları çöz.",
      ozellikler: [
        ["🗺️", "Dünyanın dört bir yanından mühürlü vakalar"],
        ["🔎", "İpuçlarını kanıt panosunda topla, yaratığı teşhis et"],
        ["🗡️", "Her hamlenin önemli olduğu taktik avlar"],
        ["📻", "Ortağınla telsizden konuş, birlikte karar ver"],
        ["📓", "32 yaratık, tek bir avcı günlüğü"]
      ],
      ikon: "img/gece-avcilari-ikon.webp",
      ekranlar: [
        { src: "img/gece-avcilari-1.webp", alt: "Dünya haritasında mühürlü vaka zarfları" },
        { src: "img/gece-avcilari-2.webp", alt: "Vaka dosyası ve kanıt panosu" },
        { src: "img/gece-avcilari-3.webp", alt: "Bir vampirle taktik av sahnesi" }
      ],
      linkler: {
        appStore: "",
        googlePlay: "",
        testflight: ""
      },
      androidBeta: true,
      gizlilik: "/gece-avcilari/gizlilik.html",
      destek: "/gece-avcilari/"
    }
  ]
};
