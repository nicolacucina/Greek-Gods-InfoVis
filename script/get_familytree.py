import csv
import json
import os

# Ottieni il percorso della directory di lavoro corrente
current_working_directory = os.getcwd()

### CREAZIONE DEL DATASET CON SOLI CAMPI "id" E "parentIds" ###
data_path = os.path.join(current_working_directory, 'public', 'data', 'greek-gods.csv')

nodes = []
with open(data_path, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')
    for row in reader:
        parents = []
        if row['FATHER'] != '':
            parents.append(row['FATHER'])
        if row['MOTHER'] != '':
            parents.append(row['MOTHER'])
        item = {
            'id': row['NAME'],
            'parentIds': parents,
        }
        nodes.append(item)



### ARRICCHIMENTO DEL DATASET CON CAMPI AGGIUNTIVI ###
data_path = os.path.join(current_working_directory, 'data', 'greek-gods.json')

# Per ogni id presente in nodes, cerca il corrispondete in data_path e aggiungi i campi aggiuntivi
with open(data_path, 'r', encoding='utf-8') as jsonfile:
    data = json.load(jsonfile)
    enriched_nodes = data["nodes"]
    for node in nodes:
        for enriched_node in enriched_nodes:
            if node['id'] == enriched_node['id']:
                node['sex'] = enriched_node['sex']
                node['popularity'] = enriched_node['popularity']
                node['popularity-value'] = enriched_node['popularity-value']
                node['main-type'] = enriched_node['main-type']
                node['sub-type'] = enriched_node['sub-type']
                node['description'] = enriched_node['description']
                break
        

output_path = os.path.join(current_working_directory, 'data', 'family-tree-dataset.json')
with open(output_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(nodes, jsonfile, indent=4, ensure_ascii=False)

