import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

export default function App() {
  const [open, setOpen] = React.useState(false);
  const log = React.useState([]);
  const l = React.useRef([]);
  const oc = React.useRef(0);
  const cc = React.useRef(0);
  const [t, u] = React.useState(0);
  const add = (s) => { l.current = [...l.current, s]; u(n => n + 1); };
  return React.createElement('div', { style: { padding: 50, fontFamily: 'sans-serif' } },
    React.createElement('h2', null, 'Tooltip onClose bug (controlled mode)'),
    React.createElement('p', null, 'Hover button, wait for tooltip (100ms), then move away quickly.'),
    React.createElement(Tooltip, {
      open, enterDelay: 100, title: 'Hello World',
      onOpen: () => { oc.current++; add('onOpen (open=' + open + ')'); setOpen(true); },
      onClose: () => { cc.current++; add('onClose (open=' + open + ')'); setOpen(false); }
    }, React.createElement(Button, { variant: 'contained', size: 'large', style: { fontSize: 18, padding: '12px 24px' } }, 'Hover me')),
    React.createElement('div', { style: { marginTop: 24 } },
      React.createElement('b', null, 'onOpen: ' + oc.current + '  onClose: ' + cc.current),
      oc.current > 0 && oc.current > cc.current &&
        React.createElement('div', { style: { color: 'red', fontWeight: 'bold' } }, 'BUG REPRODUCED!'),
      l.current.map((m, i) => React.createElement('div', { key: i, style: { fontFamily: 'monospace', fontSize: 13 } }, m))
    )
  );
}
