window.CollectionModel = Backbone.Model.extend({
  url: function () {
    return '/search/'+this.get('name')+'?find={}';
    //If plugin name and collection name are the same, just one is required
    // return this.get('plugin') === this.get('name') ? '/' + this.get('plugin') + '/' + this.get("name") : ;
  },
  getItemById: function (id) {
    var _items = this.get('results');
    var _item;
    _.each(this.get('results'), function (item, index, list){
      if (item._id === id) {
        _item = item;
        return;
      }
    });
    return _item || false;
  },
  parse: function (response) {
    return {results: response.results};
  }
});