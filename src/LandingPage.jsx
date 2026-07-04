import { useState } from "react";
import { TRANSLATIONS, LANGUAGES } from "./translations.js";

// Zelfde kleuren als de app (App.jsx) — houd deze gesynchroniseerd.
const C = {
  cream: "#FDF6EC", sand: "#F2E4CC", terra: "#C4622D",
  terradark: "#9E4A1E", sage: "#7A9E7E", charcoal: "#2C2C2C",
  muted: "#8A7968", white: "#FFFFFF", blush: "#F4C9A8",
};

const landingCss = `
.lp-wrap{max-width:100%;background:${C.cream};color:${C.charcoal};min-height:100vh;}
.lp-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:${C.cream};border-bottom:1px solid ${C.sand};position:sticky;top:0;z-index:50;flex-wrap:wrap;gap:10px;}
.lp-logo{font-family:'Prata',serif;font-size:22px;color:${C.terra};font-weight:800;cursor:pointer;}
.lp-logo span{font-style:italic;color:${C.sage};}
.lp-tabs{display:flex;gap:6px;background:white;border-radius:24px;padding:4px;border:1px solid ${C.sand};}
.lp-tab{padding:8px 16px;border-radius:20px;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:${C.muted};cursor:pointer;transition:all .2s;}
.lp-tab.on{background:${C.terra};color:white;}
.lp-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.lp-lang{display:flex;gap:4px;}
.lp-lang button{border:none;background:none;font-size:18px;cursor:pointer;opacity:.4;padding:2px 4px;border-radius:6px;transition:opacity .2s;}
.lp-lang button.on{opacity:1;}
.lp-btn-nav{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:${C.muted};padding:8px 16px;border-radius:20px;}
.lp-btn-nav:hover{color:${C.terra};background:${C.sand};}
.lp-btn-nav.primary{background:${C.terra};color:white;}
.lp-btn-nav.primary:hover{background:${C.terradark};}
.lp-hero{padding:48px 20px 40px;background:linear-gradient(135deg,${C.sand} 0%,${C.cream} 60%);text-align:center;}
.lp-hero h1{font-family:'Prata',serif;font-size:32px;font-weight:800;line-height:1.25;margin-bottom:16px;max-width:640px;margin-left:auto;margin-right:auto;}
.lp-hero p{font-size:15px;color:${C.muted};line-height:1.75;max-width:600px;margin:0 auto 24px;white-space:pre-line;}
.lp-btn-hero{display:inline-flex;align-items:center;gap:8px;background:${C.terra};color:white;border:none;padding:14px 28px;border-radius:28px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;}
.lp-btn-hero:hover{background:${C.terradark};}
.lp-section{padding:48px 20px;max-width:760px;margin:0 auto;}
.lp-section h2{font-family:'Prata',serif;font-size:24px;font-weight:700;margin-bottom:16px;text-align:center;}
.lp-section p{font-size:15px;color:${C.muted};line-height:1.8;white-space:pre-line;margin-bottom:12px;}
.lp-break{background:${C.sage};color:white;border-radius:28px;padding:40px 28px;text-align:center;max-width:720px;margin:0 auto 48px;}
.lp-break h2{font-family:'Prata',serif;font-size:24px;margin-bottom:14px;}
.lp-break p{color:rgba(255,255,255,0.9);font-size:14px;line-height:1.8;white-space:pre-line;margin-bottom:20px;}
.lp-break button{background:white;color:${C.sage};border:none;padding:12px 26px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}
.lp-blobs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:900px;margin:0 auto;padding:0 20px 48px;}
.lp-blob{background:white;border-radius:24px;padding:26px 22px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.05);}
.lp-blob .num{width:34px;height:34px;border-radius:50%;background:${C.sand};color:${C.terra};font-family:'Prata',serif;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
.lp-blob h3{font-family:'Prata',serif;font-size:16px;margin-bottom:8px;}
.lp-blob p{font-size:13px;color:${C.muted};line-height:1.6;}
.lp-list{list-style:none;padding:0;max-width:600px;margin:0 auto 16px;}
.lp-list li{font-size:14px;color:${C.charcoal};line-height:1.7;padding-left:26px;position:relative;margin-bottom:8px;}
.lp-list li::before{content:'✓';position:absolute;left:0;color:${C.sage};font-weight:700;}
.lp-about{display:flex;flex-direction:column;gap:24px;align-items:center;max-width:600px;margin:0 auto;padding:48px 20px;text-align:center;}
.lp-newsletter{background:${C.sand};padding:48px 20px;text-align:center;}
.lp-newsletter h2{font-family:'Prata',serif;font-size:22px;margin-bottom:16px;}
.lp-newsletter form{display:flex;gap:10px;max-width:420px;margin:0 auto 10px;flex-wrap:wrap;justify-content:center;}
.lp-newsletter input[type=email]{flex:1;min-width:200px;padding:12px 18px;border-radius:24px;border:1.5px solid ${C.sand};font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}
.lp-newsletter button{background:${C.terra};color:white;border:none;padding:12px 24px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;}
.lp-newsletter .consent{font-size:11px;color:${C.muted};max-width:420px;margin:0 auto;}
.lp-contact{padding:48px 20px;max-width:600px;margin:0 auto;}
.lp-contact h2{font-family:'Prata',serif;font-size:24px;text-align:center;margin-bottom:10px;}
.lp-contact > p{font-size:14px;color:${C.muted};text-align:center;margin-bottom:28px;line-height:1.7;}
.lp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.lp-field{margin-bottom:14px;}
.lp-field.full{grid-column:1/-1;}
.lp-field label{display:block;font-size:11px;font-weight:600;color:${C.muted};margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;}
.lp-field input,.lp-field select,.lp-field textarea{width:100%;padding:12px 14px;border:1.5px solid ${C.sand};border-radius:12px;background:white;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}
.lp-field textarea{resize:vertical;min-height:100px;}
.lp-submit{width:100%;padding:14px;background:${C.terra};color:white;border:none;border-radius:16px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;margin-top:6px;}
.lp-footer{background:${C.charcoal};color:${C.sand};padding:36px 20px;text-align:center;font-size:13px;}
.lp-footer .cols{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-bottom:20px;}
.lp-footer .col h4{font-family:'Prata',serif;font-size:14px;margin-bottom:10px;color:white;}
.lp-footer .col div{margin-bottom:6px;opacity:.85;}
.lp-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:900px;margin:0 auto 48px;padding:0 20px;}
.lp-gallery img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px;}
.lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:900px;margin:0 auto;padding:0 20px 48px;}
.lp-grid3 img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:20px;}
@media(max-width:600px){
  .lp-grid3{grid-template-columns:1fr;}
}
@media(min-width:768px){
  .lp-hero h1{font-size:42px;}
}
`;

