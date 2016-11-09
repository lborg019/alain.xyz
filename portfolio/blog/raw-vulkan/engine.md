A rendering engine is a system that manages the creation, updating, and destruction of renderable objects. Often times it's coupled to a lot of complex state like an OS' window, keyboard events, etc.

## Windowing System

Every engine ultamately has to communicate with an underlying window API provided by the operating system.

### Windows 10

For windows you'll need to include the windows header and use the windows main function to create a window.

```cpp
#include "windows.h"

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR pCmdLine, int nCmdShow) {

  // Create a window

  return 0;
}

```

Creating a window is just a matter of calling the `CreateWindowEx` and showing that window.

```cpp
std::string title = "VulkanToy";
std::string name = "VulkanToy";
uint32_t width = 1280;
uint32_t height = 720;

// Attach Console

AllocConsole();
AttachConsole(GetCurrentProcessId());
FILE* stream;
freopen_s( &stream, "CONOUT$", "w+", stdout);
SetConsoleTitle(TEXT(title.c_str()));

bool fullscreen = false;

// Check command line arguments
for (int32_t i = 0; i < __argc; i++) {
  if (__argv[i] == std::string("-fullscreen")) {
    fullscreen = true;
  }
}

WNDCLASSEX wndClass;

wndClass.cbSize = sizeof(WNDCLASSEX);
wndClass.style = CS_HREDRAW | CS_VREDRAW;
wndClass.lpfnWndProc = WndProc;
wndClass.cbClsExtra = 0;
wndClass.cbWndExtra = 0;
wndClass.hInstance = state.hinstance;
wndClass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
wndClass.hCursor = LoadCursor(NULL, IDC_ARROW);
wndClass.hbrBackground = (HBRUSH) GetStockObject(BLACK_BRUSH);
wndClass.lpszMenuName = NULL;
wndClass.lpszClassName = name.c_str();
wndClass.hIconSm = LoadIcon(NULL, IDI_WINLOGO);

if (!RegisterClassEx(&wndClass)) {
  fflush(stdout);
  exit(1);
}

int screenWidth = GetSystemMetrics(SM_CXSCREEN);
int screenHeight = GetSystemMetrics(SM_CYSCREEN);

if (fullscreen) {
  DEVMODE dmScreenSettings;
  memset( & dmScreenSettings, 0, sizeof(dmScreenSettings));
  dmScreenSettings.dmSize = sizeof(dmScreenSettings);
  dmScreenSettings.dmPelsWidth = screenWidth;
  dmScreenSettings.dmPelsHeight = screenHeight;
  dmScreenSettings.dmBitsPerPel = 32;
  dmScreenSettings.dmFields = DM_BITSPERPEL | DM_PELSWIDTH | DM_PELSHEIGHT;

  if ((width != screenWidth) && (height != screenHeight)) {
    if (ChangeDisplaySettings( & dmScreenSettings, CDS_FULLSCREEN) != DISP_CHANGE_SUCCESSFUL) {
      if (MessageBox(NULL, "Fullscreen Mode not supported!\n Switch to window mode?", "Error", MB_YESNO | MB_ICONEXCLAMATION) == IDYES) {
        fullscreen = FALSE;
      }
    }
  }

}

DWORD dwExStyle;
DWORD dwStyle;


if (fullscreen) {
  dwExStyle = WS_EX_APPWINDOW;
  dwStyle = WS_POPUP | WS_CLIPSIBLINGS | WS_CLIPCHILDREN;
} else {
  dwExStyle = WS_EX_APPWINDOW | WS_EX_WINDOWEDGE;
  dwStyle = WS_OVERLAPPEDWINDOW | WS_CLIPSIBLINGS | WS_CLIPCHILDREN;
}

RECT windowRect;
windowRect.left = 0L;
windowRect.top = 0L;
windowRect.right = fullscreen ? (long) screenWidth : (long) width;
windowRect.bottom = fullscreen ? (long) screenHeight : (long) height;

AdjustWindowRectEx( & windowRect, dwStyle, FALSE, dwExStyle);

std::string windowTitle = "WindowTItle";
window = CreateWindowEx(0,
  name.c_str(),
  windowTitle.c_str(),
  dwStyle | WS_CLIPSIBLINGS | WS_CLIPCHILDREN,
  0,
  0,
  windowRect.right - windowRect.left,
  windowRect.bottom - windowRect.top,
  NULL,
  NULL,
  state.hinstance,
  NULL);


if (!fullscreen) {
  // Center on screen
  uint32_t x = (GetSystemMetrics(SM_CXSCREEN) - windowRect.right) / 2;
  uint32_t y = (GetSystemMetrics(SM_CYSCREEN) - windowRect.bottom) / 2;
  SetWindowPos(window, 0, x, y, 0, 0, SWP_NOZORDER | SWP_NOSIZE);
}

if (!window) {
  printf("Could not create window!\n");
  fflush(stdout);
  exit(1);
}

ShowWindow(window, SW_SHOW);
SetForegroundWindow(window);
SetFocus(window);
```

