
var sounds = {
  clientId: 'client_id=f5f1c67193dfe560ce6db6390276ba45',
  soundCallback: function(tracks){
    var soundLists = "<ul class='rig columns-4'>";
    $.each(tracks, function(index, tracks){
      var downloadUrl = tracks.download_url+ '?' +sounds.clientId;
      if(index === 6){ //return only 6 search results
        return false;
      }
      //FUNCTION TO SOLVE FOR URLS WITH FILE NOT FOUND
      function validateUrl(){
        if(tracks.downloadable === false){
          return "This Item Can't Be Downloaded But can be Played";
        }
        else{
          return "<a href="+downloadUrl+" title=" + tracks.title + ">Download Song</a>";
        }
      }
      soundLists += "<li>" +
           "<img class='cover' src='" + tracks.user.avatar_url + "'/>" +
           "<h3>" + tracks.title + "</h3>" +
           "<audio class='cont-4' src='"+tracks.stream_url+"?client_id=f5f1c67193dfe560ce6db6390276ba45' type='audio/mpeg' controls='controls'></audio>" + 
           "<p>" + validateUrl() + "</p>" +
           "</li>";
    })//END EACH
    soundLists += '</ul>';
     $('#four-columns').html(soundLists);
  },
  getResource: function(songs){
    var url = 'https://api.soundcloud.com/tracks.json?q=' + songs + '?&amp;client_id=f5f1c67193dfe560ce6db6390276ba45';
    $.getJSON(url, sounds.soundCallback)
  },
  forms: function(){
    $('form').submit(function (evt){
      evt.preventDefault();
      var $search = $('#search');
      var $submit = $('#submit');
      var songs = $('#search').val();
      sounds.getResource(songs);
    });//End Submit
  }
  }
$(document).ready(sounds.forms);
$(document).ready(function() {
  $('.grid-nav li a').on('click', function(event){
    event.preventDefault();
    $('.grid-container').fadeOut(500, function(){
      $('#' + gridID).fadeIn(500);
    });
    var gridID = $(this).attr("data-id");
    
    $('.grid-nav li a').removeClass("active");
    $(this).addClass("active");
  });
});