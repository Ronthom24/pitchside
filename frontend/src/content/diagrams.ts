// Authoring coordinates: x 0-100 across the pitch (0 = the team's left flank), y 0 = the goal Team A attacks.
// 'half' diagrams are authored on the attacking half (y 0-77) and stretched along the pitch when drawn; 'full' use y 0-154.
// The renderer draws a landscape pitch with Team A attacking left to right. Every diagram ends with a goal.
export type P = [number, number]
type Rec = Record<string, P>
export interface Arrow { from: P | string; to: P | string; kind: 'pass' | 'run' | 'shot' }
export interface Zone { x: number; y: number; w: number; h: number; label?: string; tone?: 'good' | 'warn' }
export interface Step {
  caption: string
  a?: Rec
  b?: Rec
  ball?: P | string // 'a:ID' / 'b:ID' pins the ball to a player
  arrows?: Arrow[]
  zones?: Zone[]
  goal?: boolean
}
export interface Diagram {
  id: string
  view: 'half' | 'full'
  a: Rec
  b: Rec
  ball: P | string
  zones?: Zone[]
  steps: Step[]
}

export interface Frame {
  caption: string
  a: Rec
  b: Rec
  ball: P
  arrows: { from: P; to: P; kind: 'pass' | 'run' | 'shot' }[]
  zones: Zone[]
  goal: boolean
}

const GK: P = [50, 2.5]
const NET_L: P = [46, -1.5]
const NET_R: P = [54, -1.5]

function resolve(ref: P | string, a: Rec, b: Rec, offset = false): P {
  if (typeof ref !== 'string') return ref
  const [side, id] = ref.split(':')
  const p = (side === 'a' ? a : b)[id] ?? [50, 50]
  return offset ? [p[0] + 3.4, p[1] + 2.2] : p
}

export function buildFrames(d: Diagram): Frame[] {
  let a = { ...d.a }
  let b: Rec = { GK, ...d.b }
  let ball = d.ball
  return d.steps.map((s) => {
    a = { ...a, ...(s.a ?? {}) }
    b = { ...b, ...(s.b ?? {}) }
    if (s.ball) ball = s.ball
    return {
      caption: s.caption, a, b,
      ball: resolve(ball, a, b, typeof ball === 'string'),
      arrows: (s.arrows ?? []).map((ar) => ({ from: resolve(ar.from, a, b), to: resolve(ar.to, a, b), kind: ar.kind })),
      zones: [...(d.zones ?? []), ...(s.zones ?? [])],
      goal: !!s.goal,
    }
  })
}

const LANES: Zone[] = [
  { x: 20, y: 0, w: 20, h: 77, label: 'Half-space', tone: 'good' },
  { x: 60, y: 0, w: 20, h: 77, label: 'Half-space', tone: 'good' },
]

