$(document).ready(function(){

	initHeader();
	initMenuTab();
	
	$('.open-popup').on('click', function(){
		$(this).next('.popup-wrap').fadeIn();
	});

	$('.popup-close').on('click', function(){
		$(this).parents('.popup-wrap').fadeOut();
	})

	$('.guide, .guide-wrap').on('mouseover', function(){
		$('.guide-wrap').stop().fadeIn();
	});

	$('.guide, .guide-wrap').on('mouseleave', function(){
		$('.guide-wrap').stop().fadeOut();
	});

	// 날짜 선택
	// 일 다력
	$('#input02').datepicker();
	// 월 달력
	$('#input03').datepicker({
		startView : 'months'
		,minViewMode: "months"
		,format : 'yyyy-mm'
	}).on('changeDate', function(e){
		
	});

	// grid setting
	viewGrid1('#gridArea1');
	viewGrid1('#gridArea2');
});

function parentsToggle(e){
	$(e).parent().toggleClass('active');
}

function activeToggle(e){
	$(e).toggleClass('active');
}

function menubtnToggle(e){
	$('#headerContainer').toggleClass('nav-close')
}


function initHeader(){
	// header 처리. 
	VaiAPP.vueServiceBean({
		el: '#header'
		,data: {
			list_count :10
			,searchVal : ''
			,searchType: ''
			,mainMenus : []
			,shwoDropDownMenu :false
		}
		,methods:{
			init : function (){
				
			}
			// ,menuToggle : function (){
			// 	VaiCTRL.menu.toggle($('#headerContainer').hasClass('nav-close'));
			// }
			,userDropDown : function (){
				this.shwoDropDownMenu = !this.shwoDropDownMenu;
			}
		}
	});
	
	if($('#bizMenu').length < 1) return ; 

	// 메뉴 처리.
	VaiAPP.vueServiceBean({
		el: '#bizMenu'
		,data: {
			list_count :10
			,searchVal : ''
			,searchType: ''
			,shwoDropDownMenu :false
			,favoriteEditable : false // 편집 모드
			,menuViewMode : 'menu'
			,oneDepthMenus : []
			,treeMaxLevel :3
			,jstreeObj : {}
			,allMenuItem : {}
		}
		,methods:{
			init : function (){
				this.initGnbMenu();
				this.initFavorite()
			}
			,userDropDown : function (){
				this.shwoDropDownMenu = !this.shwoDropDownMenu;
			}
			,subMenuView : function (item){
				console.log(item);
				item.isActive = !item.isActive;
			}
			,menuview : function (item){
				VaiCTRL.menu.open(item);
			}
			,menuChoice : function (mode){
				this.menuViewMode = mode;
			}
			,initGnbMenu : function (){
				var allMenuItem =  {"rootNode" :{
					menuId :'rootNode'
					,menuName:'rootNode'
					,id : 'rootNode'
					,children :[]
					,state	:{
						opened :true
					}
				}};
				var menus = [
					{menuId : '1', parentMenuId : '', menuName : 'TO-DO', menuType:'label', menuUrl : ''}
					,{menuId : '1-1', parentMenuId : '1' , menuName : '계약현황', menuType:'page', menuUrl : 'contents_client_info.html'}
					,{menuId : '1-2', parentMenuId : '1' , menuName : '월별 선적 현황', menuType:'page', menuUrl : 'contents_dispatch_info.html'}
					,{menuId : '1-3', parentMenuId : '1' , menuName : '차선 현황', menuType:'page', menuUrl : 'contents.html'}
					,{menuId : '1-4', parentMenuId : '1' , menuName : '정선 현황', menuType:'page', menuUrl : 'contents_carrier_management.html'}
	
					,{menuId : '2', parentMenuId : '' , menuName : '계약관리', menuType:'label', menuUrl : ''}
					,{menuId : '2-1', parentMenuId : '2' , menuName : '계약현황', menuType:'page', menuUrl : ''}
					,{menuId : '2-2', parentMenuId : '2' , menuName : '월별 선적 현황', menuType:'page', menuUrl : ''}
					
					,{menuId : '3', parentMenuId : '' , menuName : '선적/입고 관리', menuType:'label', menuUrl : ''}
					,{menuId : '3-1', parentMenuId : '3' , menuName : '계약현황', menuType:'page', menuUrl : ''}
					,{menuId : '3-2', parentMenuId : '3' , menuName : '월별 선적 현황', menuType:'page', menuUrl : ''}
	
					,{menuId : '4', parentMenuId : '' , menuName : '지급관리', menuType:'label', menuUrl : ''}
					,{menuId : '4-1', parentMenuId : '4' , menuName : '계약현황', menuType:'page', menuUrl : ''}
					,{menuId : '4-2', parentMenuId : '4' , menuName : '월별 선적 현황', menuType:'page', menuUrl : ''}
	
					,{menuId : '5', parentMenuId : '' , menuName : 'Claim', menuType:'label', menuUrl : ''}
					,{menuId : '5-1', parentMenuId : '5' , menuName : '계약현황', menuType:'page', menuUrl : ''}
					,{menuId : '5-2', parentMenuId : '5' , menuName : '월별 선적 현황', menuType:'page', menuUrl : ''}
				]; 
				var len = menus.length;

				var item;
				var pItem;
				var oneDepthMenus = [];

				for(var i=0; i<len; i++){
					item = menus[i];
					var menuId = item.menuId;
					var menuPid = item.parentMenuId;
					item.isActive = false; 
					item.id = menuId;
					item.text = item.menuName;
					item.children = $.isArray(item.children) ? item.children :[];

					if(item.parentMenuId==''){
						item.pid = 'rootNode';
						pItem = allMenuItem['rootNode'];
						oneDepthMenus.push(item);
					}else{
						item.pid = menuPid;
						pItem = allMenuItem[menuPid];
					}

					allMenuItem[menuId] = item; 

					if(pItem.children){
						pItem.children.push(item);
					}
				}
				this.oneDepthMenus = oneDepthMenus; 
				this.allMenuItem = allMenuItem; 
			}
			,initFavorite : function(){
				var _this =this; 
								
				_this.jstreeObj = $('#menuFavoriteTree').jstree({
					"plugins" : [ "contextmenu", "dnd", "types"]
					,"core" :{
						data : this.allMenuItem.rootNode.children
						,dblclick_toggle :false
						,check_callback : function (op, node, node_parent, pos, more){
							if(op=='move_node'){
								if(VaiCTRL.menu.isBookmarkFile(node_parent.id)){
									return false; 
								}else if(node_parent.parents.length+1 >= _this.treeMaxLevel && !PencakeCustomCTRL.menu.isBookmarkFile(node.id)){
									return false; 
								}
							}
						}
					}
					,"types" : {
						"#" :{
							"max_depth" : _this.treeMaxLevel
						}
					}
					
					,"dnd" :{
						inside : 'last'
					}
					,"contextmenu" :{
						items : function (node){
							var dflt = $.jstree.defaults.contextmenu.items();
							
							delete dflt['ccp'];

							console.log(node, dflt);
							
							dflt.rename.label = '이름변경';
							dflt.remove.label = '삭제';
							dflt.create.label = '폴더추가';
							
							if(VaiCTRL.menu.isMenuId(node.id)){
								return {
									'rename' : dflt.rename
									,'remove' : dflt.remove
								}; 
							}
							
							dflt.create.action = function (obj){
								if(node.parents.length+1 >= _this.treeMaxLevel){
									PubEPUI.toast.view({text:'폴더는 '+(_this.treeMaxLevel-1)+'레벨까지 추가 가능합니다.'});
									return ;	
								}
								_this.createFolder(node.id);
							}
							
							return dflt; 
						}
					}
				}).on("dblclick.jstree" , function (evt , data){
					var ref = _this.jstreeObj.jstree(true); 
					var sel = ref.get_selected(); 
					
					if(sel.length < 1)return false; 
					
					ref.edit(sel[0]);
					
					return false;
					
				});
				
				_this.jstreeObj.jstree('open_node','rootNode');
				
			}
			,allToggle: function (mode){
				if(mode=='open'){
					this.jstreeObj.jstree('open_all');
				}else{
					this.jstreeObj.jstree('close_all');
				}
			}
			,createFolder : function (pid, nodeName){
			
				var addNode = this.jstreeObj.jstree().create_node(pid,{
					id:'n_'+new Date().getTime() , text: (nodeName||this.newFolderName)
				} ,'last');
				this.jstreeObj.jstree().deselect_all();
				this.jstreeObj.jstree().select_node(addNode);
				
			}
			,setFavoriteEditable :function (){
				this.favoriteEditable = !this.favoriteEditable;
			}
			// 즐겨찾기 편집/취소/저장
			,bookmarkModeChange :function (mode){
				if(mode=='edit'){
					
					this.favoriteEditable = true;
					return ;
				}
				
				if(mode=='cancel'){
					this.favoriteEditable = false;
					return ;
				}
				
				if(mode=='save'){
					this.favoriteEditable = false;
				
				}
			}
		}
	});
}

