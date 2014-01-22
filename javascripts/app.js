(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, Loans, People, config, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

People = require('models/people');

Loans = require('models/loans');

config = require('config');

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.start = function() {
    Chaplin.mediator.people.fetch();
    Chaplin.mediator.loans.fetch();
    return Application.__super__.start.apply(this, arguments);
  };

  Application.prototype.initMediator = function() {
    Chaplin.mediator.people = new People;
    Chaplin.mediator.loans = new Loans;
    return Application.__super__.initMediator.apply(this, arguments);
  };

  Application.prototype.initRouter = function(routes, options) {
    options.root = config.root;
    return Application.__super__.initRouter.apply(this, arguments);
  };

  return Application;

})(Chaplin.Application);
});

;require.register("config", function(exports, require, module) {
module.exports = {"root":"/LoanShark/"}
});

;require.register("controllers/base/controller", function(exports, require, module) {
var Controller, HeaderView, Loans, People, SiteView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SiteView = require('views/layout/site-view');

People = require('models/people');

Loans = require('models/loans');

HeaderView = require('views/layout/header-view');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller() {
    _ref = Controller.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Controller.prototype.beforeAction = function() {
    this.reuse('site', SiteView);
    return this.reuse('header', HeaderView, {
      region: 'header'
    });
  };

  Controller.prototype.findOrFetch = function(id, collection, klass, cb) {
    var model,
      _this = this;
    if (id) {
      model = collection.get(id);
      if (model) {
        return cb(model);
      } else {
        return collection.fetch({
          success: function(collection) {
            model = collection.get(id);
            return cb(model);
          }
        });
      }
    } else {
      model = new klass;
      return cb(model);
    }
  };

  Controller.prototype.udpateModel = function(model, collection, options) {
    var _this = this;
    if (model.isNew()) {
      collection.add(model);
    }
    model.set('updated_at', new Date);
    return model.save(model.attributes, {
      success: function(model, attrs) {
        if (options.success) {
          return options.success(model);
        }
      },
      error: function(model, err) {
        if (options.error) {
          return options.error(model, err);
        }
      }
    });
  };

  return Controller;

})(Chaplin.Controller);
});

