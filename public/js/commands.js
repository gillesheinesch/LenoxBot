/* eslint-disable no-console */
// COMMANDS JS

// Filter by text
$('#search-input').on('keyup', function () {
  var value = $(this).val().toLowerCase();
  $('#table tbody tr').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
  if ($('#table tbody tr:visible').length === 0) {
    $('#notfound').show();
  }
  else {
    $('#notfound').hide();
  }
});

// Filter by buttons
// Activate current nav commands button
$('.lb-btn-list').click(function () {
  $('.lb-btn-list').each(function () {
    $(this).removeClass('lb-btn-list-focus');
  });
  $(this).addClass('lb-btn-list-focus');

  var id = $(this).attr('id');
  console.log(id);
  $('#table tbody tr').filter(function () {
    $(this).toggle($(this).attr('class').indexOf(id) > -1);
  });
});
