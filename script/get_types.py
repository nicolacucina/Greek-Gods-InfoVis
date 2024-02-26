import json

with open('data/greek-gods.json', 'r') as f:
    data = json.load(f)

nodes = data['nodes']

# Get all unique main-types and all unique sub-types of the main-type
main_types = {}

for n in nodes:
    main_type = n.get('main-type')
    sub_type = n.get('sub-type')
    if main_type not in main_types:
        main_types[main_type] = []
    if sub_type not in main_types[main_type]:
        main_types[main_type].append(sub_type)

#Print all main-types and sub-types
for main_type in main_types:
    print(main_type)
    for sub_type in main_types[main_type]:
        print('  ' + sub_type +
              ' (' + str(len([n for n in nodes if n.get('main-type') == main_type and n.get('sub-type') == sub_type])) + ')')



