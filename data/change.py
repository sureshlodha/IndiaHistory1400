import json

file = open('timelineData.json')
timelineData = json.load(file)["empires"]
file.close()

new_json = {}

def mugdal_sikh(dictionary):
    new_dict = {}
    for key in dictionary.keys():
        begin = dictionary[key][0]
        end = dictionary[key][1]
        new_dict[key] = {"begin" : begin, "end" : end}
    return new_dict

# for mugdhal empire and sikh gurus
mugdal_empire = timelineData["mugdal_empire"]
sikh_gurus = timelineData["sikh_gurus"]

new_json["mugdhal_empire"] = mugdal_sikh(mugdal_empire)
new_json["sikh_gurus"] = mugdal_sikh(sikh_gurus)

# for ahom empire
new_json["ahom_empire"] = {}
for key in timelineData["ahom_empire"].keys():
    new_json["ahom_empire"][key] = {}

    begin = timelineData["ahom_empire"][key][0]
    end = timelineData["ahom_empire"][key][1]
    new_json["ahom_empire"][key]["begin"] = begin
    new_json["ahom_empire"][key]["end"] = end

    if key == "Interregnum" or key == "Sudingphaa" or key == "Purandar Singha":

        begin1 = timelineData["ahom_empire"][key][2]
        end1 = timelineData["ahom_empire"][key][3]
        new_json["ahom_empire"][key]["begin1"] = begin1
        new_json["ahom_empire"][key]["end1"] = end1

        if key == "Interregnum":
            begin2 = timelineData["ahom_empire"][key][4]
            end2 = timelineData["ahom_empire"][key][5]
            new_json["ahom_empire"][key]["begin2"] = begin2
            new_json["ahom_empire"][key]["end2"] = end2

# maratha empire
new_json["maratha_empire"] = mugdal_sikh(timelineData["maratha_empire"]["rulers"])

# for vijayanagar empire
new_json["vijayanagar_empire"] = {}

for key_1 in timelineData["vijayanagar_empire"].keys():
    for key_2 in timelineData["vijayanagar_empire"][key_1]:
        begin = timelineData["vijayanagar_empire"][key_1][key_2][0]
        if len(timelineData["vijayanagar_empire"][key_1][key_2]) == 1:
            end = begin
        else:
            end = timelineData["vijayanagar_empire"][key_1][key_2][1]
        prop = key_1
        new_json["vijayanagar_empire"][key_2] = {"begin" : begin, "end" : end, "properties" : prop}

print(new_json)
with open("timelineData_1.json", "w") as f:
    json.dump(new_json, f)