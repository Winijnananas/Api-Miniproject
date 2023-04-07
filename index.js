const express = require("express");
const cors = require("cors"); // เปิดการ Block Cors
const { sendRequestGetJson } = require("./function/service.js");

const http = require("http");

const fetch = require("node-fetch");
const app = express(); // ไว้ Config ค่าต่างๆ
const PORT = process.env.PORT || 8080;

app.use(express.json()); //รับ parameter Json
app.use(express.urlencoded({ extended: true })); //รับ parameter URL Encode

app.use(cors()); // เปิดการ Block Cors

app.get("/getsolr/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const data = await sendRequestGetJson(
      `http://127.0.0.1:8983/solr/BotanicalProject/select?q=_text_:` +
        keyword + `&rows=20` +
        `&q.op=OR&indent=true&facet=true&facet.field=author&facet.field=publisher&facet.mincount=1&wt=json`
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      content: "",
    });
  }
});
app.get("/getbyid/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Here, you would use your data source to retrieve the plant record by its ID
    // In this example, I'm just returning a mock data object
    const plant = {
      id: "b000102",
      name: "รางจืด",
      scientific_name: "Thunbergia laurifolia Lindl",
      family_name: "acanthaceae",
      othername: "-",
      character: "-",
      botanical_characteristics: "-",
      flowering_period: "-",
      properties:
        "ใบและราก ปรุงเป็นยาถอนพิษไข้ พอกบาดแผลรักษาแผลไฟไหม้ น้ำร้อนลวก รากและเถา แก้ร้อนใน แก้กระหายน้ำ",
    };

    if (plant.id === id) {
      res.status(200).json(plant);
    } else {
      res.status(404).json({
        message: "Plant record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving plant record",
    });
  }
});


//กรณีไม่พบ Method เปิดแจ้งเตือน
app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found" });
});

//ให้ run ที่ port ตาม Config
app.listen(PORT, () => {
  console.log("run on : " + PORT);
});
