// Cartoon Network shows with viewership ranking data
// Rankings based on approximate viewership/popularity from various sources

export const cartoonShows = [
  {
    id: 1,
    title: "Dexter's Laboratory",
    years: "1996-2003",
    image: "🧪",
    viewershipRank: 3,
    description: "A boy genius with a secret laboratory"
  },
  {
    id: 2,
    title: "The Powerpuff Girls",
    years: "1998-2005",
    image: "💖",
    viewershipRank: 2,
    description: "Sugar, spice, and everything nice"
  },
  {
    id: 3,
    title: "Johnny Bravo",
    years: "1997-2004",
    image: "💪",
    viewershipRank: 8,
    description: "A muscular mama's boy with big hair"
  },
  {
    id: 4,
    title: "Ed, Edd n Eddy",
    years: "1999-2009",
    image: "🍬",
    viewershipRank: 1,
    description: "Three friends on endless jawbreaker quests"
  },
  {
    id: 5,
    title: "Courage the Cowardly Dog",
    years: "1999-2002",
    image: "🐕",
    viewershipRank: 5,
    description: "A frightened dog protecting his owners"
  },
  {
    id: 6,
    title: "Samurai Jack",
    years: "2001-2004, 2017",
    image: "⚔️",
    viewershipRank: 7,
    description: "A warrior fighting through time"
  },
  {
    id: 7,
    title: "Teen Titans",
    years: "2003-2006",
    image: "🦸",
    viewershipRank: 4,
    description: "Young DC heroes saving the world"
  },
  {
    id: 8,
    title: "Adventure Time",
    years: "2010-2018",
    image: "🗡️",
    viewershipRank: 6,
    description: "Mathematical adventures in the Land of Ooo"
  },
  {
    id: 9,
    title: "Regular Show",
    years: "2010-2017",
    image: "🦝",
    viewershipRank: 9,
    description: "A blue jay and raccoon's surreal park job"
  },
  {
    id: 10,
    title: "Steven Universe",
    years: "2013-2019",
    image: "💎",
    viewershipRank: 10,
    description: "A boy protecting Earth with the Crystal Gems"
  }
];

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
