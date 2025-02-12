export async function onRequest({ request, next }) {
    const url = new URL(request.url)
    
    // If URL contains /content/, redirect to clean version
    if (url.pathname.includes('/content/')) {
      const cleanPath = url.pathname.replace('/content/', '/').replace('.html', '')
      return Response.redirect(new URL(cleanPath, request.url), 301)
    }
  
    // If clean URL, serve the content file
    const response = await next()
    return response
  }