import * as React from 'react';

/**
 * Asynchonously loads a component
 */
class AsyncComponent extends React.Component<AsyncProps, AsyncState> {

}

type AsyncProps = {
  loading: (progress: number) => JSX.Element
  onFail: (error: string) => JSX.Element,
  onSuccess: (data) => JSX.Element
}

type AsyncState = {
  loading: boolean,
  mounted: boolean
}