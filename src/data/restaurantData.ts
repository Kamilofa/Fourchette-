export interface MenuItem {
  id: string;
  name: string;
  category: 'pizzas' | 'indien' | 'pates' | 'grillades' | 'boissons' | 'entrees';
  categoryLabel: string;
  price: number; // in FCFA
  description: string;
  tags: string[];
  popular?: boolean;
  imageFallback: string; // CSS gradient fallback
  imageSrc?: string; // Authentic image from user screenshots
  cropOrigin?: string; // CSS transform origin to zoom on the specific dish
  scale?: number;
  spicy?: boolean;
  vegetarian?: boolean;
  halal?: boolean;
  ingredients?: string[];
  options?: {
    name: string;
    choices: { label: string; extraPrice: number }[];
  }[];
}

export interface Review {
  id: string;
  author: string;
  role?: string;
  rating: number;
  date: string;
  comment: string;
  highlight: string;
  favoriteDish?: string;
}

export interface RestaurantService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge?: string;
  actionText: string;
  actionType: 'reserve' | 'order' | 'call' | 'private';
}

export const RESTAURANT_INFO = {
  name: "Restaurant 5 Fourchettes",
  tagline: "L'excellence gastronomique & la convivialité au cœur de Douala",
  city: "Douala, Cameroun",
  address: "Quartier chic d'Akwa / Bonanjo, Douala, Cameroun",
  phone: "6 55 44 14 14",
  phoneInternational: "+237 6 55 44 14 14",
  phoneDial: "+237655441414",
  whatsappNumber: "237655441414",
  momoNumber: "655441414", // 6 55 44 14 14
  momoName: "RESTAURANT 5 FOURCHETTES",
  website: "restau5fourchettes.com",
  rating: 4.1,
  reviewsCount: 868,
  priceRange: "8 000 - 16 000 FCFA",
  openingHours: {
    lunch: "11:30 - 15:00",
    dinner: "17:30 - 23:30",
    days: "Mardi au Dimanche (Fermé lundi matin)",
    sundayBrunch: "Dimanche : Brunch gourmand dès 11:00",
  },
  highlights: [
    "Excellents plats indiens aux saveurs variées",
    "Plats particulièrement copieux & généreux",
    "Pizzas artisanales XXL au four",
    "Accueil chaleureux & service rapide en salle",
    "Paiement Mobile Money direct au 6 55 44 14 14",
    "Terrasse extérieure & salle climatisée",
    "Options Halal, Végétarien & Menu Enfant",
    "Parking gratuit et surveillé"
  ]
};

