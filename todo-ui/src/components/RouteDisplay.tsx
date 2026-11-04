import React from 'react';
import { Link, useLocation } from 'react-router';

function RouteDisplay() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Determine the parent route
  let parentPath = '/';
  if (pathParts.length > 0) {
    // If it's a 'todo/:id' route, the parent is '/'
    if (pathParts[0] === 'todo') {
      parentPath = '/';
    } else {
      // For other routes, we go one level up
      const parentParts = pathParts.slice(0, -1);
      parentPath = '/' + parentParts.join('/');
    }
  }

  return (
    <p>
      <strong className="font-bold">Current route path:</strong> {location.pathname}{' '}
      <Link to={parentPath}>Go back</Link>
    </p>
  );
}

export default RouteDisplay;
