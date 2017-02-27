import * as React from 'react';

export class Background extends React.Component<any, any> {

  render() {
    return (
      <div>
        {background}
      </div>
    )
  }

}

var background = <div />;

export function setBackground(newBack: JSX.Element) {
  background = newBack;
}