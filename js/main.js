$(document).ready(function(){
// Load template via ajax call
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
          self.$('.dropdown-button').dropdown({
									inDuration: 300,
									outDuration: 225,
									constrain_width: false, // Does not change width of dropdown to that of the activator
									hover: true, // Activate on hover
									gutter: 0, // Spacing from edge
									belowOrigin: false, // Displays dropdown below the button
									alignment: 'left' // Displays dropdown with edge aligned to the left of button
    																		});

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
						var text = $(".textProcessing").val();

						var jqhr = $.post(window.URL, {"text": text})
						jqhr.done(function(data){
									if (data.success == true){

                          self.$("#sentences").html("")
                          $.each(data.noun_phrases, function(index, title){
										              var subView = new App.CardView({model: {"title": title}});
                                self.$("#sentences").append(subView.render().el)
                            })
                          var subView = new App.IntermediatePerSentenceView({"model": data.result})
                                  self.$("#sentences").append(subView.render().el);

                          //var subView = new App.PerSentenceView({model: {"result": data.result, "sentence": sentence, "grams": grams, parent: self}});
													//self.$el.after(subView.render().el);
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

App.AfterMainPageView = Backbone.View.extend({
        tagName: "div",
        className: "afterBody",
        template: loadTemplates('afterBody.html'),
        initialize: function(){
          this.model = {items:[
            {'name':'Pixel', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}
            ,{'name':'Pixel XL', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}
            ,{'name':'Pixel XL CHUU', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}
            ,{'name':'Pixel XL MA', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}
            ,{'name':'Pixel XL KI', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}
            ,{'name':'Pixel XL CHUU', 'display':'5.0 inches FHD AMOLED at 441ppi 2.5D Corning® Gorilla® Glass 4 >75% Active Area',
            'size': '5.6 x 2.7 x 0.2 ~ 0.3 143.8 x 69.5 x 7 .3 ~ 8.5 mm', 'battery': '2,770 mAh battery Audio playback (via headset): up to 110 hours Fast charging up to 7 hours of use from only 15 minutes of charging'}

          ]}
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
