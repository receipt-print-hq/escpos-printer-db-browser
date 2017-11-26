/* Text encodings */
var encoding_model = Backbone.Model.extend({
  urlRoot: 'dist/data/encodings/',
  url: function() {
    return Backbone.Model.prototype.url.call(this) + '.json';
  },

  defaults: {
    name: '',
    data: null,
    iconv: null,
    python_encode: null,
    profiles: []
  }
});

var encoding_collection = Backbone.Collection.extend({
  url: 'dist/data/encodings/index.json',
  model: encoding_model
});


var EncodingDetailView = Backbone.View.extend({
  template: _.template($('#encoding-template-detail').html()),
  el: 'div#encodingTemplateDetail',

  initialize: function(options) {
    _.bindAll(this, 'render');
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var EncodingRowView = Backbone.View.extend({
	template : _.template($('#encoding-template-row').html()),
	tagName : 'tr',

	initialize : function(options) {
		_.bindAll(this, 'render');
	},

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var EncodingListView = Backbone.View.extend({
  collection: null,
  el: 'div#encoding-list',

  initialize: function(options) {
    this.collection = options.collection;
  },

  render: function() {
    var element = this.$el;
    element.empty();

    this.collection.forEach(function(item) {
      var itemView = new EncodingRowView({
        model: item
      });
      element.append(itemView.template(itemView.model.toJSON()));
    });
    return this;
  }
});

function showEncodingDetail(results) {
  tabTo('encoding');
  var encodingView = new EncodingDetailView({
    model: results
  });
  encodingView.render();
}

function doLoadEncodings(page) {
  var encodings = new encoding_collection();
  encodings.fetch({
    success: function(results) {
      var db = new EncodingListView({
        collection: encodings
      });
      db.render();
    },
    error: function(model, response) {
      handleFailedRequest(response);
    }
  });
}
