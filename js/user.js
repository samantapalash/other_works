var startValue = 20;
var limitValue = 20;
var totalInsertRow = 0;
var start = startValue;
var limit = startValue;
var base64ImgUrl = "";
$(document).ready(function(){
	const MAX_FILE_SIZE = 5;
	$(document).on('click', '#add_user', function(){
		$('#userRegister')[0].reset();
		$('#add_edit').val(1);
		$('#edit_id').val("");
	});
	$(document).on('click', '.edit_user', function(){
		$('#add_edit').val(2);
		let userId = $(this).attr('id');
		$('#edit_id').val(userId);
		getUserData(userId);
	});
	$(document).on('click', '.view_user', function(){
		$('#add_edit').val(2);
		let userId = $(this).attr('id');
		$('#edit_id').val(userId);
		getUserData(userId);
	});
	$(document).on('click', '.sort_data', function(){
		let sortBy = $(this).attr('id');
		let sortOn = $(this).attr('data-id');
		getUserSortData(sortBy,sortOn);
	});
	$(document).on('change', '#file', function(){
		const file = this.files[0];
        //console.log(file);
        if (file){
			let reader = new FileReader();
			reader.onload = function(event){
				//console.log(event.target.result);
				base64ImgUrl = event.target.result;
				//$('#imgPreview').attr('src', event.target.result);
			}
			reader.readAsDataURL(file);
        } else {
			base64ImgUrl = "";
		}
	});
	$(document).on('click', '.delete_user', function(){
		let userId = $(this).attr('id');
		alertify.confirm('Delete!!', 'Are you sure to delete the user', function(){
			let sessionId = $("#session_id").val();
			$.ajax({
				type: 'POST',
				url: "allFunctions.php",
				data: {user_id:userId,delete_data: 1,session_id:sessionId},
				success: function(response){
					var obj = jQuery.parseJSON(response);
					var html = '';
					start = startValue;
					limit = limitValue;
					totalInsertRow = obj.totalInsertRow;
					html = formHtml(obj);
					if(html == ''){
						html += '<tr>';
						html += '<td colspan="6" style="text-align:center">';
						html += 'No Reccords Found!!';
						html += '</td>';
						html += '</tr>';
						//$('#myTable tbody').html(html);
					}
					$('#myTable tbody').html(html);
					alertify.success('Successfully Deleted!!');
				}
			});
		}, function(){
			alertify.error('Cancel');
		});
	});
    jQuery.validator.addMethod("namevalidations", function (value, element, params) {
        result = true;
        if(value != ""){
            var re = /^[A-Za-z][A-Za-z0-9 ]*(?:_[A-Za-z0-9 ]+)*$/;
            result = re.test(value);
            return result;
        }else{
            return result;
        }
    }, jQuery.validator.messages.namevalidations);
	
	jQuery.validator.addMethod("namevalidations1", function (value, element, params) {
        result = true;
        if(value != ""){
            var re = /^[A-Za-z][A-Za-z ]*(?:_[A-Za-z ]+)*$/;
            result = re.test(value);
            return result;
        }else{
            return result;
        }
    }, jQuery.validator.messages.namevalidations);

	
	$('#userRegister').validate({
		debug:false,
		errorElement:"span",
        errorClass:"errorMsgClass",
		rules:{
			id:{
				required: true,
				number: true,
				maxlength:10
			},
			name:{
				required: true,
				namevalidations1: true,
				maxlength:50
			},
			address:{
				required: true,
				maxlength:150
			},
			gender:{
				required: true,
				namevalidations:true,
				maxlength:10
			},
		},
		messages:{
			id:{
				required: "Please enter ID.",
				number: "Enter numeric digits only.",
				maxlength:"ID can be of maximum 10 digits only."
			},
			name:{
				required: "Please enter your name.",
				namevalidations1: "Please enter a valid name.",
				maxlength:"Name can be of maximum 50 characters."
			},
			address:{
				required: "Please enter your address.",
				maxlength:"Address can be of maximum 150 characters."
			},
			gender:{
				required: "Please enter your gender.",
				namevalidations:"Enter valid gender.",
				maxlength:"Enter valid gender"
			},
			
		},
		submitHandler: function() {
			var form_data = new FormData();
			/*var files = $('#file')[0].files;
			var error = '';
			for(var count = 0; count<files.length; count++) {
				var name = files[count].name;
				var extension = name.split('.').pop().toLowerCase();
				if(jQuery.inArray(extension, ['png','jpg','jpeg', 'gif', 'jfif', 'JPEG', 'JPG', 'PNG']) == -1) {
					error += "Invalid " + count + " Image File"
				} else {
					form_data.append("file[]", files[count]);
				}
			}*/
			form_data.append("file", base64ImgUrl);
			form_data.append("name", $('#name').val());
			form_data.append("id", $('#id').val());
			form_data.append("address", $('#address').val());
			form_data.append("gender", $('#gender').val());
			form_data.append("add_edit", $('#add_edit').val());
			form_data.append("edit_id", $('#edit_id').val());
			form_data.append("session_id", $('#session_id').val());
			$('.submitButton').prop('disabled', true);
			$.ajax({
				type: 'POST',
				url: "allFunctions.php",
				data: form_data,
				processData: false,
				contentType: false,
				beforeSend:function(){
				},
				success: function(response){
					var obj = jQuery.parseJSON(response);
					var error_success = obj.status;
					if(error_success == 'success'){
						$('#success-msg').show();
						$('#success-msg').html(obj.message);
						start = startValue;
						limit = limitValue;
						setTimeout(function(){ 
							$('.submitButton').prop('disabled', false);
							$('#success-msg').fadeOut();
							$('#userRegister')[0].reset();
							$('#file').val('');
							$('#edit_id').val('');
							$('#add_edit').val(1);
							base64ImgUrl = "";
							totalInsertRow = obj.totalInsertRow;
							ajaxresponse(response);
							}, 200);
					} else {
						$('#error-msg').show();
						$('#error-msg').html(obj.message);
						setTimeout(function(){ 
							$('#error-msg').fadeOut();
							$('.submitButton').prop('disabled', false);
							}, 500);
					}
				}
			});
		}
    });
	$('#file').bind('change', function() {
		var maxFileSizeLimit = this.files[0].size/(1000 * 1000);
		if(maxFileSizeLimit > MAX_FILE_SIZE) {
			alertify.alert('Invalid image....', 'You have exceeded the file limit.', function(){ 
				$('#file').val('');
			});
		}
		var validExtensions = ["jpg","jpeg","gif","png","jfif"]
		var file = $(this).val().split('.').pop();
		if (validExtensions.indexOf(file) == -1) {
			alertify.alert('File Extension!', "Please upload in .jpeg/ .jpg/ .png format only (Max " + MAX_FILE_SIZE + "MB)", function(){ 
				$('#file').val('');
			});
		}
	});
	function getUserData(userId) {
		let sessionId = $("#session_id").val();
		$.ajax({
			type: 'POST',
			url: "allFunctions.php",
			data: {user_id:userId,get_data: 1,session_id:sessionId},
			success: function(response){
				var obj = jQuery.parseJSON(response);
				$("#id").val(obj.all_data.id);
				$("#name").val(obj.all_data.name);
				$("#address").val(obj.all_data.address);
				$("#gender").val(obj.all_data.gender);
				$("#view_id").html(obj.all_data.id);
				$("#view_name").html(obj.all_data.name);
				$("#view_address").html(obj.all_data.address);
				$("#view_gender").html(obj.all_data.gender);
				if(obj.all_data.file) {
					$("#view_file").html('<img src="'+obj.all_data.file+'" width="100px" height="100px"/>');
				} else {
					$("#view_file").html("N/A");
				}
			}
		});
	}
	function getUserSortData(sortBy,sortOn) {
		let sessionId = $("#session_id").val();
		$.ajax({
			type: 'POST',
			url: "allFunctions.php",
			data: {sort_by:sortBy,sort_on:sortOn,sort_data: 1,start:start,session_id: sessionId},
			success: function(response){
				let nowSortOn = (sortOn == "SORT_DESC") ? "SORT_ASC" : "SORT_DESC";
				$("#"+sortBy).attr('data-id',nowSortOn);
				var obj = jQuery.parseJSON(response);
				ajaxresponse(response);
			}
		});
	}
	function ajaxresponse(response){
		var obj = jQuery.parseJSON(response);
		//console.log(obj.all_data[0]);
		var html = '';
		html = formHtml(obj);
		if(html == ''){
			html += '<tr>';
			html += '<td colspan="6" style="text-align:center">';
			html += 'No Reccords Found!!';
			html += '</td>';
			html += '</tr>';
			//$('#myTable tbody').html(html);
		}
		$('#myTable tbody').html(html);
	}
});
$(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() > $(document).height() - 150) {
       let sessionId = $("#session_id").val();
	   /*console.log("start",start);
	   console.log("limit",limit);
	   console.log("totalInsertRow",totalInsertRow);*/
		if (start < totalInsertRow) {
			$.ajax({
				type: 'POST',
				url: "allFunctions.php",
				data: {start:start,limit:limit,scroll_data: 1,session_id:sessionId},
				success: function(response){
					start = parseInt(start) + parseInt(limit);
					/*let newStart = parseInt(start) + parseInt(limit);
					if(newStart < totalInsertRow) {
						start = newStart;
					}*/
					var obj = jQuery.parseJSON(response);
					let html = formHtml(obj);
					$('#myTable tbody').append(html);
				}
			});
		}
	}
});
function formHtml(obj) {
	var html = '';
	for(i=0;i< obj.all_data.length;i++) {
		html += '<tr>';
		html += '</td>';
		if(typeof obj.all_data[i].id != "undefined" && obj.all_data[i].id != ""){
			html += '<td>'+obj.all_data[i].id;
			html += '</td>';
		} else {
			html += '<td>N/A';
			html += '</td>';
		}
		if(obj.all_data[i].name != ""){
			html += '<td>'+obj.all_data[i].name;
			html += '</td>';
		} else {
			html += '<td>N/A';
			html += '</td>';
		}
		html += '<td>';
		if(obj.all_data[i].file != ""){
			html += obj.all_data[i].id + ".jpg";
		} else {
			html += 'N/A';
		}
		html += '</td>';
		html += '<td>';
		if(obj.all_data[i].address != ""){
			html += obj.all_data[i].address;
		} else {
			html += 'N/A';
		}
		html += '</td>';
		html += '<td>';
		if(obj.all_data[i].gender != ""){
			html += obj.all_data[i].gender;
		} else {
			html += 'N/A';
		}
		html += '</td>';
		if(obj.all_data[i].id != ""){
			var user_id = obj.all_data[i].id;
		} else {
			var user_id = 'N/A';
		}
		html += '<td>';
		html += ''+'<a href="javascript:void(0)" title="Edit" class="edit_user menu" id="'+ user_id +'" data-value="Edit">Edit</a>';
		html += '   '+'<a href="javascript:void(0)" data-toggle="tooltip" title="View" class="view_user" data-value="View" id="'+ user_id +'">View</a>';
		html += '  '+'<a href="javascript:void(0)" data-toggle="tooltip" title="Delete" class="delete_user" data-original-title="Delete!" id="'+user_id+'">Delete</a>';
		html += '</td>';
		html += '</tr>';
	}
	return html;
}