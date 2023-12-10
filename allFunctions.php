<?php
session_start();
$start = 0;
$limit = 20;
$sessionId = $_SESSION['session_id'];
$incomingSessionData = $_POST['session_id'];
//$previousSessionData = isset($_SESSION['prev_session_id']) ? $_SESSION['prev_session_id'] : 0;
if(isset($_SESSION['all_data']) && !empty($_SESSION['all_data'])) {
	if(($incomingSessionData == $sessionId)) {
		$storedData = $_SESSION['all_data'];
	} else {
		$storedData = array();
	}
} else {
	$storedData = array();
}
if(isset($_POST['add_edit']) && $_POST['add_edit'] == 1) { //For add a new user
	$newData = array(
		'name' => $_POST['name'],
		'id' => $_POST['id'],
		'address' => $_POST['address'],
		'gender' => $_POST['gender'],
		'file' => $_POST['file'],
		'session_id' => $_POST['session_id'],
	);
    array_push($storedData,$newData);
	$_SESSION['all_data'] = $storedData;
	$returnArray = array();
	$returnArray['status'] = 'success';
	$returnArray['message'] = 'Successfully saved your data.';
	$returnArray['totalInsertRow'] = count($storedData);
	$allData = $_SESSION['all_data'];
	$returnArray['all_data'] = array_splice($allData,$start,$limit);
	echo json_encode($returnArray); exit;
} else if(isset($_POST['add_edit']) && $_POST['add_edit'] == 2) { // For edit a user
	$userId = $_POST['edit_id'];
	$key = array_search($userId, array_column($storedData, 'id'));
	$newData = array(
		'name' => $_POST['name'],
		'id' => $_POST['edit_id'],
		'address' => $_POST['address'],
		'gender' => $_POST['gender'],
		'file' => $_POST['file'],
		'session_id' => $_POST['session_id'],
	);
	$storedData[$key] = $newData;
	unset($_SESSION['all_data']);
	$_SESSION['all_data'] = $storedData;
	$returnArray = array();
	$returnArray['status'] = 'success';
	$returnArray['message'] = 'Successfully update your data.';
	$returnArray['totalInsertRow'] = count($storedData);
	$allData = $_SESSION['all_data'];
	$returnArray['all_data'] = array_splice($allData,$start,$limit);
	echo json_encode($returnArray); exit;
} else if(isset($_POST['get_data']) && $_POST['get_data'] == 1) { //Fetch data for edit and view
	$userId = $_POST['user_id'];
	$key = array_search($userId, array_column($storedData, 'id'));
	if($key >= -1) {
		$returnArray['status'] = 'success';
		$returnArray['message'] = 'Successfully fetch your data.';
		$allData = $_SESSION['all_data'];
		$returnArray['all_data'] = $allData[$key];
		echo json_encode($returnArray); exit;
	} else {
		$returnArray['status'] = 'error';
		$returnArray['message'] = 'Invalid ID entered.';
		echo json_encode($returnArray); exit;
	}
} else if(isset($_POST['scroll_data']) && $_POST['scroll_data'] == 1) { // scroll the data with start and limit
	$start = $_POST['start'];
	$limit = $_POST['limit'];
	$returnArray = array();
	$returnArray['status'] = 'success';
	$returnArray['message'] = 'Successfully fetch your data.';
	$allData = $_SESSION['all_data'];
	$returnArray['all_data'] = array_splice($allData,$start,$limit);
	echo json_encode($returnArray); exit;
} else if(isset($_POST['delete_data']) && $_POST['delete_data'] == 1) { //Delete user data from the list
	$userId = $_POST['user_id'];
	$key = array_search($userId, array_column($storedData, 'id'));
	if($key >= -1) {
		unset($_SESSION['all_data']);
		unset($storedData[$key]);
		$_SESSION['all_data'] = $storedData;
		$returnArray = array();
		$returnArray['status'] = 'success';
		$returnArray['message'] = 'Successfully deleted your data.';
		$returnArray['totalInsertRow'] = count($storedData);
		$allData = $_SESSION['all_data'];
		$returnArray['all_data'] = array_splice($allData,$start,$limit);
		echo json_encode($returnArray); exit;
	} else {
		$returnArray['status'] = 'error';
		$returnArray['message'] = 'Invalid ID entered.';
		echo json_encode($returnArray); exit;
	}
} else if(isset($_POST['sort_data']) && $_POST['sort_data'] == 1) { //Sort user data from the list
	$sortBy = $_POST['sort_by'];
	if($sortBy == "sort_by_id") {
		$sortBy = 'id';
	} else if($sortBy == "sort_by_name") {
		$sortBy = 'name';
	}
	$sortOn = $_POST['sort_on'];
	$start = $_POST['start'];
	//print_r($storedData);
	if($sortOn == 'SORT_DESC') {
		array_multisort(array_column($storedData, $sortBy), SORT_DESC, $storedData);
	} else {
		array_multisort(array_column($storedData, $sortBy), SORT_ASC, $storedData);
	}
	$returnArray['status'] = 'success';
	$returnArray['message'] = 'Successfully sorted your data.';
	$returnArray['all_data'] = array_splice($storedData,0,($start -1));
	echo json_encode($returnArray); exit;
}