from os import path, scandir
import re


comics_dir = path.join('hugo-neocities', 'content', 'projects', 'grafald', 'comics')

for entry in scandir(comics_dir):
    if path.isfile(entry):
        match = re.match(r'bonus_(\d+)', entry.name)
        
        if match:            
            new_num = match[1]
            
            with open(entry, 'r', encoding='utf-8') as file:
                text = file.read()
            
            title_match = re.search(r'title: "Grafald bonus \d+ *- *(.*)"',
                                   text)
            path_match = re.search(r'image_path: "../img/(\d+)/bonus_\d+\.(.*)"',
                                   text)
            
            text = re.sub(r'title: "Grafald bonus (\d+) *- *(.*)"',
                          f'title: "Grafald bonus {match[1]} - {title_match[1]}"',
                          text)
            text = re.sub(r'image_path: "../img/(\d+)/bonus_\d+\.(.*)"',
                          f'image_path: "../img/{path_match[1]}/bonus_{match[1]}.{path_match[2]}"',
                          text)
            
            with open(entry, 'w', encoding='utf-8') as file:
                file.write(text)