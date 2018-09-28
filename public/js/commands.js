// COMMANDS JS

// Filter by buttons
$(".lb-btn-list").click(function () {
    var value = this.id;
    $("#table tbody tr").filter(function () {
        $(this).toggle($(this).attr('class').indexOf(value) > - 1);
        
    });
});

// Filter by text
$("#search-input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#table tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

// Activate current nav commands button
$('.lb-btn-list').click(function(){
    $('.lb-btn-list').each(function(){
        $(this).removeClass('lb-btn-list-focus');
        console.log(this);
    });
    $(this).addClass('lb-btn-list-focus');
});