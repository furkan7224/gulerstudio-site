(function () {
  "use strict";

  var S = window.SITE || { oyunlar: [] };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "text") n.textContent = v;
        else if (k === "class") n.className = v;
        else n.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  // Yalnızca https:// ya da site içi (/...) linklere izin ver
  function link(url) {
    if (typeof url !== "string") return "";
    url = url.trim();
    if (/^https:\/\//i.test(url)) return url;
    if (/^\/(?!\/)/.test(url)) return url;
    return "";
  }

  var IKON = {
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.2 2.4c-.3.3-.4.7-.4 1.2v16.8c0 .5.1.9.4 1.2l9.4-9.6-9.4-9.6zm10.6 10.8 2.6 2.6-11 6.3 8.4-8.9zm0-2.4L6.4 1.9l11 6.3-2.6 2.6zm5.7 3.5-2.6 1.5-2.8-2.8 2.8-2.8 2.6 1.5c.9.5.9 2.1 0 2.6z"/></svg>',
    beta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 3h6M10 3v6.2L4.8 18.4A1.7 1.7 0 0 0 6.3 21h11.4a1.7 1.7 0 0 0 1.5-2.6L14 9.2V3M7.5 15h9"/></svg>'
  };

  function magazaDugmesi(url, ikon, ust, alt) {
    var a = el("a", { class: "magaza-dugme", href: url, target: "_blank", rel: "noopener" });
    a.innerHTML = IKON[ikon];
    a.appendChild(el("span", null, [el("small", { text: ust }), el("strong", { text: alt })]));
    return a;
  }

  // ── Başlık
  document.getElementById("studyo-ad").textContent = S.studyo || "Güler Studio";
  document.getElementById("slogan").textContent = S.slogan || "";
  var basLinkler = document.getElementById("bas-linkler");
  if (S.instagram) {
    basLinkler.appendChild(el("a", { href: "https://instagram.com/" + encodeURIComponent(S.instagram), target: "_blank", rel: "noopener", text: "@" + S.instagram }));
  }
  if (S.eposta) {
    basLinkler.appendChild(el("a", { href: "mailto:" + S.eposta, text: S.eposta }));
  }

  // ── Oyunlara atlama
  var atlama = document.getElementById("atlama");
  S.oyunlar.forEach(function (o) {
    atlama.appendChild(el("li", null, [
      el("a", { href: "#" + o.id }, [
        el("img", { src: o.ikon, alt: "", width: "56", height: "56" }),
        el("span", { text: o.ad })
      ])
    ]));
  });

  // ── Oyun bölümleri
  var ana = document.getElementById("oyunlar");
  S.oyunlar.forEach(function (o, i) {
    var L = o.linkler || {};
    var hId = o.id + "-baslik";

    var magaza = el("div", { class: "magaza" });
    if (link(L.appStore)) magaza.appendChild(magazaDugmesi(link(L.appStore), "apple", "App Store'dan", "İndir"));
    if (link(L.googlePlay)) magaza.appendChild(magazaDugmesi(link(L.googlePlay), "play", "Google Play'den", "İndir"));
    if (link(L.testflight)) magaza.appendChild(magazaDugmesi(link(L.testflight), "apple", "iPhone betası", "TestFlight"));
    if (o.androidBeta) {
      var b = el("a", { class: "magaza-dugme magaza-dugme--beta", href: "#" + o.id + "-beta" });
      b.innerHTML = IKON.beta;
      b.appendChild(el("span", null, [el("small", { text: "Android" }), el("strong", { text: "Betaya katıl" })]));
      magaza.appendChild(b);
    }
    if (!magaza.children.length) magaza.appendChild(el("p", { class: "yakinda", text: "Mağazalarda yakında." }));

    var ozellikler = el("ul", { class: "ozellikler" }, (o.ozellikler || []).map(function (f) {
      return el("li", null, [el("span", { class: "emoji", "aria-hidden": "true", text: f[0] }), el("span", { text: f[1] })]);
    }));

    var ekranlar = el("div", { class: "ekranlar", role: "list", "aria-label": o.ad + " ekran görüntüleri" },
      (o.ekranlar || []).map(function (e) {
        return el("figure", { class: "telefon", role: "listitem" }, [
          el("img", { src: e.src, alt: e.alt, width: "440", height: "956", loading: i === 0 ? "eager" : "lazy", decoding: "async" })
        ]);
      }));

    var bolum = el("section", { class: "oyun", id: o.id, "data-tema": o.tema, "aria-labelledby": hId }, [
      el("div", { class: "kabuk" }, [
        el("div", { class: "oyun-kafa" }, [
          el("img", { class: "oyun-ikon", src: o.ikon, alt: "", width: "112", height: "112" }),
          el("div", null, [
            el("p", { class: "etiket", text: o.etiket }),
            el("h2", { id: hId, class: "oyun-ad" }, [
              o.ad,
              el("span", { class: "alt-baslik", text: o.altBaslik })
            ])
          ])
        ]),
        el("div", { class: "oyun-govde" }, [
          el("div", { class: "oyun-metin" }, [
            el("p", { class: "ozet", text: o.ozet }),
            ozellikler,
            magaza
          ]),
          ekranlar
        ]),
        o.androidBeta ? betaBlok(o) : null
      ])
    ]);
    ana.appendChild(bolum);
  });

  // ── Android kapalı beta bloğu
  function betaBlok(o) {
    var L = o.linkler || {};
    var fid = o.id + "-eposta";

    var iphone;
    if (link(L.appStore)) {
      iphone = el("p", { class: "iphone-not" }, ["iPhone kullanıyorsan beklemene gerek yok: ", el("a", { href: link(L.appStore), target: "_blank", rel: "noopener", text: "App Store'dan indir" }), "."]);
    } else if (link(L.testflight)) {
      iphone = el("p", { class: "iphone-not" }, ["iPhone kullanıyorsan ", el("a", { href: link(L.testflight), target: "_blank", rel: "noopener", text: "TestFlight ile katıl" }), "."]);
    } else {
      iphone = el("p", { class: "iphone-not", text: "iPhone sürümü yakında App Store'da." });
    }

    var durum = el("p", { class: "form-durum", role: "status", "aria-live": "polite" });
    var input = el("input", { id: fid, name: "eposta", type: "email", required: true, autocomplete: "email", inputmode: "email", placeholder: "adin@gmail.com", maxlength: "120" });
    var dugme = el("button", { type: "submit", text: "Betaya katıl" });

    var form = el("form", { class: "beta-form", novalidate: true }, [
      el("label", { for: fid, text: "Gmail adresin" }),
      el("div", { class: "form-satir" }, [input, dugme]),
      // bot tuzağı: gerçek kullanıcılar görmez
      el("div", { class: "tuzak", "aria-hidden": "true" }, [
        el("label", { for: o.id + "-site", text: "Web siten" }),
        el("input", { id: o.id + "-site", name: "site", type: "text", tabindex: "-1", autocomplete: "off" })
      ]),
      el("p", { class: "form-not", text: "Adresin yalnızca test davetini göndermek için kullanılır." }),
      durum
    ]);

    var basari = el("div", { class: "basari", hidden: true, tabindex: "-1" }, [
      el("p", { class: "basari-baslik", text: "Listeye eklendin." }),
      el("p", { text: "Davet birkaç gün içinde Gmail adresine gelir. Gelmezse spam klasörüne de bak." })
    ]);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var eposta = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta)) {
        durum.textContent = "Geçerli bir e-posta adresi yaz.";
        durum.className = "form-durum hata";
        input.focus();
        return;
      }
      dugme.disabled = true;
      dugme.textContent = "Gönderiliyor…";
      durum.textContent = "";
      durum.className = "form-durum";

      fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eposta: eposta, oyun: o.id, platform: "android", site: form.site.value })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
      }).then(function (res) {
        if (res.ok || res.status === 409) {
          if (res.status === 409) basari.firstChild.textContent = "Bu adres zaten listede.";
          form.hidden = true;
          basari.hidden = false;
          basari.focus();
          return;
        }
        durum.textContent = res.j.hata || "Kayıt alınamadı. Biraz sonra tekrar dene.";
        durum.className = "form-durum hata";
      }).catch(function () {
        durum.textContent = "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.";
        durum.className = "form-durum hata";
      }).then(function () {
        dugme.disabled = false;
        dugme.textContent = "Betaya katıl";
      });
    });

    return el("div", { class: "beta", id: o.id + "-beta" }, [
      el("div", { class: "beta-bilgi" }, [
        el("p", { class: "etiket", text: "Android kapalı beta" }),
        el("h3", { text: "Mağazaya çıkmadan önce oyna" }),
        el("ol", { class: "adimlar" }, [
          el("li", null, [el("span", null, [el("strong", { text: "Formu doldur." }), " Google Play'de kullandığın Gmail adresini yaz."])]),
          el("li", null, [el("span", null, [el("strong", { text: "Davetini al." }), " Test linki birkaç gün içinde e-postana gelir."])]),
          el("li", null, [el("span", null, [el("strong", { text: "14 gün telefonunda tut." }), " Google, oyunun yayınlanması için testçilerin oyunu 14 gün yüklü tutmasını istiyor."])])
        ]),
        iphone
      ]),
      el("div", { class: "beta-form-kap" }, [form, basari])
    ]);
  }

  // ── Alt bilgi
  var alt = document.getElementById("alt-linkler");
  if (S.eposta) alt.appendChild(el("li", null, [el("a", { href: "mailto:" + S.eposta, text: "İletişim" })]));
  if (S.instagram) alt.appendChild(el("li", null, [el("a", { href: "https://instagram.com/" + encodeURIComponent(S.instagram), target: "_blank", rel: "noopener", text: "Instagram" })]));
  S.oyunlar.forEach(function (o) {
    if (link(o.destek)) alt.appendChild(el("li", null, [el("a", { href: link(o.destek), text: o.ad + " destek" })]));
    if (link(o.gizlilik)) alt.appendChild(el("li", null, [el("a", { href: link(o.gizlilik), text: o.ad + " gizlilik politikası" })]));
  });
  document.getElementById("yil").textContent = new Date().getFullYear();
})();