export const SERVICES: RestaurantService[] = [
  {
    id: "table",
    title: "Repas sur Place",
    shortDesc: "Ambiance feutrée, salle climatisée et service aux petits soins.",
    fullDesc: "Installez-vous confortablement dans notre salle climatisée raffinée ou notre espace cosy. Mobilier soigné, chaises hautes pour enfants et accessibilité PMR complète pour un moment d'exception.",
    iconName: "Utensils",
    badge: "Cadre raffiné",
    actionText: "Réserver une table",
    actionType: "reserve"
  },
  {
    id: "terrasse",
    title: "Terrasse Panoramique",
    shortDesc: "Dégustez vos plats en plein air sous la brise douce de Douala.",
    fullDesc: "Notre terrasse aérée et arborée est l'endroit parfait pour décompresser après le travail, partager un cocktail signature ou profiter d'un dîner romantique à la belle étoile.",
    iconName: "Sun",
    badge: "Ambiance nocturne",
    actionText: "Réserver en terrasse",
    actionType: "reserve"
  },
  {
    id: "livraison",
    title: "Livraison Express Douala",
    shortDesc: "Vos plats chauds livrés rapidement à domicile ou au bureau.",
    fullDesc: "Livraison rapide et sécurisée dans tous les secteurs de Douala (Akwa, Bonanjo, Bonapriso, Deido, Denver, Bali, Makepe). Emballages isothermes maintenant la chaleur et la fraîcheur intactes.",
    iconName: "Bike",
    badge: "Rapide & Chaud",
    actionText: "Commander en livraison",
    actionType: "order"
  },
  {
    id: "drive",
    title: "Service Drive & À Emporter",
    shortDesc: "Commandez en ligne et récupérez votre sac sans attente.",
    fullDesc: "Pas le temps de vous attabler ? Passez commande en quelques clics avec règlement Mobile Money et récupérez votre repas tout chaud à notre guichet Drive ou vente à emporter avec parking réservé.",
    iconName: "Car",
    badge: "Zéro attente",
    actionText: "Passer commande Drive",
    actionType: "order"
  },
  {
    id: "prive",
    title: "Salle Privée & Événements",
    shortDesc: "Anniversaires, repas d'affaires, mariages et fêtes de famille.",
    fullDesc: "Privatisez notre espace VIP équipé. Nous proposons des menus sur mesure, une formule buffet à volonté pour les groupes, et un accueil personnalisé pour les anniversaires d'enfants avec menu enfant adapté.",
    iconName: "Users",
    badge: "Sur mesure",
    actionText: "Demander un devis VIP",
    actionType: "private"
  },
  {
    id: "bar",
    title: "Bar, Cocktails & Vins",
    shortDesc: "Limonade japonaise, bières fraîches, grands crus et thés d'Asie.",
    fullDesc: "Une carte des boissons incomparable : cocktails signatures mixés avec soin, sélection de vins et spiritueux internationaux, grands choix de bières fraîches, cafés de barista et authentique Chai indien aux épices.",
    iconName: "Wine",
    badge: "Carte d'exception",
    actionText: "Voir la carte du bar",
    actionType: "order"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Pizzas
  {
    id: "p-tikka",
    name: "Pizza Tikka",
    category: "pizzas",
    categoryLabel: "Pizzas Artisanales",
    price: 11500,
    description: "Sublime fusion : émincés de poulet mariné aux épices Tikka indiennes, champignons frais de Paris, mozzarella fondante et sauce tomate mijotée.",
    tags: ["Spécialité Maison", "Halal", "Best-Seller"],
    popular: true,
    spicy: true,
    halal: true,
    imageFallback: "from-amber-700/80 to-red-900/90",
    imageSrc: "/images/pizza_tikka_woodfired_1792926506777.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Pâte artisanale au levain cuite au four à bois", "Émincé de poulet mariné Tikka", "Champignons de Paris frais", "Mozzarella di latte fondante", "Sauce tomate maison aux herbes"],
    options: [
      {
        name: "Supplément Fromage",
        choices: [
          { label: "Standard", extraPrice: 0 },
          { label: "Double Mozzarella fondante", extraPrice: 1500 },
          { label: "Copeaux de Parmesan affiné", extraPrice: 2000 }
        ]
      },
      {
        name: "Piquant souhaité",
        choices: [
          { label: "Épicé modéré", extraPrice: 0 },
          { label: "Très épicé (Piment Douala)", extraPrice: 0 },
          { label: "Doux (Sans piment)", extraPrice: 0 }
        ]
      }
    ]
  },
  {
    id: "p-4fromages",
    name: "Pizza 4 Fromages",
    category: "pizzas",
    categoryLabel: "Pizzas Artisanales",
    price: 10500,
    description: "Accord parfait entre Gorgonzola crémeux, Mozzarella di bufala fondue, Emmental doux et copeaux de Parmesan vieilli sur pâte croustillante.",
    tags: ["Végétarien", "Gourmet"],
    popular: true,
    vegetarian: true,
    imageFallback: "from-yellow-700/80 to-amber-900/90",
    imageSrc: "/images/pizza_four_cheese_1792928197121.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Pâte fine croustillante", "Mozzarella di bufala", "Gorgonzola crémeux", "Emmental fondu", "Parmigiano Reggiano", "Origan frais"],
    options: [
      {
        name: "Base de la pizza",
        choices: [
          { label: "Base crème fraîche", extraPrice: 0 },
          { label: "Base sauce tomate mijotée", extraPrice: 0 }
        ]
      }
    ]
  },
  {
    id: "p-3viandes",
    name: "Pizza Aux 3 Viandes",
    category: "pizzas",
    categoryLabel: "Pizzas Artisanales",
    price: 12500,
    description: "Généreuse garniture de bœuf haché assaisonné maison, fines tranches de pepperoni, saucisse fumée, rondelles d'oignons doux et mozzarella.",
    tags: ["Très Copieux", "Viandes", "Gros Succès"],
    popular: true,
    imageFallback: "from-red-800/80 to-stone-900/90",
    imageSrc: "/images/pizza_meat_lovers_1792928277739.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Bœuf haché assaisonné pur cru", "Pepperoni fumé", "Saucisse grillée", "Oignons doux", "Coulis de tomate", "Mozzarella généreuse"],
    options: [
      {
        name: "Sauce d'accompagnement",
        choices: [
          { label: "Sauce pimentée maison", extraPrice: 0 },
          { label: "Sauce barbecue fumée", extraPrice: 0 },
          { label: "Huile pimentée aromatisée", extraPrice: 0 }
        ]
      }
    ]
  },
  {
    id: "p-vegetarienne",
    name: "Pizza Végétarienne",
    category: "pizzas",
    categoryLabel: "Pizzas Artisanales",
    price: 9000,
    description: "Légumes du marché grillés : poivrons tricolores croquants, champignons sautés, tomates cerises confites, basilic frais et olives noires.",
    tags: ["100% Végétarien", "Fraîcheur"],
    vegetarian: true,
    imageFallback: "from-emerald-800/80 to-stone-900/90",
    imageSrc: "/images/pizza_four_cheese_1792928197121.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Tomates confites", "Feuilles de basilic frais", "Champignons sautés", "Poivrons doux", "Olives noires kalamata", "Fromage fondu"]
  },

  // Plats Indiens & Spécialités
  {
    id: "ind-dej-chai",
    name: "Petit Déj Indien Avec Un Chai",
    category: "indien",
    categoryLabel: "Spécialités Indiennes",
    price: 6500,
    description: "Parathas traditionnels dorés au beurre ghee, raïta fraîche maison, achar pimenté authentique et tasse fumante de Chai aux épices douces.",
    tags: ["Authentique", "Spécialité Matin & Soir"],
    popular: true,
    spicy: false,
    vegetarian: true,
    imageFallback: "from-amber-600/80 to-orange-950/90",
    imageSrc: "/images/indian_chai_breakfast_1792926551291.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Parathas feuilletés dorés au beurre clarifié (ghee)", "Raïta crémeuse au concombre frais", "Pickles achar épicés authentiques", "Verre de thé Chai fumant aux épices (cardamome, cannelle)"],
    options: [
      {
        name: "Type de Paratha",
        choices: [
          { label: "Paratha nature au ghee", extraPrice: 0 },
          { label: "Aloo Paratha (farci pomme de terre)", extraPrice: 1000 },
          { label: "Paneer Paratha (farci fromage indien)", extraPrice: 1500 }
        ]
      }
    ]
  },
  {
    id: "ind-butter-chicken",
    name: "Poulet Tikka Masala & Riz Basmati",
    category: "indien",
    categoryLabel: "Spécialités Indiennes",
    price: 11000,
    description: "Dés de poulet mariné rôtis au tandoor puis mijotés dans une sauce onctueuse veloutée à la tomate, crème et épices indiennes aromatiques.",
    tags: ["Halal", "Coup de Cœur", "Copieux"],
    popular: true,
    spicy: true,
    halal: true,
    imageFallback: "from-orange-700/80 to-red-950/90",
    imageSrc: "/images/butter_chicken_curry_1792928170668.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Poulet fermier mariné 24h", "Sauce masala aux tomates et noix de cajou", "Riz basmati extra-long safrané", "Coriandre fraîche"]
  },
  {
    id: "ind-naan-fromage",
    name: "Cheese Naan Maison Cuit au Tandoor",
    category: "indien",
    categoryLabel: "Spécialités Indiennes",
    price: 3000,
    description: "Galette de blé levée traditionnelle, généreusement farcie de fromage fondant et cuite minute sur la paroi du four tandoori.",
    tags: ["Chaud Minute", "Végétarien"],
    vegetarian: true,
    imageFallback: "from-yellow-600/80 to-amber-950/90",
    imageSrc: "/images/tandoori_cheese_naan_1792928183639.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Farine blanche levée", "Fromage fondu cœur fondant", "Beurre ghee fondu au pinceau", "Graines de nigelle"]
  },
  {
    id: "ind-biryani-agneau",
    name: "Biryani Impérial à l'Agneau",
    category: "indien",
    categoryLabel: "Spécialités Indiennes",
    price: 13500,
    description: "Riz basmati extra-long parfumé au safran, morceaux d'agneau fondants marinés 24h, oignons caramélisés et amandes effilées dorées.",
    tags: ["Grand Classique", "Halal", "Très Copieux"],
    popular: true,
    halal: true,
    imageFallback: "from-amber-700/80 to-stone-900/90",
    imageSrc: "/images/royal_lamb_biryani_1792928210967.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Agneau tendre mijoté à l'étouffée", "Riz basmati royal", "Épices entières (cannelle, cardamome, girofle)", "Amandes et raisins dorés"]
  },

  // Pâtes Fraîches & Cuisine Italienne
  {
    id: "pat-alfredo",
    name: "Alfredo Poulet",
    category: "pates",
    categoryLabel: "Pâtes & Spécialités",
    price: 9000,
    description: "Tagliatelles fraîches enrobées d'une crème riche au beurre, parmesan Reggiano fondu, aiguillettes de poulet dorées et persil frais.",
    tags: ["Ultra Crémeux", "Plat Signature"],
    popular: true,
    imageFallback: "from-stone-600/80 to-stone-900/90",
    imageSrc: "/images/pasta_alfredo_poulet_1792926552156.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Tagliatelles fraîches al dente", "Crème double onctueuse au parmesan", "Aiguillettes de blanc de poulet rôties à l'huile d'olive", "Parmigiano Reggiano affiné", "Poivre noir concassé", "Persil plat ciselé"]
  },
  {
    id: "pat-carbonara",
    name: "Tagliatelles Carbonara",
    category: "pates",
    categoryLabel: "Pâtes & Spécialités",
    price: 8500,
    description: "La recette gourmande préparée à la commande : crème fraîche veloutée, lardons fumés croustillants, jaune d'œuf coulant et poivre noir concassé.",
    tags: ["Gourmandise", "Populaire"],
    popular: true,
    imageFallback: "from-yellow-800/80 to-stone-900/90",
    imageSrc: "/images/classic_carbonara_pasta_1792928265773.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Pâtes fraîches", "Lardons fumés dorés", "Crème onctueuse au parmesan", "Jaune d'œuf frais", "Poivre noir de Penja"]
  },
  {
    id: "pat-poulet-creme",
    name: "Poulet Crème Au Champignon",
    category: "pates",
    categoryLabel: "Pâtes & Spécialités",
    price: 9500,
    description: "Tendre suprême de poulet nappé d'une onctueuse réduction de crème aux champignons sautés à l'ail et persil, servi avec frites dorées ou riz.",
    tags: ["Favori des Clients", "Copieux"],
    popular: true,
    imageFallback: "from-amber-800/80 to-stone-900/90",
    imageSrc: "/images/creamy_mushroom_chicken_1792928303534.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Suprême de poulet fermier", "Champignons de Paris sautés à l'ail", "Crème fraîche épaisse", "Persillade fraîche"],
    options: [
      {
        name: "Accompagnement au choix",
        choices: [
          { label: "Frites maison dorées", extraPrice: 0 },
          { label: "Riz parfumé", extraPrice: 0 },
          { label: "Pâtes fraîches au beurre", extraPrice: 500 }
        ]
      }
    ]
  },

  // Grillades & Burgers
  {
    id: "grill-gambas",
    name: "Gambas Géantes Braisées au Feu de Bois",
    category: "grillades",
    categoryLabel: "Grillades & Burgers",
    price: 15500,
    description: "Grosses gambas tigrées marinées aux herbes et citron vert, braisées à cœur avec leur persillade et servies avec riz créole et sauce pimentée douce.",
    tags: ["Fruits de Mer", "Prestige", "Gros Succès"],
    popular: true,
    imageFallback: "from-red-700/80 to-amber-950/90",
    imageSrc: "/images/grilled_jumbo_prawns_1792926551270.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Grosses gambas tigrées braisées au feu de bois", "Beurre d'ail et herbes fraîches", "Quartiers de citron vert", "Riz safrané parfumé"]
  },
  {
    id: "grill-burger",
    name: "Hamburger Frites Gourmet",
    category: "grillades",
    categoryLabel: "Grillades & Burgers",
    price: 6500,
    description: "Steak pur bœuf épais grillé minute, fromage coulant généreux, rondelles de tomates fraîches, oignons croquants, salade et frites croustillantes.",
    tags: ["Fait Maison", "Classique"],
    popular: true,
    imageFallback: "from-amber-900/80 to-stone-900/90",
    imageSrc: "/images/gourmet_beef_burger_1792928225281.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Pain brioché maison toasté", "Steak haché de bœuf frais", "Fromage fondu", "Tomates fraîches & oignons", "Frites maison croustillantes"],
    options: [
      {
        name: "Cuisson du bœuf",
        choices: [
          { label: "À point", extraPrice: 0 },
          { label: "Bien cuit", extraPrice: 0 },
          { label: "Saignant", extraPrice: 0 }
        ]
      }
    ]
  },
  {
    id: "grill-wings",
    name: "Ailes de Poulet Pané Croustillantes",
    category: "grillades",
    categoryLabel: "Grillades & Burgers",
    price: 5500,
    description: "Ailerons marinés dans un savant mélange d'épices, panure dorée ultra croustillante, servis avec sauce cocktail et herbes fraîches.",
    tags: ["À Partager", "Croustillant"],
    popular: true,
    imageFallback: "from-yellow-700/80 to-red-950/90",
    imageSrc: "/images/crispy_chicken_wings_1792928290731.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Ailerons de poulet marinés", "Panure secrète croustillante", "Sauce dip piquante", "Persil ciselé"]
  },

  // Entrées & Salades
  {
    id: "ent-salade-verte",
    name: "Salade Verte Fraîcheur",
    category: "entrees",
    categoryLabel: "Entrées & Salades",
    price: 4500,
    description: "Mélange croquant de salades du jour, tomates fraîches de Douala, oignons rouges émincés, œuf dur et vinaigrette signature émulsionnée.",
    tags: ["Léger", "Végétarien"],
    vegetarian: true,
    imageFallback: "from-emerald-700/80 to-stone-900/90",
    imageSrc: "/images/fresh_garden_salad_1792928334139.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Laitue fraîche croquante", "Tomates mûres de saison", "Oignons rouges", "Œufs fermiers", "Sauce vinaigrette moutardée"]
  },
  {
    id: "ent-samoussas",
    name: "Assiette de Samoussas Indiens (4 pcs)",
    category: "entrees",
    categoryLabel: "Entrées & Salades",
    price: 4000,
    description: "Triangles feuilletés croustillants farcis aux légumes épicés ou à la viande de bœuf, servis avec chutney vert à la menthe fraîche.",
    tags: ["Entrée Indienne", "À Partager"],
    imageFallback: "from-amber-800/80 to-stone-900/90",
    imageSrc: "/images/crispy_samosas_platter_1792928239402.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Pâte brick croustillante", "Farce épicée bœuf & légumes", "Chutney menthe et coriandre"]
  },

  // Boissons & Cocktails
  {
    id: "boiss-limonade-jap",
    name: "Limonade Japonaise Signature",
    category: "boissons",
    categoryLabel: "Boissons & Bar",
    price: 3500,
    description: "Création désaltérante unique servie dans son verre à pied avec rondelle de citron jaune, infusion légère de thé et notes d'agrumes intenses.",
    tags: ["Boisson Star", "Sans Alcool"],
    popular: true,
    imageFallback: "from-amber-500/80 to-stone-900/90",
    imageSrc: "/images/japanese_iced_lemonade_1792928252517.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Infusion de thé doux", "Citron jaune pressé", "Sirop artisanal d'agrumes", "Eau pétillante glacée", "Glaçons"]
  },
  {
    id: "boiss-chai",
    name: "Thé Chai Traditionnel aux Épices",
    category: "boissons",
    categoryLabel: "Boissons & Bar",
    price: 2500,
    description: "Authentique thé au lait indien mijoté lentement avec bâton de cannelle, gousses de cardamome verte, clous de girofle et gingembre frais râpé.",
    tags: ["Chaud Réconfortant", "Authentique"],
    popular: true,
    imageFallback: "from-amber-600/80 to-stone-900/90",
    imageSrc: "/images/indian_chai_breakfast_1792926551291.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Thé noir d'Assam", "Lait entier frais", "Cardamome verte", "Bâtons de cannelle", "Gingembre frais"]
  },
  {
    id: "boiss-mojito",
    name: "Mojito Frais Menthe & Citron Vert",
    category: "boissons",
    categoryLabel: "Boissons & Bar",
    price: 4500,
    description: "Menthe fraîche pilée, quartier de citron vert pressé, sucre de canne roux, eau gazeuse pétillante et glace pilée (version classique ou vierge).",
    tags: ["Cocktail Fraîcheur"],
    imageFallback: "from-emerald-600/80 to-stone-900/90",
    imageSrc: "/images/japanese_iced_lemonade_1792928252517.jpg",
    cropOrigin: "center",
    scale: 1,
    ingredients: ["Feuilles de menthe fraîche", "Citron vert pressé minute", "Sucre de canne", "Eau gazeuse", "Glace pilée"]
  },
  {
    id: "boiss-biere",
    name: "Sélection Bières Fraîches & Vins Fins",
    category: "boissons",
    categoryLabel: "Boissons & Bar",
    price: 3000,
    description: "Grand choix de bières locales et internationales servies très fraîches, ainsi que nos verres de vins rouges, blancs et rosés sélectionnés.",
    tags: ["Alcools & Rafraîchissements"],
    imageFallback: "from-yellow-600/80 to-stone-900/90",
    imageSrc: "/assets/aistudio/Screenshot_20261025_112259_Maps_1ee0685f.jpg",
    cropOrigin: "24% 28%",
    scale: 2.2,
    ingredients: ["Sélection de bières blondes, brunes et ambrées servies très fraîches", "Vins au verre ou à la bouteille"]
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: "rev-1",
    author: "Marcella Ngo",
    role: "Cliente régulière · Douala Bonapriso",
    rating: 5,
    date: "Il y a 3 jours",
    highlight: "Plats très copieux et pizza XXL sensationnelle !",
    comment: "Très bon accueil dès l'entrée, serveuse très professionnelle et souriante. La pizza XXL est juste incroyable, la pâte est croustillante et bien garnie. Les portions sont particulièrement copieuses, on en a largement pour son argent !",
    favoriteDish: "Pizza Tikka XXL"
  },
  {
    id: "rev-2",
    author: "Armand Tcheutchoua",
    role: "Guide Local Google (142 avis)",
    rating: 5,
    date: "Il y a 1 semaine",
    highlight: "Les meilleurs plats indiens de tout Douala",
    comment: "Je cherchais un vrai restaurant avec des saveurs indiennes authentiques. Le Poulet Tikka et le Chai indien m'ont transporté. Le naan au fromage est cuit à la perfection, encore tout chaud. Mention spéciale pour le service rapide en salle !",
    favoriteDish: "Poulet Tikka & Chai"
  },
  {
    id: "rev-3",
    author: "Vanessa Eboumbou",
    role: "Dîner d'équipe en terrasse",
    rating: 5,
    date: "Il y a 2 semaines",
    highlight: "Terrasse magnifique et paiement Mobile Money instantané",
    comment: "Nous avons passé une soirée mémorable sur la terrasse. Ambiance feutrée, pas d'attente pour être servis, et le paiement direct par MTN MoMo au 6 55 44 14 14 s'est fait en 30 secondes. Les gambas braisées sont extraordinaires.",
    favoriteDish: "Gambas Géantes Braisées"
  },
  {
    id: "rev-4",
    author: "Patrick Kotto",
    role: "Repas en famille",
    rating: 5,
    date: "Il y a 3 semaines",
    highlight: "Idéal pour les enfants et parking ultra sécurisé",
    comment: "Super adresse pour fêter les anniversaires ou venir avec les enfants. Il y a des chaises hautes, un menu enfant super apprécié et un parking gratuit gardé dans la rue. Tagliatelles Carbonara et Alfredo poulet adoptées par toute la famille !",
    favoriteDish: "Alfredo Poulet"
  },
  {
    id: "rev-5",
    author: "Sandrine Mbarga",
    role: "Commande en livraison à Akwa",
    rating: 5,
    date: "Il y a 1 mois",
    highlight: "Livraison ultra rapide et plats bien chauds",
    comment: "J'ai passé commande par WhatsApp et payé par Orange Money au 6 55 44 14 14. Le livreur est arrivé en moins de 35 minutes au bureau à Akwa. La limonade japonaise était fraîche et la pizza 4 fromages encore fumante. Je recommande à 100% !",
    favoriteDish: "Limonade Japonaise & Pizza"
  }
];

export const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "MTN Mobile Money",
    ussdCode: "*126*1*1*655441414*MONTANT#",
    number: "6 55 44 14 14",
    recipient: "Restaurant 5 Fourchettes",
    badgeColor: "bg-amber-400 text-stone-950",
    instruction: "Composez le code USSD MTN ou transférez directement vers le 6 55 44 14 14."
  },
  {
    id: "om",
    name: "Orange Money",
    ussdCode: "#150*1*1*655441414*MONTANT#",
    number: "6 55 44 14 14",
    recipient: "Restaurant 5 Fourchettes",
    badgeColor: "bg-orange-500 text-white",
    instruction: "Composez le code USSD Orange ou transférez directement vers le 6 55 44 14 14."
  },
  {
    id: "cash_pos",
    name: "Paiement sur Place / Livraison",
    ussdCode: "",
    number: "6 55 44 14 14",
    recipient: "Espèces ou Carte bancaire (TPE)",
    badgeColor: "bg-stone-700 text-white",
    instruction: "Payez en espèces ou par carte bancaire / NFC sans contact lors de la livraison ou en caisse."
  }
];
