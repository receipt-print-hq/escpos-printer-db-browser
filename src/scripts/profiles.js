/* Printer profiles */
var profile_model = Backbone.Model.extend({
  urlRoot: 'dist/data/profiles/',
  url: function() {
    return Backbone.Model.prototype.url.call(this) + '.json';
  },

  defaults: {
    codePages: {},
    colors: {},
    features: {},
    fonts: {},
    media: {},
    name: '',
    notes: '',
    vendor: ''
  }
});

var profile_collection = Backbone.Collection.extend({
	url : 'dist/data/profiles/index.json',
	model : profile_model
});

var ProfileDetailView = Backbone.View.extend({
  template: _.template($('#profile-template-detail').html()),
  el: 'div#profileTemplateDetail',

  initialize: function(options) {
    _.bindAll(this, 'render');
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var ProfileRowView = Backbone.View.extend({
	template : _.template($('#profile-template-row-tr').html()),
	tagName : 'tr',

	initialize : function(options) {
		_.bindAll(this, 'render');
	},

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var ProfileTableView = Backbone.View.extend({
  collection: null,
  el: 'tbody#profile-tbody',

  initialize: function(options) {
    this.collection = options.collection;
  },

  render: function() {
    var element = this.$el;
    element.empty();

    this.collection.forEach(function(item) {
      var itemView = new ProfileRowView({
        model: item
      });
      element.append(itemView.template(itemView.model.toJSON()));
    });
    return this;
  }
});

function showProfileDetail(results) {
  tabTo('profile');
  //$('#profileList').hide();
  var profileView = new ProfileDetailView({
    model: results
  });
  profileView.render();
}

function doLoadProfiles(page) {
	var profiles = new profile_collection();
	profiles.fetch({
		success : function(results) {
			var db = new ProfileTableView({
				collection : profiles
			});
			db.render();
		},
		error : function(model, response) {
			handleFailedRequest(response);
		}
	});
}
