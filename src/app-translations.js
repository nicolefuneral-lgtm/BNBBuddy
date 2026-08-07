// app-translations.js
// Vertalingen voor de app zelf (profielwizard, etc.) — los van translations.js,
// dat de publieke landingspagina vertaalt.
//
// Belangrijk: bij keuzelijsten (vaardigheden, voorzieningen, maanden, ...) blijft
// de opgeslagen `value` altijd hetzelfde, ongeacht de taal — alleen het zichtbare
// `label` verandert. Zo blijven filters/matching werken, ook als twee gebruikers
// hun profiel in een andere taal hebben ingevuld.

function localize(options, lang) {
  return options.map(o => ({ value: o.value, label: o[lang] || o.en || o.value }));
}

const VAARDIGHEDEN_OPTIONS = [
  { value: "Kamers schoonmaken", nl: "Kamers schoonmaken", en: "Cleaning rooms", de: "Zimmer reinigen", fr: "Nettoyer les chambres" },
  { value: "Tuin onderhouden", nl: "Tuin onderhouden", en: "Garden maintenance", de: "Gartenpflege", fr: "Entretien du jardin" },
  { value: "Dieren verzorgen", nl: "Dieren verzorgen", en: "Pet care", de: "Tierpflege", fr: "Soin des animaux" },
  { value: "Koken", nl: "Koken", en: "Cooking", de: "Kochen", fr: "Cuisiner" },
  { value: "Rijbewijs", nl: "Rijbewijs", en: "Driving licence", de: "Führerschein", fr: "Permis de conduire" },
  { value: "Reserveringen bijhouden", nl: "Reserveringen bijhouden", en: "Managing bookings", de: "Buchungen verwalten", fr: "Gestion des réservations" },
  { value: "In en uitchecken", nl: "In en uitchecken", en: "Check-in & check-out", de: "Ein- und Auschecken", fr: "Arrivées et départs" },
  { value: "Gasten informeren over bestemming", nl: "Gasten informeren over bestemming", en: "Informing guests about the area", de: "Gäste über die Umgebung informieren", fr: "Informer les hôtes sur la destination" },
  { value: "Sleutelbeheer", nl: "Sleutelbeheer", en: "Key management", de: "Schlüsselverwaltung", fr: "Gestion des clés" },
  { value: "Administratie bijhouden", nl: "Administratie bijhouden", en: "Keeping records", de: "Verwaltung führen", fr: "Tenue de l'administration" },
  { value: "Kleine reparaties", nl: "Kleine reparaties", en: "Small repairs", de: "Kleine Reparaturen", fr: "Petites réparations" },
  { value: "Zwembad onderhouden", nl: "Zwembad onderhouden", en: "Pool maintenance", de: "Poolpflege", fr: "Entretien de la piscine" },
  { value: "Boodschappen doen", nl: "Boodschappen doen", en: "Grocery shopping", de: "Einkäufe erledigen", fr: "Faire les courses" },
  { value: "Babysitter/kinderopvang", nl: "Babysitter/kinderopvang", en: "Babysitting/childcare", de: "Babysitten/Kinderbetreuung", fr: "Baby-sitting/garde d'enfants" },
];

const MAANDEN_OPTIONS = [
  { value: "Januari", nl: "Januari", en: "January", de: "Januar", fr: "Janvier" },
  { value: "Februari", nl: "Februari", en: "February", de: "Februar", fr: "Février" },
  { value: "Maart", nl: "Maart", en: "March", de: "März", fr: "Mars" },
  { value: "April", nl: "April", en: "April", de: "April", fr: "Avril" },
  { value: "Mei", nl: "Mei", en: "May", de: "Mai", fr: "Mai" },
  { value: "Juni", nl: "Juni", en: "June", de: "Juni", fr: "Juin" },
  { value: "Juli", nl: "Juli", en: "July", de: "Juli", fr: "Juillet" },
  { value: "Augustus", nl: "Augustus", en: "August", de: "August", fr: "Août" },
  { value: "September", nl: "September", en: "September", de: "September", fr: "Septembre" },
  { value: "Oktober", nl: "Oktober", en: "October", de: "Oktober", fr: "Octobre" },
  { value: "November", nl: "November", en: "November", de: "November", fr: "Novembre" },
  { value: "December", nl: "December", en: "December", de: "Dezember", fr: "Décembre" },
];

