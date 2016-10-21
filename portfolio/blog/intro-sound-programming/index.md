[Shadertoy](https://www.shadertoy.com/) proved that being a good rendering engineer is just like being a good sound engineer, and that the mathematics and code for both are for the most part the same.

## The Physics of Sound


![Sound Wave](assets/c5-wave.gif)

**Sound** is a series of compressions and decompressions in the air.
Instantaneous acoustic pressure (current sound) is the ambient atmospheric pressure plus perturbation (basically noise) caused by sound wave at a determined instant in time.


\[P_{inst} = P_{atmos} + P_{sound}\]

This is similar to lighting models like Phong.

\[I_{total} = I_{diffuse} + I_{specular} + I_{ambient}\]


## Fourier Transform

The Fourier Transform allows us to make the conversion from the Analog *(Continuous)* to Discrete *(Digital)* Signal. This falls in the extensive and math intensive realm of Signal Processing. For now lets just keep in mind that the Fourier Transform is able to convert an analog signal into the frequencies which it make up that signal.
We 'slice' analog signal and convert such slices into digital signal. The more slices we have, the more accurate we are in relation to the analog signal. This is called sampling. 44.1kHz per second sample is what is known as 'CD-Quality'.

Sound recording happen in the following fashion:
Microphones capture the analog signal; an analog to digital converter (hardware) performs the Fourier Transform which converts the sound into digital information (stores audio frequencies in a .wav file for example). When that wave file is executed, the computer fetches the frequencies, passes them to a digital to analog converter, and your speakers vibrate according to those frequencies, compressing and decompressing the air, producing sound.
This process is what is known as Pulse Code Modulation and it is used by .wav audio format.

#### Cooley-Tukey Algorithm
The Cooley-Tukey algorithm allows for a much faster calculation of the Fourier Transform.
There are many hardware and software implementations with some form of the Fast Fourier Transform.

## Sampling
![Shadertoy sound image](assets/supermarioaudio.gif)
> Source: [Krzysztof Narkowicz](https://twitter.com/knarkowicz)'s Mario 1-1 Siggraph Entry

Sound on computers is represented by tiny changes on the speaker every *1 / 44100* seconds. (That sounds like a lot more than 60 fps). By themselves, these changes will just sound like pops or won't sound like anything at all, but given enough time, they can sound like anything!

Behind the scenes what happens is, shadertoy converts whatever sound you write into a 512x512 image with 1/fps seconds of encoded information of that sound, sends it to an AudioContext object, and that plays it.

```c
//Get current sample location
float t = iiBlockOffset + (gl_FragCoord.x + gl_FragCoord.y * 512.0) / 44100.0;

//Get Song Function
vec2 y = mainSound(t);

//Encode Output
vec2 v = floor((0.5 + 0.5 * y) * 65536.0); //convert to 16 bit int.
vec2 vl = mod(v, 256.0) / 255.0; //Get decimal portion
vec2 vh = floor(v / 256.0) / 255.0; //Get int portion

gl_FragColor = vec4(vl.x, vh.x, vl.y, vh.y);
```

In Javascript, this is what's happening behind the scenes'

```javascript
//Initialize Context
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

var AudioContext = window.AudioContext || window.webkitAudioContext;
var wa = new AudioContext();

//Audio Ini
var mSampleRate = 44100;
var mPlayTime = 60; //fps
var mPlaySamples = mPlayTime * mSampleRate;
var mBuffer = wa.createBuffer(2, mPlaySamples, mSampleRate);


var bufL = mBuffer.getChannelData(0);
var bufR = mBuffer.getChannelData(1);

var mTextureDimensions = 512;
var mTmpBufferSamples = mTextureDimensions * mTextureDimensions;
var mData = new Uint8Array(mTmpBufferSamples * 4);

var numBlocks = mPlaySamples / mTmpBufferSamples;
for (var j = 0; j < numBlocks; j++) {
  var off = j * mTmpBufferSamples;

  gl.uniform1f(l2, off / mSampleRate);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

//Read encoded information
  gl.readPixels(0, 0, mTextureDimensions, mTextureDimensions, gl.RGBA, gl.UNSIGNED_BYTE, mData);

  for (var i = 0; i < mTmpBufferSamples; i++) {
    bufL[off + i] = -1.0 + 2.0 * (mData[4 * i + 0] + 256.0 * mData[4 * i + 1]) / 65535.0;
    bufR[off + i] = -1.0 + 2.0 * (mData[4 * i + 2] + 256.0 * mData[4 * i + 3]) / 65535.0;
  }
}
```

DSP
Microphone: Converts analog signal to digital
Speaker: Converts digital to analog

Basic audio definitions:
**Sample** - One measurement of audio data. For Pulse Code Modulation (PCM) encoding, a sample is an instantaneous representation of the voltage of the analog audio. There are other types of encoding, like u-law and a-law, that are rarely used.

**Sampling Rate** - The number of samples in one second. Measured in Hertz (Hz) or kiloHertz (kHz). The most common sampling rate is 44.1 kHz (CD quality).

**Sample Size** - Number of bits in one sample. It is typically a multiple of eight because data is stored in 8-bit bytes. Most common sample size is *16 bits*, which is CD quality audio.

As a comparison, *8 bits* is the number of bits in a single channel of color for images, so imagine a stereo sound as an *image with only red and blue*.

**Channel** - Stereo is the most common form of multi-channel audio (one independent left and one independent right -channel). Higher-end audio formats include 5.1 and 7.2 surround (6 and 9 channels respectively).

**Frame** -  a cross section of samples across all channels in the audio file.
So, a 16-bit stereo (two-channel) audio file will have 32-bit frames (16 bits per sample * 2 channels per frame = 32 bits per frame)

## Practical Example - Polyphony

```c
/*************************************************************************
* Synth Primitives
* Everything you should need to get sound on your shaders!
* Last Updated: Sun Jan 14 2016 @ 12:00PM EST
* By Alain Galvan (Alain.xyz) | Lukas Borges (Lukas.xyz)
**************************************************************************
* Constants
*************************************************************************/
#define TAU 6.283185

/*************************************************************************
* Utilities
*************************************************************************/
// note number to frequency
float ntof(float n)
{
    return 440.0 * pow(2.0, (n - 69.0) / 12.0);
}

/*************************************************************************
* Synths
*************************************************************************/
//Sin
float synthSin(float f, float x) {
    return sin(mod(f * x * TAU, TAU));
}

float synthSquare(float f, float x)
{
    return floor( 2.0 * floor( f * x ) - floor( 2.0 * f * x ) + 1.0 );
}

float synthNoise( float x )
{
    return fract( sin( 123523.9898 * x ) * 43758.5453 );
}

/*************************************************************************
* Main
*************************************************************************/
vec2 mainSound(float time)
{
    float tone = synthSquare(ntof(67.0), time);
    float tone2 = synthSquare(ntof(74.0), time);
    float tone3 = synthSquare(ntof(79.0), time);
    return vec2(mix(tone3, mix(tone,tone2, 0.5),0.5));
}
```


