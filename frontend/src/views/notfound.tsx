import * as React from 'react';
import { Link } from 'react-router-dom';

export class NotFound extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Link to="/">Go Home</Link>
      </div>
    )
  }
}
