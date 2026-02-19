export type RouteCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type RoutePlace = {
  id: string;
  categoryId: string;

  title: string;

  coordsText: string;
  short: string;
  long: string;
  facts: string[];

  latitude: number;
  longitude: number;

  imageKey: string;
};

export const routeCategories: RouteCategory[] = [
  {
    id: 'nature',
    icon: '🌊',
    title: 'Nature & Coastal Views',
    subtitle:
      'Parks, waterfront trails, viewpoints, gardens and beaches with ocean panoramas around Victoria.',
  },
  {
    id: 'history',
    icon: '🏛️',
    title: 'History & Culture',
    subtitle:
      'Museums, landmarks, heritage streets, architecture and places that reflect Victoria’s history.',
  },
  {
    id: 'food',
    icon: '🍽️',
    title: 'Food & Local Experiences',
    subtitle:
      'Local markets, seafood stops, cozy cafes, craft tasting spots and iconic downtown places.',
  },
];

function makeShort(text: string, max = 110) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function coords(lat: number, lon: number) {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

export const routePlaces: RoutePlace[] = [

  {
    id: 'beacon-hill-park',
    categoryId: 'nature',
    title: 'Beacon Hill Park',
    latitude: 48.4076,
    longitude: -123.3646,
    coordsText: coords(48.4076, -123.3646),
    long:
      "Beacon Hill Park is one of Victoria’s most famous and beautiful city parks, located along the coast of the Strait of Juan de Fuca. The park covers over 75 hectares and combines manicured gardens, natural meadows, lakes and ocean panoramas. Here you can stroll along the coast, relax on benches overlooking the water or explore green areas with flower arrangements. The park is ideal for both a quiet holiday and active walks.",
    short: makeShort(
      "One of Victoria’s most famous city parks with gardens, meadows, lakes and coastal panoramas."
    ),
    facts: [
      'The park is home to one of the tallest totem poles in the world.',
      'Peacocks roam freely here — they have become a symbol of the park.',
    ],
    imageKey: 'beacon-hill-park',
  },
  {
    id: 'dallas-road-waterfront',
    categoryId: 'nature',
    title: 'Dallas Road Waterfront',
    latitude: 48.4069,
    longitude: -123.3476,
    coordsText: coords(48.4069, -123.3476),
    long:
      "Dallas Road Waterfront is a scenic coastal road and walking area that stretches along the ocean. It is one of the best places in Victoria for walks with panoramic views of the Olympic Mountains in Washington State (USA). Along the route there are observation decks, green areas and rocky shores where you can watch the waves and sea birds. The sunsets here are especially beautiful.",
    short: makeShort(
      'Scenic coastal route with panoramic ocean views and especially beautiful sunsets.'
    ),
    facts: [
      'On clear weather, the US territory is visible across the Strait of Juan de Fuca.',
      'It is a popular place for kitesurfing and kite flying.',
    ],
    imageKey: 'dallas-road-waterfront',
  },
  {
    id: 'butchart-gardens',
    categoryId: 'nature',
    title: 'The Butchart Gardens',
    latitude: 48.565,
    longitude: -123.4707,
    coordsText: coords(48.565, -123.4707),
    long:
      "The Butchart Gardens is a world-famous garden complex that attracts visitors from all over the world. The gardens are located on the site of a former limestone quarry, which was transformed into a flower park in the early 20th century. The themed areas here include a Japanese Garden, an Italian Garden, a Rose Garden and the famous Sunken Garden. The seasonal plant display changes throughout the year, making each visit unique.",
    short: makeShort(
      'World-famous garden complex with themed areas and seasonal displays year-round.'
    ),
    facts: [
      'The gardens were founded in 1904 by Jenny Butchart.',
      'In summer season, evening fireworks and concerts are held here.',
    ],
    imageKey: 'butchart-gardens',
  },
  {
    id: 'goldstream-park',
    categoryId: 'nature',
    title: 'Goldstream Provincial Park',
    latitude: 48.4827,
    longitude: -123.5335,
    coordsText: coords(48.4827, -123.5335),
    long:
      "Goldstream Provincial Park is a natural park near Victoria, known for its dense forests, canyons and waterfalls. The park offers a variety of hiking trails of varying difficulty, including trails to Niagara Falls (a local waterfall). This is a great place for those who want to experience the true nature of British Columbia.",
    short: makeShort(
      'Natural park with dense forests, canyons, waterfalls and hiking trails near Victoria.'
    ),
    facts: [
      'In the fall, you can watch salmon spawn here.',
      'The park is home to giant Douglas fir trees that are over 500 years old.',
    ],
    imageKey: 'goldstream-park',
  },
  {
    id: 'clover-point',
    categoryId: 'nature',
    title: 'Clover Point',
    latitude: 48.4018,
    longitude: -123.3609,
    coordsText: coords(48.4018, -123.3609),
    long:
      "Clover Point is a popular coastal viewpoint known for its sweeping views of the ocean and mountain ranges on the horizon. It attracts both tourists and locals for evening strolls, picnics, and photography. Thanks to the constant sea breeze, you can often see surfers and kitesurfers here.",
    short: makeShort(
      'Coastal viewpoint with sweeping ocean horizons and frequent wind for kitesurfing.'
    ),
    facts: [
      'Clover Point is part of the Dallas Road Waterfront Trail.',
      'It is one of the best places in the city to watch storms.',
    ],
    imageKey: 'clover-point',
  },
  {
    id: 'mount-tolmie',
    categoryId: 'nature',
    title: 'Mount Tolmie',
    latitude: 48.4575,
    longitude: -123.3338,
    coordsText: coords(48.4575, -123.3338),
    long:
      "Mount Tolmie is a popular viewpoint within the city, offering panoramic views of Victoria, the ocean, and the surrounding islands. You can drive to the top or hike up a short trail. It’s a great place for sunset or morning photos.",
    short: makeShort(
      'City viewpoint with panoramic views of Victoria, ocean and islands — great for sunrise/sunset.'
    ),
    facts: [
      'The Gulf Islands and Olympic Mountains can be seen from the top.',
      'It’s one of the best places to take panoramic photos of the city.',
    ],
    imageKey: 'mount-tolmie',
  },
  {
    id: 'ogden-point-breakwater',
    categoryId: 'nature',
    title: 'Ogden Point Breakwater',
    latitude: 48.4215,
    longitude: -123.3917,
    coordsText: coords(48.4215, -123.3917),
    long:
      "Ogden Point Breakwater is a long breakwater that juts out into the ocean and allows you to literally walk on water. Cruise ships often dock here, and a walkway leads to the lighthouse at the end of the breakwater. The atmosphere is calm, with open sea spaces all around.",
    short: makeShort(
      'Long ocean breakwater with a walkway to the lighthouse — calm atmosphere and open sea views.'
    ),
    facts: ['The length of the breakwater is over 760 meters.', 'It is a popular place for whale watching.'],
    imageKey: 'ogden-point-breakwater',
  },
  {
    id: 'willows-beach',
    categoryId: 'nature',
    title: 'Willows Beach',
    latitude: 48.4477,
    longitude: -123.2985,
    coordsText: coords(48.4477, -123.2985),
    long:
      "Willows Beach is a sandy beach in the Oak Bay area, popular with families and locals. The beach has calm waters, open space and beautiful views of the islands. In the summer, it is one of the best places to relax by the ocean.",
    short: makeShort(
      'Sandy beach in Oak Bay with calm water and island views — great for summer relaxation.'
    ),
    facts: ['The beach is suitable for swimming on warm summer days.', 'It offers views of Mount Baker.'],
    imageKey: 'willows-beach',
  },
  {
    id: 'fishermans-wharf-park',
    categoryId: 'nature',
    title: "Fisherman’s Wharf Park",
    latitude: 48.4226,
    longitude: -123.3806,
    coordsText: coords(48.4226, -123.3806),
    long:
      "Fisherman’s Wharf is a colorful floating pier with houses on the water and small restaurants. This picturesque place combines nature, a maritime atmosphere and local cuisine. Seals can often be seen here.",
    short: makeShort(
      'Colorful floating pier with food kiosks and seals — a classic maritime vibe.'
    ),
    facts: [
      'The houses on the water are painted in bright colors.',
      'Sea lions live here, who are accustomed to tourists.',
    ],
    imageKey: 'fishermans-wharf-park',
  },
  {
    id: 'island-view-beach',
    categoryId: 'nature',
    title: 'Island View Beach Regional Park',
    latitude: 48.536,
    longitude: -123.4007,
    coordsText: coords(48.536, -123.4007),
    long:
      'Island View Beach is a spacious natural beach with sand dunes and open views of the Gulf Islands. It is a great place for peaceful walks along the shore and wildlife watching.',
    short: makeShort(
      'Spacious natural beach with dunes and open Gulf Islands views — ideal for calm walks.'
    ),
    facts: ['The area is part of a nature conservation area.', 'Migratory birds are often observed here.'],
    imageKey: 'island-view-beach',
  },

  {
    id: 'bc-parliament',
    categoryId: 'history',
    title: 'British Columbia Parliament Buildings',
    latitude: 48.4201,
    longitude: -123.3656,
    coordsText: coords(48.4201, -123.3656),
    long:
      'The British Columbia Parliament Buildings are an architectural gem of Victoria, located near the Inner Harbour. The neo-Renaissance building is decorated with a dome and statues of historical figures.',
    short: makeShort('Architectural gem near the Inner Harbour with a dome and historic statues.'),
    facts: ['Built in 1898.', 'The evening illumination consists of thousands of light bulbs.'],
    imageKey: 'bc-parliament',
  },
  {
    id: 'royal-bc-museum',
    categoryId: 'history',
    title: 'Royal BC Museum',
    latitude: 48.4197,
    longitude: -123.3672,
    coordsText: coords(48.4197, -123.3672),
    long:
      "The Royal BC Museum is the province's main museum, telling about the natural and cultural history of the region. The exhibits cover the life of indigenous peoples, the colonial period and wildlife.",
    short: makeShort('Main provincial museum with exhibits on indigenous history, colonial era and wildlife.'),
    facts: ['The museum opened in 1886.', 'Historic streets of the 19th century are recreated here.'],
    imageKey: 'royal-bc-museum',
  },
  {
    id: 'craigdarroch-castle',
    categoryId: 'history',
    title: 'Craigdarroch Castle',
    latitude: 48.4269,
    longitude: -123.3339,
    coordsText: coords(48.4269, -123.3339),
    long:
      'Craigdarroch Castle is a late 19th-century Victorian castle built for coal magnate Robert Dunsmuir. The interiors retain original stained glass and wood paneling.',
    short: makeShort('Victorian-era castle with preserved stained glass and rich wood interiors.'),
    facts: ['It has 39 rooms.', 'It is a National Historic Landmark of Canada.'],
    imageKey: 'craigdarroch-castle',
  },
  {
    id: 'chinatown-fan-tan',
    categoryId: 'history',
    title: 'Chinatown & Fan Tan Alley',
    latitude: 48.4284,
    longitude: -123.3683,
    coordsText: coords(48.4284, -123.3683),
    long:
      'The oldest Chinatown in Canada with the narrow Fan Tan Alley. It combines the history of immigration and modern shops.',
    short: makeShort('Oldest Chinatown in Canada with the iconic narrow Fan Tan Alley.'),
    facts: [
      'Fan Tan Alley is one of the narrowest streets in North America.',
      'Chinatown was formed in 1858.',
    ],
    imageKey: 'chinatown-fan-tan',
  },
  {
    id: 'emily-carr-house',
    categoryId: 'history',
    title: 'Emily Carr House',
    latitude: 48.4096,
    longitude: -123.3567,
    coordsText: coords(48.4096, -123.3567),
    long:
      'The house-museum of artist Emily Carr, who became famous for her works about the culture of indigenous peoples and the nature of British Columbia.',
    short: makeShort('House-museum of Emily Carr, a famous Canadian artist of nature and indigenous culture.'),
    facts: ['The house was built in 1863.', 'Emily Carr is one of the most famous Canadian artists.'],
    imageKey: 'emily-carr-house',
  },
  {
    id: 'christ-church-cathedral',
    categoryId: 'history',
    title: 'Christ Church Cathedral',
    latitude: 48.4219,
    longitude: -123.3594,
    coordsText: coords(48.4219, -123.3594),
    long:
      'Christ Church Cathedral is a majestic Anglican cathedral in the Gothic style, located in the center of Victoria. Construction began at the end of the 19th century, and the temple was completed only in 1929. The interior is decorated with stained glass windows, stone arches and historical memorial slabs.',
    short: makeShort('Gothic Anglican cathedral with stained glass and historic memorial details.'),
    facts: ['The cathedral was built over 30 years.', 'The church regularly hosts organ concerts.'],
    imageKey: 'christ-church-cathedral',
  },
  {
    id: 'government-house',
    categoryId: 'history',
    title: 'Government House',
    latitude: 48.4296,
    longitude: -123.3476,
    coordsText: coords(48.4296, -123.3476),
    long:
      'Government House is the official residence of the Lieutenant Governor of British Columbia. Surrounded by manicured gardens, the house is open to the public on certain days. It is a combination of history, architecture, and landscape art.',
    short: makeShort('Official residence with manicured gardens — history, architecture and landscape art.'),
    facts: ['The first residence was built in the 1860s.', 'The gardens cover more than 14 hectares.'],
    imageKey: 'government-house',
  },
  {
    id: 'maritime-museum',
    categoryId: 'history',
    title: 'Maritime Museum of BC',
    latitude: 48.4285,
    longitude: -123.3659,
    coordsText: coords(48.4285, -123.3659),
    long:
      'The Maritime Museum of British Columbia is dedicated to the maritime history of the region. The exhibits tell about shipbuilding, navigation, and the development of ports on the Pacific coast.',
    short: makeShort('Museum dedicated to Pacific coast maritime history, navigation and shipbuilding.'),
    facts: [
      'The museum stores historical navigational instruments.',
      'Materials about the SS Princess Sophia are exhibited here.',
    ],
    imageKey: 'maritime-museum',
  },
  {
    id: 'ross-bay-cemetery',
    categoryId: 'history',
    title: 'Ross Bay Cemetery',
    latitude: 48.4065,
    longitude: -123.3508,
    coordsText: coords(48.4065, -123.3508),
    long:
      'Ross Bay Cemetery is a historic cemetery with panoramic views of the ocean. Pioneers, politicians and famous figures of Victoria are buried here. The atmosphere is calm and picturesque.',
    short: makeShort('Historic cemetery with ocean views and a calm, picturesque atmosphere.'),
    facts: ['Founded in 1872.', 'It is the burial place of Emily Carr.'],
    imageKey: 'ross-bay-cemetery',
  },
  {
    id: 'bastion-square',
    categoryId: 'history',
    title: 'Bastion Square',
    latitude: 48.4253,
    longitude: -123.369,
    coordsText: coords(48.4253, -123.369),
    long:
      'Bastion Square is a historic square in the city center, where the fort and courthouse were previously located. Today it is an area with restaurants and galleries that has preserved its colonial charm.',
    short: makeShort('Historic downtown square with restaurants and galleries, preserving colonial charm.'),
    facts: ['Public executions were previously held here.', 'It is considered one of the oldest areas of Victoria.'],
    imageKey: 'bastion-square',
  },

  {
    id: 'red-fish-blue-fish',
    categoryId: 'food',
    title: 'Red Fish Blue Fish',
    latitude: 48.4222,
    longitude: -123.3707,
    coordsText: coords(48.4222, -123.3707),
    long:
      'A famous seafood restaurant located in a container on the Inner Harbour waterfront. The menu focuses on local fish and sustainable seafood.',
    short: makeShort('Iconic waterfront seafood spot with a sustainable local menu.'),
    facts: [
      'The restaurant does not have a traditional hall — only an outdoor area.',
      'Often included in the top seafood ratings in Canada.',
    ],
    imageKey: 'red-fish-blue-fish',
  },
  {
    id: 'pagliaccis',
    categoryId: 'food',
    title: "Pagliacci’s",
    latitude: 48.4245,
    longitude: -123.3652,
    coordsText: coords(48.4245, -123.3652),
    long:
      'An Italian restaurant with a long history, popular with locals and tourists. Known for its pasta and live music atmosphere.',
    short: makeShort('Long-running Italian favorite known for pasta and live music atmosphere.'),
    facts: ['Open since 1979.', 'Often has lines to enter in the evening.'],
    imageKey: 'pagliaccis',
  },
  {
    id: 'victoria-public-market',
    categoryId: 'food',
    title: 'Victoria Public Market',
    latitude: 48.4281,
    longitude: -123.3658,
    coordsText: coords(48.4281, -123.3658),
    long:
      'A covered market with local producers, cafes and artisanal goods. A perfect place to get acquainted with local gastronomy.',
    short: makeShort('Covered market with local producers, cafes and artisanal goods.'),
    facts: ['Located in the historic Hudson building.', 'Represents over 20 local brands.'],
    imageKey: 'victoria-public-market',
  },
  {
    id: 'fishermans-wharf-kiosks',
    categoryId: 'food',
    title: "Fisherman’s Wharf Food Kiosks",
    latitude: 48.4226,
    longitude: -123.3806,
    coordsText: coords(48.4226, -123.3806),
    long:
      'Small kiosks on a floating pier with seafood and local dishes. Here you can taste fresh crab or clam chowder.',
    short: makeShort('Seasonal floating pier kiosks with seafood classics like crab and chowder.'),
    facts: ['Seals often swim nearby.', 'Kiosks operate seasonally.'],
    imageKey: 'fishermans-wharf-kiosks',
  },
  {
    id: 'phillips-brewing',
    categoryId: 'food',
    title: 'Phillips Brewing & Malting Co.',
    latitude: 48.4355,
    longitude: -123.3695,
    coordsText: coords(48.4355, -123.3695),
    long:
      "One of Victoria's most famous craft breweries. Offers local beer tastings and factory tours.",
    short: makeShort('Popular craft brewery offering tastings and tours, known for seasonal releases.'),
    facts: ['Founded in 2001.', 'Produces limited-edition seasonal varieties.'],
    imageKey: 'phillips-brewing',
  },
  {
    id: 'nourish-kitchen-cafe',
    categoryId: 'food',
    title: 'Nourish Kitchen & Cafe',
    latitude: 48.4133,
    longitude: -123.3546,
    coordsText: coords(48.4133, -123.3546),
    long:
      'Nourish is a popular cafe with an emphasis on organic and local ingredients. The establishment is located in a historic Victorian house near Beacon Hill Park. The menu includes breakfast, brunch and vegetarian dishes with a modern twist.',
    short: makeShort('Organic-focused cafe in a historic house near Beacon Hill Park — great for brunch.'),
    facts: ['The building dates back to 1888.', 'The cafe actively supports local Vancouver Island farmers.'],
    imageKey: 'nourish-kitchen-cafe',
  },
  {
    id: '10-acres-bistro',
    categoryId: 'food',
    title: '10 Acres Bistro',
    latitude: 48.4228,
    longitude: -123.3689,
    coordsText: coords(48.4228, -123.3689),
    long:
      '10 Acres Bistro is a downtown farm-to-table restaurant that uses produce from its own farm. Dishes are seasonal, and the menu changes depending on the harvest. The interior is modern, but with a warm, atmospheric design.',
    short: makeShort('Downtown farm-to-table restaurant with seasonal menu sourced from its own farm.'),
    facts: ['Has its own farm on Vancouver Island.', 'The establishment focuses on sustainable cuisine.'],
    imageKey: '10-acres-bistro',
  },
  {
    id: 'bard-banker',
    categoryId: 'food',
    title: 'Bard & Banker',
    latitude: 48.4251,
    longitude: -123.3694,
    coordsText: coords(48.4251, -123.3694),
    long:
      'A historic pub in a former bank building. Known for its wide selection of beers and classic Canadian dishes. Live music is often played here.',
    short: makeShort('Historic pub in a former bank building with beers, classic dishes and live music.'),
    facts: ['The building was built in 1885.', 'The interior has preserved original architectural elements.'],
    imageKey: 'bard-banker',
  },
  {
    id: 'chocolats-favoris',
    categoryId: 'food',
    title: 'Chocolats Favoris Victoria',
    latitude: 48.4219,
    longitude: -123.3685,
    coordsText: coords(48.4219, -123.3685),
    long:
      'A popular place for desserts, especially ice cream dipped in thick chocolate. The establishment attracts both tourists and locals.',
    short: makeShort('Dessert favorite — ice cream dipped in thick chocolate with many sauce options.'),
    facts: ['The brand originates from Quebec.', 'Has a large selection of chocolate sauces of different shades.'],
    imageKey: 'chocolats-favoris',
  },
  {
    id: 'il-covo-trattoria',
    categoryId: 'food',
    title: 'Il Covo Trattoria',
    latitude: 48.4224,
    longitude: -123.379,
    coordsText: coords(48.4224, -123.379),
    long:
      'Il Covo is a cozy Italian restaurant in the James Bay area, known for its homemade pasta and wine list. The atmosphere resembles a small restaurant in Europe.',
    short: makeShort('Cozy Italian trattoria in James Bay with homemade pasta and a strong wine list.'),
    facts: [
      'Considered one of the best Italian restaurants in the city.',
      'Many dishes are prepared according to traditional family recipes.',
    ],
    imageKey: 'il-covo-trattoria',
  },
];

export function getCategory(categoryId: string) {
  return routeCategories.find((c) => c.id === categoryId);
}

export function getPlaces(categoryId: string) {
  return routePlaces.filter((p) => p.categoryId === categoryId);
}

export function getPlace(categoryId: string, placeId: string) {
  return routePlaces.find((p) => p.categoryId === categoryId && p.id === placeId);
}
