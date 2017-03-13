import * as React from 'react';
import IconPaths from './icon-paths';

type IconProps = {
  style?: Object,
  size?: number,
  type?: string
}

export class Icon extends React.Component<IconProps, any> {
  static defaultProps = {
    size: 16,
    type: 'menu',
    style: {}
  };

  render() {
    let { type, size } = this.props;

    let paths = IconPaths[type] || [];
    if (typeof paths === 'string')
      paths = IconPaths[paths];

    return (
      <svg
        viewBox="0 0 16 16"
        style={{
          ...styles,
          width: size,
          height: size,
          ...this.props.style
        }}>
        <g>
          {paths.map((p, i) => { return <path key={i} d={p} /> })}
        </g>
      </svg>
    );
  }
}

const styles = {
  fill: 'currentcolor',
  verticalAlign: 'middle'
};