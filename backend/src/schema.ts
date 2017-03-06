/**
 * Portfolio Item Schema
 */
export type PortfolioItem = {
  permalink: string,
  cover: string,
  icon: string,
  authors: string[],
  title: string,
  description: string,
  tags: string[],
  publishDate: Date,
  lastUpdated: Date,
  // Analytics
  views: number,
  social: {
    [index: string]: {
      name: string,
      url: string,
      id: string
    }
  },
  // App Data
  main: string,
  data: any
}

/**
 * Redirection Schema
 */
export type Redirect = {
  from: string,
  to: string
}