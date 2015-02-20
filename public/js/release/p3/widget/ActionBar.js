define("p3/widget/ActionBar", [
	"dojo/_base/declare","dijit/_WidgetBase","dojo/on",
	"dojo/dom-class","./Button","dojo/dom-construct"
], function(
	declare, WidgetBase, on,
	domClass,Button,domConstruct
){
	return declare([WidgetBase], {
		"baseClass": "ActionBar",
		constructor: function(){
			this._actions={}
		},
		selection: null,
		_setSelectionAttr: function(sel){
			console.log("setSelection", sel);
			this.selection = sel;

//			return;
			var valid;
			var selectionTypes = {}
			sel.forEach(function(s){
				selectionTypes[s.type]=true;
			});
	
			if (sel.length>1){
				var multiTypedSelection = (Object.keys(selectionTypes).length>1)?true:false;
				console.log("isMultiTyped: ", multiTypedSelection);	
				valid = Object.keys(this._actions).filter(function(an){
					console.log("Check action: ", an, this._actions[an].options);
					return this._actions[an] && this._actions[an].options && this._actions[an].options.multiple && (!multiTypedSelection || (multiTypedSelection && this._actions[an].options.allowMultiTypes))
				},this);	

				console.log("multiselect valid: ", valid)
			}else if (sel.length==1){
				valid = Object.keys(this._actions)
			}else{
				valid=[];
			}

			var types = Object.keys(selectionTypes)

			valid = valid.filter(function(an){
				var act = this._actions[an];
				var validTypes = act.options.validTypes||[];
				return validTypes.some(function(t){
					return ((t=="*") || (types.indexOf(t)>=0));
				});		
			},this);

			Object.keys(this._actions).forEach(function(an){
				var act = this._actions[an];
				if (valid.indexOf(an)>=0){
					domClass.remove(act.button, "dijitHidden");
				}else{
					domClass.add(act.button,"dijitHidden");
				}
			},this);

		},

		postCreate: function(){
			this.inherited(arguments);
			var _self=this;
			on(this.domNode, "click", function(evt){
				var rel = evt.target.attributes.rel.value;
				if (_self._actions[rel]) {
					_self._actions[rel].action.apply(_self,[_self.selection]);
				}
			});	
		},

		addAction: function(name,classes,opts,fn,enabled){
			var b = domConstruct.create("i",{'className':(enabled?"":"dijitHidden ")+"ActionButton " +classes,rel:name});

			domConstruct.place(b,this.domNode,"last");

			this._actions[name]={
				options: opts,
				action: fn,
				button: b
			};
				
		}
		
	});
});
