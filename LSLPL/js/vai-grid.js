/**
 * vai.js
 * ========================================================================
 */

(function( window) {
	'use strict';

var _$base = {};
	
// grid 색깔 정보 설정. 
_$base.color = {
	primary : 'primary'
	,secondary :'secondary'
	,success :'success'
	,danger :'danger'
	,warning :'warning'
	,info :'info'
	,light :'light'
	,dark :'dark'
	,active : 'active'
	,inactive : 'inactive'
}

_$base.resizeTimeout = 200;


if (typeof window != "undefined") {
    if (typeof window.VaiGridConfig == "undefined") {
        window.VaiGridConfig = _$base;
    }
}else{
	if(!VaiCTRL){
		VaiCTRL = _$base;
	}
}

})( window ,jQuery);
