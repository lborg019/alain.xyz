Making web apps has gotten pretty complicated, it seems every language and company wants to come up with their own way of doing it! Deep down all we're doing is serving `html`, `css`, and `javascript` to a user, but there's a lot to bear in mind:

 - **New Language Features** - like modules, generators, decarators, promises, async/await, etc.
 - **Legacy Suport** (polyfills, shims, vendor prefixes) for JavaScript
 - **Backend Programming** - Writing a server in **JavaScript**, **Python**, **Go**, **C++**, you name it.
 - **Automation** - streaming tasks like compiling our apps and compressing our images and making icon fonts. 
 - **Deploying** your app with services like [Docker](http://docker.com/), [AWS](http://aws.amazon.com/), [DigitalOcean](http://digitalocean.com/), etc.
 - **Dev Ops** - load balancing your app, working with microservices and a polyglot architecture.
 - **Testing** - unit testing your app, linting, type checking, etc.

Frankly, *it can be overwelming*, there's __no way__ you'll know how every part works, but to quote [Brenna O'Brien](http://brennaobrien.com/) it's better to just *"be aware"* of these technologies and focus on what you love.

At the same time, there's no excuse to not know about web development, machine learning, graphics, compilers, game development, not when there's so many books published by [O'Reilly](http://www.oreilly.com/), [Packt](https://www.packtpub.com/), [Manning Publications](https://manning.com/), [CRC Press](https://www.crcpress.com/), etc. 

## Learning Web Technologies

[Eric Elliott](https://medium.com/javascript-scene/forget-the-click-bait-here-s-what-the-javascript-job-market-really-looks-like-in-2016-ddfe0d39b467), Author of [Programming JavaScript Applications](http://chimera.labs.oreilly.com/books/1234000000262) described what was also chimed by [JavaScript Jabber](https://devchat.tv/js-jabber/183-jsj-should-i-go-to-college-) in "Should I go to College?", the need for developer to be:

1. Willing to change, to learn new things. Keep up with the latest trends, updates, etc. Though this can eventually lead to [Tooling Fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.wlgiv0k8c).

2. Be a good communicator and collaborator, so try contributing to [open source projects](http://fossrit.github.io/HowToFOSS/)!

3. Talk with recruiters and apply like crazy! [Facebook](https://www.facebook.com/careers/), [Twitter](https://careers.twitter.com), [Tumblr](https://www.tumblr.com/jobs), [Nvidia](http://www.nvidia.com/object/careers.html), you name the company, they're hiring! Even if just for an internship, a few 10Ks doesn't hurt. 😉

4. **Enjoy it**. You'll never get anywhere if you don't like what you're doing.

### Javascript

**Javascript** has tons of little languages you can use, and that's besides just the frameworks and libraries available.
 * [TypeScript](http://typescriptlang.org/) - JavaScript Beta + Types
 * [CoffeeScript](http://coffeescript.org/) - Tiny JavaScript
 * [NativeScript](https://www.nativescript.org/) - JavaScript + Native Objects
 * [PureScript](http://www.purescript.org/) - JavaScript + Functional Programming

#### Frameworks

We're saturated with frontend frameworks, [TodoMVC](http://todomvc.com) has a pretty good list of them all:

 * [React](https://facebook.github.io/react/) - Facebook's Unopinionated View Layer, follows the GNU style of a single library that does one thing very well. Used by Wordpress Calypso.

 * [Angular 2](http://angular.io/) - The next version of Angular, adopting new standards like `@decorator`, `class`, ES6 modules, etc.

 * [Ember](http://emberjs.com/) - One of the first MVC frameworks for front end development. In use in places like Groupon or for the Ghost CMS.

 * [Vue](http://vuejs.org/) - A very Tiny view library developed as a side project from [Evan You](https://twitter.com/youyuxi), a Meteor Dev.

### CSS

There's been a lot of debate on the Cascading and Sheets portion of CSS, with talks like [The End of Global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284#.ua7uwi4s6).

**PostCSS** - Converts CSS to an abstract syntax tree that can be modified very quickly, [Benchmarks](https://github.com/postcss/benchmark) put PostCSS as even faster than LibSass, the C++ Sass implementation.

**CSSNext** - A PostCSS plugin that adds CSS4 features.

**BEM** - A design methodology as an acronym, Block, Element, Modifier.

### Community Outreach

The Web Community is huge and friendly, always working on new features, libraries, posts and talks! I've been learning a lot just from:

*Watching* __Conferences Talks__ from:
  * [JSConf](http://jsconf.com/)
  * [ngConf](http://www.ng-conf.org/)
  * [nodeConf](http://nodeconf.com/)
  * [Wix Tech Talks](https://www.youtube.com/user/WixTechTalks)
  * [
O'Reilly](https://www.youtube.com/user/OreillyMedia)
  * [Google Developers](https://www.youtube.com/user/GoogleDevelopers)

*Reading* **Blog Posts** from:
* [Facbook Engineering Blog](https://code.facebook.com/posts)
* [Google Developers](https://medium.com/google-developers)
* [Codepen Blog](http://blog.codepen.io/)
* [Tumblr Developers](http://developers.tumblr.com/)
* [Scotch.io](https://scotch.io/)

*Reading* **Books** like:
* [Elequent Javascript](http://eloquentjavascript.net/) by [Marijn Haverbeke](https://marijnhaverbeke.nl/)
* [Programming Javascript Applications](http://chimera.labs.oreilly.com/books/1234000000262) by [Eric Elliott](https://ericelliottjs.com/)
* [GitBook](https://www.gitbook.com/explore) - A Free Book Community

*Listening* to **Podcasts** like:
* [Codepen Radio](http://blog.codepen.io/radio/)
* [ShopTalk](http://shoptalkshow.com/)
* [Javascript Jabber](https://devchat.tv/js-jabber/)
* [The Web Ahead](http://5by5.tv/webahead)
javascript air

*Working* on **Projects** and talking in communities like:
* [Codepen](http://codepen.io)
* [r/web_design](http://reddit.com/r/web_design/)
* [r/webdev](http://reddit.com/r/webdev/)

 *Grabbing* **Free Resources** from places like:
 * [Let's Encrypt](https://letsencrypt.org/) - Free SSL Certificates
 * [FbStart](https://fbstart.com/) -  new program from Facebook designed to help early stage mobile startups build and grow their apps.
 * [Github Education](https://education.github.com/) - Dozens of free resources from great companies to help students learn.

## File Structure

One way to be sure of what you're doing is to know what good file structure is like. What I love about places like Scotch.io is that they acknowledge this by always starting off a post with the project structure.

**File Structure** is a lot like organizing an *Analog Synth*, if you let it, the wires can look like a *spagetti or a spider web*.

Two organizational patterns I've noticed are:

#### Sorted By File Type - Game Maker Studio

This has been done for years in Game Engines like [Game Maker Studio](http://www.yoyogames.com/studio/workflow/dev-env), [Unity](https://www.assetstore.unity3d.com/en/#!/content/29140), [Unreal Engine](https://docs.unrealengine.com/latest/INT/Resources/ContentExamples/), and with web apps like [Prepros](https://github.com/Subash/Prepros/tree/master/application/app), [Adobe Brackets](https://github.com/adobe/brackets/tree/master/src). When working with teams creating different portions of the same component, this model worked really well.

```bash
|- sprites/
  |- player/
    |- spr_player_idle_left # Sorta like CSS BEM
|- backgrounds/
|- sounds/
|- scripts/
|- objects/
|- rooms/
```

#### Sorted by Component - Wordpress Calypso

Makes your file structure look more like a dependency tree, and has been adopted by a number of programmers, from Unity developer [Keijiro Takahashi](https://github.com/keijiro/KvantSwarm/tree/master/Assets) to [Mark Dalgleish](http://markdalgleish.com/) in his talk *The End of Global CSS*, to the [Wordpress Calypso](https://github.com/Automattic/wp-calypso/tree/a265f8b02335a7af03ff028b1c79e2b5b40fd5e0/client/components), their new React/Express frontend app.

```bash
|- client/
  |- components/
      |- gravatar/
        |- index.jsx
        |- style.scss
      |- site-selector-modal/
      |- ...
  |- auth/
  |- post-editor/
  |- ...
```

#### Sorted by Module - Angular 2.0 Beta Structure

Angular 2 organized it's files in regular folders, with a corresponding `.ts` file for the folder they want to export.

```bash
|- src
  |- common/
    |- directives/
    |- forms/
    |- pipes/
    |-directives.ts # export all of directives/, could also be done with an index.ts file.
    |- ...
  |- core/
  |- ...
|- common.ts # export * from 'common'
|- core.ts
|- ...
|- tsconfig.json
```

### Generators & Boilerplates

You can get a lot more done a lot faster if you automatically generate your code, or have some way to start.

**Ruby** has had generators for a long time, so it's only natural for the features of that language to bleed into JavaScript.

 * [Yeoman](http://yeoman.io/) - Scaffold out your application with some yeoman generators, making say, angular directives from one command vs googling an implementation and forking that.
 * [SlushJS](http://slushjs.github.io/) - Another Scaffolding tool based on GulpJS.

## Routes

![Pokemon Route 1](assets/route1.png)

Idealistically, you want the URLs of your website to be expressive, which URL do you think is better:

| CodePen.io | Ebay.com |
|:----------:|:--------:|
| `codepen.io/alaingalvan/pen/jPMXXj` | `ebay.com/itm/Apple-iPad-Pro-32GB-Wi-Fi-12-9in-Gold-Latest-Model-ML0H2LL-A-New-Sealed-/301798988450`|

Codepen describes their routes perfectly, it's clear that this is Alain's pen of slug jPMXXj. Ebay decides to shorthand **item** to `/itm/...` include a messy version of the item's title in the link, and some random number.

In the backend, Codepen is powered by Ruby, so they probably use [Sinatra](http://www.sinatrarb.com/intro.html#Routes) to handle routes. Routes used to be a topic exclusive to the backend of a website but now front end frameworks can handle them too thanks to html5 mode.

## Deployment | The Web Obesity Crisis

Just like how in a C/C++ application, `FORCEINLINE void YourFunction()` will cause the machine code of the function to be injected wherever it's called (causing a boost in performance in exchange for file size), combining and minifying your webapp will cause your app to perform faster by making less requests.

There's a debate on combining your files or serving them individually, Guest Speaker [Nik Molnar @ Javascript Jabber](https://devchat.tv/js-jabber/190-jsj-web-performance-part-2-with-nik-molnar) said HTTP/2 is making that obsolete, but for years the web has said [*Combine your Files to One*](https://browserdiet.com/en/#combine-js).

The fact is, __Web Obesity__ is a big problem. [Maciej Ceglowski's *The Website Obesity Crisis*](https://vimeo.com/147806338) is a great talk that describes this, but let's look at *some solutions to web obesity*, project management, asset management, etc. For every 100 ms of response time, amazon lost 1% of sales. [Esty](https://twitter.com/lara_hogan/status/444250723614605312) saw an increased bounce rate of 12% on mobile if 160kb of images were on the page. 

You can use automators like [Gulp](http://gulpjs.com/), [Grunt](http://gruntjs.com/), [GNU Make](http://www.gnu.org/software/make/manual/make.html), or [Chron Jobs](http://www.themechanism.com/voice/2012/08/28/getting-node-js-and-cron-to-play-nicely/) to process/deploy your files automatically, but there is [some debate on using automators](https://medium.com/@preslavrachev/gulp-vs-grunt-why-one-why-the-other-f5d3b398edc4#.rfcpoz3vy).

1. **Verify** your Code and **Lint** it!

    [JSCS](https://github.com/jscs-dev/node-jscs) is a module that's used by Three, jQuery, Ember, Angular 1, and more to make sure your code is formatted and follows certain standards established by a given project.

2. **Compile** your preprocessor languages.

    I'm using PostCSS and Typescript, and compile it all with gulp.

    I'm using PostCSS along with:
     * [Autoprefixer](https://github.com/postcss/autoprefixer)
     * [CSS Next](https://github.com/cssnext/postcss-cssnext)
     * [Style Guide Generator](https://github.com/morishitter/postcss-style-guide)


3. **Combine** and Minify.

    Compile `.ts` / `.js` with the Typescript Compiler in Gulp by itself, or use [browserify](http://browserify.org/) and [uglifyJS](http://lisperator.net/uglifyjs/) with [this workflow](https://github.com/remojansen/modern-workflow-demo).



For the smallest .jpeg, .png, .svg files, as well as sprite sheets, you'll need a system that can compress, [texture atlas (if applicable)](http://www.creativeshrimp.com/game-level-texturing-texture-atlas-part-35.html), and [mipmap](https://msdn.microsoft.com/en-us/library/windows/desktop/bb206251%28v=vs.85%29.aspx) your images. [Responsive Images, a talk Jason Grigsby gave on "The Web Ahead"](http://5by5.tv/webahead/99) goes over new browser features to tackle mipmap routing.

 * [Imagemin](https://github.com/imagemin/imagemin) - a bundled image compressor that compresses `.gif`, `.jpeg`, `.png`, and `.svg` files.
 
 * [Sharp](https://github.com/lovell/sharp) - a tool to shrink your images down.

You could also compile your whole app to static files on the server for [SEO](http://static.googleusercontent.com/media/www.google.com/en//webmasters/docs/search-engine-optimization-starter-guide.pdf):

 * [Angular 2 Seed](https://github.com/mgechev/angular2-seed) - A seed project to build static Angular 2 apps.

 * [Jekyll](https://jekyllrb.com/) - Github's solution to repo pages.


## Conclusion

This guide sorta scratches the surface, but then there's developing mobile/desktop apps using web technologies, stuff like [Windows 8/Windows 10 apps](https://msdn.microsoft.com/en-us/library/windows/apps/mt244352.aspx), [Apache Cordova](https://cordova.apache.org/), [Meteor](https://www.meteor.com/), [Electron](http://electron.atom.io/), and [nw.js](http://nwjs.io/).