// 메뉴탭
function initMenuTab(){

	if($('#menuTab').length < 1) return ; 

	var aaa = [
		{title: '고객마스터' , id:'1'}
		,{title: '계약현황' , id:'2'}
		,{title: '월별선적현황' , id:'3'}
		,{title: '차선현황' , id:'4'}
		,{title: '고객서비스현황' , id:'5'}
		,{title: '고객서비스현황' , id:'6'}
		,{title: '고객서비스현황' , id:'7'}
		,{title: '고객서비스현황' , id:'8'}
		,{title: '고객서비스현황' , id:'9'}
		,{title: '고객서비스현황' , id:'10'}
	];

	var pubTabObj = $.pubTab('#menuTab',{
		items :aaa
		,width : 'auto'
		,tabHeight : 32
		,itemMaxWidth : 100
		,dropItemWidth : 100
		,contentViewSelector : '#mainContentContainer'
		,contentStyleClass : 'main-content-item frame'
		,titleIcon :{
			left : {
				onlyActiveView : true
				,visible : function (item){
					return item.menuId =='mainScreen' ? false : true; 
				}
				,html : '<i class="fa fa-refresh"></i>'
				,click : function (item, idx){
					pubTabObj.reloadContent(item);
				}
			}
			,right : {
				html : '<button type="button" class="tab-close"></button>'
				,visible : function (item){
					return item.menuId =='mainScreen' ? false : true; 
				}
				,click : function (item, idx){
					pubTabObj.removeItem(idx);
				}
			}
		}
		,overItemViewMode :'drop'
		,contentHtml : function (item, callback){
			callback('');
		}
		,itemKey :{							// item key mapping
			title :'title'
			,id: 'id'
		}
		,drag: {
			enabled :true
			,dragDrop : function (tabItem){
				console.log(tabItem);
			}
		}
	})

	var timerId  = null;
	window.onresize = function() {
		clearTimeout(timerId );
		timerId  = setTimeout(function() {
			pubTabObj.refresh();
		}, 500);
	};
}

