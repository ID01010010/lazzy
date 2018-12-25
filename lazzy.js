var lazzy = typeof lazzy !== 'undefined' ? lazzy : (function () {

    var hasWebPSupport = false;
    var hasSrcSetSupport = false;
    var windowWidth = null;
    var windowHeight = null;
    var hasIntersectionObserverSupport = typeof IntersectionObserver !== 'undefined';
    var mutationObserverIsDisabled = false;
    var doneElements = [];

    var _selector = '.lazzy';
    var _offset = 0;
    var _offsetX = 0;

    var isVisible = function (element) {
        if (windowWidth === null) {
            return false;
        }

        var e = element.getBoundingClientRect();
        var rectTop = e.top + (- _offset);
        var rectBottom = e.bottom + _offset;
        var rectLeft = e.left + (- _offsetX);

        return (
            (rectTop + e.height > 0 && rectTop < windowHeight) &&
            (rectLeft + e.width > 0 && rectLeft < windowWidth) ||
            (rectBottom > 0 && rectBottom < windowHeight)
        );
    };

    var evalScripts = function (scripts, startIndex) {
        var scriptsCount = scripts.length;
        for (var i = startIndex; i < scriptsCount; i++) {
            var breakAfterThisScript = false;
            var script = scripts[i];
            var newScript = document.createElement('script');
            var type = script.getAttribute('type');
            if (type !== null) {
                newScript.setAttribute("type", type);
            }
            var src = script.getAttribute('src');
            if (src !== null) {
                newScript.setAttribute("src", src);
                if ((typeof script.async === 'undefined' || script.async === false) && i + 1 < scriptsCount) {
                    breakAfterThisScript = true;
                    newScript.addEventListener('load', function () {
                        evalScripts(scripts, i + 1);
                    });
                }
            }
            newScript.innerHTML = script.innerHTML;
            script.parentNode.insertBefore(newScript, script);
            script.parentNode.removeChild(script);
            if (breakAfterThisScript) {
                break;
            }
        }
    };

    var updateImage = function (container, element) {
        var options = element.getAttribute('data-srcset');
        if (options !== null) {
            options = options.trim();
            if (options.length > 0) {
                options = options.split(',');
                var temp = [];
                var optionsCount = options.length;
                for (var j = 0; j < optionsCount; j++) {
                    var option = options[j].trim();
                    if (option.length === 0) {
                        continue;
                    }
                    var spaceIndex = option.lastIndexOf(' ');
                    if (spaceIndex === -1) {
                        var optionImage = option;
                        var optionWidth = 999998;
                    } else {
                        var optionImage = option.substr(0, spaceIndex);
                        var optionWidth = parseInt(option.substr(spaceIndex + 1, option.length - spaceIndex - 2), 10);
                    }
                    var add = false;
                    if (optionImage.indexOf('.webp', optionImage.length - 5) !== -1) {
                        if (hasWebPSupport) {
                            add = true;
                        }
                    } else {
                        add = true;
                    }
                    if (add) {
                        temp.push([optionImage, optionWidth]);
                    }
                }
                temp.sort(function (a, b) {
                    if (a[1] < b[1]) {
                        return -1;
                    }
                    if (a[1] > b[1]) {
                        return 1;
                    }
                    if (a[1] === b[1]) {
                        if (b[0].indexOf('.webp', b[0].length - 5) !== -1) {
                            return 1;
                        }
                        if (a[0].indexOf('.webp', a[0].length - 5) !== -1) {
                            return -1;
                        }
                    }
                    return 0;
                });
                options = temp;
            } else {
                options = [];
            }
        } else {
            options = [];
        }
        var containerWidth = container.offsetWidth * (typeof window.devicePixelRatio !== 'undefined' ? window.devicePixelRatio : 1);

        var bestSelectedOption = null;
        var optionsCount = options.length;
        for (var j = 0; j < optionsCount; j++) {
            var optionData = options[j];
            if (optionData[1] >= containerWidth) {
                bestSelectedOption = optionData;
                break;
            }
        }

        if (bestSelectedOption === null) {
            bestSelectedOption = [element.getAttribute('src'), 999999];
        }

        if (typeof container.lazzyLastSetOption === 'undefined') {
            container.lazzyLastSetOption = ['', 0];
        }
        if (container.lazzyLastSetOption[1] < bestSelectedOption[1]) {
            container.lazzyLastSetOption = bestSelectedOption;
            var url = bestSelectedOption[0];
            if (typeof container.lazzyEventsAttached === 'undefined') {
                container.lazzyEventsAttached = true;
                element.addEventListener('load', function () {
                    var handler = container.getAttribute('data-onlazyload');
                    if (handler !== null) {
                        (new Function(handler).bind(container))();
                    }
                }, false);
                element.addEventListener('error', function () {
                    container.lazzyLastSetOption = ['', 0];
                }, false);
            }
            if (url === element.getAttribute('src')) {
                element.removeAttribute('srcset');
            } else {
                element.setAttribute('srcset', url);
            }
        }
    };

    var updateWindowSize = function () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    };

    var updateElement = function (element) {

        if (doneElements.indexOf(element) !== -1) {
            return;
        }

        if (!isVisible(element)) {
            return;
        }

        var lazyContent = element.getAttribute('data-lazycontent');
        console.log(lazyContent);
        if (lazyContent !== null) {
            console.log('lazyContent');
            doneElements.push(element);
            mutationObserverIsDisabled = true;
            element.innerHTML = lazyContent;
            var scripts = element.querySelectorAll('script');
            if (scripts.length > 0) {
                evalScripts(scripts, 0);
            }
            mutationObserverIsDisabled = false;
            return;
        }

        if (hasSrcSetSupport) {
            if (element.tagName.toLowerCase() === 'img') { // image with unknown height
                updateImage(element, element);
                return;
            }

            var imageElement = element.querySelector('img');
            if (imageElement !== null) { // image with parent container
                updateImage(element, imageElement);
                return;
            }
        }

    };

    var run = function (options) {
        if (typeof options === 'string') {
            _selector = options || _selector;
        }
        if (typeof options === 'object') {
            _selector = options.selector || _selector;
            _offset = options.offset || _offset;
            _offsetX = options.offsetX || _offsetX;
        }

        var elements = document.querySelectorAll(_selector);
        var elementsCount = elements.length;

        for (var i = 0; i < elementsCount; i++) {
            updateElement(elements[i]);
        }
    };

    if (typeof window.addEventListener !== 'undefined' && typeof document.querySelectorAll !== 'undefined') {

        updateWindowSize();

        var image = new Image();
        image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEADMDOJaQAA3AA/uuuAAA=';
        image.onload = image.onerror = function () {
            hasWebPSupport = image.width === 2;
            hasSrcSetSupport = 'srcset' in document.createElement('img');

            var requestAnimationFrameFunction = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

            var hasChange = true;
            var runIfHasChange = function () {
                if (hasChange) {
                    hasChange = false;
                    run();
                }
                requestAnimationFrameFunction.call(null, runIfHasChange);
            };

            runIfHasChange();

            if (hasIntersectionObserverSupport) {

                var updateIntersectionObservers = function () {
                    var elements = document.querySelectorAll(_selector);
                    var elementsCount = elements.length;
                    for (var i = 0; i < elementsCount; i++) {
                        var element = elements[i];
                        if (typeof element.lazzyObserverAttached === 'undefined') {
                            element.lazzyObserverAttached = true;
                            intersectionObserver.observe(element);
                        }
                    }
                };

                var intersectionObserver = new IntersectionObserver(function (entries) {
                    for (var i in entries) {
                        var entry = entries[i];
                        if (entry.intersectionRatio > 0) {
                            updateElement(entry.target);
                        }
                    }
                });

                var changeTimeout = null;

            }

            var setChanged = function () {
                if (hasIntersectionObserverSupport) {
                    window.clearTimeout(changeTimeout);
                    changeTimeout = window.setTimeout(function () {
                        hasChange = true;
                    }, 300);
                } else {
                    hasChange = true;
                }
            };

            var updateParentNodesScrollListeners = function () {
                var elements = document.querySelectorAll(_selector);
                var elementsCount = elements.length;
                for (var i = 0; i < elementsCount; i++) {
                    var parentNode = elements[i].parentNode;
                    while (parentNode && parentNode.tagName.toLowerCase() !== 'html') {
                        if (typeof parentNode.lazzyScrollAttached === 'undefined') {
                            parentNode.lazzyScrollAttached = true;
                            parentNode.addEventListener('scroll', setChanged);
                        }
                        parentNode = parentNode.parentNode;
                    }
                }
            };

            var initialize = function () {
                window.addEventListener('resize', function () {
                    updateWindowSize();
                    setChanged();
                });
                window.addEventListener('scroll', setChanged);
                window.addEventListener('load', setChanged);
                if (hasIntersectionObserverSupport) {
                    updateIntersectionObservers();
                }
                updateParentNodesScrollListeners();
                if (typeof MutationObserver !== 'undefined') {
                    var observer = new MutationObserver(function () {
                        if (!mutationObserverIsDisabled) {
                            if (hasIntersectionObserverSupport) {
                                updateIntersectionObservers();
                            }
                            updateParentNodesScrollListeners();
                            setChanged();
                        }
                    });
                    observer.observe(document.querySelector('body'), {
                        childList: true,
                        subtree: true
                    });
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initialize);
            } else {
                initialize();
            }
        };
    }

    return {
        'run': run,
        'isVisible': isVisible
    };

}());