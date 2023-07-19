//jshint esversion:6

const _getDate = getDate;
export { _getDate as getDate };
const _getDay = getDay;
export { _getDay as getDay };

// export default getDate;

function getDate(){
  const today = new Date();
//   var currentDay = today.getDay();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};
// let day=today.toLocaleDateString("hi-IN", options);          //Indian Marathi Format
const day = today.toLocaleDateString("en-US", options); //US english format

return day;
}


function getDay(){
  const today = new Date();
  //   var currentDay = today.getDay();
  
  const options = {
    weekday: "long",
    
  };
  // let day=today.toLocaleDateString("hi-IN", options);          //Indian Marathi Format
  const day = today.toLocaleDateString("en-US", options); //US english format
  
  return day;
  }