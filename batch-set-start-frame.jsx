function batchSetCompStartFrame() {
    var compList = app.project.selection;
    if (!compList.length) {
        alert("Please select at least one composition in the Project panel.");
        return;
    }
    
    var win = new Window("dialog", "Batch Set Comp Start Frame");
    
    var inputGroup = win.add("group");
    inputGroup.add("statictext", undefined, "Start Frame Number:");
    var startFrameInput = inputGroup.add("edittext", undefined, "1");
    startFrameInput.characters = 6;
    
    var buttonGroup = win.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    applyButton.onClick = function() {
        var startFrame = parseInt(startFrameInput.text, 10);
        if (isNaN(startFrame)) {
            alert("Please enter a valid frame number.");
            return;
        }
        
        app.beginUndoGroup("Batch Set Comp Start Frame");
        
        for (var i = 0; i < compList.length; i++) {
            var comp = compList[i];
            if (comp instanceof CompItem) {
                var startTime = startFrame / comp.frameRate;
                comp.displayStartTime = startTime;
            }
        }
        
        app.endUndoGroup();
        alert("Updated start frame for " + compList.length + " compositions.");
        win.close();
    };
    
    cancelButton.onClick = function() {
        win.close();
    };
    
    win.show();
}

batchSetCompStartFrame();