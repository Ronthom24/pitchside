export interface Club {
  id: string
  name: string
  short_name?: string | null
  nickname?: string | null
  country_id?: string | null
  city?: string | null
  founded_year?: number | null
  crest_url?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  current_competition_id?: string | null
  identity_tags?: string[] | null
}

export interface Honour {
  competition_name: string
  count?: number | null
  years?: number[] | null
  scope: string
  as_of?: string | null
}

export interface Rivalry {
  club_a_id: string
  club_b_id: string
  name?: string | null
  summary: string
}

export interface ClubTimelineEvent {
  year: number
  title: string
  description?: string | null
}

export interface Stadium {
  id: string
  name: string
  city?: string | null
  capacity?: number | null
  opened_year?: number | null
}

export interface Manager {
  id: string
  name: string
  nationality_id?: string | null
  tactical_style?: string | null
  bio?: string | null
}

export interface ClubDetail extends Club {
  stadium_id?: string | null
  stadium?: Stadium | null
  manager?: Manager | null
  country_name?: string | null
  competition_name?: string | null
  facts_as_of?: string | null
  current_manager_id?: string | null
  playing_style_summary?: string | null
  typical_formation?: string | null
  history_summary?: string | null
  culture_summary?: string | null
  honours: Honour[]
  rivalries: Rivalry[]
  timeline: ClubTimelineEvent[]
}

export interface Player {
  id: string
  name: string
  nationality_id?: string | null
  position?: string | null
  current_club_id?: string | null
  photo_url?: string | null
  is_retired: boolean
  birth_date?: string | null
}

export interface CareerStint {
  club_id?: string | null
  club_name: string
  start_year?: number | null
  end_year?: number | null
}

export interface PlayerDetail extends Player {
  full_name?: string | null
  death_date?: string | null
  facts_as_of?: string | null
  shirt_number?: number | null
  playing_style?: string | null
  bio?: string | null
  nationality_name?: string | null
  current_club?: Club | null
  career: CareerStint[]
}

export interface Competition {
  id: string
  name: string
  category: string
  country_id?: string | null
  tier?: number | null
  format_summary?: string | null
  history_summary?: string | null
  founded_year?: number | null
  logo_url?: string | null
  live_data_available: boolean
}

export interface GlossaryTerm {
  id: string
  term: string
  category: string
  short_definition: string
  long_explanation?: string | null
  example?: string | null
  related_terms?: string[] | null
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface LessonTopic {
  id: string
  level: number
  order: number
  title: string
  summary: string
  body_markdown: string
  interactive_component?: string | null
  quiz?: QuizQuestion[] | null
  related_glossary_ids?: string[] | null
}

export interface HistoryEvent {
  id: string
  year: number
  era: string
  category: string
  title: string
  summary: string
  related_club_ids?: string[] | null
  related_competition_ids?: string[] | null
}

export interface HistoryEra {
  id: string
  label: string
  years: string
  blurb: string
}

export interface ClubMatch {
  club: Club
  matched_tags: string[]
  match_score: number
}

export interface SearchResults {
  clubs: Club[]
  players: Player[]
  competitions: Competition[]
  glossary: GlossaryTerm[]
  lessons: LessonTopic[]
  history: HistoryEvent[]
}

export interface LiveMatch {
  id: string
  competition_id: string
  matchday?: number | null
  kickoff_utc?: string | null
  status: string
  home_club_id?: string | null
  away_club_id?: string | null
  home_name: string
  away_name: string
  home_score?: number | null
  away_score?: number | null
}

export interface LiveEnvelope {
  live_available: boolean
  error?: string | null
  source?: string | null
  updated_at?: string | null
}

export interface LiveMatches extends LiveEnvelope {
  upcoming: LiveMatch[]
  recent: LiveMatch[]
}

export interface ClubLive extends LiveMatches {
  league_position?: { position: number; points: number; played: number; season: string; updated_at?: string | null; source?: string | null } | null
}

export interface StandingRow {
  position: number
  club_id?: string | null
  team_name: string
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  points: number
}

export interface Standings extends LiveEnvelope {
  season?: string | null
  rows: StandingRow[]
}

export interface AuthUser {
  id: number
  email: string
  display_name?: string | null
}

export interface MyState {
  user: AuthUser
  followed_clubs: { club_id: string; is_primary: boolean }[]
  progress: { lesson_id: string; completed: boolean; best_quiz_score?: number | null }[]
  bookmarks: { kind: string; ref_id: string }[]
}
