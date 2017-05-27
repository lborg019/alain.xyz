import { APIRequest, APIResponse } from './actions';
import { createReducer } from './utils';


const initialState = {
    error: null,            // API Errors
    fetchingSubapp: false,  // Loading
    fullscreen: false,      // Fullscreen Application
    portfolio: [],          // Cached SubApplications
    showSidebar: false,     // Show Sidebar
    subapp: null            // Current SubApplication
};

// Keep Portfolio Cache a max of 100 subapps long.
let cachePortfoliosubapps = (subapps: APIResponse[], portfolio: APIResponse[]) => {

    if (!Array.isArray(subapps))
        return portfolio;

    let cache = [...portfolio];

    // check to see if it's in the cache
    // if it is in the cache, replace it if the data field is empty.
    for (let subapp of subapps) {
        let index = cache.findIndex((v) => v.permalink === subapp.permalink);
        if (index > -1) {
            if (subapp['data'] !== undefined)
                cache[index] = subapp;
        } else {
            cache = [...cache, subapp].sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
        }
    }

    return cache.slice(0, 100);
}

export default createReducer(initialState, {

    FETCHED_SUBAPP: (state, payload: { req: APIRequest, res: APIResponse[] }) => {

        let portfolio = cachePortfoliosubapps(payload.res, state.portfolio);
        
        return {
            ...state,
            error: null,
            portfolio
        };
    },

    FETCHING_SUBAPP: (state, payload) =>
        ({
            ...state,
            error: null,
            fetchingSubapp: false
        }),

    SET_SUBAPP: (state, payload) =>
        ({
            ...state,
            error: null,
            fetchingSubapp: false,
            subapp: state.portfolio.find((e) => e.permalink === payload.permalink) || null
        }),

    ERROR: (state, payload) =>
        ({
            ...state,
            error: payload.error,
            fetchingSubapp: false,
            subapp: null
        }),

    FULLSCREEN: (state, payload) =>
        ({
            ...state,
            fullscreen: !state.fullscreen
        }),

    SIDEBAR: (state, payload) =>
        ({
            ...state,
            showSidebar: !state.showSidebar
        })
});
