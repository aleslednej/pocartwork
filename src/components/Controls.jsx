export function Controls({ autoRotate, onAutoRotateToggle, onReset }) {
  return (
    <div className="controls">
      <button
        className={autoRotate ? 'active' : ''}
        onClick={onAutoRotateToggle}
      >
        {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
      </button>
      <button onClick={onReset}>
        Reset View
      </button>
    </div>
  );
}
