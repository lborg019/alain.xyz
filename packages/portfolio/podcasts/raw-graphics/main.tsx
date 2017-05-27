import * as React from 'react';
import { Icon } from 'main';

export default class RawGraphics extends React.Component<any, any> {

  componentDidMount() {
    if (window) {
      document.title = this.props.config.title;
    }
  }

  render() {

    if (!this.props.config)
      return null;

    return (
        <iframe src="https://player.twitch.tv/?channel=alaingalvan" scrolling="no" height="100%" width="100%"/>
    );
  }
}
