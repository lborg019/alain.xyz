import * as React from 'react';

export class LogoIcon extends React.Component<any, any> {

  render() {
    return (
      <svg style={this.props.style} viewBox="0 0 64 64">
        <linearGradient id="ag-logo-gradient" gradientUnits="userSpaceOnUse" x1="40" y1="8.6218748" x2="40" y2="29.3781242" gradientTransform="matrix(1 0 0 -1 0 65)">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.8" />
        </linearGradient>
        <image xlinkHref="/assets/brand/appicon-back.jpg" width="64" height="64" />
        <path style={{ fill: 'none', stroke: 'url(#ag-logo-gradient)', strokeWidth:5, strokeMiterlimit:10}} d="M24,48.3l11.2-11.2c0.7-0.7,1.8-0.7,2.5,0L56,55.4"/>
      </svg>
    );
  }
}