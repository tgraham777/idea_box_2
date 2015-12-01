$(document).ready(function () {
  getIdeas()
  bindSubmitButton();
});

function getIdeas() {
  $.ajax({
    type: 'GET',
    url: 'api/v1/ideas',
    success: function(response) {
      var ideaElements = $.map(response, function (idea, index) {
        var $listItem = $('<li></li>')
        .append("<h3>" + idea.title + "</h3>")
        .append("<p>" + idea.body + "</p>");
        return $listItem;
      });
      $(".idea-list").html(ideaElements);
    }
  });
}

function bindSubmitButton() {
  $('.new-idea').on('submit', function (event) {
    event.preventDefault();
    var idea = {idea: {
      title: $('#new-idea-title').val(),
      body: $('#new-idea-body').val(),
    } };
    $.post('/api/v1/ideas', idea).then(getIdeas);
  });
}
