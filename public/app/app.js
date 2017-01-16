define([
    'backbone',
    'marionette',

    'router',
    'view/layout'
], function (Backbone, Marionette, Router, Layout) {

    var testData = [{
        "name": "Dusty Path",
        "username": "Simone3",
        "rating": 2.3,
        "favorites": 10,
        "visits": 30,
        "difficulty": 2,
        "terrain": 3,
        "size": "small",
        "created": "October 19, 2014",
        "updated": "February 8, 2016",
        "coords": "21.6370 70.0042"
    }, {
        "name": "Green Walkway",
        "username": "Reanna39",
        "rating": 0.8,
        "favorites": 7,
        "visits": 91,
        "difficulty": 4,
        "terrain": 4,
        "size": "large",
        "created": "November 14, 2016",
        "updated": "December 19, 2016",
        "coords": "-89.2494 -167.4357"
    }, {
        "name": "Old Path",
        "username": "Tia.Littel",
        "rating": 3,
        "favorites": 36,
        "visits": 540,
        "difficulty": 3,
        "terrain": 5,
        "size": "big",
        "created": "August 20, 2015",
        "updated": "July 18, 2016",
        "coords": "88.5891 -53.9392"
    }, {
        "name": "Orange Shady Route",
        "username": "Graham56",
        "rating": 1.5,
        "favorites": 11,
        "visits": 88,
        "difficulty": 3,
        "terrain": 5,
        "size": "medium",
        "created": "February 25, 2015",
        "updated": "May 23, 2016",
        "coords": "-72.0367 -37.5478"
    }, {
        "name": "Blue Historic Trail",
        "username": "Dannie61",
        "rating": 2.4,
        "favorites": 10,
        "visits": 80,
        "difficulty": 1,
        "terrain": 4,
        "size": "big",
        "created": "May 5, 2015",
        "updated": "January 25, 2016",
        "coords": "63.4708 -16.7818"
    }, {
        "name": "Red Dusty Walkway",
        "username": "Demetris.Goyette49",
        "rating": 0.4,
        "favorites": 2,
        "visits": 28,
        "difficulty": 5,
        "terrain": 3,
        "size": "mini",
        "created": "December 28, 2014",
        "updated": "July 7, 2016",
        "coords": "7.4889 -15.0209"
    }, {
        "name": "Green Shady Path",
        "username": "Kory_Sawayn",
        "rating": 0.7,
        "favorites": 3,
        "visits": 45,
        "difficulty": 2,
        "terrain": 3,
        "size": "large",
        "created": "October 12, 2016",
        "updated": "January 11, 2017",
        "coords": "29.4975 -64.0485"
    }, {
        "name": "Red Old Route",
        "username": "Dustin_Pollich20",
        "rating": 2.4,
        "favorites": 3,
        "visits": 27,
        "difficulty": 5,
        "terrain": 1,
        "size": "medium",
        "created": "May 15, 2015",
        "updated": "December 27, 2015",
        "coords": "-62.5381 -7.9794"
    }];



    //APP OBJECTS
    var MyApp = new Marionette.Application();

    var MyAppRouter = Backbone.Router.extend({
        routes: {
            '': 'showIndex',
            'products': 'showProductList',
            'products/:id': 'showProductDetail'
        },
        showIndex: function () {
            MyApp.AppController.showIndex();
        },
        showProductList: function () {
            MyApp.AppController.showProductList();
        },
        showProductDetail: function () {
            MyApp.AppController.showProductDetail();
        }
    });

    var MyAppController = Marionette.Controller.extend({
        showIndex: function () {
            MyApp.mainRegion.show(new IndexView());
        },
        showProductList: function () {
            var productListView = new ProductListView({
                collection: new Backbone.Collection(testData)
            });
            MyApp.mainRegion.show(productListView);
            MyApp.AppRouter.navigate('products');
        },
        showProductDetail: function (id) {
            var layout = new ProductLayoutView();
            MyApp.mainRegion.show(layout);
            layout.summary.show(new ProductSummaryView());
            layout.detail.show(new ProductDetailView());
            MyApp.AppRouter.navigate('products/'+id);
        }
    });

    //INITIALIZER
    MyApp.addInitializer(function () {
        MyApp.addRegions({
            mainRegion: '#app'
        });
        MyApp.AppController = new MyAppController();
        MyApp.AppRouter = new MyAppRouter();
        Backbone.history.start();
    });


    //DATA
    var Product = Backbone.Model.extend({
        url: 'https://randomapi.com/api/5d1d4220d61636cf89dc11e44d564295',
        validate: function (atts, opts) {
            if(!(atts.username)){
                return "Need a username defined!";
            }
        },
        initialize: function () {
            this.on('invalid', function (model) {
                alert(model.validationError);
            });
        }
    });

    var Products = Backbone.Collection.extend({
        model: Product,
        url: 'https://randomapi.com/api/5d1d4220d61636cf89dc11e44d564295?results=7',
        parse: function (response) {
            response = response['results'];
            return response;
        }
    });

    //VIEWS
    var IndexView = Marionette.ItemView.extend({
        template: '#index-template',
        events: {
            'click #nav-products-list': 'showProductList'
        },
        showProductList: function (evnt) {
            evnt.preventDefault();
            MyApp.AppController.showProductList();
        }
    });


    var ProductLayoutView = Marionette.LayoutView.extend({
        template: "#product-layout-template",
        regions: {
            summary: "#summary",
            detail: "#detail"
        }
    });

    var ProductSummaryView = Marionette.ItemView.extend({
        template: "#product-summary-template"
    });
    var ProductDetailView = Marionette.ItemView.extend({
        template: "#product-detail-template"
    });

    var ProductItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: _.template("<td><a href='#'><%=username%></a></td>"),
        events: {
            "click a": "showProductDetail"
        },
        showProductDetail: function (evnt) {
            evnt.preventDefault();
            MyApp.AppController.showProductDetail(this.model.id);
        }

    });

    var ProductListView = Marionette.CollectionView.extend({
        tagName: 'table',
        className: 'table',
        childView: ProductItemView,
        onBeforeRender: function () {
            this.$el.append("<h2>Product List</h2>");
        }
    });

    return MyApp;
