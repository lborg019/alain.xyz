import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Loading } from '../components/loading';
import { fetchSubapp, setSubapp, failure, APIResponse } from '../store/actions';


type SubappProps = {
    location: {
        pathname: string
    },
    portfolio: APIResponse[],
    subapp: APIResponse,
    fetchSubapp: typeof fetchSubapp,
    setSubapp: typeof setSubapp,
    failure: typeof failure
}

type SubappState = {
    loading: boolean
}

@connect(
    state => ({
        subapp: state.subapp,
        portfolio: state.portfolio
    }),
    dispatch => ({
        fetchSubapp: bindActionCreators(fetchSubapp, dispatch),
        setSubapp: bindActionCreators(setSubapp, dispatch),
        failure: bindActionCreators(failure, dispatch)
    })
)
export class Subapp extends React.Component<SubappProps, SubappState> {

    static defaultProps = {
        portfolio: [],
        subapp: null
    }

    public state = {
        loading: true
    };

    private subComponent: React.ComponentClass<any> = null;

    componentWillMount() {
        var {subapp, location} = this.props;
        this.querySubapp();

        if (subapp !== null)
            this.attachSubapp(subapp);
    }

    componentWillReceiveProps(newProps) {
        let {subapp, location} = newProps;

        if (location && location !== this.props.location)
            this.querySubapp();

        if (subapp !== null)
            this.attachSubapp(subapp);
    }

    querySubapp = () => {
        this.setState({ loading: true });

        let {portfolio, location, setSubapp, fetchSubapp} = this.props;
        let isCached = (arr, path) => arr.find(
            (post) => post.permalink === location.pathname
        );

        let cached = isCached(portfolio, location.pathname);

        if (cached)
            setSubapp(cached.permalink);
        else
            fetchSubapp({ permalink: location.pathname });
    }

    attachSubapp = (sa) => {
        let {subapp, failure} = this.props;
        System.import(sa.main)
            .then((res) => {
                this.subComponent = res.default;
                this.setState({ loading: false });
            })
            .catch((err) => {
                console.error(err);
                failure(err);
                this.setState({ loading: true });
            });
    }

    render() {
        if (!this.state.loading && typeof this.subComponent !== null)
            return <this.subComponent config={this.props.subapp} location={this.props.location} />;

        return <Loading />;
    }
}