var XWiki=(function(c){var a=c.widgets=c.widgets||{};a.ButtonGroup=Class.create({initialize:function(d){this.container=d;this._dropDownMenu=d.down(".dropdown-menu");this._dropDownToggle=d.down(".dropdown-toggle");if(this._dropDownMenu&&this._dropDownToggle){this._dropDownToggle.observe("click",this._onClick.bindAsEventListener(this));this._dropDownToggle.observe("keydown",this._onKeyDown.bindAsEventListener(this));this._dropDownToggle.observe("blur",this._scheduleClose.bind(this));this._dropDownToggle.observe("focus",this._cancelClose.bind(this));this._dropDownMenu.observe("click",this._scheduleClose.bindAsEventListener(this));this._dropDownMenu.select("a, input, button").each(function(e){e.observe("blur",this._scheduleClose.bind(this));e.observe("focus",this._cancelClose.bind(this))}.bind(this))}},_onClick:function(d){d.stop();this._dropDownMenu.toggleClassName("open")},_onKeyDown:function(d){d.keyCode==27&&this._dropDownMenu.removeClassName("open")},_scheduleClose:function(d){var e=d&&d.type=="click";this._closing=true;(function(){(this._closing||e)&&this._dropDownMenu.removeClassName("open");delete this._closing}).bind(this).delay(0.15)},_cancelClose:function(){this._closing=false}});a.DynamicButtonGroup=Class.create({initialize:function(d){var g=d.select("button, input.button, a").filter(function(h){return h.offsetWidth>0});if(g.length<2){return}g.each(function(h){h.up().hasClassName("buttonwrapper")&&h.up().insert({before:h}).remove()});d.className="buttonwrapper button-group initialized";g[0].insert({after:new Element("a",{href:"#dropDownMenu","class":"dropdown-toggle"+(g[0].hasClassName("secondary")?" secondary":""),tabindex:0}).insert(new Element("span"))});var e=new Element("span",{"class":"dropdown-menu"});for(var f=1;f<g.length;f++){e.insert(g[f].removeClassName("secondary"))}g[0].next().insert({after:e});new a.ButtonGroup(d)}});var b=function(d){((d&&d.memo.elements)||[$("body")]).each(function(e){e.select(".button-group").each(function(f){if(!f.hasClassName("initialized")){new c.widgets.ButtonGroup(f);f.addClassName("initialized")}});e.select(".dynamic-button-group").each(function(f){new c.widgets.DynamicButtonGroup(f)})});return true};(c.domIsLoaded&&b())||document.observe("xwiki:dom:loaded",b);document.observe("xwiki:dom:updated",b);return c}(XWiki||{}));