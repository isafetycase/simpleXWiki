var XWiki=(function(b){var a=b.widgets=b.widgets||{};a.SuggestPicker=Class.create({options:{showKey:false,showTooltip:false,showDeleteTool:true,enableSort:true,showClearTool:true,inputType:"hidden",listInsertionElement:null,listInsertionPosition:"after",acceptFreeText:false,onItemAdded:Prototype.emptyFunction,separator:","},initialize:function(d,f,c){this.removeItem=this.removeItem.bindAsEventListener(this);this.checkboxChanged=this.checkboxChanged.bindAsEventListener(this);this.options=Object.extend(Object.clone(this.options),c||{});this.input=$(d);this.suggest=f;this.inputName=this.input.name;if(!this.options.acceptFreeText){this.input.name=this.input.name+"__suggested"}else{this.input.addClassName("accept-value")}this.suggest.options.callback=this.acceptSuggestion.bind(this);this.list=new Element("ul",{"class":"accepted-suggestions"});var g;if(this.options.listInsertionElement){if(typeof(this.options.listInsertionElement)==="string"){g=this.input.up().down(this.options.listInsertionElement)}else{g=this.options.listInsertionElement}}if(!g){g=this.input}var e={};e[this.options.listInsertionPosition]=this.list;g.insert(e);if(this.options.showClearTool){this.clearTool=new Element("a",{href:"#clearSelection","class":"clear-tool",title:"$services.localization.render('core.widgets.suggestPicker.deleteAll.tooltip')"}).update("$services.localization.render('core.widgets.suggestPicker.deleteAll')");this.clearTool.hide().observe("click",this.clearAcceptedList.bindAsEventListener(this));this.list.insert({after:this.clearTool})}this.initializeSelection()},initializeSelection:function(){this.input.readOnly=true;this.input.addClassName("loading");this.loadSelectedValue(this.input.value.split(this.options.separator),0)},loadSelectedValue:function(d,e){if(e>=d.length){this.input.readOnly=false;this.input.value="";this.input.removeClassName("loading");return}else{if(d[e].strip()==""){this.loadSelectedValue(d,e+1);return}}var f=false;var c=0;this.input.value=d[e];this.suggest.doAjaxRequests(-1,{parameters:{exactMatch:true},onSuccess:function(h){if(f){return}var g=this.suggest.parseResponse(h,this.suggest.sources[c])||[];for(var j=0;j<g.length;j++){if(this.matchesSelectedValue(d[e],g[j])){f=true;g[j].value=d[e];this.addItem(g[j]);return}}}.bind(this),onComplete:function(g){g.request.options.defaultValues.onComplete(g);if(++c>=this.suggest.sources.length){if(!f){this.addItem(this.getDefaultSuggestion(d[e]))}this.loadSelectedValue(d,e+1)}}.bind(this)})},matchesSelectedValue:function(d,c){return d==c.value},getDefaultSuggestion:function(c){return{id:c,value:c,info:c}},acceptSuggestion:function(c){if(!this.acceptAlreadyAddedItem(c.id||c.value)){this.addItem(c)}this.input.value=""},removeItem:function(d){if(this.input.readOnly||this.input.disabled){return}var c=d.findElement("li");c.remove();this.notifySelectionChange(c);this.updateListTools();this.input.activate()},clearAcceptedList:function(c){c&&c.stop();this.list.update("");this.notifySelectionChange();this.updateListTools();this.input.activate()},checkboxChanged:function(d){var c=d.findElement("li");this.notifySelectionChange(c)},acceptAlreadyAddedItem:function(d){var c=this.list?this.list.down('input[id="'+this.getInputId(d).replace(/[^a-zA-Z0-9_-]/g,"\\$&")+'"]'):$(this.getInputId(d));if(c){c.checked=true;this.notifySelectionChange(c.up("li")||c);return true}return false},addItem:function(c){if(!c){return}var d=this.displayItem(c);this.list.insert(d);this.options.onItemAdded(d.down("input"));this.notifySelectionChange(d);this.updateListTools()},displayItem:function(d){var e=this.createItemInput(d);var f=new Element("li");var c=new Element("label",{"for":e.id}).insert({bottom:e});if(this.options.showKey){c.insert({bottom:new Element("span",{"class":"key"}).update("["+e.value.escapeHTML()+"]")});c.insert({bottom:new Element("span",{"class":"sep"}).update(" ")})}c.insert({bottom:new Element("span",{"class":"value"}).update(d.value.escapeHTML())});f.insert(c);this.options.showDeleteTool&&f.insert(this.createDeleteTool());if(this.options.showTooltip&&d.info){f.appendChild(new Element("div",{"class":"tooltip"}).update(d.info))}return f},createItemInput:function(d){var e={type:this.options.inputType,name:this.inputName,id:this.getInputId(d.id||d.value),value:d.value||d.id};if(this.options.inputType=="checkbox"){e.checked="checked"}var c=new Element("input",e);c.observe("change",this.checkboxChanged);return c},createDeleteTool:function(){var c=new Element("span",{"class":"delete-tool",title:"$services.localization.render('core.widgets.suggestPicker.delete.tooltip')"}).update("&times;").observe("click",this.removeItem);c.insert({top:new Element("span",{"class":"hidden"}).update("[")});c.insert({bottom:new Element("span",{"class":"hidden"}).update("]")});return c},updateListTools:function(){var c=!this.input.readOnly&&!this.input.disabled;if(this.clearTool){if(c&&this.list.childElements().length>1){this.clearTool.show()}else{this.clearTool.hide()}}if(c&&this.options.enableSort&&this.list.childElements().length>1&&typeof(Sortable)!="undefined"){Sortable.create(this.list);this.list.addClassName("sortable")}},notifySelectionChange:function(c){Event.fire(document,"xwiki:multisuggestpicker:selectionchanged",{trigger:this.input,fieldName:this.inputName,changedElement:c})},getInputId:function(c){return this.inputName+"_"+c},detach:function(){this.clearTool&&this.clearTool.stopObserving("click").remove();this.list&&this.list.remove();this.input.name=this.inputName;this.input.removeClassName("accept-value")}});return b}(XWiki||{}));