// Cartoon Network shows with viewership ranking data
// Rankings based on approximate viewership/popularity from various sources

export const cartoonShows = [
  {
    id: 1,
    title: "Dexter's Laboratory",
    years: "1996-2003",
    image: "🧪",
    viewershipRank: 3,
    description: "A boy genius conducts secret experiments in his hidden laboratory while dealing with his annoying sister Dee Dee's constant interruptions."
  },
  {
    id: 2,
    title: "The Powerpuff Girls",
    years: "1998-2005",
    image: "💖",
    viewershipRank: 2,
    description: "Three kindergarten-aged superhero sisters created from sugar, spice, and Chemical X protect Townsville from villains and monsters."
  },
  {
    id: 3,
    title: "Johnny Bravo",
    years: "1997-2004",
    image: "💪",
    viewershipRank: 8,
    description: "A muscular, Elvis-loving mama's boy with an oversized ego constantly strikes out with women despite his best pickup lines."
  },
  {
    id: 4,
    title: "Ed, Edd n Eddy",
    years: "1999-2009",
    image: "🍬",
    viewershipRank: 1,
    description: "Three misfit friends scheme to earn money for jawbreakers through increasingly elaborate scams on their cul-de-sac neighbors."
  },
  {
    id: 5,
    title: "Courage the Cowardly Dog",
    years: "1999-2002",
    image: "🐕",
    viewershipRank: 5,
    description: "A cowardly pink dog must overcome his fears to protect his elderly owners from paranormal threats in the middle of Nowhere, Kansas."
  },
  {
    id: 6,
    title: "Samurai Jack",
    years: "2001-2004, 2017",
    image: "⚔️",
    viewershipRank: 7,
    description: "A samurai warrior battles to return to the past and defeat the shape-shifting demon Aku after being thrown into a dystopian future."
  },
  {
    id: 7,
    title: "Teen Titans",
    years: "2003-2006",
    image: "🦸",
    viewershipRank: 4,
    description: "Five young DC superheroes led by Robin form a team to fight crime and navigate the challenges of adolescence in their tower headquarters."
  },
  {
    id: 8,
    title: "Adventure Time",
    years: "2010-2018",
    image: "🗡️",
    viewershipRank: 6,
    description: "Finn the human and Jake the magical dog embark on surreal adventures through the post-apocalyptic Land of Ooo filled with bizarre characters."
  },
  {
    id: 9,
    title: "Regular Show",
    years: "2010-2017",
    image: "🦝",
    viewershipRank: 9,
    description: "A blue jay and raccoon working as park groundskeepers face supernatural and absurd situations that escalate from their attempts to slack off."
  },
  {
    id: 10,
    title: "Steven Universe",
    years: "2013-2019",
    image: "💎",
    viewershipRank: 10,
    description: "A half-human, half-Gem boy learns to use his powers while protecting Earth alongside the Crystal Gems and exploring themes of identity and love."
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
