<?php
	session_start();
	session_destroy();
	session_start();
	/*if(isset($_SESSION['session_id']) && !empty($_SESSION['session_id'])) {
		$_SESSION['prev_session_id'] = $_SESSION['session_id'];
		unset($_SESSION['session_id']);
	} */
	$_SESSION['session_id'] = rand();
?>
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/alertify.css"  referrerpolicy="no-referrer" />
		<link rel="stylesheet" href="css/style.css"  referrerpolicy="no-referrer" />
		<script type="text/javascript" src="js/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery.validate.js"></script>
		<script type="text/javascript" src="js/alertify.js"></script>
	</head>
	<body>
		<button id="add_user">Add User</button>
		<form class="userRegister" id="userRegister" novalidate="novalidate" enctype="multipart/form-data">
			<div class="row">
				<div class="col-lg-4 col-md-4 col-sm-4 hedp">
					<p>ID*</p>
					<input type="text" class="form-control formstyle" name="id" id="id" placeholder="Enter Your Id">
				</div>
				<div class="col-lg-4 col-md-4 col-sm-4 hedp">
					<p>Name*</p>
					<input type="text" class="form-control formstyle" name="name" id="name" placeholder="Enter Your Name">
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 hedp">
					<p>Image*</p>
					<input type="file" name="file" id="file" class="formstyle w-100" />
					<a class="closeclear3"></a> 
				</div>
				<div class="col-lg-4 col-md-4 col-sm-4 hedp">
					<p>Address*</p>
					<input type="text" class="form-control formstyle" name="address" id="address" placeholder="Enter Your Address">
				</div>
				<div class="col-lg-4 col-md-4 col-sm-4 hedp">
					<p>Gender*</p>
					<select class="form-control formstyle" name="gender" id="gender">
						<option value="Male">Male</option>
						<option value="Female">Female</option>
					</select>
					<!--<input type="text" class="form-control formstyle" name="gender" id="gender" placeholder="Enter Your Gender">-->
				</div>
			</div>
			<div class="col-md-12"><input type="submit" value="Submit" class="submitButton" id="getDataBtn"></div>
			<input type="hidden" name="add_edit" value="1" id="add_edit">
			<input type="hidden" name="edit_id" value="" id="edit_id">
			<input type="hidden" name="session_id" value="<?php echo $_SESSION['session_id'];?>" id="session_id">
			<div class="success-error col-md-12 m-3">
				<div id="success-msg" class="submitsucess alert alert-info" style="display:none;"></div>
				<div id="error-msg" class="sign submiterror alert alert-danger" style="display:none;"></div>
			</div>
		</form>
		<!---------------Table-------------------->
		<div id="wrapper">
			<div id="list-div">
				<table id="myTable">
					<thead>
						<th><a href="javascript:void(0)" id="sort_by_id" data-id="SORT_DESC" class="sort_data">ID</a></th>
						<th><a href="javascript:void(0)" id="sort_by_name" data-id="SORT_DESC" class="sort_data">Name</a></th>
						<th>Image</th>
						<th>Address</th>
						<th>Gender</th>
						<th>Action</th>
					</thead>
					<tbody >
						
					</tbody>
				</table>
			</div>
			<div id="view-div">
				<p>View User</p>
				<label>ID: <span id="view_id"></span></label></br>
				<label>Name: <span id="view_name"></span></label></br>
				<label>Image: <span id="view_file"></span></label></br>
				<label>Address: <span id="view_address"></span></label></br>
				<label>Gender: <span id="view_gender"></span></label>
			</div>
		</div
	</body>
	<script src="js/user.js"></script>
</html>