/**
 * Portfolio Item Schema
 * Conforms to Schema.org Creative Work Open Schema
 * https://schema.org/CreativeWork
 */
export type PortfolioItem = {
  name: string,
  author: string,
  description: string,
  keywords: string[],
  datePublished: Date,
  dateModified: Date,
  permalink: string,
  image: string,
  icon: string,

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

type Thing = {
  name: string,
  description: string,
  image: string,
  url: string,
  keywords: string[]
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