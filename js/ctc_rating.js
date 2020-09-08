window.addEventListener('load', () => {


    ratePost = clickeEl => {

        let postId = clickeEl.getAttribute('data-type-id');
        let dataToSend = 'action=ctcUserRating&rating_data=' + JSON.stringify({ postId: postId, ratingType: clickeEl.getAttribute('data-type-rating') });

        var xhttp = new XMLHttpRequest();

        xhttp.open('POST', ctcRating.ctcRatingAjaxUrl, true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.addEventListener('load', e => {
            if (event.target.status >= 200 && event.target.status < 400) {

                console.log(e.target.response);
                if ('notLoggedIn' == e.target.response) {
                    alert(ctcRating.notLoggedIn);
                } else {
                    ctcUpdateRating(e.target.response, postId, clickeEl);
                }
            } else {
                return false;
            }
        })
        xhttp.send(dataToSend);
    }

    //function to update Rating based on server response
    ctcUpdateRating = (serverResponse, productId, clickedEl) => {
        let scenario = clickedEl.getAttribute('data-type-scenario');
        let otherRating;
        switch (serverResponse) {
            case 'thumbsUp':
                clickedEl.title = ctcRating.alreadyThumbedUp
                clickedEl.classList.remove('ctcThumbDown')
                clickedEl.classList.add('ctcUserThumbUp');
                ctcCalcUpDown(productId, 'thumbsUp', scenario);
                break;
            case 'thumbsDown':
                clickedEl.title = ctcRating.alreadyThumbedDown
                clickedEl.classList.remove('ctcThumbUp')
                clickedEl.classList.add('ctcUserThumbDown');
                clickedEl.style.fontSize = '25px'
                ctcCalcUpDown(productId, 'thumbsDown', scenario);
                break;
            case 'thumbsUpReversed':
                clickedEl.title = ctcRating.alreadyThumbedDown
                clickedEl.classList.add('ctcUserThumbDown');
                clickedEl.style.fontSize = '25px';

                otherRating = document.querySelector('#ctcThumbUp-' + productId);
                otherRating.title = ctcRating.thumbUp
                otherRating.classList.remove('ctcUserThumbUp')
                otherRating.classList.add('ctcThumbUp')
                otherRating.style.fontSize = '20px';
                ctcCalcUpDown(productId, 'thumbsUpReversed', scenario);
                break;
            case 'thumbsDownReversed':
                clickedEl.title = ctcRating.alreadyThumbedUp;
                clickedEl.classList.remove('ctcThumbUp');
                clickedEl.classList.add('ctcUserThumbUp');
                clickedEl.style.fontSize = '25px';

                otherRating = document.querySelector('#ctcThumbDown-' + productId);
                otherRating.title = ctcRating.thumbDown;
                otherRating.classList.remove('ctcUserThumbDown');
                otherRating.classList.add('ctcThumbDown');
                otherRating.style.fontSize = '20px';
                ctcCalcUpDown(productId, 'thumbsDownReversed', scenario);
                break;
            case 'unThumbsUp':
                clickedEl.title = ctcRating.thumbUp;
                clickedEl.classList.remove('ctcUserThumbUp');
                clickedEl.classList.add('ctcThumbUp');
                clickedEl.style.fontSize = '20px'
                ctcCalcUpDown(productId, 'unThumbsUp', scenario);
                break;
            case 'unThumbsDown':
                clickedEl.title = ctcRating.thumbDown;
                clickedEl.classList.remove('ctcUserThumbDown');
                clickedEl.classList.add('ctcThumbDown');
                clickedEl.style.fontSize = '20px';
                ctcCalcUpDown(productId, 'unThumbsDown', scenario);
                break;
        }
    }

    //function add substract thumup and thumbdown based on server respose
    ctcCalcUpDown = (postId, action, scenario) => {
        let ratingUpElem, ratingDownElem, ctcNewThumbsUpCount, ctcNewThumbsDownCount;
        switch (action) {
            case 'thumbsUp':
                ratingUpElem = document.querySelector('#ctcThumbUpCount-' + postId);
                ctcNewThumbsUpCount = parseInt(ratingUpElem.getAttribute('data-type-thumupcount')) + 1;
                ratingUpElem.innerHTML = addCommas(ctcNewThumbsUpCount)
                ratingUpElem.setAttribute('data-type-thumupcount', ctcNewThumbsUpCount)
                break;
            case 'thumbsDown':
                ratingDownElem = document.querySelector('#ctcThumbDownCount-' + postId);
                ctcNewThumbsDownCount = parseInt(ratingDownElem.getAttribute('data-type-thumdowncount')) + 1;
                ratingDownElem.innerHTML = addCommas(ctcNewThumbsDownCount);
                ratingDownElem.setAttribute('data-type-thumdowncount', ctcNewThumbsDownCount);
                break;
            case 'thumbsUpReversed':
                ratingUpElem = document.querySelector('#ctcThumbUpCount-' + postId)
                ratingDownElem = document.querySelector('#ctcThumbDownCount-' + postId)
                ctcNewThumbsUpCount = parseInt(ratingUpElem.getAttribute('data-type-thumupcount')) - 1;
                ctcNewThumbsDownCount = parseInt(ratingDownElem.getAttribute('data-type-thumdowncount')) + 1;
                ratingUpElem.innerHTML = addCommas(ctcNewThumbsUpCount)
                ratingUpElem.setAttribute('data-type-thumupcount', ctcNewThumbsUpCount);
                ratingDownElem.innerHTML = addCommas(ctcNewThumbsDownCount);
                ratingDownElem.setAttribute('data-type-thumdowncount', ctcNewThumbsDownCount);
                break;
            case 'thumbsDownReversed':
                ratingUpElem = document.querySelector('#ctcThumbUpCount-' + postId)
                ratingDownElem = document.querySelector('#ctcThumbDownCount-' + postId)
                ctcNewThumbsUpCount = parseInt(ratingUpElem.getAttribute('data-type-thumupcount')) + 1;
                ctcNewThumbsDownCount = parseInt(ratingDownElem.getAttribute('data-type-thumdowncount')) - 1;
                ratingUpElem.innerHTML = addCommas(ctcNewThumbsUpCount)
                ratingUpElem.setAttribute('data-type-thumupcount', ctcNewThumbsUpCount);
                ratingDownElem.innerHTML = addCommas(ctcNewThumbsDownCount)
                ratingDownElem.setAttribute('data-type-thumdowncount', ctcNewThumbsDownCount);
                break;
            case 'unThumbsUp':
                ratingUpElem = document.querySelector('#ctcThumbUpCount-' + postId)
                ctcNewThumbsUpCount = parseInt(ratingUpElem.getAttribute('data-type-thumupcount')) - 1;
                ratingUpElem.innerHTML = addCommas(ctcNewThumbsUpCount)
                ratingUpElem.setAttribute('data-type-thumupcount', ctcNewThumbsUpCount);
                break;
            case 'unThumbsDown':
                ratingDownElem = document.querySelector('#ctcThumbDownCount-' + postId);
                ctcNewThumbsDownCount = parseInt(ratingDownElem.getAttribute('data-type-thumdowncount')) - 1;
                ratingDownElem.innerHTML = addCommas(ctcNewThumbsDownCount);
                ratingDownElem.setAttribute('data-type-thumdowncount', ctcNewThumbsDownCount);
                break;
        }
    }


    //function to javascript number format
    addCommas = (nStr) => {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    let ratingArr = Array.from(document.querySelectorAll(['.ctcThumbUp', '.ctcThumbDown', '.ctcUserThumbUp', '.ctcUserThumbDown']));

    ratingArr.map(x => x.addEventListener('click', e => ratePost(e.target)))


});