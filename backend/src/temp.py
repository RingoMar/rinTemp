import datetime
import json
import subprocess
import time
from time import sleep as sleep

print("Starting Temp check...")


def son_load(name):
    with open(name, "r") as json_file:
        data = json.load(json_file)
    return data


def son_save(infile, data):
    with open(infile, 'w') as outfile:
        json.dump(data, outfile, indent=4)
        outfile.close()
    return


def main():
    tempDataJson = son_load("frontend/temps.json")
    tempData = tempDataJson["sheme"]

    d = datetime.datetime.utcnow()
    tempDataJson["lastonline"] = int(time.mktime(d.timetuple())) * 1000

    if len(tempData) >= 30:
        tempData.pop(0)

    batcmd = "/opt/vc/bin/vcgencmd measure_temp"
    result = subprocess.check_output(batcmd, shell=True)
    final_result = result.decode("utf-8")
    splitre = final_result.split("=")[1].split("'C")[0]

    tempData.append(splitre)
    result = subprocess.check_output("uptime -p", shell=True)
    final_result = result.decode("utf-8")
    tempDataJson["current_uptime"] = final_result

    son_save("frontend/temps.json", tempDataJson)


while True:
    main()
    sleep(5)
