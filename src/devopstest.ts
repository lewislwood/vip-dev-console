


"use script";



const myTest= (e?:any) => {
   try {
      const td = new Date() 
      const nColors = ["x", "y", "z"];
const th = {  "name":"_default", 
"creator": "Lewis Wood",
"created": td.toDateString(),
"modifiedby": "Lewis Wood",
"modified": td.toDateString(),
"colors":nColors 
   }

   DevOps.log("Lewis is testing devOps");
DevOps.log( JSON.stringify(th));
DevOps.log(th["name"]);
   


   } catch(e:any) {
      DevOps.logError("Testing error: " + e.message);
   }; // catch


}; myTest();



// export default   myTest;