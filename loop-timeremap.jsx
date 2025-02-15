function createTimeRemapLoop() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }
    
    app.beginUndoGroup("Create Time Remap Loop");
    
    for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];
        
        if (!layer.canSetTimeRemapEnabled) continue;
        
        layer.timeRemapEnabled = true;
        
        var timeRemap = layer.property("ADBE Time Remapping");
        if (timeRemap.numKeys < 2) {
            alert("Layer must have at least two keyframes for time remapping to loop.");
            continue;
        }
        
        // Get the first keyframe value
        var firstKeyValue = timeRemap.keyValue(1);
        
        // Get the last keyframe time
        var lastKeyIndex = timeRemap.numKeys;
        var lastKeyTime = timeRemap.keyTime(lastKeyIndex);
        
        // Move back one frame from the last keyframe time
        var frameDuration = 1 / comp.frameRate;
        var adjustedLastKeyTime = lastKeyTime - frameDuration;
        
        // Create a new keyframe one frame before the last keyframe without setting a value
        timeRemap.addKey(adjustedLastKeyTime);
        
        // Set the last keyframe to match the first keyframe's value
        timeRemap.setValueAtTime(lastKeyTime, firstKeyValue);
        
        // Add loopOut expression
        timeRemap.expression = "loopOut()";
    }
    
    app.endUndoGroup();
}

createTimeRemapLoop();