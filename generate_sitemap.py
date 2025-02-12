import os
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

def generate_sitemap(base_url, directory_path):
    # Create the root element
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    # Add homepage
    home_url = ET.SubElement(urlset, 'url')
    ET.SubElement(home_url, 'loc').text = base_url
    ET.SubElement(home_url, 'lastmod').text = datetime.now().strftime('%Y-%m-%d')
    ET.SubElement(home_url, 'changefreq').text = 'weekly'
    ET.SubElement(home_url, 'priority').text = '1.0'

    # Walk through directory
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.html'):
                # Skip index.html as it's handled above
                if file == 'index.html':
                    continue
                
                # Create relative path
                rel_path = os.path.join(root, file).replace(directory_path, '').lstrip('/')
                
                # Create URL element
                url = ET.SubElement(urlset, 'url')
                
                # Add the dot before 'html' in the URL
                url_path = rel_path.replace('html', '.html')
                full_url = f"{base_url.rstrip('/')}/{url_path}".replace('\\', '/')
                ET.SubElement(url, 'loc').text = full_url
                
                # Last modified date
                file_path = os.path.join(root, file)
                last_mod = datetime.fromtimestamp(os.path.getmtime(file_path))
                ET.SubElement(url, 'lastmod').text = last_mod.strftime('%Y-%m-%d')
                
                # Default priority for all other pages
                ET.SubElement(url, 'priority').text = '0.8'

    # Create the XML string with pretty printing
    rough_string = ET.tostring(urlset, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    pretty_xml = reparsed.toprettyxml(indent="    ")

    # Write to sitemap.xml
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(pretty_xml)

# Usage
base_url = 'https://satoshinotebook.com'
directory_path = '.'  # Current directory, change if needed
generate_sitemap(base_url, directory_path)