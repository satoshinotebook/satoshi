export async function onRequest({ request, env, next }) {
    const url = new URL(request.url);
    
    // Mappings both ways
    const routes = {
      '/reality': '/content/reality.html'
    };
    
    // If someone lands on a content URL, redirect them to clean URL
    if (url.pathname.startsWith('/content/')) {
      const cleanPath = url.pathname
        .replace('/content/', '/')
        .replace('.html', '');
      return Response.redirect(`${url.origin}${cleanPath}`, 301);
    }
  
    // If this is a clean URL, handle it with internal rewrite
    if (routes[url.pathname]) {
      const newUrl = new URL(url.href);
      newUrl.pathname = routes[url.pathname];
      return fetch(new Request(newUrl, request));
    }
  
    return next(request);
  }