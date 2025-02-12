export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    
    // Define a mapping of clean URLs to their content paths
    const urlMapping = {
      '/reality': '/content/reality.html'
    };
  
    // Check if this is a clean URL we want to handle
    if (urlMapping[url.pathname]) {
      // Only rewrite the internal request, don't redirect
      const newUrl = new URL(request.url);
      newUrl.pathname = urlMapping[url.pathname];
      return next(new Request(newUrl, request));
    }
  
    // For all other requests, just pass them through
    return next(request);
  }