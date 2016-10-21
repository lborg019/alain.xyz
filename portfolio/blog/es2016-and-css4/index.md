[Douglas Crockford's "The Better Parts"](https://www.youtube.com/watch?v=_EF-FO63MXs)

## Lambda Functions

Javascript functions have always been pretty verbose. You have to write the whole word `function`, compared to say [Swift](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Functions.html) or [Go](https://gobyexample.com/functions) where it's just `func` or [Reason](https://facebook.github.io/reason/) with `fun`. wouldn't it be nice to have a shorthand for stuff like callback soup and throwaway functions?

Lambdas make Asyncronous programming much easier!

```javascript
var callback = function() { console.log("Callback!");}


var callback = () => console.log("Callback!");
```

## Modules

![Modules Animation](assets/modules.svg)

Since JavaScript has `global` scopes, there's always been a need for defining the scope of a given expression. We had [Self Executing Functions](https://github.com/desandro/masonry/blob/master/masonry.js) (Also known as **Anonymous Closures** or **Immediately Executed Factory Function**) for a while, where we would fill the Self Executing Function's arguments with global variables like `window` or `jQuery`.

This is known as the [Module Pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html), and it's a big part of writing libraries/apps.

```javascript
(function(window, jQuery){
  //...
})(window)
```
Then Node came along with their package syntax, defined by the guys at [CommonJS](http://groups.google.com/group/commonjs).

```javascript
var app = require('express'); //express is defined in node_modules.

module.exports = {some: 'data'};
```

Then [RequireJS](http://requirejs.org/docs/whyamd.html) defined a new spec! **Asyncronous Module Definition**, or AMD for short. The AMD loader will parse out the `require('')` calls by using `Function.prototype.toString()`, then internally convert it to the format above.

```javascript
define([ "require", "jquery"], function (require, $) {});
//or
define(function (require) {
    var $ = require('jquery');
    return function () {};
});
```

The syntax is similar to [Angular 1.x dependency injection](https://docs.angularjs.org/guide/di). The real benefit of this however, is that it's **non-blocking**, however that doesn't matter if you're compiling your source into one binary.

Now with ECMAScript 2016, the following syntax is becoming the official way:

```javascript
import {deprecate} from 'core-decorators'; //import class from dir

// if in tsconfig.json, "moduleResolution" = "node"
// Then this will assume from 'node_modules/' + your stuff
import {Component, ElementRef} from 'angular2/core';
```

However, loading one JavaScript file for your app, combining your code and compiling/compressing it gives you a big boost in performance, so the module system doesn't really matter if you're doing that, you can just compile it all and be done.

[Brian Leroux](https://medium.com/@brianleroux/es6-modules-amd-and-commonjs-c1acefbe6fc0#.m6cj1o5hp) and [Wes Bos](http://wesbos.com/javascript-modules/) both wrote some great articles on the state of modules it you want more details.

### Property Binding shorthand

A lot of the new features in ES6 and 7 stem from the jQuery/Ruby/Elm/CoffeeScript philosophy of writing less code.

```javascript
function handleLoad() {
  //...
}

 this.img.onload = ::this.handleLoad;

//This is the same as:

this.handleLoad.bind(this.imgmin.onload);

```

### Destructuring Assignment

```javascript
[a, b] = [1, 2]
[a, b, ...rest] = [1, 2, 3, 4, 5]
{a, b} = {a:1, b:2}
{a, b, ...rest} = {a:1, b:2, c:3, d:4}  //ES7
```

### Decorators

![Christmas Tree with at Symbols]()

**Decorators** are a way of extending functions (so sorta like inheritance), but in a clean simple format. They came from [Python](http://python-3-patterns-idioms-test.readthedocs.org/en/latest/PythonDecorators.html), but since JavaScript is the *lingua franca* of the programming world, it's been added to the spec.

Before adding a property on a new object's prototype, JavaScript invokes the decorator, letting you keep stuff like adding properties away from the programmer.

### Decorator Example

```javascript
import React from 'react';
import transport from '../transport';
import { verify } from './utils';

function raven (graphql: string) {
    var graphql = verify(graphql);
    return (Component) => {
      class RavenContainer extends React.Component {
        // mutate before unmount
        componentDidMount () {
          transport('http://localhost:8888/', graphql)
          .then((res) => this.setState());
        }
        render() {
          return (<Component {...this.state}/>);
        }
      }
      return RavenContainer;
    }
  }
}

// Now in your code:

@raven(`
 greetings: query{
   name
 }`)
class ShoppingCart extends React.Component {
  //...
}
```

### Iterators & Generators

Generators are basically Asynchronous functions

ES6 brought built in Iterator support, and a way to "Generate" Iterators!

A function becomes a **generator** if *it contains one or more yield expressions and if it uses the function* syntax*.



```javascript
function* idMaker(){
  var index = 0;
  while(true)
    yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
// ...
```

It's similar to [C# Coroutines](http://docs.unity3d.com/Manual/Coroutines.html) if you've ever used the Unity Game Engine.

```csharp
IEnumerable<T> Fibonacci()
{
    int a = 0;
    int b = 1;
    while (true) {
        yield return b;
        int tmp = a + b;
        a = b;
        b = tmp;
    }
}
```

Here's an example of a fading coroutine I used for a simple transition library for Unity3D.

```csharp
// Fade this.alpha to targetAlpha
IEnumerator Fade(float targetAlpha)
{
    while (Mathf.Abs(alpha - targetAlpha) > 0.01)
    {
        alpha = Ease.inverse(alpha, targetAlpha, fadeTime);
        yield return null;
    }
    cc.brightness = targetAlpha;
    yield return null;
}
```

### Promises, Async/Await, and Generators

**Promises** - An Asyncronous function that acts sort of like a Coroutine in C#, independent of the caller. Angular had them in AJAX requests, and It's now in ES6!

```javascript
// Angular 1.x had something similar to promises.
$http({
method: 'GET',
url: 'http://api.soundcloud.com/tracks/'+scope.track+'.json'
}).
success(function (data) {
scope.band = data.user.username;
scope.bandUrl = data.user.permalink_url;
});
```


