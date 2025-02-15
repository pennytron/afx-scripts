function createTimecodeWidget() {
    var compList = app.project.selection;
    if (!compList.length) {
        alert("Please select at least one composition in the Project panel.");
        return;
    }
    
    app.beginUndoGroup("Create Timecode Widget");
    
    for (var i = 0; i < compList.length; i++) {
        var comp = compList[i];
        if (!(comp instanceof CompItem)) continue;

        // Create Background Shape Layer
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "timecode-box";
        var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        shapeGroup.name = "Text Box";
        var rect = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        rect.name = "Scaleable Box - Rectangle";

        // Add Padding Slider
        var sliderEffect = shapeLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        sliderEffect.name = "Padding";
        sliderEffect.property("ADBE Slider Control-0001").setValue(45);
        
        // Apply expressions
        var shapeSizeExpr = "var s=thisComp.layer(\"timecode-txt\");\n" +
                            "var w=s.sourceRectAtTime(thisComp.duration).width;\n" +
                            "var h=s.sourceRectAtTime(thisComp.duration).height;\n" +
                            "[w+effect(\"Padding\")(\"Slider\"),h+effect(\"Padding\")(\"Slider\")];";
        rect.property("ADBE Vector Rect Size").expression = shapeSizeExpr;
        
        var shapePositionExpr = "var s=thisComp.layer(\"timecode-txt\");\n" +
                                "var w=s.sourceRectAtTime(thisComp.duration).width/2;\n" +
                                "var h=s.sourceRectAtTime(thisComp.duration).height/2;\n" +
                                "var l=s.sourceRectAtTime(thisComp.duration).left;\n" +
                                "var t=s.sourceRectAtTime(thisComp.duration).top;\n" +
                                "[w+l,h+t+3];";
        rect.property("ADBE Vector Rect Position").expression = shapePositionExpr;
        
        var layerPositionExpr = "thisComp.layer(\"timecode-txt\").transform.position";
        shapeLayer.property("ADBE Transform Group").property("ADBE Position").expression = layerPositionExpr;

        // Add Fill (Black)
        var fill = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0, 0, 0, 1]); // Black fill
        
        // Remove Stroke
        var stroke = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Width").setValue(0);
    }

            
        // Create Timecode Text Layer
        var textLayer = comp.layers.addText("Timecode");
        textLayer.name = "timecode-txt";
        var textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
        var textDoc = textProp.value;
        textDoc.font = "Consolas";
        textDoc.fontSize = 24;
        textDoc.fillColor = [1, 1, 1]; // White text
        textDoc.justification = ParagraphJustification.LEFT_JUSTIFY;
        textProp.setValue(textDoc);
        
        // Apply timecode expression to Source Text
        var sourceTextExpr = "var frameRate = (1/thisComp.frameDuration);\n" +
                             "var frames = \"frame \" + (time * frameRate + 1);\n" +
                             "var timecode = (time.toFixed(3)) + \"ms\";\n" +
                             "var rate = frameRate + \"fps\";\n" +
                             "rate + \"\\r\" + timecode + \"\\r\" + frames;";
        textLayer.property("ADBE Text Properties").property("ADBE Text Document").expression = sourceTextExpr;
        
        // Apply position expression
        var positionExpr = "[(thisComp.width/100)*5,thisComp.height-150]";
        textLayer.property("ADBE Transform Group").property("ADBE Position").expression = positionExpr;
    
    app.endUndoGroup();
}

createTimecodeWidget();