// MyApp = {
//     init: function () {
//         this.appView = new AppView({el: '#app'});
//         this.products = new Products();
//     },
//     start: function () {
//         // Backbone.history.start();
//         var productsView = new ProductsView({collection: this.products});
//         this.appView.show(productsView);
//         //start the fun
//         this.products.fetch();
//     }
//
// };
//
// var AppView = Backbone.View.extend({
//     show: function (childView) {
//         this.$el.append(childView.el);
//     }
// });
//
// var Product = Backbone.Model.extend({
//     url: 'https://randomapi.com/api/5d1d4220d61636cf89dc11e44d564295'
// });
//
// var Products = Backbone.Collection.extend({
//     model: Product,
//     url: 'https://randomapi.com/api/5d1d4220d61636cf89dc11e44d564295?results=7',
//     parse: function (response) {
//         response = response['results'];
//         return response;
//     }
// });
//
// var ProductView = Backbone.View.extend({
//     tagName: 'li',
//     render: function () {
//         //grab template
//         var template = $('#product-template').html();
//         //compile
//         var compiled = _.template(template, this.model.toJSON());
//         //inject it
//         // console.log(compiled);
//         this.$el.append(compiled);
//         // console.log(this);
//         return this;
//     }
// });
//
// var ProductsView = Backbone.View.extend({
//     tagName: 'ul',
//     initialize: function () {
//         this.collection.on('sync', this.render, this);
//     },
//     render: function () {
//         var myEl = this.$el;
//         this.collection.each(function (item) {
//             var productView = new ProductView({model: item});
//             var rendered = productView.render();
//             myEl.append(rendered);
//         });
//         console.log(myEl);
//         return myEl;
//     }
// });


// var App = new Marionette.Application();
//
// App.addRegions({
//     mainRegion: "#main"
// });
//
// App.addInitializer(function (options) {
//
//     require(['controller'], function (Controller) {
//
//         App.appRouter = new Router({
//             controller: new Controller()
//         });
//
//         Backbone.history.start();
//     });
//
//     App.layout = new Layout();
//     App.mainRegion.show(App.layout);
// });
//
// return App;
})
;