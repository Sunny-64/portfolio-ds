import urllib.request
import re

url = "http://localhost:3000"
html = urllib.request.urlopen(url).read().decode('utf-8')
match = re.search(r'(<section id="intro".*?</section>)', html, re.DOTALL)
if match:
    print("Found intro section:")
    print(match.group(1)[:1000])
else:
    print("Intro section NOT found in HTML!")
