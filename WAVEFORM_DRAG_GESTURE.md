# Enhanced Waveform Component with Drag Gesture Support

## Overview

The `PlaybackWaveform` component has been enhanced with smooth drag gesture support, allowing users to seek through audio by dragging left or right on the waveform. This feature works alongside the existing tap-to-seek functionality.

## Features

### 🎯 Dual Gesture Support
- **Tap to Seek**: Users can tap anywhere on the waveform to jump to that position
- **Drag to Seek**: Users can drag left or right to smoothly scrub through the audio

### 🎨 Visual Feedback
- **Drag Overlay**: A subtle blue overlay appears when dragging to indicate active gesture
- **Haptic Feedback**: Light haptic feedback when drag starts, medium when it ends
- **Smooth Animations**: Fade-in/fade-out animations for visual feedback

### ⚡ Performance Optimized
- **Gesture Conflict Prevention**: Prevents conflicts between drag gestures and tap gestures
- **Throttled Updates**: Optimized to prevent excessive re-renders during dragging
- **Native Driver**: Uses native driver for smooth animations

## Usage

### Basic Implementation

```tsx
import { PlaybackWaveform, PlaybackWaveformRef } from './components/PlaybackWaveform';

const MyAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<PlaybackWaveformRef>(null);

  const handleSeek = (time: number) => {
    console.log('Seeking to:', time);
    setCurrentTime(time);
    // Update your audio player position here
  };

  const handlePlayerStateChange = (playerState: any) => {
    console.log('Player state changed:', playerState);
  };

  const handlePanStateChange = (isMoving: boolean) => {
    console.log('Pan state:', isMoving);
  };

  return (
    <PlaybackWaveform
      ref={waveformRef}
      audioPath="path/to/audio/file.mp3"
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      onSeek={handleSeek}
      onPlayerStateChange={handlePlayerStateChange}
      onPanStateChange={handlePanStateChange}
    />
  );
};
```

### Advanced Usage with Audio Controls

```tsx
const AudioPlayerWithControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<PlaybackWaveformRef>(null);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    // Update your audio player
    if (audioPlayer) {
      audioPlayer.seekTo(time);
    }
  }, [audioPlayer]);

  const handlePlayPause = () => {
    if (isPlaying) {
      waveformRef.current?.pausePlayer();
    } else {
      waveformRef.current?.startPlayer();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View>
      <PlaybackWaveform
        ref={waveformRef}
        audioPath={audioUri}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onPlayerStateChange={handlePlayerStateChange}
        onPanStateChange={handlePanStateChange}
      />
      
      <TouchableOpacity onPress={handlePlayPause}>
        <Text>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `audioPath` | `string` | Yes | Path to the audio file |
| `isPlaying` | `boolean` | Yes | Whether audio is currently playing |
| `currentTime` | `number` | Yes | Current playback position in seconds |
| `duration` | `number` | Yes | Total duration of audio in seconds |
| `onSeek` | `(time: number) => void` | No | Callback when user seeks to a position |
| `onPlayerStateChange` | `(playerState: any) => void` | No | Callback when player state changes |
| `onPanStateChange` | `(isMoving: boolean) => void` | No | Callback when drag gesture state changes |

## Gesture Configuration

The drag gesture is configured with the following settings for optimal user experience:

```tsx
<PanGestureHandler
  onGestureEvent={handlePanGesture}
  activeOffsetX={[-5, 5]}     // Require 5px horizontal movement to activate
  failOffsetY={[-15, 15]}     // Fail if vertical movement exceeds 15px
  minDist={5}                 // Minimum distance to start gesture
>
```

### Gesture Sensitivity
- **Horizontal Activation**: 5px movement required to start drag
- **Vertical Tolerance**: 15px vertical movement allowed before gesture fails
- **Minimum Distance**: 5px minimum distance to trigger gesture

## Technical Implementation

### Gesture Handling
1. **PanGestureHandler**: Wraps the waveform component for drag detection
2. **State Management**: Tracks drag state to prevent conflicts with tap gestures
3. **Position Calculation**: Converts drag translation to audio time position
4. **Visual Feedback**: Animated overlay shows active drag state

### Conflict Prevention
- **isDraggingRef**: Prevents waveform library gestures during custom drag
- **isSeekingRef**: Prevents external updates during user interaction
- **Timeout Management**: Allows waveform to settle after gesture ends

### Performance Optimizations
- **useCallback**: Memoized gesture handlers prevent unnecessary re-renders
- **useRef**: Direct ref access for performance-critical operations
- **Native Driver**: Hardware-accelerated animations for smooth feedback

## Dependencies

The enhanced component requires these dependencies (already included in your project):

```json
{
  "react-native-gesture-handler": "~2.24.0",
  "react-native-reanimated": "~3.17.4",
  "expo-haptics": "~14.1.4",
  "@simform_solutions/react-native-audio-waveform": "^2.1.5"
}
```

## Troubleshooting

### Gesture Not Working
1. Ensure `GestureHandlerRootView` wraps your app (already configured)
2. Check that `react-native-gesture-handler` is properly installed
3. Verify gesture handler is not being blocked by other touch handlers

### Performance Issues
1. Ensure `useCallback` is used for all gesture handlers
2. Check that `useNativeDriver: true` is set for animations
3. Monitor console for excessive re-renders

### Haptic Feedback Not Working
- Haptic feedback is wrapped in try-catch and will gracefully fail on unsupported devices
- Check that `expo-haptics` is properly installed

## Example Console Output

When using the component, you'll see helpful debug logs:

```
📏 Container width updated: 350
✅ Waveform player initialized
👆 Drag gesture started
🔄 Dragging to time: 15.23
👆 Drag gesture ended
⏰ Waveform tap seeking to time: 8.45
```

## Migration from Previous Version

If you're upgrading from the previous version:

1. **No Breaking Changes**: All existing props and functionality remain the same
2. **Enhanced Gestures**: Drag gestures are automatically available
3. **Optional Features**: Visual feedback and haptics are automatically enabled
4. **Backward Compatible**: Existing tap-to-seek functionality works unchanged

The enhanced component is a drop-in replacement that adds drag gesture support without requiring any changes to existing implementations. 