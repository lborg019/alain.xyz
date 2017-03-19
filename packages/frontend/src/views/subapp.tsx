import * as React from 'react';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NotFound } from './notfound';
import { Loading } from '../components/loading';
import { fetchSubapp, setSubapp, failure, APIResponse } from '../store/actions';
import { transport } from '../store/utils';


@connect(
    ({ subapp, fetchingSubapp, portfolio }) => ({
        subapp,
        loading: fetchingSubapp,
        portfolio
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
        subapp: null,
        loading: true
    }

    public state = {
        loading: true
    };

    private subComponent: any = null;

    componentWillMount() {

        let {
            subapp,
            location,
            loading
        } = this.props;

        this.setState(() => ({ loading }));

        this.querySubapp(location);

        if (subapp !== null)
            this.attachSubapp(subapp);
    }

    componentWillReceiveProps(newProps) {
        
        let {
            subapp,
            location,
            loading
        } = newProps;

        this.setState(() => ({ loading }));

        if (location && location !== this.props.location)
            this.querySubapp(location);

        if (subapp !== null)
            this.attachSubapp(subapp);
    }

    /**
     * Query if the subapp exists in the Redux Store
     */
    querySubapp = (location) => {

        this.setState({ loading: true });

        let {
            portfolio,
            setSubapp,
            fetchSubapp
        } = this.props;

        let isCached = (arr, path) => arr.find(
            post => post.permalink === path
        );

        let cached = isCached(portfolio, location.pathname);

        if (cached)
            setSubapp(cached.permalink);
        else
            fetchSubapp({ permalink: location.pathname });
    }

    /**
     * Attach the subapp to be mounted by the render() method.
     */
    attachSubapp = ({ main }: APIResponse) => {

        let { subapp, location, failure } = this.props;

        if (typeof SystemJS !== 'undefined')
            SystemJS.import(main)
                .then(({ default: AsyncApp }) => {
                    this.subComponent = <AsyncApp config={this.props.subapp} location={this.props.location} />;
                    this.setState({ loading: false });
                })
                .catch(err => {
                    console.error(err);
                    failure(err);
                    this.subComponent = <Redirect to='/404' />
                    this.setState({ loading: false });
                });
    }

    render() {
        if (this.state.loading)
            return <Loading />;

        if (this.props.subapp) {
            if (this.subComponent !== null)
                return this.subComponent;
            else
                return <Loading />
        }
        return <Redirect to='/404' />
    }
}

type SubappProps = {
    location: {
        pathname: string
    },
    portfolio: APIResponse[],
    subapp: APIResponse,
    loading: boolean,
    fetchSubapp: typeof fetchSubapp,
    setSubapp: typeof setSubapp,
    failure: typeof failure
}

type SubappState = {
    loading: boolean
}