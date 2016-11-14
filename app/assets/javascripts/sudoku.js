function list_numbers(row,col){
    $.ajax({
        url: 'options/' + row + '/' + col,
        success: function(data) {
            $("#sudoku_modal").html(data);
            $("#sudoku_modal").openModal();
        }
    })
}

function choose_number(number){
    var data = {'row': $('input[name="row"]').val(), 'col': $('input[name="col"]').val()};
    $.ajax({
        url: 'add/' + number,
        type: 'post',
        data: data,
        success: function(data) {
            $("#full-table").html(data);
            closeModal('sudoku');
        }
    })
}

function reset(){
    $.ajax({
        url: 'reset',
        success: function(data) {
            $("#full-table").html(data);
        }
    })
}

function clear_highlight() {
  $('.blue').removeClass('blue');
}

function highlight_number(number,link){
  if ($(link).hasClass('green'))
    return;
  $('a.blue').removeClass('blue');
  Materialize.toast('Please wait.',4000,'good');
  $.ajax({
    url: 'color/' + number.toString(),
    success: function(data) {
      $(link).addClass('blue');
      $("#full-table").html(data);
      Materialize.toast('Finished!',4000,'good');
    }
  })
}

function take_notes() {
  Materialize.toast('Please wait.',4000,'good');
  $.ajax({
    url: 'take_notes',
    type: 'post',
    success: function(data) {
      //console.log(data);
      $("#full-table").html(data);
      Materialize.toast('Finished!',4000,'good');
    }
  });
}

function clear_notes() {
  Materialize.toast('Please wait.',4000,'good');
  $.ajax({
    url: 'clear_notes',
    type: 'post',
    success: function(data) {
      //console.log(data);
      $("#full-table").html(data);
      Materialize.toast('Finished!',4000,'good');
    }
  });
}

function closeModal(name){
    $("#" + name + "_modal").closeModal();
}

var notes = [];

function change_selection(number) {
    if (notes.indexOf(number) >= 0) {
        notes.splice(notes.indexOf(number),1);
        $("#cell" + number).css('background-color','')
    }
    else {
        notes.push(number);
        $("#cell" + number).css('background-color','#aaa')
    }
    notes.sort();
}

function save_notes(){
    var data = {'row': $('input[name="row"]').val(), 'col': $('input[name="col"]').val()};
    $.ajax({
        url: 'notes/' + notes,
        type: 'post',
        data: data,
        success: function(data) {
            $("#full-table").html(data);
            closeModal('sudoku');
        }
    })
}

function manage_selection(number){
    if ($("#saving_notes").css('display') == 'none') {
        choose_number(number);
    }
    else {
        change_selection(number);
    }
}