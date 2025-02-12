export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    
    // Define mappings both ways
    const cleanToContent = {
      '/reality': '/content/reality.html'
    };
    
    const contentToClean = {
      '/content/reality': '/reality'
    };
  
    // If we hit a content URL, redirect to clean URL
    if (contentToClean[url.pathname]) {
      return Response.redirect(`${url.origin}${contentToClean[url.pathname]}`, 301);
    }
  
    // If we hit a clean URL, do internal rewrite
    if (cleanToContent[url.pathname]) {
      const newUrl = new URL(request.url);
      newUrl.pathname = cleanToContent[url.pathname];
      return next(new Request(newUrl, request));
    }
  
    // For all other requests, pass through
    return next(request);
  }