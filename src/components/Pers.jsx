import React from "react";

/**
 * BnbBuddy — Perspagina
 * Nieuw item toevoegen? Zet er een object bij in de array hieronder.
 * Nog niet verschenen? Laat `url` op null staan → toont "Binnenkort".
 */
const PERSITEMS = [
  {
    medium: "Algemeen Dagblad",
    datum: "", // TODO: publicatiedatum invullen, bv. "12 juni 2026"
    kop: "Nicole uit Best bedenkt oplossing voor B&B-eigenaren die nooit op vakantie gaan",
    samenvatting:
      "Over hoe BnbBuddy eigenaren van een B&B eindelijk zelf op vakantie laat gaan, doordat een ervaren Buddy het huis, de gasten en de sleutels tijdelijk overneemt.",
    url: "https://www.ad.nl/best/nicole-uit-best-bedenkt-oplossing-voor-benb-eigenaren-die-nooit-op-vakantie-gaan~a5332864/",
  },
  {
    medium: "Omroep Best — Vertel 't maar ...",
    datum: "29 april 2026",
    kop: "Nicole Almeida: ook een B&B-eigenaar wil wel eens met vakantie",
    samenvatting:
      "Een gesprek van 24 minuten over de eigenaren die iedereen verwennen behalve zichzelf, en over de Buddy's die Nicole regelt zodat de deur niet op slot hoeft.",
    url: "https://open.spotify.com/episode/4enwmbrEs3l7ZowCIvIphd",
    type: "audio",
  },
  {
    medium: "Trouw",
    datum: "",
    kop: "",
    samenvatting: "",
    url: null,
  },
];

const KLEUR = {
  terracotta: "#C4622D",
  sage: "#7A9E7E",
  cream: "#FDF6EC",
  inkt: "#2E2A26",
  grijs: "#6B6259",
};

const stijl = {
  pagina: {
    background: KLEUR.cream,
    color: KLEUR.inkt,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    minHeight: "100vh",
    padding: "64px 20px 96px",
  },
  binnen: { maxWidth: "820px", margin: "0 auto" },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: KLEUR.sage,
    marginBottom: "12px",
  },
  titel: {
    fontFamily: "'Prata', Georgia, serif",
    fontSize: "clamp(32px, 6vw, 48px)",
    lineHeight: 1.15,
    margin: "0 0 16px",
    fontWeight: 400,
  },
  intro: {
    fontSize: "17px",
    lineHeight: 1.6,
    color: KLEUR.grijs,
    maxWidth: "56ch",
    margin: "0 0 56px",
  },
  item: {
    borderTop: `1px solid rgba(46,42,38,0.12)`,
    padding: "28px 0",
  },
  medium: {
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: KLEUR.terracotta,
    fontWeight: 500,
  },
  datum: { fontSize: "13px", color: KLEUR.grijs, marginLeft: "10px" },
  kop: {
    fontFamily: "'Prata', Georgia, serif",
    fontSize: "clamp(20px, 3.4vw, 26px)",
    lineHeight: 1.3,
    fontWeight: 400,
    margin: "10px 0 10px",
  },
  samenvatting: {
    fontSize: "16px",
    lineHeight: 1.6,
    color: KLEUR.grijs,
    margin: "0 0 14px",
    maxWidth: "62ch",
  },
  link: {
    color: KLEUR.terracotta,
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    borderBottom: `1px solid ${KLEUR.terracotta}`,
    paddingBottom: "2px",
  },
  binnenkort: { fontSize: "15px", color: KLEUR.sage, fontStyle: "italic" },
  kit: {
    marginTop: "64px",
    background: "#fff",
    border: `1px solid rgba(46,42,38,0.10)`,
    borderRadius: "4px",
    padding: "32px",
  },
  kitTitel: {
    fontFamily: "'Prata', Georgia, serif",
    fontSize: "22px",
    fontWeight: 400,
    margin: "0 0 12px",
  },
  terug: {
    display: "inline-block",
    marginTop: "48px",
    color: KLEUR.grijs,
    fontSize: "15px",
    textDecoration: "none",
  },
};

export default function Pers({ onTerug }) {
  const verschenen = PERSITEMS.filter((i) => i.url || i.kop);

  return (
    <div style={stijl.pagina}>
      <div style={stijl.binnen}>
        <p style={stijl.eyebrow}>Pers</p>
        <h1 style={stijl.titel}>BnbBuddy in de media</h1>
        <p style={stijl.intro}>
          Journalisten schrijven over het idee achter BnbBuddy: eigenaren van een
          B&amp;B die zelf nooit weg kunnen, en de Buddy die dat oplost.
        </p>

        {verschenen.map((item, i) => (
          <article key={i} style={stijl.item}>
            <div>
              <span style={stijl.medium}>{item.medium}</span>
              {item.datum && <span style={stijl.datum}>{item.datum}</span>}
            </div>
            {item.kop && <h2 style={stijl.kop}>{item.kop}</h2>}
            {item.samenvatting && (
              <p style={stijl.samenvatting}>{item.samenvatting}</p>
            )}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={stijl.link}
              >
                {item.type === "audio" ? "Luister het gesprek" : "Lees het artikel"}
              </a>
            ) : (
              <span style={stijl.binnenkort}>Binnenkort</span>
            )}
          </article>
        ))}

        <section style={stijl.kit}>
          <h2 style={stijl.kitTitel}>Voor journalisten</h2>
          <p style={{ ...stijl.samenvatting, marginBottom: "18px" }}>
            BnbBuddy koppelt eigenaren van B&amp;B&apos;s en vakantiewoningen aan
            Buddy&apos;s die hun accommodatie tijdelijk overnemen. Zo kan een
            eigenaar er zelf een keer tussenuit, zonder de deur te sluiten of het
            aan het toeval over te laten. Het platform is actief in Nederland en
            België, met Curaçao als testmarkt.
          </p>
          <p style={{ fontSize: "15px", margin: 0 }}>
            Interviewverzoek of beeldmateriaal nodig?{" "}
            <a href="mailto:bnb@bnbbuddy.eu" style={stijl.link}>
              bnb@bnbbuddy.eu
            </a>
          </p>
        </section>

        {onTerug && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTerug();
            }}
            style={stijl.terug}
          >
            ← Terug naar de homepage
          </a>
        )}
      </div>
    </div>
  );
}
