function batchChangeCompDimensions() {
    var compList = app.project.selection;
    if (!compList.length) {
        alert("Please select at least one composition in the Project panel.");
        return;
    }
    
    var win = new Window("dialog", "Batch Change Comp Dimensions");
    
    var dropdown = win.add("dropdownlist", undefined, ["Desktop (1920x1080)", "Landscape (1390x640)", "Portrait (640x1390)", "Custom"]);
    dropdown.selection = 0;
    
    var customGroup = win.add("group");
    customGroup.add("statictext", undefined, "Width:");
    var widthInput = customGroup.add("edittext", undefined);
    widthInput.characters = 6;
    widthInput.enabled = false;
    customGroup.add("statictext", undefined, "Height:");
    var heightInput = customGroup.add("edittext", undefined);
    heightInput.characters = 6;
    heightInput.enabled = false;
    
    dropdown.onChange = function() {
        var isCustom = (dropdown.selection.text === "Custom");
        widthInput.enabled = isCustom;
        heightInput.enabled = isCustom;
    };
    
    var buttonGroup = win.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    applyButton.onClick = function() {
        var newWidth, newHeight;
        if (dropdown.selection.text === "Desktop (1920x1080)") {
            newWidth = 1920;
            newHeight = 1080;
        } else if (dropdown.selection.text === "Landscape (1390x640)") {
            newWidth = 1390;
            newHeight = 640;
        } else if (dropdown.selection.text === "Portrait (640x1390)") {
            newWidth = 640;
            newHeight = 1390;
        } else {
            newWidth = parseInt(widthInput.text, 10);
            newHeight = parseInt(heightInput.text, 10);
            if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
                alert("Please enter valid numerical values for width and height.");
                return;
            }
        }
        
        app.beginUndoGroup("Batch Change Comp Dimensions");
        for (var i = 0; i < compList.length; i++) {
            var comp = compList[i];
            if (comp instanceof CompItem) {
                comp.width = newWidth;
                comp.height = newHeight;
            }
        }
        app.endUndoGroup();
        alert("Updated dimensions for " + compList.length + " compositions.");
        win.close();
    };
    
    cancelButton.onClick = function() {
        win.close();
    };
    
    win.show();
}

batchChangeCompDimensions();