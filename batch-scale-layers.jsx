function batchScaleLayers() {
    var compList = app.project.selection;
    if (!compList.length) {
        alert("Please select at least one composition in the Project panel.");
        return;
    }
    
    var win = new Window("dialog", "Batch Scale & Centre Layers");
    
    var dropdown = win.add("dropdownlist", undefined, ["100%", "75%", "50%", "25%", "20%", "10%", "5%", "Custom"]);
    dropdown.selection = 0;
    
    var customGroup = win.add("group");
    customGroup.add("statictext", undefined, "Scale:");
    var scaleInput = customGroup.add("edittext", undefined);
    scaleInput.characters = 5;
    scaleInput.enabled = false;
    
    dropdown.onChange = function() {
        scaleInput.enabled = (dropdown.selection.text === "Custom");
    };
    
    var buttonGroup = win.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    applyButton.onClick = function() {
        var scaleAmount;
        if (dropdown.selection.text !== "Custom") {
            scaleAmount = parseFloat(dropdown.selection.text);
        } else {
            scaleAmount = parseFloat(scaleInput.text);
            if (isNaN(scaleAmount) || scaleAmount <= 0) {
                alert("Please enter a valid scale percentage.");
                return;
            }
        }
        
        app.beginUndoGroup("Batch Scale Layers");
        
        for (var i = 0; i < compList.length; i++) {
            var comp = compList[i];
            if (comp instanceof CompItem) {
                for (var j = 1; j <= comp.numLayers; j++) {
                    var layer = comp.layer(j);
                    if (layer.property("ADBE Transform Group")) {
                        var scaleProp = layer.property("ADBE Transform Group").property("ADBE Scale");
                        scaleProp.setValue([scaleAmount, scaleAmount]);
                        
                        var positionProp = layer.property("ADBE Transform Group").property("ADBE Position");
                        positionProp.setValue([comp.width / 2, comp.height / 2]);
                    }
                }
            }
        }
        
        app.endUndoGroup();
        alert("Scaled and centered layers in " + compList.length + " compositions.");
        win.close();
    };
    
    cancelButton.onClick = function() {
        win.close();
    };
    
    win.show();
}

batchScaleLayers();