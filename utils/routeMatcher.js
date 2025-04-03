const { pathToRegexp } = require('path-to-regexp'); // Correct import

/**
 * Checks if the requested route matches any of the allowed routes.
 * @param {string} requestedRoute - The route being accessed (e.g., "/categories/edit/123").
 * @param {string[]} allowedRoutes - The list of allowed routes (e.g., ["/categories", "/categories/edit/:id"]).
 * @returns {boolean} - True if the route is allowed, false otherwise.
 */
// utils/routeMatcher.js
const isRouteAllowed = (requestedRoute, allowedRoutes) => {
  return allowedRoutes.some(route => {
    // Handle dynamic routes with parameters (e.g., /edit/:id)
    const routePattern = route.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(requestedRoute);
  });
};

module.exports = { isRouteAllowed };