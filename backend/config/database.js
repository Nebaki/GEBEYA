// const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
// const connectDatabase = () => {
//     mongoose.connect(process.env.CONNECTION_STRING, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     }).then(con => {
//         console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
//     })
// }

// module.exports = connectDatabase






const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const connectDatabase=()=>{
    mongoose.connect(process.env.CONNECTION_STRING,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:"Gebeya"
    }).then(() => {
        console.log("Connected to Mongoose") ;
    
    })
}

module.exports=connectDatabase;