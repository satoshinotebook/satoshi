export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    
    // Simple one-way internal rewrite
    if (url.pathname === '/reality') {
      return next({
        ...request,
        url: `${url.origin}/content/reality.html`
      });
    }
  
    return next(request);
  }