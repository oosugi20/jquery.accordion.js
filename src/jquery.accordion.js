;(function ($, window, undefiend) {
'use script';

var MODULE_NAME = 'Accordion';
var PLUGIN_NAME = 'accordion';
var Module;


/**
 * Module
 */
Module = function (element, options) {
	this.el = element;
	this.$el = $(element);
	this.options = $.extend({
		duration: 200
	}, options);
};

(function (fn) {
	/**
	 * init
	 */
	fn.init = function () {
		var _this = this;
		this._prepareElms();
		this._eventify();
		this.closeAll(true);
		this.$item.each(function () {
			var $this = $(this);
			if ($this.attr('data-accordion-initopen') !== undefined) {
				_this.open($this, true);
			}
		});
		this._state = 'initialized';
	};

	/**
	 * _prepareElms
	 */
	fn._prepareElms = function () {
		this.$item = this.$el.find('[data-accordion-item]');
	};

	/**
	 * _eventify
	 */
	fn._eventify = function () {
		var _this = this;
		this.$el.on('mouseover', '[data-accordion-item]', function () {
			_this.closeOpened();
			_this.open($(this));
		}).on('mouseout', '[data-accordion-item]', function () {
		});
	};

	/**
	 * closeAll
	 * @param {Boolean} disable_animate true でアニメートなしに
	 */
	fn.closeAll = function (disable_animate) {
		var _this = this;
		this.$item.each(function () {
			_this.close($(this), disable_animate);
		});
	};


	/**
	 * closeOpened
	 */
	fn.closeOpened = function () {
		var _this = this;
		this.$item.each(function () {
			var $this = $(this);
			if ($this.attr('data-accordion-state') === 'opened') {
				_this.close($this);
			}
		});
	};

	/**
	 * close
	 */
	fn.close = function ($item, disable_animate) {
		var _this = this;
		var duration = this.options.duration;
		var closed_width = $item.attr('data-accordion-closedwidth');
		if (this._state === 'pending') { return; }
		if (disable_animate) {
			$item.css({
				width: closed_width
			});
			$item.removeClass('opened');
			$item.addClass('closed');
		} else {
			$item.stop(true, false).animate({
				width: closed_width
			}, {
				duration: duration,
			});
			$item.removeClass('opened');
			$item.addClass('closed');
		}
		$item.attr('data-accordion-state', 'closed');
	};

	/**
	 * open
	 * @param {jQuery Object} item 開きたい対象
	 * @param {Boolean} disable_animate true でアニメートなしに
	 */
	fn.open = function ($item, disable_animate) {
		var _this = this;
		var duration = this.options.duration;
		var opened_width = $item.attr('data-accordion-openedwidth');
		if (this._state === 'pending') { return; }
		this._state = 'pending';
		if (disable_animate) {
			$item.css({
				width: opened_width
			});
			$item.removeClass('closed');
			$item.addClass('opened');
			this._state = 'resolved';
		} else {
			$item.stop(true, false).animate({
				width: opened_width
			}, {
				duration: duration,
				complete: function () {
					_this._state = 'resolved';
				}
			});
			$item.removeClass('closed');
			$item.addClass('opened');
		}
		$item.attr('data-accordion-state', 'opened');
	};


})(Module.prototype);


// set jquery.fn
$.fn[PLUGIN_NAME] = function (options) {
	return this.each(function () {
		var module;
		if (!$.data(this, PLUGIN_NAME)) {
			module = new Module(this, options);
			$.data(this, PLUGIN_NAME, module);
			module.init();
		}
	});
};

// set global
$[MODULE_NAME] = Module;

})(jQuery, this);
