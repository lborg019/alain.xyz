import * as React from 'react';

/**
 * A custom image component similar to Medium's images.
 * Loads a tiny version of the image and replaces it with
 * The full size image when finished. 
 */
export class CustomImage extends React.Component<any, any> {
  
  static defaultProps = {
    style: {}
  }

  render() {
    let { style } = this.props;
    return <img/>
  }
}

export default CustomImage;