// Cronometer implementation using a state machine approach
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const output = document.querySelector('output');
let currentState = 'stopped';
let timeInMs = 0;

// Helper functions
function formatTime(ms) {
  // Calculate time components from milliseconds
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const secs = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10); // 0-99

  // Format the output string based on the time components, outputting only the relevant parts
  let result = '';
  if (days > 0) result += `${String(days).padStart(2, '0')} d `;
  if (hours > 0 || days > 0) result += `${String(hours).padStart(2, '0')} h `;
  if (minutes > 0 || hours > 0 || days > 0) result += `${String(minutes).padStart(2, '0')} m `;
  result += `${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')} s`;

  return result;
}

function updateOutput(dif) {
  timeInMs += dif ? dif : 0;
  output.innerText = formatTime(timeInMs);
};

/*
State machine:

Possible states:
- Stopped   : the timer is not running
- Running   : the timer is running

Transitions:
- Stopped   →[start button]→ Running   {{            }}
- Stopped   →[reset button]→ Stopped   {{ output = 0 }}
- Running   →[pause button]→ Stopped   {{            }}
- Running   →[reset button]→ Stopped   {{ output = 0 }}
*/
function stateMachine(event) {
  let stateChanged = false;

  switch (currentState) {

    case 'stopped':
      switch (event) {

        case 'start':
          currentState = 'running';
          stateChanged = true;
          break;

        case 'reset':
          timeInMs = 0;
          updateOutput();
          break;
      }

    case 'running':
      switch (event) {

        case 'pause':
          currentState = 'stopped';
          stateChanged = true;
          break;

        case 'reset':
          timeInMs = 0;
          currentState = 'stopped';
          stateChanged = true;
          updateOutput();
          break;
      }
  }

  if (stateChanged) {
    btnStart.disabled = currentState === 'running';
    btnPause.disabled = currentState === 'stopped';
  }
};

// Event listeners
btnStart.addEventListener('click', () => stateMachine('start'));
btnPause.addEventListener('click', () => stateMachine('pause'));
btnReset.addEventListener('click', () => stateMachine('reset'));
window.addEventListener('keypress', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    stateMachine(currentState === 'running' ? 'pause' : 'start');
  } else if (event.code === 'KeyR') {
    event.preventDefault();
    stateMachine('reset');
  }
});

// Initialize
btnStart.disabled = false;
btnPause.disabled = true;
updateOutput();

// Update output every 50ms when running
setInterval(() => {
  if (currentState === 'running') {
    updateOutput(50);
  }
}, 50)
