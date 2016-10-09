$(document).ready(function(){
// Load template via ajax call

window.searchtype = ""
window.searchvalue = ""  
  
function loadTemplates(path){
  var tmpl_string;
  $.ajax({
      url: 'templates/'+path,
      method: 'GET',
      dataType: 'html',
      async: false,
      success: function(data) {
          tmpl_string = data;
      },
      error: function(data){
        console.log('[main.js: ln 100] **'+path+'** template not loaded');
      }
  });
  return tmpl_string;
}

App.RootView = Backbone.View.extend({
      template: loadTemplates('body.html'),
      initialize: function(options){
					var self = this;
          this.el = options.el
        },

      render: function(){
          //http://coenraets.org/blog/2011/12/tutorial-html-templates-with-mustache-js/
          //$("#main-container").html(Mustache.to_html(this.template));
          this.$el.html(Mustache.to_html(this.template));
           
					var options = {
                placeholder: "Search for eatery, dish or cuisine",
						    categories: [{listLocation: "dish",
                            maxNumberOfElements: 5,
                            header: "Matching dishes names"}, 
                        {listLocation: "eatery",
                            maxNumberOfElements: 5,
                            header: "Matching eateries names"},
                        {listLocation: "cuisine",
                            maxNumberOfElements: 4,
                            header: "Matching cuisine names"}],
                url: function(phrase) {
											console.log(phrase);
    									return "http://localhost:8000/suggestions";},
					      getValue: function(element) {
    							    return element.name;},
  				      ajaxSettings: {
    					        dataType: "json",
    					        method: "POST",
    					        data: {
      					        dataType: "json",}
  						    },
  				      preparePostData: function(data) {
    					        data.phrase = $("#autocomplete-ajax").val();
                      return data;
  					    },
						    requestDelay: 400,
						    theme: "plate-dark",
                
                list: {
              
                  onSelectItemEvent: function() {
                        window.searchtype = $("#autocomplete-ajax").getSelectedItemData().type;
                        window.searchvalue = $("#autocomplete-ajax").val();
                  }
                }
               
   
   
          };
					
					      $("#autocomplete-ajax").easyAutocomplete(options);
        return this;
	      },

			events: {
          'click .textsubmit': 'textSubmit',
          'click .surprisesubmit': 'surpriseSubmit',
						},


      surpriseSubmit: function(event){
          //This gets activated when clicked on the submit button, Now the
          //result will be based ont he text value available in class
          //cutomautocomplete
          ;event.preventDefault();
					;var subView = new App.AfterMainPageView();
          ;$("#main-container").html(subView.render().el)
          return

      },

      textSubmit: function(e){
            e.preventDefault();
            this.$("#sentences").html('<div class="progress #455a64 blue-grey darken-2"><div class="indeterminate"></div></div>')
						var text = $("#autocomplete-ajax").val();
            console.log(window.searchtype)
            console.log(window.searchvalue)

						var jqhr = $.post(window.text_search, {"text": window.searchvalue, type: window.searchtype})
						jqhr.done(function(data){
									if (data.success == true){
                        if (window.searchtype == "dish" || window.searchtype == "cuisine"){
					                  ;var subView = new App.DishSuggestionsResultView({"items": data.result});
                             ;$("#main-container").html(subView.render().el)
                   
                        } else {
					                  ;var subView = new App.EaterySuggestionsResultView({"items": data.result});
                            ;$("#main-container").html(subView.render().el)
                        };

                  }
                  else {
											Materialize.toast(data.message, 4000, 'rounded')
                      }
                })

						jqhr.fail(function(){
									Materialize.toast('Either the api or internet connection is not working, Sorry, Please try again later', 4000, 'rounded')
                        })
        },
});

App.EaterySuggestionsResultView = Backbone.View.extend({
        /*Redenred when a user search for the dish name on the search bar
         * or in other words in window.searchtype == "dish" or 
         * if searchtype is type cuisine, only in the case if eatery the result 
         * would be different then these two above mentioned cases 
         */
        tagName: "div",
        template: loadTemplates('eateryDetails.html'),
        initialize: function(options){
            this.model = options;
            console.log(this.model);
        },

        render: function(){
              this.$el.html(Mustache.to_html(this.template, this.model));
              return this;
        },
			events: {
          'click .querysubmit': 'textSubmit',
						},
})
App.DishSuggestionsResultView = Backbone.View.extend({
        /*Redenred when a user search for the dish name on the search bar
         * or in other words in window.searchtype == "dish" or 
         * if searchtype is type cuisine, only in the case if eatery the result 
         * would be different then these two above mentioned cases 
         */
        tagName: "div",
        className: "afterBody",
        template: loadTemplates('dishSuggestions.html'),
        initialize: function(options){
            this.model = options;
            console.log(this.model);
        },

        render: function(){
              this.$el.html(Mustache.to_html(this.template, this.model));
              return this;
        },
			events: {
          'click .querysubmit': 'textSubmit',
						},
})

App.CardView = Backbone.View.extend({
        //meant for each noun phrase and place name
        tagName: "div",
        className: "row",
        template: loadTemplates('nounPhrase.html'),
        initialize: function(options){
              this.model = options.model;
              // console.log(this.model) ;
        },

        render: function(){
              var self = this;
              this.$el.html(Mustache.to_html(this.template, self.model));
              return this;
        },

});


App.IntermediatePerSentenceView = Backbone.View.extend({
        tagName: "ul",
        className: "collection",
        initialize: function(options){
              this.model = options.model

        },

        render: function(){
              var self = this;
              $.each(this.model, function(index, result_object){
										var subView = new App.PerSentenceView({model: result_object});
                    self.$el.append(subView.render().el)
              })
              return this;
        },

});
App.PerSentenceView = Backbone.View.extend({
        tagName: "li",
        className: "collection-item",
        // template: $("#perSentenceTemplate").html(),
        template: loadTemplates('perSentence.html'),
        initialize: function(options){
              this.model = options.model
              console.log(this.model.sentence);

        },

        render: function(){
              var self = this;
              this.$el.html(Mustache.to_html(this.template, self.model));
              return this;
        },

});
});
