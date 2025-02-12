export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    
    // If we're at /reality, internally rewrite to /content/reality.html
    if (url.pathname === '/reality') {
      url.pathname = '/content/reality.html';
      request = new Request(url, request);
    }
    
    // If we're at /content/reality, redirect to /reality
    if (url.pathname === '/content/reality') {
      return Response.redirect(new URL('/reality', request.url), 301);
    }
    
    return next(request);
  }