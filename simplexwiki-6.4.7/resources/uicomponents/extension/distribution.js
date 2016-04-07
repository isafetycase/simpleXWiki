var XWiki=(function(e){e.DefaultUIStep=Class.create({initialize:function(){document.observe("xwiki:extension:statusChanged",this._onExtensionStatusChanged.bindAsEventListener(this))},_onExtensionStatusChanged:function(h){var g=$("stepButtons")&&$("stepButtons").select("button");if(!g){return}var i=h.memo.extension;var f=i.getStatus();if(f=="loading"){g.invoke("disable")}else{g.invoke("enable");if(i.getId()=="$services.distribution.getUIExtensionId().id"&&i.getVersion()=="$services.distribution.getUIExtensionId().version.value"){this._onDefaultUiExtensionStatusChanged(g,f)}}},_onDefaultUiExtensionStatusChanged:function(g,f){if(f=="installed"){g[0].up().removeClassName("hidden");g[1].up().addClassName("hidden");g[2].up().addClassName("hidden")}else{g[0].up().addClassName("hidden");g[1].up().removeClassName("hidden");g[2].up().removeClassName("hidden")}}});var b=Class.create({initialize:function(){this.container=$("distributionWizard");document.observe("xwiki:extension:statusChanged",this._updateStepButtons.bind(this));document.observe("xwiki:dom:updated",function(f){f.memo.elements.each(function(g){(g.down(".extension-item")||g.hasClassName("extensionUpdater"))&&this._updateStepButtons()}.bind(this))}.bindAsEventListener(this))},_updateStepButtons:function(){var f=$("stepButtons");if(!f){return}f=f.select("button");if(this.container.down(".extension-item.extension-item-loading")||this.container.down(".job-log-item-loading")){f.invoke("disable");this._disable&&this._disable()}else{f.invoke("enable");this._enable&&this._enable();if(this._isCompleted&&this._isCompleted()){f[0].up().removeClassName("hidden");f[1].up().addClassName("hidden");f[2].up().addClassName("hidden")}else{f[0].up().addClassName("hidden");f[1].up().removeClassName("hidden");f[2].up().removeClassName("hidden")}}}});e.OutdatedExtensionsStep=Class.create(b,{_enable:function(){var f=this.container.down(".checkForUpdates");f&&f.up(".xHint").show()},_disable:function(){var f=this.container.down(".checkForUpdates");f&&f.up(".xHint").hide()},_isCompleted:function(){var g=0;var f=0;this.container.select(".invalidExtensions").each(function(i){var h=i.childElements();g+=h.size();f+=h.filter(function(j){return j.hasClassName("extension-item-installed")}).size()});return f==g}});var a=Class.create(b,{_isCompleted:function(){return true}});var c=Class.create({initialize:function(g){this.form=g;this.versionList=g.down("select.versions");this.versionInput=g.down('input[name="previousUIVersion"]');this.idInput=g.down('input[name="previousUIId"]');this.recommendedUI=g.next(".recommendedUI").hide();this.upgradeQuestion=g.previous("form.upgradeQuestion");document.observe("xwiki:extension:statusChanged",this._onPreviousUIExtensionStatusChanged.bindAsEventListener(this));g.down(".button").observe("click",this._resolvePreviousUIExtension.bindAsEventListener(this));var f=g.down(".button.secondary");f.up().removeClassName("hidden");f.observe("click",this._hidePreviousUIForm.bindAsEventListener(this));this.versionList&&this._enhancePreviousUIInput();this.upgradeQuestion&&this._enhanceUpgradeQuestion()},_enhancePreviousUIInput:function(){var f=new Element("input",{type:"image","class":"icon",src:'$xwiki.getSkinFile("icons/silk/pencil.png")',alt:"$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIAdvancedInputHint'))",title:"$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIAdvancedInputHint'))"});var g=f.cloneNode();this.versionList.insert({after:f}).up("dd").removeClassName("hidden").addClassName("versionSelector").previous().removeClassName("hidden");this.versionInput.up("dd").hide().previous().hide();this.idInput.hide().up("dd").previous().down(".xHint").hide();this.idInput.insert({after:g}).insert({after:new Element("span")});this.idInput.up("dd").hide().previous().hide();this.versionList.observe("change",this._onSelectPreviousUIVersion.bind(this));f.observe("click",this._switchToAdvancedPreviousUIInput.bindAsEventListener(this));g.observe("click",this._switchToAdvancedPreviousUIInput.bindAsEventListener(this))},_enhanceUpgradeQuestion:function(){this.upgradeQuestion.removeClassName("hidden").down(".button").observe("click",function(f){f.stop();this.upgradeQuestion.hide();this.form.enable().show().focusFirstElement()}.bindAsEventListener(this)).activate();this.upgradeQuestion.down(".button.secondary").observe("click",this._hidePreviousUIForm.bindAsEventListener(this));this.form.hide()},_onSelectPreviousUIVersion:function(){var f=this.versionList.options[this.versionList.selectedIndex];this.versionInput.value=f.value;this.idInput.next().update(f.title).up("dd").show().previous().show();this.idInput.value=f.title},_switchToAdvancedPreviousUIInput:function(f){f.stop();this.versionList.up("dd").hide().previous().hide();this.idInput.next().hide().next().hide();this.versionInput.up("dd").show().previous().show();this.idInput.show().up("dd").show().previous().show().down(".xHint").show();f.element().previous()==this.versionList?this.versionInput.activate():this.idInput.activate()},_hidePreviousUIForm:function(f){f&&f.stop();this.form.hide();this.upgradeQuestion&&this.upgradeQuestion.hide();this.recommendedUI.show()},_resolvePreviousUIExtension:function(f){f.stop();var g=this.form.serialize(true);new Ajax.Request(this.form.action,{parameters:{extensionId:g.previousUIId,extensionVersion:g.previousUIVersion,extensionNamespace:"wiki:"+g.wiki,hideExtensionDetails:true},onCreate:function(){this.form.disable();var h=this.form.down(".buttons").next();h&&h.remove()}.bind(this),onSuccess:function(j){var i=new Element("div").update(j.responseText);var h=i.down(".extension-item");if(h){if(h.down('button[name="extensionAction"][value="install"]')){this.previousUIExtensionId={id:g.previousUIId,version:g.previousUIVersion};this._displayPreviousUIExtension(h)}else{this._hidePreviousUIForm()}}else{this.form.enable().insert(i)}}.bind(this),on0:function(h){h.request.options.onFailure(h)},onFailure:function(){this.form.enable();new e.widgets.Notification("$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIRequestFailed'))","error")}.bind(this)})},_displayPreviousUIExtension:function(f){var h=new Element("div",{"class":"xHint"}).update("$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIHint'))".escapeHTML());var g=new Element("div").insert(h).insert(f);this.form.hide().insert({after:g});document.fire("xwiki:dom:updated",{elements:[g]});var i=f.down('button[name="extensionAction"][value="install"]');i.update("$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIRepairLabel'))".escapeHTML());i.title="$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.uiStepPreviousUIRepairHint'))";i.value="repairXAR";i.activate();i.insert({after:new Element("input",{type:"hidden",name:"form_token",value:document.documentElement.getAttribute("data-xwiki-form-token")})})},_onPreviousUIExtensionStatusChanged:function(h){var j=h.memo.extension;var f=j.getStatus();if(this.previousUIExtensionId&&j.getId()==this.previousUIExtensionId.id&&j.getVersion()==this.previousUIExtensionId.version&&f&&f.startsWith("installed")){this.form.next().remove();for(var g=this.form.next();g;g=g.show().next()){}var i=this.recommendedUI.down(".extension-item");i&&i._extensionBehaviour.refresh({hideExtensionDetails:true})}}});function d(){var f=$("body").down("#stepButtons button[value=CANCEL]");f&&f.observe("click",function(g){if(!window.confirm("$escapetool.javascript($services.localization.render('platform.extension.distributionWizard.cancelConfirmation'))")){g.stop()}});$("body").select("form.previousUI").each(function(g){new c(g)});$("extension.defaultui")&&new e.DefaultUIStep();$("extension.defaultui.wikis")&&new a();$("extension.outdatedextensions")&&new e.OutdatedExtensionsStep();return true}(e.domIsLoaded&&d())||document.observe("xwiki:dom:loaded",d);return e}(XWiki||{}));