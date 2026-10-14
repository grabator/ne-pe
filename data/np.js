/*
 * Nemanja Petrović · Pastry Chef: SVI podaci i tekstovi stranice na jednom mjestu.
 * Svaki tekst je { bs, en, de }. Slike su u assets/img/ (pravi ih tools/slike.py), dimenzije u data/slike.js.
 *
 * DEMO: polja označena sa "DEMO" su privremena i mijenjaju se kad stignu pravi podaci.
 * Za objavu: demo: false, obrisati noindex u index.html i robots.txt (vidi README).
 */
window.NP = {
  demo: true,
  credit: null, /* npr. { name: 'Ime', url: 'https://...' } doda potpis u podnožje */
  languages: ['bs', 'en', 'de'],

  /* --- kontakt (DEMO: telefon i email nisu poznati) --- */
  contact: {
    phone: null,           /* npr. '+387 63 000 000' */
    phoneLabel: '+387 6X XXX XXX',
    viber: null,           /* npr. '+38763000000' (bez broja Viber otvara izbor kontakta) */
    whatsapp: null,        /* npr. '38763000000' */
    email: null,           /* npr. 'kontakt@nemanjapetrovic.ba' */
    emailLabel: 'kontakt@primjer.ba',
    instagram: 'nemanja_petr',
    mapQuery: 'Aldi slastičarna Mostar'
  },

  /* YouTube kanal "Slatke priče": DEMO, pravi link još nije poznat (zamijeniti) */
  youtube: 'https://www.youtube.com/results?search_query=Slatke+pri%C4%8De+s+Nemanjom+Petrovi%C4%87em',
  youtubeIsSearch: true,

  /* --- tekstovi interfejsa --- */
  ui: {
    skip: { bs: 'Preskoči na sadržaj', en: 'Skip to content', de: 'Zum Inhalt springen' },
    menu: { bs: 'Meni', en: 'Menu', de: 'Menü' },
    close: { bs: 'Zatvori', en: 'Close', de: 'Schließen' },
    nav: {
      story: { bs: 'Priča', en: 'Story', de: 'Geschichte' },
      works: { bs: 'Radovi', en: 'Signature', de: 'Kreationen' },
      weddings: { bs: 'Svadbe', en: 'Weddings', de: 'Hochzeiten' },
      awards: { bs: 'Nagrade', en: 'Awards', de: 'Auszeichnungen' },
      academy: { bs: 'Akademija', en: 'Academy', de: 'Akademie' },
      contact: { bs: 'Kontakt', en: 'Contact', de: 'Kontakt' }
    },
    prev: { bs: 'Prethodna', en: 'Previous', de: 'Zurück' },
    next: { bs: 'Sljedeća', en: 'Next', de: 'Weiter' },
    open: { bs: 'Otvori fotografiju', en: 'Open photo', de: 'Foto öffnen' },
    lang: { bs: 'Jezik', en: 'Language', de: 'Sprache' },
    demoBar: {
      bs: 'Demo: pregled stranice. Fotografije: Hercegovina.info, Hercegovina.in, Instagram @nemanja_petr.',
      en: 'Demo: website preview. Photos: Hercegovina.info, Hercegovina.in, Instagram @nemanja_petr.',
      de: 'Demo: Vorschau der Website. Fotos: Hercegovina.info, Hercegovina.in, Instagram @nemanja_petr.'
    },
    demoTag: { bs: 'demo', en: 'demo', de: 'Demo' }
  },

  /* --- prvi ekran (isti tekst stoji i direktno u index.html zbog brzine i SEO) --- */
  hero: {
    label: { bs: 'Pastry Chef · Mostar', en: 'Pastry Chef · Mostar', de: 'Pastry Chef · Mostar' },
    tagline: { bs: 'Sve je počelo Grešnom tortom.', en: 'It all began with the Sinful Cake.', de: 'Alles begann mit der Sündigen Torte.' },
    meta: { bs: '15 godina · 5 medalja · Akademija slastičarstva', en: '15 years · 5 medals · Pastry Academy', de: '15 Jahre · 5 Medaillen · Konditorei-Akademie' },
    scroll: { bs: 'Listaj', en: 'Scroll', de: 'Scrollen' },
    portraitAlt: { bs: 'Nemanja Petrović u tamnom odijelu', en: 'Nemanja Petrović in a dark suit', de: 'Nemanja Petrović im dunklen Anzug' }
  },

  /* --- brojke --- */
  stats: [
    { n: 15, label: { bs: 'godina zanata', en: 'years of craft', de: 'Jahre Handwerk' } },
    { n: 5, label: { bs: 'medalja', en: 'medals', de: 'Medaillen' }, sub: '2022 · 2023 · 2024' },
    { n: 11, label: { bs: 'spratova najveće torte', en: 'tiers on the tallest cake', de: 'Etagen der größten Torte' } },
    { n: 30, label: { bs: 'epizoda Slatkih priča', en: 'episodes of Sweet Stories', de: 'Folgen Süße Geschichten' } }
  ],

  /* --- 01 Priča --- */
  story: {
    chapter: { bs: '01 · Priča', en: '01 · Story', de: '01 · Geschichte' },
    title: { bs: 'Od Doboja do *Mostara*.', en: 'From Doboj to *Mostar*.', de: 'Von Doboj nach *Mostar*.' },
    text: {
      bs: [
        'Moja priča počela je u Zagrebu, na jednoj edukaciji na koju sam došao više kao promatrač. Pola onoga što znam naučio sam sam, a ostalo od vrhunskih slastičara širom Evrope.',
        'Najviše dugujem Damiru Rožajcu. On me stvorio i oblikovao u ovom poslu i zauvijek ću mu ostati zahvalan.',
        'Iz rodnog Doboja u Mostar me dovelo prijateljstvo, a zadržali su me ljudi. Moj teren je moderno slastičarstvo: restoranski deserti, neobični spojevi okusa i torte koje se pamte.'
      ],
      en: [
        'My story began in Zagreb, at a course I attended more as an observer than a student. Half of what I know I taught myself. The rest I learned from outstanding pastry chefs across Europe.',
        'I owe the most to Damir Rožajac. He shaped me in this craft, and I will always be grateful to him.',
        'Friendship brought me from my hometown of Doboj to Mostar, and its people made me stay. My field is modern pastry: restaurant desserts, unexpected flavour pairings and cakes people remember.'
      ],
      de: [
        'Meine Geschichte begann in Zagreb, bei einem Kurs, den ich eher als Zuschauer besuchte. Die Hälfte meines Wissens habe ich mir selbst beigebracht, den Rest bei herausragenden Konditoren in ganz Europa.',
        'Am meisten verdanke ich Damir Rožajac. Er hat mich in diesem Handwerk geformt, und ich werde ihm immer dankbar sein.',
        'Freundschaft brachte mich aus meiner Heimatstadt Doboj nach Mostar, die Menschen hier ließen mich bleiben. Mein Gebiet ist die moderne Patisserie: Restaurantdesserts, ungewöhnliche Aromen und Torten, die man nicht vergisst.'
      ]
    },
    quote: { bs: 'Ja nisam kopir aparat.', en: 'I am not a copy machine.', de: 'Ich bin kein Kopiergerät.' },
    quoteNote: {
      bs: 'Svaki detalj nosi moj pečat. Najdraže mi je kad mi kažete: uradi onako kako ti misliš da treba.',
      en: 'Every detail carries my signature. I love it most when you tell me: do it the way you think it should be.',
      de: 'Jedes Detail trägt meine Handschrift. Am liebsten höre ich: Mach es so, wie du es für richtig hältst.'
    },
    images: [
      { id: 'stepenice', alt: { bs: 'Nemanja Petrović na stepeništu, u kuharskoj jakni i kapi', en: 'Nemanja Petrović on a staircase in chef whites and toque', de: 'Nemanja Petrović auf einer Treppe in Kochjacke und Kochmütze' } },
      { id: 'portret-crna', alt: { bs: 'Nemanja Petrović u crnoj kuharskoj jakni', en: 'Nemanja Petrović in a black chef jacket', de: 'Nemanja Petrović in schwarzer Kochjacke' } }
    ]
  },

  /* --- 02 Potpisni radovi (image: null = tipografska kartica; kad stigne fotografija upisati id) --- */
  works: {
    chapter: { bs: '02 · Potpisni radovi', en: '02 · Signature', de: '02 · Signatur' },
    title: { bs: 'Recepti koji nose moj *potpis*.', en: 'Recipes that carry my *signature*.', de: 'Rezepte mit meiner *Handschrift*.' },
    items: [
      {
        name: { bs: 'Grešna torta', en: 'The Sinful Cake', de: 'Die Sündige Torte' },
        notes: { bs: 'Nutella · jagode', en: 'Nutella · strawberries', de: 'Nutella · Erdbeeren' },
        text: { bs: 'Prva receptura. Sve je počelo njom.', en: 'My first recipe. It all began with it.', de: 'Mein erstes Rezept. Mit ihm fing alles an.' },
        aside: { bs: 'Zašto se zove tako, ostaje tajna.', en: 'Why it bears this name remains a secret.', de: 'Warum sie so heißt, bleibt ein Geheimnis.' },
        image: null
      },
      {
        name: { bs: 'Krema od piva', en: 'Beer Cream', de: 'Biercreme' },
        notes: { bs: 'pivo · dinstana mandarina', en: 'beer · braised mandarin', de: 'Bier · geschmorte Mandarine' },
        text: { bs: 'Bronca na Braču, među 500 takmičara.', en: 'Bronze on Brač, among 500 competitors.', de: 'Bronze auf Brač, unter 500 Teilnehmern.' },
        aside: { bs: 'Spoj nespojivog.', en: 'A pairing that should not work, yet does.', de: 'Die Verbindung des Unvereinbaren.' },
        image: null
      },
      {
        name: { bs: 'Panakota s lavandom', en: 'Lavender Panna Cotta', de: 'Lavendel Panna Cotta' },
        notes: { bs: 'lavanda · divlje trešnje', en: 'lavender · wild cherries', de: 'Lavendel · Wildkirschen' },
        text: { bs: 'Cvjetna, nježna i tiha.', en: 'Floral, delicate and quiet.', de: 'Blumig, zart und leise.' },
        aside: { bs: 'Desert koji se pamti po mirisu.', en: 'A dessert remembered by its scent.', de: 'Ein Dessert, das man am Duft erkennt.' },
        image: null
      },
      {
        name: { bs: 'Bijelo vino i maline', en: 'White Wine and Raspberries', de: 'Weißwein und Himbeeren' },
        notes: { bs: 'krema · bijelo vino · maline', en: 'cream · white wine · raspberries', de: 'Creme · Weißwein · Himbeeren' },
        text: { bs: 'Zvuči odvažno, a jede se lako.', en: 'It sounds daring and tastes effortless.', de: 'Klingt gewagt, schmeckt mühelos.' },
        aside: { bs: 'Neobični spojevi su moj potpis.', en: 'Unexpected pairings are my signature.', de: 'Ungewöhnliche Kombinationen sind meine Handschrift.' },
        image: null
      }
    ]
  },

  /* --- 03 Jedanaest spratova --- */
  tiers: {
    chapter: { bs: '03 · Najveći izazov', en: '03 · The Greatest Challenge', de: '03 · Die größte Herausforderung' },
    title: { bs: 'Jedanaest *spratova*.', en: 'Eleven *tiers*.', de: 'Elf *Etagen*.' },
    steps: [
      { bs: 'Mladenci su rekli samo jedno: neka bude što veća.', en: 'The couple asked for just one thing: make it as tall as possible.', de: 'Das Brautpaar hatte nur einen Wunsch: so groß wie möglich.' },
      { bs: 'Ostalo su prepustili meni.', en: 'Everything else, they left to me.', de: 'Alles andere überließen sie mir.' },
      { bs: 'Jedanaest spratova. Pet dana i jedna noć.', en: 'Eleven tiers. Five days and one night.', de: 'Elf Etagen. Fünf Tage und eine Nacht.' }
    ],
    unit: { bs: 'spratova', en: 'tiers', de: 'Etagen' },
    final: { bs: '5 dana i 1 noć', en: '5 days and 1 night', de: '5 Tage und 1 Nacht' },
    caption: { bs: 'Moj najveći izazov i ponos.', en: 'My greatest challenge and pride.', de: 'Meine größte Herausforderung und mein Stolz.' },
    image: { id: 'sprat11-b', alt: { bs: 'Bijela svadbena torta na jedanaest spratova, u vrtu', en: 'White eleven-tier wedding cake in a garden', de: 'Weiße elfstöckige Hochzeitstorte im Garten' } },
    detail: { id: 'sprat11-on', alt: { bs: 'Nemanja Petrović pored torte na jedanaest spratova', en: 'Nemanja Petrović beside the eleven-tier cake', de: 'Nemanja Petrović neben der elfstöckigen Torte' } }
  },

  /* --- 04 Svadbe --- */
  weddings: {
    chapter: { bs: '04 · Svadbe', en: '04 · Weddings', de: '04 · Hochzeiten' },
    title: { bs: 'Trenutak koji *pamtite*.', en: 'A moment you *remember*.', de: 'Ein Moment, der *bleibt*.' },
    text: {
      bs: 'Na svadbi torta nije samo desert. Ona je trenutak večeri: dekoracija uživo pred mladencima, srce od malina i kiša šećera koju gosti pamte godinama.',
      en: 'At a wedding, the cake is more than dessert. It is a moment of the evening: decorated live before the couple, a heart of raspberries and a shower of sugar guests remember for years.',
      de: 'Auf einer Hochzeit ist die Torte mehr als ein Dessert. Sie ist ein Moment des Abends: live vor dem Brautpaar dekoriert, ein Herz aus Himbeeren und ein Puderzuckerregen, an den sich die Gäste noch Jahre erinnern.'
    },
    gallery: [
      { id: 'secer', cap: { bs: 'Kiša šećera · Ljetnikovac Radobolja, Mostar', en: 'A shower of sugar · Ljetnikovac Radobolja, Mostar', de: 'Puderzuckerregen · Ljetnikovac Radobolja, Mostar' }, alt: { bs: 'Nemanja posipa šećer u prahu preko torte u obliku srca pred mladom', en: 'Nemanja dusting powdered sugar over a heart-shaped cake before the bride', de: 'Nemanja bestäubt eine herzförmige Torte vor der Braut mit Puderzucker' } },
      { id: 'capljina', cap: { bs: 'Torta duga jedan metar · Hotel President, Čapljina', en: 'A one-metre cake · Hotel President, Čapljina', de: 'Eine Torte von einem Meter · Hotel President, Čapljina' }, alt: { bs: 'Nemanja dekoriše svadbenu tortu kalama i grožđem pred gostima', en: 'Nemanja decorating a wedding cake with calla lilies and grapes in front of guests', de: 'Nemanja dekoriert eine Hochzeitstorte mit Calla und Trauben vor den Gästen' } },
      { id: 'sprat11-palme', cap: { bs: 'Jedanaest spratova', en: 'Eleven tiers', de: 'Elf Etagen' }, alt: { bs: 'Torta na jedanaest spratova među palmama', en: 'Eleven-tier cake among palm trees', de: 'Elfstöckige Torte zwischen Palmen' } },
      { id: 'mladenci', cap: { bs: 'Za mladence koji vole fudbal', en: 'For a couple who love football', de: 'Für ein fußballbegeistertes Brautpaar' }, alt: { bs: 'Svadbena torta sa figurama mladenaca i loptom', en: 'Wedding cake with figures of the couple and a football', de: 'Hochzeitstorte mit Brautpaarfiguren und Fußball' } }
    ]
  },

  /* --- 05 Fondan --- */
  fondant: {
    chapter: { bs: '05 · Fondan', en: '05 · Fondant', de: '05 · Fondant' },
    title: { bs: 'Skulpture koje se *jedu*.', en: 'Sculptures you can *eat*.', de: 'Skulpturen zum *Essen*.' },
    lead: {
      bs: 'Šećerna pasta u mojim rukama postaje lik, priča i uspomena. Svaka figura je urađena ručno.',
      en: 'In my hands, sugar paste becomes a character, a story and a memory. Every figure is made by hand.',
      de: 'In meinen Händen wird Zuckermasse zu Figur, Geschichte und Erinnerung. Jede Figur ist Handarbeit.'
    },
    filters: [
      { key: 'all', label: { bs: 'Sve', en: 'All', de: 'Alle' } },
      { key: 'kids', label: { bs: 'Dječije', en: 'Children', de: 'Kinder' } },
      { key: 'occasion', label: { bs: 'Prigodne', en: 'Occasions', de: 'Anlässe' } },
      { key: 'aldi', label: { bs: 'Aldi', en: 'Aldi', de: 'Aldi' } }
    ],
    items: [
      { id: 'balon-zlato', tags: ['kids'], cap: { bs: 'Zlatni balon', en: 'The golden balloon', de: 'Der goldene Ballon' } },
      { id: 'aldi-maketa', tags: ['aldi'], cap: { bs: 'Priča Aldi grupe · maketna torta', en: 'The Aldi story · showpiece cake', de: 'Die Aldi Geschichte · Schautorte' } },
      { id: 'leptiri', tags: ['kids'], cap: { bs: 'Leptiri za šesti rođendan', en: 'Butterflies for a sixth birthday', de: 'Schmetterlinge zum sechsten Geburtstag' } },
      { id: 'crno-zlato', tags: ['occasion'], cap: { bs: 'Crno i zlato', en: 'Black and gold', de: 'Schwarz und Gold' } },
      { id: 'dzungla', tags: ['kids'], cap: { bs: 'Džungla', en: 'The jungle', de: 'Der Dschungel' } },
      { id: 'bozic', tags: ['kids', 'occasion'], cap: { bs: 'Božić za Petra', en: 'Christmas for Petar', de: 'Weihnachten für Petar' } },
      { id: 'balon-roze', tags: ['kids'], cap: { bs: 'Rođendan na balonu', en: 'A birthday balloon', de: 'Geburtstag im Ballon' } },
      { id: 'olimpijska', tags: ['occasion'], cap: { bs: 'Olimpijski san', en: 'An Olympic dream', de: 'Ein olympischer Traum' } },
      { id: 'aldi-konj', tags: ['aldi'], cap: { bs: 'Aldi · vrtuljak', en: 'Aldi · carousel', de: 'Aldi · Karussell' } }
    ],
    alt: { bs: 'Torta od fondana: ', en: 'Fondant cake: ', de: 'Fondanttorte: ' }
  },

  /* --- 06 Nagrade --- */
  awards: {
    chapter: { bs: '06 · Nagrade', en: '06 · Awards', de: '06 · Auszeichnungen' },
    title: { bs: 'Medalje koje *govore*.', en: 'Medals that *speak*.', de: 'Medaillen, die *sprechen*.' },
    diploma: { bs: 'Diploma', en: 'Diploma', de: 'Urkunde' },
    items: [
      { year: 2022, medal: 'gold', count: 1,
        name: { bs: 'Zlato', en: 'Gold', de: 'Gold' },
        event: { bs: 'Gastro festival', en: 'Gastro festival', de: 'Gastro-Festival' },
        city: { bs: 'Niš', en: 'Niš', de: 'Niš' },
        cat: { bs: 'Restoranski desert', en: 'Restaurant dessert', de: 'Restaurantdessert' },
        image: { id: 'diploma-nis', alt: { bs: 'Diploma sa gastro festivala u Nišu i zlatna medalja', en: 'Diploma from the gastro festival in Niš and the gold medal', de: 'Urkunde vom Gastro-Festival in Niš und die Goldmedaille' } } },
      { year: 2023, medal: 'silver', count: 1,
        name: { bs: 'Srebro', en: 'Silver', de: 'Silber' },
        event: { bs: 'Prvenstvo Crne Gore', en: 'Montenegro Championship', de: 'Meisterschaft von Montenegro' },
        city: { bs: 'Budva', en: 'Budva', de: 'Budva' },
        cat: { bs: 'Udruženje šefova kuhinja', en: 'Association of Chefs', de: 'Verband der Küchenchefs' },
        image: { id: 'diploma-budva', alt: { bs: 'Diploma sa Prvenstva Crne Gore u Budvi', en: 'Diploma from the Montenegro Championship in Budva', de: 'Urkunde der Meisterschaft von Montenegro in Budva' } } },
      { year: 2023, medal: 'bronze', count: 1,
        name: { bs: 'Bronca', en: 'Bronze', de: 'Bronze' },
        event: { bs: 'Evropsko takmičenje Bisermora', en: 'Bisermora European competition', de: 'Europäischer Wettbewerb Bisermora' },
        city: { bs: 'Brač', en: 'Brač', de: 'Brač' },
        cat: { bs: 'Desert · krema od piva i mandarina', en: 'Dessert · beer cream and mandarin', de: 'Dessert · Biercreme und Mandarine' },
        image: { id: 'diploma-brac', alt: { bs: 'Diploma i bronzana medalja sa takmičenja na Braču', en: 'Diploma and bronze medal from the competition on Brač', de: 'Urkunde und Bronzemedaille vom Wettbewerb auf Brač' } } },
      { year: 2024, medal: 'gold', count: 2,
        name: { bs: '2× Zlato', en: '2× Gold', de: '2× Gold' },
        event: { bs: 'Detalji uskoro', en: 'Details coming soon', de: 'Details folgen' },
        city: null, cat: null, image: null }
    ]
  },

  /* --- 07 Akademija --- */
  academy: {
    chapter: { bs: '07 · Akademija', en: '07 · Academy', de: '07 · Akademie' },
    title: { bs: 'Znanje se *dijeli*.', en: 'Knowledge is meant to be *shared*.', de: 'Wissen will *geteilt* werden.' },
    text: {
      bs: [
        'U Akademiji slastičarstva Mostar prenosim ono što sam godinama učio. Prvo dvodnevno predavanje te vrste u Mostaru održao sam 2024. godine.',
        'Povodom 15 godina rada, u hotelu Bristol održao sam masterclass restoranskih deserata za do 100 slastičara i chefova, uz certifikat za svakog učesnika.'
      ],
      en: [
        'At the Mostar Pastry Academy I pass on what I have spent years learning. In 2024 I held the first two-day course of its kind in Mostar.',
        'To mark 15 years in the craft, I led a restaurant dessert masterclass at Hotel Bristol for up to 100 pastry chefs and cooks, with a certificate for every participant.'
      ],
      de: [
        'In der Konditorei-Akademie Mostar gebe ich weiter, was ich über Jahre gelernt habe. 2024 hielt ich den ersten zweitägigen Kurs dieser Art in Mostar.',
        'Zu 15 Jahren im Handwerk leitete ich im Hotel Bristol eine Masterclass für Restaurantdesserts für bis zu 100 Konditoren und Köche, mit Zertifikat für alle Teilnehmenden.'
      ]
    },
    facts: [
      { bs: 'Moderne tehnike', en: 'Modern techniques', de: 'Moderne Techniken' },
      { bs: 'Teksture', en: 'Textures', de: 'Texturen' },
      { bs: 'Neobični spojevi okusa', en: 'Unexpected flavour pairings', de: 'Ungewöhnliche Aromen' }
    ],
    event: {
      bs: 'Masterclass restoranskih deserata · Hotel Bristol, Mostar · 11. 10. 2026.',
      en: 'Restaurant dessert masterclass · Hotel Bristol, Mostar · 11 October 2026',
      de: 'Masterclass Restaurantdesserts · Hotel Bristol, Mostar · 11. Oktober 2026'
    },
    next: { bs: 'Sljedeći termin uskoro.', en: 'Next date coming soon.', de: 'Der nächste Termin folgt bald.' },
    cta: { bs: 'Prijavite interes', en: 'Register your interest', de: 'Interesse anmelden' },
    images: [
      { id: 'plating', alt: { bs: 'Nemanja slaže desert u restoranu', en: 'Nemanja plating a dessert in a restaurant', de: 'Nemanja richtet ein Dessert im Restaurant an' } },
      { id: 'kuhinja', alt: { bs: 'Nemanja u bijeloj kuharskoj jakni sa izvezenim imenom', en: 'Nemanja in a white chef jacket embroidered with his name', de: 'Nemanja in weißer Kochjacke mit gesticktem Namen' } }
    ]
  },

  /* --- 08 Slatke priče --- */
  show: {
    chapter: { bs: '08 · Slatke priče', en: '08 · Sweet Stories', de: '08 · Süße Geschichten' },
    title: { bs: 'Slatke *priče*', en: 'Sweet *Stories*', de: 'Süße *Geschichten*' },
    meta: { bs: '30 emisija · 30 recepata · YouTube', en: '30 episodes · 30 recipes · YouTube', de: '30 Folgen · 30 Rezepte · YouTube' },
    text: {
      bs: 'Recepti iz moje kuhinje, korak po korak. Uskoro i kao knjiga.',
      en: 'Recipes from my kitchen, step by step. Soon as a book, too.',
      de: 'Rezepte aus meiner Küche, Schritt für Schritt. Bald auch als Buch.'
    },
    cta: { bs: 'Gledaj na YouTubeu', en: 'Watch on YouTube', de: 'Auf YouTube ansehen' }
  },

  /* --- 09 Šire od kuhinje --- */
  beyond: {
    chapter: { bs: '09 · Šire od kuhinje', en: '09 · Beyond the Kitchen', de: '09 · Über die Küche hinaus' },
    title: { bs: 'Više od *deserta*.', en: 'More than *dessert*.', de: 'Mehr als *Dessert*.' },
    cols: [
      {
        title: { bs: 'Kuća nade', en: 'House of Hope', de: 'Haus der Hoffnung' },
        year: '2026',
        text: {
          bs: 'Za onkološke pacijente SKB Mostar pripremio sam slastice na druženju Zaklade Svjetlo nade. Mali slatki trenutak za one kojima je najpotrebniji.',
          en: 'I prepared sweets for oncology patients at the University Clinical Hospital Mostar, at a gathering of the Svjetlo nade foundation. A small sweet moment for those who need it most.',
          de: 'Für onkologische Patienten des Universitätsklinikums Mostar bereitete ich Süßes beim Treffen der Stiftung Svjetlo nade zu. Ein kleiner süßer Moment für die, die ihn am meisten brauchen.'
        }
      },
      {
        title: { bs: 'Aldi grupa', en: 'Aldi Group', de: 'Aldi Gruppe' },
        year: 'Mostar',
        text: {
          bs: 'Pastry chef u Aldi grupi. Mostar ima najbolju slastičarnicu u BiH, a ja sam njen dio.',
          en: 'Pastry chef at the Aldi Group. Mostar has the best pastry shop in Bosnia and Herzegovina, and I am part of it.',
          de: 'Pastry Chef der Aldi Gruppe. Mostar hat die beste Konditorei in Bosnien und Herzegowina, und ich bin ein Teil davon.'
        }
      }
    ],
    press: {
      title: { bs: 'Pisali su', en: 'In the press', de: 'In der Presse' },
      items: [
        { name: 'Hercegovina.info', url: 'https://www.hercegovina.info/hercegovina/najbolji-mladi-bh-slasticar-se-doselio-u-mostar-a-zahtjev-lokalnih-mladenaca-lansirao-ga-medju-slatke-zvijezde/223291/' },
        { name: 'Hercegovina.in', url: 'https://hercegovina.in/slasticarski-spektakl-stize-u-mostar-nemanja-petrovic-okuplja-slasticare-i-chefove-iz-regije/' },
        { name: 'Posušje.info', url: 'https://www.posusje.info/na-odjelu-onkologije-skb-a-mostar-odrzano-druzenje-s-pacijentima-u-sklopu-projekta-kuca-nade/' },
        { name: 'Večernje novosti', url: 'https://vecernjenovosti.ba/90523/vijesti/odrzano-gastro-vece-slatkih-delicija-dobojlijama-predstavljene-kuglice-sa-lavandom-panakote-sa-prelivom-od-divljih-tresanja/' }
      ]
    }
  },

  /* --- 10 Kontakt --- */
  contactSec: {
    chapter: { bs: '10 · Kontakt', en: '10 · Contact', de: '10 · Kontakt' },
    title: { bs: 'Za svadbe, saradnju, akademiju ili *razgovor*.', en: 'For weddings, collaborations, the academy or a *conversation*.', de: 'Für Hochzeiten, Kooperationen, die Akademie oder ein *Gespräch*.' },
    note: { bs: 'Odgovaram lično.', en: 'I reply personally.', de: 'Ich antworte persönlich.' },
    topicLabel: { bs: 'Tema', en: 'Topic', de: 'Thema' },
    topics: [
      { key: 'wedding', label: { bs: 'Svadba', en: 'Wedding', de: 'Hochzeit' } },
      { key: 'collab', label: { bs: 'Saradnja', en: 'Collaboration', de: 'Kooperation' } },
      { key: 'academy', label: { bs: 'Akademija', en: 'Academy', de: 'Akademie' } },
      { key: 'media', label: { bs: 'Mediji', en: 'Media', de: 'Medien' } },
      { key: 'other', label: { bs: 'Ostalo', en: 'Other', de: 'Sonstiges' } }
    ],
    name: { bs: 'Ime i prezime', en: 'Full name', de: 'Vor- und Nachname' },
    date: { bs: 'Datum svadbe', en: 'Wedding date', de: 'Hochzeitsdatum' },
    message: { bs: 'Poruka', en: 'Message', de: 'Nachricht' },
    send: { bs: 'Pošalji preko', en: 'Send via', de: 'Senden über' },
    needName: { bs: 'Upišite ime', en: 'Add your name', de: 'Namen eingeben' },
    needMsg: { bs: 'Napišite poruku', en: 'Write a message', de: 'Nachricht schreiben' },
    ready: { bs: 'Spremno. Poruka se otvara u aplikaciji.', en: 'Ready. The message opens in the app.', de: 'Bereit. Die Nachricht öffnet sich in der App.' },
    msg: {
      hello: { bs: 'Pozdrav Nemanja, pišem u vezi: {t}.', en: 'Hello Nemanja, I am writing about: {t}.', de: 'Hallo Nemanja, ich schreibe wegen: {t}.' },
      date: { bs: 'Datum: {d}.', en: 'Date: {d}.', de: 'Datum: {d}.' },
      name: { bs: 'Ime: {n}.', en: 'Name: {n}.', de: 'Name: {n}.' },
      subject: { bs: 'Upit sa stranice: {t}', en: 'Website enquiry: {t}', de: 'Anfrage über die Website: {t}' }
    },
    direct: { bs: 'Direktno', en: 'Direct', de: 'Direkt' },
    phone: { bs: 'Telefon', en: 'Phone', de: 'Telefon' },
    where: { bs: 'Aldi · Mostar', en: 'Aldi · Mostar', de: 'Aldi · Mostar' },
    whereNote: { bs: 'Otvori na mapi', en: 'Open on the map', de: 'Auf der Karte öffnen' },
    image: { id: 'portret-crna', alt: { bs: 'Nemanja Petrović', en: 'Nemanja Petrović', de: 'Nemanja Petrović' } }
  },

  footer: {
    line: { bs: 'Nemanja Petrović · Pastry Chef · Mostar', en: 'Nemanja Petrović · Pastry Chef · Mostar', de: 'Nemanja Petrović · Pastry Chef · Mostar' },
    copy: { bs: '© 2026 Nemanja Petrović', en: '© 2026 Nemanja Petrović', de: '© 2026 Nemanja Petrović' },
    top: { bs: 'Na vrh', en: 'Back to top', de: 'Nach oben' }
  },

  /* naslov i opis stranice po jeziku */
  seo: {
    title: { bs: 'Nemanja Petrović · Pastry Chef · Mostar', en: 'Nemanja Petrović · Pastry Chef · Mostar', de: 'Nemanja Petrović · Pastry Chef · Mostar' },
    desc: {
      bs: 'Nemanja Petrović, pastry chef iz Mostara. 15 godina zanata, medalje iz Niša, Budve i Brača, svadbene torte i Akademija slastičarstva.',
      en: 'Nemanja Petrović, pastry chef in Mostar. 15 years of craft, medals from Niš, Budva and Brač, wedding cakes and a pastry academy.',
      de: 'Nemanja Petrović, Pastry Chef in Mostar. 15 Jahre Handwerk, Medaillen aus Niš, Budva und Brač, Hochzeitstorten und eine Konditorei-Akademie.'
    }
  }
};
