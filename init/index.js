const mongoose=require("mongoose");
const list=require("../models/listing.js");
const initData=require("./data.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDb = async ()=>{
    // await list.deleteMany();
    await list.insertMany(initData.data)
}

// initDb();