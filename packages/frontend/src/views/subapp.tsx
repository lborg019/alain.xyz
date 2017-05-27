import * as React from 'react';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Loading } from '../components/loading';
import { fetchSubapp, setSubapp, failure, APIResponse } from '../store/actions';

@(connect(
    ({
        subapp,
        fetchingSubapp,
        portfolio,
        error
    }) => ({
            error,
            loading: fetchingSubapp,
            portfolio,
            subapp
        }),
    dispatch => ({
        failure: bindActionCreators(failure, dispatch),
        fetchSubapp: bindActionCreators(fetchSubapp, dispatch),
        setSubapp: bindActionCreators(setSubapp, dispatch)
    })
) as any)
export class Subapp extends React.Component<any, SubappState> {

    static defaultProps = {
        portfolio: [],
        subapp: null,
        loading: true,
        error: null
    }

    public state = {
        loading: true,
        mounted: false
    };

    private subComponent: any = null;

    componentWillMount() {
        let {
            subapp,
            location
        } = this.props;

        if (subapp !== null) {
            if (subapp.permalink !== location.pathname) {
                this.querySubapp(location.pathname);
            }
            else
                this.attachSubapp(subapp);

        }
        else {
            this.querySubapp(location.pathname);
        }
    }

    componentWillReceiveProps(newProps) {
        let {
            subapp: prevSubapp,
            location: prevLocation,
            portfolio: prevPortfolio
        } = this.props;

        let {
            subapp,
            portfolio,
            location,
            loading,
            error,
        } = newProps;

        this.checkLoadingState(loading, error);

        let changedLocation = location !== prevLocation;
        let changedSubapp = subapp !== prevSubapp;
        let changedPortfolio = portfolio !== prevPortfolio;

        // Base Case: Errors redirect to 404.
        if (error) {
            this.subComponent = <Redirect to='/404' />
            this.setState({ loading: false, mounted: true });
        }
        // Query if the location changed
        if (changedLocation || changedPortfolio) {
            this.querySubapp(location.pathname || prevLocation.pathname);
        }
        // Attach if the subapp changed
        if (changedSubapp) {
            this.attachSubapp(subapp);
        }

    }

    /**
     * Checks the mounted/loading state of the component
     */
    checkLoadingState = (loading: boolean, error: string | null) => this.setState((prev) => ({
        loading,
        mounted: loading
            ? false
            : (error
                ? true
                : prev.mounted
            )
    }));

    /**
     * Query if the subapp exists in the Redux Store
     */
    querySubapp = (pathname: string) => {

        let {
            fetchSubapp,
            portfolio,
            setSubapp,
            subapp
        } = this.props;

        let cached = portfolio.find(({ permalink }) => permalink == pathname);

        if (cached) {
            setSubapp(cached.permalink);
        }
        else
            fetchSubapp({ permalink: pathname });
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
                    this.setState({ loading: false, mounted: true });
                })
                .catch(err => {
                    console.error(err);
                    failure(err);
                    this.subComponent = <Redirect to='/404' />;
                    this.setState({ loading: false, mounted: true });
                });
    }

    render() {
        if (this.state.loading || !this.state.mounted)
            return <Loading />;

        if (this.props.subapp) {
            if (this.subComponent !== null)
                return this.subComponent;
            else
                return <Loading />
        }
        return <Redirect to='/404' />;
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
    loading: boolean,
    mounted: boolean
}