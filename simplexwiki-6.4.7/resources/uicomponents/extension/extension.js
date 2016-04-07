var XWiki=(function(c){c.ExtensionBehaviour=Class.create({initialize:function(d){this.finalize();this.container=d;this.container._extensionBehaviour=this;this._fixExtensionLinks();this._enhanceActions();this._enhanceMenuBehaviour();this._enhanceDescriptionBehaviour();this._enhanceDependenciesBehaviour();this._enhanceProgressBehaviour();this._maybeScheduleRefresh()},finalize:function(){if(this.container){delete this.container._extensionBehaviour;this.container.remove()}this.container=undefined},getNamespace:function(){var d=this.container.down('input[name="extensionNamespace"]');return d?d.value:null},getId:function(){var d=this.container.down('input[name="extensionId"]');return d?d.value:null},getVersion:function(){var d=this.container.down('input[name="extensionVersion"]');return d?d.value:null},getStatus:function(){var e=$w(this.container.className);for(var d=0;d<e.length;d++){if(e[d].startsWith("extension-item-")){return e[d].substr(15)}}return null},_getServiceURL:function(e){if(e){e=c.getResource(e);e=new c.Document(e.name,e.space,e.wiki)}else{e=c.currentDocument}var d=c.contextaction=="view"||c.contextaction=="admin"?"get":c.contextaction;return e.getURL(d)},_onAjaxRequestFailure:function(d){if(d.status==401){new c.widgets.ConfirmationBox({onYes:function(){window.location.reload(true)}},{confirmationText:"$escapetool.javascript($services.localization.render('extensions.info.fetch.unauthorized'))"});return false}else{var e=d.statusText;if(d.statusText==""||d.status==12031){e="Server not responding"}new c.widgets.Notification("$escapetool.javascript($services.localization.render('extensions.info.fetch.failed'))"+e,"error");return true}},_submit:function(g,e){g.stop();var f=g.element().form;var h=new Hash(f.serialize({submit:false}));h.set(g.element().name,g.element().value);f.disable();var d={parameters:h,onFailure:this._onAjaxRequestFailure.bind(this),on0:function(i){i.request.options.onFailure(i)},onComplete:function(){f.enable()}};d.defaultValues=Object.clone(d);new Ajax.Request(this._getServiceURL(h.get("section")),Object.extend(d,e))},_update:function(h){var g=this.container.down(".extension-body");var i=!g||g.hasClassName("hidden");var e=this.container.down(".innerMenu li a.current");e&&(this._previouslySelectedMenuItem=e.getAttribute("href"));var d=this.getStatus();this.container.addClassName("hidden");this.container.insert({after:h});this.initialize(this.container.next());var j=this.container.down(".extension-body");var f=!j||j.hasClassName("hidden");i&&!f&&this._onToggleShowHideDetails({stop:function(){},element:function(){return this.container.down('button[value="hideDetails"]')}.bind(this)});if(d!=this.getStatus()){document.fire("xwiki:extension:statusChanged",{extension:this})}document.fire("xwiki:dom:updated",{elements:[this.container]})},_onShowDetails:function(d){this._submit(d,{onCreate:function(){this.container.insert({bottom:new Element("div",{"class":"extension-body loading"})})}.bind(this),onSuccess:function(e){this._update(e.responseText)}.bind(this),onComplete:function(e){e.request.options.defaultValues.onComplete(e);var f=this.container.down(".extension-body.loading");f&&f.remove()}.bind(this)})},_enhanceShowDetailsBehaviour:function(){var e=this.container.down('button[value="showDetails"]');if(!e){return}if(e.hasClassName("visibilityAction")){e=e.up();var d=this.container.down('button[value="hideDetails"]').up();e.__otherButton=d;d.__otherButton=e;this.container.select(".visibilityAction").invoke("observe","click",this._onToggleShowHideDetails.bindAsEventListener(this));e.remove()}else{e.observe("click",this._onShowDetails.bindAsEventListener(this))}},_onToggleShowHideDetails:function(e){e.stop();var d=e.element().up("span");this.container.down(".extension-body").toggleClassName("hidden");d.replace(d.__otherButton)},_enhanceActions:function(){this._enhanceShowDetailsBehaviour();var d=this._startJob.bindAsEventListener(this);this.container.select('button[name="extensionAction"]').each(function(e){if(!e.value.endsWith("Details")){e.observe("click",d)}})},_onBeforeStartJob:function(){var d=this.container.down(".extension-body");if(d){d.hasClassName("hidden")&&this._onToggleShowHideDetails({stop:function(){},element:function(){return this.container.down('button[value="showDetails"]')}.bind(this)});var e=this._prepareProgressSectionForLoading();this._activateMenuItem(d.down('.innerMenu li a[href="#'+e.previous().id+'"]'))}else{this.container.insert({bottom:new Element("div",{"class":"extension-body loading"})})}},_prepareProgressSectionForLoading:function(){var g=this.container.down(".extension-body-progress");if(!g){var e=this.container.select(".extension-body-section").last();g=new Element("div",{"class":"extension-body-progress extension-body-section loading"});e.insert({after:g});var d="extension-body-progress"+e.previous().id.substr($w(e.className)[0].length);e.insert({after:new Element("div",{id:d})});var h="$escapetool.javascript($services.localization.render('extensions.info.category.progress'))";var f=new Element("a",{href:"#"+d}).update(h);this._enhanceMenuItemBehaviour(f);this.container.down(".innerMenu").insert(new Element("li").insert(f))}else{if(g.down(".log-item-loading")){g.down(".extension-question").hide()}else{g.childElements().invoke("hide");g.addClassName("loading")}}return g},_onAfterStartJob:function(e){e.request.options.defaultValues.onComplete(e);var d=this.container.down(".extension-body.loading");if(d){d.remove()}else{this._restoreProgressSection()}},_restoreProgressSection:function(){var d=this.container.down(".extension-body-progress");if(d){d.childElements().invoke("show");d.removeClassName("loading")}},_startJob:function(d){this._submit(d,{onCreate:this._onBeforeStartJob.bind(this),onSuccess:function(e){this._update(e.responseText)}.bind(this),onComplete:this._onAfterStartJob.bind(this)})},refresh:function(d){this.container.addClassName("extension-item-loading");this._refresh(d);this.container.disable()},_refresh:function(e){var d=new Hash(this.container.serialize({submit:false}));e&&d.update(e);this._preserveMenuSelection=true;new Ajax.Request(this._getServiceURL(d.get("section")),{parameters:d,onSuccess:function(f){this._update(f.responseText)}.bind(this),onFailure:function(f){if(this._onAjaxRequestFailure(f)){this._maybeScheduleRefresh(10)}}.bind(this),on0:function(f){f.request.options.onFailure(f)}})},_maybeScheduleRefresh:function(d){d=d||1;this.container.hasClassName("extension-item-loading")&&!this.container.down('button[value="continue"]')&&this._refresh.bind(this).delay(d)},_enhanceMenuBehaviour:function(){var e=".innerMenu li a";var d=this.container.down(e+".current");if(!d||this._preserveMenuSelection){if(this._previouslySelectedMenuItem){d=this.container.down(e+'[href="'+this._previouslySelectedMenuItem+'"]')}else{if(!d){d=this.container.down(e)}}}this._preserveMenuSelection=false;if(d){this._activateMenuItem(d);this.container.select(e).each(this._enhanceMenuItemBehaviour,this)}},_enhanceMenuItemBehaviour:function(d){d.observe("click",function(e){e.stop();this._activateMenuItem(e.element())}.bindAsEventListener(this))},_activateMenuItem:function(e){this.container.select(".extension-body-section").invoke("setStyle",{display:"none"});var d=this.container.down(".innerMenu li a.current");if(d){d.removeClassName("current")}$(e.getAttribute("href").substring(1)).next(".extension-body-section").setStyle({display:"block"});e.addClassName("current")},_fixExtensionLinks:function(d){(d||this.container).select("a.extension-link").each(function(e){var f=e.getAttribute("href").replace(/.*\?/,"");e.setAttribute("href",c.currentDocument.getURL(c.contextaction,f))})},_enhanceProgressBehaviour:function(){var d=this.container.down(".log-item-loading");if(d){var e=d.up();e.scrollTop=e.scrollHeight}this.container.select(".xform label.collapsible").each(function(f){if(f.hasClassName("collapsed")){f.up("dt").next("dd").hide()}f.observe("click",function(){f.toggleClassName("collapsed");f.up("dt").next("dd").toggle()})})},_enhanceDependenciesBehaviour:function(){if(!this.container.hasClassName("extension-item-loading")){this._resolveUnknownDependency(this.container.select(".dependency-item.extension-item-unknown"),0)}},_resolveUnknownDependency:function(f,e){if(e>=f.length){return}var g=new Hash(this.container.serialize({submit:false}));g.unset("extensionVersion");g.unset("form_token");var d=f[e];g.set("extensionId",d.down(".extension-name").innerHTML);g.set("extensionVersionConstraint",d.down(".extension-version").innerHTML);new Ajax.Request(this._getServiceURL(g.get("section")),{parameters:g,onCreate:function(){d.removeClassName("extension-item-unknown").addClassName("extension-item-loading")},onSuccess:function(h){if(d.up("html")){d.insert({before:h.responseText});this._fixExtensionLinks(d.previous());d.remove();this._resolveUnknownDependency(f,e+1)}}.bind(this),onFailure:function(h){d.removeClassName("extension-item-loading").addClassName("extension-item-unknown");this._onAjaxRequestFailure(h)}.bind(this),on0:function(h){h.request.options.onFailure(h)}})},_enhanceDescriptionBehaviour:function(){var d=this.container.down(".extension-versions-link");d&&d.observe("click",function(e){e.stop();e.element().hide().up().addClassName("loading").setStyle({height:"16px",width:"16px"});this._refresh({listVersions:true})}.bindAsEventListener(this))}});c.ExtensionSearchFormBehaviour=Class.create({initialize:function(){this._enhanceSimpleSearch();this._enhanceAdvancedSearch()},_enhanceSimpleSearch:function(){var d=$("extension-search-simple");if(!d){return}$("extensionSearchRepositoryList").observe("change",function(f){$("extensionSearchInput").focus();var e=f.element().form;e.submit.bind(e).defer()}.bindAsEventListener(this))},_enhanceAdvancedSearch:function(){var g=$("extension-search-advanced");if(!g){return}var d=g.down("legend a");if(d){var f=d.up("legend").next().next();if(f){d.observe("click",function(h){h.stop();d.blur();f.toggleClassName("hidden");d.toggleClassName("expanded")});var e=f.down("a.actionCancel");if(e){e.observe("click",function(h){h.stop();e.up("form").select("input[type=text]").each(function(i){i.value=""});d.click()})}}}}});var a=function(d){((d&&d.memo.elements)||[$("body")]).each(function(e){e.select(".extension-item").each(function(f){!f._extensionBehaviour&&new c.ExtensionBehaviour(f)})})};var b=function(d){new c.ExtensionSearchFormBehaviour();a(d);return true};(c.domIsLoaded&&b())||document.observe("xwiki:dom:loaded",b);document.observe("xwiki:dom:updated",a);return c}(XWiki||{}));require(["jquery"],function(b){var a=function(){var c=this;var g=function(h){if(b(h.target).closest(".actions",this).length==0){b(this).parent("li").toggleClass("collapsed")}};var f=function(){var k=b(this).closest(".node",c).next("ul").find(".node").not(".parent").find('input[type="checkbox"]');var j=k.length;var h=k.filter(":checked").length;var i="$escapetool.javascript($services.localization.render('extensions.uninstall.cleanPages.selectedCount', ['__selectedCount__', '__total__']))";b(this).text(i.replace("__selectedCount__",h).replace("__total__",j));b(this).next().prop("checked",h>0)};var e=function(){b(this).closest(".node",c).next("ul").find('input[type="checkbox"]').prop("checked",b(this).prop("checked"))};var d=b(this).find("ul").prev(".node").addClass("parent");b(this).hasClass("collapsible")&&d.click(g);if(b(this).hasClass("selectable")){d.append('<span class="actions"><input type="checkbox"/></span>');d.find('.actions input[type="checkbox"]').click(e).before('<span class="selectedCount"/>').prev(".selectedCount").each(f);b(this).find('input[type="checkbox"]').click(function(){b(c).find(".selectedCount").each(f)})}};b(".document-tree").each(a);document.observe("xwiki:dom:updated",function(c){b(c.memo.elements).find(".document-tree").each(a)})});require(["jquery"],function(e){var a=function(f){if(e(this).children(".ui-progress").size()>0){setTimeout(e.proxy(b,this),f||1000)}else{e(this).prev("form").find("button").prop("disabled",false)}};var b=function(g){var f=e(this).prev("form").find("input[name=asyncURL]").prop("value");e.post(f,g||{},e.proxy(d,this)).fail(e.proxy(a,this,10000))};var d=function(g){var f=e(this).hide().after(g).next(".extensionUpdater");e(this).remove();f.each(a).each(function(){document.fire("xwiki:dom:updated",{elements:[this]})});f.children(".extension-body-progress").find(".log-item-loading").each(function(){this.parentNode.scrollTop=this.parentNode.scrollHeight})};var c=function(h){h.preventDefault();if(e(this).parent(".dropdown-menu").size()>0){var f=e(this).closest(".button-group").children(".dropdown-toggle");f.prev().insertAfter(this);f.before(this)}var g=e(this).closest("form");g.find("button").prop("disabled",true);var i={};i[this.name]=this.value;g.next(".extensionUpdater").each(e.proxy(b,null,i))};e(".extensionUpdater").each(a).prev("form").find("button").click(c)});