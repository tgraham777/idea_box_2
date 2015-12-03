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
        .append("<p>" + "Quality: " + "<span class='idea-quality'>" + idea.quality + "</span>"+ "</p>")
        .append("<button class='delete-button'>" + "Delete" + "</button>" + "<br><br>");
        return $listItem;
      });
      $(".idea-list").html($ideaElements.reverse());
      ideaBox.editIdea();
      ideaBox.deleteIdea();
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
    $('.delete-button').on('click', function(){
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
    $('.idea-list').on('click', '.idea-title', function(){
      $(this).attr('contenteditable', 'true')
      .focus()
      .on('blur', ideaBox.updateTitle)
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
      }
    });
  },
};

$(document).ready(ideaBox.init);
