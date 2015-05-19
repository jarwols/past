function Search(bar, result, request) { 
	var obj = this; 
	this.request = request
	this.result = document.getElementById(result); 
	this.search = document.getElementById(bar);
	this.search.onkeyup = function(event) { 
		obj.keyType(event)
	}
}

Search.prototype.keyType = function(event) { 
	var substring = encodeURIComponent(this.search.value);
	var server_string = this.request + substring; 
	if (substring == "") {
 		this.result.innerHTML = "";
 	} else { 
		ajaxRequest(server_string, this.result);
	}
 	return false;
}

function ajaxRequest(request, result) { 
	var xhr = new XMLHttpRequest();
	var obj = this; 
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				result.innerHTML = this.responseText;
			} else { 
				return; 
			}
		}
	}
	xhr.open("GET", request);
	xhr.send();
}



