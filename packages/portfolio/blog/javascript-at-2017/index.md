JavaScript has evolved to a viable high level language, with a great set of features and performance.

[![Mandelbrot Courtesy of Inigo Quilez, ShaderToy](assets/mandelbrot.png)](https://www.shadertoy.com/view/4df3Rn)

The Mandelbrot Benchmark ([Gouy, Isaac. The Computer Benchmark Game](http://benchmarksgame.alioth.debian.org/)) shows just how far it's come, beating Ruby, PHP, and Python in performance. 

| Language | Sec | Memory (KB) |
|---|---|---|
| C | 1.65 | 29,588 |
| C++ | 1.73 | 34,064 |
| Rust | 1.89 | 52,848 |
| Swift | 3.32 | 42,428 |
| Go | 5.64 | 31,052 |
| Java | 7.10 | 90,588 |
| OCaml | 13.76 | 8,240 |
| 🚩 *Node.js* | **17.95** | 641,352 |
| Dart | 20.51 | 111,732 |
| Hack (PHP) | 31.24 | 125,920 |
| *Python* | 273.43	| **53,416** |
| Ruby | 7 min | 69,656 |
| Erlang | 8 min | 1,303,564 |

> Please Note: 
> 1. Performance isn't everything, other languages have great ideas too. 
> 
> 2. There's no better benchmark than your app, the Mandelbrot fractal is great but there are variations in performance across benchmarks, so look at the others!

A far cry to what people thought the language would become at its early years.

JavaScript was designed in 10 days by [Brendan Eich](https://twitter.com/brendaneich?lang=en), had varying levels of browser support, and Adobe Flash was looking to be a much better web platform. But things have calmed down since then and the language is regularly maintained by the ECMA standard body, stable across browsers, beat Flash and even took some of ActionScript's language features (a classic case of too early for it's time).

The following is a quick overview of all the new features of JavaScript as of 2017, we'll be looking at:

- **Variable Declaration**
- **Functions**
- **Classes**
- **Modules**
- **Destructuring**
- **Decorators**
- **Iterators**
- **Async/Await**

## `let`/`const` Variable Declaration

```js
let a = 0;

const b = 'CONSTANT VALUE';

var c = 1;
```

`let` is scoped to the current closure, so for example:

```js
for(let str of strArr) {
  // ...
}

// str is not in this scope!
```

`const` is for constants:

```js
// Approximately IEEE Floating Point Epsilon
const EPSILON = 5e-8;
```

## `=>` Functions

```js
// ES2017
const callback = () => console.log("Callback!");

// Legacy
function callback() { return console.log("Callback!");}
```

JavaScript functions have always been pretty verbose. You have to write the whole word `function`, other languages had it better:

| Language | `function` Keyword |
|----------|----------|
| Swift    | `func`   |
| Go       | `func`   |
| Reason   | `fun`    |
| Rust     | `fn`     |
| Python   | `def`    |

JavaScript functions were also a bit confusing, `this` is bound to the global `window` scope unless declared otherwise, so **Fat Arrow** functions are instead bound to the current class.

## Classes

```js
class Hero extends React.Component {
  static defaultProps = {
    shrink: false
  }

  toggleShrink = () => {
    // ...
  }

  render() {
    // ...
  }
}
```

They're syntactic sugar for functions with prototype functions added to them:

```js
function Hero {
  // Constructor Logic
}

Hero.prototype.toggleShrink = () => {
  // ...
}
```

## ECMAScript Modules

```js
import React, { Component } from 'react';

class MyClass {
  // ...
}

export default MyClass;
```

Since JavaScript has `global` scopes, there's always been a need for defining the scope of a given expression. We had [Self Executing Functions](https://github.com/desandro/masonry/blob/master/masonry.js) (Also known as **Anonymous Closures** or **Immediately Executed Factory Function**) for a while, where we would fill the Self Executing Function's arguments with global variables like `window` or `jQuery`.

This is known as the [Module Pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html), and it's a big part of writing libraries/apps.

```js
(function(window, jQuery){
  //...
})(window, $)
```
Then Node came along with their package syntax, defined by the guys at [CommonJS](http://groups.google.com/group/commonjs).

```js
var app = require('express'); //express is defined in node_modules.

module.exports = {some: 'data'};
```

Then [RequireJS](http://requirejs.org/docs/whyamd.html) defined a new spec! **Asynchronous Module Definition**, or AMD for short. The AMD loader will parse out the `require('')` calls by using `Function.prototype.toString()`, then internally convert it to the format above.

```js
define([ "require", "jquery"], function (require, $) {});
//or
define(function (require) {
    var $ = require('jquery');
    return function () {};
});
```

The syntax is similar to [Angular 1.x dependency injection](https://docs.angularjs.org/guide/di). The real benefit of this however, is that it's **non-blocking**, however that doesn't matter if you're compiling your source into one binary.

[Brian Leroux](https://medium.com/@brianleroux/es6-modules-amd-and-commonjs-c1acefbe6fc0#.m6cj1o5hp) and [Wes Bos](http://wesbos.com/javascript-modules/) both wrote some great articles on the state of modules it you want more details.

### Destructuring Assignment

```js
let arr = [...prevArr, 'new value'];
let [a, b] = [1, 2];
let [a, b, ...rest] = [1, 2, 3, 4, 5];
```

This can even be done with Objects:

```js
let {
  color,
  size
} = this.props;

let newProps = {
  ...this.props,
  color: 'steelblue'
};
```

### Decorators

```ts
type Decorator<C, D extends C> = (...args: any[]) => C => D;
```

**Decorators** are a way of wrapping functions to add extra functionality. They originated from [Python](http://python-3-patterns-idioms-test.readthedocs.org/en/latest/PythonDecorators.html).

They're used for example, in `react-redux` to make it easier to wrap a React component with a listener to the Rexdux store.

```js
// In your code:
@connect(mapStateToProps, mapDispatchToProps)
class ShoppingCart extends React.Component {
  //...
}

// Redux
import React from 'react';
import transport from '../transport';
import { verify } from './utils';

function connect(mapStateToProps, mapDispatchToProps) {

    return Component => {
      class ReduxContainer extends React.Component {
        render() {
          let mappedProps; // ...
          return (<Component {...mapedProps}/>);
        }
      }
      return RavenContainer;
    }
  }
}
```

### Iterators & Generators

```js
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

**Iterator** - A way to write asynchronous functions synchronously, with the ability to pause the function and maintain it's state when you `yield` (instead of `return`).

ES6 brought built in Iterator support, and a way to "Generate" Iterators!

> A function becomes a **generator** if *it contains one or more yield expressions and if it uses the function* syntax*.

It's similar to [C# Coroutines](http://docs.unity3d.com/Manual/Coroutines.html) if you've ever used the Unity Game Engine.

```cs
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

```cs
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

```ts
class Promise<T> {
  constructor(cb: (resolve: T, reject: Error) => void);
  then(res: T): this;
  catch(err: Error): this;
}
```

**Promises** - An Asyncronous function that acts sort of like a Coroutine in C#, independent of the caller. Angular had them in AJAX requests, and It's now in ES6!

```js
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

A function can be async, in other words, it's a promise, and can `await` other promises/async functions.

```js
import database from 'db';
async function getFromDatabase() {
  let db = await database;
  let collection = db.collection('mongoCollection');
  // ...
}
```