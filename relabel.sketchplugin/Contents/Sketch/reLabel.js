var onRun = function(context) {
  //reference the Sketch Document
  var sketch = context.api();

  //to access the selection
  var document = sketch.selectedDocument;
  var layers = document.selectedLayers;
  var page = document.selectedPage;

  var selection;
  var textLayer;
  var buttonRect;

  if(layers.length == 1){
    layers.iterate(function(layer){
      selection = layer;
    })
  } else{
    invalidSelection()
  }

  function hasText(group){
    var text = 0;
    group.iterate(function(layer){
      if(layer.isText){
        text = layer;
      }
      else{
        null
      }
    })
    return text;
  }

  function getButtonPadding(buttonRect, textLayer){
    var textFrame = textLayer.frame;
    var rectFrame = buttonRect.frame;
    return {
      top: textFrame.y - rectFrame.y,
      left: textFrame.x - rectFrame.x,
      bottom: (rectFrame.y + rectFrame.height) - (textFrame.y + textFrame.height),
      right: (rectFrame.x + rectFrame.width) - (textFrame.x + textFrame.width)

    }
  }

  function largestShape(group){
    var rect = 0;
    group.iterate(function(layer){
      if(layer.frame.width == group.frame.width && layer.frame.height == group.frame.height){
        rect = layer;
      }
      else{
        null
      }
    })
    return rect;
  }

  function invalidSelection() {
    sketch.message('Selection must be a group containing a button with at least one text layer');
  }

  function offsetObjects(group, off, rect, nText){
    group.iterate(function(layer){
      if (layer.id == rect.id || layer.id == nText.id || layer.frame.x < nText.frame.x){
        null
      } else {
        layer.frame = {x : layer.frame.x + offset};
      }
    })
  }


  if(selection.isGroup && hasText(selection) && largestShape(selection)){

    buttonRect = largestShape(selection);
    textLayer = hasText(selection);
    
    var buttonPadding = getButtonPadding(buttonRect, textLayer);
    var newText = sketch.getStringFromUser('Enter the button text ', textLayer.text);

    var oldTextwidth = textLayer.frame.width;
    textLayer.text = newText;
    var newTextWidth = textLayer.frame.width;

    var offset = newTextWidth - oldTextwidth;
    offsetObjects(selection, offset, buttonRect, textLayer);

    buttonRect.frame = {
      width: textLayer.frame.width + buttonPadding.right + buttonPadding.left
    };
    selection.adjustToFit();    


  } else {
    invalidSelection();
  }
}