import csv
import json
import os

# Ottieni il percorso della directory di lavoro corrente
current_working_directory = os.getcwd()

# Costruzione dei percorsi completi utilizzando os.path.join
enriched_csv_path = os.path.join(current_working_directory, 'public', 'data', 'greek-gods-enrichment.csv')
csv_path = os.path.join(current_working_directory, 'public', 'data', 'greek-gods.csv')
json_path = os.path.join(current_working_directory, 'public', 'data', 'greek-gods.json')
missing_nodes_path = os.path.join(current_working_directory, 'public', 'data', 'missing-nodes.txt')

# Dizionario per memorizzare i sub-type associati a ciascuna main type
sub_types_dict = {}

nodes_enriched = []
with open(enriched_csv_path, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',')
    for row in reader:
        item = {
            'id-en': row['name-english'],
            'id-gr': row['name-greek'],
            'main-type': row['main-type'],
            'sub-type': row['sub-type'],
            'description': row['description'],
        }
        nodes_enriched.append(item)

nodes = []
missing_nodes = []
edges = []
with open(csv_path, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')
    for row in reader:

        ## NODES
        main_type = ''
        sub_type = ''
        description = ''
        found = False
        for n in nodes_enriched:
            if n.get('id-en') == row['NAME']:
                main_type = n.get('main-type')
                sub_type = n.get('sub-type')
                description = n.get('description')
                found = True
                break

        if found == False:
            missing_nodes.append(row['NAME'])

        popularity = int(row['POPULARITY'])
        if popularity <= 1080000:
            popularity_cat = 0
        elif popularity <= 2740000:
            popularity_cat = 1
        elif popularity <= 8690000:
            popularity_cat = 2
        else:
            popularity_cat = 3

        item = {
            'id': row['NAME'],
            'sex': row['SEX'],
            'popularity': popularity_cat,
            'popularity-value': popularity,
            'main-type': main_type,
            'sub-type': sub_type,
            'description': description,
        } 
        nodes.append(item)

        ## EDGES
        father = {
            'source': row['FATHER'],
            'target': row['NAME'],
            'type': 'father',
        }
        mother = {
            'source': row['MOTHER'],
            'target': row['NAME'],
            'type': 'mother',
        }
        if father['source'] != '':
            edges.append(father)
        if mother['source'] != '':
            edges.append(mother)         

data = {
    'directed': True,
    'wighted': False,
    'nodes': nodes,
    'edges': edges,
}

print('Nodes: ' + str(len(nodes)))
print('Edges: ' + str(len(edges)))
print('Missing nodes: ' + str(len(missing_nodes)))

with open(json_path, 'w', encoding='utf-8') as outfile:
    json.dump(data, outfile, indent=2)

with open(missing_nodes_path, 'w', encoding='utf-8') as outfile:
    for item in missing_nodes:
        outfile.write("%s\n" % item)

#Per ottenere i sub-types associati a ciascuna main type
for node in nodes_enriched:
    main_type = node['main-type']
    sub_type = node['sub-type']

    if main_type not in sub_types_dict:
        sub_types_dict[main_type] = set()

    sub_types_dict[main_type].add(sub_type)

# Stampa i risultati
for main_type, sub_types in sub_types_dict.items():
    print(f"Main Type: {main_type}")
    print(f"Sub Types: {list(sub_types)}")
    print()

#Stampa il numero di divinità per ogni sub-type
for main_type, sub_types in sub_types_dict.items():
    for sub_type in sub_types:
        count = 0
        for node in nodes:
            if node['main-type'] == main_type and node['sub-type'] == sub_type:
                count += 1
        print(f"Main Type: {main_type}, Sub Type: {sub_type}, Count: {count}")
        


