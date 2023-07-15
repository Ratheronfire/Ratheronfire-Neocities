from datetime import datetime
import os
import re
import sys
import urllib.parse

IGNORED_FILE_PATTERNS = [
    ".*\.md"
]


PAGE_TEMPLATE = '---\n\
title: "{title}"\n\
type: "{type}"\n\
date: {date}\n\
draft: false\n\
categories: ["{category}"]\n\
image_path: "{image_path}"\n\
alt_text: ""\n\
---'


def convert_dir(path: str):
    for root, dirs, files in os.walk(path):
        for file in files:
            matches = [re.match(pattern, file) for pattern in IGNORED_FILE_PATTERNS]
            if [m for m in matches if m is not None]:
                continue
            
            file_date = datetime.now()
            
            pattern_match = re.match("Grafald bonus (\d+).*\((\d+-\d+-\d+)\)\..*", file)

            if pattern_match:
                file_date = datetime.strptime(pattern_match[2], "%m-%d-%Y")
                page_number = pattern_match[1]
            else:
                file_date = datetime.fromtimestamp(os.path.getctime(os.path.join(root, file)))
                page_number = -1

            title, ext = os.path.splitext(file)
            
            if not os.path.isdir(os.path.join(root, "img")):
                os.mkdir(os.path.join(root, "img"))
            
            os.rename(os.path.join(root, file), os.path.join(root, "img", page_number + ext))
            
            with open(os.path.join(root, title + '.md'), 'w', encoding="UTF-8") as out_file:
                out_file.write(PAGE_TEMPLATE.format(title=title, type="image", date=file_date.isoformat(),
                                       category="Projects", image_path="../img/" + page_number + ".png"))


if __name__ == "__main__":        
    convert_dir(sys.argv[1])