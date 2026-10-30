export interface TopicRecord {
  id: string
  title: string
  lastMessage: string
  themes: number
  messages: number
}

export interface ForumPageProps {
  topics: Array<TopicRecord>
}

export interface MessageProps {
  id: string
  content: string
  time: string
  author: {
    avatar?: string
    name: string
  }
}
export interface ThemeReacord {
  id: string
  title: string
  author: string
  lastMessage: string
  answers: number
}
