var sounds = {
  soundCloudClientId: 'client_id=f5f1c67193dfe560ce6db6390276ba45',
  webhoseToken: 'fbe108d4-e3de-4323-8150-697f0a2f03cd',

  getResourceWebhose: function(enteredSearchTerm){
    var url = 'https://webhose.io/search?token='+this.webhoseToken+'&language=english&site_type=blogs&format=json&q='+enteredSearchTerm;
    $.getJSON(url, sounds.webhoseCallback);
  },
  getResourceSoundcloud: function(enteredSearchTerm){
    var url = 'https://api.soundcloud.com/tracks.json?q=' + enteredSearchTerm + '?&amp;'+ this.soundCloudClientId;
    $.getJSON(url, sounds.soundCallback);
  },
  validation: function(input){
    if(input.trim() === ""){
      $('#submit').text('Please enter a search term');
    }
    else{
      return true;
    }
    return false;
  },
  submitForm: function(){
    $('form').submit(function (evt){
      evt.preventDefault();
      var $search = $('#search');
      var $submit = $('#submit');
      var enteredSearchTerm = $('#search').val();
      if(!sounds.validation(enteredSearchTerm)){
        return;
      }
      sounds.getResourceWebhose(enteredSearchTerm);
      sounds.getResourceSoundcloud(enteredSearchTerm);
      $('#webhose-column-wrapper').show();//show related news
      $search.prop("disabled", true);//disable searchbox on ajax search
      $submit.hide();//hide submit button
      $('#ajax-loader').show();//show ajax loader
    });//End Submit
  },
  //Callback for SoundCloud
  soundCallback: function(tracks){
    var soundLists = "<ul class='rig columns-4 grid-nav'>";
    $.each(tracks, function(index, tracks){
      var downloadUrl = tracks.download_url+ '?' +sounds.soundCloudClientId; //Download Url for song
      if(index === 8){ //return only 8 search results
        return false;
      }
      //Function to solve un-downloadble songs
      function validateDownload(){
        if(tracks.downloadable === false){
          return "<p class='item-p'>This Item can only be played";
        }
        else{
          return "<a href="+downloadUrl+" title=" + tracks.title + ">Download Song</a>";
        }
      }
      //Function to solve for unavailable arworks
      function validateArtwork(){
         if(tracks.artwork_url === null){
          return "<img src='images/avatar.jpg' alt='avatar' />";
        }
        else{
          return "<img class='artwork_cover' src='"+tracks.artwork_url+"' alt='" + tracks.title + "'/>";
        }
      }//End artwork validation
      soundLists += "<li>" +
       validateArtwork() +
       "<h3>" + tracks.title.substr(0, 26).toLowerCase() + "...</h3>" +
       "<audio class='audio-label' controls>"+
        "<source src='"+tracks.stream_url+"?client_id=f5f1c67193dfe560ce6db6390276ba45' type='audio/mpeg'>"+
       "</audio>" + 
       "<p class='url'>" + validateDownload() + "</p>" +
       "<p>Uploaded By: " + tracks.user.username + "</p>" +
       "<p>Played: " + tracks.playback_count + " times</p>" +
       "</li>";
       $('.no-results').html("");
    });//END EACH
    soundLists += '</ul>';
    $('#soundcloud-columns').html(soundLists).fadeIn(500);
    $('#search').prop("disabled", false);//Enable search form
    $('#submit').text('Submit').show(); // change value of submit button
    $('#ajax-loader').hide();//hide loader
     if(tracks === ""){
        return $('.no-results').html("No Tracks Found");
      }
  },
  //Callback for Webhose
  webhoseCallback: function(search){
    var newsLists = "<ul class='rig columns-4 grid-nav'>";
    $.each(search.posts, function(index, search){
      if(index === 8){ //return only 6 search results
        return false;
      }
      function validateTitle(){
        if(search.title === ""){
          return "<h2>" + search.text.substr(0, 15) + "...</h3>";
        }
        else{
          return "<h2>" + search.title.substr(0, 15) + "...</h2>";
        }
      }//End Title validation
      newsLists += "<li>" +
           validateTitle() +
           "<p class='title'>" + search.text + "</p>" +
           "<a class='read-more' href="+search.url+" target='_blank'>Read More</a>" +
           "</li>";
           $('.no-results-webhose').html("");
    });//END EACH
    newsLists += '</ul>';
    $('#webhose-columns').html(newsLists).fadeIn(500);
     if(search.posts === ""){
        return $('.no-results-webhose').html("No results found");
      }
  }
};
$(document).ready(function(){
  sounds.submitForm();
  $('#ajax-loader').hide();
  $('#webhose-column-wrapper').hide();
});
