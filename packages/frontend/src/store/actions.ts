import { transport, checkHttpStatus, parseJSON } from './utils';

export type APIRequest = {
  permalink?: string,
  data?: boolean,
  keywords?: string[],
  meta?: {
    likes?: number,
    views?: number,
    social?: { name: string, url: string }[]
  }
}

export type APIResponse = {
  permalink: string,
  title: string,
  description: string,
  main: string,
  data: string,
  keywords: string[],
  datePublished: Date,
  dateModified: Date,
  meta?: {
    likes: number,
    views: number,
    social: { name: string, url: string }[]
  }
}

export const failure = (error = 'Couldn\'t find that page...') => ({
  type: 'ERROR',
  payload: { error }
});

export const toggleSidebar = () => ({
  type: 'SIDEBAR'
});

export const toggleFullscreen = () => ({
  type: 'FULLSCREEN'
})

const fetchingSubapp = () => ({
  type: 'FETCHING_SUBAPP'
});

const fetchedSubapp = (req: APIRequest, res: APIResponse[]) => ({
  type: 'FETCHED_SUBAPP',
  payload: { req, res }
});

export const setSubapp = (permalink: string) => ({
  type: 'SET_SUBAPP',
  payload: { permalink }
})

export const fetchSubapp = (req: APIRequest) =>
  dispatch => {
    let fail = err => dispatch(failure());
    dispatch(fetchingSubapp());
    return transport('/api/v1/portfolio', req)
      .catch(fail)
      .then(checkHttpStatus, fail)
      .then(parseJSON, fail)
      .then(res => dispatch(fetchedSubapp(req, res)), fail);
    };