import * as React from 'react';

export const Loading = () => (
  <div style={styles}>
    <svg viewBox="0 0 160 112" className="ag-loading">
      <path d="M8,72l50.3-50.3c3.1-3.1,8.2-3.1,11.3,0L152,104"></path>
    </svg>
  </div>
);

const styles = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100
};
