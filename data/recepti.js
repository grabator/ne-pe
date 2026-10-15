/* Recepti sa Nemanjinog Instagrama (@nemanja_petr).
   Količina i naziv su odvojeni: ['250 g', 'mljevenog keksa'].
   Riječ između zvjezdica (*torta*) ispisuje se zlatnim kurzivom.
   Naslovi rukopisom (script) imaju č, ć, š, ž, ali ne i đ.
   layers: slojevi torte odozgo prema dolje za crtež presjeka; name je oznaka pored crteža (nije obavezna). */
window.NP_REC = {
  page: {
    label: 'Iz Nemanjine kuhinje',
    title: 'Iz moje kuhinje *u vašu*',
    lead: 'Provjereni recepti sa mog Instagrama, napisani korak po korak, da uspiju i vama. Označite sastojke koje imate i korake koje ste završili, stranica to pamti.',
    back: 'Početna',
    print: 'Štampaj recept',
    share: 'Podijeli',
    copied: 'Link je kopiran',
    ingredients: 'Sastojci',
    steps: 'Priprema',
    reset: 'Očisti oznake',
    done: 'gotovo',
    of: 'od',
    stepsShort: 'koraka',
    ingCount: 'sastojaka',
    read: 'Pogledaj recept',
    readArticle: 'Pročitaj',
    more: 'Još recepata stiže uskoro. Pratite ih na Instagramu:',
    themeLight: 'Svijetla tema',
    themeDark: 'Tamna tema'
  },

  recipes: [
    {
      id: 'luda-torta',
      script: 'Luda torta!',
      title: 'Luda *torta*',
      date: '8. august',
      intro: 'Posna poslastica za kojom su svi poludili. Bez mlijeka i jaja, gotova za čas. Ukusna, mekana i sočna.',
      chips: ['Posno', 'Bez mlijeka i jaja', 'Bez pečenja', 'Obruč 26 cm', 'Najbolja preko noći'],
      layers: [
        { name: 'Dekoracija po želji', color: '#D9B77A', h: 6, deco: 'dots' },
        { name: 'Krema s tamnom čokoladom', color: '#4B2E1E', h: 22 },
        { name: 'Keks u komadima', color: '#C8945A', h: 10, deco: 'bits' },
        { name: 'Krema s bijelom čokoladom', color: '#F1E6D0', h: 24 },
        { name: 'Podloga: keks i prženi lješnjak', color: '#8B5A33', h: 14 }
      ],
      groups: [
        {
          name: 'Donji sloj',
          items: [
            ['250 g', 'mljevenog keksa'],
            ['100 g', 'mljevenih prženih lješnjaka'],
            ['100 g', 'otopljenog margarina'],
            ['100 g', 'šećera u prahu'],
            ['200 ml', 'soka od narandže, sojinog ili bademovog mlijeka, Coca-Cole ili čaja']
          ]
        },
        {
          name: 'Krema I i II',
          items: [
            ['1 l', 'sojinog mlijeka'],
            ['160 g', 'pudinga od vanilije'],
            ['6 kašika', 'šećera'],
            ['200 ml', 'vode'],
            ['150 g', 'margarina'],
            ['100 g', 'šećera u prahu'],
            ['1 kesica', 'šlaga (55 g)'],
            ['50–60 ml', 'hladne mineralne ili obične vode'],
            ['200 g', 'bijele čokolade'],
            ['100 g', 'tamne čokolade'],
            ['150 g', 'keksa u komadima'],
            ['', 'dekoracija po želji']
          ]
        }
      ],
      steps: [
        'U šerpu sipajte sojino mlijeko i stavite da prokuha.',
        'U posebnoj posudi umutite puding, šećer i vodu.',
        'Kada mlijeko prokuha, dodajte smjesu s pudingom i kuhajte uz stalno miješanje dok se ne zgusne.',
        'Skinite puding sa šporeta, prekrijte prozirnom folijom i ostavite da se potpuno ohladi.',
        'Za podlogu pomiješajte mljeveni keks, mljevene pržene lješnjake, šećer u prahu, otopljeni margarin i sok od narandže (ili napitak po želji). Miješajte dok ne dobijete kompaktnu smjesu.',
        'Obruč promjera 26 cm stavite na tacnu, rasporedite podlogu i dobro je poravnajte. Ostavite u frižideru dok pripremate kremu.',
        'Kada se puding ohladi, otopite bijelu i tamnu čokoladu.',
        'Umutite margarin sa šećerom u prahu, pa postepeno dodajte ohlađeni puding. Mutite dok ne dobijete glatku kremu.',
        'Posebno umutite šlag s hladnom vodom, zatim ga lagano umiješajte u kremu.',
        'Kremu podijelite na dva jednaka dijela. U jedan dodajte otopljenu bijelu čokoladu, a u drugi otopljenu tamnu čokoladu.',
        'Na podlogu rasporedite kremu s bijelom čokoladom.',
        'Preko kreme posložite komade keksa.',
        'Zatim rasporedite kremu s tamnom čokoladom i poravnajte površinu.',
        'Tortu ukrasite po želji i ostavite u frižideru nekoliko sati, a najbolje preko noći, da se dobro stegne prije posluživanja.'
      ],
      tips: [
        {
          script: 'Mali trik',
          text: 'Ako imate vremena, ostavite tortu preko noći u frižideru. Tada se svi slojevi lijepo povežu, keks omekša, a ukus postane još bogatiji. Ako vam se žuri, keks možete kratko umočiti u sok ili biljno mlijeko. Ipak, nije obavezno, krem će ga sam dovoljno omekšati.'
        }
      ]
    },

    {
      id: 'dobos-torta',
      script: 'Doboš torta',
      title: 'Doboš *torta*',
      date: '3. april',
      intro: 'Recept za čuvenu Doboš tortu vam ostavljam, čekajući vaše komentare!',
      chips: ['6 listova biskvita', 'Krema na pari', 'Karamel na vrhu', '16 komada'],
      fact: {
        script: 'Zanimljivosti',
        text: 'Doboš znači bubanj. Ova torta ne proizvodi nikakve zvukove, već samo izgledom podsjeća na muzički instrument! Gradi se od čak šest slojeva biskvita, a površina s narezanim trokutima čini je iznimno privlačnom. Hajde da je zajedno napravimo.'
      },
      layers: [
        { name: 'Šesti list u karamelu, 16 trokuta', color: '#B8742C', h: 9, deco: 'fans' },
        { color: '#E8C27E', h: 8 },
        { color: '#5A3522', h: 5 },
        { name: 'Pet listova biskvita', color: '#E8C27E', h: 8 },
        { color: '#5A3522', h: 5 },
        { color: '#E8C27E', h: 8 },
        { name: 'Čokoladna krema između listova i po stranicama', color: '#5A3522', h: 5 },
        { color: '#E8C27E', h: 8 },
        { color: '#5A3522', h: 5 },
        { color: '#E8C27E', h: 8 }
      ],
      groups: [
        {
          name: 'Biskvit',
          items: [
            ['6', 'jaja'],
            ['180 g', 'šećera'],
            ['180 g', 'pšeničnog oštrog brašna'],
            ['', 'limunova korica']
          ]
        },
        {
          name: 'Krema',
          items: [
            ['4', 'jaja'],
            ['250 g', 'šećera'],
            ['1', 'vanilin šećer'],
            ['100 g', 'čokolade'],
            ['250 g', 'maslaca']
          ]
        },
        {
          name: 'Preljev',
          items: [
            ['200 g', 'šećera'],
            ['20 g', 'maslaca'],
            ['2 žlice', 'limunovog soka']
          ]
        }
      ],
      steps: [
        'Žumanca i šećer pjenasto izmiješajte i dodajte naribanu limunovu koricu. Bjelanjke umutite u čvrst snijeg i naizmjenično s brašnom umiješajte u žumanca.',
        'Od dobivene biskvitne smjese ispecite šest okruglih listova biskvita.',
        'Za kremu cijela jaja, šećer i rastopljenu čokoladu kuhajte na pari uz neprestano miješanje dok se smjesa dobro ne poveže.',
        'Zatim je ohladite i umiješajte joj pjenasti maslac.',
        'Listove premažite kremom i stavljajte jedan na drugi. Istom kremom premažite i stranice torte.',
        'Karamel pripremite ovako: šećer stavite u tavu s debljim dnom i grijte na visokoj temperaturi dok ne poprimi svijetlosmeđu boju. Zatim ga skinite sa štednjaka, dodajte maslac i sok od limuna. Sve kuhajte dok se karamel ne rastopi.',
        'Zadnji, šesti list narežite na 16 jednakih dijelova, pa ih prelijte vrućim karamelom.'
      ],
      tips: [
        {
          script: 'Posluživanje',
          text: 'Tortu ukrasite listovima ohlađenog karamela. Biskvitne listove pecite na namašćenom i pobrašnjenom papiru. Papir stavite na okrenutu stranu lima i prije nego što izlijete biskvitnu smjesu, označite na njemu kružni oblik kalupa torte. Prijatno!'
        }
      ]
    }
  ],

  article: {
    id: 'cijena-torte',
    label: 'Iza kulisa',
    title: 'Šta zapravo određuje *cijenu* torte?',
    date: '27. septembar',
    intro: 'Često me pitate zašto dvije torte iste težine nemaju istu cijenu. Evo šta sve ulazi u jednu tortu.',
    points: [
      {
        title: 'Sastojci i kvalitet namirnica',
        text: 'U svakoj torti pažljivo biram čokoladu, puter, Nutellu, orahe, lješnjake, svježe voće, mlijeko i ostale sastojke koji imaju svoju cijenu. Ne biram jeftinije zamjene, jer kvalitetne namirnice ne samo da daju bolji ukus, već čine razliku u svakoj teksturi i detalju torte.'
      },
      {
        title: 'Veličina i težina torte',
        text: 'Broj komada, gramaža i količina materijala potrebnog za izradu utiču direktno na cijenu torte.'
      },
      {
        title: 'Dekoracija i ručni rad',
        text: 'Jednostavna dekoracija i torta sa mnogo detalja nisu isto. Fondan figurice, ručno izrađeni detalji, toperi, štampa, cvijeće i ostali elementi zahtijevaju dodatni materijal, preciznost i sate pažljivog rada. Svaki detalj izrađujem sa posebnom pažnjom kako bi torta bila lijepa, skladna i baš po vašoj volji.'
      },
      {
        title: 'Vrijeme, pažnja i iskustvo',
        text: 'Torta se peče, hladi, filuje, slaže, premazuje i ukrašava. Neke torte zahtijevaju sate rada, strpljenje i preciznost kako bi svaki sloj, detalj i završni element bili na svom mjestu. Iskustvo mi pomaže da spojim ukuse, teksture i dekoracije u tortu koja je istovremeno lijepa i ukusna.'
      }
    ],
    close: {
      title: 'Zato cijena torte nije samo „cijena torte”',
      text: 'U nju ulaze kvalitetni sastojci, materijal, dekoracija, vrijeme, ručni rad i iskustvo. Zato dvije torte iste težine mogu imati potpuno različitu cijenu.',
      quote: 'Iza svake moje torte stoji mnogo više od onoga što vidite na fotografiji: pažljivo birani sastojci, brojni sati rada i ljubav prema onome što stvaram.'
    }
  }
};
