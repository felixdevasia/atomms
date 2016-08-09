function vzwSiteCatalystWrapper(scobject) {
	var sep = "/";
	var evtSep = ",";
	var host = "";
	var pageUrl = "";
	var sc = scobject;
	//var scBackup = null;
	var businessFlag = "";
	var adapterValid = true;
	var v = (sc != undefined && sc != null);
	if (!v) {
		adapterValid = false
	}
	var debugSelf = false;
	this.init = function(debugMe) {
		if (validAdobeSiteCatalystObject()) {
			sc.prop35 = "english";
			sc.un = "vzwitestenv";
			host = window.location.host;
			pageUrl = window.location.href;
			if (isProductionServer() == true) {
				sc.un = "vzwiglobal,vzwiconsumer"
			}
			if ((pageUrl.indexOf("//es.verizonwireless.com") > -1)
					|| (pageUrl.indexOf("//estest.verizonwireless.com") > -1)) {
				sc.prop35 = "spanish"
			}
			debugSelf = (debugMe != undefined ? debugMe : false)
		}
	};
	this.setPageName = function(name) {
		try {
			if (document.getElementsByTagName("body")[0].className.indexOf("trade-device-manfacturer") != -1) {
				if (name != null && name != undefined && name.indexOf("trade in/device selection") != -1) {

					var deviceTypeForSC = "";
					if (window.deviceType == 'd') {
						deviceTypeForSC = "/desktop";
					} else if (window.deviceType == 't') {
						deviceTypeForSC = "/tablet";
					} else {
						deviceTypeForSC = "/mobile";
					}
					name = deviceTypeForSC + " store/trade in/select manufacturer";
				}
			}
		} catch (exjs) {}
		if (validAdobeSiteCatalystObject()) {
			var nm = this.replace(name);
			if (nm != null && nm != "null" && nm != "") {
				nm = nm.toLowerCase();
				//sc.pageName = sc.channel + nm;
				sc.pageName = nm;
				//setPathTransaction(name)
			}
		}
	};
	this.setPageNameNoChannel = function(name) {
		if (validAdobeSiteCatalystObject()) {
			var nm = this.replace(name);
			if (nm != null && nm != "null" && nm != "") {
				nm = nm.toLowerCase();
				sc.pageName = nm;
				//setPathTransaction(name)
			}
		}
	};
	/**
	* propName (string) Case Sensitive. must be a site catalyst property (i.e. prop11, eVar75 or channel) found on the sc object.
	* newValue (string | number | null) the value you're setting the property to be.
	**/
	this.setProperty = function(propName,newValue) {
		sc[propName] = newValue;
		if (sc.linkTrackVars.indexOf(propName) === -1) {sc.linkTrackVars += ','+propName;}
			return true;
	};
	/**
	* propName (string) Case Sensitive. must be a site catalyst property (i.e. prop11, eVar75 or channel) found on the sc object.
	**/
	this.getProperty = function(propName) {
		return (typeof sc[propName] !== "undefined") ? sc[propName] : null;
	};
	//In progress - backup/restore not working as intended. All variables are references to original s object, and are updated simultaneously when s is updated.
	// Need a design which allows "saving" the state of the sc object and restoring it to that state.
	/*	this.backupTrackingObject = function() {
			scBackup = sc;
		};
		this.restoreTrackingObject = function() {
			sc = scBackup;
		};
	*/
	this.addEvent = function (eventName) {
		if(typeof sc.events === "undefined" || !sc.events) { //if prop doesn't exist, set it to value
			sc.events = eventName;
		} else if(sc.events.indexOf && sc.events.indexOf(eventName) === -1) { //if value doesn't exist in prop
			if (typeof sc.events === "string") {
				sc.events += ","+eventName; // append value to the end
			} else if (sc.events instanceof Array) {
				sc.events.push(eventName); // add value to the end of array
			} else {
				return false;
			}
		}
		return sc.events;
	};
	this.removeEvent = function (eventName) {
		var index, regex;
		if(typeof sc.events !== "undefined" && sc.events) { //if prop exists
			index = (sc.events.indexOf) ? sc.events.indexOf(eventName) : -1;
			if(index !== -1) { //if value is found in property
				if (typeof sc.events === "string") {
					if(index === 0) { //if it's the first entry, remove the trailing comma if it's there.
						regex = new RegExp(eventName+",?");
					} else { //otherwise, remove the preceeding comma
						regex = new RegExp(","+eventName);
					}
					sc.events  = sc.events.replace(regex,"");
				} else if (sc.events instanceof Array) {
					sc.events.splice(index, 1);
				} else {
					return false;
				}
			}
			if(sc.events.length === 0) {
				sc.events = null;
			}
		}
		return sc.events;
	};
	this.setValue = function(name, value) {
		if (validAdobeSiteCatalystObject()) {
			if (debugSelf) {
				showMsg(value)
			}
			if(name == "EVAR75"){
				sc.eVar75=value;
			}
			if(name == "ClearEvents"){
				sc.eVar75=value;
			}
			if (value != null && value != "null" && value != "") {
				if (name == "Channel") {
					sc.channel = value
				} else {
					if (name == "globalId") {
						sc.eVar32 = value
					} else {
						if (name == "Events") {
							if (sc.events != null) {
								sc.events += evtSep + value
							} else {
								sc.events = value
							}
						} else {
							if (name == "error") {
								sc.prop23 = this.replace(value);
								sc.eVar51 = "D=c23";
								if (sc.events != null) {
									sc.events = sc.apl(sc.events, evtSep
											+ "event13", "", 0)
								} else {
									sc.events = sc.apl(sc.events, "event13",
											"", 0)
								}
							} else {
								if (name == "status") {
									sc.prop24 = value;
									sc.eVar46 = "D=c24"
								} else {
									if (name == "impersonator") {
										sc.eVar43 = "opal";
										sc.prop32 = this.replace(value);
										sc.eVar44 = "D=c32"
									} else {
										if (name == "slByZip") {
											sc.prop36 = "SL|" + value;
											if (sc.events != null) {
												sc.events = sc.apl(sc.events,
														evtSep + "event14", "",
														0)
											} else {
												sc.events = sc.apl(sc.events,
														"event14", "", 0)
											}
										} else {
											if (name == "slByState") {
												sc.prop38 = "SL|" + value;
												if (sc.events != null) {
													sc.events = sc.apl(
															sc.events,
															evtSep + "event14",
															"", 0)
												} else {
													sc.events = sc.apl(
															sc.events,
															"event14", "", 0)
												}
											} else {
												if (name == "customerType") {
													sc.prop34 = this
															.replace(value);
													sc.eVar41 = "D=c34"
												} else {
													if (name == "checkoutEvent") {
														if (sc.events != null) {
															sc.events = sc
																	.apl(
																			sc.events,
																			evtSep
																					+ event14,
																			"",
																			0)
														} else {
															sc.events = sc.apl(
																	sc.events,
																	event14,
																	"", 0)
														}
													} else {
														if (name == "CustomerProspectInd") {
															sc.eVar42 = value
														} else {
															if (name == "PageType") {
																sc.prop10 = value
															} else {
																if (name == "ErrorPageType") {
																	sc.pageType = value
																} else {
																	if (name == "Application") {
																		sc.application = value
																	} else {
																		if (name == "ShippingMethod") {
																			sc.eVar33 = value
																		} else {
																			if (name == "PaymentMethod") {
																				sc.eVar34 = value
																						.toLowerCase()
																			} else {
																				if (name == "PaymentType") {
																					sc.eVar35 = value
																							.toLowerCase()
																				} else {
																					if (name == "BillingState") {
																						sc.state = value
																					} else {
																						if (name == "BillingZip") {
																							sc.zip = value
																						} else {
																							if (name == "Email") {
																								sc.eVar15 = value
																							} else {
																								if (name == "PromoCode") {
																									sc.eVar36 = value
																								} else {
																									if (name == "OrderType") {
																										sc.eVar37 = value
																												.toLowerCase()
																									} else {
																										if (name == "StoreName") {
																											sc.eVar16 = value
																										} else {
																											if (name == "AreaRegion") {
																												sc.eVar12 = value
																											} else {
																												if (name == "MarketZip") {
																													sc.eVar52 = value
																												} else {
																													if (name == "OrderNumber") {
																														sc.purchaseID = value
																													} else {
																														if (name == "AccountID") {
																															sc.eVar11 = value
																														} else {
																															if (name == "EcpID") {
																																sc.prop25 = value;
																																sc.eVar13 = "D=c25"
																															} else {
																																if (name == "AlltelMsg") {
																																	sc.eVar62 = value
																																} else {
																																	if (name == "CPCMerge"
																																			|| name == "CPCSplit") {
																																		sc.prop54 = value
																																	} else {
																																		if (name == "HomepageLinkClick") {
																																			sc.eVar7 = "D=c11"
																																		} else {
																																			if (name == "StoreNumber") {
																																				sc.prop40 = value
																																			} else {
																																				if (name == "ReviewsStarRatingClick") {
																																					sc.eVar27 = value
																																				} else {
																																					if (name == "TradeinValue") {
																																						sc.eVar28 = value
																																					} else {
																																						if (name == "Manufacturer") {
																																							sc.eVar29 = value
																																						} else {
																																							if (name == "Model") {
																																								sc.eVar30 = value
																																							} else {
																																								if (name == "Version") {
																																									sc.prop60 = value
																																								} else {
																																									var finalValue = "";
																																									finalValue = name
																																											+ ' = "'
																																											+ this
																																													.replace(value)
																																											+ '";';
																																									eval(finalValue)
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	this.getValue = function(name) {
		if (validAdobeSiteCatalystObject()) {
			if (debugSelf) {
				showMsg(name)
			}
			if (name != null && name != "null" && name != "") {
				if (name == "Channel") {
					return sc.channel
				} else {
					if (name == "globalId") {
						return sc.eVar32
					} else {
						if (name == "Events") {
							return sc.events
						} else {
							if (name == "error") {
								return sc.prop23
							} else {
								if (name == "status") {
									if (sc.prop24 == null
											|| sc.prop24 == "null"
											|| sc.prop24 == "") {
										sc.prop24 = "Unauthenticated"
									}
									return sc.prop24
								} else {
									if (name == "impersonator") {
										return sc.prop32
									} else {
										if (name == "slByZip") {
											return sc.prop36
										} else {
											if (name == "slByState") {
												return sc.prop38
											} else {
												if (name == "customerType") {
													if (sc.prop34 == null
															|| sc.prop34 == "null"
															|| sc.prop34 == "") {
														sc.prop34 = "b2c"
													}
													return sc.prop34
												} else {
													if (name == "checkoutEvent") {
														return sc.events
													} else {
														if (name == "CustomerProspectInd") {
															if (sc.eVar42 == null
																	|| sc.eVar42 == "null"
																	|| sc.eVar42 == "") {
																sc.eVar42 = "prospect"
															}
															return sc.eVar42
														} else {
															if (name == "PageType") {
																return sc.prop10
															} else {
																if (name == "Application") {
																	return sc.application
																} else {
																	if (name == "ShippingMethod") {
																		return sc.eVar33
																	} else {
																		if (name == "PaymentMethod") {
																			return sc.eVar34
																		} else {
																			if (name == "PaymentType") {
																				return sc.eVar35
																			} else {
																				if (name == "BillingState") {
																					return sc.state
																				} else {
																					if (name == "BillingZip") {
																						return sc.zip
																					} else {
																						if (name == "Email") {
																							return sc.eVar15
																						} else {
																							if (name == "PromoCode") {
																								return sc.eVar36
																							} else {
																								if (name == "OrderType") {
																									return sc.eVar37
																								} else {
																									if (name == "StoreName") {
																										return sc.eVar16
																									} else {
																										if (name == "AreaRegion") {
																											return sc.eVar12
																										} else {
																											if (name == "MarketZip") {
																												return sc.eVar52
																											} else {
																												if (name == "OrderNumber") {
																													return sc.purchaseID
																												} else {
																													if (name == "AccountID") {
																														return sc.eVar11
																													} else {
																														if (name == "EcpID") {
																															return sc.prop25
																														} else {
																															if (name == "AlltelMsg") {
																																return sc.eVar62
																															} else {
																																if (name == "CPCMerge"
																																		|| name == "CPCSplit") {
																																	return sc.prop54
																																} else {
																																	if (name == "HomepageLinkClick") {
																																		return sc.prop11
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	this.setProductView = function(sku_qty_price) {
		if (validAdobeSiteCatalystObject()) {
			var finalValue = "";
			if (IsStringValid(sku_qty_price)) {
				sku_qty_price = sku_qty_price
						.replace(/(free|gratis)/gi, "0.00");
				sku_qty_price = cleanHTMLtags(sku_qty_price);
				sc.products = this.simpleReplace(sku_qty_price)
			}
			
			if (sc.events != null) {
			sc.events = sc.apl(sc.events, evtSep + "event7,prodView,event24", "", 0)
			clearDuplicateEvents();
			} else {
			sc.events = sc.apl(sc.events, "event7,prodView,event24", "", 0)
			}
		}
	};
	this.buildProductsViewString = function(products, category, sku, qty, price) {
		var separator = "";
		if (IsStringValid(products)) {
			separator = ","
		}
		var finalValue = products + separator + category + ";" + sku + ";"
				+ qty + ";" + price;
		return finalValue
	};
	this.setProcessFlowMetrics = function(flowState, flowName_19, flowType_20,
			flowInteraction_21) {

		if (validAdobeSiteCatalystObject()) {
			var finalValue = "";
			if (IsStringValid(flowName_19)) {
				if(this.replace(flowName_19).indexOf("/") == -1){
					sc.prop19 = this.replace(flowName_19);
					sc.eVar8 = "D=c19"
				}
			}
			if (IsStringValid(flowType_20)) {
				if(this.replace(flowType_20).indexOf("/") == -1){
					sc.prop20 = this.replace(flowType_20);
					sc.eVar9 = "D=c20"
				}
			}
			if (IsStringValid(flowInteraction_21)) {
				if(this.replace(flowInteraction_21).indexOf("/") == -1){
					sc.prop21 = this.replace(flowInteraction_21);
					sc.eVar10 = "D=c21"
				}
			}
			if (flowState == "empty"
					&& this.replace(flowName_19).indexOf("/review cart") == -1
					&& this.replace(flowName_19).indexOf("/employee discounts") == -1) {
				fsStripped = "FLOW_STEP"
			} else {
				fsStripped = flowState
			}
			if (IsStringValid(fsStripped)) {
				var fsStripped = removeWhiteSpaces(fsStripped).toUpperCase();
				if (fsStripped == "FLOW_START" || fsStripped == "FLOW_STEP"
						|| fsStripped == "FLOW_END") {
					if (fsStripped == "FLOW_START") {
						if (sc.events != null) {
							sc.events = sc.apl(sc.events, evtSep
									+ "event6,event7", "", 0)
						} else {
							sc.events = sc.apl(sc.events, "event6,event7", "",
									0)
						}
					} else {
						if (fsStripped == "FLOW_STEP") {
							//alert(sc.events);
							if (sc.events != null && sc.events.indexOf("event7") == -1) {							
								sc.events = sc.apl(sc.events,
										evtSep + "event7", "", 0)
							} else  if (sc.events == null || sc.events.indexOf("event7") == -1){
								sc.events = sc.apl(sc.events, "event7", "", 0)
							}
							
						} else {
							if (fsStripped == "FLOW_END") {
								if (sc.events != null) {
									sc.events = sc.apl(sc.events, evtSep
											+ "event7,event8", "", 0)
								} else {
									sc.events = sc.apl(sc.events,
											"event7,event8", "", 0)
								}
							}
						}
					}
				}
			}
		}
	};
	this.determineValuesFlowMetrics = function(pageName, pageType, flowFlag,
			flowTypeFlag, flowInteractionFlag, flowState,
			lastIndexFlowInteraction) {
		var sc_FlowType = "";
		var sc_FlowName = "";
		var sc_FlowInteraction = "";
		var nm = vzwSc.replace(pageName);
		/* Fix for CR 16759 */
		if(nm != null && nm != undefined && (nm.indexOf("/edge cart restriction") != -1 ||  nm.indexOf("/quick view") != -1 || nm.indexOf("/verizon edge") != -1 ||  nm.indexOf("/clear cart") != -1 )){
		     return;
		}
		if (flowFlag == true) {
			if (nm != null && nm != "null" && nm != "") {
				nm = "/" + pageType + nm.toLowerCase();
				var channelVars = nm.split("/");
				sc_FlowName = "/" + channelVars[2];
				if (flowTypeFlag == true) {
					if (channelVars.length - 1 > 3
							&& (nm.indexOf("/aal/existing fs") != -1
									|| nm.indexOf("/aal/convert fs") != -1
									|| nm.indexOf("/aal/individual plan") != -1
									|| nm.indexOf("/aal/shopping assistant") != -1
									|| nm
											.indexOf("/aal/select phone or device") != -1
									|| nm.indexOf("/aal/nso") != -1
									|| nm.indexOf("/aal/shopping assitant") != -1
									|| nm.indexOf("/upgrade") != -1
									|| nm.indexOf("/employee discounts") != -1
									|| nm.indexOf("/activate device") != -1
									|| nm.indexOf("/activate or switch device") != -1
									|| (nm.indexOf("/change share all plan") != -1 && nm
											.indexOf("/billing options next bill") != -1)
									|| (nm.indexOf("/change share all plan") != -1 && nm
											.indexOf("/review changes next bill") != -1)
									|| (nm.indexOf("/change share all plan") != -1 && nm
											.indexOf("/plan_confirm_alp_ml") != -1) || nm
									.indexOf("/recommended") != -1)) {
						sc_FlowType = "/" + channelVars[2] + "/"
								+ channelVars[3]
					} else {
						if (sc_FlowName.indexOf("/employee discounts") != -1
								|| sc_FlowName.indexOf("/prepay") != -1) {
							sc_FlowType = "/" + channelVars[2] + "/"
									+ channelVars[3]
						} else {
							sc_FlowType = "/" + channelVars[2]
						}
					}
				}
				if (flowInteractionFlag == true) {
					if (IsStringValid(lastIndexFlowInteraction)) {
						if (channelVars.length - 1 > 3
								&& (nm.indexOf("/aal/existing fs") != -1
										|| nm.indexOf("/aal/convert fs") != -1
										|| nm.indexOf("/aal/individual plan") != -1
										|| nm
												.indexOf("/aal/shopping assistant") != -1
										|| nm
												.indexOf("/aal/select phone or device") != -1
										|| nm.indexOf("/aal/nso") != -1
										|| nm.indexOf("/aal/shopping assitant") != -1 || nm
										.indexOf("/upgrade") != -1)) {
							sc_FlowInteraction = "/" + channelVars[2] + "/"
									+ channelVars[3] + "/"
									+ lastIndexFlowInteraction
						} else {
							sc_FlowInteraction = "/" + channelVars[2] + "/"
									+ lastIndexFlowInteraction
						}
					} else {
						if (channelVars.length - 1 > 3
								&& (nm.indexOf("/aal/existing fs") != -1
										|| nm.indexOf("/aal/convert fs") != -1
										|| nm.indexOf("/aal/individual plan") != -1
										|| nm
												.indexOf("/aal/shopping assistant") != -1
										|| nm
												.indexOf("/aal/select phone or device") != -1
										|| nm.indexOf("/aal/nso") != -1
										|| nm.indexOf("/aal/shopping assitant") != -1
										|| nm.indexOf("/upgrade") != -1 || nm
										.indexOf("/prepay") != -1)) {
							sc_FlowInteraction = "/" + channelVars[2] + "/"
									+ channelVars[3] + "/"
									+ channelVars[channelVars.length - 1]
						} else {
							sc_FlowInteraction = "/" + channelVars[2] + "/"
									+ channelVars[channelVars.length - 1]
						}
					}
				}
				vzwSc.setProcessFlowMetrics(flowState, sc_FlowName,
						sc_FlowType, sc_FlowInteraction)
			}
		}
	};
	this.getPathFromMLC = function(mlc) {
		pagePath = "";
		eup = false;
		var splitMLC = mlc.split("/");
		if (splitMLC.length > 3) {
			if (splitMLC[3].indexOf("eup") != -1) {
				pagePath = "eup"
			} else {
				if (splitMLC.length > 4) {
					if (splitMLC[4].indexOf("eup") != -1) {
						pagePath = "eup"
					} else {
						pagePath = splitMLC[3]
					}
				} else {
					pagePath = splitMLC[3]
				}
			}
		} else {
			pagePath = "null"
		}
		return pagePath.toLowerCase()
	};
	this.getProductsFromMLC = function(mlc) {
		productString = "";
		productString2 = "";
		var splitMLC = mlc.split("/");
		if (splitMLC.length > 0) {
			productString = splitMLC[splitMLC.length - 1]
		}
		return productString
	};
	this.previousPage = function() {
		sc.t();
		return sc.prop8
	};
	this.submitData = function(errorOccurred) {
		if (validAdobeSiteCatalystObject()) {
			if (errorOccurred != undefined && !errorOccurred) {
				ClearError()
			} else {
				sc.pageName = sc.pageName + " error";
				sc.eVar51 = sc.prop23
			}
			if (debugSelf) {
				showMsg("inside submitSiteCatalystInfo")
			}
			clearDuplicateEvents();
			if (sc.channel == "/business" || businessFlag == "true") {
				if (isProductionServer() == true) {
					sc.un = "vzwiglobal,vzwibusiness"
				}
			}
			cleanProductString();
			var s_code = sc.t();
			if (s_code) {
				document.write(s_code)
			}
			sc.events = null;
			businessFlag = ""
		}
	};
	this.submitDataAsync = function(pageName, pageType, channel, error) {
		if (pageName) {
			this.setPageName(pageName)
		}
		if (pageType) {
			this.setValue("PageType", pageType)
		}
		if (channel) {
			this.setValue("Channel", channel)
		}
		this.determineValuesFlowMetrics(pageName, pageType, true, true, true,
				"FLOW_STEP", "");
		if (!error) {
			ClearError()
		} else {
			if (error) {
				sc.pageName = sc.pageName + " error";
				sc.eVar51 = sc.prop23
			}
		}
		if(pageName.indexOf("/shopping cart/clear cart")  >= 0 || pageName.indexOf("/mini cart") >= 0) {
		   sc.products = undefined;
		}
		if (sc.products) {
			//sc.events = null;
			vzwSc.setProductView(sc.products)
		}
		sc.tl()
	};
	this.trackLink = function(name, type) {
		var type = (type) ? type : "o";
		if(typeof name === "undefined") {return;}
		name = (typeof name === "string") ? name : name.toString();
		sc.prop11 = name.replace(/\+/g, ' ');
		sc.prop11 = sc.prop11.replace(/[[\]{}|#$%^*!\<\>~;]/g, '');
		sc.prop13 = sc.pageName+"|"+sc.prop11;
		if (sc.linkTrackVars.indexOf('prop11') === -1) {sc.linkTrackVars += ',prop11';}
		if (sc.linkTrackVars.indexOf('prop12') === -1) {sc.linkTrackVars += ',prop12';}
		if (sc.linkTrackVars.indexOf('prop13') === -1) {sc.linkTrackVars += ',prop13';}
		try {
			sc.tl(false, type, sc.prop11);
			if(sc.prop11 === 'search'){
				sc.getAndPersistValue(sc.pageName,'s_sctppn');
			}
		} catch (e) {
			if(!/verizonwireless\.com/.test(window.location.hostname) && typeof console !== "undefined" && typeof console.error === "function") {
				console.error("site catalyst trackLink (s.tl) has errored: " + e);
			}
		}
	};
	this.setGlobalIdForOverlayPages = function() {
		if (validAdobeSiteCatalystObject()) {
			if (window.parent.s != undefined && !IsStringValid(window.parent.s.eVar32)) {
				var g = window.parent.s.eVar32;
				this.setValue("globalId", g)
			}
		}
	};
	this.setRsBusinessFlag = function(flagValue) {
		if (flagValue != null && flagValue != undefined) {
			businessFlag = flagValue
		}
	};
	this.replace = function(a) {

		a = a.trim();
		a = a.split("&reg;").join("");
		a = a.split("reg;").join("");
		a = a.split("&trade;").join("");
		a = a.split("trade;").join("");
		a = a.split("&amp;").join("");
		a = a.split("amp;").join("");
		a = a.split("&ndash;").join("-");
		a = a.split("ndash;").join("-");
		a = a.split("|").join("");
		a = a.split("]").join("");
		a = a.split("[").join("");
		a = a.split("}").join("");
		a = a.split("{").join("");
		a = a.split("&").join("");
		a = a.split("'").join("");
		a = a.split("#").join("");
		a = a.split("$").join("");
		a = a.split("%").join("");
		a = a.split("^").join("");
		a = a.split("*").join("");
		a = a.split(":").join("");
		a = a.split("!").join("");
		a = a.split("<").join("");
		a = a.split(">").join("");
		a = a.split("~").join("");
		a = a.split(";").join("");
		a = a.split("?").join("");
		a = a.split("?").join("");
		a = a.split('"').join("");
		a = a.split("+++").join("+");
		a = a.split("++").join("+");
		a = a.split("+").join(" ");
		a = a.split(".mp4").join("");
		a = a.split(" w/").join(" with ");
		a = a.split("  ").join(" ");

		return a
	};
	this.simpleReplace = function(a) {
		a = a.trim();
		a = a.split("&reg;").join("");
		a = a.split("reg;").join("");
		a = a.split("&trade;").join("");
		a = a.split("trade;").join("");
		a = a.split("&amp;").join("");
		a = a.split("amp;").join("");
		a = a.split("&ndash;").join("-");
		a = a.split("ndash;").join("-");

		a = a.split("  ").join(" ");
		return a
	};
	this.replaceSlash = function(a) {
		a = a.trim();
		a = a.split("/").join(" ");
		return a
	};
	this.getEvents = function() {
		return sc.events
	};
	this.clearValuesOnChangeView = function() {
		sc.eVar16 = "";
		sc.products = undefined
	};
	this.submitStaticPageData = function(channel, pageType, pageName) {
		this.setValue("Application", "vzw");
		this.setValue("Channel", ((typeof channel == "string") ? channel
				: "/vzw"));
		this.setValue("PageType", ((typeof pageType == "string") ? pageType
				: "vzw"));
		this.setPageName(((typeof pageName == "string") ? pageName
				: location.pathname));
		try {
			var globalId = this.getCookieValue("GLOBALID");
			if (typeof globalId != "null" && "" !== globalId) {
				this.setValue("globalId", globalId)
			}
			var zip = this.getCookieValue("ZIPCODE");
			if (typeof zip != "null" && "" !== zip) {
				this.setValue("MarketZip", zip)
			}
			var status = "Unauthenticated";
			var sc_CustomerProspectInd = "prospect";
			var myaccount = this.getCookieValue("myaccount");
			if (typeof myaccount != "null" && myaccount.toLowerCase() == "true") {
				sc_CustomerProspectInd = "customer"
			}
			var loggedIn = this.getCookieValue("loggedIn");
			if (typeof loggedIn != "null" && loggedIn.toLowerCase() == "true") {
				sc_CustomerProspectInd = "customer";
				status = "Authenticated"
			}
			this.setValue("CustomerProspectInd", sc_CustomerProspectInd);
			this.setValue("status", status)
		} catch (err) {
		}
		var scErrorOccurred = false;
		this.submitData(scErrorOccurred)
	};
	this.getCookieValue = function(cookieName) {
		var cVal = "";
		if (typeof Cookie == "object" && typeof Cookie.read != "undefined") {
			cVal = Cookie.read(cookieName)
		} else {
			if (document.cookie) {
				var i, x, y, kvpArr = document.cookie.split(";");
				for (i = 0; i < kvpArr.length; i++) {
					var kvp = kvpArr[i];
					if (typeof kvp == "string" && kvp !== "") {
						var key = kvp.substr(0, kvp.indexOf("=")).replace(
								/^\s+|\s+$/g, "");
						if (cookieName === key) {
							cVal = kvp.substr(kvp.indexOf("=") + 1);
							break
						}
					}
				}
			}
		}
		return (null != cVal) ? cVal : ""
	};
	var addedFeatures = {};
	this.addFeatureProduct = function(sku,quantity,price) {
		var productString = sc.products;
		var newFeature = sku+"_"+quantity+"_"+price;
		if(productString.indexOf("features") === -1) { productString += "features;";}
		addedFeatures[sku] = newFeature;
		productString += newFeature;
		vzwSc.setProductView(productString);
	}
	
	this.removeFeatureProduct = function(sku) {
		if(typeof addedFeatures[sku] !== "undefined") {
			var productString = sc.products;
			productString.replace(addedFeatures[sku],"");
			vzwSc.setProductView(productString);
			delete addedFeatures[sku];
			return true;
		}
		return false;
	};
	
	function showMsg(msg) {
		//alert(msg)
	}
	function validAdobeSiteCatalystObject() {
		if (!adapterValid) {
			echoInvalidSiteCatalystObject()
		}
		return adapterValid
	}
	function trimLeadingSlash(string) {
		return (string.substr(0, 1) === "/") ? string.substr(1) : string
	}
	function setPathTransaction(name) {
		sc.prop2 = "";
		var trimStr = trimLeadingSlash(sc.pageName);
		var channelVars = trimStr.split("/");
		var path = channelVars[1];
		if (channelVars.length >= 3) {
			sc.prop1 = sep + channelVars[1]
		} else {
			sc.prop1 = ""
		}
		for ( var cV = 2; cV <= channelVars.length - 1; cV++) {
			if (typeof sc.prop2 == "undefined") {
				sc.prop2 = ""
			}
			if (path == "device first" && channelVars.length >= 6) {
				if (channelVars[cV] == "select plan"
						|| channelVars[cV].indexOf("config") != -1) {
					sc.prop2 += sep + channelVars[cV]
				}
			} else {
				if (typeof channelVars[cV] != "undefined") {
					sc.prop2 += sep + channelVars[cV]
				}
			}
		}
		if (name.indexOf("change share all plan") != -1
				&& (name.indexOf("/billing options next bill") != -1 || name
						.indexOf("/review changes next bill") != -1)) {
			sc.prop2 = ""
		}
		if (name.indexOf("/recommended") != -1) {
			sc.prop2 = sep + channelVars[2]
		}
	}
	function isProductionServer() {
		if ((host.indexOf("verizonwireless.com") > -1 || host
				.indexOf("vzw.com") > -1)
				&& host.indexOf("testman") == -1
				&& pageUrl.indexOf("extvend") == -1
				&& host.indexOf("tqa") == -1
				&& host.indexOf("tmyacct") == -1
				&& host.indexOf("tlogin") == -1
				&& host.indexOf("pretest") == -1) {
			return true
		} else {
			return false
		}
	}
	function removeWhiteSpaces(str) {
		if (str != null && str != "") {
			str = str.replace(new RegExp(/^\s+/), "");
			str = str.replace(new RegExp(/\s+$/), "")
		}
		return str
	}
	function IsStringValid(str) {
		return (str != null && str != undefined && removeWhiteSpaces(str).length > 0)
	}
	function ClearError() {
		sc.prop23 = "";
		sc.eVar51 = ""
	}
	function echoInvalidSiteCatalystObject() {
		//alert("vzwScAdapter: Invalid Adobe Sitecatalyst Object")
	}
	function cleanHTMLtags(productString) {
		productString = productString.replace(/<\/*\w*>/g, "");
		productString = productString.replace(/\s/g, "");
		productString = productString.replace(/<.*>.*(.*)/g, "");
		return productString
	}
	function clearDuplicateEvents() {
		if (sc.events != null && sc.events != undefined) {
			eventsString = sc.events;
			var splitEvents = eventsString.split(",");
			var noDuplicates = new Array();
			for ( var z = 0; z < splitEvents.length; z++) {
				var duplicate = "false";
				for ( var y = 0; y < noDuplicates.length; y++) {
					if (splitEvents[z] == noDuplicates[y]) {
						duplicate = "true";
					}
				}
				if (duplicate == "false") {
					noDuplicates.push(splitEvents[z]);
				}
			}
			sc.events = noDuplicates.join();
		}
	}
	function cleanProductString() {
		if (sc.products != null && sc.products != undefined) {
			productString = sc.products;
			if (productString.indexOf("$") != -1) {
				sc.products = productString.substring(0, productString
						.indexOf("$"))
						+ productString
								.substring(productString.indexOf("$") + 1);
				cleanProductString()
			}
			if (productString.indexOf("FREE") != -1) {
				sc.products = productString.substring(0, productString
						.indexOf("FREE"))
						+ "0.00"
						+ productString
								.substring(productString.indexOf("FREE") + 4);
				cleanProductString()
			}
			if (productString.indexOf("Unlimited") != -1) {
				sc.products = productString.substring(0, productString
						.indexOf("Unlimited"))
						+ "1"
						+ productString.substring(productString
								.indexOf("Unlimited") + 9);
				cleanProductString()
			}
			if (productString.indexOf(" ") != -1) {
				sc.products = productString.substring(0, productString
						.indexOf(" "))
						+ productString
								.substring(productString.indexOf(" ") + 1);
				cleanProductString()
			}
		}
	}
}
var vzwSc = new vzwSiteCatalystWrapper(s);
vzwSc.init(false);
/* allow decviceDetail page to set sc pageName before Bazaar Voice calls s_doPlugins method */
if(typeof deviceDetailsSCpageName != 'undefined') {
	vzwSc.setPageName(deviceDetailsSCpageName);
}
