import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// Simulates an expensive subtree that renders when the tooltip opens.
// This delays the commit of the transition update, widening the window
// where Tooltip's internal `open` closure is stale.
function SlowItem() {
  const start = performance.now();
  while (performance.now() - start < 30) {
    // busy
  }
  return <i>.</i>;
}

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const openCount = React.useRef(0);
  const closeCount = React.useRef(0);

  const log = (msg) => setEvents((prev) => [...prev, msg]);

  return (
    <div style={{ padding: 50, fontFamily: 'sans-serif' }}>
      <h2>MUI Tooltip: onClose skipped in controlled mode (React 18)</h2>
      <ol>
        <li>Hover the button and wait for the tooltip to appear.</li>
        <li>Move the mouse away.</li>
        <li>
          The tooltip <b>stays open forever</b>: <code>onClose</code> was never
          called, because Tooltip&apos;s <code>handleClose</code> read a stale{' '}
          <code>open === false</code> and skipped the callback.
        </li>
      </ol>
      <p style={{ color: '#666' }}>
        The parent applies <code>open</code> via{' '}
        <code>React.startTransition</code> (idiomatic React 18 for non-urgent
        UI). An expensive subtree delays the commit, so the mouseleave-driven{' '}
        <code>handleClose</code> runs before the <code>open=true</code> render
        commits — and reads the stale value.
      </p>

      <Tooltip
        title="Hello World"
        open={open}
        onOpen={(event) => {
          openCount.current += 1;
          log(`onOpen called (open prop was ${open})`);
          React.startTransition(() => setOpen(true));
        }}
        onClose={(event) => {
          closeCount.current += 1;
          log(`onClose called (open prop was ${open})`);
          setOpen(false);
        }}
      >
        <Button variant="contained" size="large" style={{ fontSize: 18, padding: '12px 24px' }}>
          Hover me, then move away
        </Button>
      </Tooltip>

      <div style={{ marginTop: 32 }}>
        <b>
          onOpen calls: {openCount.current} &nbsp; onClose calls: {closeCount.current}
        </b>
        {openCount.current > closeCount.current && (
          <div style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
            BUG REPRODUCED — onClose was skipped, tooltip is stuck open
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          {events.map((msg, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 13 }}>
              {msg}
            </div>
          ))}
        </div>
      </div>

      {/* expensive subtree rendered while the tooltip is open */}
      <div style={{ color: '#ccc' }}>
        {open
          ? Array.from({ length: 10 }, (_, i) => <SlowItem key={i} />)
          : null}
      </div>
    </div>
  );
}
