import json
import os

# Per ottenere il percorso della directory di lavoro corrente
current_working_directory = os.getcwd()

# Costruzione dei percorsi completi utilizzando os.path.join
json_path = os.path.join(current_working_directory, 'InfoVis-main', 'data', 'greek-gods.json')

def organize_json(original_data):
    organized_data = {"name": "deities", "children": []}

    main_types = {
        "human": ['king', 'other', 'prince', 'princess'],
        "god": ['olympian', 'agriculture', 'sky', 'primordial', 'sea', 'other', 'rustic', 'sleep', 'health', 'muse', 'nymph', 'hours', 'river', 'chthonic', 'demigod'],
        "personification": ['personification'],
        "titan": ['other titan', 'other', 'twelve titan']
    }

    for god in original_data["nodes"]:
        main_type = god["main-type"]
        sub_type = god["sub-type"]

        # Per assicurarsi che il main-type sia tra quelli desiderati
        if main_type not in main_types:
            continue

        # Si trova o si crea il main-type
        main_type_node = next((t for t in organized_data["children"] if t["name"] == main_type), None)
        if main_type_node is None:
            main_type_node = {"name": main_type, "children": []}
            organized_data["children"].append(main_type_node)

        # Per assicurarsi che il sub-type sia tra quelli desiderati per il main-type
        if sub_type not in main_types[main_type]:
            continue

        # Si trova o si crea il sub-type all'interno del main-type
        sub_type_node = next((t for t in main_type_node["children"] if t["name"] == sub_type), None)
        if sub_type_node is None:
            sub_type_node = {"name": sub_type, "children": []}
            main_type_node["children"].append(sub_type_node)

        # Aggiunta del nodo god al sub-type
        sub_type_node["children"].append({
            "name": god["id"],
            "sex": god["sex"],
            "popularity": god["popularity"],
            "description": god["description"]
        })

    return organized_data

# Lettura del JSON iniziale
with open(json_path, 'r') as file:
    original_json = json.load(file)

# Organizzazione del JSON
organized_json = organize_json(original_json)

# Scrittura del JSON organizzato in un nuovo file
with open('greek-gods-hierarchy.json', 'w') as file:
    json.dump(organized_json, file, indent=2)

print("Created greek-gods-hierarchy.json")