;require.register("controllers/loans-controller", function(exports, require, module) {
var Controller, Loan, LoanEditView, LoansController, LoansView, loans, people, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controllers/base/controller');

Loan = require('models/loan');

LoansView = require('views/loans/loans-view');

LoanEditView = require('views/loans/loan-edit-view');

loans = Chaplin.mediator.loans;

people = Chaplin.mediator.people;

module.exports = LoansController = (function(_super) {
  __extends(LoansController, _super);

  function LoansController() {
    _ref = LoansController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoansController.prototype.initialize = function() {
    LoansController.__super__.initialize.apply(this, arguments);
    return this.subscribeEvent('saveLoan', this.update);
  };

  LoansController.prototype.index = function() {
    this.adjustTitle('');
    return this.view = new LoansView({
      region: 'main',
      collection: loans,
      detailed: true
    });
  };

  LoansController.prototype.edit = function(params) {
    var _this = this;
    return this.findOrFetch(params.id, loans, Loan, function(model) {
      if (params.id) {
        _this.adjustTitle("Edit " + (model.get('item_name')) + " loan");
      } else {
        _this.adjustTitle("New loan");
      }
      if (params.person_id) {
        model.set('lendee_id', params.person_id);
      }
      return _this.view = new LoanEditView({
        model: model,
        region: 'main'
      });
    });
  };

  LoansController.prototype.update = function(model, success, error) {
    var item_name, message,
      _this = this;
    item_name = model.get('item_name');
    model = loans.add(model);
    if (model.isNew()) {
      message = "Successfully loaned out " + item_name + ".";
    } else {
      message = "Successfully edited the loan for " + item_name;
    }
    model.set('updated_at', new Date);
    return model.save(model.attributes, {
      success: function(model, attrs) {
        if (success) {
          success(model);
        }
        _this.redirectTo('home');
        return _this.publishEvent('flash_message', message);
      },
      error: function(model, err) {
        if (error) {
          return error(model, err);
        }
      }
    });
  };

  return LoansController;

})(Controller);
});

;require.register("controllers/people-controller", function(exports, require, module) {
var Controller, LoansController, People, PeopleView, Person, PersonDetailView, PersonEditView, loans, people, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controllers/base/controller');

Person = require('models/person');

People = require('models/people');

PeopleView = require('views/people/people-view');

PersonDetailView = require('views/people/person-detail-view');

PersonEditView = require('views/people/person-edit-view');

loans = Chaplin.mediator.loans;

people = Chaplin.mediator.people;

module.exports = LoansController = (function(_super) {
  __extends(LoansController, _super);

  function LoansController() {
    _ref = LoansController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoansController.prototype.initialize = function() {
    LoansController.__super__.initialize.apply(this, arguments);
    this.subscribeEvent('savePerson', this.update);
    return this.subscribeEvent('destroyPerson', this.destroy);
  };

  LoansController.prototype.index = function() {
    this.adjustTitle("People");
    return this.view = new PeopleView({
      region: 'main',
      collection: people
    });
  };

  LoansController.prototype.edit = function(params) {
    var _this = this;
    return this.findOrFetch(params.id, people, Person, function(model) {
      if (params.id) {
        _this.adjustTitle("Edit " + (model.full_name()));
      } else {
        _this.adjustTitle("New Person");
      }
      return _this.view = new PersonEditView({
        model: model,
        region: 'main',
        collection: people
      });
    });
  };

  LoansController.prototype.update = function(model, success, error) {
    var message, name,
      _this = this;
    name = model.get('first_name') + " " + model.get('last_name');
    if (model.isNew()) {
      message = "Successfully added " + name;
    } else {
      message = "Successfully edited " + name;
    }
    return this.udpateModel(model, people, {
      success: function(model) {
        _this.redirectTo('person', {
          id: model.get('id')
        });
        return _this.publishEvent('flash_message', message);
      },
      error: function(model, err) {
        console.log(err);
        return _this.publishEvent('error', err);
      }
    });
  };

  LoansController.prototype.show = function(params) {
    var _this = this;
    return this.findOrFetch(params.id, people, Person, function(model) {
      _this.adjustTitle("" + (model.full_name()));
      return _this.view = new PersonDetailView({
        model: model,
        region: 'main'
      });
    });
  };

  LoansController.prototype.destroy = function(model) {
    var _this = this;
    model = people.get(model);
    return model.destroy({
      success: function() {
        var message;
        message = "" + (model.get('first_name')) + " was sucessfully removed";
        _this.redirectTo('people');
        return _this.publishEvent('flash_message', message);
      }
    });
  };

  return LoansController;

})(Controller);
});

;require.register("initialize", function(exports, require, module) {
var Application, routes;

Application = require('application');

routes = require('routes');

document.onreadystatechange = function() {
  if (document.readyState === "complete" || document.readyState === "loaded") {
    return new Application({
      title: 'Loan Shark',
      controllerSuffix: '-controller',
      routes: routes
    });
  }
};
});

;require.register("lib/utils", function(exports, require, module) {
var utils;

utils = Chaplin.utils.beget(Chaplin.utils);

if (typeof Object.seal === "function") {
  Object.seal(utils);
}

module.exports = utils;
});

;require.register("lib/view-helper", function(exports, require, module) {
jade.helpers = {
  url: function(routeName, params) {
    return Chaplin.utils.reverse(routeName, params);
  }
};
});

;require.register("mediator", function(exports, require, module) {
var mediator;

mediator = module.exports = Chaplin.mediator;
});

;require.register("models/base/collection", function(exports, require, module) {
var Collection, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('./model');

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Collection.prototype.model = Model;

  return Collection;

})(Chaplin.Collection);
});

;require.register("models/base/model", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.idAttribute = 'id';

  return Model;

})(Chaplin.Model);
});

