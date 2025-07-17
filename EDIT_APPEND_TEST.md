# Edit & Append Feature - Test Guide

## Test Scenarios

### 1. Basic Recording Flow
**Steps:**
1. Open the app and navigate to the Record tab
2. Tap the mic button to start recording
3. Record for 10-15 seconds
4. Tap Stop to finish recording
5. Verify playback works correctly

**Expected Results:**
- Recording starts when mic is tapped
- Timer shows recording duration
- Stop button ends recording
- Playback screen shows with waveform
- Audio plays correctly

### 2. Edit & Append - First Append
**Steps:**
1. Complete a basic recording (from Test 1)
2. On playback screen, tap "Edit & Append" button
3. Verify recording screen shows append mode
4. Tap "Resume Recording" to start appending
5. Record additional 10-15 seconds
6. Tap Stop to finish appending

**Expected Results:**
- Recording screen shows "Appending to [X:XX] recording"
- Timer shows total duration (previous + current)
- "Resume Recording" button is displayed
- After stopping, segments are concatenated
- Final recording includes both segments
- Segment count shows "2 segments"

### 3. Edit & Append - Multiple Appends
**Steps:**
1. Complete Test 2 (one append)
2. On playback screen, tap "Edit & Append" again
3. Record another 10-15 seconds
4. Tap Stop to finish
5. Repeat for 3-4 total segments

**Expected Results:**
- Each append adds to the total duration
- Segment count increases with each append
- All segments are properly concatenated
- Waveform shows combined audio
- Final recording contains all segments

### 4. File Management Test
**Steps:**
1. Complete multiple appends (from Test 3)
2. Tap "New Recording" button
3. Start a completely new recording
4. Check file system for cleanup

**Expected Results:**
- Previous session files are cleaned up
- New recording starts fresh
- No leftover temporary files
- New session ID is generated

### 5. Error Handling Test
**Steps:**
1. Start recording
2. Force close app during recording
3. Reopen app and check for cleanup
4. Start new recording

**Expected Results:**
- App handles interruption gracefully
- Temporary files are cleaned up on restart
- New recording works normally

## Verification Checklist

### UI Elements
- [ ] Mic button starts recording
- [ ] Timer displays correctly
- [ ] Pause/Resume buttons work
- [ ] Stop button ends recording
- [ ] Playback screen shows waveform
- [ ] Edit & Append button is prominent
- [ ] Segment count badge appears
- [ ] Loading states show during concatenation

### Audio Functionality
- [ ] Recording quality is maintained
- [ ] Playback works correctly
- [ ] Segments are properly concatenated
- [ ] Total duration is accurate
- [ ] Waveform data is merged correctly

### File Management
- [ ] Temporary files are created during recording
- [ ] Session files are created after concatenation
- [ ] Temporary files are cleaned up on new recording
- [ ] Final files are saved to outbox
- [ ] No file system bloat occurs

### State Management
- [ ] Session ID is generated correctly
- [ ] Segment index increments properly
- [ ] Append mode state is managed correctly
- [ ] Duration calculations are accurate
- [ ] Waveform data is preserved across segments

## Common Issues & Solutions

### Issue: Recording doesn't start
**Solution:** Check microphone permissions and audio mode settings

### Issue: Append mode not working
**Solution:** Verify `isAppending` state and `handleEditResume` function

### Issue: Files not cleaning up
**Solution:** Check `cleanupTempFiles` function and session ID logic

### Issue: Concatenation fails
**Solution:** Verify `concatenateAudioSegmentsWithFileManagement` function

### Issue: Waveform not showing
**Solution:** Check `AudioWaveformService` and waveform data format

## Performance Metrics

### Expected Performance
- Recording start time: < 1 second
- Concatenation time: < 5 seconds for 2-3 segments
- File cleanup time: < 2 seconds
- Memory usage: < 100MB for typical sessions
- Storage efficiency: Only final files kept

### Monitoring Points
- Console logs for session management
- File system usage during recording
- Memory usage during concatenation
- UI responsiveness during processing
- Error rates in file operations

## Success Criteria

The Edit & Append feature is working correctly if:

1. **User Experience**: Seamless recording and appending workflow
2. **Audio Quality**: No degradation across segments
3. **File Management**: Automatic cleanup and efficient storage
4. **Error Handling**: Graceful degradation and recovery
5. **Performance**: Responsive UI and efficient processing
6. **Reliability**: Consistent behavior across multiple sessions

## Next Steps

After successful testing:

1. **Production Deployment**: Deploy to production environment
2. **User Feedback**: Collect feedback from real users
3. **Performance Monitoring**: Monitor app performance metrics
4. **Feature Enhancement**: Plan future improvements
5. **Documentation**: Update user documentation 