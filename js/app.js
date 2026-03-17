$(document).ready(function() {
    //
    // Setup
    //

    var round = 1;
    var points = 0;
    var roundScore = 0;
    var totalScore = 0;
    ranOut = false;
    var distance;

    // Pool of places with pre-validated images (loaded once, used for all 5 rounds)
    var roundPlaces = null;

    //
    //  Init maps
    //

    svinitialize();
    mminitialize();

    //
    // Scoreboard & Guess button event
    //

    // Init Timer
    resetTimer();

    var mode = document.getElementById("mode");
    var params = window.location.search || "";
    if (params && mode.querySelector('option[value="' + params + '"]')) {
        mode.value = params;
    }
    mode.onchange = function() {
        document.location.search = mode.options[mode.selectedIndex].value;
    }

    // Timer
    function timer() {
        count = count-1;
        if (count <= 0) {
            if (round < 5){
                endRound();
            } else if (round >= 5){
                endGame();
            };
            clearInterval(counter);
        }
        $("#timer").html(count);
    };

    // Guess Button
    $('#guessButton').click(function (){
        doGuess();
        rminitialize();
    });

    // End of round continue button click
    $('#roundEnd').on('click', '.closeBtn', function () {
        $('#roundEnd').fadeOut(500);

        if (round < 5){

            round++
            if(ranOut==true){
                roundScore = 0;
            } else {
                roundScore = points;
                totalScore = totalScore + points;
            }

            $('.round').html('Ronda actual: <b>'+round+'/5</b>');
            $('.roundScore').html('Puntos última ronda: <b>'+roundScore+'</b>');
            $('.totalScore').html('Puntuación total: <b>'+totalScore+'</b>');

            var img = document.getElementById('image');
            img.src = "";

            // Reload maps to refresh coords
            svinitialize();
            guess2.setLatLng({lat: -999, lng: -999});
            if (typeof COLOMBIA_BOUNDS !== "undefined") {
                mymap.fitBounds(COLOMBIA_BOUNDS, { padding: [20, 20] });
            } else {
                mymap.setView([4.57, -74.30], 6);
            }

            // Reset Timer
            resetTimer();
        } else if (round >= 5){
            endGame();
        };
    });

    // End of game 'play again' button click
    $('#endGame').on('click', '.playAgain', function () {
        window.location.reload();
    });

    //
    // Functions
    //

    // Build Wikimedia Commons thumbnail URL so we request a smaller image (faster download).
    // Handles: (1) upload.wikimedia.org direct URLs -> thumb path; (2) Special:FilePath URLs -> ?width=
    function commonsThumbUrl(fullImageUrl, widthPx) {
        widthPx = widthPx || 1200;
        var u = fullImageUrl;
        // Special:FilePath (what Wikidata often returns): add width parameter
        if (u.indexOf("Special:FilePath") !== -1 || u.indexOf("Special%3AFilePath") !== -1) {
            var sep = u.indexOf("?") !== -1 ? "&" : "?";
            return u + sep + "width=" + widthPx;
        }
        // Direct upload URL: already a thumb or build thumb path
        if (u.indexOf("upload.wikimedia.org") === -1 || u.indexOf("/commons/thumb/") !== -1) {
            return u;
        }
        var match = u.match(/^(.+\/commons\/)(.+)$/);
        if (!match) return u;
        var filename = match[2].split("/").pop();
        return match[1] + "thumb/" + match[2] + "/" + widthPx + "px-" + filename;
    }

    // Preload one image; resolves when loaded, rejects on error (so we know it's available).
    function preloadImage(url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { resolve(url); };
            img.onerror = function () { reject(new Error("Image failed to load")); };
            img.src = url;
        });
    }

    function applyPlace(place) {
        window.actualLatLng = { lat: parseFloat(place.lat.value), lon: parseFloat(place.lon.value) };
        window.locID = place.item.value;
        window.locName = place.itemLabel.value;
        window.locDescription = place.itemDescription ? place.itemDescription.value : undefined;
    }

    // Reset Timer
    function resetTimer(){
        count = 999999;
        counter = setInterval(timer, 1000);
    }

    // Calculate distance between points function
    function calcDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lon2-lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) {
        return Value * Math.PI / 180;
    }

    function doGuess(){
        if (ranOut == false){

            // Stop Counter
            clearInterval(counter);

            // Reset marker function
            function resetMarker() {
                //Reset marker
                if (guessMarker != null) {
                    guessMarker.setMap(null);
                }
            };

            // Calculate distance between points, and convert to kilometers
            distance = Math.ceil(calcDistance(window.actualLatLng.lat, window.actualLatLng.lon, window.guessLatLng.lat, window.guessLatLng.lng));

            // Calculate points awarded via guess proximity
            function inRange(x, min, max) {
                return (min <= x && x <= max);
            };

            var earthCircumference = 40075.16;
            var x = 2.00151 - (distance/(earthCircumference/4));
            points = Math.round(2100 * ((1 / (1 + Math.exp(-4 * x + 5.2))) + (1 / (Math.exp(-8 * x + 17.5))) + (1 / (Math.exp(-30 * x + 61.2))) + (500 / (Math.exp(-250 * x + 506.7)))));

            roundScore = points;

            endRound();

        } else {

            // They ran out

        }

        timer();

    };

    function endRound(){

        // If distance is undefined, that means they ran out of time and didn't click the guess button
        if(typeof distance === 'undefined' || ranOut == true){
            $('#roundEnd').html('<p>¡Se acabó el tiempo!<br/> No sumaste puntos en esta ronda.<br/><br/><button class="btn btn-primary closeBtn" type="button">Continuar</button></p></p>');
            $('#roundEnd').fadeIn();

            // Stop Counter
            clearInterval(counter);

            // Reset marker function
            function resetMarker() {
                //Reset marker
                if (guessMarker != null) {
                    guessMarker.setMap(null);
                }
            };

            //window.guessLatLng = '';
            ranOut = false;

            points = 0;

        } else {
            $('#roundEnd').html('<p>Tu respuesta estuvo a<br/><strong><h1>'+distance+' km</h1></strong> de la ubicación real.<br/><h2><a href="'+window.locID+'">'+window.locName+'</a>' + (window.locDescription ? ', '+window.locDescription : '' ) + '.</h2><div id="roundMap"></div><br/> Puntos en esta ronda:<br/><h1>'+roundScore+'</h1><br/><br/><button class="btn btn-primary closeBtn" type="button">Continuar</button></p></p>');
            $('#roundEnd').fadeIn();
        };

        // Reset Params
        ranOut = false;

    };

    function endGame(){

        roundScore = points;
        totalScore = totalScore + points;

        $('#miniMap, #pano, #guessButton, #scoreBoard').hide();
        $('#endGame').html('<h1>¡Felicidades!</h1><h2>Tu puntuación final:</h2><h1>'+totalScore+'</h1><br/><button class="btn btn-large btn-success playAgain" type="button">¿Jugar de nuevo?</button>');
        $('#endGame').fadeIn(500);

        //rminitialize();

        // We're done with the game
        window.finished = true;
    }

    function setLoaderText(loaderEl, text, progress) {
        if (!loaderEl) return;
        while (loaderEl.firstChild) loaderEl.removeChild(loaderEl.firstChild);
        loaderEl.appendChild(document.createTextNode(text));
        if (progress !== undefined && progress !== null) {
            var span = document.createElement("span");
            span.className = "imageLoaderProgress";
            span.textContent = " " + progress;
            loaderEl.appendChild(span);
        }
    }

    function shuffleArray(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function loadNextRoundImage() {
        if (!roundPlaces || round < 1 || round > 5) return;
        var place = roundPlaces[round - 1];
        if (!place) return;
        applyPlace(place);
        var img = document.getElementById("image");
        if (img) img.src = commonsThumbUrl(place.photo.value, 1200);
    }

    function svinitialize() {
        if (roundPlaces) {
            loadNextRoundImage();
            return;
        }
        var typeParam = window.location.search.replace(/^\?/, "");
        var typeFilter;
        if (typeParam === "Q33506") {
            typeFilter = "?item wdt:P31/wdt:P279* wd:Q33506 .";
        } else if (typeParam === "Q839954") {
            typeFilter = "?item wdt:P31/wdt:P279* wd:Q839954 .";
        } else if (typeParam === "Q46169") {
            typeFilter = "?item wdt:P31/wdt:P279* wd:Q46169 .";
        } else {
            typeFilter = `
          { ?item wdt:P31/wdt:P279* wd:Q33506 . }
          UNION { ?item wdt:P31/wdt:P279* wd:Q839954 . }
          UNION { ?item wdt:P31/wdt:P279* wd:Q46169 . }`;
        }
        const query = `
        SELECT ?item ?itemLabel ?itemDescription ?lat ?lon ?photo WHERE {
          ?item wdt:P18 ?photo .
          ?item wdt:P17 wd:Q739 .

          ?item p:P625 ?statement .
          ?statement psv:P625 ?coords .
          ?coords wikibase:geoLatitude ?lat .
          ?coords wikibase:geoLongitude ?lon .

          ${typeFilter}

          SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
        }
        LIMIT 1000
        `;
        const url = "https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=" + encodeURIComponent(query);
        var loaderEl = document.getElementById("imageLoader");
        if (loaderEl) {
            loaderEl.setAttribute("aria-hidden", "false");
            setLoaderText(loaderEl, "Preparando juego…", null);
        }
        window.fetch(url)
            .then(function (response) {
                if (response.status !== 200) {
                    if (loaderEl) loaderEl.setAttribute("aria-hidden", "true");
                    console.warn("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                return response.json();
            })
            .then(function (data) {
                if (!data) return;
                var bindings = data.results.bindings;
                if (!bindings || bindings.length === 0) {
                    if (loaderEl) loaderEl.setAttribute("aria-hidden", "true");
                    console.warn("No places returned from query");
                    return;
                }
                var shuffled = shuffleArray(bindings);
                var validated = [];
                var batchSize = 40;
                var maxBatches = 6;
                var totalChecked = 0;

                function runNextBatch(batchIndex) {
                    if (validated.length >= 5 || batchIndex >= maxBatches) {
                        finishPreload();
                        return;
                    }
                    var start = batchIndex * batchSize;
                    var slice = shuffled.slice(start, start + batchSize);
                    if (slice.length === 0) {
                        finishPreload();
                        return;
                    }
                    totalChecked += slice.length;
                    if (loaderEl) setLoaderText(loaderEl, "Verificando imágenes… ", totalChecked + " comprobadas");
                    var promises = slice.map(function (b) {
                        return preloadImage(commonsThumbUrl(b.photo.value, 1200)).then(function () { return b; });
                    });
                    Promise.allSettled(promises).then(function (results) {
                        results.forEach(function (r, i) {
                            if (r.status === "fulfilled" && r.value) validated.push(r.value);
                        });
                        runNextBatch(batchIndex + 1);
                    });
                }

                function finishPreload() {
                    if (validated.length < 5) {
                        if (loaderEl) {
                            setLoaderText(loaderEl, "No se pudieron cargar suficientes imágenes. Intenta de nuevo.", null);
                        }
                        return;
                    }
                    roundPlaces = shuffleArray(validated).slice(0, 5);
                    var img = document.getElementById("image");
                    var place = roundPlaces[0];
                    applyPlace(place);
                    img.onload = function () {
                        img.onload = null;
                        if (loaderEl) loaderEl.setAttribute("aria-hidden", "true");
                    };
                    img.onerror = function () {
                        img.onerror = null;
                        if (loaderEl) loaderEl.setAttribute("aria-hidden", "true");
                    };
                    img.src = commonsThumbUrl(place.photo.value, 1200);
                }

                runNextBatch(0);
            })
            .catch(function (err) {
                if (loaderEl) {
                    loaderEl.setAttribute("aria-hidden", "true");
                    console.warn("Fetch Error", err);
                }
            });
    }

});
