const JSON_DATA = "./data/timelineData_1.json";
var public_data = {};

function getJson() {
    return d3.json(JSON_DATA).then((data) => {
        public_data = data;
        // console.log(public_data);
    });
    // console.log(public_data);
}

async function init() {
    console.log(public_data);
    await getJson();
    console.log(public_data.mughal_empire);
}

init();