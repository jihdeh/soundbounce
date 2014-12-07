var sounds = {
  soundCloudClientId: 'client_id=f5f1c67193dfe560ce6db6390276ba45',
  webhoseToken: 'fbe108d4-e3de-4323-8150-697f0a2f03cd',

  getResourceWebhose: function(enteredSearchTerm){
    var url = 'https://webhose.io/search?token='+this.webhoseToken+'&format=json&q='+enteredSearchTerm;
    $.getJSON(url, sounds.webhoseCallback);
  },
  getResourceSoundcloud: function(enteredSearchTerm){
    var url = 'https://api.soundcloud.com/tracks.json?q=' + enteredSearchTerm + '?&amp;'+ this.soundCloudClientId;
    $.getJSON(url, sounds.soundCallback);
  },
  submitForm: function(){
    $('form').submit(function (evt){
      evt.preventDefault();
      var $search = $('#search');
      var $submit = $('#submit');
      var enteredSearchTerm = $('#search').val();
      sounds.getResourceWebhose(enteredSearchTerm);
      sounds.getResourceSoundcloud(enteredSearchTerm);
    });//End Submit
  },
  //Callback for SoundCloud
  soundCallback: function(tracks){
    var soundLists = "<ul class='rig columns-4 grid-nav'>";
    $.each(tracks, function(index, tracks){
      var downloadUrl = tracks.download_url+ '?' +sounds.soundCloudClientId; //Download Url for song
      if(index === 8){ //return only 6 search results
        return false;
      }
      //Function to solve un-downloadble songs
      function validateUrl(){
        if(tracks.downloadable === false){
          return "This Item can only be played";
        }
        else{
          return "<a href="+downloadUrl+" title=" + tracks.title + ">Download Song</a>";
        }
      }
      //Function to solve for unavailable arworks
      function validateartwork(){
         if(tracks.artwork_url == null){
          return "<img src='images/avatar.jpg' alt='avatar' />";
        }
        else{
          return "<img class='artwork_cover' src='"+tracks.artwork_url+"'/>";
        }
      }//End validation
      soundLists += "<li>" +
           validateartwork() +
           "<h3>" + tracks.title + "</h3>" +
           "<audio class='cont-4' src='"+tracks.stream_url+"?client_id=f5f1c67193dfe560ce6db6390276ba45' type='audio/mpeg' controls='controls'></audio>" + 
           "<p>" + validateUrl() + "</p>" +
           "</li>";
    });//END EACH
    soundLists += '</ul>';
    // sounds.newItem += sounds.closeNewItem;
    $('#soundcloud-columns').html(soundLists).fadeIn(500);
  },
  //Callback for Webhose
  webhoseCallback: function(tracks){
    var newsLists = "<ul class='rig columns-4 grid-nav'>";
    $.each(tracks.posts, function(index, tracks){
      if(index === 8){ //return only 6 search results
        return false;
      }
      newsLists += "<li>" +
           "<h2>" +tracks.title+ "</h2>"+
           "<p class='title'>"+tracks.text+"</p>"+
           "<a class='url' href="+tracks.url+" target='_blank'>Read More</a>"+
           "</li>";
           console.log(tracks.thread);
    });//END EACH
    newsLists += '</ul>';
    $('#webhose-columns').html(newsLists).fadeIn(500);
  }
  };
$(document).ready(sounds.submitForm);
