const mongoose=require("mongoose");
const list=require("../models/listing.js");
const initData=require("./data.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDb = async ()=>{
    await list.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner : "65a6af3174e50b3295cca66e"}))
    await list.insertMany(initData.data)
    console.log("data was initialized");
}

initDb();