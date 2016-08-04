Handlebars.registerHelper('ageBy', (bdate) => {
    let bd = bdate.split('.'),
        tyear = (new Date()).getFullYear();
    if (bd[2]) {
        if (getDifference(bdate) > 0) return tyear - +bd[2] - 1
        else return tyear - +bd[2]
    } else {
        return 'нет данных'
    }

});

let getDifference = (source) => {
    let today = new Date(),
        tday = today.getDate(),
        tmonth = today.getMonth(),
        tyear = today.getFullYear(),
        bdate = source.split('.');
    today = new Date(tyear,tmonth,tday);
    bdate = new Date(tyear,+bdate[1] - 1,+bdate[0]);
    return bdate.valueOf() - today.valueOf();
};

let sortByBirthday = (param1,param2) => {
    let eq1 = getDifference(param1.bdate),
        eq2 = getDifference(param2.bdate);
    if ((eq1 < eq2 && (eq1 * eq2 > 0)) || (eq1 > eq2 && (eq1 * eq2 < 0)) || eq1 == 0) return -1
    else return 1
};

new Promise((resolve) => {
    if (document.readyState == 'complite'){
        resolve()
    } else {
        window.onload = resolve()
    }
}).then(() => {
    return new Promise(function(resolve,reject){
        let login = new Event('login',{
            bubbles: true,
            cancelable: false
        });
        VK.init({
            apiId: 5571180
        });
        VK.Widgets.Auth('vk_auth', {
            redesign: 1,
            width: '250px',
            onAuth: function(response){
                if (response) {
                    document.querySelector('#vk_auth').remove();
                    resolve();
                }
            }
        });
		/* document.addEventListener('click', () => {
			window.open('https://oauth.vk.com/authorize?client_id=5571180&display=page&redirect_uri=close.html&response_type=token&scope=2','_self URL');
			
		}) */
    })
}).then((response) => {
    return new Promise(function(resolve, reject){
        VK.Api.call('friends.get',{fields: 'bdate,  photo_50', version: 5.53}, function(response) {
		  if (response.response) {
			resolve(response.response);
		  } else {
			reject('Не удалось получить список друзей');
		  }
		});
    })
}).then((friendsList) => {
	let source = document.querySelector("#friedsTable").innerHTML,
		template = Handlebars.compile(source),
		listOfFriends = document.querySelector('#listOfFriends');	

	friendsList = friendsList.filter(obj => {return !obj.deactivated}).filter(obj => {return obj.bdate});
	friendsList.sort(sortByBirthday);
	listOfFriends.innerHTML = template({friend: friendsList});	
}).catch(error => {
    alert(error);
})