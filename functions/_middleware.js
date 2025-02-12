export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    
    // Simple mapping of clean URLs to content
    const routes = {
      '/reality': '/content/reality.html'
    };
  
    // If this is a clean URL we want to handle
    if (routes[url.pathname]) {
      // Create a new request with the content path
      const newRequest = new Request(request);
      newRequest.url = new URL(routes[url.pathname], request.url).toString();
      
      // Return the response from the content path
      return next(newRequest);
    }
  
    // For all other URLs, pass through unchanged
    return next(request);
  }