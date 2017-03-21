```bash
npm i react-anime -S
```

React Anime is a super easy animation library for React built on top of [anime.js](https://github.com/juliangarnier/anime).

To use it, place an `<Anime>` component and what you want to animate inside. No need to worry about callbacks or changes to the animation, Anime will handle all the rest.

## Features

- Animate nearly all CSS, SVG, & DOM attributes by adding a prop with their name (eg. `opacity`, `backgroundColor`, `translateX`).
- Nested animations are as easy as putting an `<Anime>` component inside another.
- Animations can react to changes in `state`.
- Cascading animations through `delay` prop.
- Easily make mounting/unmounting animations.
- [TypeScript](http://typescriptlang.org/)/[Flow](https://flowtype.org/) definitions included.

## Reactive Animations

One of the biggest problems with animations is the idea that things will change between an animation. 

Lets say for example, you start at point `(0, 0)`, you go to `(100, 0)`, then between that animation you request to go to `(-100, 100)`. 

That means the velocity vector for your animation changed:

\[ \nabla f \underset{Event}{\rightarrow} \nabla f' \]

There's two ways you could really go about dealing with this:

1. **Naive** - Restart the animation with the new animation vector.
2. **Best** - You can pause the current animation and interpolate the new previous point with the new end point. The problem with this is deciding how to deal with *time*.

### React Motion

React motion removes the idea of time from you, you're only working with an interpolation function:

```js
import React from 'react';
import { Motion, spring } from 'react-motion';

const Hero = (props) =>
  <Motion 
    defaultStyle={{ opacity: 0 }} style={{ 
    opacity: spring(1, { stiffness: 20, damping: 4 }) }}>
      {
        ({ opacity }) =>
        <nav style={{opacity}}/>
      }
  </Motion>;
```

But now the user needs to juggle callbacks, though this could be mitigated with your own custom *wrapper components*.

### React Anime

The same code in React Anime is smaller since you're not responsible for passing props to your children, Anime will do that for you:

```js
import React from 'react';
import Anime from 'react-anime';

const App = (props) => (
  <Anime opacity={[0, 1]}>
    <nav/>
  </Anime>
```

Let's look at some examples to really understand what's going on under the hood when it reacts to changes:

## Examples

## Reactive Animations

Let's say you're animating the position of a sphere according to a counter. Depending on the counter's number, the circle will be in 4 positions, a sort of like a *Discrete Finite Automata*. 

```js
import React, { Component } from 'react';
import Anime from 'react-anime';

class DFA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
    };

    setInterval(this.incrementCounter);
  }

  incrementCounter = () =>
    this.setState(({ counter }) => ({ counter: counter++ }));

  render() {
    return (
      <Anime translateX={[0, 25 * (4 % counter)]}>
        <div style={styles.circle} />
      </Anime>
    );
  }
}

const styles = {
  circle: {
    width: 64,
    height: 64,
    borderRadius: '100%',
    background: 'steelblue',
  },
};

```

What will happen in this case is every time `this.state.counter` is incremented, the div will move to it's new target position.

There's a few other edge cases to consider:

1. **Replace keyframes in `translateX` entirely** - The animation will interpolate from the children's current's props replacing the first keyframe.

2. **Children are added/removed** - The Anime's settings will be applied to that child, or applied in reverse if we're removing children.

Thus **state** of a component's animation is encapsulated in a `<Anime/>` Component. 

### Cascading Lists

Say you have a list of products you want to feature on your site, animating those is as simple as wrapping the list in an anime component.

```js
import React, { Component } from 'react';
import Anime from 'react-anime';

class CascadingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: ['iPhone', 'Google Pixel', 'Xbox One'],
    };
  }

  render() {
    let { list } = this.state;

    let animeProps = {
      opacity: [0, 1],
      translateY: [-64, 0],
      delay: (el, i) => i * 200
    };

    return (
      <Anime {...animeProps}>
        {list.map((v, i) => <div key={i}>{v}</div>)}
      </Anime>
    );
  }
}

```

Anime will react to changes to your list, animating them in for you.

### Mount/Unmounting Animations

By default React Anime reverses the animation when unmounting, but you can configure this with the `onMount` and `onUnmount` props.

```js
import React, { Component } from 'react';
import Anime from 'react-anime';

class ShesIntoYou extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
    };
  }

  dismount = () => 
    this.setState(({ mounted }) => ({ mounted: !mounted }));

  render() {
    let { mounted } = this.state;

    let animeProps = {
      opacity: [0, 1],
      translateY: [-64, 0],
      delay: (el, i) => i * 200
    };

    return (
      <Anime {...animeProps}>
        {mounted ? <h1 onClick={this.dismount}>Heyyyyyyyy</h1> : null}
      </Anime>
    );
  }
}

```

### Route Transitions

The holy grail of site animations is a really nice, route transition, say for example you want each page of your application to behave like cards being drawn from a deck, so the **move up and fade in when entering**, and **move down and fade out when leaving**.

```js
// card-anime.js
import Anime from 'react-anime';

export default (props) => (
  <Anime {{...transition, ...props}} />
)

const transition = {
  opacity: [0, 1],
  translateY: ['100vh', 0]
};
```

And we can just user our transition component as a wrapper for our routes:

```js
import React, { Component } from 'react';
import { Route } from 'react-router';

import CardAnime from './card-anime';

export default (
  <div>
    <Route component={CardAnime}>
  </div>
);
```

## Final Thoughts

It's hard to strike a balance between *expressiveness* and *brevity*, but React Anime hits a nice balance there that should work really well for your project, let us know what you think by tweeting [@alainxyz](http://twitter.com/alainxyz), [@KennetPostigo](https://twitter.com/kennetpostigo), or [@JulianGarnier](https://twitter.com/JulianGarnier)!