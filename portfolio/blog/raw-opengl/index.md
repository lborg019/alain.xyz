OpenGL is a low level graphics API designed as a state machine. The graphics driver manages and maintains the state of your application and you just have to change things like what shader you're using, what colors you're clearing the context with, etc.

## Setup

To communicate with OpenGL you simply need to interface with the OpenGL driver via language specific bindings. The OpenGL specification is complex and full of different incompatable versions, platform exclusive extensions, and legacy code which you need to keep in mind while using it. There's a number of libraries that generate bindings for you to use:

- [GLBindings](https://github.com/ghisvail/glbinding) - C++ 11 OpenGL Bindings
- [Glad](https://github.com/Dav1dde/glad) - Custom C OpenGL Bindings
- [Glew](https://github.com/nigels-com/glew) - C++ 98 OpenGL Bindings
- [FreeGlut](https://github.com/dcnieho/FreeGLUT) - The most famous legacy library for developing in OpenGL, not recomended for new projects

> **Call to Action** - build an OpenGL Bindings library for C++ 14 similar to [vulkan.hpp](https://github.com/KhronosGroup/Vulkan-Hpp) that maps directly to WebGL bindings for unified semantics. A lot of bindings have redundant `gl` in the names of all their functions:
> ```cpp
> //Current C++ with redunant `gl`
> gl::glBindBuffer(...);
>
> // Ideal C++
> gl::bindBuffer(...);
>
> // JavaScript
> gl.bindBuffer(...);
> ```

You'll also need a way of generating windows.

- [SFML](https://github.com/SFML/SFML) - Cross platform window/events manager for Windows, Mac, iOS, Linux, Android.
- [GLFW](https://github.com/glfw/glfw) - An OpenGL/Vulkan window library for Windows, Mac, Linux.
- [SDL](https://www.libsdl.org/) - A low level game engine for OpenGL and DirectX with cross platform support.
- [Cocos2DX](https://github.com/cocos2d/cocos2d-x) - A game engine with support for Windows, Mac, Linux, Android, iOS, Web.
- [Cinder](https://libcinder.org/) - An OpenGL Abstraction that's really easy to use.

Alternatively, you could just develop with your own windowing abstraction, or use an exclusive windowing API like `win32`.

Thus we'll only be focusing on the subset of OpenGL that is supported across all modern platforms and is most similar to WebGL, OpenGL ES 3.2.
