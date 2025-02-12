# Satoshi Notebook 📓

A minimalist, interactive notebook exploring Bitcoin philosophy and fundamentals. Built with pure HTML, CSS, and JavaScript.

## Overview

Satoshi Notebook is an open-source educational platform that presents Bitcoin-related content in a clean, organized, and thoughtful way. The project features:

- 🌳 Tree-style navigation with expandable sections
- 🎨 Minimalist design with custom SVG icons
- 🌓 Dark theme optimized for readability
- 📱 Responsive layout for all devices
- ⚡ Fast, static page generation
- 🔄 Smooth page transitions
- 💨 No frameworks or heavy dependencies

## Project Structure

```
satoshi/
├── components/          # Reusable HTML components
│   └── nav.html        # Navigation component
├── content/            # Generated HTML pages
├── css/               # Stylesheets
│   ├── shared.css     # Main stylesheet
│   └── shared.copy.css # Backup stylesheet
├── js/                # JavaScript modules
│   ├── content-loader.js
│   ├── matrix.js      # Matrix animation
│   ├── nav.js         # Navigation functionality
│   ├── shared-layout.js
│   └── transitions.js # Page transition effects
├── originals/         # Source content files
├── about.html         # About page
├── build.js          # Static site generator
├── favicon.png       # Site favicon
├── index.html        # Main entry point
└── template.html     # Page template
```

## Getting Started

Clone the repository:
```bash
git clone https://github.com/satoshinotebook/satoshi.git
cd satoshi
```


## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

All PRs should:
- Follow the existing code style
- Update documentation as needed
- Include clear commit messages

## Development

The site is built using a simple static site generator (`build.js`) that:
1. Reads content from `/originals`
2. Processes HTML templates
3. Generates static pages in `/content`
4. Handles asset paths and navigation

To add new content:
1. Create a new HTML file in `/originals`
2. Include an `<h2>` title tag
3. Run `node build.js`
4. Update `nav.html` if needed

## License

MIT License - feel free to use this code for your own projects.

## Support

If you find this project valuable, consider supporting it:
`bc1qynz6j3ggww65qte227u2yfzpcr2ulr5n0plngw`

## Contact

- Twitter: [@satoshinotebook](https://x.com/satoshinotebook)
- Instagram: [@satoshinotebook](https://instagram.com/satoshinotebook)
- Email: satoshinotebook@proton.me