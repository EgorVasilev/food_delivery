<?php 
header('Access-Control-Allow-Origin: *');

$date = '';
if (isset($_POST)) {
   $date = $_POST['orderDate'];
}
$resArr = array();
$link = mysqli_connect('localhost', 'root', '');
if (!$link) { die('Ошибка соединения: '); }
else {
	$db_selected = mysqli_select_db($link, 'food_delivery');
	if (!$db_selected) { die ('Не удалось выбрать базу'); }

	$querySelect ="SELECT name, order_date, client_order FROM clients INNER JOIN orders ON order_date='$date' AND clientid=id;";
	$resultSelect = mysqli_query($link, $querySelect) or die("Ошибка " . mysqli_error($link));
	$obj = mysqli_fetch_object($resultSelect);
	while ($row = mysqli_fetch_object($resultSelect)) {
		array_push($resArr, $row);
	}
	mysqli_free_result($resultSelect);
}
mysqli_close($link);
$strJSON = json_encode($resArr, JSON_UNESCAPED_UNICODE);

echo $strJSON;
 
?>