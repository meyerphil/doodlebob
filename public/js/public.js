/**
 * Author:    Group 2
 * Created:   05.31.2022
 *
 * (c) public domain
 **/
//var difdrawings = [
  // ""
   //""
   //""
 //]
//this changes the maintitle image from git to drawing
var drawings = [
  "img/doodtitle1.png",
  "img/doodtitle2.png",
  "img/doodtitle3.png"
]
$(document).ready(function(){
  $("#title").mouseover(function(){

  $("#title").attr("src", "img/drawinggif.GIF").height("400px");


  });
  $("#title").mouseout(function(){
  var index = Math.floor(Math.random()*drawings.length);
  var randomDrawing = drawings[index];
  $("#title").attr("src", randomDrawing).height("400px");
  //$("#title").attr("src", "img/doodtitle1.png").height("400px")

  });
});


//this animates the start button, and the markers on site page
$(document).ready(function(){
  $("#start").mouseover(function(){

      $("#mark1").height("300px").animate({top: "100px",opacity: 100},2000);
      $("#mark2").height("300px").animate({top: "300px",opacity: 100},1000);
      $("#mark3").height("300px").animate({top: "1px",opacity: 100},3000);
      $("#mark4").height("300px").animate({top: "350px",opacity: 100},4000);
      $("#marker1").animate({height: "400px"},2000);
      $("#marker2").animate({height: "600px"},1000);
      $("#marker3").animate({height: "300px"},3000);
      $("#marker4").animate({height: "650px"},4000);
    });
    $("#start").mouseout(function(){
    $("#mark1").animate({height: "300px", opacity: 0, top:"-300px"});
    $("#mark2").animate({height: "300px", opacity: 0, top:"-300px"});
    $("#mark3").animate({height: "300px", opacity: 0, top:"-300px"});
    $("#mark4").animate({height: "300px", opacity: 0, top:"-300px"});
    $("#marker1").animate({height: "1px"});
    $("#marker2").animate({height: "1px"});
    $("#marker3").animate({height: "1px"});
    $("#marker4").animate({height: "1px"});
    });
  });
