var timelineUtils = {

  roundRange: function(range) {

    console.log(range);

    // console.log("start: ", Math.floor(range[0] / 20) * 20);
    // console.log("end: ", Math.ceil(range[1] / 20) * 20);

    return [Math.floor(range[0] / 20) * 20, Math.ceil(range[1] / 20) * 20]
  },

  getToolTipHTMLString: function(ruler_name, ruler_data) {
    return  "<p style=text-align:center;>" + ruler_name + "</p>" + // ruler name
            "<p style=text-align:right;><span style=float:left;>Year of Birth</span><span>:&emsp;</span><span style=float:right;>" + ruler_data.birth + "</span></p>" +
            "<p style=text-align:right;><span style=float:left;>Year of Beginning of Reign</span><span>:&emsp;</span><span style=float:right;>" + ruler_data.begin + "</span></p>" +
            "<p style=text-align:right;><span style=float:left;>Year of End of Reign</span><span>:&emsp;</span><span style=float:right;>" + ruler_data.end + "</span></p>" +
            "<p style=text-align:right;><span style=float:left;>Year of Death</span><span>:&emsp;</span><span style=float:right;>" + ruler_data.death + "</span></p>" ;
  },

  findRange: function(data) {

    let rulers = Object.keys(data); // get keys
    console.log(data);
    // initialize list used to store info on ruler's time period
    let start_dates = [];
    let end_dates = [];

    // loop through rulers and collect information
    rulers.forEach(function(d) {
        
      start_dates.push(data[d].birth);
      end_dates.push(data[d].death);

      // if ("begin1" in data) {
      //     start_dates.push(data[d].begin1);
      // }
      // if ("begin2" in data) {
      //     start_dates.push(data[d].begin2);
      // }
      // if ("end1" in data) {
      //     end_dates.push(data[d].end1);
      // }
      // if ("end2" in data) {
      //     end_dates.push(data[d].end2);
      // }
      });

      // return a range based on the min starting date of a ruler and max ending date of a ruler
      console.log("min:", d3.min(start_dates));
      console.log("max:", d3.max(end_dates));
      
      return [d3.min(start_dates), d3.max(end_dates)];

  }
};