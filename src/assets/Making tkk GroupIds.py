# made by Eli (lili041 --Github) with Google Gemini
# you have to fill in the  -path of .json textcritics-  and the  -path or .svg folder- !

# ACHTUNG: TODO werden übersprungen, das heisst aber auch, dass sie innerhalb eines Blockes nicht einberechnet werden, 
# und danach weitergezählt wird, als ob nichts wäre: g-tkk-1, g-tkk-2, g-tkk-3, g-tkk-4, TODO, g-tkk-5, g-tkk-6, ...


import json
import os
import re

# --- KONFIGURATION ---


##### fill in:
json_path = '/Users/Elias/awg-app/src/assets/data/edition/series/1/section/5/op25/textcritics.json'

##### fill in:
svg_folder = '/Users/Elias/awg-app/src/assets/img/edition/series/1/section/5/op25' 
prefix = "g-tkk-"



def extract_numbers(text):
    """Extrahiert Ziffern (z.B. 'M_143' -> '143')"""
    return "".join(re.findall(r'\d+', str(text)))

# 1. Daten laden
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

all_entries = data.get('textcritics', data) if isinstance(data, dict) else data
all_svg_files = [f for f in os.listdir(svg_folder) if f.endswith('.svg')]

loaded_svg_texts = {}

def get_svg_text(filename):
    if filename not in loaded_svg_texts:
        path = os.path.join(svg_folder, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        loaded_svg_texts[filename] = {"content": content, "path": path}
    return loaded_svg_texts[filename]

current_main_number = None
relevant_svgs_for_block = []
id_mapping = {}

print(f"--- Starte Bearbeitung mit SkRT-Speziallogik ---")

# 2. Iteration durch die JSON
for entry in all_entries:
    if not isinstance(entry, dict): continue

    new_id = entry.get('id', '')
    if new_id:
        # Vor dem Block-Wechsel: Geänderte SVG-Texte speichern
        for fname, sdata in loaded_svg_texts.items():
            with open(sdata['path'], 'w', encoding='utf-8') as f:
                f.write(sdata['content'])
        
        loaded_svg_texts.clear()
        id_mapping.clear()
        
        current_main_number = extract_numbers(new_id)
        
        # --- SPEZIELLE FILTLERUNG FÜR SkRT ---
        if "SkRT" in new_id:
            # Suche SVGs, die die Nummer UND 'Reihentabelle' enthalten
            relevant_svgs_for_block = [
                f for f in all_svg_files 
                if current_main_number in extract_numbers(f) and "Reihentabelle" in f
            ]
            print(f"\n SkRT-Anker erkannt: {new_id}")
        else:
            # Normale Suche (Nummern-Match)
            relevant_svgs_for_block = [
                f for f in all_svg_files 
                if current_main_number in extract_numbers(f) and "Reihentabelle" not in f
            ]
            print(f"\n Standard-Anker: {new_id}")
            
        print(f"   Zugeordnete SVGs: {relevant_svgs_for_block}")

    # Durch Kommentare gehen
    comments_list = entry.get('commentary', {}).get('comments', [])
    for comment_group in comments_list:
        for b_comment in comment_group.get('blockComments', []):
            old_val = b_comment.get('svgGroupId')
            if not old_val: continue

            pattern = rf'id=["\']{re.escape(old_val)}["\']'
            
            found_in_svg = None
            for svg_filename in relevant_svgs_for_block:
                svg_data = get_svg_text(svg_filename)
                if re.search(pattern, svg_data["content"]):
                    found_in_svg = svg_filename
                    break
            
            if found_in_svg:
                if old_val not in id_mapping:
                    id_mapping[old_val] = f"{prefix}{len(id_mapping) + 1}"
                
                new_val = id_mapping[old_val]
                b_comment['svgGroupId'] = new_val
                
                svg_data = get_svg_text(found_in_svg)
                new_pattern_val = f'id="{new_val}"'
                svg_data["content"] = re.sub(pattern, new_pattern_val, svg_data["content"])
                
                print(f"   {old_val} -> {new_val} (in {found_in_svg})")

# 3. Abschluss-Speicherung
for fname, sdata in loaded_svg_texts.items():
    with open(sdata['path'], 'w', encoding='utf-8') as f:
        f.write(sdata['content'])

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"\n Fertig!")