/**
 * vue.vai.js v0.0.1
 * ========================================================================
 */
if (typeof window != "undefined") {
    if (typeof window.VaiAPP == "undefined") {
        window.VaiAPP = {};
    }
}else{
	if(!VaiAPP){
		VaiAPP = {};
	}
}

var  portalDefaultTemplate = {
	'pageNavTemplate' : '<div class="text-center"><ul class="pagination">'
		+'<li :class="((pageInfo.preP_is !== true && pageInfo.currPage <=1)? \'disabled\' :\'\')">'
		+'	<a @click="goPage(pageInfo.currPage - 1)">«</a>'
		+'</li>'
		+'<li v-for="no in range(pageInfo.currStartPage , pageInfo.currEndPage)" :class="no ==pageInfo.currPage?\'active\':\'\'">'
		+'	<a v-if="no ==pageInfo.currPage">{{no}}</a>'
		+'	<a v-if="no != pageInfo.currPage" @click="goPage(no)">{{no}}</a>'
		+'</li>'
		+'<li :class="((pageInfo.nextPage_is !== true && pageInfo.currPage ==pageInfo.currEndPage)?\'disabled\':\'\')">'
		+'	<a @click="goPage(pageInfo.currPage + 1)">»</a>'
		+'</li>'
		+'</ul></div>'

	,'grid1Template' : '<div class="text-center"><ul class="pagination">'
		+'<li :class="((pageInfo.preP_is !== true && pageInfo.currPage <=1)? \'disabled\' :\'\')">'
		+'	<a @click="goPage(pageInfo.currPage - 1)">«</a>'
		+'</li>'
		+'<li v-for="no in range(pageInfo.currStartPage , pageInfo.currEndPage)">'
		+'	<a v-if="no ==pageInfo.currPage">{{no}}</a>'
		+'	<a v-if="no != pageInfo.currPage" @click="goPage(no)">{{no}}</a>'
		+'</li>'
		+'<li :class="((pageInfo.nextPage_is !== true && pageInfo.currPage ==pageInfo.currEndPage)?\'disabled\':\'\')">'
		+'	<a @click="goPage(pageInfo.currPage + 1)">»</a>'
		+'</li>'
	+'</ul></div>'

	,stepTemplate : '<div class="process-step-area"><div class="process-step-btn-area">'
	+ '<button type="button" class="" :class="[cssClass, (step == 1 ? \'disabled\' :\'\') ]" @click="moveHandle(\'prev\')">{{buttons.prev}}</button>'
	+ '<button type="button" :class="cssClass" v-show="(step != endStep)" @click="moveHandle(\'next\')">{{buttons.next}}</button>'
	+ '<button type="button" :class="cssClass" v-show="(step == endStep)" @click="moveHandle(\'complete\')">{{buttons.complete}}</button>'
	+ '</div></div>'
};

