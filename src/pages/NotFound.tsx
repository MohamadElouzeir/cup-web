import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
    <div className="text-8xl md:text-9xl font-display font-black shimmer-text mb-6">404</div>
    <p className="text-coffee-50/70 max-w-md mb-8">
      This cup has spilled. The page you're looking for doesn't exist.
    </p>
    <Link to="/" className="btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
