export interface FormationPlayer {
  code: string
  x: number
  y: number
}

export interface FormationInfo {
  id: string
  name: string
  shapeSummary: string
  strengths: string[]
  weaknesses: string[]
  buildUp: string
  pressing: string
  famousUsers: string
  players: FormationPlayer[]
}

export const FORMATIONS: FormationInfo[] = [
  {
    id: '4-4-2', name: '4-4-2',
    shapeSummary: 'Two flat banks of four in defence and midfield, with two strikers up top.',
    strengths: ['Simple, compact defensive shape', 'Two strikers create direct aerial/second-ball threats', 'Easy for players to understand'],
    weaknesses: ['Can be outnumbered in central midfield against a three-man midfield', 'Wide midfielders must cover huge defensive ground'],
    buildUp: 'Often more direct, using the strikers as early outlets rather than intricate short passing through midfield.',
    pressing: 'Presses in banks, using the front two to press the centre-backs and force play wide.',
    famousUsers: 'Leicester City’s 2015-16 title-winning side; classic English football through the 1990s-2000s.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'LB', x: 0.15, y: 0.2 }, { code: 'CB', x: 0.38, y: 0.16 },
      { code: 'CB', x: 0.62, y: 0.16 }, { code: 'RB', x: 0.85, y: 0.2 },
      { code: 'LM', x: 0.15, y: 0.48 }, { code: 'CM', x: 0.38, y: 0.44 }, { code: 'CM', x: 0.62, y: 0.44 }, { code: 'RM', x: 0.85, y: 0.48 },
      { code: 'ST', x: 0.38, y: 0.82 }, { code: 'ST', x: 0.62, y: 0.82 },
    ],
  },
  {
    id: '4-3-3', name: '4-3-3',
    shapeSummary: 'A back four, a midfield triangle (one deep, two advanced or vice versa), and three attackers across the front.',
    strengths: ['Natural width from the wingers', 'Midfield triangle offers passing angles in both directions', 'Flexible pressing structure'],
    weaknesses: ['Lone striker can be isolated without good support', 'Full-backs must cover extra width if wingers stay high'],
    buildUp: 'Patient possession through the midfield triangle, often with full-backs or a deep midfielder dropping to create passing lanes.',
    pressing: 'The front three plus advanced midfielders can press high and compactly, cutting off central passing lanes.',
    famousUsers: 'Pep Guardiola’s Barcelona (2008-2012); Liverpool under Jürgen Klopp.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'LB', x: 0.15, y: 0.2 }, { code: 'CB', x: 0.38, y: 0.16 },
      { code: 'CB', x: 0.62, y: 0.16 }, { code: 'RB', x: 0.85, y: 0.2 },
      { code: 'DM', x: 0.5, y: 0.36 }, { code: 'CM', x: 0.3, y: 0.48 }, { code: 'CM', x: 0.7, y: 0.48 },
      { code: 'LW', x: 0.14, y: 0.76 }, { code: 'ST', x: 0.5, y: 0.86 }, { code: 'RW', x: 0.86, y: 0.76 },
    ],
  },
  {
    id: '4-2-3-1', name: '4-2-3-1',
    shapeSummary: 'A double pivot shielding the back four, with three attacking midfielders behind a lone striker.',
    strengths: ['Extra defensive security from the double pivot', 'Three creative players behind the striker generate overloads', 'Good balance of solidity and creativity'],
    weaknesses: ['Lone striker can become isolated', 'Needs disciplined pivot players or the back line is exposed'],
    buildUp: 'The double pivot circulates possession safely while the front four combine in the final third.',
    pressing: 'Can press in a mid-block, using the attacking three to cut central passing lanes while the pivot covers behind.',
    famousUsers: 'Real Madrid under multiple managers; widely used across the modern Premier League and Bundesliga.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'LB', x: 0.15, y: 0.2 }, { code: 'CB', x: 0.38, y: 0.16 },
      { code: 'CB', x: 0.62, y: 0.16 }, { code: 'RB', x: 0.85, y: 0.2 },
      { code: 'DM', x: 0.36, y: 0.34 }, { code: 'DM', x: 0.64, y: 0.34 },
      { code: 'LW', x: 0.16, y: 0.6 }, { code: 'AM', x: 0.5, y: 0.58 }, { code: 'RW', x: 0.84, y: 0.6 },
      { code: 'ST', x: 0.5, y: 0.86 },
    ],
  },
  {
    id: '3-5-2', name: '3-5-2',
    shapeSummary: 'Three centre-backs, wing-backs providing the width, and a busy five-man midfield behind two strikers.',
    strengths: ['Extra central defender covers against two strikers', 'Wing-backs provide width without sacrificing central numbers', 'Numerical control of central midfield'],
    weaknesses: ['Heavily reliant on wing-back stamina', 'Vulnerable in the wide channels if wing-backs are caught upfield'],
    buildUp: 'Centre-backs split wide to receive and progress the ball, with wing-backs pushing on to create 3-2 or 3-4 shapes.',
    pressing: 'Can press aggressively with two strikers up top while staying compact through the extra central defender.',
    famousUsers: 'Antonio Conte’s Chelsea (2016-17); Italy’s traditional back-three heritage.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'CB', x: 0.28, y: 0.16 }, { code: 'CB', x: 0.5, y: 0.14 }, { code: 'CB', x: 0.72, y: 0.16 },
      { code: 'WB', x: 0.08, y: 0.4 }, { code: 'CM', x: 0.34, y: 0.42 }, { code: 'CM', x: 0.5, y: 0.36 }, { code: 'CM', x: 0.66, y: 0.42 }, { code: 'WB', x: 0.92, y: 0.4 },
      { code: 'ST', x: 0.38, y: 0.82 }, { code: 'ST', x: 0.62, y: 0.82 },
    ],
  },
  {
    id: '3-4-3', name: '3-4-3',
    shapeSummary: 'Three centre-backs, a flat midfield four including wide midfielders, and three attackers across the front.',
    strengths: ['Width from both midfield and attack simultaneously', 'Strong central numbers to control possession'],
    weaknesses: ['Can be stretched horizontally if the opposition switches play quickly', 'Requires disciplined midfield tracking to avoid gaps'],
    buildUp: 'Builds through the back three with the double central midfield rotating to find space between opposition lines.',
    pressing: 'The front three lead an aggressive high press, supported by wide midfielders stepping up.',
    famousUsers: 'Pep Guardiola’s Manchester City in various seasons; Sarri-ball variants.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'CB', x: 0.28, y: 0.16 }, { code: 'CB', x: 0.5, y: 0.14 }, { code: 'CB', x: 0.72, y: 0.16 },
      { code: 'LM', x: 0.14, y: 0.42 }, { code: 'CM', x: 0.4, y: 0.4 }, { code: 'CM', x: 0.6, y: 0.4 }, { code: 'RM', x: 0.86, y: 0.42 },
      { code: 'LW', x: 0.18, y: 0.76 }, { code: 'ST', x: 0.5, y: 0.86 }, { code: 'RW', x: 0.82, y: 0.76 },
    ],
  },
  {
    id: '5-3-2', name: '5-3-2',
    shapeSummary: 'A back five (three centre-backs plus two wing-backs tucked in defensively), a compact midfield three, and two strikers.',
    strengths: ['Extremely difficult to break down centrally or in the wide channels', 'Good platform for counter-attacking with two strikers'],
    weaknesses: ['Can cede a lot of possession and territory', 'Wing-backs have to cover the entire flank alone in transition'],
    buildUp: 'Often more direct, looking to bypass midfield with longer passes to the two strikers on the counter.',
    pressing: 'Typically a mid-to-low block, prioritising defensive shape over an aggressive high press.',
    famousUsers: 'Many underdog national teams and defensively-organised sides in cup competitions.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'WB', x: 0.1, y: 0.22 }, { code: 'CB', x: 0.32, y: 0.14 }, { code: 'CB', x: 0.5, y: 0.12 }, { code: 'CB', x: 0.68, y: 0.14 }, { code: 'WB', x: 0.9, y: 0.22 },
      { code: 'CM', x: 0.32, y: 0.42 }, { code: 'CM', x: 0.5, y: 0.38 }, { code: 'CM', x: 0.68, y: 0.42 },
      { code: 'ST', x: 0.38, y: 0.82 }, { code: 'ST', x: 0.62, y: 0.82 },
    ],
  },
  {
    id: '4-1-4-1', name: '4-1-4-1',
    shapeSummary: 'A lone defensive midfielder shielding the back four, a flat midfield four, and a lone striker.',
    strengths: ['Extremely compact and hard to play through centrally', 'Flat midfield four is well-suited to a coordinated press'],
    weaknesses: ['Lone striker isolated in transition', 'Needs a disciplined, mobile holding midfielder to cover huge space'],
    buildUp: 'Circulates possession patiently, with the lone pivot dropping between the centre-backs to help build out.',
    pressing: 'A key pressing formation — the flat four can shift as a unit to close down passing lanes across the pitch.',
    famousUsers: 'Widely used as an out-of-possession shape that morphs into a 4-3-3 or 4-2-3-1 in possession.',
    players: [
      { code: 'GK', x: 0.5, y: 0.05 }, { code: 'LB', x: 0.15, y: 0.2 }, { code: 'CB', x: 0.38, y: 0.16 },
      { code: 'CB', x: 0.62, y: 0.16 }, { code: 'RB', x: 0.85, y: 0.2 },
      { code: 'DM', x: 0.5, y: 0.32 },
      { code: 'LM', x: 0.14, y: 0.56 }, { code: 'CM', x: 0.4, y: 0.52 }, { code: 'CM', x: 0.6, y: 0.52 }, { code: 'RM', x: 0.86, y: 0.56 },
      { code: 'ST', x: 0.5, y: 0.86 },
    ],
  },
]
