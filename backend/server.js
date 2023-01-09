const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

dotenv.config({
  path: `backend/config/config.env`,
});

//connecting DB
connectDatabase();

const server = app.listen(process.env.PORT, () =>
  console.log(
    `Server running on port ${process.env.PORT} 🔥 on ${process.env.NODE_ENV} mode`
  )
);
//handle uncaught  exceptionS
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`), console.log("Shutting down server due to uncaught exceptions");
    server.close(()=>{
      process.exit(1);
    });
  });

//handle unhandled promise errors
process.on("unhandledRejection", err => {
  console.log(`Error: ${err.message}`), console.log("Shutting down server due to unhandled promise rejection");
  server.close(()=>{
    process.exit(1);
  });
});




