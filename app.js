import express from "express";
// Express body-parser is an npm module used to  to handle HTTP POST request.
import bodyParser from "body-parser";
//below three imports usefull for sending html file to browser
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";


const app = express();

//below two const usefull for sending html file to browser
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";
  switch (currentDay) {
    case 0:
      day = "sunday";
      break;
    case 1:
      day = "monday";
      break;
    case 2:
      day = "tuesday";
      break;
    case 3:
      day = "wensday";
      break;
    case 4:
      day = "thursday";
      break;
    case 5:
      day = "friday";
      break;
    case 6:
      day = "saturday";
      break;

    default:
        console.log("Error...there is no day found.")
      break;
  }


  res.render("list" , {kindOfDay: day});

//   if (today.getDay() === 6 || today.getDay() === 0) {
//     res.write("wow...! it is weekend.");
//   } else {
//     res.sendFile(path.join(__dirname, "index.html"));
//   }

});



app.listen(3000, function () {
  console.log("Server is running on port 3000....");
});
