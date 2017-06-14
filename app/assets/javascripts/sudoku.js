$(document).ready(function(){
  $('.highlight-number').on('click',function(e){
    e.preventDefault();
    highlight_number(Number($(this).text()),this);
  });
  $('.take-notes').on('click',function(e){
    e.preventDefault();
    take_notes();
  });
  $('.clear-notes').on('click',function(e){
    e.preventDefault();
    clear_notes();
  });
});

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
            $('td:contains(' + highlighted + ')').not('[id^="cell"]').addClass('blue');
            $('td:contains(' + highlighted + '):has(div)').not('[id^="cell"]').addClass('lighten-2');
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

function clear_highlight(nullify) {
  $('.blue').removeClass('blue');
  if (nullify)
    highlighted = null;
}

var highlighted = 0;
function highlight_number(number,link){
  if ($(link).hasClass('green'))
    return;
  clear_highlight(highlighted != number);
  if (highlighted == number) {
    highlighted = null
    return;
  }
  else {
    $('a.blue').removeClass('blue');
    $(link).addClass('blue');
    highlighted = number;
    $('td:contains(' + highlighted + ')').not('[id^="cell"]').addClass('blue');
    $('td:contains(' + highlighted + '):has(div)').not('[id^="cell"]').addClass('lighten-2');
  }
}

function take_notes() {
  Materialize.toast('Please wait.',4000,'good');
  $.ajax({
    url: 'take_notes',
    type: 'post',
    success: function(data) {
      $("#full-table").html(data);
      $('td:contains(' + highlighted + ')').not('[id^="cell"]').addClass('blue');
      $('td:contains(' + highlighted + '):has(div)').not('[id^="cell"]').addClass('lighten-2');
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
      $('td:contains(' + highlighted + ')').not('[id^="cell"]').addClass('blue');
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
            $('td:contains(' + highlighted + ')').not('[id^="cell"]').addClass('blue');
            $('td:contains(' + highlighted + '):has(div)').not('[id^="cell"]').addClass('lighten-2');
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