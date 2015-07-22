(function($) {

    $.TextToInput = function(element, options) {
         var plugin = this;
        plugin.settings = {}

        var $element = $(element),
             element = element;

        var defaults = {
            mainButtonDiv  : "#mainButtonDiv",
            actionCell : ".actionCell",
            controleUniqueButton : true,
            buttunClass : "btn",
            modifiedclass : "btn-primary",
            saveclass : "btn-success",
            cancelclass : "btn-danger",
            ToSaveclass : "btn-success",
            modifiedtext : " Modify",
            savetext : " Save",
            canceltext : " Cancel",
            ToSavetext : " Valid Changes",
            modifiedglyph : "glyphicon glyphicon-pencil",
            saveglyph : "glyphicon glyphicon-floppy-disk",
            cancelglyph : "glyphicon glyphicon-ban-circle",
            ToSaveglyph : "glyphicon glyphicon-saved",
            modifiedtitle : "",
            savetitle : "",
            canceltitle : "",
            ToSavetitle : "",
            UpdatedVal : ".text-danger",
            UpdatingVal : ".updating_line",
            ToUpdateLine : ".to_update_line",
            PrecisedFieldDB : false,
            IDDB : "",
            dataDB : "name_DB",
            notChange : ".lockValue",
            link : "index.html",
            myTable : $(element),
            json:"",
            saveOnChange:true,
            SuccessSend: function (json) {alert("Sending information success")},
            ErrorSend: function (json) {alert("Sending information error")},
            SendJSON: function (json) {
                $.ajax({
                    type: "POST",
                    url: plugin.tdpersonnalised.link,
                    data: json,
                }).success(function(){
                    plugin.tdpersonnalised.SuccessSend(plugin.tdpersonnalised.json);
                    resetChange();
                }).error(function(){
                    plugin.tdpersonnalised.ErrorSend(plugin.tdpersonnalised.json);
                });
            }
        }



        plugin.init = function() {
            plugin.tdpersonnalised = $.extend({}, defaults, options);




          //Call of the function if it is multiple or Unique controle button
    function addMainControlButton(){
        (plugin.tdpersonnalised.controleUniqueButton)?addMainButonsUnique():addMainButonsMultiple();
    }

  //plugin.tdpersonnalised["myTable"] = $(this);


    //Add of buttons if Unique Button & hide good one(s)
    function addMainButonsUnique(){
        var obj = $(plugin.tdpersonnalised.mainButtonDiv);
        obj.append("<button title='"+plugin.tdpersonnalised.modifiedtitle+"' class=\""+ plugin.tdpersonnalised.buttunClass+ " "  + plugin.tdpersonnalised.modifiedclass +"\"><span class=\""+ plugin.tdpersonnalised.modifiedglyph +"\" aria-hidden=\"true\">"+plugin.tdpersonnalised.modifiedtext+"</span></button>");

        obj.append("<button title='"+plugin.tdpersonnalised.savetitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " "  + plugin.tdpersonnalised.saveclass +"\"><span class=\""+ plugin.tdpersonnalised.saveglyph +"\" aria-hidden=\"true\">"+plugin.tdpersonnalised.savetext+"</span></button>");

        obj.append("<button title='"+plugin.tdpersonnalised.canceltitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " " + plugin.tdpersonnalised.cancelclass +"\"><span class=\""+ plugin.tdpersonnalised.cancelglyph +"\" aria-hidden=\"true\">"+plugin.tdpersonnalised.canceltext+"</span></button>");

        obj.append("<button disabled title='"+plugin.tdpersonnalised.ToSavetitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " " + plugin.tdpersonnalised.ToSaveclass +"\"><span class=\""+ plugin.tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\">"+plugin.tdpersonnalised.ToSavetext+"</span></button>");

        obj.children("button:nth-child(2),button:nth-child(3)").hide();

    }

    //Add of buttons if Multiple Button & hide good one(s)
    function addMainButonsMultiple(){
        var obj = $(plugin.tdpersonnalised.mainButtonDiv);

        obj.append("<button disabled title='"+plugin.tdpersonnalised.ToSavetitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " " + plugin.tdpersonnalised.ToSaveclass +"\"><span class=\""+ plugin.tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\">"+plugin.tdpersonnalised.ToSavetext+"</span></button>");


    }

    //Add button on each line for multiple button & hide the good ones
    function addButtonLine(){
        var obj = plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell);
        $.each(obj,function(){
            $(this).append("<button title='"+plugin.tdpersonnalised.modifiedtitle+"' class=\""+ plugin.tdpersonnalised.buttunClass+ " "  + plugin.tdpersonnalised.modifiedclass +"\"><span class=\""+ plugin.tdpersonnalised.modifiedglyph +"\" aria-hidden=\"true\"></span></button>");

            $(this).append("<button title='"+plugin.tdpersonnalised.ToSavetitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " " + plugin.tdpersonnalised.ToSaveclass +"\"><span class=\""+ plugin.tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\"></span></button>");

            $(this).append("<button title='"+plugin.tdpersonnalised.canceltitle+"' class=\"" + plugin.tdpersonnalised.buttunClass+ " " + plugin.tdpersonnalised.cancelclass +"\"><span class=\""+ plugin.tdpersonnalised.cancelglyph +"\" aria-hidden=\"true\"></span></button>");
        });

        obj.children("button:nth-child(2),button:nth-child(3)").hide();

    }

    function LockActionCellExceptCurrent(e){
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell).not(e).children("button:nth-child(1)").each(function(){
            $(this).attr('disabled','disabled');
        });
    }

    function UnlockActionCellExceptCurrent(){
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell).children("button:nth-child(1)").each(function(){
            $(this).attr('disabled',false);
        });
    }

    function modifieLine(e){
        var parent = e.parent();
        if(!plugin.tdpersonnalised.saveOnChange) LockActionCellExceptCurrent(parent);
        else saveOnChange();
        e.hide();
        parent.parent().addClass("updating_line");
        parent.children("button:nth-child(2),button:nth-child(3)").show();
        transformInInput(parent.parent());
    }

    function saveOnChange(){
        wheelSave(plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.UpdatingVal).find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB));
        if($(plugin.tdpersonnalised.UpdatingVal)[0]) resetButtonMultiple($(plugin.tdpersonnalised.UpdatingVal));
    }

    function wheelSave(e){
        e.each(function(i,e){
            SaveChange($(e));
        });
    }

    function SaveChange(e){
        var val = e.children("input").val();
        if(typeof val != "undefined" && val != "")if(val.indexOf('"') != -1)val = val.replace('"', '\"');
        var oldval = e.children("input").data("oldval");
        if (plugin.tdpersonnalised.IDDB=="" && e.data("oldval")=== undefined )e.attr("data-oldVal",oldval);
        InputToText(e,val);

        if(val!=oldval) e.addClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""));
        addUpdateLine();
    }

    function resetButtonMultiple(e){
        e.find(plugin.tdpersonnalised.actionCell).children("button:nth-child(2),button:nth-child(3)").hide();
        e.find(plugin.tdpersonnalised.actionCell).children("button:nth-child(1)").show();
        e.removeClass(plugin.tdpersonnalised.UpdatingVal.replace(".",""));
    }

    function CancelLine(e){
        e.find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB).each(function(i,e){
            var oldval = $(e).children("input").data("oldval");
            InputToText($(e),oldval)
        });
    }

    function transformInInput(target){
      target.find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB).each(function(){
            var temp = $(this).text().replace('"', '\"');
            $(this).text("");
            $(this).append("<input data-oldVal='"+ temp +"' value='"+ temp +"'>");
        });
    }

    function InputToText(e,val){
        e.text("");
        e.append(val);
    }

    function cancelAllLine(){
        plugin.tdpersonnalised.myTable.find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB).each(function(){
            var oldval = $(this).children("input").data("oldval");
            InputToText($(this),oldval);
        });
    }

    function saveAllLine(){
        plugin.tdpersonnalised.myTable.find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB).each(function(){
            var oldval = $(this).children("input").data("oldval");
            var val = $(this).children("input").val().replace('"', '\"');
        if (plugin.tdpersonnalised.IDDB=="" && $(this).data("oldval")=== undefined )$(this).attr("data-oldVal",oldval);
            InputToText($(this),val);
            if(val!=oldval) $(this).addClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""));
        });
        addUpdateLine();
    }

    function addUpdateLine(){
        $(plugin.tdpersonnalised.UpdatedVal).each(function(){
            if(!$($(this).parent(plugin.tdpersonnalised.ToUpdateLine))[0]){
                $(this).parent("tr,ul,ol").addClass(plugin.tdpersonnalised.ToUpdateLine.replace(".",""));
                var temp;
                (plugin.tdpersonnalised.controleUniqueButton)?temp = 4:temp = 1;
                plugin.EnableSaveBDDButton(temp);
            }
        });
    }

    function modifAllLine(){
       // console.log(plugin==plugin.tdpersonnalised.myTable);
        transformInInput(plugin.tdpersonnalised.myTable);
    }

    function hideModifAndSaveButtunUnique(e){
        e.children("button:nth-child(4),button:nth-child(1)").hide();
    }

    function showCancelAndSaveChangeUnique(e){
        e.children("button:nth-child(2),button:nth-child(3)").show();
    }

    function showModifAndSaveButtunUnique(e){
        e.children("button:nth-child(4),button:nth-child(1)").show();
    }

    function hideCancelAndSaveChangeUnique(e){
        e.children("button:nth-child(2),button:nth-child(3)").hide();
    }



    function buildChangeObject(){
        (plugin.tdpersonnalised.PrecisedFieldDB)?(plugin.tdpersonnalised.IDDB!="")?buildWithID():buildWithoutID():(plugin.tdpersonnalised.IDDB!="")?buildNODataID():buildNOData();

    }

    function buildWithoutID(){
        var object = {};
        var old = {};
        var infos = [];
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find("td,li").not(plugin.tdpersonnalised.actionCell).each(function() {
                var id = $(this).data(plugin.tdpersonnalised.dataDB.toLowerCase());
                if($(this).hasClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[String(id)] = value;
                }

                var value_new = $(this).attr("data-oldVal");
                old[String(id)] = value_new;
            });
            var temp = new Array(old,object);
            infos.push(temp);
            temp = {};
            old = {};
            object = {};
        });
        JsonForString(infos);
        //console.log(infos);
    }

    function buildWithID(){
        var object = {};
        var infos = [];
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.ToUpdateLine).each(function(){
            object[String(plugin.tdpersonnalised.IDDB.replace(".",""))] = $(this).children(plugin.tdpersonnalised.IDDB).text();
           //+plugin.tdpersonnalised.UpdatedVal

$(this).find("td"+plugin.tdpersonnalised.UpdatedVal,"li"+plugin.tdpersonnalised.UpdatedVal).not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.IDDB).each(function() {
                var id = $(this).data(plugin.tdpersonnalised.dataDB.toLowerCase());
                var value = $(this).text();
                object[String(id)] = value;
            });
            infos.push(object);
            object = {};
        });
        JsonForString(infos);
        //console.log(infos);
    }

    function buildNOData(){
        var object = {};
        var old = {};
        var infos = [];
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find("td,li").not(plugin.tdpersonnalised.actionCell).each(function(i) {
                if($(this).hasClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[String(i)] = value;
                }
                var value_new = $(this).attr("data-oldVal");
                //console.log(value_new);
                old[String(i)] = value_new;
            });
            var temp = new Array(old,object);
            infos.push(temp);
            temp = {};
            old = {};
            object = {};
        });
        JsonForString(infos);
        //console.log(infos);
    }

    function buildNODataID(){
        var object = {};
        var infos = [];
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.ToUpdateLine).each(function(){
            object[String(plugin.tdpersonnalised.IDDB.replace(".",""))] = $(this).children(plugin.tdpersonnalised.IDDB).text();
            $(this).find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.IDDB).each(function(i) {
                if($(this).hasClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[i]=value;
                }
            });
            infos.push(object);
            object = {};
        });
        JsonForString(infos);
        console.log(infos);
    }

    function JsonForString(infos){
        var json = JSON.stringify(infos);
        plugin.tdpersonnalised.json=json;
        plugin.tdpersonnalised.SendJSON(json);
    }













    //Put in place button in structure

    addMainControlButton();
    if(!plugin.tdpersonnalised.controleUniqueButton) addButtonLine();

    //Trigger event
        //Click on modified Button if multiple line
    plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell).on('click', "button:nth-child(1)" ,function(){
        modifieLine($(this));
    });
        //Click on cancel Button if multiple line
    plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell).on('click', "button:nth-child(3)" ,function(){
        var parent = $(this).parents("tr,ul,ol");
        CancelLine(parent);
        resetButtonMultiple(parent);
        UnlockActionCellExceptCurrent();

    });
        //Click on save Button if multiple line
    plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.actionCell).on('click', "button:nth-child(2)" ,function(){
       var parent = $(this).parents("tr,ul,ol"); wheelSave(parent.find("td,li").not(plugin.tdpersonnalised.actionCell).not(plugin.tdpersonnalised.notChange).not(plugin.tdpersonnalised.IDDB));
        resetButtonMultiple(parent);
        UnlockActionCellExceptCurrent();
    });
        //Click on modified Button on unique buttun
    $(plugin.tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(1)" ,function(){
       if(plugin.tdpersonnalised.controleUniqueButton){
            modifAllLine();
            var parent = $(this).parent();
            hideModifAndSaveButtunUnique(parent);
            showCancelAndSaveChangeUnique(parent);
       }else{
           buildChangeObject();
       }


    });

    $(plugin.tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(3)" ,function(){
        var parent = $(this).parent();
        cancelAllLine();
        showModifAndSaveButtunUnique(parent);
        hideCancelAndSaveChangeUnique(parent);
    });

    $(plugin.tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(2)" ,function(){
        var parent = $(this).parent();
        saveAllLine();
        showModifAndSaveButtunUnique(parent);
        hideCancelAndSaveChangeUnique(parent);
    });

     $(plugin.tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(4)" ,function(){
        buildChangeObject();
    });


        }




        plugin.resetChange = function() {
        plugin.tdpersonnalised.myTable.find(plugin.tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find(plugin.tdpersonnalised.UpdatedVal).each(function(){
                $(this).removeClass(plugin.tdpersonnalised.UpdatedVal.replace(".",""));
                //console.log($(this));
                $(this).removeAttr( "data-oldval" );
            });
            $(this).removeClass(plugin.tdpersonnalised.ToUpdateLine.replace(".",""));
            (plugin.tdpersonnalised.controleUniqueButton)?temp = 4:temp = 1;
            plugin.DisableSaveBDDButton(temp);
        });
        }


        plugin.EnableSaveBDDButton = function(nb){
          $(plugin.tdpersonnalised.mainButtonDiv).children("button:nth-child(" + nb + ")").attr("disabled",false);
        }
        plugin.DisableSaveBDDButton = function(nb){
          $(plugin.tdpersonnalised.mainButtonDiv).children("button:nth-child(" + nb + ")").attr("disabled","disabled");
        }


        var foo_private_method = function() {

        }

        plugin.init();

    }

    $.fn.TextToInput = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('TextToInput')) {
                var plugin = new $.TextToInput(this, options);
                $(this).data('TextToInput', plugin);
            }
        });

    }

})(jQuery);
