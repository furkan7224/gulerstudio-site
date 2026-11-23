(function () {
  "use strict";

  var S = window.SITE || { oyunlar: [] };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") n.textContent = attrs[k];
        else if (k === "class") n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function guvenliLink(url) {
    return typeof url === "string" && /^https:\/\//i.test(url.trim()) ? url.trim() : "";
  }

  // Mağaza / beta düğmesi. Link boşsa pasif "Yakında" etiketi döner.
  function dugme(url, etiket, alt, sinif) {
    var u = guvenliLink(url);
    var ic = [el("span", { class: "dugme-etiket", text: etiket })];
    if (u) {
      if (alt) ic.push(el("span", { class: "dugme-alt", text: alt }));
      return el("a", { class: "dugme " + (sinif || ""), href: u, target: "_blank", rel: "noopener" }, ic);
    }
    ic.push(el("span", { class: "dugme-alt", text: "Yakında" }));
    return el("span", { class: "dugme dugme--pasif " + (sinif || ""), "aria-disabled": "true" }, ic);
  }

  // ── Giriş bölümündeki küçük oyun listesi
  var liste = document.getElementById("giris-liste");
  S.oyunlar.forEach(function (o) {
    liste.appendChild(el("li", null, [
      el("a", { href: "#" + o.id }, [
        el("img", { src: o.ikon, alt: "", width: "44", height: "44" }),
        el("span", null, [
          el("strong", { text: o.ad }),
          el("small", { text: o.durum })
        ])
      ])
    ]));
  });

  // ── Oyun bölümleri
  var kap = document.getElementById("oyunlar");
  S.oyunlar.forEach(function (o, i) {
    var L = o.linkler || {};
    var baslikId = o.id + "-baslik";

    var ekranlar = el("div", { class: "ekranlar", role: "list", "aria-label": o.ad + " ekran görüntüleri" },
      (o.ekranlar || []).map(function (e) {
        return el("figure", { class: "telefon", role: "listitem" }, [
          el("img", { src: e.src, alt: e.alt, loading: i === 0 ? "eager" : "lazy", width: "440", height: "956" })
        ]);
      })
    );

    var magaza = el("div", { class: "magaza" }, [
      dugme(L.appStore, "App Store", "iPhone ve iPad"),
      dugme(L.googlePlay, "Google Play", "Android")
    ]);

    var betaVar = guvenliLink(L.testflight) || guvenliLink(L.playBeta);
    var betaLink = el("a", { class: "beta-git", href: "#beta" }, [
      document.createTextNode(betaVar ? "Beta testine katıl" : "Beta testi hakkında")
    ]);

    var metin = el("div", { class: "oyun-metin" }, [
      el("img", { class: "oyun-ikon", src: o.ikon, alt: o.ad + " uygulama simgesi", width: "96", height: "96" }),
      el("p", { class: "oyun-durum", text: o.durum }),
      el("h2", { id: baslikId, class: "oyun-ad", text: o.ad }),
      el("p", { class: "oyun-ozet", text: o.ozet }),
      el("p", { class: "oyun-aciklama", text: o.aciklama }),
      magaza,
      betaLink
    ]);

    kap.appendChild(el("section", {
      id: o.id, class: "oyun", "data-tema": o.tema, "aria-labelledby": baslikId
    }, [el("div", { class: "oyun-ic kabuk" }, [metin, ekranlar])]));
  });

  // ── Beta tablosu
  var satirlar = document.getElementById("beta-satirlar");
  S.oyunlar.forEach(function (o) {
    var L = o.linkler || {};
    satirlar.appendChild(el("div", { class: "beta-satir", role: "row" }, [
      el("span", { class: "beta-oyun", role: "cell" }, [
        el("img", { src: o.ikon, alt: "", width: "40", height: "40", loading: "lazy" }),
        el("strong", { text: o.ad })
      ]),
      el("span", { role: "cell", "data-baslik": "iPhone" }, [dugme(L.testflight, "TestFlight ile katıl", "", "dugme--kucuk")]),
      el("span", { role: "cell", "data-baslik": "Android" }, [dugme(L.playBeta, "Google Play ile katıl", "", "dugme--kucuk")])
    ]));
  });

  // ── İletişim ve yıl
  if (S.eposta) {
    var e = document.getElementById("eposta");
    e.href = "mailto:" + S.eposta;
    e.textContent = S.eposta;
  }
  document.getElementById("yil").textContent = new Date().getFullYear();
})();
