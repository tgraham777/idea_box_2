var ideaBox = {
  init: function(){
    ideaBox.getIdeas();
    ideaBox.bindSubmitButton();
  },

  getIdeas: function(){
    $.getJSON('api/v1/ideas', function(response){
      var $ideaElements = $.map(response, function (idea, index) {
        var $listItem = $('<li></li>')
        .addClass('idea')
        .attr('id', idea.id)
        .append("<h3 class='idea-title'>" + idea.title + "</h3>")
        .append("<p class='idea-body'>" + idea.body + "</p>")
        .append("<p class='idea-quality'>" + "Quality: " + "<span id='idea-quality'>" + "<i>" + idea.quality + "</i>" + "</span>"+ "</p>")
        .append("<button id='thumbs-up-button'>" + "Thumbs Up!" + "</button>&nbsp")
        .append("<button id='thumbs-down-button'>" + "Thumbs Down!" + "</button>&nbsp&nbsp&nbsp")
        .append("<button class='delete-button'>" + "Delete" + "</button>" + "<br><br>");
        return $listItem;
      });
      $(".idea-list").html($ideaElements.reverse());
      ideaBox.truncateBody();
      ideaBox.editIdea();
      ideaBox.thumbsUpDown();
      ideaBox.deleteIdea();
      ideaBox.searchIdeas();
    });
  },

  bindSubmitButton: function(){
    $('.new-idea').on('submit', function (event) {
      event.preventDefault();
      var $data = $(this).serialize();
      $.post( '/api/v1/ideas', $data, function(){
        ideaBox.getIdeas();}, 'JSON');
        $(this).trigger('reset');
    });
  },

  deleteIdea: function(){
    $('.delete-button').one('click', function(){
      var $idea = $(this).closest('.idea');
      $.ajax( {
        url: '/api/v1/ideas/' + $idea.attr('id'),
        type: 'DELETE',
        dataType: 'JSON',
        success: function(){
          $idea.remove();
        }
      });
    });
  },

  editIdea: function(){
    ideaBox.editTitle();
    ideaBox.editBody();
  },

  editTitle: function(){
    $('.idea-list').one('click', '.idea-title', function(){
      $(this).attr('contenteditable', 'true')
      .focus()
      .one('blur', ideaBox.updateTitle)
    });
  },

  updateTitle: function(event){
    var $idea = $(this).closest('.idea');
    var $title = $idea.find('.idea-title').text();
    $.ajax({
      type: 'PATCH',
      url: '/api/v1/ideas/' + $idea.attr( 'id' ),
      data: {idea: {title: $title}},
      success: function(){
        ideaBox.getIdeas();
      }
    });
  },

  editBody: function(){
    $('.idea-list').one('click', '.idea-body', function(){
      $(this).attr('contenteditable', 'true')
      .focus()
      .one('blur', ideaBox.updateBody)
    });
  },

  updateBody: function(event){
    var $idea = $(this).closest('.idea');
    var $body = $idea.find('.idea-body').text();
    $.ajax({
      type: 'PATCH',
      url: '/api/v1/ideas/' + $idea.attr('id'),
      data: {idea: {body: $body}},
      success: function(){
        ideaBox.getIdeas();
      },
      error: console.log("failed")
    });
  },

  thumbsUpDown: function(){
    ideaBox.thumbsUp();
    ideaBox.thumbsDown();
  },

  thumbsUp: function(){
    $('.idea-list').one('click', '#thumbs-up-button', function(){
      var $idea = $(this).closest('.idea');
      var $quality = $idea.find('#idea-quality').text();
      if($quality === "swill") {
          ideaBox.updateQuality($idea, "plausible");
      } else if($quality === "plausible") {
          ideaBox.updateQuality($idea, "genius");
      } else {
          console.log("Idea already rated genius!")
          ideaBox.getIdeas();
      }
    })
  },

  thumbsDown: function(){
    $('.idea-list').one('click', '#thumbs-down-button', function(){
      var $idea = $(this).closest('.idea');
      var $quality = $idea.find('#idea-quality').text();
      if($quality === "swill") {
          console.log("Idea already rated as swill!")
      } else if($quality === "plausible") {
          ideaBox.updateQuality($idea, "swill");
      } else {
          ideaBox.updateQuality($idea, "plausible");
      }
    })
  },

  updateQuality: function($idea, quality){
    $.ajax({
      type: 'PATCH',
      url: '/api/v1/ideas/' + $idea.attr('id'),
      data: {idea: {quality: quality}},
      success: function(){
        ideaBox.getIdeas();
      },
    });
  },

  truncateBody: function(){
    $('.idea').each(function(_, idea){
      var $body = $(idea).find('.idea-body');
      var $before = $body.text();
      var $after = ideaBox.shortenText($before);
      $body.text($after);
    });
  },

  shortenText: function(string){
    if(string.length >= 100) {
      var cut = string.lastIndexOf(' ', 100);
      var shortenedString =  string.substring(0, cut) + '...';
    }
    return shortenedString;
  },

  searchIdeas: function(){
    $("#search-bar").keyup(function(){
      var input = $(this).val();
      $(".idea-list li").each(function(){
        if ($(this).text().search(new RegExp(input, "i")) < 0) {
            $(this).fadeOut();
        } else {
            $(this).show();
        }
      });
    });
  }
};

$(document).ready(ideaBox.init);
