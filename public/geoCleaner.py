import json

with open('congress_nw.geojson') as f:
    data = json.load(f)

for feature in data['features']:
    props = feature['properties']
    props['il_district'] = props['IL_Congressional_NetWorth$.District']

with open('congress_nw.geojson', 'w') as f:
    json.dump(data,f,indent=2)

print('Geo JSON cleaned.')