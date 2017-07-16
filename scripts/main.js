
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
						{name : 'Винегрет', weight : '70 гр.', cost : '40.00', qt : 1}
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
				soup : [{name : 'Рассольник', weight : '110 гр.', cost : '60.00', qt : 1}],
				hotMeal : [{name : 'Шашлык из баранины', weight : '80 гр.', cost : '78.00', qt : 1},
						{name : 'Треска в кляре', weight : '80 гр.', cost : '62.00', qt : 1}
						],
				garnish : [{name : 'Картофельное пюре', weight : '110 гр.', cost : '32.00', qt : 1},
						{name : 'Овощи гриль', weight : '110 гр.', cost : '56.00', qt : 1}
						],
				sideDish : [{name : 'С крабами', weight : '70 гр.', cost : '45.00', qt : 1},
						{name: 'Охотничий', weight : '70 гр.', cost : '41.00', qt : 1}
						]
			},
			thursday : {
				soup : [{name : 'Уха', weight : '110 гр.', cost : '58.00', qt : 1}],
				hotMeal : [{name : 'Рагу', weight : '80 гр.', cost : '68.00', qt : 1},
						{name : 'Судак запеченый', weight : '80 гр.', cost : '72.00', qt : 1}
						],
				garnish : [{name : 'Картофель гриль', weight : '110 гр.', cost : '32.00', qt : 1},
						{name : 'Тыквенная каша', weight : '110 гр.', cost : '56.00', qt : 1}
						],
				sideDish : [{name : 'Греческий', weight : '70 гр.', cost : '44.00', qt : 1},
						{name: 'Морской', weight : '70 гр.', cost : '41.00', qt : 1}
						]
			},
			friday : {
				soup : [{name : 'Харчо', weight : '110 гр.', cost : '63.00', qt : 1}],
				hotMeal : [{name : 'Сосиски баварские', weight : '80 гр.', cost : '64.00', qt : 1},
						{name : 'Семга жареная', weight : '80 гр.', cost : '92.00', qt : 1}
						],
				garnish : [{name : 'Горох', weight : '120 гр.', cost : '26.00', qt : 1},
						{name : 'Тушеная капуста', weight : '110 гр.', cost : '24.00', qt : 1}
						],
				sideDish : [{name : 'Корейская морковка', weight : '70 гр.', cost : '32.00', qt : 1},
						{name: 'Сырный рай', weight : '70 гр.', cost : '44.00', qt : 1}
						]
			}

		},
		checked : [],
		ordersToday : [],
		numOfPortions : 1,
		respSuccess : false,
		username : localStorage.getItem("username")
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
			this.day = element.id.split('-')[0];
			element.className += " week-day-set"
			// reject checkboxes
			this.checked = []
		},
		sendOrder: function() {
			//trigger the orderSucces computed param.(prevent multiple order from a user)
			app.respSuccess = true;
			// create and send request
			var sendJSON = JSON.stringify(this.checked);
			var date = new Date();
			// date format: YYYY-M-D
			date = String(date.getFullYear()) + '-' + String(date.getMonth()) + '-' + String(date.getDate());
			var clientName = document.getElementById('clientName').value;

			var xml = new XMLHttpRequest();
			xml.open('POST', 'http://127.0.0.1/food_delivery/order.php', true);
			xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			xml.send('json=' + sendJSON +'&name=' + clientName + '&orderDate=' + date);
			xml.onreadystatechange = function() {
				if (xml.status != 200) {
			  		alert ('извините, произошла ошибка при передачи данных');
				} 
				else {
					localStorage.setItem("username", clientName);
				} 
			}
		},
		getOrders : function() {
			// open modal window
			var modalOrdersToday = document.getElementById('ordersToday');
			var spanOrdersToday = document.getElementsByClassName("closeOrdersToday")[0];
    		modalOrdersToday.style.display = "block";
			spanOrdersToday.onclick = function() {
    			modalOrdersToday.style.display = "none";
			}
			window.onclick = function(event) {
    			if (event.target == modalOrdersToday) {
        			modalOrdersToday.style.display = "none";
    			}
			}

			// send request
			var date = new Date();
			// date format: YYYY-M-D
			date = String(date.getFullYear()) + '-' + String(date.getMonth()) + '-' + String(date.getDate());

			var getOrders = new XMLHttpRequest();
			getOrders.open('POST', 'http://127.0.0.1/food_delivery/orders_today.php', true);
			getOrders.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			getOrders.send('orderDate=' + date);
			getOrders.onreadystatechange = function() {
				if (getOrders.status != 200) {
			  		alert ('извините, произошла ошибка при передачи данных');
				}
				else {
					// if-if to prevent multiple onreadystatechange triggering
					if (this.readyState == this.DONE) {
			        	if (this.onreadystatechange) {
			            	var res = getOrders.responseText;
				  			res = JSON.parse(res);
				  			// parse res inner JSON
				  			for (var i = 0; i < res.length; i++) {
				  				res[i].client_order = JSON.parse(res[i].client_order);
				  			}
			        		app.ordersToday = res;
			        	}
			    	}
				}
			}
		},
		orderModal : function() {
			var modal = document.getElementById('orderModal');
			var span = document.getElementsByClassName("close")[0];
    		modal.style.display = "block";
			span.onclick = function() {
    			modal.style.display = "none";
			}
			window.onclick = function(event) {
    			if (event.target == modal) {
        			modal.style.display = "none";
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
		//calculate delivery cost
		finalCost : function() {
			return this.totalCost < 300 ? this.totalCost + 50 : this.totalCost;
		},
		//used to prevent multiple order from user
		orderSuccess : function() {
			return this.respSuccess;
		},
		ordersTodayRender : function() {
			if (!this.ordersToday[0]) {
				return 0;
			}
			else {
				//make temp array to use in 'v-for'
				var renderArr = [];
				for (var i = 0; i < this.ordersToday.length; i++) {
					var orderNames = '';
					orderNames += this.ordersToday[i].client_order[0].name;
					if (this.ordersToday[i].client_order.length > 1) {
						for ( var l = 1; l < this.ordersToday[i].client_order.length; l++) {
						orderNames += ', ' + this.ordersToday[i].client_order[l].name;
						}
					}
					
				renderArr.push(this.ordersToday[i].name + ' , дата: ' + this.ordersToday[i].order_date + ' , заказ: ' + orderNames);
				}
				return renderArr;
			}
		},
		usernameRender : function() {
			// work with localStorage
			return this.username ? ', ' + this.username : '';
		}
	},
	watch : {
		// prevent negative value set
		numOfPortions : function() {
			if (this.numOfPortions < 1) {
				this.numOfPortions = 1;
			}
		}
	}
})
