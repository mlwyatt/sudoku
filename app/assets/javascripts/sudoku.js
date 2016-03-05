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

}

function closeModal(name){
    $("#" + name + "_modal").closeModal();
}