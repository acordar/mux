var marvelDataSrc = "http://reader.marvel.com/issue/id/";
var dataSrcUrl = marvelDataSrc + window.location.hash.split("/")[2];

var mux = {
	nextIssue: {},
	fitW: false,
	fitH: true,
	unescapeHtml: function(safe) {
	    return safe.replace(/&amp;/g, '&')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&quot;/g, '"')
	        .replace(/&#039;/g, "'");		
	},
	setPageViewMode: function(mode) {
		switch(mode) {
			case 1:
				$('.one-page-pref')[0].click();
				break;
			case 2:
				$('.two-page-pref')[0].click();
		}
	},
	fitWidth: function()
	{
		this.fitW = true;
		this.fitH = false;
		$('.page-item').each(function(key, value){			
			$(this).removeClass('page-item');
			$(this).addClass('my-page-item');			
		});		
	},
	fitHeight: function()
	{
		this.fitH = true;
		this.fitW = false;
		$('.my-page-item').each(function(key, value){			
			$(this).removeClass('my-page-item');
			$(this).addClass('page-item');			
		});		
	},	
	keyDown: function(evt) {			
		switch(evt.keyCode)
		{
			case 72:
				if(evt.shiftKey) {
					if(mux.fitH){
						mux.fitWidth();
					} else {
						mux.fitHeight();
					}
				}
			break;
			case 87:
				if(evt.shiftKey) {					
					if(mux.fitW){
						mux.fitHeight();
					} else {
						mux.fitWidth();
					}
				}
			break;
			case 40:
				window.scroll(0,window.scrollY + (window.innerHeight*.10));		
			break;
			case 38:
				window.scroll(0,window.scrollY - (window.innerHeight*.10));		
			break;
			case 39:				
				window.scroll(0,0);
			break;
			case 37:
				window.scroll(0,0);
			break;
			case 49:
				if(evt.shiftKey) {					
					mux.setPageViewMode(1);
				}
			break;
			case 50:
				if(evt.shiftKey) {
					mux.setPageViewMode(2);
				}
			break;
		}				
	},
	scroll: function(evt) {
		window.scroll(0,window.scrollY+evt.deltaY);
	},
	getIssueData: function(url,callback) {
		$.getJSON(url, callback);
	},
	addNextIssueInfo: function(){
		$('.issue-info-general > h2').text(this.nextIssue.title);
		$('.issue-info-thumbnail > img').attr('src', this.nextIssue.thumbnail);
		$('.issue-info-creators').html('<a target="_blank" href="http://reader.marvel.com/#/issue/' + this.nextIssue.id + '" class="nextissuebutton">Read Now</a>');				
		$('.issue-info-description').html(this.unescapeHtml(this.nextIssue.description));		
	}
}

$(function(){		
	chrome.storage.sync.get({
		pageViewMode: 1,
		fitMode: 1
	}, function(items) {		
		var setOnePage = setInterval(function(){			
			if($('.page-item').length > 0 && $('.one-page-pref').length > 0) {							
				switch(items.fitMode) {
					case "0":					
						mux.fitWidth();
					break;
					case "1":
						mux.fitHeight();
					break;
				}						
				mux.setPageViewMode(parseInt(items.pageViewMode));		
				clearInterval(setOnePage);
			}
		},100);				
	});
	mux.getIssueData(dataSrcUrl, function(data){
		if(data.prev_next_issue.next.hasOwnProperty('id')) {
			mux.nextIssue = data.prev_next_issue.next;

			mux.getIssueData(marvelDataSrc+mux.nextIssue.id, function(data){
				mux.nextIssue.description = data.description;
			});
		}
	});

	var observer = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){		
			if($('body').hasClass('last-page') && mux.nextIssue.hasOwnProperty('id')) {
				mux.addNextIssueInfo();
			}
		});
	});
	observer.observe(document.getElementsByTagName('body')[0],{ attributes : true, attributeFilter : ['class'] });


	$("#next").on('click', function(){			
		window.scroll(0,0);
	});
	$("#prev").on('click', function(){
		window.scroll(0,0);
	});
	window.onkeydown = mux.keyDown;
	window.onmousewheel = mux.scroll;	

});
