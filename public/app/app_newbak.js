/*! AdminLTE app.js
 * ================
 * Main JS application file for AdminLTE v2. This file
 * should be included in all pages. It controls some layout
 * options and implements exclusive AdminLTE plugins.
 *
 * @Author  Almsaeed Studio
 * @Support <http://www.almsaeedstudio.com>
 * @Email   <abdullah@almsaeedstudio.com>
 * @version 2.3.8
 * @license MIT <http://opensource.org/licenses/MIT>
 */

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
  throw new Error("AdminLTE requires jQuery");
}

var app = angular.module('ERP', [
	'ngAnimate',
	'ngCookies',
	'ui.bootstrap',
	'ui.router',
	'ngTouch',
	'toastr',
	//'smart-table',
	'ngTable',
	'ERP.pages',
	'ERP.service'
]);

app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

}]);

app.run(['$rootScope', function ($rootScope) {
	$rootScope.endPoint = "http://localhost:52984/"
	$rootScope.loggedUserId = "SF1001";
}]);





app.directive('sidebar', function () {
	return {
		restrict: 'C',
		compile: function (tElement, tAttrs, transclude) {
			//Enable sidebar tree view controls
			$.AdminLTE.tree(tElement);
		}
	};
});
app.directive('header', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/templates/header.html',
		compile: function (tElement, tAttrs, transclude) {
			$.AdminLTE.pushMenu($(tElement).find('.sidebar-toggle'));
		}
	};
});

app.directive('knob', function () {
	return {
		restrict: 'C',
		compile: function (tElement, tAttrs, transclude) {
			tElement.knob({
				/*change : function (value) {
				 //console.log("change : " + value);
				 },
				 release : function (value) {
				 console.log("release : " + value);
				 },
				 cancel : function () {
				 console.log("cancel : " + this.value);
				 },*/
				draw: function () {

					// "tron" case
					if (this.$.data('skin') == 'tron') {

						var a = this.angle(this.cv)  // Angle
								, sa = this.startAngle          // Previous start angle
								, sat = this.startAngle         // Start angle
								, ea                            // Previous end angle
								, eat = sat + a                 // End angle
								, r = true;

						this.g.lineWidth = this.lineWidth;

						this.o.cursor
								&& (sat = eat - 0.3)
								&& (eat = eat + 0.3);

						if (this.o.displayPrevious) {
							ea = this.startAngle + this.angle(this.value);
							this.o.cursor
									&& (sa = ea - 0.3)
									&& (ea = ea + 0.3);
							this.g.beginPath();
							this.g.strokeStyle = this.previousColor;
							this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
							this.g.stroke();
						}

						this.g.beginPath();
						this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
						this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
						this.g.stroke();

						this.g.lineWidth = 2;
						this.g.beginPath();
						this.g.strokeStyle = this.o.fgColor;
						this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
						this.g.stroke();

						return false;
					}
				}
			});
			/* END JQUERY KNOB */
		}
	}
});

app.directive('sparkline', function () {
	return {
		restrict: 'C',
		compile: function (tElement, tAttrs, transclude) {
			tElement.each(function () {
				var $this = $(this);
				$this.sparkline('html', $this.data());
			});
		}
	}
});

/*
Charts js
*/
app.controller('LineCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
	  [65, 59, 80, 81, 56, 55, 40],
	  [28, 48, 40, 19, 86, 27, 90]
	];
	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	$scope.onHover = function (points) {
		if (points.length > 0) {
			console.log('Point', points[0].value);
		} else {
			console.log('No point');
		}
	};

	$timeout(function () {
		$scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		$scope.data = [
		  [28, 48, 40, 19, 86, 27, 90],
		  [65, 59, 80, 81, 56, 55, 40]
		];
		$scope.series = ['Series C', 'Series D'];
	}, 3000);
}]);

app.controller('BarCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.options = { scaleShowVerticalLines: false };
	$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
	  [65, 59, 80, 81, 56, 55, 40],
	  [28, 48, 40, 19, 86, 27, 90]
	];
	$timeout(function () {
		$scope.options = { scaleShowVerticalLines: true };
	}, 3000);
}]);

app.controller('DoughnutCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	$scope.data = [0, 0, 0];

	$timeout(function () {
		$scope.data = [350, 450, 100];
	}, 500);
}]);