// Sfeerbeelden / iconen, overgenomen van bnbbuddy.eu
const IMG = {
  logo: "https://www.bnbbuddy.eu/uploads/8ADu0lqi/320x0_320x0/logo-bnb-buddy_332_717__msi___jpg.webp",
  whyIcons: [
    "https://www.bnbbuddy.eu/uploads/hURD5gzI/320x0_320x0/buttonvoorhuisje_532__msi___png.webp",
    "https://www.bnbbuddy.eu/uploads/70BCIf0R/320x0_320x0/huisjemetpersonen_864__msi___png.webp",
    "https://www.bnbbuddy.eu/uploads/mhXCtDYb/320x0_320x0/kalendermethanden_605__msi___png.webp",
  ],
  // De echte foto van Nicole (naast "Over Nicole")
  nicole: "https://www.bnbbuddy.eu/uploads/9qzCUHih/NicoleAlmeida__msi___jpg.jpg",
  // Sfeerbeeld naast de nieuwsbrief-aanmelding
  newsletterBanner: "https://www.bnbbuddy.eu/uploads/EBYdMXvc/jon-tyson-XS_o-Iuf9Go-unsplash-min_282__msi___jpg.jpg",
  // Sfeerbeeld boven de footer / naast het contactformulier
  footerBanner: "https://www.bnbbuddy.eu/uploads/9PPJA6RY/alex-azabache-V83v-MYB_Z8-unsplash-min__msi___jpg.jpg",
  // De 9 foto's uit de slideshow ("Waarom BNB Buddy" sectie)
  gallery: [
    "https://www.bnbbuddy.eu/uploads/56kcs3UC/rolands-varsbergs-gexFiejzFzY-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/TPLR3inf/roberta-sant-anna-xEpCd-YSU-Y-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/L7Drts67/jahanzeb-ahsan-QizdAJNl-1Y-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/1FKPcWKn/toa-heftiba-z2EbQN08ZL0-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/SztdlK4m/henrique-ferreira-Nhtd6yevEAw-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/lqmPejI6/leongsan-d2aCbaPymVU-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/1yplBuEp/xtrafotouitstralingvindikleukApplelogomagervanaf-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/lDwJqZmG/hector-o-connor-XSknXjyCVcs-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/4PNqkpDV/priscilla-du-preez-JuNUW2Fg__o-unsplash-min__msi___jpg.jpg",
  ],
  // De 3 foto's van het fotogrid (naast elkaar, na "Over Nicole")
  grid: [
    "https://www.bnbbuddy.eu/uploads/4jy7LTyX/lilartsy-GujI_lyCX4Q-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/n8Q2abdV/estudio-bloom-N9PBvp2xAlk-unsplash-min__msi___jpg.jpg",
    "https://www.bnbbuddy.eu/uploads/mq64k9MH/dino-reichmuth-A5rCN8626Ck-unsplash-min__msi___jpg.jpg",
  ],
};

