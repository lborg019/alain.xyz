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
 * Redirection Schema | 
 * Ex: { from: '/blog/raw-vulkan/cover.jpg', to: 'D:/Pictures/...'}
 * Or: { from '/blog', to '/blog/*' } 
 */
export type Redirect = {
  from: string,
  to: string
}