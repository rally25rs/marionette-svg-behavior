## About

This is a very simple Marionette view behavior that helps you embed SVG images into your view.

The most robust way to use SVGs on the web is to put the entire SVG XML contents directly into the page because it can then be styled with CSS and manipulated with JavaScript.

This plugin loads the SVG image from your server (using jQuery AJAX) and puts the entire contents of the SVG image into your view.

## Installation

```
npm install marionette-svg-behavior --save
```

or

```
bower install marionette-svg-behavior --save
```

This plugin is in the form on a CommonJS / Node style module, so to use it:

```
var svgBehavior = require('marionette-svg-behavior');
```

## Usage

Add the behavior to the ones loaded by Marionette:

```
  Marionette.Behaviors.behaviorsLookup = function() {
    return {
	  SVG: require('../behaviors/svg')(Marionette, $, _)
	};
  };
```

Add the behavior to a view:

```
module.exports = Marionette.LayoutView.extend({
  template: template,

  behaviors: {
    SVG: {}
  }
}
```

Add an `<svg>` tag to the view template that contains a `data-src="images/some.svg"` attribute.

```
<svg data-src="images/some.svg"
     data-alt="some icon"
     height="1em" width="1em" class="icon"></svg>
```

During the `onRender` phase of the view lifecycle, the plugin will load the image and replace this SVG element with the one from the actual file.

## Merging of Attributes

Any attributes on the original `<svg>` element except for `data-src` will be copied to (or replace) the newly loaded `<svg>` element from the image file. The `class` attribute is an exception and will be appended to any existing classes instead.

So for example if the original element is:

```
<svg data-src="images/some.svg"
     data-alt="some icon"
     height="1em" width="1em" class="icon"></svg>
```

And the `images/some.svg` file contains:

```
<svg id="two-xs" class="cls-1" width="159.02pt" height="100.67pt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159.02 100.67">
  <g id="right-x">
    <line id="line1" class="cls-1" x1="79.47" y1="100.35" x2="158.64" y2="8.68"/>
  </g>
</svg>

```

then the elements put into the view would be:

```
<svg id="two-xs" class="cls-1 icon" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159.02 100.67" data-alt="some icon">
  <g id="right-x">
    <line id="line1" class="cls-1" x1="79.47" y1="100.35" x2="158.64" y2="8.68"/>
  </g>
</svg>
```

## Failute to Load an SVG

If the `$.AJAX` call to load an image fails then the original `<svg>` element will be replaced with a standard `<img>` element with `alt` text:

```
<img src="images/some.svg" alt="some icon" />
```

This will cause the browser to attempt to load the SVG file 1 more time its normal way, and if that still fails, the user will see a "broken image" graphic with alt text the same way they would in a normal image were failing to load.

## Dependencies

Though the plugin is currently a CommonJS module which retrns a function: `function(Marionette, $, _)`.
You call this function with the dependencies, and it returns the behavior.

Why?

* Because I don't know which module system you are using, if you are using one at all.
* I don't know if you are using Underscore or Lodash, so I wouldn't know which to import anyway.

If this offends you, please feel free to make a pullrequest with a better way of supporting every (or no) module loading system and I'll happily accept it.

## Image caching

Because this plugin uses `$.AJAX` it will respect the normal browser caching behavior. If you request the same SVG multiple times, the first one will load with HTTP 200 and the rest will HTTP 304 (Not Modified). This should behave similar to using a normal `<img>` tag.

## Async Loading

Because this plugin uses `$.AJAX` images are loaded async. This should behave the same as using a normal `<img>` tag.
