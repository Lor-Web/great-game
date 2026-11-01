export interface LeaderboardRecord {
  id: number
  nickname: string
  score: number
  avatar?: string
}

export interface LeaderBoardTableProps {
  players: LeaderboardRecord[]
}
