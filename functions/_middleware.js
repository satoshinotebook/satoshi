export async function onRequest({ request, env, next }) {
    const url = new URL(request.url);
    
    // Simple mapping of clean URLs to content
    const routes = {
      '/reality': '/content/reality.html'
    };
  
    // If this is a clean URL we want to handle
    if (routes[url.pathname]) {
      // Create a new URL object with the content path
      const newUrl = new URL(url.href);
      newUrl.pathname = routes[url.pathname];
      
      // Create a new request with the modified URL
      return fetch(new Request(newUrl, request));
    }
  
    // For all other URLs, pass through unchanged
    return next(request);
  }