;require.register("models/flash-message", function(exports, require, module) {
var FlashMessage, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('./base/model');

module.exports = FlashMessage = (function(_super) {
  __extends(FlashMessage, _super);

  function FlashMessage() {
    _ref = FlashMessage.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FlashMessage.prototype.defaults = {
    message: "Something needs your attention",
    lifespan: 5000
  };

  return FlashMessage;

})(Model);
});

;require.register("models/item", function(exports, require, module) {
var Item, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('/models/base/model');

module.exports = Item = (function(_super) {
  __extends(Item, _super);

  function Item() {
    _ref = Item.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Item;

})(Model);
});

;require.register("models/loan", function(exports, require, module) {
var Loan, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('/models/base/model');

module.exports = Loan = (function(_super) {
  __extends(Loan, _super);

  function Loan() {
    _ref = Loan.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Loan.prototype.defaults = {
    type: 'loan',
    reconciled: false
  };

  Loan.prototype.reconcile = function() {
    this.set('reconciled', true);
    this.set('date_reconciled', new Date);
    return this.save();
  };

  Loan.prototype.unreconcile = function() {
    this.set('reconciled', false);
    this.unset('date_reconciled');
    return this.save();
  };

  Loan.prototype.save = function() {
    this.updateBounties();
    return Loan.__super__.save.apply(this, arguments);
  };

  Loan.prototype.destroy = function() {
    Loan.__super__.destroy.apply(this, arguments);
    return this.updateBounties();
  };

  Loan.prototype.updateBounties = function() {
    var lendee, people;
    people = Chaplin.mediator.people;
    lendee = people.get(this.get('lendee_id'));
    return lendee.calculateBounty();
  };

  return Loan;

})(Model);
});

;require.register("models/loans", function(exports, require, module) {
var Collection, Loan, Loans, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Collection = require('/models/base/collection');

Loan = require('/models/loan');

module.exports = Loans = (function(_super) {
  __extends(Loans, _super);

  function Loans() {
    _ref = Loans.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Loans.prototype.model = Loan;

  Loans.prototype.fallbackSelector = '.empty';

  Loans.prototype.localStorage = new Backbone.LocalStorage("loan_shark-loans");

  Loans.prototype.initialize = function() {
    Loans.__super__.initialize.apply(this, arguments);
    return this.listenTo(this, 'change', this.sort);
  };

  Loans.prototype.comparator = function(a, b) {
    if (a.get('reconciled')) {
      return 1;
    } else {
      return -1;
    }
  };

  return Loans;

})(Collection);
});

;require.register("models/people", function(exports, require, module) {
var Collection, People, Person, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Collection = require('/models/base/collection');

Person = require('/models/person');

module.exports = People = (function(_super) {
  __extends(People, _super);

  function People() {
    _ref = People.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  People.prototype.model = Person;

  People.prototype.localStorage = new Backbone.LocalStorage("loan_shark-people");

  People.prototype.initialize = function() {
    People.__super__.initialize.apply(this, arguments);
    return this.subscribeEvent('lendee_change', this.recalcBounty);
  };

  People.prototype.recalcBounty = function(person) {
    person = this.get(person);
    return this.get(person).calculateBounty();
  };

  return People;

})(Collection);
});

;require.register("models/person", function(exports, require, module) {
var Model, Person, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('/models/base/model');

module.exports = Person = (function(_super) {
  __extends(Person, _super);

  function Person() {
    _ref = Person.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Person.prototype.defaults = {
    type: 'person',
    first_name: '',
    last_name: '',
    bounty: 0
  };

  Person.prototype.calculateBounty = function() {
    var loans, total, values;
    loans = Chaplin.mediator.loans.where({
      lendee_id: this.get('id'),
      reconciled: false
    });
    values = loans.map(function(l) {
      return parseFloat(l.get('value'));
    });
    if (values.length === 0) {
      total = 0;
    } else {
      total = values.reduce(function(memo, val) {
        return memo + val;
      });
    }
    this.set('bounty', total);
    return this.save();
  };

  Person.prototype.full_name = function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  };

  Person.prototype.destroy = function() {
    var loan, loans, _i, _len;
    loans = Chaplin.mediator.loans.where({
      lendee_id: this.get('id')
    });
    for (_i = 0, _len = loans.length; _i < _len; _i++) {
      loan = loans[_i];
      loan.destroy();
    }
    return Person.__super__.destroy.apply(this, arguments);
  };

  return Person;

})(Model);
});

;require.register("models/value-calculator", function(exports, require, module) {
var ValueCalculator;

module.exports = ValueCalculator = (function() {
  function ValueCalculator() {}

  return ValueCalculator;

})();
});

;require.register("routes", function(exports, require, module) {
module.exports = function(match) {
  match('', 'loans#index', {
    name: 'home'
  });
  match('loans', 'loans#index', {
    name: 'loans'
  });
  match('loans/new', 'loans#edit', {
    name: 'new_loan'
  });
  match('loans/:id/edit', 'loans#edit', {
    name: 'edit_loan'
  });
  match('people', 'people#index', {
    name: 'people'
  });
  match('people/new', 'people#edit', {
    name: 'new_person'
  });
  match('people/:id', 'people#show', {
    name: 'person'
  });
  match('people/:id/edit', 'people#edit', {
    name: 'edit_person'
  });
  return match('people/:person_id/loans/new', 'loans#edit', {
    name: 'person_new_loan'
  });
};
});

;require.register("views/base/collection-view", function(exports, require, module) {
var CollectionView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./view');

module.exports = CollectionView = (function(_super) {
  __extends(CollectionView, _super);

  function CollectionView() {
    _ref = CollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

  CollectionView.prototype.animationDuration = 0;

  return CollectionView;

})(Chaplin.CollectionView);
});

;require.register("views/base/view", function(exports, require, module) {
var View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/view-helper');

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.optionNames = Chaplin.View.prototype.optionNames.concat(['template']);

  View.prototype.autoRender = true;

  View.prototype.autoBind = true;

  View.prototype.listen = {
    "change model": "updateView"
  };

  View.prototype.getTemplateFunction = function() {
    return this.template;
  };

  View.prototype.render = function() {
    View.__super__.render.apply(this, arguments);
    if (this.model) {
      this.attr_names = Object.keys(this.model.attributes);
      if (this.autoBind) {
        return this.updateView();
      }
    }
  };

  View.prototype.updateView = function() {
    var attr_name, input_el, text, _i, _len, _ref1, _results;
    _ref1 = this.attr_names;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      attr_name = _ref1[_i];
      input_el = this.el.querySelector("[name='" + attr_name + "']");
      if (input_el) {
        input_el.value = this.model.get(attr_name);
      }
      text = this.el.querySelector("[data-bind='" + attr_name + "']");
      if (text) {
        _results.push(text.innerHTML = this.model.get(attr_name));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  View.prototype.save = function(e, success, error) {
    var el, input_els, _i, _j, _len, _len1, _ref1, _ref2,
      _this = this;
    input_els = [];
    _ref1 = this.el.getElementsByTagName("input");
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      el = _ref1[_i];
      input_els.push(el);
    }
    _ref2 = this.el.getElementsByTagName("select");
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      el = _ref2[_j];
      input_els.push(el);
    }
    input_els.forEach(function(el) {
      var name;
      name = el.getAttribute('name');
      return _this.model.set(name, el.value, {
        silent: true
      });
    });
    return this.publishEvent("save" + this.model.constructor.name, this.model);
  };

  View.prototype.destroy = function(e, success, error) {
    e.preventDefault();
    return this.publishEvent("destroy" + this.model.constructor.name, this.model);
  };

  return View;

})(Chaplin.View);
});

;require.register("views/form_elements/select-input-view", function(exports, require, module) {
var CollectionView, SelectInputView, SelectOptionView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('views/base/collection-view');

SelectOptionView = require('./select-option-view');

module.exports = SelectInputView = (function(_super) {
  __extends(SelectInputView, _super);

  function SelectInputView() {
    _ref = SelectInputView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SelectInputView.prototype.autoRender = true;

  SelectInputView.prototype.tagName = 'select';

  SelectInputView.prototype.animationDuration = 0;

  SelectInputView.prototype.initialize = function(options) {
    SelectInputView.__super__.initialize.apply(this, arguments);
    this.value_attr = options.value_attr;
    this.label_attr = options.label_attr;
    this.name = options.name;
    return this.placeholder = options.placeholder;
  };

  SelectInputView.prototype.render = function() {
    SelectInputView.__super__.render.apply(this, arguments);
    this.el.name = this.name;
    return this.el.placeholder = this.placeholder;
  };

  SelectInputView.prototype.initItemView = function(model) {
    return new SelectOptionView({
      model: model,
      value_attr: this.value_attr,
      label_attr: this.label_attr,
      src_model: this.model,
      name: this.name
    });
  };

  return SelectInputView;

})(CollectionView);
});

;require.register("views/form_elements/select-option-view", function(exports, require, module) {
var SelectOptionView, View, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

template = require('./templates/option');

module.exports = SelectOptionView = (function(_super) {
  __extends(SelectOptionView, _super);

  function SelectOptionView() {
    _ref = SelectOptionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SelectOptionView.prototype.autoRender = true;

  SelectOptionView.prototype.tagName = 'option';

  SelectOptionView.prototype.initialize = function(options) {
    SelectOptionView.__super__.initialize.apply(this, arguments);
    this.src_model = options.src_model;
    this.name = options.name;
    this.value_attr = options.value_attr;
    if (typeof this.value_attr === 'function') {
      this.value_attr = this.value_attr();
    }
    this.label_attr = options.label_attr;
    if (typeof this.label_attr === 'function') {
      return this.label_attr = this.label_attr();
    }
  };

  SelectOptionView.prototype.render = function() {
    SelectOptionView.__super__.render.apply(this, arguments);
    this.el.value = this.model.get(this.value_attr);
    this.el.innerHTML = this.label_attr;
    if (this.model.get(this.value_attr) === this.src_model.get(this.name)) {
      return this.el.selected = true;
    }
  };

  return SelectOptionView;

})(View);
});

;require.register("views/form_elements/templates/option", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),first_name = locals_.first_name,last_name = locals_.last_name;
buf.push((jade.escape(null == (jade.interp = first_name) ? "" : jade.interp)) + "&nbsp;" + (jade.escape(null == (jade.interp = last_name) ? "" : jade.interp)));;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/items/item-collection-view", function(exports, require, module) {
var CollectionView, ItemCollectionView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('views/base/collection-view');

module.exports = ItemCollectionView = (function(_super) {
  __extends(ItemCollectionView, _super);

  function ItemCollectionView() {
    _ref = ItemCollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return ItemCollectionView;

})(CollectionView);
});

;require.register("views/items/item-edit-view", function(exports, require, module) {
var ItemEditView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = ItemEditView = (function(_super) {
  __extends(ItemEditView, _super);

  function ItemEditView() {
    _ref = ItemEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ItemEditView.prototype.template = require('./templates/item-edit');

  return ItemEditView;

})(View);
});

;require.register("views/items/templates/item-edit", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1>Hello</h1>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/layout/flash-message-view", function(exports, require, module) {
var FlashMessageView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = FlashMessageView = (function(_super) {
  __extends(FlashMessageView, _super);

  function FlashMessageView() {
    _ref = FlashMessageView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FlashMessageView.prototype.autoRender = true;

  FlashMessageView.prototype.autoAttach = true;

  FlashMessageView.prototype.template = require('./templates/flash-message');

  FlashMessageView.prototype.className = 'flash';

  FlashMessageView.prototype.events = {
    'click .dismiss': 'dismissFlash'
  };

  FlashMessageView.prototype.initialize = function() {
    FlashMessageView.__super__.initialize.apply(this, arguments);
    return this.subscribeEvent('dismissFlash', this.dismissFlash);
  };

  FlashMessageView.prototype.render = function() {
    var lifespan,
      _this = this;
    FlashMessageView.__super__.render.apply(this, arguments);
    return lifespan = setTimeout(function() {
      _this.dismissFlash();
      return clearTimeout(lifespan);
    }, this.model.get('lifespan'));
  };

  FlashMessageView.prototype.dismissFlash = function(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.model) {
      return this.model.dispose();
    }
  };

  return FlashMessageView;

})(View);
});

;require.register("views/layout/header-view", function(exports, require, module) {
var HeaderView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    _ref = HeaderView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HeaderView.prototype.autoRender = true;

  HeaderView.prototype.className = 'header';

  HeaderView.prototype.tagName = 'header';

  HeaderView.prototype.template = require('./templates/header');

  return HeaderView;

})(View);
});

;require.register("views/layout/site-view", function(exports, require, module) {
var FlashMessage, FlashMessageView, SiteView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

FlashMessage = require('models/flash-message');

FlashMessageView = require('views/layout/flash-message-view');

module.exports = SiteView = (function(_super) {
  __extends(SiteView, _super);

  function SiteView() {
    _ref = SiteView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SiteView.prototype.container = 'body';

  SiteView.prototype.id = 'site-container';

  SiteView.prototype.regions = {
    header: '#header-container',
    main: '#page-container',
    flash_messages: '#flash_messages'
  };

  SiteView.prototype.template = require('./templates/site');

  SiteView.prototype.initialize = function() {
    SiteView.__super__.initialize.apply(this, arguments);
    this.subscribeEvent('flash_message', this.renderFlash);
    return this.subscribeEvent('clear_flash_message', this.clearFlash);
  };

  SiteView.prototype.renderFlash = function(message) {
    this.publishEvent('dismissAlert');
    this.flashMessage = new FlashMessage({
      message: message
    });
    return this.flashMessageView = new FlashMessageView({
      model: this.flashMessage,
      region: 'flash_messages'
    });
  };

  SiteView.prototype.clearFlash = function() {
    if (this.flashMessage) {
      return this.flashMessage.dispose();
    }
  };

  return SiteView;

})(View);
});

;require.register("views/layout/templates/flash-message", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),message = locals_.message;
buf.push((jade.escape(null == (jade.interp = message) ? "" : jade.interp)) + "<a href=\"#\" class=\"dismiss\">&times;</a>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/layout/templates/header", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1><a" + (jade.attr("href", jade.helpers.url('home'), true, false)) + ">Loan Shark</a></h1><nav><a" + (jade.attr("href", jade.helpers.url('loans'), true, false)) + ">Loans</a><a" + (jade.attr("href", jade.helpers.url('new_loan'), true, false)) + " class=\"secondary\">New Loan</a><a" + (jade.attr("href", jade.helpers.url('people'), true, false)) + ">People</a><a" + (jade.attr("href", jade.helpers.url('new_person'), true, false)) + " class=\"secondary\">New Person</a></nav>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/layout/templates/site", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div id=\"header-container\" class=\"header-container\"></div><div id=\"user_info\"></div><div class=\"outer-page-container\"><div id=\"flash_messages\"></div><div id=\"page-container\" class=\"page-container\"></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/loans/loan-detail-view", function(exports, require, module) {
var LoanDetailView, LoanView, PersonView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoanView = require('views/loans/loan-view');

PersonView = require('views/people/person-view');

module.exports = LoanDetailView = (function(_super) {
  __extends(LoanDetailView, _super);

  function LoanDetailView() {
    _ref = LoanDetailView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoanDetailView.prototype.template = require('./templates/loan-detail');

  LoanDetailView.prototype.render = function() {
    LoanDetailView.__super__.render.apply(this, arguments);
    return this.renderUserView();
  };

  LoanDetailView.prototype.renderUserView = function() {
    var person;
    person = Chaplin.mediator.people.get(this.model.get('lendee_id'));
    return new PersonView({
      model: person,
      el: this.el.querySelector('.person')
    });
  };

  return LoanDetailView;

})(LoanView);
});

;require.register("views/loans/loan-edit-view", function(exports, require, module) {
var Loan, LoanEditView, PeopleView, SelectInputView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

PeopleView = require('views/people/people-view');

SelectInputView = require('views/form_elements/select-input-view');

Loan = require('models/loan');

module.exports = LoanEditView = (function(_super) {
  __extends(LoanEditView, _super);

  function LoanEditView() {
    _ref = LoanEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoanEditView.prototype.template = require('./templates/loan-edit');

  LoanEditView.prototype.events = {
    'click button': 'save'
  };

  LoanEditView.prototype.regions = {
    people: '.people'
  };

  LoanEditView.prototype.render = function() {
    var people_select;
    LoanEditView.__super__.render.apply(this, arguments);
    people_select = new SelectInputView({
      collection: Chaplin.mediator.people,
      value_attr: 'id',
      container: this.el,
      name: 'lendee_id',
      placeholder: 'Lendee',
      region: 'people',
      model: this.model,
      label_attr: function() {
        var person;
        person = this.model;
        return person.get('first_name') + ' ' + person.get('last_name');
      }
    });
    return this.subview('people_select', people_select);
  };

  LoanEditView.prototype.save = function() {
    var new_lendee, old_lendee;
    new_lendee = this.el.querySelector("[name='lendee_id']").value;
    old_lendee = this.model.get('lendee_id');
    if (!this.model) {
      this.model = new Loan();
    }
    LoanEditView.__super__.save.apply(this, arguments);
    if (new_lendee !== old_lendee) {
      return this.publishEvent('lendee_change', old_lendee);
    }
  };

  return LoanEditView;

})(View);
});

;require.register("views/loans/loan-view", function(exports, require, module) {
var LoanView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = LoanView = (function(_super) {
  __extends(LoanView, _super);

  function LoanView() {
    _ref = LoanView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoanView.prototype.template = require('./templates/loan');

  LoanView.prototype.events = {
    "click .destroy": "destroy",
    "click .reconcile": "reconcile",
    "click .unreconcile": "unreconcile"
  };

  LoanView.prototype.destroy = function(e) {
    e.preventDefault();
    return this.model.destroy();
  };

  LoanView.prototype.reconcile = function(e) {
    e.preventDefault();
    this.model.reconcile();
    return this.render();
  };

  LoanView.prototype.unreconcile = function(e) {
    e.preventDefault();
    this.model.unreconcile();
    return this.render();
  };

  return LoanView;

})(View);
});

;require.register("views/loans/loans-view", function(exports, require, module) {
var CollectionView, LoanDetailView, LoanView, LoansView, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('views/base/collection-view');

LoanView = require('views/loans/loan-view');

LoanDetailView = require('views/loans/loan-detail-view');

template = require('./templates/loans');

module.exports = LoansView = (function(_super) {
  __extends(LoansView, _super);

  function LoansView() {
    _ref = LoansView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LoansView.prototype.template = template;

  LoansView.prototype.listSelector = '.loans';

  LoansView.prototype.initialize = function(options) {
    LoansView.__super__.initialize.apply(this, arguments);
    return this.detailed = options.detailed;
  };

  LoansView.prototype.initItemView = function(model) {
    if (this.detailed) {
      return new LoanDetailView({
        model: model
      });
    } else {
      return new LoanView({
        model: model
      });
    }
  };

  return LoansView;

})(CollectionView);
});

;require.register("views/loans/templates/loan-detail", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),reconciled = locals_.reconciled,item_name = locals_.item_name,value = locals_.value,id = locals_.id;
buf.push("<div" + (jade.cls(['loan',"" + (reconciled ? 'reconciled' : '') + ""], [null,true])) + "><h3>" + (jade.escape(null == (jade.interp = item_name) ? "" : jade.interp)) + "<span class=\"value\">" + (jade.escape(null == (jade.interp = " ($" + value + ")") ? "" : jade.interp)) + "</span></h3><div class=\"person\"></div><div class=\"actions\">");
if ( reconciled)
{
buf.push("<button href=\"#\" class=\"unreconcile\">Unreconcile</button>");
}
else
{
buf.push("<button href=\"#\" class=\"destroy\">Remove</button><button href=\"#\" class=\"reconcile\">Reconcile</button><a" + (jade.attr("href", jade.helpers.url('edit_loan', {id: id}), true, false)) + " class=\"edit\">Edit</a>");
}
buf.push("</div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/loans/templates/loan-edit", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"people\"></div><br/><input name=\"item_name\" placeholder=\"Item Name\"/><input name=\"value\" placeholder=\"Value\"/><button>Save</button>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/loans/templates/loan", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),reconciled = locals_.reconciled,item_name = locals_.item_name,value = locals_.value,id = locals_.id;
buf.push("<div" + (jade.cls(['loan',"" + (reconciled ? 'reconciled' : '') + ""], [null,true])) + ">" + (jade.escape(null == (jade.interp = item_name) ? "" : jade.interp)) + (jade.escape(null == (jade.interp = " ($" + value + ")") ? "" : jade.interp)) + "<div class=\"person\"></div><div class=\"actions\">");
if ( reconciled)
{
buf.push("<button href=\"#\" class=\"unreconcile\">Unreconcile</button>");
}
else
{
buf.push("<button href=\"#\" class=\"destroy\">Remove</button><button href=\"#\" class=\"reconcile\">Reconcile</button><a" + (jade.attr("href", jade.helpers.url('edit_loan', {id: id}), true, false)) + " class=\"edit\">Edit</a>");
}
buf.push("</div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/loans/templates/loans", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"loans\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/people/people-view", function(exports, require, module) {
var CollectionView, PeopleView, PersonView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('views/base/collection-view');

PersonView = require('views/people/person-view');

module.exports = PeopleView = (function(_super) {
  __extends(PeopleView, _super);

  function PeopleView() {
    _ref = PeopleView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PeopleView.prototype.itemView = PersonView;

  return PeopleView;

})(CollectionView);
});

;require.register("views/people/person-detail-view", function(exports, require, module) {
var Loans, LoansView, PersonDetailView, PersonView, loans, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PersonView = require('views/people/person-view');

LoansView = require('views/loans/loans-view');

Loans = require('models/loans');

template = require('views/people/templates/person-detail');

loans = Chaplin.mediator.loans;

module.exports = PersonDetailView = (function(_super) {
  __extends(PersonDetailView, _super);

  function PersonDetailView() {
    _ref = PersonDetailView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PersonDetailView.prototype.template = template;

  PersonDetailView.prototype.regions = {
    borrowed: '.borrowed-items'
  };

  PersonDetailView.prototype.render = function() {
    PersonDetailView.__super__.render.apply(this, arguments);
    return this.renderBorrowed();
  };

  PersonDetailView.prototype.renderBorrowed = function() {
    var borrowed_items, loans_view;
    borrowed_items = loans.where({
      lendee_id: this.model.get('id')
    });
    borrowed_items = new Loans(borrowed_items);
    loans_view = new LoansView({
      collection: borrowed_items,
      details: false,
      region: 'borrowed'
    });
    return this.subview('loans', loans_view);
  };

  return PersonDetailView;

})(PersonView);
});

;require.register("views/people/person-edit-view", function(exports, require, module) {
var PeopleView, Person, PersonEditView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

Person = require('models/person');

PeopleView = require('views/people/people-view');

module.exports = PersonEditView = (function(_super) {
  __extends(PersonEditView, _super);

  function PersonEditView() {
    _ref = PersonEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PersonEditView.prototype.template = require('./templates/person-edit');

  PersonEditView.prototype.events = {
    'click button.save': 'save',
    'click button.destroy': 'destroy'
  };

  PersonEditView.prototype.save = function() {
    if (!this.model) {
      this.model = new Person();
    }
    return PersonEditView.__super__.save.apply(this, arguments);
  };

  return PersonEditView;

})(View);
});

;require.register("views/people/person-view", function(exports, require, module) {
var PersonView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = PersonView = (function(_super) {
  __extends(PersonView, _super);

  function PersonView() {
    _ref = PersonView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PersonView.prototype.template = require('./templates/person');

  PersonView.prototype.className = 'person';

  PersonView.prototype.events = {
    'mouseover': 'toggleControls',
    'mouseout': 'toggleControls'
  };

  PersonView.prototype.render = function() {
    PersonView.__super__.render.apply(this, arguments);
    this.$controls = this.el.querySelector(".controls");
    return this.$controls.style.display = "none";
  };

  PersonView.prototype.toggleControls = function(e) {
    if (e.type === 'mouseover') {
      return this.$controls.style.display = "block";
    } else {
      return this.$controls.style.display = "none";
    }
  };

  return PersonView;

})(View);
});

;require.register("views/people/templates/person-detail", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),first_name = locals_.first_name,last_name = locals_.last_name,id = locals_.id,bounty = locals_.bounty;
buf.push("<h1>" + (jade.escape(null == (jade.interp = first_name) ? "" : jade.interp)) + "&nbsp;" + (jade.escape(null == (jade.interp = last_name) ? "" : jade.interp)) + "</h1><div class=\"controls\"><a" + (jade.attr("href", jade.helpers.url('edit_person', {id: id}), true, false)) + ">Edit &nbsp;" + (jade.escape(null == (jade.interp = first_name) ? "" : jade.interp)) + "</a></div><div class=\"details\"><h3>Bounty: &nbsp;<span data-bind=\"bounty\" class=\"bounty\">" + (jade.escape(null == (jade.interp = bounty) ? "" : jade.interp)) + "</span></h3></div><div class=\"borrowed-items\"></div><a" + (jade.attr("href", jade.helpers.url('person_new_loan', {person_id: id}), true, false)) + ">Loan something to " + (jade.escape((jade.interp = first_name) == null ? '' : jade.interp)) + "</a>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/people/templates/person-edit", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),id = locals_.id;
buf.push("<input name=\"first_name\" placeholder=\"First Name\"/><input name=\"last_name\" placeholder=\"Last Name\"/><button class=\"save\">Save</button><br/><br/>");
if ( id)
{
buf.push("<button class=\"destroy\">Delete</button>");
};return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/people/templates/person", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),id = locals_.id,first_name = locals_.first_name,last_name = locals_.last_name;
buf.push("<a" + (jade.attr("href", jade.helpers.url('person', {id: id}), true, false)) + ">" + (jade.escape(null == (jade.interp = first_name) ? "" : jade.interp)) + "&nbsp;" + (jade.escape(null == (jade.interp = last_name) ? "" : jade.interp)) + "</a><div class=\"controls\"><a" + (jade.attr("href", jade.helpers.url('edit_person', {id: id}), true, false)) + ">Edit &nbsp;" + (jade.escape(null == (jade.interp = first_name) ? "" : jade.interp)) + "</a></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map