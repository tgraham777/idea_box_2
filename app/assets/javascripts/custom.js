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
        .append("<h3>" + idea.title + "</h3>")
        .append("<p>" + "Description: " + idea.body + "</p>")
        .append("<p>" + "Quality: " + idea.quality + "</p>")
        .append("<button class='delete-button'>" + "Delete" + "</button>");
        return $listItem;
      });
      $(".idea-list").html($ideaElements);
      ideaBox.deleteIdea();
    });
  },

  bindSubmitButton: function(){
    $('.new-idea').on('submit', function (event) {
      event.preventDefault();
      var $data = $( this ).serialize();
      $.post( '/api/v1/ideas', $data, function(){
        ideaBox.getIdeas();}, 'JSON' );
        $( this ).trigger( 'reset' );
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
  }
};

$(document).ready(ideaBox.init);