(function( Vue ,portalDefaultTemplate, $) {

Vue.config.devtools = true;

var $$csrf_token = $("meta[name='_csrf']").attr("content") ||'';
var $$csrf_header = $("meta[name='_csrf_header']").attr("content") ||'';

var $$ajaxOpt = {
	timeout : 3000
	,method :'post'
	,headers :{
		'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
		,'Accept': '*/*'
		,'X-Requested-With' : 'XMLHttpRequest' 
	}
	,loadSelector : '#vartoolVueArea'
};

$$ajaxOpt.headers[$$csrf_header] =  $$csrf_token;

PubEP.util.objectMerge(axios.defaults, $$ajaxOpt);

axios.interceptors.request.use(function (config) {
    $(config.loadSelector).centerLoading({
        contentClear:false
    });
    
    var param = config.data;
    
    if(!(param instanceof FormData) && !(param instanceof URLSearchParams)){
		var schParam = new URLSearchParams();
			
		for(var key in param){
			schParam.append(key, param[key]);
		}
		
		config.data = schParam;	
	}
    
    return config;
}, function (error) {
    $(error.config.loadSelector).centerLoadingClose();
    return Promise.reject(error);
});

Vue.prototype.$ajax = axios;

// 응답 인터셉터
axios.interceptors.response.use(function (resData) {
    $(resData.config.loadSelector).centerLoadingClose();
    
    if(VaiAPP.validationCheck(resData.data)){
		return resData.data;
	}
	
}, function (error) {
    $(error.config.loadSelector).centerLoadingClose();
    return Promise.reject(error);
});

VaiAPP.validationCheck = function (resData){
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


VaiAPP.message ={
	empty : '데이타가 없습니다.'
}

// list component add
Vue.component('list-cont', {
	created :function() {
		var templateName = this.listType+'Template';
		var templateCont = portalDefaultTemplate[templateName];

		if(typeof templateCont ==='undefined'){
			templateCont  = portalDefaultTemplate['type1Template'];
		}

		this.$options.template = templateCont;
	}
	,props: {
		list : Array,
		listType : String,
		columnKey : Object
	}
	,data:function(){
		var sortOrders = {};

		var keyInfo = Vue.util.extend({
			'TITLE' : 'TITLE'
			,'AUTHOR' : 'AUTHOR'
			,'DATE' : 'VIEW_DT'
			,price : 'price'
			,active : 'active'
			,imgSrc : 'imgSrc'
		},this.columnKey);

		return {
			keyInfo : keyInfo
		}
	}
	,methods: {
		titleClick:function(item) {
			this.$parent.detailItem = item;
			//console.log(JSON.stringify(key))
		}
	}
})

// page navigation component add
Vue.component('page-navigation', {
	template: portalDefaultTemplate.pageNavTemplate,
	props: {
		pageInfo : Object
		,callback : String
	}
	,methods: {
		range : function (start, end) {

			if(typeof start ==='undefined') return [];

			var reArr = [];

			for(start ; start <= end;start++){
				reArr.push(start);
			}

			return reArr;
		}
		,goPage : function (pageNo) {

			if(pageNo < 1){
				pageNo =1;
				return ;
			}

			if(pageNo > this.pageInfo.totalPage){
				pageNo= this.pageInfo.totalPage;
				return ;
			}

			if(this.pageInfo.currPage == pageNo){
				return ;
			}
			this.pageInfo.currPage = pageNo;


			var callback = this.$parent[this.callback];

			if(typeof callback === 'undefined'){
				callback = this.$parent['search'];
			}

			callback.call(null,pageNo);
		}
	}
})

/**
 * @method VaiAPP.addTemplate
 * @description 템플릿 add
 */
VaiAPP.addTemplate  = function (template){
	if($.isPlainObject(template)){
		for(var key in template){
			if(typeof portalDefaultTemplate[key] ==='undefined'){
				portalDefaultTemplate[key]= template[key];
			}
		}
	}
}

/**
 * @method VaiAPP.addMessage
 * @description 메시지 add
 */
VaiAPP.addMessage = function (msg){
	for(var key in msg){
		VaiAPP.message[key]= msg[key];
	}
}


var defaultOpt = {
	el: '#vartoolViewArea'
	,data: {}
	,methods:{
		init: function (){}
		,search: function (no){}
	}
}
/**
 * @method addMethod
 * @description vue method 추가.
 * @param prefix
 * @param opts
 * @param methodObj
 * @returns
 */
function addMethod(prefix , opts){
	var methodObj = opts[prefix];

	if(typeof methodObj !=='undefined'){
		for(var key in methodObj){
			opts.methods[prefix+'_'+key] = methodObj[key];
		}
		delete opts[prefix];
	}
	return opts;
}

VaiAPP.vueServiceBean = function (opts){
	
	var initOpt = {};
	
	opts = PubEP.util.objectMerge(initOpt,defaultOpt,opts);

	if(opts.validateCheck ===true){
		Vue.use(VeeValidate)
	}

	var vueObj = new Vue(opts);

	$(vueObj.$el).removeClass('display-off')

	if(PubEP.isFunction(vueObj.init)){
		vueObj.init();
	}
	
	if(PubEP.isFunction(vueObj.search)){
		vueObj.search(1);
	}

	return vueObj;
}
})(Vue , portalDefaultTemplate, jQuery);