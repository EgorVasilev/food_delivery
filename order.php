<?php
header('Access-Control-Allow-Origin: *');
$a = '';
if (isset($_POST)){
    $a = $_POST['json'];
    }
$str = json_encode($a, JSON_UNESCAPED_UNICODE);
	
$link = mysqli_connect('localhost', 'root', '');
if (!$link) {
	die('Ошибка соединения: ');
}
else {
	$qName = mysqli_real_escape_string($link, $_POST['name']);
	$qDate = mysqli_real_escape_string($link, $_POST['orderDate']);
	$qOrder = mysqli_real_escape_string($link, $_POST['json']);
	$qNameId;
	$db_selected = mysqli_select_db($link, 'food_delivery');
	if (!$db_selected) {
    	die ('Не удалось выбрать базу');
	}
		// add new user if user not registered
	    $querySelect ="SELECT id FROM clients WHERE name='$qName'";
		$resultSelect = mysqli_query($link, $querySelect) or die("Ошибка " . mysqli_error($link));

		if (mysqli_num_rows($resultSelect) == 0) {
			$queryInsertClient ="INSERT INTO clients VALUES('', '$qName')";
			mysqli_query($link, $queryInsertClient);
			$resultSelect = mysqli_query($link, $querySelect);
			$rows = mysqli_num_rows($resultSelect);
	    	for ($i = 0 ; $i < $rows ; ++$i)
	    	{
	    	    $row = mysqli_fetch_row($resultSelect);
	    	    $qNameId = $row[0];
	    	}
		}
		else {
			$rows = mysqli_num_rows($resultSelect);
	    	for ($i = 0 ; $i < $rows ; ++$i)
	    	{
	    	    $row = mysqli_fetch_row($resultSelect);
	    	    $qNameId = $row[0];
	    	}
		}
		mysqli_free_result($resultSelect);

		// add information about new order
		$queryInsertOrder ="INSERT INTO orders (clientid, client_order, order_date) VALUES ('$qNameId', '$qOrder', '$qDate')";
		mysqli_query($link, $queryInsertOrder);
}

mysqli_close($link);

echo $str , ', ' ,  $_POST['name'], ', ' , $_POST['orderDate'];

 ?>