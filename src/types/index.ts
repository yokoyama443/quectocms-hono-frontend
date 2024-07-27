/* eslint-disable */
export type User = {
  /** ユーザーID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** ユーザー名 */
  username: string
  /** ユーザー詳細 */
  detail: string
  /** アイコンURL */
  icon: string
}

export type FullUser = {
  /** ユーザーID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** ユーザー名 */
  username: string
  /** メールアドレス */
  email: string
  /** ユーザー詳細 */
  detail: string
  /** アイコンURL */
  icon: string
  /** ロール */
  role: 'admin' | 'editor'
}

export type UserHead = {
  /** ユーザーID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** ユーザー名 */
  username: string
  /** アイコンURL */
  icon: string
}

export type Group = {
  /** グループID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** グループ名 */
  name: string
}

export type Article = {
  /** 記事ID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** Locator */
  name: string
  /** タイトル */
  title: string

  author: User

  /** サムネイルURL */
  thumbnail?: string | undefined
  /** 記事概要 */
  description?: string | undefined
  /** 本文 */
  body: string
  Series?: SeriesHead[] | undefined
  tags?: Tag[] | undefined
  /** Create用タグ作成 */
  tag_names?: string | undefined
  /** 公開設定 */
  is_public: boolean
}

export type ArticleHeads = {
  articles: ArticleHead[]
  page: number
  per_page: number
  total_pages: number
  total_items: number
}

export type Series = {
  /** シリーズID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** Locator */
  name: string
  /** タイトル */
  title: string
  tags?: Tag[] | undefined
  /** Create用タグ作成 */
  tag_names?: string | undefined
  articles: SeriesArticle[]
}

export type SeriesArticle = {
  priolity: number

  article: ArticleHead

  /** 記事ID */
  article_id?: number | undefined
}

export type SeriesHeads = {
  series: SeriesHead[]
  page: number
  per_page: number
  total_pages: number
  total_items: number
}

export type SeriesHead = {
  /** シリーズID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** Locator */
  name: string
  /** タイトル */
  title: string
  tags?: Tag[] | undefined
  articles: ArticleHead[]
}

export type Tag = {
  /** タグID */
  id: number
  /** タグ名 */
  name: string
}

export type ArticleHead = {
  /** 記事ID */
  id: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at?: string | undefined
  /** Locator */
  name: string
  /** タイトル */
  title: string
  author?: UserHead | undefined
  /** サムネイルURL */
  thumbnail?: string | undefined
  /** 記事概要 */
  description?: string | undefined
  tags?: Tag[] | undefined
  /** 公開設定 */
  is_public: boolean
}

export type PatchedFullUser = {
  /** ユーザー名 */
  username?: string | undefined
  /** メールアドレス */
  email?: string | undefined
  /** ユーザー詳細 */
  detail?: string | undefined
  /** アイコンURL */
  icon?: string | undefined
  /** ロール */
  role?: 'admin' | 'editor' | undefined
}

export type PatchedArticle = {
  /** Locator */
  name?: string | undefined
  /** タイトル */
  title?: string | undefined
  /** サムネイルURL */
  thumbnail?: string | undefined
  /** 記事概要 */
  description?: string | undefined
  /** 本文s */
  body?: string | undefined
  tag_names?: string | undefined
  /** 公開設定 */
  is_public?: boolean | undefined
}

export type PatchedSeries = {
  /** Locator */
  name?: string | undefined
  /** タイトル */
  title?: string | undefined
  tag_names?: string | undefined
  articles?: SeriesArticle[] | undefined
}

export type PatchedGroup = {
  /** グループ名 */
  name?: string | undefined
}

export type PatchedUser = {
  /** ユーザー名 */
  username?: string | undefined
  /** メールアドレス */
  email?: string | undefined
  /** ユーザー詳細 */
  detail?: string | undefined
  /** アイコンURL */
  icon?: string | undefined
}

export type Register = {
  /** ユーザー名 */
  username: string
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** ホストパスワード */
  host_password: string
}

export type Login = {
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
}

export type PatchedConfig = {
  /** ホストパスワード */
  host_password: string
  /** コンテンツサーバーアドレス */
  contents_server_address: string
}

export type Error = {
  /** HTTPステータスコード */
  status: number
  /** エラーのタイトル */
  title: string
  /** エラーの詳細な説明 */
  detail?: string | undefined
}

export type BadRequest = Error

export type Unauthorized = Error

export type Forbidden = Error

export type NotFound = Error

export type InternalServerError = Error
