import re
from yaml import dump, load
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

def read_hugo_page(review_path):
    try:
        with open(review_path, 'r') as review_file:
            file_text = review_file.read()
        
        file_sections = re.split(r'\n*---\n+', file_text, maxsplit=2)
        
        if len(file_sections) == 1:
            yaml_str = file_sections[0]
            contents = None
        else:
            yaml_str = file_sections[1]
            contents = file_sections[2]
        
        yaml_obj = load(yaml_str, Loader=Loader)
        
        return yaml_obj, contents
    except FileNotFoundError:
        return None


def write_hugo_page(page_path: str, page_data, page_text):
    with open(page_path, 'w') as yaml_file:
        yaml_file.write('---\n')
        yaml_file.write(dump(page_data, sort_keys=False))
        yaml_file.write('---\n\n')
        yaml_file.write(page_text)
