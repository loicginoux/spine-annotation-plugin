(function() {
	var h;
	if (typeof exports !== "undefined") {
		h = exports
	} else {
		h = this.Spine = {}
	}
	h.version = "0.0.4";
	var e = h.$ = this.jQuery || this.Zepto ||
	function() {
		return arguments[0]
	};
	var b = h.makeArray = function(l) {
		return Array.prototype.slice.call(l, 0)
	};
	var g = h.isArray = function(l) {
		return Object.prototype.toString.call(l) == "[object Array]"
	};
	if (typeof Array.prototype.indexOf === "undefined") {
		Array.prototype.indexOf = function(m) {
			for (var l = 0; l < this.length; l++) {
				if (this[l] === m) {
					return l
				}
			}
			return -1
		}
	}
	var k = h.Events = {
		bind: function(o, p) {
			var l = o.split(" ");
			var n = this._callbacks || (this._callbacks = {});
			for (var m = 0; m < l.length; m++) {
				(this._callbacks[l[m]] || (this._callbacks[l[m]] = [])).push(p)
			}
			return this
		},
		trigger: function() {
			var n = b(arguments);
			var q = n.shift();
			var r, p, o, m;
			if (! (p = this._callbacks)) {
				return false
			}
			if (! (r = this._callbacks[q])) {
				return false
			}
			for (o = 0, m = r.length; o < m; o++) {
				if (r[o].apply(this, n) === false) {
					break
				}
			}
			return true
		},
		unbind: function(p, r) {
			if (!p) {
				this._callbacks = {};
				return this
			}
			var q, o, n, m;
			if (! (o = this._callbacks)) {
				return this
			}
			if (! (q = this._callbacks[p])) {
				return this
			}
			if (!r) {
				delete this._callbacks[p];
				return this
			}
			for (n = 0, m = q.length; n < m; n++) {
				if (r === q[n]) {
					q.splice(n, 1);
					break
				}
			}
			return this
		}
	};
	var f = h.Log = {
		trace: true,
		logPrefix: "(App)",
		log: function() {
			if (!this.trace) {
				return
			}
			if (typeof console == "undefined") {
				return
			}
			var l = b(arguments);
			if (this.logPrefix) {
				l.unshift(this.logPrefix)
			}
			console.log.apply(console, l);
			return this
		}
	};
	if (typeof Object.create !== "function") {
		Object.create = function(m) {
			function l() {}
			l.prototype = m;
			return new l()
		}
	}
	var i = ["included", "extended"];
	var a = h.Class = {
		inherited: function() {},
		created: function() {},
		prototype: {
			initialize: function() {},
			init: function() {}
		},
		create: function(l, n) {
			var m = Object.create(this);
			m.parent = this;
			m.prototype = m.fn = Object.create(this.prototype);
			if (l) {
				m.include(l)
			}
			if (n) {
				m.extend(n)
			}
			m.created();
			this.inherited(m);
			return m
		},
		init: function() {
			var l = Object.create(this.prototype);
			l.parent = this;
			l.initialize.apply(l, arguments);
			l.init.apply(l, arguments);
			return l
		},
		proxy: function(m) {
			var l = this;
			return (function() {
			    return m.apply(l, arguments)
			})
		},
		proxyAll: function() {
			var m = b(arguments);
			for (var l = 0; l < m.length; l++) {
				this[m[l]] = this.proxy(this[m[l]])
			}
		},
		include: function(n) {
			for (var l in n) {
				if (i.indexOf(l) == -1) {
					this.fn[l] = n[l]
				}
			}
			var m = n.included;
			if (m) {
				m.apply(this)
			}
			return this
		},
		extend: function(n) {
			for (var m in n) {
				if (i.indexOf(m) == -1) {
					this[m] = n[m]
				}
			}
			var l = n.extended;
			if (l) {
				l.apply(this)
			}
			return this
		}
	};
	a.prototype.proxy = a.proxy;
	a.prototype.proxyAll = a.proxyAll;
	a.inst = a.init;
	a.sub = a.create;
	h.guid = function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
			var m = Math.random() * 16 | 0,
				l = n == "x" ? m : (m & 3 | 8);
			return l.toString(16)
		}).toUpperCase()
	};
	var c = h.Model = a.create();
	c.extend(k);
	c.extend({
		setup: function(m, n) {
			var l = c.sub();
			if (m) {
				l.name = m
			}
			if (n) {
				l.attributes = n
			}
			return l
		},
		created: function(l) {
			this.records = {};
			this.attributes = this.attributes ? b(this.attributes) : []
		},
		find: function(m) {
			var l = this.records[m];
			if (!l) {
				throw ("Unknown record")
			}
			return l.clone()
		},
		exists: function(m) {
			try {
				return this.find(m)
			} catch(l) {
				return false
			}
		},
		refresh: function(n) {
			n = this.fromJSON(n);
			this.records = {};
			for (var o = 0, m = n.length; o < m; o++) {
				var l = n[o];
				l.newRecord = false;
				this.records[l.id] = l
			}
			this.trigger("refresh");
			return this
		},
		select: function(n) {
			var l = [];
			for (var m in this.records) {
				if (n(this.records[m])) {
					l.push(this.records[m])
				}
			}
			return this.cloneArray(l)
		},
		findByAttribute: function(l, n) {
			for (var m in this.records) {
				if (this.records[m][l] == n) {
					return this.records[m].clone()
				}
			}
		},
		findAllByAttribute: function(l, m) {
			return (this.select(function(n) {
				return (n[l] == m)
			}))
		},
		each: function(m) {
			for (var l in this.records) {
				m(this.records[l])
			}
		},
		all: function() {
			return this.cloneArray(this.recordsValues())
		},
		first: function() {
			var l = this.recordsValues()[0];
			return (l && l.clone())
		},
		last: function() {
			var m = this.recordsValues();
			var l = m[m.length - 1];
			return (l && l.clone())
		},
		count: function() {
			return this.recordsValues().length
		},
		deleteAll: function() {
			for (var l in this.records) {
				delete this.records[l]
			}
		},
		destroyAll: function() {
			for (var l in this.records) {
				this.records[l].destroy()
			}
		},
		update: function(m, l) {
			this.find(m).updateAttributes(l)
		},
		create: function(m) {
			var l = this.init(m);
			return l.save()
		},
		destroy: function(l) {
			this.find(l).destroy()
		},
		sync: function(l) {
			this.bind("change", l)
		},
		fetch: function(l) {
			typeof(l) == "function" ? this.bind("fetch", l) : this.trigger("fetch", l)
		},
		toJSON: function() {
			return this.recordsValues()
		},
		fromJSON: function(n) {
			if (!n) {
				return
			}
			if (typeof n == "string") {
				n = JSON.parse(n)
			}
			if (g(n)) {
				var m = [];
				for (var l = 0; l < n.length; l++) {
					m.push(this.init(n[l]))
				}
				return m
			} else {
				return this.init(n)
			}
		},
		recordsValues: function() {
			var l = [];
			for (var m in this.records) {
				l.push(this.records[m])
			}
			return l
		},
		cloneArray: function(n) {
			var l = [];
			for (var m = 0; m < n.length; m++) {
				l.push(n[m].clone())
			}
			return l
		}
	});
	c.include({
		model: true,
		newRecord: true,
		init: function(l) {
			if (l) {
				this.load(l)
			}
			this.trigger("init", this)
		},
		isNew: function() {
			return this.newRecord
		},
		isValid: function() {
			return (!this.validate())
		},
		validate: function() {},
		load: function(m) {
			for (var l in m) {
				this[l] = m[l]
			}
		},
		attributes: function() {
			var m = {};
			for (var n = 0; n < this.parent.attributes.length; n++) {
				var l = this.parent.attributes[n];
				m[l] = this[l]
			}
			m.id = this.id;
			return m
		},
		eql: function(l) {
			return (l && l.id === this.id && l.parent === this.parent)
		},
		save: function() {
			var l = this.validate();
			if (l) {
				this.trigger("error", this, l);
				return false
			}
			this.trigger("beforeSave", this);
			this.newRecord ? this.create() : this.update();
			this.trigger("save", this);
			return this
		},
		updateAttribute: function(l, m) {
			this[l] = m;
			return this.save()
		},
		updateAttributes: function(l) {
			this.load(l);
			return this.save()
		},
		destroy: function() {
			this.trigger("beforeDestroy", this);
			delete this.parent.records[this.id];
			this.destroyed = true;
			this.trigger("destroy", this);
			this.trigger("change", this, "destroy")
		},
		dup: function() {
			var l = this.parent.init(this.attributes());
			l.newRecord = this.newRecord;
			return l
		},
		clone: function() {
			return Object.create(this)
		},
		reload: function() {
			if (this.newRecord) {
				return this
			}
			var l = this.parent.find(this.id);
			this.load(l.attributes());
			return l
		},
		toJSON: function() {
			return (this.attributes())
		},
		exists: function() {
			return (this.id && this.id in this.parent.records)
		},
		update: function() {
			this.trigger("beforeUpdate", this);
			var l = this.parent.records;
			l[this.id].load(this.attributes());
			var m = l[this.id].clone();
			this.trigger("update", m);
			this.trigger("change", m, "update")
		},
		create: function() {
			this.trigger("beforeCreate", this);
			if (!this.id) {
				this.id = h.guid()
			}
			this.newRecord = false;
			var l = this.parent.records;
			l[this.id] = this.dup();
			var m = l[this.id].clone();
			this.trigger("create", m);
			this.trigger("change", m, "create")
		},
		bind: function(l, m) {
			return this.parent.bind(l, this.proxy(function(n) {
				if (n && this.eql(n)) {
					m.apply(this, arguments)
				}
			}))
		},
		trigger: function() {
			return this.parent.trigger.apply(this.parent, arguments)
		}
	});
	var j = /^(\w+)\s*(.*)$/;
	var d = h.Controller = a.create({
		tag: "div",
		initialize: function(l) {
			this.options = l;
			for (var m in this.options) {
				this[m] = this.options[m]
			}
			if (!this.el) {
				this.el = document.createElement(this.tag)
			}
			this.el = e(this.el);
			if (!this.events) {
				this.events = this.parent.events
			}
			if (!this.elements) {
				this.elements = this.parent.elements
			}
			if (this.events) {
				this.delegateEvents()
			}
			if (this.elements) {
				this.refreshElements()
			}
			if (this.proxied) {
				this.proxyAll.apply(this, this.proxied)
			}
		},
		$: function(l) {
			return e(l, this.el)
		},
		delegateEvents: function() {
			for (var p in this.events) {
				var n = this.events[p];
				var q = this.proxy(this[n]);
				var o = p.match(j);
				var m = o[1],
					l = o[2];
				if (l === "") {
					this.el.bind(m, q)
				} else {
					this.el.delegate(l, m, q)
				}
			}
		},
		refreshElements: function() {
			for (var l in this.elements) {
				this[this.elements[l]] = this.$(l)
			}
		},
		delay: function(l, m) {
			setTimeout(this.proxy(l), m || 0)
		}
	});
	d.include(k);
	d.include(f);
	h.App = a.create();
	h.App.extend(k);
	d.fn.App = h.App
})();
