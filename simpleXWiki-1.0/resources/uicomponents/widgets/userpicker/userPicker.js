var XWiki=(function(d){var b=d.widgets=d.widgets||{};var a=Class.create(b.SuggestPicker,{matchesSelectedValue:function(f,e){return d.Model.resolve(f,d.EntityType.DOCUMENT).name==e.id},getDefaultSuggestion:function(f){var e=d.Model.resolve(f,d.EntityType.DOCUMENT);return{id:e.name,value:f,info:e.name,icon:"$xwiki.getSkinFile('icons/xwiki/noavatar.png')"}},addItem:function($super,e){this.input.hasClassName("multipleSelection")||this.list.update("");$super(e)},displayItem:function(e){var f=this.suggest.createItemDisplay(e,{});f.down(".user-name").insert(this.createDeleteTool());return new Element("li").insert(f).insert(this.createItemInput(e))}});b.UserPicker=Class.create(b.Suggest,{initialize:function($super,e,f){$super(e,Object.extend({varname:"input",enableHideButton:false,timeout:30000},f||{}));var g=e;if(e.hasClassName("withScope")&&!e.hasClassName("global")){this._sourceURL=f.script;this._createScope();g=e.up()}this._selectionManager=this._createSelectionManager({listInsertionElement:g,listInsertionPosition:"before",acceptFreeText:true});this.multipleSelection=e.hasClassName("multipleSelection");if(e.id!=""){b.UserPicker.instances[e.id]=this}},createItemDisplay:function(j,i){var e=new Element("div",{"class":"user"});var f=new Element("div",{"class":"user-avatar-wrapper"});f.insert(new Element("img",{src:j.icon,alt:j.info,"class":"icon"}));e.insert(f);var h=i.highlight?this.emphasizeMatches(this.sInput,j.info):j.info;e.insert(new Element("div",{"class":"user-name"}).update(h));var g=i.highlight?this.emphasizeMatches(this.sInput,j.id):j.id;e.insert(new Element("div",{"class":"user-alias"}).update(g));return e},clear:function(){this.fld.clear();this._selectionManager.clearAcceptedList()},_createSelectionManager:function(e){return new a(this.fld,this,e)},_createScope:function(){this._scope=new Element("input",{type:"image","class":"scope",alt:"$services.localization.render('core.widgets.userPicker.scopeHint')",title:"$services.localization.render('core.widgets.userPicker.scopeHint')"});var e=new Element("span").insert(this._scope);this.fld.insert({before:e});e.insert(this.fld);this._scope.observe("click",this._toggleScope.bindAsEventListener(this));this._toggleScope()},_toggleScope:function(e){e&&e.stop();if(this._scope.value=="local"){this._scope.value="global";this._scope.src="$xwiki.getSkinFile('icons/silk/world.png')"}else{this._scope.value="local";this._scope.src="$xwiki.getSkinFile('icons/silk/world_delete.png')"}this.sources[0].script=this._sourceURL+"wiki="+this._scope.value+"&"},detach:function($super){this._selectionManager&&this._selectionManager.detach();this._scope&&this._scope.stopObserving("click").up().insert({before:this.fld}).remove();$super()}});b.UserPicker.instances={};var c=function(e){var g={users:{script:d.currentDocument.getURL("get","xpage=uorgsuggest&uorg=user&"),noresults:"$services.localization.render('core.widgets.userPicker.noResults')"},groups:{script:d.currentDocument.getURL("get","xpage=uorgsuggest&uorg=group&"),noresults:"$services.localization.render('core.widgets.groupPicker.noResults')"}};var f=(e&&e.memo.elements)||[$("body")];Object.keys(g).each(function(h){f.each(function(i){i.select("input.suggest"+h.capitalize()).each(function(j){if(!j.hasClassName("initialized")){var k=Object.clone(g[h]);if(j.hasClassName("global")){k.script=k.script+"wiki=global&"}new b.UserPicker(j,k);j.addClassName("initialized")}})})});return true};(d.domIsLoaded&&c())||document.observe("xwiki:dom:loaded",c);document.observe("xwiki:dom:updated",c);return d})(XWiki||{});