// 그리드 
var G_ALL_GRID = {};
function viewGrid1(gridId){
	
	if(typeof AUIGrid ==='undefined') return ; 

	if($(gridId).length < 1) return ; 
	
	// 실제로 #grid_wrap 에 그리드 생성
	var myGridID = AUIGrid.create(gridId, [ {
			dataField : "name",
			headerText : "Name(수정불가 설정)",
			width : 160,
			style : "my-color",
			headerStyle : "my-color",
			editable : false // ID 편집 불가능 설정
		}, {
			dataField : "country",
			headerText : "Country"
		}, {
			dataField : "product",
			headerText : "Product"
		}, {
			dataField : "quantity",
			headerText : "Quantity",
			dataType : "numeric",
			editRenderer : {
				type : "InputEditRenderer",
				onlyNumeric : true, // 0~9만 입력가능
			},
			style : "my-right"
		}, {
			dataField : "price",
			headerText : "Price",
			dataType : "numeric",
			style : "my-right",
			editRenderer : {
				type : "InputEditRenderer",
				onlyNumeric : true, // 0~9만 입력가능
				autoThousandSeparator : true // 천단위 구분자 삽입 여부 (onlyNumeric=true 인 경우 유효)
			}
		}, {
			dataField : "date",
			headerText : "Date"
		}
	], {
			
			editable : true,
			
			selectionMode : "multipleCells",
			
			// 행 고유 id 에 속하는 필드명 (필드의 값은 중복되지 않은 고유값이여야 함)
			rowIdField : "id",
			
			// 상태 칼럼 사용
			showStateColumn : true,
			
			//softRemoveRowMode 적용을 원래 데이터에만 적용 즉, 새 행인 경우 적용 안시킴
			softRemovePolicy :"exceptNew",
			
			// 칼럼 끝에서 오른쪽 이동 시 다음 행, 처음 칼럼으로 이동할지 여부
			wrapSelectionMove : true,
			
			// 읽기 전용 셀에 대해 키보드 선택이 건너 뛸지 여부 (기본값 : false)
			skipReadonlyColumns : true,
			
			// 엔터키가 다음 행이 아닌 다음 칼럼으로 이동할지 여부 (기본값 : false)
			enterKeyColumnBase : true,
			
			// selectionChange 이벤트 발생 시 간소화된 정보만 받을지 여부
			// 이 속성은 선택한 셀이 많을 때 false 설정하면 퍼포먼스에 영향을 미칩니다.
			// selectionChange 이벤트 바인딩 한 경우 true 설정을 권합니다.
			simplifySelectionEvent : true
	});
	var data  = [{"id":"#Cust0","date":"2014-10-08","name":"Anna","country":"Japan","flag":"japan.png","product":"LG G3","color":"Green","quantity":3,"price":500000},{"id":"#Cust1","date":"2014-10-07","name":"Emma","country":"Korea","flag":"korea.png","product":"Galaxy Note3","color":"Orange","quantity":1,"price":52700},{"id":"#Cust2","date":"2014-10-06","name":"Steve","country":"China","flag":"china.png","product":"Galaxy Note3","color":"Violet","quantity":10,"price":287100},{"id":"#Cust3","date":"2014-10-05","name":"Kim","country":"Ireland","flag":"ireland.png","product":"Galaxy Note3","color":"Gray","quantity":12,"price":368700},{"id":"#Cust4","date":"2014-10-04","name":"Lowrence","country":"Ireland","flag":"ireland.png","product":"IPhone 5S","color":"Yellow","quantity":12,"price":188800},{"id":"#Cust5","date":"2014-10-03","name":"Steve","country":"Italy","flag":"italy.png","product":"IPhone 5S","color":"Green","quantity":15,"price":425800},{"id":"#Cust6","date":"2014-10-02","name":"Jennifer","country":"Japan","flag":"japan.png","product":"Galaxy Note3","color":"Gray","quantity":7,"price":199100},{"id":"#Cust7","date":"2014-10-01","name":"Anna","country":"China","flag":"china.png","product":"LG G3","color":"Blue","quantity":10,"price":870800},{"id":"#Cust8","date":"2014-09-30","name":"Kim","country":"Korea","flag":"korea.png","product":"IPhone 5S","color":"Pink","quantity":1,"price":379900},{"id":"#Cust9","date":"2014-09-29","name":"Kim","country":"UK","flag":"uk.png","product":"LG G3","color":"Yellow","quantity":9,"price":848000},{"id":"#Cust10","date":"2014-09-28","name":"Emma","country":"UK","flag":"uk.png","product":"Galaxy S5","color":"Green","quantity":9,"price":701900},{"id":"#Cust11","date":"2014-09-27","name":"Anna","country":"China","flag":"china.png","product":"Galaxy Note3","color":"Pink","quantity":10,"price":605300},{"id":"#Cust12","date":"2014-09-26","name":"Jennifer","country":"USA","flag":"usa.png","product":"IPad Air","color":"Yellow","quantity":3,"price":158100},{"id":"#Cust13","date":"2014-09-25","name":"Lowrence","country":"France","flag":"france.png","product":"IPad Air","color":"Pink","quantity":1,"price":453600},{"id":"#Cust14","date":"2014-09-24","name":"Kim","country":"Japan","flag":"japan.png","product":"IPhone 5S","color":"Green","quantity":7,"price":254800},{"id":"#Cust15","date":"2014-09-23","name":"Emma","country":"China","flag":"china.png","product":"LG G3","color":"Green","quantity":10,"price":617500},{"id":"#Cust16","date":"2014-09-22","name":"Emma","country":"Italy","flag":"italy.png","product":"IPad Air","color":"Blue","quantity":15,"price":140800},{"id":"#Cust17","date":"2014-09-21","name":"Kim","country":"USA","flag":"usa.png","product":"Galaxy S5","color":"Yellow","quantity":3,"price":215000},{"id":"#Cust18","date":"2014-09-20","name":"Steve","country":"Ireland","flag":"ireland.png","product":"IPhone 5S","color":"Green","quantity":12,"price":3500},{"id":"#Cust19","date":"2014-09-19","name":"Han","country":"UK","flag":"uk.png","product":"Galaxy S5","color":"Violet","quantity":9,"price":589400},{"id":"#Cust20","date":"2014-09-18","name":"Steve","country":"Singapore","flag":"singapore.png","product":"IPhone 5S","color":"Yellow","quantity":20,"price":505300},{"id":"#Cust21","date":"2014-09-17","name":"Lowrence","country":"Japan","flag":"japan.png","product":"IPhone 5S","color":"Green","quantity":7,"price":737100},{"id":"#Cust22","date":"2014-09-16","name":"Steve","country":"Singapore","flag":"singapore.png","product":"IPad Air","color":"Gray","quantity":20,"price":141000},{"id":"#Cust23","date":"2014-09-15","name":"Lowrence","country":"France","flag":"france.png","product":"Galaxy Note3","color":"Yellow","quantity":1,"price":332900},{"id":"#Cust24","date":"2014-09-14","name":"Emma","country":"Ireland","flag":"ireland.png","product":"IPad Air","color":"Blue","quantity":12,"price":190700},{"id":"#Cust25","date":"2014-09-13","name":"Lowrence","country":"China","flag":"china.png","product":"IPhone 5S","color":"Violet","quantity":10,"price":263100},{"id":"#Cust26","date":"2014-09-12","name":"Kim","country":"Singapore","flag":"singapore.png","product":"Galaxy S5","color":"Yellow","quantity":20,"price":521100},{"id":"#Cust27","date":"2014-09-11","name":"Lowrence","country":"Ireland","flag":"ireland.png","product":"LG G3","color":"Blue","quantity":12,"price":721800},{"id":"#Cust28","date":"2014-09-10","name":"Jennifer","country":"France","flag":"france.png","product":"Galaxy Note3","color":"Blue","quantity":1,"price":175200},{"id":"#Cust29","date":"2014-09-09","name":"Kim","country":"Ireland","flag":"ireland.png","product":"IPad Air","color":"Pink","quantity":12,"price":543400}]; 

	AUIGrid.setGridData(myGridID, data);
	
	G_ALL_GRID[gridId] = myGridID; 
	
	
	var timerId = null;
	window.onresize = function() {
		clearTimeout(timerId);
		timerId = setTimeout(function() {
			// 그리드 리사이징
			for(var key in G_ALL_GRID){
				AUIGrid.resize(G_ALL_GRID[key]);
			}
		}, VaiGridConfig.resizeTimeout);
	};
}