/*
  ───────────────────────────────────────────────────────────────
  GÜLER STUDIO · SİTE AYARLARI
  Sitedeki tüm oyunlar ve linkler bu dosyadan gelir.
  Yeni link eklemek için sadece tırnakların arasını doldur.
  Boş bırakılan ("") linkler sitede "Yakında" olarak görünür.
  ───────────────────────────────────────────────────────────────

  Link örnekleri:
    App Store      https://apps.apple.com/tr/app/uygulama-adi/id1234567890
    Google Play    https://play.google.com/store/apps/details?id=com.gulergamestudios.buyukyemin
    TestFlight     https://testflight.apple.com/join/XXXXXXXX
                   (App Store Connect → TestFlight → Harici Test → Genel Bağlantı)
    Play beta      https://play.google.com/apps/testing/com.gulergamestudios.buyukyemin
                   (Play Console → Test → Açık/Kapalı test → "Test kullanıcılarının nasıl katılacağı")
                   Not: Kapalı testte sadece listedeki e-postalar katılabilir. Herkesin
                   katılabilmesi için "Açık test" veya bir Google Grubu kullan.
*/

window.SITE = {
  studyo: "Güler Studio",
  eposta: "iletisim@gulerstudio.dev",

  oyunlar: [
    {
      id: "gece-avcilari",
      ad: "Gece Avcıları",
      ingilizceAd: "Night Hunters",
      tema: "gece",
      ozet: "Mühürlü zarfı aç, vakayı seç, yaratığın izini sür.",
      aciklama:
        "Dünyanın dört bir yanından gelen vakaları çözdüğün bir av oyunu. " +
        "İpuçlarını kanıt panosunda birleştirip yaratığı teşhis ediyorsun, " +
        "ortağınla telsizden konuşuyorsun ve taktik bir avla vakayı kapatıyorsun. " +
        "32 yaratık, tek bir avcı günlüğü.",
      durum: "Beta testinde",
      ikon: "img/gece-avcilari-ikon.webp",
      ekranlar: [
        { src: "img/gece-avcilari-1.webp", alt: "Dünya haritasında mühürlü vaka zarfları" },
        { src: "img/gece-avcilari-2.webp", alt: "Vaka dosyası ve kanıt panosu" },
        { src: "img/gece-avcilari-3.webp", alt: "Bir vampirle taktik av sahnesi" }
      ],
      linkler: {
        appStore: "",
        googlePlay: "",
        testflight: "",
        playBeta: ""
      }
    },
    {
      id: "buyuk-yemin",
      ad: "Büyük Yemin",
      ingilizceAd: "Grand Oath",
      tema: "yemin",
      ozet: "Erden mareşale, bir askerin bütün hayatı.",
      aciklama:
        "Bir askerin kariyerini baştan sona yaşadığın bir hikâye oyunu. " +
        "Şehir şehir tayin oluyorsun, rütbe atlıyorsun, yaşlanıyorsun ve verdiğin " +
        "kararların bedelini ödüyorsun. Esir, Köstebek, Kriz Masası ve Efsane Birlik " +
        "gibi bölüm bölüm ilerleyen hikâyeler de var.",
      durum: "Android'de kapalı test, iOS'ta incelemede",
      ikon: "img/buyuk-yemin-ikon.webp",
      ekranlar: [
        { src: "img/buyuk-yemin-1.webp", alt: "Karargâh ekranı ve rütbe yolu" },
        { src: "img/buyuk-yemin-2.webp", alt: "Efsane Birlik hikâyesinin giriş ekranı" },
        { src: "img/buyuk-yemin-3.webp", alt: "Köstebek hikâyesinde soruşturma ekranı" }
      ],
      linkler: {
        appStore: "",
        googlePlay: "",
        testflight: "",
        playBeta: ""
      }
    }
  ]
};