const AANTAL_PERSONEN_OPTIONS = [
  { value: "Ik kom alleen", nl: "Ik kom alleen", en: "I'm travelling alone", de: "Ich komme allein", fr: "Je viens seul(e)" },
  { value: "Ik kom met partner", nl: "Ik kom met partner", en: "I'm travelling with a partner", de: "Ich komme mit Partner", fr: "Je viens avec mon/ma partenaire" },
];

const PROPERTY_TYPES_OPTIONS = [
  { value: "Private room", nl: "Privékamer", en: "Private room", de: "Privatzimmer", fr: "Chambre privée" },
  { value: "Entire apartment", nl: "Volledig appartement", en: "Entire apartment", de: "Ganze Wohnung", fr: "Appartement entier" },
  { value: "Farmhouse B&B", nl: "Boerderij B&B", en: "Farmhouse B&B", de: "Bauernhof-B&B", fr: "Ferme B&B" },
  { value: "Cabin / Retreat", nl: "Hut / Retraite", en: "Cabin / Retreat", de: "Hütte / Retreat", fr: "Cabane / Retraite" },
  { value: "Boutique guesthouse", nl: "Boutique gastenhuis", en: "Boutique guesthouse", de: "Boutique-Gästehaus", fr: "Maison d'hôtes boutique" },
  { value: "Villa", nl: "Villa", en: "Villa", de: "Villa", fr: "Villa" },
  { value: "Treehouse", nl: "Boomhut", en: "Treehouse", de: "Baumhaus", fr: "Cabane dans les arbres" },
  { value: "Houseboat", nl: "Woonboot", en: "Houseboat", de: "Hausboot", fr: "Péniche" },
];

const AMENITIES_OPTIONS = [
  { value: "Breakfast included", nl: "Ontbijt inbegrepen", en: "Breakfast included", de: "Frühstück inbegriffen", fr: "Petit-déjeuner inclus" },
  { value: "WiFi", nl: "WiFi", en: "WiFi", de: "WLAN", fr: "WiFi" },
  { value: "Parking", nl: "Parkeren", en: "Parking", de: "Parkplatz", fr: "Parking" },
  { value: "Garden", nl: "Tuin", en: "Garden", de: "Garten", fr: "Jardin" },
  { value: "Pool", nl: "Zwembad", en: "Pool", de: "Pool", fr: "Piscine" },
  { value: "Sauna", nl: "Sauna", en: "Sauna", de: "Sauna", fr: "Sauna" },
  { value: "Bike rental", nl: "Fietsverhuur", en: "Bike rental", de: "Fahrradverleih", fr: "Location de vélos" },
  { value: "Kitchen", nl: "Keuken", en: "Kitchen", de: "Küche", fr: "Cuisine" },
  { value: "Pets allowed", nl: "Huisdieren toegestaan", en: "Pets allowed", de: "Haustiere erlaubt", fr: "Animaux acceptés" },
  { value: "EV charger", nl: "Oplaadpunt EV", en: "EV charger", de: "E-Auto-Ladestation", fr: "Borne de recharge électrique" },
  { value: "Workspace", nl: "Werkplek", en: "Workspace", de: "Arbeitsplatz", fr: "Espace de travail" },
  { value: "City tours", nl: "Stadstours", en: "City tours", de: "Stadtführungen", fr: "Visites de la ville" },
];

const LANGUAGES_OPTIONS = [
  { value: "English", nl: "Engels", en: "English", de: "Englisch", fr: "Anglais" },
  { value: "Dutch", nl: "Nederlands", en: "Dutch", de: "Niederländisch", fr: "Néerlandais" },
  { value: "German", nl: "Duits", en: "German", de: "Deutsch", fr: "Allemand" },
  { value: "French", nl: "Frans", en: "French", de: "Französisch", fr: "Français" },
  { value: "Spanish", nl: "Spaans", en: "Spanish", de: "Spanisch", fr: "Espagnol" },
  { value: "Italian", nl: "Italiaans", en: "Italian", de: "Italienisch", fr: "Italien" },
  { value: "Portuguese", nl: "Portugees", en: "Portuguese", de: "Portugiesisch", fr: "Portugais" },
  { value: "Japanese", nl: "Japans", en: "Japanese", de: "Japanisch", fr: "Japonais" },
  { value: "Arabic", nl: "Arabisch", en: "Arabic", de: "Arabisch", fr: "Arabe" },
  { value: "Swedish", nl: "Zweeds", en: "Swedish", de: "Schwedisch", fr: "Suédois" },
  { value: "Polish", nl: "Pools", en: "Polish", de: "Polnisch", fr: "Polonais" },
  { value: "Turkish", nl: "Turks", en: "Turkish", de: "Türkisch", fr: "Turc" },
];

