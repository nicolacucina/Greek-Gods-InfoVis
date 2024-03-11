import csv
import json

csv_path = 'public/data/greek-gods.csv'
output_path = 'public/data/greek-gods-sex.json'
result = []

with open(csv_path, 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')
    for row in reader:
        name = row['NAME']
        sex = row['SEX']
        item = {
            'name': name,
            'sex': sex
        }
        result.append(item)

with open(output_path, 'w', encoding='utf-8') as outfile:
    json.dump(result, outfile, ensure_ascii=False, indent=2)

