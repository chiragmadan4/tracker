function setStorage(obj) {
    if (typeof(Storage) !== "undefined") {
        $.each(obj, function(key, value) {
            localStorage.setItem( key, value );
        });
    } else {
        $.each(obj, function(key, value) {
            setCookie( key, value, 24*30 );
        });
    }
}

function getStorage(token) {
    var token;
    if (typeof(Storage) !== "undefined") {
        token = localStorage.getItem(token);
    } else {
        token = getCookie(token);
    }

    return token;
}

function setCookie(cname, cvalue, exhrs) {
    var d = new Date();
    d.setTime(d.getTime() + (exhrs*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=",
        decodedCookie = decodeURIComponent(document.cookie),
        ca = decodedCookie.split(';'),
        cookievalue = '';
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			cookievalue = c.substring(name.length, c.length);
            break;
		}
	}
	return cookievalue;
}


function getDefaultPage() {
    var xhr = $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader('token', getStorage('accessToken'));
        },
        url: 'admin/getDefaultUrl'
    })
    .done(function(response) {
        if ( response.data ) {
            setStorage({defaultpage: response.data});
            window.location = '/'+getStorage('defaultpage');
        }
    })
    .fail(function() {
        var msg = '('+xhr.status+') '+xhr.statusText;
        alert(msg);
    });
}


if (getStorage('opid_trucking') && getStorage('accessToken') ) {
    if ( !getStorage('defaultpage') ) {
        getDefaultPage();
    } else {
        window.location = '/'+getStorage('defaultpage');
    }
}

function showLoader(){
	// $('body').removeClass('no-page-loader')
    INSPIRO.core.pageLoader();
}

function hideLoader(){
	// $('body').removeClass('no-page-loader');
    $(".animsition-loading").hide();
}

$('#login').on('submit', function(){

	var username = $('#phonenumber').val().trim();
	var password = $('#password').val().trim();
	var valid = true;
	if(username == ''){
		valid = false;
		$('#phonenumber').focus();
		$('#login input[type="submit"]').prop('disabled', true);
		alert('Provide telephone number!');
		$('#login input[type="submit"]').prop('disabled', false);
	}else if(username.length != 10){
		valid = false;
		$('#phonenumber').focus();
		$('#login input[type="submit"]').prop('disabled', true);
		alert('Provide 10 digit valid telephone number!');
		$('#login input[type="submit"]').prop('disabled', false);
	}
	else if(password == ''){
		valid = false;
		$('#password').focus();
		$('#login input[type="submit"]').prop('disabled', true);
		alert('Provide Password!');
		$('#login input[type="submit"]').prop('disabled', false);
	}
    valid = true;
	if(valid){
		$('#login input, button').prop('disabled', true);
		showLoader();
		var json = {};
		json.userName = username;
		json.password = password;
		json = JSON.stringify(json);
		var xhr = $.ajax({
			url: '/admin/login',
			data: json,
			type: 'POST',
			dataType : 'json',
			contentType : "application/json; charset=utf-8"
		})
		.done(function(response){
			if(response.success){
                if (response.data) {
                    var storage = {}, rolesObj = {}, roleNameArr = [];
                    // permissionsStr = '';
                    if ( response.data.accessToken ) {
                        storage.accessToken = response.data.accessToken;
                        if ( response.data.name ) {
                            storage.name = response.data.name;
                        }
                        if ( response.data.oId ) {
                            storage.opid_trucking = response.data.oId;
                        }
                        if ( response.data.consigner ) {
                            storage.consigner = response.data.consigner;
                        }
                        if ( response.data.consignee ) {
                            storage.consignee = response.data.consignee;
                        }
                        if ( response.data.roles && response.data.roles.length ) {
                            for ( var i = 0; i < response.data.roles.length; i++ ) {
                                roleNameArr.push(response.data.roles[i].roleName);
                            }
                            storage.roles = roleNameArr.join();
                        }
                        if ( response.data.defaultPage ) {
                            storage.defaultpage = response.data.defaultPage;
                        }
                        setStorage(storage);
        				window.location = '/'+getStorage('defaultpage');
                    } else {
                        alert('cannot generate accesstoken for '+username);
        				$('#login input, button').prop('disabled', false);
                    }
                } else {
                    alert('No login data found for this user');
    				$('#login input, button').prop('disabled', false);
                }
			}else{
				hideLoader();
				alert(response.message);
				$('#login input, button').prop('disabled', false);
			}
		})
		.fail(function(){
			hideLoader();
			var msg = '('+xhr.status+') '+xhr.statusText;
			alert(msg);
			$('#login input, button').prop('disabled', false);
		});

	}
	return false;
});

// if ( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
//     $('.partnerimg').attr('src', '/static/web/images/landing/partnerLiterMob.jpg');
//     $('.career').attr('src', '/static/web/images/landing/careersLiterMob.jpg');
//
//     $('.firstsection').attr('data-parallax-image', '/static/web/images/landing/home-titleBGLiterMob.png')
//         .find('.parallax-container').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/web/images/landing/home-titleBGLiterMob.png") repeat scroll 0% 0% / cover padding-box border-box');
//
//     $('.secondsection').attr('data-parallax-image', '/static/web/images/landing/parallaxLiterMob.jpg');
//     $('.truckimage').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/web/images/landing/2LiterMob.jpg") no-repeat scroll 50% 50% / contain padding-box border-box');
// } else {
//     $('.partnerimg').attr('src', '/static/web/images/landing/partnerLiter.jpg');
//     $('.career').attr('src', '/static/web/images/landing/careersLiter.jpg');
//     $('.firstsection').attr('data-parallax-image', '/static/web/images/landing/home-titleBGLiter.png')
//         .find('.parallax-container').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/web/images/landing/home-titleBGLiter.png") repeat scroll 0% 0% / cover padding-box border-box');
//
//     $('.secondsection').attr('data-parallax-image', '/static/web/images/landing/parallaxLiter.jpg');
//     $('.truckimage').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/web/images/landing/2Liter.jpg") no-repeat scroll 50% 50% / contain padding-box border-box');
// }