const INTERESTS_OPTIONS = [
  { value: "Hiking", nl: "Wandelen", en: "Hiking", de: "Wandern", fr: "Randonnée" },
  { value: "Photography", nl: "Fotografie", en: "Photography", de: "Fotografie", fr: "Photographie" },
  { value: "Cooking", nl: "Koken", en: "Cooking", de: "Kochen", fr: "Cuisine" },
  { value: "Cycling", nl: "Fietsen", en: "Cycling", de: "Radfahren", fr: "Cyclisme" },
  { value: "Surfing", nl: "Surfen", en: "Surfing", de: "Surfen", fr: "Surf" },
  { value: "Music", nl: "Muziek", en: "Music", de: "Musik", fr: "Musique" },
  { value: "Art", nl: "Kunst", en: "Art", de: "Kunst", fr: "Art" },
  { value: "Wine", nl: "Wijn", en: "Wine", de: "Wein", fr: "Vin" },
  { value: "Reading", nl: "Lezen", en: "Reading", de: "Lesen", fr: "Lecture" },
  { value: "Yoga", nl: "Yoga", en: "Yoga", de: "Yoga", fr: "Yoga" },
  { value: "Dancing", nl: "Dansen", en: "Dancing", de: "Tanzen", fr: "Danse" },
  { value: "Climbing", nl: "Klimmen", en: "Climbing", de: "Klettern", fr: "Escalade" },
  { value: "Nature", nl: "Natuur", en: "Nature", de: "Natur", fr: "Nature" },
  { value: "Nightlife", nl: "Nachtleven", en: "Nightlife", de: "Nachtleben", fr: "Vie nocturne" },
  { value: "History", nl: "Geschiedenis", en: "History", de: "Geschichte", fr: "Histoire" },
  { value: "Markets", nl: "Markten", en: "Markets", de: "Märkte", fr: "Marchés" },
];

