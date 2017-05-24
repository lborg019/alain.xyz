import * as React from 'react';
import { Icon } from 'main';

export default class CodeVR extends React.Component<any, any> {

  private root = null;

  componentDidMount() {
    if (window && this.root) {
      window.scrollTo(0, 0);
      document.title = this.props.config.title;
    }
  }

  render() {

    if (!this.props.config)
      return null;

    let { title, description, image, meta, datePublished, keywords, data } = this.props.config;

    let date = new Date(datePublished);
    return (
      <div ref={r => this.root = r} style={styles.root}>
      </div>
    );
  }
}

const styles = {
  root: {
    width: '100%'
  }
}