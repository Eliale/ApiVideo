	var Aplicacion = (function() {
		
		// YOUTUBE:
		var _procesar_datos_youtube = function(datos_recibidos) {
			var datos = JSON.parse(datos_recibidos);
			console.log('Datos de yOUTUBE');
			console.log(datos);
			var v = [], id_video = [], id_vi = [];

			document.getElementById("you").innerHTML = "";
			var you_elem = document.getElementById('you');

			for(var i = 0; i < 5; i++) {
				var frames = document.createElement('iframe');
				
				// id_video = datos.items[0].id.playlistId; YouTube encuentra playlist y videos 
				id_video[i] = datos.items[i].id.videoId; // Agrega los ids al arreglo con riesgo de ser indefinido
				//alert(datos.items[i].id.videoId);
				//&& _es_vevo(datos.items[i].snippet.channelTitle) === false
				if (datos.items[i].id.videoId != undefined  && _es_360(datos.items[i].snippet.title) === true) {// Si no es undefined, lo asigna a a pagina
					
					//console.log(datos.items[i]);
					frames.setAttribute('id', 'v2' + (i + 1));
					frames.setAttribute('frameborder', 0);
					frames.setAttribute('allowfullscreen', "");
					frames.setAttribute('mozallowfullscreen', "");
					frames.setAttribute('webkitallowfullscreen', "");
					frames.setAttribute('style', 'width: 350px; height: 250px; margin-top: 50px');
					you_elem.appendChild(frames);

					v[i] = document.getElementById('v2' + (i + 1));
					console.log(id_video[i]);
					v[i].setAttribute('src', 'https://www.youtube.com/embed/' + id_video[i]);
				}
			}
		};

		var _es_360 = function(titulo){
			var titu = titulo;
			if ((/360°/.test(titu)) || (/VR/.test(titu)) ){
				return true;
			}
			else {
				return false;
			}
		};

		var _procesar_errores_youtube = function(estadov, texto_estadov) {
			var mensase_errorv2 = " Conexion fallida error: " + estadov  + "{" + texto_estadov + "}" ;
			console.log(mensase_errorv2);
			//alert(mensase_errorv2);
		};

		var _procesar_cambios_youtube = function(obj_xhrv) {
			return function() {
				if(obj_xhrv.readyState === 4 && obj_xhrv.status === 200)
					_procesar_datos_youtube(obj_xhrv.responseText);
				if(obj_xhrv.readyState === 4 && obj_xhrv.status !== 200)		
					_procesar_errores_youtube(obj_xhrv.status, obj_xhrv.statusText);	

			};
		};

		_realizar_conexion_servidor_youtube = function(artist) {
			var xhrv2 = new XMLHttpRequest();
			xhrv2.onreadystatechange = _procesar_cambios_youtube(xhrv2);
			var artista =  artist+ ' 360';

			var urlv2 = 'https://www.googleapis.com/youtube/v3/search?q='+artista+'&part=snippet&maxResults=25&search_sort=video_avg_rating&regionCode=MX&key=AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE';

			xhrv2.open('GET', urlv2, true);
			xhrv2.setRequestHeader ("Accept", "application/json");
			xhrv2.send();
		}


	
	// DailyMotion
	var _procesar_datos_dailymotion = function(datos_recibidos) {
		var datos = JSON.parse(datos_recibidos);
		console.log('Datos de dailymotion');
		console.log(datos.list);

		var v = [], id_video = [];

		document.getElementById("dal").innerHTML = "";
		var vim_elem = document.getElementById('dal');

		for(var i = 0; i < 5; i++) {
			var frames = document.createElement('iframe');
			frames.setAttribute('id', 'v' + (i + 1));
			frames.setAttribute('frameborder', 0);
			frames.setAttribute('allowfullscreen', "");
			frames.setAttribute('mozallowfullscreen', "");
			frames.setAttribute('webkitallowfullscreen', "");
			frames.setAttribute('style', 'width: 350px; height: 250px; margin-top: 50px');
			vim_elem.appendChild(frames);

			v[i] = document.getElementById('v' + (i + 1));
			id_video[i] = datos.list[i].id;
			v[i].setAttribute('src', 'https://www.dailymotion.com/embed/video/' + id_video[i]);
		}
	};

	var _procesar_errores_dailymotion = function(estadod,texto_estadod) {
		var mensase_errord = " Conexion fallida error: " + estadod  + "{" + texto_estadod + "}" ;
		console.log(mensase_errord);
		//	alert(mensase_errorv);
	};

	var _procesar_cambios_dailymotion = function(obj_xhrd) {
		return function() {
			if(obj_xhrd.readyState === 4 && obj_xhrd.status === 200)
				_procesar_datos_dailymotion(obj_xhrd.responseText);
			if(obj_xhrd.readyState === 4 && obj_xhrd.status !== 200)
				_procesar_errores_dailymotion(obj_xhrd.status,obj_xhrd.statusText);

		};
	};

	_realizar_conexion_servidor_dailymotion = function(artist) {
		var xhrd = new XMLHttpRequest();
		xhrd.onreadystatechange = _procesar_cambios_dailymotion(xhrd);
		var urld ='https://api.dailymotion.com/videos?360_degree=1&search='+artist;
		xhrd.open('GET', urld, true);

		xhrd.setRequestHeader ("Accept", "application/json");
		xhrd.send();
	}



	var _buscar_videos = function(artista_buscado){
		
		_realizar_conexion_servidor_youtube(artista_buscado);
		_realizar_conexion_servidor_dailymotion(artista_buscado);
	}

	var _buscar = function() {
		var nombre_artista = document.getElementById('nombre_artista');
		var nombre = nombre_artista.value;
			// _realizar_conexion_servidor_spotify(nombre);

			_buscar_videos(nombre);
		}

		var _colocar_encabezados = function() {
			
		
			var encabezado_youtube = document.getElementById('encabezado_youtube');
			var encabezado_dal = document.getElementById('encabezado_dal');
			
			encabezado_youtube.textContent = "Videos de YouTube";
			encabezado_dal.textContent = "Videos de Dailymotion";
		}

		var _main = function() {
			var boton = document.getElementById('id_boton');
			var nombre_pista = document.getElementById('nombre_artista');
			boton.addEventListener('click', function(e) {
				_colocar_encabezados();
				_buscar();
			}, false);
			nombre_pista.addEventListener("keypress", function(e) {
				if (e.keyCode === 13) {
					_colocar_encabezados();
					_buscar();
					
				}
			}, false);
		};

		return {
			"main": _main
		};
	})();