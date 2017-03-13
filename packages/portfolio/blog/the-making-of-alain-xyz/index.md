[Jen Simmons' in her Podcast *The Web Ahead*](http://thewebahead.net/) said *Everyone wants to make their own **CMS***, that idea extends to Game Devs, *everyone wants to make their own **Game Engine***, or with musicians, *everyone wants to make their own unique **Sound***, or artists, *everyone wants to make their own **Style** or **Comic**.* I guess it's that desire to really make an strong impact on the world that drives people to *reinvent*. 

Still, I succumbed to the temptation and built a custom website.

## Design Goals

1. Prerenders the page for the user to save that initial render step.

2. Loads core application components first.

3. Dynamically load modules as needed.

Modules being JavaScript modules, so full programmatic control of any view components you load! Since they're modules, they could be anything from books to entire applications. (So we can have apps inside of apps, **appception** anyone?)

![Inception Gif](assets/appception.gif)

Here's some of the dependencies I'm building on top of:

### Server

1. [NodeJS](https://nodejs.org/) - Serverside JavaScript, one language for everything.

2. [MongoDB](http://mongodb.org/) - A simple to use NoSQL Database.

3. [Express](https://expressjs.com/) - Node.js' De'facto HTTP Server.

### Client

1. [React](https://facebook.github.io/react/) - Facebook's solution to the front end management problem, functional frontends.

2. [Redux](http://redux.js.org) - A single place to manage changes in an entire application's state. 

### Markup

1. [KaTex](https://khan.github.io/KaTeX/) - Quickly process LaTex math expressions.

2. [Remarkable](https://github.com/jonschlinkert/remarkable) - Handles markdown rendering.

3. [Highlight.js](https://highlightjs.org/) - Handles code syntax highlighting.

### Preprocessing

1. [TypeScript](https://typescriptlang.org) - A superset of JavaScript which adds types, interfaces, enums, namespaces, and babel-esque compilation to older versions of JavaScript.

2. [Webpack](https://webpack.github.io/) - The newest version of Webpack that supports treeshaking and ECMAScript Modules (ESM), really powerful stuff that can remove dead code and allow dynamic module loading respectively. 

3. [PostCSS](https://github.com/postcss/postcss) - a sort of preprocessor that's much more modular than [Stylus](http://stylus-lang.com/), [Sass](http://sass-lang.com/), or [Less](http://lesscss.org/). It works similar to [UglyfyJS](http://lisperator.net/uglifyjs/) or [Katex](https://khan.github.io/KaTeX/) in that in generates an AST, and users can supply functions to process that AST.

### Host

[Digital Ocean](https://www.digitalocean.com/) - After comparing [AWS](http://aws.amazon.com), [Google Cloud](https://cloud.google.com/), [Dreamhost](https://www.dreamhost.com/), [Heroku](https://www.heroku.com/) this host offers the best balance of features and price **$10.00**.

## Getting Started

> Complexity Anchors your thinking - If you think you need a giant toolchain to produce a website, then you're going to only produce websites you can make with these giant toolchains. ~ Maciej Ceglowski

The fastest way to get something rolling is to fork some boilerplate code, here's a few I found:

1. [React JWT Example](https://github.com/joshgeller/react-redux-jwt-auth-example) - A fully functional React/Redux app example with backend auth with Json Web Tokens.

2. [React Starter Kit](https://github.com/kriasoft/react-starter-kit) - SPA built with React.js, Express, Flux, ES6+, JSX, Babel, PostCSS, Webpack.

3. [Angular 2 Webpack](https://github.com/AngularClass/angular2-webpack-starter) - Just because this is a React App doesn't mean you can't pull in ideas from other libraries.

### Making Design Decisions

There's a *lot of questions* involved in making a website from a architectural perspective, and in the end a lot of it comes down to opinion - *You're asking a lot if you want to understand every little detail down to the bits flipped*, so some decisions will honestly be opinions, but I tried being as unbiased as possible:

1. [What's your Ideal WebPageTest Score?](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/quick-start-quide) - [100 ms of latency cost amazon 1% of sales](http://blog.gigaspaces.com/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/), Performance is a big deal!

2. [How can you make an Emotional Website?](blog.teamtreehouse.com/emotional-interface-design-the-gateway-to-passionate-users) - We need websites people *care about*.

3. What kind of database should you use? What about [Polyglot Persistence](http://www.jamesserra.com/archive/2015/07/what-is-polyglot-persistence/), [Micro-Services](http://www.martinfowler.com/microservices/)?

4. Should you containerize your app with [Docker](http://docker.com/) or dedicate the entire Virtual Machine to your app with [IncludeOS](http://www.includeos.org/)? 

5. How do you balance looks and performance?

The list goes on and on. 

## `<Portfolio/>` - The Cream rises to the top

A **Portfolio** is a collection of personal/professional work that shows you're not all talk.

It should be saturated, updated often, and should only consist of your best work.

A portfolio could be made of many things:

 - Art
 - Music
 - Games
 - Books
 - Articles
 - Pictures of your Cat

But a portfolio should be an **exclusive place**. *Therefore In my portfolio I only feature **finished projects**, no individual art pieces, articles, songs*. Collaborative works like big projects should have specifics pointed out.

## `<Blog/>` - A Connected Website

We have Facebook, Twitter, Tumblr, Artstation, Soundcloud, Youtube, Udacity, Codepen, and there will be more to come, *the days of the static site are over*. So the question is:

> How do you make your site feel like you never left these communities?

The way I did this is sync any new post or update events via apps that give me access to the APIs of these websites, so **any updates to the main site pushes across the social network channels**.

I want to make you comfortable, go to Tumblr if you want, we have repost buttons here, Facebook like buttons that link directly to the post on Facebook! :)

### Prior Art - Blogs

 * [StackEdit](https://github.com/benweet/stackedit) are really on top of their game when it comes to writing markdown posts, supporting Footnotes, Syntax Highlighting, Mathjax, UML diagrams, etc.

 * [Ghost](https://github.com/TryGhost/Ghost) - A blogging tool used by Graze, Nasa, Bitcoin, Envato to name a few. They have built in collaboration support too!

 * [Wordpress Calypso](https://github.com/Automattic/wp-calypso) just came out, Wordpress coming to 2016 with node, express, react and flux!

 * [CodeSchool](https://www.codeschool.com/courses/shaping-up-with-angular-js) offers amazing high quality courses with built in exam questions, similar to [TreeHouse](https://teamtreehouse.com/), [Udemy](http://udemy.com/), [Edx](https://www.edx.org/).
 
 * [Pluralsight](https://www.pluralsight.com) has an amazing course system that very polished, and they're the parent company of tons of online schools, from CodeSchool to Digital tutors.
 
 * [The Graphics Codex](http://graphicscodex.com/) offers an amazing ebook experience that features:
 	* A symbol table at the end of every chapter
	* Brevity and plenty of illustrations (this is a graphics book lol)
	* An amazing apendix similar to [Angular.io](https://angular.io/docs/ts/latest/quickstart.html#!#appendices).

> The goal of this blog is to be a place where you can learn by any means, articles (tutorials), podcasts, presentations, books, courses, **or whatever medium makes it easier for you the reader to learn**.

#### Academia

It's our job as the next generation to make it easier for future generations to learn what we learned. With that said, this website is built with full citation/bibtex support thanks to some automatically generated metadata with each post.

```markdown
> I sometimes worry my life's work will be reduced to a 200-line @Shadertoy submission.[^timsweeny]
```

Similar to Latex References, to place references, simply write `[^yourrefname]`, and this will be matched with the folder's `references.json` file. (This is directly inspired by the same feature on [stackedit.io](https://stackedit.io)).

In addition, you can write complex math equations with KaTex like The emission-absorption optical model from the book [Real Time Volume Rendering by Klaus Engel et al.](http://www.real-time-volume-graphics.org/):

\[I(D) = I_0 e^{-\int_{s_0}^{D} \kappa(t) dt} + \int_{s_0}^D q(s) e^{-\int_{s_0}^{D} \kappa(d) dt} \; ds\]

## `<About/>` - An Online Resume

What's the first thing you do when you want to know something? In this age, that answer is simple: [*you google it*](http://lmgtfy.com/?q=lmgtfy). When an employer is looking for someone, it's really hard to find that exact person, so it's your job to make it easier for them, after all, these people would like some help and desire your skills.
