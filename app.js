const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(port,(req,res)=>{
    console.log(`Server is listening to the post: ${port}`);
})

app.get("/",(req,res)=>{
    res.send("Welcome to the root page");
})

// app.get("/testlistings",async (req,res)=>{
//     // let sampleListing= new Listing({
//     //     title:"My new villa",
//     //     description:"by the beach",
//     //     price:1200,
//     //     location:"Calangute, Goa",
//     //     country:"India"
//     // });

//     // await sampleListing.save()
//     //     .then((res)=>{console.log(res)})
//     //     .catch((err)=>{console.log(err)})
//     // res.send("saved successfully")
// });


app.get("/listings",async (req,res)=>{
    let allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
})

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id);
    res.render("listings/show.ejs",{listings});
})