export default function LandingPage({ onEnterApp }) {
  const [lang, setLang] = useState("nl");
  const [page, setPage] = useState("owner"); // "owner" | "buddy"
  const t = TRANSLATIONS[lang];
  const content = t[page];

  const handleCta = () => {
    // Navigeer naar de app en open direct de aanmeld-flow met de juiste rol.
    onEnterApp?.(page === "owner" ? "owner" : "buddy");
  };

  return (
    <div className="lp-wrap">
      <style>{landingCss}</style>

      <div className="lp-nav">
        <div className="lp-logo" onClick={() => setPage("owner")}>
          <img src={IMG.logo} alt="BnbBuddy" style={{ height: 44, display: "block" }} />
        </div>
        <div className="lp-tabs">
          <button className={`lp-tab ${page === "owner" ? "on" : ""}`} onClick={() => setPage("owner")}>
            {t.nav.findBuddy}
          </button>
          <button className={`lp-tab ${page === "buddy" ? "on" : ""}`} onClick={() => setPage("buddy")}>
            {t.nav.becomeBuddy}
          </button>
        </div>
        <div className="lp-actions">
          <div className="lp-lang">
            {LANGUAGES.map(l => (
              <button key={l.code} className={lang === l.code ? "on" : ""} onClick={() => setLang(l.code)} title={l.label}>
                {l.flag}
              </button>
            ))}
          </div>
          <button className="lp-btn-nav" onClick={() => onEnterApp?.(null, "login")}>{t.nav.login}</button>
          <button className="lp-btn-nav primary" onClick={() => onEnterApp?.(null, "signup")}>{t.nav.signup}</button>
        </div>
      </div>

      {/* HERO */}
      <div className="lp-hero">
        <img src={IMG.logo} alt="BnbBuddy" style={{ height: 100, margin: "0 auto 24px", display: "block" }} />
        <h1>{content.heroTitle}</h1>
        {content.heroSubtitle && <p style={{ fontWeight: 600, color: C.terra, marginBottom: 4 }}>{content.heroSubtitle}</p>}
        <p>{content.heroText}</p>
        <button className="lp-btn-hero" onClick={handleCta}>
          {page === "owner" ? t.shared.requestBuddyCta : t.shared.contactCta}
        </button>
      </div>

      {page === "owner" ? (
        <>
          <div className="lp-section">
            <h2>{content.section2Title}</h2>
            <p>{content.section2Text}</p>
          </div>
          <div className="lp-break">
            <h2>{content.breakTitle}</h2>
            <p>{content.breakText}</p>
            <button onClick={handleCta}>{t.shared.contactCta}</button>
          </div>
          <div className="lp-section" style={{ paddingBottom: 0 }}>
            <h2>{content.whyTitle}</h2>
            <p>{content.whyIntro}</p>
          </div>
          <div className="lp-blobs">
            {content.whyPoints.map((pt, i) => (
              <div className="lp-blob" key={i}>
                <img src={IMG.whyIcons[i]} alt="" style={{ width: 56, height: 56, objectFit: "contain", margin: "0 auto 14px", display: "block" }} />
                <h3>{pt.title}</h3>
                <p>{pt.text}</p>
              </div>
            ))}
          </div>
          <div className="lp-gallery">
            {IMG.gallery.map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy" />
            ))}
          </div>
          <div className="lp-section" style={{ paddingBottom: 0 }}>
            <h2>{content.howTitle}</h2>
            <p>{content.howIntro}</p>
          </div>
          <div className="lp-blobs">
            {content.howSteps.map((st, i) => (
              <div className="lp-blob" key={i}>
                <div className="num">{i + 1}</div>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="lp-section">
            <h2>{content.whatYouBringTitle}</h2>
            <p>{content.whatYouBringIntro}</p>
            <ul className="lp-list">
              {content.whatYouBringPoints.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
            <p style={{ textAlign: "center", fontStyle: "italic" }}>{content.whatYouBringClosing}</p>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="lp-btn-hero" onClick={handleCta}>{t.shared.contactCta}</button>
            </div>
          </div>
          <div className="lp-break">
            <h2>{content.whatYouGetTitle}</h2>
            <p>{content.whatYouGetText}</p>
          </div>
          <div className="lp-section">
            <h2>{content.practicalTitle}</h2>
            <p>{content.practicalIntro}</p>
            <ul className="lp-list">
              {content.practicalPoints.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          </div>
          <div className="lp-section" style={{ textAlign: "center" }}>
            <h2>{content.ctaTitle}</h2>
            <p>{content.ctaText}</p>
            <button className="lp-btn-hero" onClick={handleCta}>{t.shared.contactCta}</button>
          </div>
        </>
      )}

      {/* OVER NICOLE */}
      <div className="lp-about">
        <img src={IMG.nicole} alt="Nicole" style={{ width: "100%", maxWidth: 420, borderRadius: 20, objectFit: "cover" }} />
        <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22 }}>{t.shared.aboutNicoleTitle}</h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-line", textAlign: "left" }}>
          {t.shared.aboutNicoleText}
        </p>
      </div>

      {/* FOTOGRID */}
      <div className="lp-grid3">
        {IMG.grid.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" />
        ))}
      </div>

      {/* NEWSLETTER */}
      <div className="lp-newsletter">
        <img src={IMG.newsletterBanner} alt="" style={{ width: "100%", maxWidth: 420, borderRadius: 20, objectFit: "cover", marginBottom: 20 }} />
        <h2>{t.shared.newsletterTitle}</h2>
        <form onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder={t.shared.newsletterPlaceholder} required />
          <button type="submit">→</button>
        </form>
        <div className="consent">{t.shared.newsletterConsent}</div>
      </div>

      {/* CONTACT */}
      <div className="lp-contact">
        <h2>{t.shared.contactTitle}</h2>
        <p>{t.shared.contactIntro}</p>
        <form onSubmit={e => e.preventDefault()}>
          <div className="lp-form-grid">
            <div className="lp-field full">
              <label>{t.shared.contactFields.salutation}</label>
              <select><option></option></select>
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.firstName}</label>
              <input type="text" />
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.lastName}</label>
              <input type="text" />
            </div>
            <div className="lp-field full">
              <label>{t.shared.contactFields.role}</label>
              <select><option></option></select>
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.email}</label>
              <input type="email" />
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.website}</label>
              <input type="text" />
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.city}</label>
              <input type="text" />
            </div>
            <div className="lp-field">
              <label>{t.shared.contactFields.country}</label>
              <input type="text" />
            </div>
            <div className="lp-field full">
              <label>{t.shared.contactFields.message}</label>
              <textarea />
            </div>
          </div>
          <button className="lp-submit" type="submit">{t.shared.contactCta} →</button>
        </form>
      </div>

      {/* SFEERBEELD BOVEN FOOTER */}
      <img src={IMG.footerBanner} alt="" style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }} />

      {/* FOOTER */}
      <div className="lp-footer">
        <div className="cols">
          <div className="col">
            <h4>{t.shared.footerContact}</h4>
            <div>bnb@bnbbuddy.eu</div>
            <div>+31616807377</div>
          </div>
          <div className="col">
            <h4>{t.shared.footerPages}</h4>
            <div>{t.shared.footerHome}</div>
            <div>{t.shared.footerContactLink}</div>
            <div>{t.shared.footerPrivacy}</div>
          </div>
          <div className="col">
            <h4>{t.shared.footerSocial}</h4>
            <div>Instagram · Facebook</div>
          </div>
        </div>
        <div style={{ opacity: 0.6 }}>© {new Date().getFullYear()} BnbBuddy</div>
      </div>
    </div>
  );
}
