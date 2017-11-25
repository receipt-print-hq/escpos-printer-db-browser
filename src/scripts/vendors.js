/* Printer vendors */
var vendor_model = Backbone.Model.extend({
  urlRoot: 'dist/data/vendors/',
  url: function() {
    return Backbone.Model.prototype.url.call(this) + '.json';
  },

  defaults: {
    name: '',
    profiles: []
  }
});

var vendor_collection = Backbone.Collection.extend({
	url : 'dist/data/vendors/index.json',
	model : vendor_model
});

var VendorDetailView = Backbone.View.extend({
  template: _.template($('#vendor-template-detail').html()),
  el: 'div#vendorTemplateDetail',

  initialize: function(options) {
    _.bindAll(this, 'render');
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var VendorRowView = Backbone.View.extend({
	template : _.template($('#vendor-template-row').html()),
	tagName : 'tr',

	initialize : function(options) {
		_.bindAll(this, 'render');
	},

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var VendorListView = Backbone.View.extend({
  collection: null,
  el: 'div#vendor-list',

  initialize: function(options) {
    this.collection = options.collection;
  },

  render: function() {
    var element = this.$el;
    element.empty();

    this.collection.forEach(function(item) {
      var itemView = new VendorRowView({
        model: item
      });
      element.append(itemView.template(itemView.model.toJSON()));
    });
    return this;
  }
});

function showVendorDetail(results) {
  tabTo('vendor');
  var vendorView = new VendorDetailView({
    model: results
  });
  vendorView.render();
}

function doLoadVendors(page) {
	var vendors = new vendor_collection();
	vendors.fetch({
		success : function(results) {
			var db = new VendorListView({
				collection : vendors
			});
			db.render();
		},
		error : function(model, response) {
			handleFailedRequest(response);
		}
	});
}

function vendor_name_to_id(name) {
  // map vendor name to filename to reques
  return name.replace(' ', '_');
}
