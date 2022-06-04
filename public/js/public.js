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
//this changes the maintitle image
$(document).ready(function(){
  $("#title").mouseover(function(){
      //console.log("on")
      $("#title").attr("src", "img/drawinggif.GIF").height("400px");


  });
  $("#title").mouseout(function(){
    //console.log("off")
  $("#title").attr("src", "img/ctitle.png").height("400px")

  });
});

//this animates the start buttons
$(document).ready(function(){
  $("#start").mouseover(function(){
      //console.log("on")
      $("#mark1").height("200px").animate({top: "200px",opacity: 100},2000);
      $("#mark2").height("200px").animate({top: "400px",opacity: 100},1000);
      $("#mark3").height("200px").animate({top: "95px",opacity: 100},3000);
      $("#mark4").height("200px").animate({top: "450px",opacity: 100},4000);
      $("#marker1").animate({height: "400px"},2000);
      $("#marker2").animate({height: "600px"},1000);
      $("#marker3").animate({height: "300px"},3000);
      $("#marker4").animate({height: "650px"},4000);
    });
    $("#start").mouseout(function(){
          //console.log("off")
$("#mark1").animate({height: "200px", opacity: 0, top:"-200px"});
$("#mark2").animate({height: "200px", opacity: 0, top:"-200px"});
$("#mark3").animate({height: "200px", opacity: 0, top:"-200px"});
$("#mark4").animate({height: "200px", opacity: 0, top:"-200px"});
    $("#marker1").animate({height: "1px"});
    $("#marker2").animate({height: "1px"});
    $("#marker3").animate({height: "1px"});
    $("#marker4").animate({height: "1px"});


    });
  });
