import * as React from 'react';
import IconPaths from './icon-paths';

interface IconProps {
  style?: Object,
  size?: number,
  type?: string
}

interface IconState {
  paths: string[]
}

export class Icon extends React.Component<IconProps, IconState> {
  static defaultProps = {
    size: 16,
    type: 'menu',
    style: {}
  };

  public state = { paths: IconPaths[this.props.type] }

  render() {
    var styles = {
      fill: "currentcolor",
      verticalAlign: "middle",
      width: this.props.size,
      height: this.props.size
    };
    return (
      <svg viewBox="0 0 16 16" style={Object.assign({}, styles, this.props.style)}>
        <g>
          {this.state.paths.map((p, i) => { return <path key={i} d={p}/> })}
        </g>
      </svg>
    );
  }
}
