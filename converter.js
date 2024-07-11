const fs = require('fs');
const XLSX = require('xlsx');

// Function to convert XML to JSON
function convertXmlToJson(xmlFile) {
    var convert = require('xml-js');
    var xml = require('fs').readFileSync(xmlFile, 'utf-8');
    if (xml.split("\n")[xml.split("\n").length-1] != "</root>") xml += "\n</root>";
    var result = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}));
    return result;
}


const convert2Xlsx = (jsonData, xlsxFilePath)=>{
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    console.log(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to an XLSX file
    XLSX.writeFile(workbook, `${xlsxFilePath}.xlsx`);
}

const createOneJson  = (data)=>{
    let indexesAttributes = [];
    let movieIndexes = [];
    let liveIndexes = [];
    let allIndexes = [];
    const json = [];
    if (data.root.item.length){
        data.root.item.forEach(element => {
            Object.keys(element._attributes).forEach(item=>{
                if (!indexesAttributes.includes(item)) indexesAttributes.push(item);
            })
            if (element.movie){
                Object.keys(element.movie._attributes).forEach(item=>{
                    if (!movieIndexes.includes(item)) movieIndexes.push(item);
                });
            }
            if (element.live){
                Object.keys(element.live._attributes).forEach(item=>{
                    if (!liveIndexes.includes(item)) liveIndexes.push(item);
                });
            }
        });
    }
    let l = [];
    data.root.item.forEach((element, index)=>{
        json.push({});
        indexesAttributes.forEach(item=>{
            json[index][item] = element._attributes[item] ? element._attributes[item] : "";
        });
        movieIndexes.forEach(item=>{
            if (json && json[index] && !Object.keys(json[index]).includes(item)){
                json[index][item] = element.movie ? element.movie._attributes[item] ? element.movie._attributes[item] : ""  : "";
            }
        });
        liveIndexes.forEach((item, index)=>{
            if (json && json[index] && !Object.keys(json[index]).includes(item)) json[index][item] = element.live ? element.live._attributes[item] ? element.live._attributes[item] : "" : "";
        });
    });

    return json
    //convert2Xlsx(CSV, `${fileName}.csv`);
};


const readFolder = ()=>{
    const testFolder = './convert/';

    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
        //convert2Xlsx(convertXmlToJson(`${testFolder}${file}`).root.item, `./ready/${file}`);
        convert2Xlsx(createOneJson(convertXmlToJson(`${testFolder}${file}`)), `./ready/${file}`);
    });
});
};

readFolder();


