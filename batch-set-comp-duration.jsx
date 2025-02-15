function batchSetCompDuration() {
    var compList = app.project.selection;
    if (!compList.length) {
        alert("Please select at least one composition in the Project panel.");
        return;
    }
    
    var win = new Window("dialog", "Batch Set Comp Duration");
    
    var inputGroup = win.add("group");
    inputGroup.add("statictext", undefined, "Duration (frames):");
    var durationInput = inputGroup.add("edittext", undefined);
    durationInput.characters = 6;
    
    var buttonGroup = win.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    applyButton.onClick = function() {
        var frameCount = parseInt(durationInput.text, 10);
        if (isNaN(frameCount) || frameCount <= 0) {
            alert("Please enter a valid number of frames.");
            return;
        }
        
        app.beginUndoGroup("Batch Set Comp Duration");
        
        for (var i = 0; i < compList.length; i++) {
            var comp = compList[i];
            if (comp instanceof CompItem) {
                var newDuration = frameCount / comp.frameRate;
                comp.duration = newDuration;
            }
        }
        
        app.endUndoGroup();
        alert("Updated duration for " + compList.length + " compositions.");
        win.close();
    };
    
    cancelButton.onClick = function() {
        win.close();
    };
    
    win.show();
}

batchSetCompDuration();
