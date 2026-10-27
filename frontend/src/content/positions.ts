export interface PositionInfo {
  code: string
  name: string
  group: 'Goalkeeper' | 'Defence' | 'Midfield' | 'Attack'
  x: number // 0-1 across pitch width
  y: number // 0-1 up the pitch (0 = own goal line, 1 = opponent goal line)
  whereTheyPlay: string
  defensiveResponsibilities: string[]
  attackingResponsibilities: string[]
  typicalAttributes: string[]
  variations: string
  famousExamples: string[]
  tacticalImportance: string
}

export const POSITIONS: PositionInfo[] = [
  {
    code: 'GK', name: 'Goalkeeper', group: 'Goalkeeper', x: 0.5, y: 0.05,
    whereTheyPlay: 'In and around the penalty area, the only player permitted to use hands within their own box.',
    defensiveResponsibilities: ['Stop shots on goal', 'Command the box on crosses', 'Organise the defensive line'],
    attackingResponsibilities: ['Start build-up play with distribution', 'Act as an auxiliary sweeper behind a high defensive line'],
    typicalAttributes: ['Reflexes', 'Positioning', 'Distribution', 'Aerial command'],
    variations: 'A "sweeper keeper" plays higher up and joins build-up play, rushing out to cover behind a high back line.',
    famousExamples: ['Alisson Becker', 'Ederson', 'Manuel Neuer'],
    tacticalImportance: 'Modern keepers are the first attacker in possession-based systems, not just the last line of defence.',
  },
  {
    code: 'CB', name: 'Centre-back', group: 'Defence', x: 0.4, y: 0.16,
    whereTheyPlay: 'Central defence, typically in a pair or a back three, directly in front of the goalkeeper.',
    defensiveResponsibilities: ['Win aerial and ground duels', 'Cover space behind the defensive line', 'Organise the back line'],
    attackingResponsibilities: ['Start attacks with progressive passing', 'Step into midfield in build-up phases'],
    typicalAttributes: ['Aerial ability', 'Tackling', 'Positioning', 'Passing range'],
    variations: 'A "ball-playing centre-back" prioritises passing range and composure over pure physicality.',
    famousExamples: ['Virgil van Dijk', 'Rúben Dias'],
    tacticalImportance: 'The foundation of defensive structure; their positioning dictates how high the whole team can push.',
  },
  {
    code: 'FB', name: 'Full-back', group: 'Defence', x: 0.15, y: 0.22,
    whereTheyPlay: 'Wide defensive positions on either flank, between the centre-backs and the touchline.',
    defensiveResponsibilities: ['Track opposition wingers', 'Cover the wide channel', 'Support the centre-backs'],
    attackingResponsibilities: ['Provide width', 'Overlap or underlap the winger', 'Cross into the box'],
    typicalAttributes: ['Stamina', 'Crossing', 'Recovery pace', 'One-on-one defending'],
    variations: 'An "inverted full-back" tucks into central midfield during possession instead of staying wide.',
    famousExamples: ['Trent Alexander-Arnold', 'Achraf Hakimi'],
    tacticalImportance: 'One of the most tactically flexible roles in the modern game, central to both width and central overloads.',
  },
  {
    code: 'WB', name: 'Wing-back', group: 'Defence', x: 0.12, y: 0.32,
    whereTheyPlay: 'A more advanced full-back role used in three-at-the-back systems, patrolling the entire flank.',
    defensiveResponsibilities: ['Track back to form a back five when out of possession', 'Deny crosses and cutbacks'],
    attackingResponsibilities: ['Provide the primary width in attack', 'Get to the byline and cross or cut back'],
    typicalAttributes: ['Stamina', 'Pace', 'Crossing', 'Tactical discipline'],
    variations: 'Systems like 3-4-3 and 3-5-2 rely on wing-backs to cover the entire touchline alone.',
    famousExamples: ['João Cancelo (at Inter)', 'Alphonso Davies'],
    tacticalImportance: 'The engine of a back-three system — their work rate determines whether the team has width at all.',
  },
  {
    code: 'DM', name: 'Defensive midfielder', group: 'Midfield', x: 0.5, y: 0.34,
    whereTheyPlay: 'Directly in front of the back line, screening the space between defence and midfield.',
    defensiveResponsibilities: ['Break up opposition attacks', 'Cover space in behind advancing full-backs', 'Protect the back line'],
    attackingResponsibilities: ['Recycle possession', 'Play the first progressive pass out of defence'],
    typicalAttributes: ['Positional discipline', 'Interceptions', 'Passing under pressure'],
    variations: 'A "double pivot" uses two defensive/central midfielders together for extra defensive and passing security.',
    famousExamples: ['Rodri', 'Casemiro'],
    tacticalImportance: 'Often the most influential player in a possession team — controls tempo and defensive balance simultaneously.',
  },
  {
    code: 'CM', name: 'Central midfielder', group: 'Midfield', x: 0.32, y: 0.44,
    whereTheyPlay: 'The middle third of the pitch, linking defence and attack in both phases.',
    defensiveResponsibilities: ['Press opposition midfielders', 'Support defensive transitions'],
    attackingResponsibilities: ['Dictate tempo', 'Progress the ball forward', 'Arrive in the box on late runs'],
    typicalAttributes: ['Passing', 'Work rate', 'Box-to-box stamina', 'Game intelligence'],
    variations: 'A "box-to-box" midfielder covers the full length of the pitch each phase, contributing at both ends.',
    famousExamples: ['Kevin De Bruyne', 'Declan Rice'],
    tacticalImportance: 'The connective tissue of a team’s shape; their positioning determines how well defence and attack link up.',
  },
  {
    code: 'AM', name: 'Attacking midfielder', group: 'Midfield', x: 0.5, y: 0.58,
    whereTheyPlay: 'Between the opposition’s midfield and defensive lines, often called "the number 10 space".',
    defensiveResponsibilities: ['Press the opposition’s deepest midfielder', 'Cut passing lanes into midfield'],
    attackingResponsibilities: ['Create chances', 'Find pockets of space between the lines', 'Shoot from range'],
    typicalAttributes: ['Vision', 'Dribbling', 'Final-ball quality'],
    variations: 'A "trequartista" plays with more creative freedom and fewer defensive duties than a modern number 10.',
    famousExamples: ['Jude Bellingham', 'Bruno Fernandes'],
    tacticalImportance: 'Occupying the half-space between the lines is one of the hardest problems for a defence to solve.',
  },
  {
    code: 'W', name: 'Winger', group: 'Attack', x: 0.14, y: 0.68,
    whereTheyPlay: 'Wide attacking areas near the touchline in the final third.',
    defensiveResponsibilities: ['Track back to help the full-back', 'Press the opposition full-back'],
    attackingResponsibilities: ['Beat defenders one-on-one', 'Cross or cut inside to shoot', 'Stretch the pitch horizontally'],
    typicalAttributes: ['Pace', 'Dribbling', 'Crossing or finishing'],
    variations: 'An "inverted winger" plays on the opposite side to their strong foot, cutting inside to shoot rather than crossing.',
    famousExamples: ['Mohamed Salah', 'Vinícius Júnior'],
    tacticalImportance: 'Wingers create the width that allows inverted full-backs and central overloads to function.',
  },
  {
    code: 'SS', name: 'Second striker', group: 'Attack', x: 0.62, y: 0.8,
    whereTheyPlay: 'Just behind the main striker, drifting between the lines of the final third.',
    defensiveResponsibilities: ['Press the opposition’s first line of defence'],
    attackingResponsibilities: ['Link midfield and attack', 'Make late runs into the box', 'Combine with the striker'],
    typicalAttributes: ['Movement', 'Link-up play', 'Finishing'],
    variations: 'Often used in a 4-4-2 alongside a more physical target man, or as a free-roaming "10" in a 4-2-3-1.',
    famousExamples: ['Roberto Firmino (in his link-up role)'],
    tacticalImportance: 'Provides an extra passing option in the box while dragging defenders out of position.',
  },
  {
    code: 'ST', name: 'Centre-forward', group: 'Attack', x: 0.5, y: 0.88,
    whereTheyPlay: 'The furthest player forward, primarily occupying the penalty area.',
    defensiveResponsibilities: ['Press the opposition’s first pass out from the back'],
    attackingResponsibilities: ['Score goals', 'Hold up play', 'Win aerial duels in the box'],
    typicalAttributes: ['Finishing', 'Movement in behind', 'Aerial ability or hold-up play'],
    variations: 'A "target man" holds the ball up and wins aerial duels; a "false nine" drops deep instead of staying on the last line.',
    famousExamples: ['Erling Haaland (target man/poacher hybrid)', 'Harry Kane'],
    tacticalImportance: 'The focal point of the attack — their movement determines how the whole forward line is set up.',
  },
]

export const POSITION_LABEL: Record<string, string> = {
  GK: 'Goalkeeper', CB: 'Centre-back', FB: 'Full-back', WB: 'Wing-back', DM: 'Defensive midfielder',
  CM: 'Central midfielder', AM: 'Attacking midfielder', W: 'Winger', LW: 'Left winger', RW: 'Right winger',
  SS: 'Second striker', ST: 'Striker', CF: 'Centre-forward',
}

export const POSITION_GROUP: Record<string, string> = {
  GK: 'Goalkeepers', CB: 'Defenders', FB: 'Defenders', WB: 'Defenders', DM: 'Midfielders', CM: 'Midfielders', AM: 'Midfielders',
  W: 'Attackers', LW: 'Attackers', RW: 'Attackers', SS: 'Attackers', ST: 'Attackers', CF: 'Attackers',
}