const WIZARD_TEXT = {
  nl: {
    roleOwner: "🏡 Eigenaar", roleBuddy: "🎒 Buddy",
    stepOf: "Stap {step} van {total}",
    titlesOwner: ["Basisgegevens", "Jouw verhaal", "Jouw pand", "Voorzieningen & prijs", "Interesses", "Foto's"],
    titlesBuddy: ["Basisgegevens", "Jouw verhaal", "Reisplannen", "Voorkeuren", "Interesses", "Foto's"],
    back: "← Terug", next: "Verder →", submit: "Profiel indienen 🎉",
    selectPlaceholder: "Selecteer…", selectedSuffix: "geselecteerd",
    step1: {
      greeting: "Hoi {name}! 👋",
      subtitleOwner: "Laten we jouw host profiel aanmaken.",
      subtitleBuddy: "Laten we jouw Buddy profiel aanmaken.",
      ageLabel: "Jouw leeftijd", agePlaceholder: "bijv. 28",
      cityLabel: "Stad", cityPlaceholder: "bijv. Amsterdam",
      countryLabel: "Land", countryPlaceholder: "bijv. Nederland",
      partnerQuestion: "Reis je alleen of met partner?",
      partnerNamePlaceholder: "Naam van je partner",
    },
    step2: {
      title: "Vertel je verhaal", subtitle: "Dit is wat anderen op jouw profiel zien.",
      taglineLabel: "Pakkende zin over jou",
      taglinePlaceholderOwner: "bijv. Gezellige kamers, mooie omgeving",
      taglinePlaceholderBuddy: "bijv. Rustig reizen & sterke koffie",
      bioLabel: "Over jou",
      bioPlaceholderOwner: "Vertel gasten over je pand…",
      bioPlaceholderBuddy: "Wat voor Buddy ben jij?…",
    },
    step3Owner: {
      title: "Jouw pand", subtitle: "Vertel gasten wat je aanbiedt.",
      propertyNameLabel: "Naam van het pand", propertyNamePlaceholder: "bijv. Casa Sabor",
      propertyTypeLabel: "Type pand",
      roomsLabel: "Aantal kamers", roomsPlaceholder: "bijv. 3",
      priceLabel: "Prijs per nacht (€) — van / tot", pricePlaceholderFrom: "Van", pricePlaceholderTo: "Tot",
      houseRulesLabel: "Huisregels (optioneel)", houseRulesPlaceholder: "bijv. Niet roken, inchecken na 15:00",
    },
    step3Buddy: {
      title: "Bestemming", subtitle: "Welke bestemmingen hebben jouw voorkeur?",
      destinationLabel: "Bestemming", destinationOptional: " (optioneel)",
      destinationPlaceholder: "bijv. Lissabon, Portugal",
      vaardighedenLabel: "Vaardigheden (wat breng jij mee)",
    },
    step4Owner: {
      title: "Voorzieningen & beschikbaarheid", subtitle: "Wat bied je gasten aan?",
      availableFromLabel: "Beschikbaar van", availableToLabel: "Beschikbaar tot",
      flexibleLabel: "Mijn beschikbaarheid is flexibel",
    },
    step4Buddy: {
      title: "Beschikbaarheid",
      availableFromLabel: "Beschikbaar van", availableToLabel: "Beschikbaar tot",
      flexibleLabel: "Mijn data zijn flexibel",
      maandenLabel: "Maanden",
    },
    step5: {
      title: "Bijna klaar!", subtitle: "Voeg je talen en interesses toe.",
      languagesLabel: "Talen die je spreekt", otherLanguagePlaceholder: "Overige taal...",
      interestsLabel: "Interesses (kies max. 6)", otherInterestPlaceholder: "Overige interesse...",
    },
  },
  en: {
    roleOwner: "🏡 Owner", roleBuddy: "🎒 Buddy",
    stepOf: "Step {step} of {total}",
    titlesOwner: ["Basics", "Your story", "Your property", "Amenities & price", "Interests", "Photos"],
    titlesBuddy: ["Basics", "Your story", "Travel plans", "Preferences", "Interests", "Photos"],
    back: "← Back", next: "Next →", submit: "Submit profile 🎉",
    selectPlaceholder: "Select…", selectedSuffix: "selected",
    step1: {
      greeting: "Hi {name}! 👋",
      subtitleOwner: "Let's create your host profile.",
      subtitleBuddy: "Let's create your Buddy profile.",
      ageLabel: "Your age", agePlaceholder: "e.g. 28",
      cityLabel: "City", cityPlaceholder: "e.g. Amsterdam",
      countryLabel: "Country", countryPlaceholder: "e.g. Netherlands",
      partnerQuestion: "Are you travelling alone or with a partner?",
      partnerNamePlaceholder: "Your partner's name",
    },
    step2: {
      title: "Tell your story", subtitle: "This is what others see on your profile.",
      taglineLabel: "A catchy line about you",
      taglinePlaceholderOwner: "e.g. Cosy rooms, beautiful surroundings",
      taglinePlaceholderBuddy: "e.g. Slow travel & strong coffee",
      bioLabel: "About you",
      bioPlaceholderOwner: "Tell guests about your property…",
      bioPlaceholderBuddy: "What kind of Buddy are you?…",
    },
    step3Owner: {
      title: "Your property", subtitle: "Tell guests what you offer.",
      propertyNameLabel: "Property name", propertyNamePlaceholder: "e.g. Casa Sabor",
      propertyTypeLabel: "Property type",
      roomsLabel: "Number of rooms", roomsPlaceholder: "e.g. 3",
      priceLabel: "Price per night (€) — from / to", pricePlaceholderFrom: "From", pricePlaceholderTo: "To",
      houseRulesLabel: "House rules (optional)", houseRulesPlaceholder: "e.g. No smoking, check-in after 3pm",
    },
    step3Buddy: {
      title: "Destination", subtitle: "Which destinations do you prefer?",
      destinationLabel: "Destination", destinationOptional: " (optional)",
      destinationPlaceholder: "e.g. Lisbon, Portugal",
      vaardighedenLabel: "Skills (what you bring)",
    },
    step4Owner: {
      title: "Amenities & availability", subtitle: "What do you offer guests?",
      availableFromLabel: "Available from", availableToLabel: "Available to",
      flexibleLabel: "My availability is flexible",
    },
    step4Buddy: {
      title: "Availability",
      availableFromLabel: "Available from", availableToLabel: "Available to",
      flexibleLabel: "My dates are flexible",
      maandenLabel: "Months",
    },
    step5: {
      title: "Almost there!", subtitle: "Add your languages and interests.",
      languagesLabel: "Languages you speak", otherLanguagePlaceholder: "Other language...",
      interestsLabel: "Interests (choose up to 6)", otherInterestPlaceholder: "Other interest...",
    },
  },
  de: {
    roleOwner: "🏡 Eigentümer", roleBuddy: "🎒 Buddy",
    stepOf: "Schritt {step} von {total}",
    titlesOwner: ["Grunddaten", "Deine Geschichte", "Deine Unterkunft", "Ausstattung & Preis", "Interessen", "Fotos"],
    titlesBuddy: ["Grunddaten", "Deine Geschichte", "Reisepläne", "Vorlieben", "Interessen", "Fotos"],
    back: "← Zurück", next: "Weiter →", submit: "Profil einreichen 🎉",
    selectPlaceholder: "Auswählen…", selectedSuffix: "ausgewählt",
    step1: {
      greeting: "Hallo {name}! 👋",
      subtitleOwner: "Lass uns dein Gastgeber-Profil erstellen.",
      subtitleBuddy: "Lass uns dein Buddy-Profil erstellen.",
      ageLabel: "Dein Alter", agePlaceholder: "z. B. 28",
      cityLabel: "Stadt", cityPlaceholder: "z. B. Amsterdam",
      countryLabel: "Land", countryPlaceholder: "z. B. Niederlande",
      partnerQuestion: "Reist du allein oder mit Partner?",
      partnerNamePlaceholder: "Name deines Partners",
    },
    step2: {
      title: "Erzähl deine Geschichte", subtitle: "Das sehen andere auf deinem Profil.",
      taglineLabel: "Ein einprägsamer Satz über dich",
      taglinePlaceholderOwner: "z. B. Gemütliche Zimmer, schöne Umgebung",
      taglinePlaceholderBuddy: "z. B. Entspannt reisen & starker Kaffee",
      bioLabel: "Über dich",
      bioPlaceholderOwner: "Erzähl Gästen von deiner Unterkunft…",
      bioPlaceholderBuddy: "Was für ein Buddy bist du?…",
    },
    step3Owner: {
      title: "Deine Unterkunft", subtitle: "Erzähl Gästen, was du anbietest.",
      propertyNameLabel: "Name der Unterkunft", propertyNamePlaceholder: "z. B. Casa Sabor",
      propertyTypeLabel: "Art der Unterkunft",
      roomsLabel: "Anzahl der Zimmer", roomsPlaceholder: "z. B. 3",
      priceLabel: "Preis pro Nacht (€) — von / bis", pricePlaceholderFrom: "Von", pricePlaceholderTo: "Bis",
      houseRulesLabel: "Hausregeln (optional)", houseRulesPlaceholder: "z. B. Nicht rauchen, Check-in nach 15:00 Uhr",
    },
    step3Buddy: {
      title: "Reiseziel", subtitle: "Welche Reiseziele bevorzugst du?",
      destinationLabel: "Reiseziel", destinationOptional: " (optional)",
      destinationPlaceholder: "z. B. Lissabon, Portugal",
      vaardighedenLabel: "Fähigkeiten (was du mitbringst)",
    },
    step4Owner: {
      title: "Ausstattung & Verfügbarkeit", subtitle: "Was bietest du Gästen?",
      availableFromLabel: "Verfügbar von", availableToLabel: "Verfügbar bis",
      flexibleLabel: "Meine Verfügbarkeit ist flexibel",
    },
    step4Buddy: {
      title: "Verfügbarkeit",
      availableFromLabel: "Verfügbar von", availableToLabel: "Verfügbar bis",
      flexibleLabel: "Meine Daten sind flexibel",
      maandenLabel: "Monate",
    },
    step5: {
      title: "Fast fertig!", subtitle: "Füge deine Sprachen und Interessen hinzu.",
      languagesLabel: "Sprachen, die du sprichst", otherLanguagePlaceholder: "Andere Sprache...",
      interestsLabel: "Interessen (max. 6 wählen)", otherInterestPlaceholder: "Anderes Interesse...",
    },
  },
  fr: {
    roleOwner: "🏡 Propriétaire", roleBuddy: "🎒 Buddy",
    stepOf: "Étape {step} sur {total}",
    titlesOwner: ["Infos de base", "Ton histoire", "Ton logement", "Équipements & prix", "Intérêts", "Photos"],
    titlesBuddy: ["Infos de base", "Ton histoire", "Projets de voyage", "Préférences", "Intérêts", "Photos"],
    back: "← Retour", next: "Suivant →", submit: "Envoyer le profil 🎉",
    selectPlaceholder: "Sélectionner…", selectedSuffix: "sélectionné(s)",
    step1: {
      greeting: "Salut {name} ! 👋",
      subtitleOwner: "Créons ton profil d'hôte.",
      subtitleBuddy: "Créons ton profil de Buddy.",
      ageLabel: "Ton âge", agePlaceholder: "ex. 28",
      cityLabel: "Ville", cityPlaceholder: "ex. Amsterdam",
      countryLabel: "Pays", countryPlaceholder: "ex. Pays-Bas",
      partnerQuestion: "Voyages-tu seul(e) ou avec un(e) partenaire ?",
      partnerNamePlaceholder: "Nom de ton/ta partenaire",
    },
    step2: {
      title: "Raconte ton histoire", subtitle: "C'est ce que les autres voient sur ton profil.",
      taglineLabel: "Une phrase accrocheuse sur toi",
      taglinePlaceholderOwner: "ex. Chambres chaleureuses, beaux environs",
      taglinePlaceholderBuddy: "ex. Voyage tranquille & café corsé",
      bioLabel: "À propos de toi",
      bioPlaceholderOwner: "Parle de ton logement aux invités…",
      bioPlaceholderBuddy: "Quel genre de Buddy es-tu ?…",
    },
    step3Owner: {
      title: "Ton logement", subtitle: "Dis aux invités ce que tu proposes.",
      propertyNameLabel: "Nom du logement", propertyNamePlaceholder: "ex. Casa Sabor",
      propertyTypeLabel: "Type de logement",
      roomsLabel: "Nombre de chambres", roomsPlaceholder: "ex. 3",
      priceLabel: "Prix par nuit (€) — de / à", pricePlaceholderFrom: "De", pricePlaceholderTo: "À",
      houseRulesLabel: "Règles de la maison (facultatif)", houseRulesPlaceholder: "ex. Non-fumeur, arrivée après 15h",
    },
    step3Buddy: {
      title: "Destination", subtitle: "Quelles destinations préfères-tu ?",
      destinationLabel: "Destination", destinationOptional: " (facultatif)",
      destinationPlaceholder: "ex. Lisbonne, Portugal",
      vaardighedenLabel: "Compétences (ce que tu apportes)",
    },
    step4Owner: {
      title: "Équipements & disponibilité", subtitle: "Que proposes-tu aux invités ?",
      availableFromLabel: "Disponible du", availableToLabel: "Disponible au",
      flexibleLabel: "Ma disponibilité est flexible",
    },
    step4Buddy: {
      title: "Disponibilité",
      availableFromLabel: "Disponible du", availableToLabel: "Disponible au",
      flexibleLabel: "Mes dates sont flexibles",
      maandenLabel: "Mois",
    },
    step5: {
      title: "Presque fini !", subtitle: "Ajoute tes langues et centres d'intérêt.",
      languagesLabel: "Langues que tu parles", otherLanguagePlaceholder: "Autre langue...",
      interestsLabel: "Centres d'intérêt (max. 6)", otherInterestPlaceholder: "Autre intérêt...",
    },
  },
};

export const APP_TRANSLATIONS = {};
for (const lang of Object.keys(WIZARD_TEXT)) {
  APP_TRANSLATIONS[lang] = {
    wizard: WIZARD_TEXT[lang],
    vaardigheden: localize(VAARDIGHEDEN_OPTIONS, lang),
    maanden: localize(MAANDEN_OPTIONS, lang),
    aantalPersonen: localize(AANTAL_PERSONEN_OPTIONS, lang),
    propertyTypes: localize(PROPERTY_TYPES_OPTIONS, lang),
    amenities: localize(AMENITIES_OPTIONS, lang),
    languagesList: localize(LANGUAGES_OPTIONS, lang),
    interestsList: localize(INTERESTS_OPTIONS, lang),
  };
}