#### Events

Windows lets you listen to events like mouse movements, touch, keyboard, and even Xbox controller messages. All you have to do is create a listener to Windows events and a switch statement to check for each kind of event you're interested in.

```cpp
handleMessages(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
  switch (uMsg) {
    case WM_CLOSE:
      prepared = false;
      DestroyWindow(hWnd);
      PostQuitMessage(0);
      break;
    case WM_PAINT:
      ValidateRect(window, NULL);
      break;
    case WM_KEYDOWN:
      switch (wParam) {
        case KEY_ESCAPE:
          PostQuitMessage(0);
          break;
        case KEY_W:
          camera.keys.up = true;
          break;
        case KEY_S:
          camera.keys.down = true;
          break;
        case KEY_A:
          camera.keys.left = true;
          break;
        case KEY_D:
          camera.keys.right = true;
          break;
      }

      keyPressed((uint32_t) wParam);
      break;
    case WM_KEYUP:
      if (camera.firstperson) {
        switch (wParam) {
          case KEY_W:
            camera.keys.up = false;
            break;
          case KEY_S:
            camera.keys.down = false;
            break;
          case KEY_A:
            camera.keys.left = false;
            break;
          case KEY_D:
            camera.keys.right = false;
            break;
        }
      }
      break;
    case WM_RBUTTONDOWN:
    case WM_LBUTTONDOWN:
    case WM_MBUTTONDOWN:
      mousePos.x = (float) LOWORD(lParam);
      mousePos.y = (float) HIWORD(lParam);
      break;
    case WM_MOUSEMOVE:
      if (wParam & MK_RBUTTON) {
        int32_t posx = LOWORD(lParam);
        int32_t posy = HIWORD(lParam);
        zoom += (mousePos.y - (float) posy) * .005 f * zoomSpeed;
        camera.translate(glm::vec3(-0.0 f, 0.0 f, (mousePos.y - (float) posy) * .005 f * zoomSpeed));
        mousePos = glm::vec2((float) posx, (float) posy);
        viewUpdated = true;
      }
      if (wParam & MK_LBUTTON) {
        int32_t posx = LOWORD(lParam);
        int32_t posy = HIWORD(lParam);
        rotation.x += (mousePos.y - (float) posy) * 1.25 f * rotationSpeed;
        rotation.y -= (mousePos.x - (float) posx) * 1.25 f * rotationSpeed;
        camera.rotate(glm::vec3((mousePos.y - (float) posy) * camera.rotationSpeed, -(mousePos.x - (float) posx) * camera.rotationSpeed, 0.0 f));
        mousePos = glm::vec2((float) posx, (float) posy);
        viewUpdated = true;
      }
      if (wParam & MK_MBUTTON) {
        int32_t posx = LOWORD(lParam);
        int32_t posy = HIWORD(lParam);
        cameraPos.x -= (mousePos.x - (float) posx) * 0.01 f;
        cameraPos.y -= (mousePos.y - (float) posy) * 0.01 f;
        camera.translate(glm::vec3(-(mousePos.x - (float) posx) * 0.01 f, -(mousePos.y - (float) posy) * 0.01 f, 0.0 f));
        viewUpdated = true;
        mousePos.x = (float) posx;
        mousePos.y = (float) posy;
      }
      break;
    case WM_SIZE:
      if ((prepared) && (wParam != SIZE_MINIMIZED)) {
        destWidth = LOWORD(lParam);
        destHeight = HIWORD(lParam);
        if ((wParam == SIZE_MAXIMIZED) || (wParam == SIZE_MINIMIZED)) {
          windowResize();
        }
      }
      break;
    case WM_EXITSIZEMOVE:
      if ((prepared) && ((destWidth != width) || (destHeight != height))) {
        windowResize();
      }
      break;
  }
}
```

### Android

Todo.

## Resizing

When handling resizing, you will need to free previously staged Vulkan data structures and allocate them again.

## Text

Displaying text is crutial to any application, and rendering engines are no different in that regard.