'use strict';

module.exports = function(Marionette, $, _) {
  return Marionette.Behavior.extend({
    onRender: function() {
      var self = this;

      this.$el.find('svg[data-src]').each(function() {
        self._svgAjaxLoad(this);
      });
    },

    _svgMergeAttributes: function($placeholder, $svg) {
      _.each($placeholder[0].attributes, function(attribute) {
        if(attribute === 'class') {
          $svg.attr(attribute.nodeName, attribute.nodeValue + ' ' + $svg.attr(attribute));
        } else if(attribute !== 'data-src') {
          $svg.attr(attribute.nodeName, attribute.nodeValue);
        }
      });
    },

    _svgAjaxLoad: function(element) {
      var $element = $(element);
      var svgUrl = $element.data('src');
      var altText = $element.data('alt');
      var _svgMergeAttributes = this._svgMergeAttributes;

      $.ajax({
        url: svgUrl,
        type: 'GET',
        dataType: 'text',
        cache: true
      }).done(function(result) {
        var $svg = $(result);
        _svgMergeAttributes($element, $svg);
        $element.replaceWith($svg);
      }).fail(function() {
        var fallback = '<img src="' + svgUrl + '" alt="' + (altText || '') + '" />';
        element.outerHTML = fallback;
      });
    }
  });
};
