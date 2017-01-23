import * as React from 'react';
import { Link } from 'react-router';

export class NotFound extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Link>Go Home</Link>
      </div>
    )
  }
}

export default NotFound;
