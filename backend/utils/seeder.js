
const Product=require("../model/product")

const dotenv=require("dotenv");
const connectDatabase=require("../config/database");
const products=require("../data/product")
dotenv.config({
    path: `backend/config/config.env`,
})

//connecting DB
connectDatabase();



const seederproducts=async()=>{
    try{
  await Product.deleteMany();
  console.log("products are deleted");

  await Product.insertMany(products);
  console.log("All products are inserted ");

  process.exit();
    }catch(err){
        console.log(err.message);
        process.exit();
    }
}


seederproducts();