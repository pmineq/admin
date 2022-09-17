/**
 * vai.js
 * ========================================================================
 */

(function( window) {
	'use strict';
	
function log () {
	console.log.apply(console, arguments)
}

var _$base = {}
, _ePortalConfig = (typeof $vaiConfig === 'undefined' ? {domain:{}, context: '', link:{}}: $vaiConfig)
,isMenuLog = false
,frameSelector = '#epContentViewFrame'


var $$csrf_token = $("meta[name='_csrf']").attr("content") ||'';
var $$csrf_header = $("meta[name='_csrf_header']").attr("content") ||'';
var $$csrf_param = $("meta[name='_csrf_parameter']").attr("content") ||'';


var $$ajaxOpt = {
	timeout : 300000
	,header : {}
}

$$ajaxOpt.header[$$csrf_header] =  $$csrf_token;

PubEP.init({
		loadingImg : '/webstatic/image/common/loading.gif'
		,loadingBgColor:'#ffffff'
		,loadSelector : '#vartoolVueArea'
		,openType:{
			'1':'popup'
			,'2':'iframe'
			,'3':'location'
		}
		,defaultPopupPosition : {
			topMargin : 10
			,leftMargin : 0
			,top:4
			,browser : {
				msie : 0
				,mozilla : 10
				,chrome : 0
				,'default' : 10
				,safari : 10
			}
		}
	}
	,$$ajaxOpt
)

function isUndefined(obj){
	return typeof obj==='undefined';
}

/**
 * @method init
 * @description 설정 초기화.
 */	
_$base.init = function (option){
	$.extend(globalOption,option);
	return _$base; 
}

_$base.getUrl = function (uri , type){
	if(typeof type !=='undefined'){
		return _ePortalConfig.link[type]+uri;
	}else{
		return _ePortalConfig.context+uri;
	}
}

_$base.clickMenu = function (){
	return currentMenuInfo; 
}

_$base.validationCheck = function (resData){
	if(resData.messageCode=='valid'){
		var items = resData.items;

		if($.isArray(items)){
			var objLen = items.length;
			if(objLen >0){
				var item = items[0];
				alert(item.field + "\n"+ item.defaultMessage)
				return false;
			}
		}else{
			alert(resData.message);
			return false;
		}

	}
	return true;
}


_$base.viewMenu = {
	PORTAL : function (openInfo, viewType){
		
		var url = PubEP.util.replaceParam(openInfo.menuUrl, $vaiConfig.domain||{});

		if(openInfo.menuType==2){
			PubEP.page.view(openInfo.menuUrl,'popup',{});
			return ; 
		}else{
			url = _$base.getUrl(url);
		}
		
		if(viewType=='return'){
			return url; 
		}
		
		this._contentFrameView(url, true);
		
	}
	// 지정된거 이외.
	,OTHER : function (openInfo){
		PubEP.page.view(openInfo.menuUrl,'popup',{});
		//$(frameSelector).attr('src',openInfo.menuUrl);
	}
	,_contentFrameView : function(url){
		var frameEle = $('.main-content-wrapper[data-cont-type="frame"]');
		
		if(!frameEle.hasClass('on')){
			$('.main-content-wrapper.on').removeClass('on');
			frameEle.addClass('on');
		}
		
		$(frameSelector).attr('src',url);
	
	}
}

var currentMenuInfo; // iframe 내부에서 정보를 가져갈수 있게 선언;
_$base.menu={
	open : function (openInfo, objType, popupFlag){
		var _this =this;
		
		openInfo = PubEP.util.objectMerge({},openInfo);
		currentMenuInfo = openInfo;
		
		objType = objType || 'PORTAL'; 
		
		if(window != parent && (parent||top).VaiCTRL){
			(parent||top).VaiCTRL.open(openInfo, objType, popupFlag);
			return ; 
		}
		
		// ep log write
		if(isMenuLog===true){
			PubEP.logWrite(openInfo.MENU_ID, 'popup' ,{gubun:'gnb_menu' ,gubunkey: openInfo.MENU_ID});
			
		}
		
		this.toggle(false);
			
		if(!isUndefined(_$base.viewMenu[objType])){
			_$base.viewMenu[objType].call(_$base.viewMenu, openInfo);
		}else{
			_$base.viewMenu.OTHER(openInfo);
		}
		return ; 
	}
	,toggle :function (flag) {
		var showFlag = false; 
		if(flag===true){
			showFlag = true;
		}else if(flag===false){
			showFlag = false; 
		}
		
		if(showFlag){
			$('#headerContainer').removeClass('nav-close');
			$('.ep_frame_background').addClass('open');	
		}else{
			$('#headerContainer').addClass('nav-close');	
			$('.ep_frame_background').removeClass('open');	
		}
		
		$('.show-layer').removeClass('show-layer');
	}
	,isBookmarkFile : function (menuId){
		return menuId.length==32;
	}
	,isMenuId : function (menuId){
		return menuId.length==32;
	}
}
$(function (){
	$('.ep_frame_background').on('click', function (e){
		_$base.menu.toggle(false);

		$('.show-layer').removeClass('show-layer');
	});
})



//ecm file download
_$base.ecm={
	fileDownload : function (fileId, fileOidFlag){
		PubEP.download({
		    url : _$base.getUrl('/appfile/download')
		    ,target : 'popup'
		    ,param : {
		        div: fileOidFlag === true ? 'ecm_fileoid' :'ecm'
		        ,fileId : fileId
		    }
		});
	}
	,fileList : function (param, callback){
		PubEP.req.ajax({
			url : _$base.getUrl('/appfile/ecmFileList')
			,data : param
			,loadSelector : param.loadSelector
			,success: function (resData){
				callback(resData);
			}
			,error : function (resData){
				callback(resData);
			}
		})
	}
}


/**
 * message
 */
_$base.messageFormat =function (fmt, msgParam){

	if(PubEP.isUndefined(msgParam)){
		var reval = VAILANG[fmt];

		if(!PubEP.isUndefined(reval)){
			return reval;
		}
	}else{
		var tmpFmt = VAILANG[fmt];
		fmt = tmpFmt ? tmpFmt :fmt;
	}

	msgParam = msgParam||{};

	var strFlag = false
		,arrFlag = false;

	var arrLen = -1;

	if(typeof msgParam ==='string'){
		strFlag = true;
	}else{
		arrFlag = $.isArray(msgParam);
		if(arrFlag){
			arrLen = msgParam.length;
		}
	}

    this.$$index = 0;

    return fmt.replace(/\{{1,1}([A-Za-z0-9_.]*)\}{1,1}/g, function(match, key) {
		if(strFlag){
			return msgParam;
		}else if(arrFlag){
			if (key === '') { // {}
				key = this.$$index;
				this.$$index++
			}

			if(key < arrLen){
				return msgParam[key];
			}
			return match;
		}else{
			return typeof msgParam[key] !== 'undefined' ? msgParam[key] : match;
		}
    });
}

try{
	//접기 버튼 전역으로 처리. 
	$(function(){
		$('.btn-search-close').off('click');
	
		$('.btn-search-close').on('click.searchbox.toggle', function (e){
			var searchWrapEle = $(this).closest('.search-wrap');
			if(searchWrapEle.hasClass('search-close')){
				$('.search-wrap').removeClass('search-close');
			} else {
				$('.search-wrap').addClass('search-close');
			}
		})
	});
}catch(e){}


try{
	// 달력 공통 기능 추가. 
	if($.isFunction($.fn.datepicker)){
		$.fn.datepicker.defaults.format= "yyyy-mm-dd";
		$.fn.datepicker.defaults.orientation = "top auto";
		$.fn.datepicker.defaults.autoclose =  true;
		
		var _lang = $vaiConfig.language||''; 	
		
		if( _lang.indexOf('ko') > -1 ){
			if(typeof $.fn.datepicker.dates['kr'] !== 'undefined'){
				$.fn.datepicker.defaults.language = "kr";
			}
		}
	}
}catch(e){
	
};




if (typeof window != "undefined") {
    if (typeof window.VaiCTRL == "undefined") {
        window.VaiCTRL = _$base;
    }
}else{
	if(!VaiCTRL){
		VaiCTRL = _$base;
	}
}

})( window ,jQuery);
