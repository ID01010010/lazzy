# lazzy

- No dependencies
- No unnecessary requests
- Handles responsive images
- SEO friendly (doesn't remove the `src` attribute)


## Installation

```
npm i lazzy
```

Require as a module:
```js
const lazzy = require('lazzy');
```

In browser:
```html
<script src="dist/lazzy.min.js"></script>
```


## Usage

To use lazzy just add the `.lazzy` class and the following `srcset` to your images:
```html
<img class="lazzy"
    src="images/1200.png"
    srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    alt="" />
```

To use lazzy with **responsive images**, list your images in the `data-srcset` attribute:
```html
<img class="lazzy"
    src="images/1200.png"
    data-srcset="images/400.png 400w, images/600.png 600w, images/1000.png 1000w"
    srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    alt="" />
```


## Options

### Custom selector

You don't need to init lazzy. But if you want to use a `custom selector`, run the following code:
```js
lazzy.run('.my-lazzy-selector');
```

or specify **multiple selectors**:
```js
lazzy.run(['.my-lazzy-page img', '.my-lazzy-selector']);
```

### Offset
With Lazzy, you can easily **preload** images by adding an `offset`:
```js
lazzy.run({
    selector: ['.my-lazzy-page img', '.my-lazzy-selector'],
    offset: '100px' // Load images 100px earlier
});
```
or
```js
lazzy.run({
    offset: 100 // Load images 100px earlier
});
```
or, set the `offset` as a **percentage** of the current viewport height:
```js
lazzy.run({
    offset: '20%' // Load images 20% earlier
});
```

### Retina & 4k support
Request an image in resolution depending on Pixel density (PPI)
```js
lazzy.run({
    isDependingOnPixelDensity: true // false, by default
});
```

## A concept

A lightweight lib that doesn't break your HTML by removing the `src`.

To avoid unnecessary requests lazzy uses a base64-encoded 1x1px image in `srcset` as a placeholder - `data:image/gif;base64,R0lGOD...`

Note that you can use your own placeholder images in `srcset`. For example, blurred previews when downloading better quality images.


## Browser support

The lazy loading works in browsers supporting the `srcset` attribute. As of January 2019 that's [88.65%](http://caniuse.com/#feat=srcset). Unsupported browsers will load the image in the `src` attribute. **That's the image search engines and social networks will find, so it's better to make it high resolution.**


## DOM changes

The library will listen for DOM changes and you can also trigger visible images loading by calling: `lazzy.run()`.


## License
Free to use under the [MIT license](http://opensource.org/licenses/MIT).
