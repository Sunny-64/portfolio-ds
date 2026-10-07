import urllib.request
import re

url = "http://localhost:3000/?theme=light"
html = urllib.request.urlopen(url).read().decode('utf-8')

# Find all section tags and their classes
sections = re.findall(r'<section id="([^"]+)"[^>]*class="([^"]+)"', html)
for s_id, s_class in sections:
    print(f"Section {s_id}: {s_class}")
