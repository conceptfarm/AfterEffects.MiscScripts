//#targetengine "session";
/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":7,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Dialog","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"StaticText","parentId":3,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Offset Selected layers by: ","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-2":{"id":2,"type":"EditText","parentId":3,"style":{"enabled":true,"varName":"offset_edit","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"10","justify":"left","preferredSize":[48,0],"alignment":null,"helpTip":null}},"item-3":{"id":3,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-4":{"id":4,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-5":{"id":5,"type":"Button","parentId":4,"style":{"enabled":true,"varName":"offset_ok","text":"OK","justify":"center","preferredSize":[64,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"Button","parentId":4,"style":{"enabled":true,"varName":"offset_cancel","text":"Cancel","justify":"center","preferredSize":[64,0],"alignment":null,"helpTip":null}},"item-7":{"id":7,"type":"StaticText","parentId":3,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"frames","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,3,1,2,7,4,5,6],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 
(function() 
{
    // DIALOG
    // ======
    var dialog = new Window("palette","Offset Layer Time", undefined); 
        dialog.alignChildren = ["center","top"]; 
        dialog.spacing = 10; 
        dialog.margins = 16; 

    // GROUP1
    // ======
    var group1 = dialog.add("group", undefined, {name: "group1"}); 
        group1.orientation = "row"; 
        group1.alignChildren = ["left","center"]; 
        group1.spacing = 10; 
        group1.margins = 0; 

    var statictext1 = group1.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "Offset Selected layers by: "; 

    var offset_edit = group1.add('edittext {properties: {name: "offset_edit"}}'); 
        offset_edit.text = "10"; 
        offset_edit.preferredSize.width = 48; 
        offset_edit.onChanging = function() 
        { 
            // workaround for sending the cursor to the end of the string
            // simply setting the text.text to the value sets the cursor to the beginning
            // text selection sets the cursor to the end of the string
            var newText = checkNumeric( this.text );
            this.text = ""; 
            this.textselection = newText; 
        };       
        offset_edit.onChange = function(){ if ( this.text == "" ) { this.text = 0; }else{this.text = parseFloat(this.text)}};
       
    var statictext2 = group1.add("statictext", undefined, undefined, {name: "statictext2"}); 
        statictext2.text = "frames"; 

    // GROUP2
    // ======
    var group2 = dialog.add("group", undefined, {name: "group2"}); 
        group2.orientation = "row"; 
        group2.alignChildren = ["left","center"]; 
        group2.spacing = 10; 
        group2.margins = 0; 

    var offset_ok = group2.add("button", undefined, undefined, {name: "offset_ok"}); 
        offset_ok.text = "OK"; 
        offset_ok.preferredSize.width = 64;
        offset_ok.onClick = function(){ offsetLayers(parseFloat(offset_edit.text)); };

    var offset_cancel = group2.add("button", undefined, undefined, {name: "offset_cancel"}); 
        offset_cancel.text = "Cancel"; 
        offset_cancel.preferredSize.width = 64; 
        offset_cancel.onClick = function(){ dialog.close(); };

    dialog.show();
    


    function checkNumeric(text)
    {
        var result = text.replace(/[^0-9^\-^\.]*/g, ""); // remove non-numeric chars
        var regex = /([-\d+]*\.)(.+)/g;
        var decimalGroups = regex.exec(result); // split two groups before first decimal and after
        
        if (decimalGroups)
        {
            var decimal = decimalGroups[2].replace(/\./g, ""); // remove periods from trailing
            result = decimalGroups[1] + decimal;
        }

        if ( result.match(/-/g) ) // if has a minus sign
        {
            var noMinus = result.replace(/-/g,""); // remove all minus signs
            if (result[0] == "-")
            {
                // if a minus is at the beginning of the original add one
                result = "-" + noMinus; 
            }
            else
            {
                result = noMinus;
            }
        }
        return result;
    }
    
    function offsetLayers( offset )
    {
        if (app.project.activeItem != null)
        {
            var sel = app.project.activeItem.selectedLayers;
            if (sel.length > 0)
            {
                app.beginUndoGroup("Offset Layer Time");
                                
                var framerate = app.project.activeItem.frameRate;

                for (var i = 0; i < sel.length; i++)
                {
                    sel[i].startTime = sel[i].startTime + i * offset/framerate;
                }
                app.endUndoGroup();
            }
        }
    }
 
})();