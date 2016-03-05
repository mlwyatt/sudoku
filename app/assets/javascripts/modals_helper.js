function newModal(controller) {
    var controllerWithSlash = '';
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    //if (!(controllerWithSlash = getControllerWithSlash(controller))){ //assign and check if it is assigned
    //    return
    //}
    //controllerWithSlash = controller == 'companies' ? controllerWithSlash : '';
    $.ajax({
        url: controllerWithSlash + 'new',
        success: function (data) {
            $("#" + controller + "_modal").html(data);
            $("#" + controller + "_modal").openModal();
        }
    });
}

function saveModal(controller,domElement) {
    var singular,indexPath;
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    if (!(singular = getSingularController(controller))){ //assign and check if it is assigned
        return;
    }
    if (!(indexPath = getIndexClass(controller,singular))){ //assign and check if it is assigned
        return;
    }
    $.ajax({
        url: controller == 'companies' ? '/companies/' : '',
        type: 'post',
        data: $(domElement).closest("form").serialize(),
        success: function(data){
            closeModal(controller);
            $(indexPath).html(data);
            Materialize.toast('New ' + singular + ' saved!', 4000, 'rounded good');
        },
        error: function(data){
            Materialize.toast('New ' + singular + ' not saved.', 4000, 'rounded bad');
        }
    });
}

function editModal(controller, id) {
    var singular;
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    if (!(singular = getSingularController(controller))){ //assign and check if it is assigned
        return;
    }
    $.ajax({
        url: id + "/edit",
        success: function (data) {
            var modal = $("#" + controller + "_modal");
            if (data.index) {
                modal.html(data.index);
                check_form_fields('.edit_' + controller);
                if (modal.css('display') == 'none')
                    modal.openModal();
            }
            else {
                Materialize.toast('You cannot edit that ' + singular + '.', 4000, 'rounded bad');
            }
        }
    });
}

function updateModal(controller,id,domElement) {
    var singular,indexPath;
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    if (!(singular = getSingularController(controller))){ //assign and check if it is assigned
        return;
    }
    if (!(indexPath = getIndexClass(controller,singular))){ //assign and check if it is assigned
        return;
    }
    $.ajax({
        url: id,
        type: 'patch',
        data: $(domElement).closest("form").serialize(),
        success: function(data){
            closeModal(controller);
            $(indexPath).html(data);
            Materialize.toast(singular.substring(0,1).toUpperCase() + singular.substring(1) + ' updated!', 4000, 'rounded good');
        },
        error: function(data){
            Materialize.toast(singular.substring(0,1).toUpperCase() + singular.substring(1) + ' not updated.', 4000, 'rounded bad');
        }
    });
}

function searchModal(controller, method, data) {
    method = method || 'get';
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    $.ajax({
        url: "search",
        type: method,
        data: data,
        success: function (data) {
            var modal = $("#" + controller + "_modal");
            modal.html(data);
            check_form_fields('.search_' + controller);
            if (modal.css('display') == 'none')
                modal.openModal();
        }
    });
}

function addModal(controller, id) {
    var singular,indexPath;
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    if (!(singular = getSingularController(controller))){ //assign and check if it is assigned
        return;
    }
    if (!(indexPath = getIndexClass(controller,singular))){ //assign and check if it is assigned
        return;
    }
    $.ajax({
        url: "add/" + id,
        type: 'post',
        success: function(data) {
            $(indexPath).html(data.index);
            if (data.search) {
                Materialize.toast(singular.substring(0,1).toUpperCase() + singular.substring(1) + ' not added. ' + singular.substring(0,1).toUpperCase() + singular.substring(1) + ' may already be added', 4000, 'rounded bad');
            }
            else {
                if (controller == 'equipment'){
                    Materialize.toast('Equipment added! Please enter registration details', 4000, 'rounded good');
                    editModal('equipment',id);
                }
                else {
                    closeModal(controller);
                    Materialize.toast(singular.substring(0, 1).toUpperCase() + singular.substring(1) + ' added!', 4000, 'rounded good');
                }
            }
        },
        error: function(data){
            $(indexPath).html(data.index);
            Materialize.toast(singular.substring(0,1).toUpperCase() + singular.substring(1) + ' not added. ' + singular.substring(0,1).toUpperCase() + singular.substring(1) + ' may already be added', 4000, 'rounded bad');
        }
    });
}

