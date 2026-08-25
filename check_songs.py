import json
with open('songs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(type(data))
if isinstance(data, list):
    print(len(data))
    for d in data[-5:]:
        print(d['id'], d['title'])
else:
    print(data)