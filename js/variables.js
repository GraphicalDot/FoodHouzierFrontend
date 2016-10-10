$(document).ready(function(){
	App = {} ;
  window.App = App ;
	window.make_request = function make_request(data){ url =  window.process_text_url ; return $.post(url, {"text": data}) }
	window.BaseURL = "http://192.168.1.3:8000";
	window.URL = window.BaseURL+"/post_text";
  window.suggestions = window.BaseURL+"/suggestions";
  window.text_search = window.BaseURL+"/textsearch";
});
