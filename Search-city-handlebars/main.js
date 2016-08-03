let urlCities = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
let input = document.getElementsByTagName('input')[0],
    container = document.querySelector('.container');	

let getCities = (url) => {
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject('Something went wrong!');
            }
        });
    })
};

let sortCities = (response) => {
	let i = 0, list = [];
	for (let {name} of response) { list[i++] = name }
    return list.sort();
};

let showResults = (result) => {
    let foundCities = document.querySelector('#foundCities').innerHTML,
		template = Handlebars.compile(foundCities);
	if (result.length){
		container.innerHTML = template({list: result});
		container.style.display = 'block';
	} else {
		container.innerHTML = template({list: ['No matches!']});
		container.style.display = 'block';
	}	
};

let removeResults = () => {
    let resDivs = document.querySelectorAll('.results');
    container.style.display = 'none';
    if (resDivs.length) {
        for (let div of resDivs) {
            div.remove();
        }
    }
};

let autocomplete = (e) => {
	if (e.target.classList.includes = 'results'){
		input.value = e.target.innerText;
		removeResults();
	}
};

window.addEventListener('load', () => {
    getCities(urlCities).then((response) => {		
		let citiesList = sortCities(response);
		showResults(citiesList);
		input.addEventListener('input', () => {
            removeResults();
            showResults(citiesList.filter(name => {return (name.toLowerCase().indexOf(input.value.toLowerCase()) !== -1)}))
         });
		container.addEventListener('click', autocomplete);
     }).catch(error => {
		alert(error);
	});
});
