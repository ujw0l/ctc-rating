import {jsOverlay} from "js-overlay";

window.addEventListener( 'DOMContentLoaded', () => {
	const overlay = new jsOverlay();

	let ratingDiv = document.querySelector('.ctcItemRating');
	let ctcRating = JSON.parse(ratingDiv.getAttribute('data-ctcr-param'));

	/**
	 * Script to handle user rating
	 */

	/**
	 * Ajax rate post
	 *
	 * @param {*} clickeEl
	 */
	const ratePost = ( clickeEl ) => {
		let postId = clickeEl.getAttribute( 'data-type-id' );
		let dataToSend =
			'action=ctcUserRating&rating_data=' +
			JSON.stringify( {
				postId: postId,
				ratingType: clickeEl.getAttribute( 'data-type-rating' ),
			} );

		var xhttp = new XMLHttpRequest();

		xhttp.open( 'POST', ctcRating.ctcRatingAjaxUrl, true );
		xhttp.responseType = 'text';
		xhttp.setRequestHeader(
			'Content-Type',
			'application/x-www-form-urlencoded;'
		);
		xhttp.addEventListener( 'load', ( e ) => {
			if ( e.target.status >= 200 && e.target.status < 400 ) {
				if ( 'notLoggedIn' == e.target.response ) {
					alert( ctcRating.notLoggedIn );
				} else {
					ctcUpdateRating( e.target.response, postId, clickeEl );
				}
			} else {
				return false;
			}
		} );
		xhttp.send( dataToSend );
	};

	/**
	 * update Rating based on server response
	 * @param serverResponse Response from server
	 * @param postId Post Id
	 * @param clickedEl Clicked element
	 */
	const ctcUpdateRating = ( serverResponse, postId, clickedEl ) => {
		let scenario = clickedEl.getAttribute( 'data-type-scenario' );
		let otherRating;
		switch ( serverResponse ) {
			case 'thumbsUp':
				clickedEl.title = ctcRating.alreadyThumbedUp;
				clickedEl.classList.remove( 'ctcThumbDown' );
				clickedEl.classList.add( 'ctcUserThumbUp' );
				ctcCalcUpDown( postId, 'thumbsUp' );
				break;
			case 'thumbsDown':
				clickedEl.title = ctcRating.alreadyThumbedDown;
				clickedEl.classList.remove( 'ctcThumbUp' );
				clickedEl.classList.add( 'ctcUserThumbDown' );
				clickedEl.style.fontSize = '25px';
				ctcCalcUpDown( postId, 'thumbsDown' );
				break;
			case 'thumbsUpReversed':
				clickedEl.title = ctcRating.alreadyThumbedDown;
				clickedEl.classList.add( 'ctcUserThumbDown' );
				clickedEl.style.fontSize = '25px';

				otherRating = document.querySelector( '#ctcThumbUp-' + postId );
				otherRating.title = ctcRating.thumbUp;
				otherRating.classList.remove( 'ctcUserThumbUp' );
				otherRating.classList.add( 'ctcThumbUp' );
				otherRating.style.fontSize = '20px';
				ctcCalcUpDown( postId, 'thumbsUpReversed' );
				break;
			case 'thumbsDownReversed':
				clickedEl.title = ctcRating.alreadyThumbedUp;
				clickedEl.classList.remove( 'ctcThumbUp' );
				clickedEl.classList.add( 'ctcUserThumbUp' );
				clickedEl.style.fontSize = '25px';

				otherRating = document.querySelector(
					'#ctcThumbDown-' + postId
				);
				otherRating.title = ctcRating.thumbDown;
				otherRating.classList.remove( 'ctcUserThumbDown' );
				otherRating.classList.add( 'ctcThumbDown' );
				otherRating.style.fontSize = '20px';
				ctcCalcUpDown( postId, 'thumbsDownReversed', scenario );
				break;
			case 'unThumbsUp':
				clickedEl.title = ctcRating.thumbUp;
				clickedEl.classList.remove( 'ctcUserThumbUp' );
				clickedEl.classList.add( 'ctcThumbUp' );
				clickedEl.style.fontSize = '20px';
				ctcCalcUpDown( postId, 'unThumbsUp' );
				break;
			case 'unThumbsDown':
				clickedEl.title = ctcRating.thumbDown;
				clickedEl.classList.remove( 'ctcUserThumbDown' );
				clickedEl.classList.add( 'ctcThumbDown' );
				clickedEl.style.fontSize = '20px';
				ctcCalcUpDown( postId, 'unThumbsDown' );
				break;
		}
	};

	/**
	 * add substract thumup and thumbdown based on server respose
	 *
	 * @param postId Post id
	 * @param action type of action to be carried out
	 */
	const ctcCalcUpDown = ( postId, action ) => {
		let ratingUpElem,
			ratingDownElem,
			ctcNewThumbsUpCount,
			ctcNewThumbsDownCount;
		switch ( action ) {
			case 'thumbsUp':
				ratingUpElem = document.querySelector(
					'#ctcThumbUpCount-' + postId
				);
				ctcNewThumbsUpCount =
					parseInt(
						ratingUpElem.getAttribute( 'data-type-thumupcount' )
					) + 1;
				ratingUpElem.innerHTML = addCommas( ctcNewThumbsUpCount );
				ratingUpElem.setAttribute(
					'data-type-thumupcount',
					ctcNewThumbsUpCount
				);
				break;
			case 'thumbsDown':
				ratingDownElem = document.querySelector(
					'#ctcThumbDownCount-' + postId
				);
				ctcNewThumbsDownCount =
					parseInt(
						ratingDownElem.getAttribute( 'data-type-thumdowncount' )
					) + 1;
				ratingDownElem.innerHTML = addCommas( ctcNewThumbsDownCount );
				ratingDownElem.setAttribute(
					'data-type-thumdowncount',
					ctcNewThumbsDownCount
				);
				break;
			case 'thumbsUpReversed':
				ratingUpElem = document.querySelector(
					'#ctcThumbUpCount-' + postId
				);
				ratingDownElem = document.querySelector(
					'#ctcThumbDownCount-' + postId
				);
				ctcNewThumbsUpCount =
					parseInt(
						ratingUpElem.getAttribute( 'data-type-thumupcount' )
					) - 1;
				ctcNewThumbsDownCount =
					parseInt(
						ratingDownElem.getAttribute( 'data-type-thumdowncount' )
					) + 1;
				ratingUpElem.innerHTML = addCommas( ctcNewThumbsUpCount );
				ratingUpElem.setAttribute(
					'data-type-thumupcount',
					ctcNewThumbsUpCount
				);
				ratingDownElem.innerHTML = addCommas( ctcNewThumbsDownCount );
				ratingDownElem.setAttribute(
					'data-type-thumdowncount',
					ctcNewThumbsDownCount
				);
				break;
			case 'thumbsDownReversed':
				ratingUpElem = document.querySelector(
					'#ctcThumbUpCount-' + postId
				);
				ratingDownElem = document.querySelector(
					'#ctcThumbDownCount-' + postId
				);
				ctcNewThumbsUpCount =
					parseInt(
						ratingUpElem.getAttribute( 'data-type-thumupcount' )
					) + 1;
				ctcNewThumbsDownCount =
					parseInt(
						ratingDownElem.getAttribute( 'data-type-thumdowncount' )
					) - 1;
				ratingUpElem.innerHTML = addCommas( ctcNewThumbsUpCount );
				ratingUpElem.setAttribute(
					'data-type-thumupcount',
					ctcNewThumbsUpCount
				);
				ratingDownElem.innerHTML = addCommas( ctcNewThumbsDownCount );
				ratingDownElem.setAttribute(
					'data-type-thumdowncount',
					ctcNewThumbsDownCount
				);
				break;
			case 'unThumbsUp':
				ratingUpElem = document.querySelector(
					'#ctcThumbUpCount-' + postId
				);
				ctcNewThumbsUpCount =
					parseInt(
						ratingUpElem.getAttribute( 'data-type-thumupcount' )
					) - 1;
				ratingUpElem.innerHTML = addCommas( ctcNewThumbsUpCount );
				ratingUpElem.setAttribute(
					'data-type-thumupcount',
					ctcNewThumbsUpCount
				);
				break;
			case 'unThumbsDown':
				ratingDownElem = document.querySelector(
					'#ctcThumbDownCount-' + postId
				);
				ctcNewThumbsDownCount =
					parseInt(
						ratingDownElem.getAttribute( 'data-type-thumdowncount' )
					) - 1;
				ratingDownElem.innerHTML = addCommas( ctcNewThumbsDownCount );
				ratingDownElem.setAttribute(
					'data-type-thumdowncount',
					ctcNewThumbsDownCount
				);
				break;
		}
	};

	/**
	 * number format
	 *
	 * @param nStr number to be formatted
	 * @returns formatted number
	 */
	const addCommas = ( nStr ) => {

         let x = [];
         let x1 = '';
         let x2 = '';

		nStr += '';
		x = nStr.split( '.' );
		x1 = x[ 0 ];
		x2 = x.length > 1 ? '.' + x[ 1 ] : '';
		var rgx = /(\d+)(\d{3})/;
		while ( rgx.test( x1 ) ) {
			x1 = x1.replace( rgx, '$1' + ',' + '$2' );
		}
		return x1 + x2;
	};

	let ratingArr = Array.from(
		document.querySelectorAll( [
			'.ctcThumbUp',
			'.ctcThumbDown',
			'.ctcUserThumbUp',
			'.ctcUserThumbDown',
		] )
	);
	ratingArr.map( ( x ) =>
		x.addEventListener( 'click', ( e ) => ratePost( e.target ) )
	);

	/**
	 *
	 * Script to display user who liked or disliked post
	 */

	/**
	 * Get users based on stat
	 * @param elClicked Clicked stat display
	 */

	const ctcDisplayUsers = ( elClicked ) => {
		overlay.createOverlay( {
			ajaxUrl: ctcRating.ctcRatingAjaxUrl,
			ajaxData:
				'action=ctcGetUsers&post_id=' +
				elClicked.getAttribute( 'data-post-id' ) +
				'&user_to_get=' +
				elClicked.getAttribute( 'data-get' ),
			ajaxMethod: 'POST',
			containerHt: 350,
			containerWd: 200,
		} );
	};

	/**
	 * Display users who rated post
	 *
	 */
	let statArr = Array.from(
		document.querySelectorAll( '.ctcThumbsUpStat,.ctcThumbsDownStat' )
	);

	statArr.map( ( x ) =>
		x.addEventListener( 'click', ( e ) => {
			let dataStatCount =
				'thumb-up-count' == e.target.getAttribute( 'data-get' )
					? e.target.getAttribute( 'data-type-thumupcount' )
					: e.target.getAttribute( 'data-type-thumdowncount' );

			if ( '0' != dataStatCount ) {
				ctcDisplayUsers( e.target );
			}
		} )
	);
} );
