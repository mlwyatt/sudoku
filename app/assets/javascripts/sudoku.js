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
    $.ajax({
        url: number + '/add',
        type: 'post',
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

function highlight_number(number){
    $.ajax({
        url: number + '/color',
        success: function(data) {
            //console.log(data);
            $("#full-table").html(data);
        }
    })
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
    $.ajax({
        url: notes + '/notes',
        type: 'post',
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