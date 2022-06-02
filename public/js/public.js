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
      $("#mark").height("200px").animate({top: "200px",opacity: 100});
      $("#marker1").animate({height: "400px"});
      $("#marker2").animate({height: "600px"});
      $("#marker3").animate({height: "300px"});
      $("#marker4").animate({height: "100px"});
    });
    $("#start").mouseout(function(){
          //console.log("off")
$("#mark").animate({height: "200px", opacity: 0, top:"0px"});
    $("#marker1").animate({height: "1px"});
    $("#marker2").animate({height: "1px"});
    $("#marker3").animate({height: "1px"});
    $("#marker4").animate({height: "1px"});


    });
  });