export const DIAGRAMS: Record<string, Diagram> = {
  'high-press': {
    id: 'high-press', view: 'half',
    a: { ST: [50, 24], LW: [24, 30], RW: [76, 30], CM1: [38, 44], CM2: [62, 44], CM3: [50, 50] },
    b: { GK: [50, 5], CB1: [36, 14], CB2: [64, 14], LB: [14, 24], RB: [86, 24], DM: [50, 34] },
    ball: 'b:GK',
    steps: [
      { caption: 'The goalkeeper starts the move. The press is set: every attacker is tied to a passing option.' },
      { caption: 'The striker closes the centre-back while the wingers cut off the full-backs.', a: { ST: [42, 19], LW: [20, 26], RW: [80, 28], CM1: [40, 36], CM2: [60, 38] }, ball: 'b:CB1',
        arrows: [{ from: [50, 24], to: [42, 19], kind: 'run' }, { from: [24, 30], to: [20, 26], kind: 'run' }, { from: [76, 30], to: [80, 28], kind: 'run' }] },
      { caption: 'With no safe pass, the defender loses it. The ball is won high up the pitch.', ball: 'a:CM1', a: { CM1: [40, 32] }, b: { CB1: [38, 18] },
        arrows: [{ from: 'a:CM1', to: 'a:ST', kind: 'pass' }] },
      { caption: 'One pass and the striker is through on goal, with the defence out of position.', ball: 'a:ST', a: { ST: [50, 13] },
        arrows: [{ from: [42, 19], to: [50, 13], kind: 'run' }] },
      { caption: 'GOAL. Winning the ball this high leaves the keeper no time to set himself.', ball: NET_L, goal: true, arrows: [{ from: [50, 13], to: NET_L, kind: 'shot' }] },
    ],
  },
  gegenpressing: {
    id: 'gegenpressing', view: 'half',
    a: { ST: [50, 20], LW: [26, 30], RW: [74, 30], CM1: [40, 52], CM2: [60, 52], CM3: [50, 64] },
    b: { M1: [48, 44], M2: [34, 38], M3: [66, 40], D1: [50, 24] },
    ball: 'b:M1',
    steps: [
      { caption: 'Possession is lost in midfield. The opponent has the ball, but their shape is stretched.' },
      { caption: 'Instead of retreating, the nearest players swarm the ball in the first seconds.', a: { CM1: [44, 48], CM2: [56, 48], CM3: [50, 56], LW: [36, 40], RW: [64, 40] },
        arrows: [{ from: [40, 52], to: [44, 48], kind: 'run' }, { from: [60, 52], to: [56, 48], kind: 'run' }, { from: [26, 30], to: [36, 40], kind: 'run' }, { from: [74, 30], to: [64, 40], kind: 'run' }] },
      { caption: 'The ball is won back while the opponent is still disorganised, and a pass goes forward at once.', ball: 'a:CM2', b: { M1: [46, 46] },
        arrows: [{ from: 'a:CM2', to: 'a:ST', kind: 'pass' }] },
      { caption: 'The striker receives with the defence still turning, and has only the keeper to beat.', ball: 'a:ST', a: { ST: [54, 13] }, b: { D1: [44, 24] },
        arrows: [{ from: [50, 20], to: [54, 13], kind: 'run' }] },
      { caption: 'GOAL. The attack began seconds after the ball was lost, before the opponent could regroup.', ball: NET_L, goal: true, arrows: [{ from: [54, 13], to: NET_L, kind: 'shot' }] },
    ],
  },
  'low-block': {
    id: 'low-block', view: 'half',
    a: { CM: [50, 54], W1: [8, 44], W2: [92, 44], AM: [50, 42], FB1: [20, 56], FB2: [80, 56] },
    b: { LB: [18, 10], CB1: [38, 8], CB2: [62, 8], RB: [82, 10], LM: [20, 22], CM1: [40, 22], CM2: [60, 22], RM: [80, 22], S1: [42, 34], S2: [58, 34] },
    ball: 'a:CM',
    zones: [{ x: 18, y: 10, w: 64, h: 12, label: 'Little space here', tone: 'warn' }],
    steps: [
      { caption: 'The defending team sits deep in two narrow lines, close to its own goal.' },
      { caption: 'The attackers circulate the ball, but there is almost no space between the lines.', ball: 'a:FB1', arrows: [{ from: 'a:CM', to: 'a:FB1', kind: 'pass' }, { from: 'a:FB1', to: 'a:W1', kind: 'pass' }] },
      { caption: 'Patient passing drags the block wide. The winger swings in a cross, and a midfielder arrives late.', ball: 'a:W1', a: { W1: [10, 36], AM: [50, 17] }, b: { LM: [14, 24], LB: [14, 12] },
        arrows: [{ from: [10, 36], to: [50, 17], kind: 'pass' }, { from: [50, 42], to: [50, 17], kind: 'run' }] },
      { caption: 'The late runner arrives in the one gap between the lines and meets the cross.', ball: 'a:AM' },
      { caption: 'GOAL. A compact block is hard to pass through, but a well-timed cross can still beat it.', ball: NET_R, goal: true, arrows: [{ from: [50, 17], to: NET_R, kind: 'shot' }] },
    ],
  },
  'half-spaces': {
    id: 'half-spaces', view: 'half',
    a: { AM: [30, 34], W: [8, 36], ST: [50, 18], FB: [10, 56], CM: [44, 54] },
    b: { LB: [14, 26], CB1: [38, 14], CB2: [62, 14], RB: [86, 26], DM: [44, 44] },
    ball: 'a:CM', zones: LANES,
    steps: [
      { caption: 'Five vertical lanes. The two half-spaces sit between the wide lanes and the centre.' },
      { caption: 'The attacker receives in the half-space. The full-back must step in or the centre-back must step out.', ball: 'a:AM', arrows: [{ from: 'a:CM', to: 'a:AM', kind: 'pass' }],
        b: { LB: [20, 30], CB1: [36, 18] } },
      { caption: 'Either choice leaves a gap. The attacker slips the ball to the striker, who has found it.', ball: 'a:ST', arrows: [{ from: 'a:AM', to: 'a:ST', kind: 'pass' }],
        a: { ST: [48, 16] }, zones: [{ x: 22, y: 6, w: 16, h: 18, label: 'Gap opens', tone: 'warn' }] },
      { caption: 'The striker turns inside the box with a shooting chance.', ball: 'a:ST', a: { ST: [48, 11] }, b: { CB1: [42, 15] } },
      { caption: 'GOAL. Receiving between the lines forced a defender to choose, and both choices left a gap.', ball: NET_R, goal: true, arrows: [{ from: [48, 11], to: NET_R, kind: 'shot' }] },
    ],
  },
  'false-nine': {
    id: 'false-nine', view: 'half',
    a: { ST: [50, 20], LW: [18, 30], RW: [82, 30], CM: [50, 56], CM2: [36, 50], CM3: [64, 50] },
    b: { CB1: [42, 14], CB2: [58, 14], LB: [24, 16], RB: [76, 16], DM: [50, 34] },
    ball: 'a:CM',
    steps: [
      { caption: 'A traditional striker stays on the last line, pinned by the two centre-backs.' },
      { caption: 'The false nine drops into midfield. A centre-back must decide: follow him, or let him turn.', a: { ST: [50, 40] }, arrows: [{ from: [50, 20], to: [50, 40], kind: 'run' }, { from: 'a:CM', to: [50, 40], kind: 'pass' }] },
      { caption: 'If the centre-back follows, space opens behind him and the wingers run inside into it.', b: { CB1: [46, 30] }, a: { LW: [36, 18], RW: [64, 18] },
        arrows: [{ from: [18, 30], to: [36, 18], kind: 'run' }, { from: [82, 30], to: [64, 18], kind: 'run' }], zones: [{ x: 36, y: 6, w: 28, h: 14, label: 'Space behind', tone: 'good' }] },
      { caption: 'The false nine plays the ball into the gap for the runner.', ball: 'a:RW', arrows: [{ from: [50, 40], to: [62, 18], kind: 'pass' }] },
      { caption: 'The winger cuts in with only the keeper and one defender to beat.', ball: 'a:RW', a: { RW: [60, 11] }, b: { CB2: [56, 15] } },
      { caption: 'GOAL. The striker who left the defensive line created the space for someone else to score.', ball: NET_L, goal: true, arrows: [{ from: [60, 11], to: NET_L, kind: 'shot' }] },
    ],
  },
  'inverted-full-backs': {
    id: 'inverted-full-backs', view: 'full',
    a: { GK: [50, 146], CB1: [38, 130], CB2: [62, 130], LB: [12, 116], RB: [88, 116], DM: [50, 106], CM1: [36, 88], CM2: [64, 88], LW: [10, 66], RW: [90, 66], ST: [50, 52] },
    b: { GK: [50, 2.5], F1: [40, 98], F2: [60, 98], M1: [30, 80], M2: [70, 80] },
    ball: 'a:GK',
    steps: [
      { caption: 'In a flat back four the full-backs stay wide, leaving the middle open to the opponent.' },
      { caption: 'The full-backs step inside into midfield. A box forms with the holding midfielder.', a: { LB: [30, 110], RB: [70, 110], DM: [50, 100] }, ball: 'a:CB1',
        arrows: [{ from: [12, 116], to: [30, 110], kind: 'run' }, { from: [88, 116], to: [70, 110], kind: 'run' }] },
      { caption: 'The wingers stay wide. The extra central players keep the ball and win the middle of the pitch.', ball: 'a:CM1', arrows: [{ from: 'a:LB', to: 'a:CM1', kind: 'pass' }] },
      { caption: 'Now outnumbered in the centre, the opponent cannot stop a pass through the lines to the striker.', ball: 'a:ST', a: { ST: [50, 28] },
        arrows: [{ from: 'a:CM1', to: [50, 28], kind: 'pass' }, { from: [50, 52], to: [50, 28], kind: 'run' }] },
      { caption: 'GOAL. Extra numbers in midfield gave the team control, and the striker was the end of the move.', ball: NET_R, goal: true, arrows: [{ from: [50, 28], to: NET_R, kind: 'shot' }] },
    ],
  },
  width: {
    id: 'width', view: 'half',
    a: { W1: [6, 40], W2: [94, 40], CM: [50, 56], R: [50, 34], ST: [60, 26] },
    b: { D1: [34, 18], D2: [46, 18], D3: [54, 18], D4: [66, 18], M1: [40, 30], M2: [60, 30] },
    ball: 'a:CM',
    steps: [
      { caption: 'The defence is compact, with all four defenders packed into the middle.' },
      { caption: 'Wide players hold the touchline. The defenders must stretch to cover them.', ball: 'a:W1', b: { D1: [24, 18], D4: [76, 18], D2: [42, 18], D3: [58, 18] }, arrows: [{ from: 'a:CM', to: 'a:W1', kind: 'pass' }] },
      { caption: 'A gap opens between the centre-backs, and a runner attacks it as the winger crosses.', a: { R: [50, 16] }, arrows: [{ from: [50, 34], to: [50, 16], kind: 'run' }, { from: 'a:W1', to: [50, 16], kind: 'pass' }],
        zones: [{ x: 42, y: 6, w: 16, h: 16, label: 'Gap', tone: 'good' }] },
      { caption: 'The runner meets the cross unmarked in the gap the width created.', ball: 'a:R', arrows: [] },
      { caption: 'GOAL. Stretching the defence sideways pulled the centre-backs apart.', ball: NET_L, goal: true, arrows: [{ from: [50, 16], to: NET_L, kind: 'shot' }] },
    ],
  },
  overloads: {
    id: 'overloads', view: 'half',
    a: { W: [14, 34], FB: [20, 52], CM: [32, 44], RW: [88, 34], ST: [50, 22] },
    b: { D1: [18, 30], D2: [30, 36], D3: [84, 30], D4: [48, 16], D5: [60, 18] },
    ball: 'a:W',
    zones: [{ x: 0, y: 20, w: 40, h: 40, label: '3 v 2', tone: 'good' }],
    steps: [
      { caption: 'The team shifts three players to the left flank against two defenders.' },
      { caption: 'A quick pass combination exploits the extra man.', ball: 'a:CM', arrows: [{ from: 'a:W', to: 'a:CM', kind: 'pass' }] },
      { caption: 'The free player reaches the byline and delivers the cross.', ball: 'a:FB', a: { FB: [10, 22] }, arrows: [{ from: 'a:CM', to: [10, 22], kind: 'pass' }, { from: [10, 22], to: [50, 14], kind: 'pass' }] },
      { caption: 'The striker attacks the cross while both defenders are still tied to the flank.', ball: 'a:ST', a: { ST: [50, 13] }, b: { D4: [45, 16] } },
      { caption: 'GOAL. Winning the 3 v 2 on the flank created a free crosser, and the finish followed.', ball: NET_R, goal: true, arrows: [{ from: [50, 13], to: NET_R, kind: 'shot' }] },
    ],
  },
  'counter-attacking': {
    id: 'counter-attacking', view: 'full',
    a: { GK: [50, 148], CB1: [38, 136], CB2: [62, 136], LB: [18, 136], RB: [82, 136], CM1: [40, 118], CM2: [60, 118], LW: [20, 104], RW: [80, 104], ST: [50, 94] },
    b: { GK: [50, 2.5], B1: [50, 124], B2: [30, 112], B3: [70, 112], B4: [40, 96], B5: [60, 96] },
    ball: 'b:B1',
    steps: [
      { caption: 'The opponent attacks and commits players forward, leaving space behind them.' },
      { caption: 'The ball is won deep in your own half.', ball: 'a:CM2', b: { B1: [52, 126] }, zones: [{ x: 10, y: 20, w: 80, h: 56, label: 'Space behind', tone: 'good' }] },
      { caption: 'One pass releases the striker into the space behind the opponent.', ball: 'a:ST', a: { ST: [50, 70], LW: [26, 80], RW: [74, 80] },
        arrows: [{ from: [60, 118], to: [50, 70], kind: 'pass' }, { from: [20, 104], to: [26, 80], kind: 'run' }, { from: [80, 104], to: [74, 80], kind: 'run' }] },
      { caption: 'The team sprints forward together, and the opponent is still running back.', ball: 'a:RW', a: { ST: [50, 30], LW: [30, 40], RW: [70, 38] },
        arrows: [{ from: [50, 70], to: [50, 30], kind: 'run' }, { from: [74, 80], to: [70, 38], kind: 'run' }] },
      { caption: 'The winger squares the ball to the striker for an open shot.', ball: 'a:ST', a: { ST: [52, 16] }, arrows: [{ from: [70, 38], to: [52, 16], kind: 'pass' }] },
      { caption: 'GOAL. Three passes from the turnover, before the opponent had recovered its shape.', ball: NET_L, goal: true, arrows: [{ from: [52, 16], to: NET_L, kind: 'shot' }] },
    ],
  },
  overlapping: {
    id: 'overlapping', view: 'half',
    a: { W: [22, 38], FB: [24, 58], CM: [46, 52], ST: [50, 24] },
    b: { D1: [20, 34], D2: [38, 22], D3: [62, 22] },
    ball: 'a:W',
    steps: [
      { caption: 'The winger has the ball with a defender tight to him. The full-back is behind.' },
      { caption: 'The full-back sprints round the outside. The defender must choose: follow him, or stay with the winger.', a: { FB: [12, 34] }, arrows: [{ from: [24, 58], to: [12, 30], kind: 'run' }] },
      { caption: 'The winger slips the pass into the run and the full-back is in behind.', ball: 'a:FB', a: { FB: [11, 24] }, arrows: [{ from: [22, 38], to: [11, 24], kind: 'pass' }] },
      { caption: 'He crosses to the striker, who has made his run between the centre-backs.', ball: 'a:ST', a: { ST: [48, 15] }, arrows: [{ from: [11, 24], to: [48, 15], kind: 'pass' }, { from: [50, 24], to: [48, 15], kind: 'run' }] },
      { caption: 'GOAL. The overlap beat the defender on the outside and delivered the cross.', ball: NET_R, goal: true, arrows: [{ from: [48, 15], to: NET_R, kind: 'shot' }] },
    ],
  },
  underlapping: {
    id: 'underlapping', view: 'half',
    a: { W: [12, 38], FB: [26, 58], CM: [46, 52], ST: [50, 22] },
    b: { D1: [14, 34], D2: [32, 22], D3: [62, 22] },
    ball: 'a:W',
    zones: [{ x: 20, y: 8, w: 18, h: 36, label: 'Half-space', tone: 'good' }],
    steps: [
      { caption: 'The winger holds the touchline with the ball; the defender is tight to him.' },
      { caption: 'The full-back runs inside, into the gap between the full-back and centre-back.', a: { FB: [30, 34] }, arrows: [{ from: [26, 58], to: [30, 32], kind: 'run' }] },
      { caption: 'The winger plays the ball inside, and the full-back arrives in a central shooting position.', ball: 'a:FB', a: { FB: [30, 24] }, arrows: [{ from: [12, 38], to: [30, 24], kind: 'pass' }] },
      { caption: 'GOAL. The underlap found the half-space the defenders could not cover.', ball: NET_L, goal: true, arrows: [{ from: [30, 24], to: NET_L, kind: 'shot' }] },
    ],
  },
}
