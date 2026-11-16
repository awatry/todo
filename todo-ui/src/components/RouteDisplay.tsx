import React from 'react';
import { Link, useLocation } from 'react-router';

function RouteDisplay() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Determine the parent route
  let parentPath = '/';
  if (pathParts.length > 0) {
    // /todo/:id/create-list-item goes back to the list
    if (pathParts[0] === 'todo' && pathParts.length === 3 && pathParts[2] === 'create-list-item') {
      parentPath = `/todo/${pathParts[1]}`;
    } else if (pathParts[0] === 'todo') {
      // If it's a 'todo/:id' route, the parent is '/'
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
