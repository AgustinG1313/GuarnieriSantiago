import json
import os

BASE_URL = "https://santiagoguarnieri.com"

def generate_sitemap():
    try:
        with open('artworks.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading json: {e}")
        return

    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    xml.append('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')
    
    # Homepage Entry with ALL images
    xml.append('  <url>')
    xml.append(f'    <loc>{BASE_URL}/</loc>')
    
    # Priority and Changefreq
    xml.append('    <priority>1.0</priority>')
    xml.append('    <changefreq>weekly</changefreq>')

    # Add images
    for key, artwork in data.items():
        title = artwork.get('title', 'Obra de Arte')
        for img_path in artwork.get('images', []):
            # Ensure path is clean of './'
            clean_path = img_path.lstrip('./')
            full_img_url = f"{BASE_URL}/{clean_path}"
            
            xml.append('    <image:image>')
            xml.append(f'      <image:loc>{full_img_url}</image:loc>')
            xml.append(f'      <image:title>{title}</image:title>')
            xml.append('    </image:image>')

    xml.append('  </url>')
    xml.append('</urlset>')

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml))
    
    print(f"Sitemap generated with {len(xml)} lines.")

if __name__ == "__main__":
    generate_sitemap()
