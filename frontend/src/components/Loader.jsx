const Loader = ({ size = 'md' }) => (
  <div className="loader-container">
    <div className="loader" style={size === 'sm' ? { width: 28, height: 28 } : {}}></div>
  </div>
);

export default Loader;
