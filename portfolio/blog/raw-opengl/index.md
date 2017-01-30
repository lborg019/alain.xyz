OpenGL is a cross platform low level graphics API designed as a state machine. The graphics driver manages and maintains the state of your application and you just have to change things like what objects you're currently manipulating.

I've prepared a [repo](http://github.com/alaingalvan/raw-opengl) with a some examples. We're going to walk through a *Hello Triangle* app, a program that creates a triangle, processes it with a shader, and displays it on a window.

## Setup

First install the [Conan Package Manager](https://www.conan.io/downloads), then type the following in your [terminal](https://hyper.is/).

```bash
# Clone the starter repo
git clone https://github.com/alaingalvan/raw-opengl

# Go to the Hello Triangle C++ Example
cd raw-opengl/1-hello-triangle/cpp

# Install dependencies
conan install

# After modifying the code, you can build it with:
conan build
```

### Dependencies

To communicate with OpenGL you need to interface with the OpenGL driver via language specific bindings. The [Khronos Group](https://www.khronos.org/) doesn't distribute an official C or C++ library for OpenGL, but there's a number of libraries generated from the [xml specification](https://www.opengl.org/registry/) for you to use:

- [GLObjects](https://github.com/cginternals/globjects) - Modern C++ Object Oriented OpenGL.
- [OGLplus](https://github.com/matus-chochlik/oglplus) - C++ wrapper to OpenGL, OpenAL, and EGL
- [OOGL](https://github.com/Overv/OOGL) - Intuitive Object Oriented OpenGL bindings
- [Glad](https://github.com/Dav1dde/glad) - Custom C OpenGL Bindings
- [Glew](https://github.com/nigels-com/glew) - C++ 98 OpenGL Bindings
- [FreeGlut](https://github.com/dcnieho/FreeGLUT) - The most famous legacy library for developing in OpenGL, not recommended for new projects

You'll also need a way of generating windows.

- [SFML](https://github.com/SFML/SFML) - Cross platform window/events manager for Windows, Mac, iOS, Linux, Android.
- [GLFW](https://github.com/glfw/glfw) - An OpenGL/Vulkan window library for Windows, Mac, Linux.
- [SDL](https://www.libsdl.org/) - A low level game engine for OpenGL and DirectX with cross platform support.
- [Cocos2DX](https://github.com/cocos2d/cocos2d-x) - A game engine with support for Windows, Mac, Linux, Android, iOS, Web.
- [Cinder](https://libcinder.org/) - An OpenGL Abstraction that's really easy to use.

Alternatively, you could just develop with your own windowing abstraction, or use an exclusive windowing API like `win32`.

## Overview

We're using the following dependencies:

1. **SFML** for window management.
2. **GLObjects** for working with OpenGL.
3. **GLM** for linear algebra data structures.

And our program will perform the following:

1. Create a **Window** for our operating system.
1. Create a **Vertex Buffer**, an array of vertex data such as positions, colors, normals, etc.
1. Create an **Index Buffer**, an array specifying which indices of the vertex buffer you should use to render primitives.
1. Write a **Vertex Shader** that transforms your vertices in 3D Space.
1. Write a **Fragment Shader** that colors the pixels that the triangle envelops.
1. Create a **Program** that binds the two shaders.
1. Tell OpenGL the **Attributes** our vertex data have.
1. Set **Uniforms** from our shader to their values.
1. **Draw** the primitive with `drawElements` or `drawArrays`.
1. **Update** the screen and the state of all your objects you want to draw every frame.
