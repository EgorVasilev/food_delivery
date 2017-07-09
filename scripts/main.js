
var app = new Vue({
	el: '#app',
	data : {
		day: 'monday',
		menu : {
			monday : {
				soup : [{name : 'Щи', weight : '110 гр.', cost : '50.00', qt : 1}],
				hotMeal : [{name : 'Курица тушеная с овощами', weight : '80 гр.', cost : '65.00', qt : 1},
						{name : 'Треска отварная', weight : '80 гр.', cost : '64.00', qt : 1}
						],
				garnish : [{name : 'Макароны', weight : '110 гр.', cost : '38.00', qt : 1},
						{name : 'Гречка', weight : '110 гр.', cost : '38.00', qt : 1}
						],
				sideDish : [{name : 'Оливье', weight : '70 гр.', cost : '40.00', qt : 1},
						{name : 'Венегрет', weight : '70 гр.', cost : '40.00', qt : 1}
						]
			},
			tuesday : {
				soup : [{name : 'Борщ', weight : '110 гр.', cost : '54.00', qt : 1}],
				hotMeal : [{name : 'Курица жареная с сыром', weight : '80 гр.', cost : '68.00', qt : 1},
						{name : 'Окунь жареный', weight : '80 гр.', cost : '62.00', qt : 1}
						],
				garnish : [{name : 'Макароны', weight : '110 гр.', cost : '35.00', qt : 1},
						{name : 'Перловка', weight : '110 гр.', cost : '36.00', qt : 1}
						],
				sideDish : [{name : 'Цезарь', weight : '70 гр.', cost : '45.00', qt : 1},
						{name : 'Весенний', weight : '70 гр.', cost : '40.00', qt : 1}
						]
			},
			wednesday : {
				soup : [{name : 'Борщ', weight : '110 гр.', cost : '54.00', qt : 1}],
				hotMeal : [{name : 'Курица жареная с сыром', weight : '80 гр.', cost : '68.00', qt : 1},
						{name : 'Окунь жареный', weight : '80 гр.', cost : '62.00', qt : 1}
						],
				garnish : [{name : 'Макароны', weight : '110 гр.', cost : '35.00', qt : 1},
						{name : 'Перловка', weight : '110 гр.', cost : '36.00', qt : 1}
						],
				sideDish : [{name : 'Цезарь', weight : '70 гр.', cost : '45.00', qt : 1},
						{name: 'vesennii', weight : '70 гр.', cost : '40.00', qt : 1}
						]
			}

		},
		checked : [],
		ordersToday : [],
		numOfPortions : 1,
		respSuccess : false
		

	},
	methods : {
		daySet : function(event) {
			// add line under chosen day
			var element = event.currentTarget;
			var otherElements = document.getElementsByClassName("week-day");
			for (var i = 0; i < otherElements.length; i++) {
				// erase underline when chose another day
				otherElements[i].className = "week-day"
			};
			this.day = element.id
			element.className += " week-day-set"
			// reject checkboxes
			this.checked = []
		},
		sendOrder: function() {
			app.respSuccess = true;
			var sendJSON = JSON.stringify(this.checked);
			var date = new Date();
			// date format: YYYY-M-D
			date = String(date.getFullYear()) + '-' + String(date.getMonth()) + '-' + String(date.getDate());
			var clientName = document.getElementById('clientName').value;
			console.log(clientName);

			var xml = new XMLHttpRequest();
			xml.open('POST', 'http://127.0.0.1/food_delivery/order.php', true);
			xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			xml.send('json=' + sendJSON +'&name=' + clientName + '&orderDate=' + date);
			xml.onreadystatechange = function() {
				if (xml.status != 200) {
			  		alert ('извините, произошла ошибка при передачи данных');
				} 
				else {
				  if (this.readyState == this.DONE) {
			        if (this.onreadystatechange) {

			            var res = xml.responseText;
				  		res = res.split(', ');
				  		var clientOrderJSON = JSON.parse(JSON.parse(res.splice(0, 1)));

				  		app.ordersToday.push({ order : clientOrderJSON , clientName : res[0] , orderDate : res[1]});
			        }
			    	}
				} 
			}
		}

	},
	computed : {
		totalCost : function() {
			var count = 0;
			for ( var i = 0; i < this.checked.length; i++) {
				if (this.checked[i].qt < 1) {
					this.checked[i].qt = 1;
				}
				
				count += Number(this.checked[i].cost) * this.checked[i].qt;
			}
			return count < 300 ? count * this.numOfPortions : count * this.numOfPortions;
		},
		finalCost : function() {
			return this.totalCost < 300 ? this.totalCost + 50 : this.totalCost;
		},
		orderSuccess : function() {
			return this.respSuccess;
		},
		ordersTodayRender : function() {
			if (!this.ordersToday[0]) {
				return 'Сегодня заказов еще не было';
			}
			else {
				console.log(this.ordersToday);
				var orderNames = '';
				for (var i = 0; i < this.ordersToday.length; i++) {
					orderNames += app.ordersToday[i].order[1].name;
					if (app.ordersToday[0].order.length > 1) {
						orderNames += ', ';
					}
				return this.ordersToday[0].clientName + ' , дата: ' + this.ordersToday[0].orderDate + ' , заказ: ' + orderNames;
				}
				
			}
		}
	}
	
})

// ORDER MODAL WINDOW

var modal = document.getElementById('orderModal');
var btn = document.getElementById("orderBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

// ORDERS TODAY MODAL WINDOW

var modalOrdersToday = document.getElementById('ordersToday');
var btnOrdersToday = document.getElementById("ordersTodayBtn");
var spanOrdersToday = document.getElementsByClassName("closeOrdersToday")[0];
btnOrdersToday.onclick = function() {
    modalOrdersToday.style.display = "block";
}
spanOrdersToday.onclick = function() {
    modalOrdersToday.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalOrdersToday) {
        modalOrdersToday.style.display = "none";
    }
} 