function closeModal(controller) {
    if (!(controller = isControllerValid(controller))){//assign variable and check if it is assigned
        return;
    }
    $("#" + controller + "_modal").closeModal();
}

function change_field_type(type,value) {
    $(type).material_select();
    $(type).change(function(self) {
        if ($(this).find(":selected").val().toLowerCase() == 'email') {
            $(value).attr({type: 'email'});
        }
        else {
            $(value).attr({type: 'tel'});
        }
    });
}

function isControllerValid(controller) {
    switch (controller) {
        case 'companies':
        case 'equipment':
        case 'people':
        case 'contacts':
        case 'users':
        case 'addresses':
            return controller;
        case 'company_people':
            return 'people';
        case 'company_person_contacts':
            return 'contacts';
        default:
            return;
    }
}

function getControllerWithSlash(controller){
    switch (controller) {
        case 'companies':
            return '/companies/';
        case 'users':
            return 'users/';
        default:
            return;
    }
}

function getSingularController(controllers) {
    switch (controllers) {
        case 'companies':
            return 'company';
        case 'company_people':
        case 'people':
            return 'person';
        case 'company_person_contacts':
        case 'contacts':
            return 'contact';
        case 'equipment':
            return 'equipment';
        case 'users':
            return 'user';
        case 'addresses':
            return 'address';
        default:
            return;
    }
}

function getIndexClass(controllers, single) {
    switch (controllers) {
        case 'users':
        case 'companies':
        case 'company_person_contacts':
        case 'company_people':
            return '.' + single + '-index';
        case 'equipment':
        case 'addresses':
        case 'people':
            return '.company-' + single + '-index';
        case 'contacts':
            return '.company-person-' + single + '-index';
        default:
            return;
    }
}

$(document).ready(function(){
    $(document).on('click',"#search_companies",function(evt){
        evt.preventDefault();
        searchModal('companies','post',$(this).closest("form").serialize());
    });
    $(document).on('click',"#search_equipment",function(evt){
        evt.preventDefault();
        searchModal('equipment','post',$(this).closest("form").serialize());
    });
    $(document).on('click',"#save_new_address",function(evt){
        evt.preventDefault();
        saveModal('addresses',this);
    });
    $(document).on('click',"#save_new_equipment",function(evt){
        evt.preventDefault();
        saveModal('equipment',this);
    });
    $(document).on('click',"#save_new_contact",function(evt){
        evt.preventDefault();
        saveModal('contacts',this);
    });
    $(document).on('click',"#save_new_person",function(evt){
        evt.preventDefault();
        saveModal('people',this);
    });
    $(document).on('click',"#save_new_company",function(evt){
        evt.preventDefault();
        saveModal('companies',this);
    });
    $(document).on('click',"#save_user",function(evt){
        killEvent(evt);
        saveModal('users',$("#save_user"));
    });
    $(document).on('click',"#update_address",function(evt){
        evt.preventDefault();
        var address_id = $('[id^="edit_address_"]').first().attr("id").slice(13);
        updateModal('addresses',address_id,this);
    });
    $(document).on('click',"#update_equipment",function(evt){
        evt.preventDefault();
        var equipment_id = $('[id^="edit_equipment_"]').first().attr("id").slice(15);
        updateModal('equipment',equipment_id,this);
    });
    $(document).on('click',"#update_contact",function(evt){
        evt.preventDefault();
        var contact_id = $('[id^="edit_company_person_contact_"]').first().attr("id").slice(28);
        updateModal('contacts',contact_id,this);
    });
    $(document).on('click',"#update_person",function(evt){
        evt.preventDefault();
        var person_id = $('[id^="edit_company_person_"]').first().attr("id").slice(20);
        updateModal('people',person_id,this);
    });
    $(document).on('click',"#update_company",function(evt){
        evt.preventDefault();
        var company_id = $('[id^="edit_company_"]').first().attr("id").slice(13);
        updateModal('companies',company_id,this);
    });
    $(document).on('click',"#update_user",function(evt){
        killEvent(evt);
        var user_id = $('[id^="edit_user_"]').first().attr("id").slice(10);
        updateModal('users',user_id,this);
    });
});