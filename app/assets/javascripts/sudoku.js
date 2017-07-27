var choosingCell;
$(document).ready(function() {
  $('.highlight-number').on('click', function(e) {
    e.preventDefault();
    highlight_number(Number($(this).text()), this);
  });
  $('.take-notes').on('click', function(e) {
    e.preventDefault();
    take_notes(this);
  });
  $('.clear-notes').on('click', function(e) {
    e.preventDefault();
    clear_notes(this);
  });
  $('.list-numbers').on('click', function(e) {
    e.preventDefault();
    choosingCell = this;
    list_numbers(this);
  });
  $('.reset-board').on('click', function(e) {
    e.preventDefault();
    reset(this);
  });
})
.on('click', '.save-notes', function(e) {
  e.preventDefault();
  save_notes(this);
})
.on('click','.clear-cell',function(e){
  e.preventDefault();
  choose_number(this,0);
});

function list_numbers(el) {
  $.ajax({
    url: $(el).attr('href'),
    success: function(data) {
      $("#sudoku_modal").html(data);
      $("#sudoku_modal").openModal();
    }
  })
}

function choose_number(el,number) {
  var data = { 'row': $('input[name="row"]').val(), 'col': $('input[name="col"]').val() };
  $.ajax({
    url: $(el).attr('href').replace(/NUMBER/,number),
    type: 'post',
    data: data,
    success: function(data) {
      $("#full-table").html(data.html);
      $('td:contains(' + highlighted + ')').addClass('blue');
      $('td:contains(' + highlighted + '):has(div)').addClass('lighten-2');
      if (data.number_finished) {
        $('.highlight-number:contains(' + number + ')').addClass('green').removeClass('blue');
      }
      else {
        // fixme number is 0 when clearing
        $('.highlight-number:contains(' + number + ')').removeClass('green');
      }
      closeModal('sudoku');
    }
  })
}

function reset(el) {
  $.ajax({
    url: el.href,
    success: function(data) {
      $("#full-table").html(data);
      $('.green').removeClass('green').addClass('red');
      $('.blue').removeClass('blue');
    }
  })
}

function clear_highlight(nullify) {
  $('.blue').removeClass('blue');
  if (nullify) {
    highlighted = null;
  }
}

var highlighted = 0;
function highlight_number(number, link) {
  if ($(link).hasClass('green')) {
    return;
  }
  clear_highlight(highlighted != number);
  if (highlighted == number) {
    highlighted = null;
    return;
  }
  else {
    $('a.blue').removeClass('blue');
    $(link).addClass('blue');
    highlighted = number;
    $('td:contains(' + highlighted + ')').not('.red').addClass('blue');
    $('td:contains(' + highlighted + '):has(div)').not('.red').addClass('lighten-2');
  }
}

function take_notes(el) {
  Materialize.toast('Please wait.', 4000, 'good');
  $.ajax({
    url: el.href,
    type: 'post',
    success: function(data) {
      $("#full-table").html(data);
      $('td:contains(' + highlighted + ')').not('.red').addClass('blue');
      $('td:contains(' + highlighted + '):has(div)').not('.red').addClass('lighten-2');
      Materialize.toast('Finished!', 4000, 'good');
    }
  });
}

function clear_notes(el) {
  Materialize.toast('Please wait.', 4000, 'good');
  $.ajax({
    url: el.href,
    type: 'post',
    success: function(data) {
      $("#full-table").html(data);
      $('td:contains(' + highlighted + ')').not('.red').addClass('blue');
      Materialize.toast('Finished!', 4000, 'good');
    }
  });
}

function closeModal(name) {
  $("#" + name + "_modal").closeModal();
}

var notes = [];

function change_selection(number) {
  if (notes.indexOf(number) >= 0) {
    notes.splice(notes.indexOf(number), 1);
    $("#cell" + number).css('background-color', '')
  }
  else {
    notes.push(number);
    $("#cell" + number).css('background-color', '#aaa')
  }
  notes.sort();
}

function save_notes(el) {
  var data = { 'row': $('input[name="row"]').val(), 'col': $('input[name="col"]').val() };
  $.ajax({
    url: el.href.replace(/NOTES/, notes),
    type: 'post',
    data: data,
    success: function(data) {
      $("#full-table").html(data);
      closeModal('sudoku');
      $('td:contains(' + highlighted + ')').not('.red').addClass('blue');
      $('td:contains(' + highlighted + '):has(div)').not('.red').addClass('lighten-2');
    }
  })
}

function manage_selection(el,number) {
  if ($("#saving_notes").css('display') == 'none') {
    choose_number(el,number);
  }
  else {
    change_selection(number);
  }
}