app.controller('PieCtrl', function ($scope) {
	$scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
	$scope.data = [300, 500, 100];
});

app.controller('PolarAreaCtrl', function ($scope) {
	$scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
	$scope.data = [300, 500, 100, 40, 120];
});

app.controller('BaseCtrl', function ($scope) {
	$scope.labels = ['Download Sales', 'Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
	$scope.data = [300, 500, 100, 40, 120];
	$scope.type = 'PolarArea';

	$scope.toggle = function () {
		$scope.type = $scope.type === 'PolarArea' ? 'Pie' : 'PolarArea';
	};
});

app.controller('RadarCtrl', function ($scope) {
	$scope.labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

	$scope.data = [
	  [65, 59, 90, 81, 56, 55, 40],
	  [28, 48, 40, 19, 96, 27, 100]
	];

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
});

app.controller('StackedBarCtrl', function ($scope) {
	$scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	$scope.type = 'StackedBar';

	$scope.data = [
	  [65, 59, 90, 81, 56, 55, 40],
	  [28, 48, 40, 19, 96, 27, 100]
	];
});

app.controller('DataTablesCtrl', function ($scope) {
	$scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	$scope.data = [
	  [65, 59, 80, 81, 56, 55, 40],
	  [28, 48, 40, 19, 86, 27, 90]
	];
	$scope.colours = [
	  { // grey
		  fillColor: 'rgba(148,159,177,0.2)',
		  strokeColor: 'rgba(148,159,177,1)',
		  pointColor: 'rgba(148,159,177,1)',
		  pointStrokeColor: '#fff',
		  pointHighlightFill: '#fff',
		  pointHighlightStroke: 'rgba(148,159,177,0.8)'
	  },
	  { // dark grey
		  fillColor: 'rgba(77,83,96,0.2)',
		  strokeColor: 'rgba(77,83,96,1)',
		  pointColor: 'rgba(77,83,96,1)',
		  pointStrokeColor: '#fff',
		  pointHighlightFill: '#fff',
		  pointHighlightStroke: 'rgba(77,83,96,1)'
	  }
	];
	$scope.randomize = function () {
		$scope.data = $scope.data.map(function (data) {
			return data.map(function (y) {
				y = y + Math.random() * 10 - 5;
				return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
			});
		});
	};
});

/*
Flot Charts
*/
app.controller('FlotInteractive', ['$scope', '$log', '$element', function ($scope, $log, $element) {
	$scope.$log = $log;
	$scope.data = [];
	$scope.myChartOptions = {
		grid: {
			borderColor: "#f3f3f3",
			borderWidth: 1,
			tickColor: "#f3f3f3"
		},
		series: {
			shadowSize: 0, // Drawing is faster without shadows
			color: "#3c8dbc"
		},
		lines: {
			fill: true, //Converts the line chart to area chart
			color: "#3c8dbc"
		},
		yaxis: {
			min: 0,
			max: 100,
			show: true
		},
		xaxis: {
			show: true
		}
	};
	$scope.totalPoints = 100;
	$scope.updateInterval = 500;
	$scope.realtime = 1;
	$scope.getRandomData = function () {

		if ($scope.data.length > 0)
			$scope.data = $scope.data.slice(1);

		// Do a random walk
		while ($scope.data.length < $scope.totalPoints) {

			var prev = $scope.data.length > 0 ? $scope.data[$scope.data.length - 1] : 50,
					y = prev + Math.random() * 10 - 5;

			if (y < 0) {
				y = 0;
			} else if (y > 100) {
				y = 100;
			}

			$scope.data.push(y);
		}

		// Zip the generated y values with the x values
		var res = [];
		for (var i = 0; i < $scope.data.length; ++i) {
			res.push([i, $scope.data[i]]);
		}

		return res;
	};
	$scope.update = function () {
		$scope.data = [$scope.getRandomData()];
		// Since the axes don't change, we don't need to call plot.setupGrid()


		if ($scope.realtime == 1)
			setTimeout($scope.update, $scope.updateInterval);
	};

}]);
app.controller('FlotLineChart', function ($scope) {
	var sin = [], cos = [];
	for (var i = 0; i < 14; i += 0.5) {
		sin.push([i, Math.sin(i)]);
		cos.push([i, Math.cos(i)]);
	}
	var line_data1 = {
		data: sin,
		color: "#3c8dbc"
	};
	var line_data2 = {
		data: cos,
		color: "#00c0ef"
	};

	$scope.myData = [line_data1, line_data2];
	$scope.myChartOptions = {
		grid: {
			hoverable: true,
			borderColor: "#f3f3f3",
			borderWidth: 1,
			tickColor: "#f3f3f3"
		},
		series: {
			shadowSize: 0,
			lines: {
				show: true
			},
			points: {
				show: true
			}
		},
		lines: {
			fill: false,
			color: ["#3c8dbc", "#f56954"]
		},
		yaxis: {
			show: true,
		},
		xaxis: {
			show: true
		}
	};
});
app.controller('FlotAreaChart', function ($scope) {
	var areaData = [[2, 88.0], [3, 93.3], [4, 102.0], [5, 108.5], [6, 115.7], [7, 115.6],
	[8, 124.6], [9, 130.3], [10, 134.3], [11, 141.4], [12, 146.5], [13, 151.7], [14, 159.9],
	[15, 165.4], [16, 167.8], [17, 168.7], [18, 169.5], [19, 168.0]];

	$scope.myData = [areaData];
	$scope.myChartOptions = {
		grid: {
			borderWidth: 0
		},
		series: {
			shadowSize: 0, // Drawing is faster without shadows
			color: "#00c0ef"
		},
		lines: {
			fill: true //Converts the line chart to area chart
		},
		yaxis: {
			show: false
		},
		xaxis: {
			show: false
		}
	};
});
app.controller('FlotBarChart', function ($scope) {
	$scope.myData = [{
		data: [["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9]],
		color: "#3c8dbc"
	}];
	$scope.myChartOptions = {
		grid: {
			borderWidth: 1,
			borderColor: "#f3f3f3",
			tickColor: "#f3f3f3"
		},
		series: {
			bars: {
				show: true,
				barWidth: 0.5,
				align: "center"
			}
		},
		xaxis: {
			mode: "categories",
			tickLength: 0
		}
	};
});
app.controller('FlotDonutChart', function ($scope) {
	$scope.myData = [
		  { label: "Series2", data: 30, color: "#3c8dbc" },
		  { label: "Series3", data: 20, color: "#0073b7" },
		  { label: "Series4", data: 50, color: "#00c0ef" }
	];
	$scope.myChartOptions = {
		series: {
			pie: {
				show: true,
				radius: 1,
				innerRadius: 0.5,
				label: {
					show: true,
					radius: 2 / 3,
					formatter: labelFormatter,
					threshold: 0.1
				}

			}
		},
		legend: {
			show: false
		}
	};
	function labelFormatter(label, series) {
		return "<div style='font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;'>"
				+ label
				+ "<br/>"
				+ Math.round(series.percent) + "%</div>";
	}
});

app.controller('ChatController', function ($scope, $http, $filter) {
	$http.get('/partials/widgets/dialog1.json')
	.success(function (data) {
		$scope.messages = data;
	});
});
/* BoxWidget
* =========
* BoxWidget is plugin to handle collapsing and
* removing boxes from the screen.
*
* @type Object
* @usage $.AdminLTE.boxWidget.activate()
*        Set all of your option in the main $.AdminLTE.options object
*/
app.directive('box', function () {
	return {
		restrict: 'C',
		compile: function (tElement, tAttr, transclude) {
			var _this = this;
			$(tElement).find(this.boxWidgetOptions.boxWidgetSelectors.collapse).click(function (e) {
				e.preventDefault();
				_this.collapse($(this));
			});
			$(tElement).find(this.boxWidgetOptions.boxWidgetSelectors.remove).click(function (e) {
				e.preventDefault();
				_this.remove($(this));
			});
		},
		collapse: function (element) {
			//Find the box parent
			var box = element.parents(".box").first();
			//Find the body and the footer
			var bf = box.find(".box-body, .box-footer");
			if (!box.hasClass("collapsed-box")) {
				//Convert minus into plus
				element.children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
				bf.slideUp(300, function () {
					box.addClass("collapsed-box");
				});
			} else {
				//Convert plus into minus
				element.children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
				bf.slideDown(300, function () {
					box.removeClass("collapsed-box");
				});
			}
		},
		remove: function (element) {
			//Find the box parent
			var box = element.parents(".box").first();
			box.slideUp();
		},
		boxWidgetOptions: {
			boxWidgetIcons: {
				//The icon that triggers the collapse event
				collapse: 'fa fa-minus',
				//The icon that trigger the opening event
				open: 'fa fa-plus',
				//The icon that triggers the removing event
				remove: 'fa fa-times'
			},
			boxWidgetSelectors: {
				//Remove button selector
				remove: '[data-widget="remove"]',
				//Collapse button selector
				collapse: '[data-widget="collapse"]'
			}
		}

	}
});

app.directive('chat', function () {
	return {
		restrict: 'E',
		//template: '<h1>Hello World</h1>',
		templateUrl: 'templates/direct-chat.html',
		scope: { type: '@', title: '@', count: '@count', messages: '=messages' },
		replace: true,
		compile: function (tElement, tAttr) {
			tElement.find("[data-widget='chat-pane-toggle']").click(function () {
				$(this).parents('.direct-chat').first().toggleClass('direct-chat-contacts-open');
			});
			return {
				pre: function preLink(scope, iElement, iAttrs) { },
				post: function postLink(scope, iElement, iAttrs) {

				}
			}
		},
	};
});



/* AdminLTE
 *
 * @type Object
 * @description $.AdminLTE is the main object for the template's app.
 *              It's used for implementing functions and options related
 *              to the template. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.AdminLTE = {};

/* --------------------
 * - AdminLTE Options -
 * --------------------
 * Modify these options to suit your implementation
 */
$.AdminLTE.options = {
  //Add slimscroll to navbar menus
  //This requires you to load the slimscroll plugin
  //in every page before app.js
  navbarMenuSlimscroll: true,
  navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
  navbarMenuHeight: "200px", //The height of the inner menu
  //General animation speed for JS animated elements such as box collapse/expand and
  //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
  //'fast', 'normal', or 'slow'
  animationSpeed: 500,
  //Sidebar push menu toggle button selector
  sidebarToggleSelector: "[data-toggle='offcanvas']",
  //Activate sidebar push menu
  sidebarPushMenu: true,
  //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
  sidebarSlimScroll: true,
  //Enable sidebar expand on hover effect for sidebar mini
  //This option is forced to true if both the fixed layout and sidebar mini
  //are used together
  sidebarExpandOnHover: false,
  //BoxRefresh Plugin
  enableBoxRefresh: true,
  //Bootstrap.js tooltip
  enableBSToppltip: true,
  BSTooltipSelector: "[data-toggle='tooltip']",
  //Enable Fast Click. Fastclick.js creates a more
  //native touch experience with touch devices. If you
  //choose to enable the plugin, make sure you load the script
  //before AdminLTE's app.js
  enableFastclick: false,
  //Control Sidebar Tree views
  enableControlTreeView: true,
  //Control Sidebar Options
  enableControlSidebar: true,
  controlSidebarOptions: {
	//Which button should trigger the open/close event
	toggleBtnSelector: "[data-toggle='control-sidebar']",
	//The sidebar selector
	selector: ".control-sidebar",
	//Enable slide over content
	slide: true
  },
  //Box Widget Plugin. Enable this plugin
  //to allow boxes to be collapsed and/or removed
  enableBoxWidget: true,
  //Box Widget plugin options
  boxWidgetOptions: {
	boxWidgetIcons: {
	  //Collapse icon
	  collapse: 'fa-minus',
	  //Open icon
	  open: 'fa-plus',
	  //Remove icon
	  remove: 'fa-times'
	},
	boxWidgetSelectors: {
	  //Remove button selector
	  remove: '[data-widget="remove"]',
	  //Collapse button selector
	  collapse: '[data-widget="collapse"]'
	}
  },
  //Direct Chat plugin options
  directChat: {
	//Enable direct chat by default
	enable: true,
	//The button to open and close the chat contacts pane
	contactToggleSelector: '[data-widget="chat-pane-toggle"]'
  },
  //Define the set of colors to use globally around the website
  colors: {
	lightBlue: "#3c8dbc",
	red: "#f56954",
	green: "#00a65a",
	aqua: "#00c0ef",
	yellow: "#f39c12",
	blue: "#0073b7",
	navy: "#001F3F",
	teal: "#39CCCC",
	olive: "#3D9970",
	lime: "#01FF70",
	orange: "#FF851B",
	fuchsia: "#F012BE",
	purple: "#8E24AA",
	maroon: "#D81B60",
	black: "#222222",
	gray: "#d2d6de"
  },
  //The standard screen sizes that bootstrap uses.
  //If you change these in the variables.less file, change
  //them here too.
  screenSizes: {
	xs: 480,
	sm: 768,
	md: 992,
	lg: 1200
  }
};

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {
  "use strict";

  //Fix for IE page transitions
  $("body").removeClass("hold-transition");

  //Extend options if external options exist
  if (typeof AdminLTEOptions !== "undefined") {
	$.extend(true,
	  $.AdminLTE.options,
	  AdminLTEOptions);
  }

  //Easy access to options
  var o = $.AdminLTE.options;

  //Set up the object
  _init();

  //Activate the layout maker
  $.AdminLTE.layout.activate();

  //Enable sidebar tree view controls
  if (o.enableControlTreeView) {
	$.AdminLTE.tree('.sidebar');
  }

  //Enable control sidebar
  if (o.enableControlSidebar) {
	$.AdminLTE.controlSidebar.activate();
  }

  //Add slimscroll to navbar dropdown
  if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
	$(".navbar .menu").slimscroll({
	  height: o.navbarMenuHeight,
	  alwaysVisible: false,
	  size: o.navbarMenuSlimscrollWidth
	}).css("width", "100%");
  }

  //Activate sidebar push menu
  if (o.sidebarPushMenu) {
	$.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
  }

  //Activate Bootstrap tooltip
  if (o.enableBSToppltip) {
	$('body').tooltip({
	  selector: o.BSTooltipSelector,
	  container: 'body'
	});
  }

  //Activate box widget
  if (o.enableBoxWidget) {
	$.AdminLTE.boxWidget.activate();
  }

  //Activate fast click
  if (o.enableFastclick && typeof FastClick != 'undefined') {
	FastClick.attach(document.body);
  }

  //Activate direct chat widget
  if (o.directChat.enable) {
	$(document).on('click', o.directChat.contactToggleSelector, function () {
	  var box = $(this).parents('.direct-chat').first();
	  box.toggleClass('direct-chat-contacts-open');
	});
  }

  /*
   * INITIALIZE BUTTON TOGGLE
   * ------------------------
   */
  $('.btn-group[data-toggle="btn-toggle"]').each(function () {
	var group = $(this);
	$(this).find(".btn").on('click', function (e) {
	  group.find(".btn.active").removeClass("active");
	  $(this).addClass("active");
	  e.preventDefault();
	});

  });
});

/* ----------------------------------
 * - Initialize the AdminLTE Object -
 * ----------------------------------
 * All AdminLTE functions are implemented below.
 */
function _init() {
  'use strict';
  /* Layout
   * ======
   * Fixes the layout height in case min-height fails.
   *
   * @type Object
   * @usage $.AdminLTE.layout.activate()
   *        $.AdminLTE.layout.fix()
   *        $.AdminLTE.layout.fixSidebar()
   */
  $.AdminLTE.layout = {
	activate: function () {
	  var _this = this;
	  _this.fix();
	  _this.fixSidebar();
	  $('body, html, .wrapper').css('height', 'auto');
	  $(window, ".wrapper").resize(function () {
		_this.fix();
		_this.fixSidebar();
	  });
	},
	fix: function () {
	  // Remove overflow from .wrapper if layout-boxed exists
	  $(".layout-boxed > .wrapper").css('overflow', 'hidden');
	  //Get window height and the wrapper height
	  var footer_height = $('.main-footer').outerHeight() || 0;
	  var neg = $('.main-header').outerHeight() + footer_height;
	  var window_height = $(window).height();
	  var sidebar_height = $(".sidebar").height() || 0;
	  //Set the min-height of the content and sidebar based on the
	  //the height of the document.
	  if ($("body").hasClass("fixed")) {
		$(".content-wrapper, .right-side").css('min-height', window_height - footer_height);
	  } else {
		var postSetWidth;
		if (window_height >= sidebar_height) {
		  $(".content-wrapper, .right-side").css('min-height', window_height - neg);
		  postSetWidth = window_height - neg;
		} else {
		  $(".content-wrapper, .right-side").css('min-height', sidebar_height);
		  postSetWidth = sidebar_height;
		}

		//Fix for the control sidebar height
		var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
		if (typeof controlSidebar !== "undefined") {
		  if (controlSidebar.height() > postSetWidth)
			$(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
		}

	  }
	},
	fixSidebar: function () {
	  //Make sure the body tag has the .fixed class
	  if (!$("body").hasClass("fixed")) {
		if (typeof $.fn.slimScroll != 'undefined') {
		  $(".sidebar").slimScroll({destroy: true}).height("auto");
		}
		return;
	  } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
		window.console.error("Error: the fixed layout requires the slimscroll plugin!");
	  }
	  //Enable slimscroll for fixed layout
	  if ($.AdminLTE.options.sidebarSlimScroll) {
		if (typeof $.fn.slimScroll != 'undefined') {
		  //Destroy if it exists
		  $(".sidebar").slimScroll({destroy: true}).height("auto");
		  //Add slimscroll
		  $(".sidebar").slimScroll({
			height: ($(window).height() - $(".main-header").height()) + "px",
			color: "rgba(0,0,0,0.2)",
			size: "3px"
		  });
		}
	  }
	}
  };

  /* PushMenu()
   * ==========
   * Adds the push menu functionality to the sidebar.
   *
   * @type Function
   * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
   */
  $.AdminLTE.pushMenu = {
	activate: function (toggleBtn) {
	  //Get the screen sizes
	  var screenSizes = $.AdminLTE.options.screenSizes;

	  //Enable sidebar toggle
	  $(document).on('click', toggleBtn, function (e) {
		e.preventDefault();

		//Enable sidebar push menu
		if ($(window).width() > (screenSizes.sm - 1)) {
		  if ($("body").hasClass('sidebar-collapse')) {
			$("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
		  } else {
			$("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
		  }
		}
		//Handle sidebar push menu for small screens
		else {
		  if ($("body").hasClass('sidebar-open')) {
			$("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
		  } else {
			$("body").addClass('sidebar-open').trigger('expanded.pushMenu');
		  }
		}
	  });

	  $(".content-wrapper").click(function () {
		//Enable hide menu when clicking on the content-wrapper on small screens
		if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
		  $("body").removeClass('sidebar-open');
		}
	  });

	  //Enable expand on hover for sidebar mini
	  if ($.AdminLTE.options.sidebarExpandOnHover
		|| ($('body').hasClass('fixed')
		&& $('body').hasClass('sidebar-mini'))) {
		this.expandOnHover();
	  }
	},
	expandOnHover: function () {
	  var _this = this;
	  var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
	  //Expand sidebar on hover
	  $('.main-sidebar').hover(function () {
		if ($('body').hasClass('sidebar-mini')
		  && $("body").hasClass('sidebar-collapse')
		  && $(window).width() > screenWidth) {
		  _this.expand();
		}
	  }, function () {
		if ($('body').hasClass('sidebar-mini')
		  && $('body').hasClass('sidebar-expanded-on-hover')
		  && $(window).width() > screenWidth) {
		  _this.collapse();
		}
	  });
	},
	expand: function () {
	  $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
	},
	collapse: function () {
	  if ($('body').hasClass('sidebar-expanded-on-hover')) {
		$('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
	  }
	}
  };

  /* Tree()
   * ======
   * Converts the sidebar into a multilevel
   * tree view menu.
   *
   * @type Function
   * @Usage: $.AdminLTE.tree('.sidebar')
   */
  $.AdminLTE.tree = function (menu) {
	var _this = this;
	var animationSpeed = $.AdminLTE.options.animationSpeed;
	$(document).off('click', menu + ' li a')
	  .on('click', menu + ' li a', function (e) {
		//Get the clicked link and the next element
		var $this = $(this);
		var checkElement = $this.next();

		//Check if the next element is a menu and is visible
		if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
		  //Close the menu
		  checkElement.slideUp(animationSpeed, function () {
			checkElement.removeClass('menu-open');
			//Fix the layout in case the sidebar stretches over the height of the window
			//_this.layout.fix();
		  });
		  checkElement.parent("li").removeClass("active");
		}
		//If the menu is not visible
		else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
		  //Get the parent menu
		  var parent = $this.parents('ul').first();
		  //Close all open menus within the parent
		  var ul = parent.find('ul:visible').slideUp(animationSpeed);
		  //Remove the menu-open class from the parent
		  ul.removeClass('menu-open');
		  //Get the parent li
		  var parent_li = $this.parent("li");

		  //Open the target menu and add the menu-open class
		  checkElement.slideDown(animationSpeed, function () {
			//Add the class active to the parent li
			checkElement.addClass('menu-open');
			parent.find('li.active').removeClass('active');
			parent_li.addClass('active');
			//Fix the layout in case the sidebar stretches over the height of the window
			_this.layout.fix();
		  });
		}
		//if this isn't a link, prevent the page from being redirected
		if (checkElement.is('.treeview-menu')) {
		  e.preventDefault();
		}
	  });
  };

  /* ControlSidebar
   * ==============
   * Adds functionality to the right sidebar
   *
   * @type Object
   * @usage $.AdminLTE.controlSidebar.activate(options)
   */
  $.AdminLTE.controlSidebar = {
	//instantiate the object
	activate: function () {
	  //Get the object
	  var _this = this;
	  //Update options
	  var o = $.AdminLTE.options.controlSidebarOptions;
	  //Get the sidebar
	  var sidebar = $(o.selector);
	  //The toggle button
	  var btn = $(o.toggleBtnSelector);

	  //Listen to the click event
	  btn.on('click', function (e) {
		e.preventDefault();
		//If the sidebar is not open
		if (!sidebar.hasClass('control-sidebar-open')
		  && !$('body').hasClass('control-sidebar-open')) {
		  //Open the sidebar
		  _this.open(sidebar, o.slide);
		} else {
		  _this.close(sidebar, o.slide);
		}
	  });

	  //If the body has a boxed layout, fix the sidebar bg position
	  var bg = $(".control-sidebar-bg");
	  _this._fix(bg);

	  //If the body has a fixed layout, make the control sidebar fixed
	  if ($('body').hasClass('fixed')) {
		_this._fixForFixed(sidebar);
	  } else {
		//If the content height is less than the sidebar's height, force max height
		if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
		  _this._fixForContent(sidebar);
		}
	  }
	},
	//Open the control sidebar
	open: function (sidebar, slide) {
	  //Slide over content
	  if (slide) {
		sidebar.addClass('control-sidebar-open');
	  } else {
		//Push the content by adding the open class to the body instead
		//of the sidebar itself
		$('body').addClass('control-sidebar-open');
	  }
	},
	//Close the control sidebar
	close: function (sidebar, slide) {
	  if (slide) {
		sidebar.removeClass('control-sidebar-open');
	  } else {
		$('body').removeClass('control-sidebar-open');
	  }
	},
	_fix: function (sidebar) {
	  var _this = this;
	  if ($("body").hasClass('layout-boxed')) {
		sidebar.css('position', 'absolute');
		sidebar.height($(".wrapper").height());
		if (_this.hasBindedResize) {
		  return;
		}
		$(window).resize(function () {
		  _this._fix(sidebar);
		});
		_this.hasBindedResize = true;
	  } else {
		sidebar.css({
		  'position': 'fixed',
		  'height': 'auto'
		});
	  }
	},
	_fixForFixed: function (sidebar) {
	  sidebar.css({
		'position': 'fixed',
		'max-height': '100%',
		'overflow': 'auto',
		'padding-bottom': '50px'
	  });
	},
	_fixForContent: function (sidebar) {
	  $(".content-wrapper, .right-side").css('min-height', sidebar.height());
	}
  };

  /* BoxWidget
   * =========
   * BoxWidget is a plugin to handle collapsing and
   * removing boxes from the screen.
   *
   * @type Object
   * @usage $.AdminLTE.boxWidget.activate()
   *        Set all your options in the main $.AdminLTE.options object
   */
  $.AdminLTE.boxWidget = {
	selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
	icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
	animationSpeed: $.AdminLTE.options.animationSpeed,
	activate: function (_box) {
	  var _this = this;
	  if (!_box) {
		_box = document; // activate all boxes per default
	  }
	  //Listen for collapse event triggers
	  $(_box).on('click', _this.selectors.collapse, function (e) {
		e.preventDefault();
		_this.collapse($(this));
	  });

	  //Listen for remove event triggers
	  $(_box).on('click', _this.selectors.remove, function (e) {
		e.preventDefault();
		_this.remove($(this));
	  });
	},
	collapse: function (element) {
	  var _this = this;
	  //Find the box parent
	  var box = element.parents(".box").first();
	  //Find the body and the footer
	  var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
	  if (!box.hasClass("collapsed-box")) {
		//Convert minus into plus
		element.children(":first")
		  .removeClass(_this.icons.collapse)
		  .addClass(_this.icons.open);
		//Hide the content
		box_content.slideUp(_this.animationSpeed, function () {
		  box.addClass("collapsed-box");
		});
	  } else {
		//Convert plus into minus
		element.children(":first")
		  .removeClass(_this.icons.open)
		  .addClass(_this.icons.collapse);
		//Show the content
		box_content.slideDown(_this.animationSpeed, function () {
		  box.removeClass("collapsed-box");
		});
	  }
	},
	remove: function (element) {
	  //Find the box parent
	  var box = element.parents(".box").first();
	  box.slideUp(this.animationSpeed);
	}
  };
}

/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */

/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the component BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * @type plugin
 * @usage $("#box-widget").boxRefresh( options );
 */
(function ($) {

  "use strict";

  $.fn.boxRefresh = function (options) {

	// Render options
	var settings = $.extend({
	  //Refresh button selector
	  trigger: ".refresh-btn",
	  //File source to be loaded (e.g: ajax/src.php)
	  source: "",
	  //Callbacks
	  onLoadStart: function (box) {
		return box;
	  }, //Right after the button has been clicked
	  onLoadDone: function (box) {
		return box;
	  } //When the source has been loaded

	}, options);

	//The overlay
	var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

	return this.each(function () {
	  //if a source is specified
	  if (settings.source === "") {
		if (window.console) {
		  window.console.log("Please specify a source first - boxRefresh()");
		}
		return;
	  }
	  //the box
	  var box = $(this);
	  //the button
	  var rBtn = box.find(settings.trigger).first();

	  //On trigger click
	  rBtn.on('click', function (e) {
		e.preventDefault();
		//Add loading overlay
		start(box);

		//Perform ajax call
		box.find(".box-body").load(settings.source, function () {
		  done(box);
		});
	  });
	});

	function start(box) {
	  //Add overlay and loading img
	  box.append(overlay);

	  settings.onLoadStart.call(box);
	}

	function done(box) {
	  //Remove overlay and loading img
	  box.find(overlay).remove();

	  settings.onLoadDone.call(box);
	}

  };

})(jQuery);

/*
 * EXPLICIT BOX CONTROLS
 * -----------------------
 * This is a custom plugin to use with the component BOX. It allows you to activate
 * a box inserted in the DOM after the app.js was loaded, toggle and remove box.
 *
 * @type plugin
 * @usage $("#box-widget").activateBox();
 * @usage $("#box-widget").toggleBox();
 * @usage $("#box-widget").removeBox();
 */
(function ($) {

  'use strict';

  $.fn.activateBox = function () {
	$.AdminLTE.boxWidget.activate(this);
  };

  $.fn.toggleBox = function () {
	var button = $($.AdminLTE.boxWidget.selectors.collapse, this);
	$.AdminLTE.boxWidget.collapse(button);
  };

  $.fn.removeBox = function () {
	var button = $($.AdminLTE.boxWidget.selectors.remove, this);
	$.AdminLTE.boxWidget.remove(button);
  };

})(jQuery);

/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 *
 * @type plugin
 * @usage $("#todo-widget").todolist( options );
 */
(function ($) {

  'use strict';

  $.fn.todolist = function (options) {
	// Render options
	var settings = $.extend({
	  //When the user checks the input
	  onCheck: function (ele) {
		return ele;
	  },
	  //When the user unchecks the input
	  onUncheck: function (ele) {
		return ele;
	  }
	}, options);

	return this.each(function () {

	  if (typeof $.fn.iCheck != 'undefined') {
		$('input', this).on('ifChecked', function () {
		  var ele = $(this).parents("li").first();
		  ele.toggleClass("done");
		  settings.onCheck.call(ele);
		});

		$('input', this).on('ifUnchecked', function () {
		  var ele = $(this).parents("li").first();
		  ele.toggleClass("done");
		  settings.onUncheck.call(ele);
		});
	  } else {
		$('input', this).on('change', function () {
		  var ele = $(this).parents("li").first();
		  ele.toggleClass("done");
		  if ($('input', ele).is(":checked")) {
			settings.onCheck.call(ele);
		  } else {
			settings.onUncheck.call(ele);
		  }
		});
	  }
	});
  };
}(jQuery));
