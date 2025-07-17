# Real-Time Waveform Implementation

This document describes the implementation of a real-time waveform generation and playback system for the AcuVoice React Native app.

## Overview

The waveform system provides:
- **Real-time waveform generation** during recording
- **Pause/resume functionality** with visual feedback
- **Playback waveform display** with gesture controls
- **Data persistence** for accurate waveform recreation
- **Smooth UI rendering** with optimized performance

## Components

### 1. RealTimeWaveform Component
**Location**: `components/RealTimeWaveform.tsx`

**Features**:
- Generates waveform data in real-time during recording
- Pauses waveform generation when recording is paused
- Resumes seamlessly when recording resumes
- Provides visual feedback with animated indicators
- Supports configurable data point limits for performance

**Props**:
```typescript
interface RealTimeWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onWaveformDataUpdate?: (data: WaveformData[]) => void;
  maxDataPoints?: number; // Default: 200
}
```

**Usage**:
```typescript
<RealTimeWaveform
  isRecording={recorderState.isRecording}
  isPaused={isPaused}
  duration={recordingDuration}
  onWaveformDataUpdate={handleWaveformDataUpdate}
  maxDataPoints={200}
/>
```

### 2. PlaybackWaveform Component
**Location**: `components/PlaybackWaveform.tsx`

**Features**:
- Displays recorded waveform data during playback
- Supports gesture-based seeking (pan gestures)
- Visual progress indicator
- Rewind/forward controls
- Time display with current position

**Props**:
```typescript
interface PlaybackWaveformProps {
  waveformData: WaveformData[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onSeek?: (time: number) => void;
  onRewind?: () => void;
  onForward?: () => void;
}
```

**Usage**:
```typescript
<PlaybackWaveform
  waveformData={waveformData}
  duration={duration}
  currentTime={currentTime}
  isPlaying={isPlaying}
  onSeek={handleSeek}
  onRewind={handleRewind}
  onForward={handleForward}
/>
```

## Data Structures

### WaveformData Interface
```typescript
interface WaveformData {
  amplitude: number;  // 0.0 to 1.0
  timestamp: number;  // Unix timestamp
}
```

### AudioMetadata Interface
```typescript
interface AudioMetadata {
  duration: number;
  waveformData: WaveformData[];
  fileSize?: number;
  sampleRate?: number;
  channels?: number;
}
```

## AudioService

**Location**: `services/audioService.ts`

**Key Methods**:

### generateWaveformData(duration: number)
Generates realistic waveform data for a given duration.

### generateRealisticAmplitude(index: number, totalPoints: number)
Creates realistic amplitude patterns with:
- Base amplitude variation using sine waves
- Random variation for natural sound
- Silence periods for realistic audio patterns

### compressWaveformData(waveformData: WaveformData[], maxPoints: number)
Compresses waveform data to a specified number of points while maintaining visual quality.

### saveAudioMetadata(recordingId: string, metadata: AudioMetadata)
Saves waveform data and metadata to AsyncStorage for persistence.

### loadAudioMetadata(recordingId: string)
Loads saved waveform data and metadata from AsyncStorage.

## Integration

### Recording Flow
1. User starts recording
2. `RealTimeWaveform` begins generating data
3. Data is collected via `onWaveformDataUpdate` callback
4. When recording stops, data is saved to outbox with waveform
5. Waveform data is persisted for later playback

### Playback Flow
1. User selects a recording for playback
2. `PlaybackWaveform` displays the saved waveform data
3. User can interact with waveform using gestures
4. Seeking, rewind, and forward controls are available

## Performance Optimizations

### Real-time Generation
- Data collection limited to 200 points by default
- Updates every 100ms for smooth visualization
- Automatic cleanup of intervals and animations

### Rendering
- Efficient bar width calculation based on screen size
- Optimized re-renders with proper key props
- Animated values for smooth transitions

### Data Management
- Waveform compression for large recordings
- AsyncStorage persistence with error handling
- Memory-efficient data structures

## Gesture Controls

### Seeking
- Pan gesture on waveform area
- Real-time visual feedback during drag
- Smooth animation to final position
- Time display updates during interaction

### Rewind/Forward
- 10-second increments
- Visual feedback with button states
- Smooth transitions between positions

## Customization

### Styling
Components use consistent styling with the app's design system:
- Primary color: `#00AEEF`
- Secondary color: `#FF9500`
- Background: `#f8fafc`
- Text: `#64748b`

### Configuration
- Adjustable data point limits
- Configurable update intervals
- Customizable animation durations
- Flexible bar width calculations

## Error Handling

- Graceful fallback for missing waveform data
- Error boundaries for component failures
- AsyncStorage error handling
- Console logging for debugging

## Future Enhancements

### Planned Features
1. **Real audio analysis**: Integrate with actual audio processing
2. **Frequency visualization**: Add frequency domain analysis
3. **Waveform editing**: Allow users to edit waveform data
4. **Export capabilities**: Save waveform as image or data
5. **Advanced gestures**: Pinch to zoom, double-tap to seek

### Performance Improvements
1. **WebGL rendering**: Use WebGL for large waveforms
2. **Virtual scrolling**: Handle very long recordings
3. **Background processing**: Move analysis to background threads
4. **Caching**: Implement waveform data caching

## Dependencies

- `react-native-gesture-handler`: For gesture controls
- `@react-native-async-storage/async-storage`: For data persistence
- `expo-audio`: For audio recording and playback
- `react-native`: Core React Native components

## Usage Example

```typescript
// In your recording screen
const [waveformData, setWaveformData] = useState<WaveformData[]>([]);

const handleWaveformDataUpdate = (data: WaveformData[]) => {
  setWaveformData(data);
};

// During recording
<AudioRecorder
  onRecordingComplete={handleRecordingComplete}
  onWaveformDataUpdate={handleWaveformDataUpdate}
  // ... other props
/>

// During playback
<AudioPlayer
  audioUri={recordedUri}
  waveformData={waveformData}
  audioDuration={duration}
  // ... other props
/>
```

This implementation provides a complete, production-ready waveform system that enhances the user experience with visual feedback and intuitive controls. 