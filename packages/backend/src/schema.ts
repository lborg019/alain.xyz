/**
 * Portfolio Item Schema
 */
export type PortfolioItem = {
  title: string,
  authors: string[],
  description: string,
  keywords: string[],
  datePublished: Date,
  dateModified: Date,
  permalink: string,
  image: string,

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