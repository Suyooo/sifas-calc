import dateutil.parser, os, requests

j = requests.get("https://allstars.kirara.ca/api/private/saint/en/current/setup.json").json()["result"]
current_event_id = None
if os.path.isfile("current_event_id"):
    with open("current_event_id", "r") as eid:
        current_event_id = int(eid.read())

if current_event_id != j["event_id"]:
    image_request = requests.get(j["title_image"])
    with open("image/event.jpg", "wb") as image_event:
        image_event.write(image_request.content)

    start_time = str(int(dateutil.parser.parse(j["start_time"]+"Z").timestamp()) * 1000)
    end_time = str(int(dateutil.parser.parse(j["end_time"]+"Z").timestamp()) * 1000)
    with open("js/networkinfo.js", "w") as networkinfo:
        with open("js/networkinfo.js.template", "r") as networkinfo_template:
            for l in networkinfo_template.readlines():
                networkinfo.write(l.replace("$FROM", start_time).replace("$TO", end_time))

    with open("current_event_id", "w") as eid:
        eid.write(str(j["event_id"]))