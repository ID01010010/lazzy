# lazzy

- No dependencies
- No unnecessary requests
- Handles responsive images
- SEO friendly (valid HTML)


## Download and install

```
npm i -S lazzy
```


The library does not have any dependencies, and it's just 1.1kb gzipped and minified.

## Usage

To use lazzy just add the `.lazzy` class and the following `srcset` to your images:
```html
<img class="lazzy" src="images/2500.jpg" srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" />
```

To use lazzy with **responsive images** list your images in the `data-srcset` attribute:
```html
<img class="lazzy" src="images/2500.jpg" data-srcset="images/400.jpg 400w, images/400.webp 400w, images/600.jpg 600w, images/1000.jpg 1000w" srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" />
```

## Customization

You don't need to init lazzy. But if you want to use a custom selector run the following code:
```js
lazzy.run('.my-lazzy-selector');
```

Or apply lazzy to all images:
```js
lazzy.run('img');
```

## A concept

A lightweight lib that doesn't break your HTML by removing the `src`.

## Browser support

The lazy loading works in browsers supporting the `srcset` attribute. As of December 2018 that's [88.57%](http://caniuse.com/#feat=srcset). Unsupported browsers will load the image in the `src` attribute. **That's the image search engines and social networks will find, so it's better to make it high resolution.**

## DOM changes

The library will listen for DOM changes and you can also trigger visible images loading by calling: `lazzy.run()`.


## License
Free to use under the [MIT license](http://opensource.org/licenses/MIT).
