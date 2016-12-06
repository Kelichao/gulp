
/*
*author: kelichao
*date: 20160704
*detail: 财经记者js
*/

define(function(require){

	require("ifind.dialog");
	require('thsPage');
	require('autoComplete');
	require("app/UserInfoView");
	require("jquery.qrcode");
	require("app/messageNotify");
	require("app/roadShow");
	

	var laypage = require("laypage");
	var tmp = require('artTemplate');
	var tj = require('./statistics');
	var FeedBackTip = require("./toolTip");
	var Handlebars = require("handlebars");
	var SettledTip=require("app/nav"); //侧边栏模块

	// 全局对象

	var myReporter = {};

	// 引入大神模块的两个变量

	var sw = "";

	var praiseDict={};
	
	//固定配置

	myReporter.DEFAULT = {
		returnError:"请求返回错误",
		iframeUrl: "/thsft/iFindService/IStrategy/road-show/comment",
		ajaxList: "/thsft/iFindService/IStrategy/road-show/ajax-get-user-comment-list",
		introduce: "/thsft/iFindService/IStrategy/subject/ajax-agency-introduce",
		reportList: "/thsft/iFindService/IStrategy/finance/ajax-get-relation-user-list",
		reportCollectComment: "/thsft/iFindService/IStrategy/road-show/ajax-collection-comment",
		reportCollectHistory: "/thsft/iFindService/IStrategy/road-show/ajax-collection-record",
		Uncollect:"/thsft/iFindService/IStrategy/road-show/ajax-unbook-record-or-comment",
		roadShowCommentUrl: "/thsft/iFindService/IStrategy/road-show/view-detail",
		collect: "/thsft/iFindService/IStrategy/road-show/ajax-book-record-or-comment",
		uncollect: "/thsft/iFindService/IStrategy/road-show/ajax-unbook-record-or-comment",
		delete: "/thsft/iFindService/IStrategy/road-show/ajax-remove-article",
		historyRecordDetail: "/thsft/iFindService/IStrategy/road-show/history-record-detail",
		check: "/thsft/iFindService/IStrategy/road-show/ajax-get-comment-status",
		praise: "/thsft/iFindService/IStrategy/road-show/ajax-get-good-status",  //"/thsft/iFindService/IStrategy/interactive-easy/ajax-verify-currentuser-is-praise",
		addNum: "/thsft/iFindService/fianace/ajax-read-num-acticle",
		address: {},
	};

	// 功能模块配置

	myReporter.paramModule = {
		dialogState: true,
		dialogOption: {
			top: 30,
			width: 900,
			height: 450,
			dispose:true,
			overlay: true,
			url: myReporter.DEFAULT.iframeUrl,
			opacity: 0.3,
			show: true
		},
		common: {
			loadingHTML: '<div id="jiazai">正在努力加载中...</div>',
			layerHTML: '<div class="layer"></div>',
			showLoading: function(parentSelector){
				$(this.loadingHTML).appendTo(parentSelector).show();
				$(this.layerHTML).appendTo(parentSelector);
			},
			removeLoading: function(){
				$('#jiazai').remove();
				$('.layer').remove();
			}
		},
		iframeParam:{
			postid: null,
			thsuserid: null,
		},
		ajaxData: {
			page: 1,
			pagesize:8,
			ifindid: $("#ifindid").attr("data-id"),
		},
		ajaxCollectData: {
			page: 1,
			pagesize:8,
		},
		ajaxHistoryData: {
			page: 1,
			pagesize:8,
		},
		UncollectHistoryData: {
			id: null,
			type: 1,
		},
		UncollectAnalyseData: {
			id: null,
			type: 2,
		},
		deleteData: {
			id: null,
		},
		collectAnalyseData: {
			id: null,
			type: 2,
		},
		collectText: {
			success: "取消成功",
			fail: "取消失败"
		},
		deleteText: {
			success: "删除成功",
			fail: "删除失败"
		}

	}

	// 定义工具模块

	myReporter.toolModule = (function(defaultModel, paramModule) {

		var param = paramModule;
		var Default = defaultModel;

		// toolModule内部构造函数

		var PersonTools = function() {
			this._default = Default;
			this._param = param;
		};

		PersonTools.fn = PersonTools.prototype;
		
		// ajax请求

		PersonTools.fn.ajaxGetList = function(page, pageCont, temp, tempCont, data, url) {

			var root = this;

			if (typeof page == "number") {
				data.page = page;
			}

			$.ajax({
				url: url,
				type: "GET",
				data: data,
				beforeSend: function(){
					param.common.showLoading('body');
				},
				success: function(respon){
					param.common.removeLoading('body');

						var res = respon;

						if (typeof res === "object") {
							if(res.errno == "0" && res.data){

								//模板渲染

								var tempObject = temp.html();
								var template = Handlebars.compile(tempObject);
								console.log(template(res))
								tempCont.html(template(res.data));

								//生成页码

								laypage({
								    cont: pageCont, // 页码生成容器
								    pages:res.data.total_pages,  // pageSize 总共有几页  //total_pages
								    skip:true, // 暂未知
								    prev:'<', // 暂未知
								    next:'>', // 暂未知
								    first:1, // 暂未知
								    last:10, // 暂未知
								    curr:res.data.page || 1, // 当前页码
								    jump: function(obj,first){  // first应该指的是刚生成后的初始页码
								        if(!first){	
								        	root.ajaxGetList(obj.curr, pageCont, temp, tempCont, data, url)
								        }
								    } // end jump
								});

								var selectedItem = Default.address.postid;
								var isFind = false;

								// 进行弹窗

								if(param.dialogState == true && Default.address.show == "cmt" ) {
									$.each($(".proRoadBox .r-cont h5"), function() {

										var contentId = $(this).parents(".r-cont").data("url");

										if (contentId == selectedItem) {
											isFind = true;
											$(this).trigger("click");
										}
									});

									if (!isFind && selectedItem != undefined ) {
										Dialog.alert("当前查看的观点已被删除");  
									}

									param.dialogState = false;
								}


							}

						} else {
							console.warn(Default.returnError);
						}

				},
				error: function() {
					param.common.removeLoading('body');
					console.warn(Default.returnError);
				},
			});
		}

		// 取消收藏的aiaj请求

		PersonTools.fn.unCollectOrDelete = function(url, data, callback, text) {
			$.ajax({
				url: url,
				data: data,
				beforeSend: function() {
					param.common.showLoading('body');
				},
				success: function(respon) {
					param.common.removeLoading('body');
					if (typeof respon === 'object') {
						if (respon.errno == 0) {

							Dialog.alert(text.success);
							callback();

						}else{
							Dialog.alert(text.fail + respon.error);
						}
					} else {
						console.error("请求失败");
					}
				},
				error: function() {
					param.common.removeLoading('body');
					console.error("请求失败");
				}
			})
		};

		// 弹窗函数

		PersonTools.fn.showDetail = function(e, state){

    	e.preventDefault();

    	var btn=$(e.target).parents(".r-cont");
    	var id=btn.attr("data-url");

    	if(!id) {
    		return;
    	}

    	var parent=btn;

    	parent = $(e.target).parents(".road-analyse-li");

    	var cmtSpan=parent.find(".pNum");
    	var praiseSpan=parent.find(".upNum");
    	var number=parent.find(".r-cont");

    	param.iframeParam.postid = id;
    	//param.iframeParam.thsuserid = $("#thsuserid").val();

    	//获取点赞 评论的页面iframeurl
    	var url= Default.roadShowCommentUrl + "?" + $.param(param.iframeParam);

    	var dlg=new Dialog(null,{
	    	title:"路演点评详情",
			top:80,
			width:950,
			height:400,
			move:true,
			overlay:true,
			dispose:true,
			url:url,
            onInit:function(){
                this.dialog.css("overflow","visible");
                var buf=[];

                // 如果是自己 ||普通i策略用户     都不要这个收藏

                var condiction = $("#isself").val() == 1 || !(!!$("#is-reporter").val()) ;

                var condiction2 = !(!!$("#is-reporter").val()) ;

               	//  如果是路演点评打开的

                if (state == true) {
                	if (!condiction) {
                		buf.push('<span class="sb-box sb-box-col"><i class="r-col"></i><span ></span></span>');
                	}

                // 如果是我的收藏点开的

                } else {
                	if (!condiction2) {
                		buf.push('<span class="sb-box sb-box-col"><i class="r-col"></i><span ></span></span>');
                	}
                }

                buf.push('<span class="sb-box sb-box-cmt"><i></i><span id="sb-comment"></span></span>');
                buf.push('<span class="sb-box disable sb-box-praise"><i></i><span id="sb-praise"></span></span>');
                buf.push('<span class="sb-box sb-box-weixin"><i></i><div class="weixin-wrapper" id="weixin">');
                buf.push('</div></span>');
                buf.push('<span class="sb-box sb-box-share"><a href="javascript:void(0)" class="share-tsina" data-cmd="tsina" title="分享到新浪微博"></a></span>');
                buf.push('<span class="sb-box sb-box-share"><a href="javascript:void(0)" class="share-qzone" data-cmd="qzone" title="分享到QQ空间"></a></span>');
                buf.push('<span class="sb-box sb-box-top"><i></i></span>');
                this.content.append("<div class='share-bar'>"+buf.join('')+"</div>");

                var weixinEl=$("#weixin");
                var qrcodeEl=$('<div class="weixin-qrcode"></div>');
                weixinEl.append(qrcodeEl);
                weixinEl.append($("<p>扫一扫，快速分享</p>"));
                url="http://"+window.location.host+url;
                qrcodeEl.qrcode({width:120,height:120,text:url});

                var sbComment=$("#sb-comment");
                var sbPraise=$("#sb-praise");
                var sbCollect=$(".sb-box-col");

                sbComment.html(cmtSpan.html());
                sbPraise.html(praiseSpan.html());
                sbCollect.attr("value", number.attr("data-url")) ;
                var me=this;


		    	window.refreshParam=function(isCmt){
		    		if(isCmt){
		    			var num=parseInt(cmtSpan.html());
		    			num++;
		    			cmtSpan.html(num);
		    			sbComment.html(num);
		    		}else{
		    			var num=parseInt(praiseSpan.html());
		    			num++
		    			praiseSpan.html(num);
		    			sbPraise.html(num);
		    		}
		    	};
		    	var sbTop=this.content.find(".sb-box-top");
		    	var iframe=me.content.find("iframe");
		    	var iframeWin=iframe.get(0).contentWindow;
		    	sbTop.on("click",function(){
		    		$(iframeWin.document.body).animate({scrollTop:0},200);
		    	});

		    	var sbPraiseBtn=sbPraise.parent();

		    	if(praiseDict[id]){
		    		var re=praiseDict[id];
		    		if(re=="1"){
	                	sbPraiseBtn.addClass("selected");
	                }else{
	                	sbPraiseBtn.removeClass("disable");
	                }
		    	}else{

		    		// 获取点赞状态

			    	$.ajax({
			            url:Default.praise,
			            type:"get",
			            data:{id:id},
			            success:function(res){
			                if(res.data.isparise == "1"){
			                	sbPraiseBtn.addClass("selected");
			                }else{
			                	sbPraiseBtn.removeClass("disable");
			                }
			                praiseDict[id]=res.data;
			            }
			        });
		    	};

		    	// 检验是否收藏过
		    	$.ajax({
		    		url: Default.check,
		    		data: {id: param.iframeParam.postid},
		    		success: function(respon) {
		    			if (typeof respon ==="object") {
		    				if (respon.errno === "0") {
		    					var data = respon.data;
		    					if (data === "1") {
		    						sbCollect.find("i").addClass("r-select");
		    					} else {
		    						sbCollect.find("i").removeClass("r-select")
		    					}
		    				}
		    			} else {
		    				console.error("请求错误")
		    			}
		    		},
		    		error: function() {
		    			console.error("请求错误")
		    		}
		    	});

		    	//路演点评收藏

		    	$(".sb-box-col").on("click", function(e){
		    		var url="";
		    		var value = $(this).attr("value");
		    		var data = param.collectAnalyseData;
		    		var state = $(this).find("i").hasClass("r-select");

		    		if (state) {
		    			 url = Default.uncollect;
		    		}else{
		    			url = Default.collect;
		    		}

		    		param.collectAnalyseData.id = value;

		    		$.ajax({
		    			url: url,
		    			data: data,
		    			success: function(respon) {
		    				if (typeof respon === "object") {
		    					if (respon.errno == 0) {
		    						$(e.currentTarget).find("i").toggleClass("r-select");
		    						Dialog.alert(respon.error);
		    					} else {
		    						Dialog.alert(respon.error);
		    					}
		    				} else {
		    					consoe.error("请求发生错误");
		    				}
		    			},
		    			error: function() {
		    				console.error("请求发生错误");
		    			}
		    		})
		    	})

		    	// 判断路演点评是否被赞过
		    	// $.ajax({
		    	// 	url: ""
		    	// })

		    	// 路演点评点赞

		    	sbPraiseBtn.on("click",function(e){
			    	e.preventDefault();
			        var btn=$(this);
			        if(btn.hasClass("disable")) return;
			        if(btn.data("praise")) return;
			        $.ajax({
			            url:"/thsft/iFindService/IStrategy/road-show/ajax-agree-view",
			            type:"post",
			            data:{id:id},
			            success: function() {
			                sbPraiseBtn.addClass("selected");
			                praiseDict[id]="1";
			                btn.data("praise",true);
			                window.refreshParam(false);
			            }
			        });
		    	});

		    	sbComment.parent().on("click",function(e){
		    		var body=$(iframeWin.document.body);
		    		var commentEl=body.find("#comment-form");
		    		var offset=commentEl.offset();
		    		var st=offset.top;
		    		body.animate({scrollTop:st},200);
		    		if(iframeWin.commentForm){
		    			iframeWin.commentForm.focus();
		    		}
		    	});

		    	//触发iframe页面的分享功能
		    	$(document).on('click','.sb-box-share .share-qzone',function(event) {
					if(tj&&tj.ElemClick) tj.ElemClick('icl_56975ff4_827','观点·QQ空间分享');
			        $(iframeWin.document).find('.bdsharebuttonbox .bds_qzone').get(0).click();
			    });

			    $(document).on('click','.sb-box-share .share-tsina',function(event) {
					if(tj&&tj.ElemClick) tj.ElemClick('icl_56975fe8_41','观点·新浪微博分享');
			        $(iframeWin.document).find('.bdsharebuttonbox .bds_tsina').get(0).click();
			    });
            },
	        onBeforeShow: function () {
	        	var pr;
	        	if(document.documentElement.scrollHeight>document.documentElement.clientHeight){
	        		pr=sw+"px";
	        	}else{
	        		pr="0px";
	        	}
	        	$(document.body).css({
	        		"overflow":"hidden",
	        		"padding-right":pr
	        	});
	        },
	        onAfterHide: function () {
	        	$(document.body).css({
	        		"overflow":"",
	        		"padding-right":"0px"
	        	});
	        }
		});
		dlg.show();
    };

    PersonTools.fn.getComputeScrollWidth = function() {
    	var div=document.createElement("div");
    	var s=div.style;
    	s.width="100px";
    	s.height="100px";
    	s.overflow="auto";
    	div.innerHTML='<div style="height:200px;width:100%"></div>';
    	document.body.appendChild(div);
    	var sw=div.offsetWidth - div.scrollWidth;
    	div.parentNode.removeChild(div);
    	return sw;
    };

		//加载机构

		PersonTools.fn.instrusty = function() {

			$("#settledPersonList").hide();
			var userId=$("#userID").attr("data-id");
			// param.common.showLoading('body');

			// 介绍请求

			$.ajax({
				type:'get',
				dataType: 'json',
				url: Default.introduce + '?ifindid=' + userId
			}).done(function(resp){
				var respData=resp.data;
				$(".instrusty").find(".intro-company").text(respData);
			});

			// 关联人物请求

			$.ajax({
				type:'get',
				dataType: 'json',
				url: Default.reportList + '?ifindid=' + userId
			}).done(function(resp){
				param.common.removeLoading();
				if(resp.data.length!=0){
					var html=tmp("settledTaPersonTemp",resp.data);
					$("#settledPerson").html(html);          //settledTaPerson
					$("#settledPersonList").show();
				}else{
					$("#settledPersonList").hide();
				}
			})
		};

		//标签页自动切换

		PersonTools.fn.changeTab = function() {

			var value = window.location.search;
			var urlObject = Default.address = this.address(value);


			if (value.search("show=cmt") != -1) {

				if (value.search("page") != -1 && value.search("show=cmt") != -1) {
					param.ajaxData.page = urlObject.page;
				}

				$("#proRoad").trigger("click");
			} else if (value.search("show=easy") != -1) {
				$("#mainTab li[data-tab='myView']").trigger("click");
			}
		};

		//截取函数

		PersonTools.fn.address = function(value) {

			var str = value,
				arr = [],
				obj = {},
				first,
				final;

			if (typeof str === 'string' && str.length !=0) {

				str = str.substring(1);
				arr = str.split("&");

				for (var i = 0; i<arr.length; i++) {
					first = arr[i].split("=")[0];
					final = arr[i].split("=")[1];
					obj[first] = final;
				}
			}

			return obj;

		};

		//判断是否存在上一个页面

		PersonTools.fn.isHaveHistory = function(){
			var Store=(function(win){
		        var storage=win.localStorage;
		        var name="message-history";
		        return {
		            clear:function(){
		                storage.removeItem(name);
		            },
		            set:function(value){
		                storage.setItem(name,value);
		            },
		            get:function(){
		                var value=storage.getItem(name);
		                return value;
		            }
		        };
		    })(window);
			if(document.referrer!=''&&document.referrer!=window.location.href){
				if(Store.get!=location.href){
					if(sessionStorage.getItem('indexIs')!='finance'){
						resetBtns();
					}
				}
			}else{
				localStorage.removeItem("historyUrl");
			}
			var href = window.location.href;
			var source = href.indexOf("source=StrategyManage") != -1;
			if(source){
				resetBtns()
			}
			function resetBtns(){
				/**Warning 前方大坑,小心行事**/
				$("#bgManage").addClass("have-return");
				$('#J-info-edit').addClass('ml855');
				$('.hasManage').addClass("have-return");
				$('.goMoneyCenter').addClass("have-return");
				$('.return-back').show();
			}
		};

		// 返回上一页

		PersonTools.fn.returnPrev = function(e){
			var ele = $(e.target);
			localStorage.setItem('return',true);
			var href = window.location.href;
            var source = href.indexOf("source=StrategyManage") != -1;
            var flag=window.app&&window.app.sendMessage!==undefined;
            if(source){
            	if (flag) {
	                app.sendMessage("OnClientCmd", ["main=Portfolio"]);
	            } else if (window.external && window.external.OnPreviousPage) {
	                window.external.OnClientCmd("main=Portfolio");
	            }
	            e.preventDefault();
            }else{
            	var historyURL=localStorage.getItem("historyUrl");
                var urlArr=historyURL.split('|');
                var len=urlArr.length-1;
                var returnUrl=urlArr[len];
                if(len==0){localStorage.removeItem("historyUrl")}
                location.href=returnUrl;  
            }
		};

		//给当前页设置本地url存储//循环判断是否相同//存入//清除
		PersonTools.fn.saveUrl = function(){

			var Store=(function(win){
		        var storage=win.localStorage;
		        var name="message-history";
		        return {
		            clear:function(){
		                storage.removeItem(name);
		            },
		            set:function(value){
		                storage.setItem(name,value);
		            },
		            get:function(){
		                var value=storage.getItem(name);
		                return value;
		            }
		        };
		    })(window);

		    function fixBackUrl(url){
		        if(url.indexOf('postid=')!=-1){
		            var ref=url.split('?');
		            var arr=ref[1].split('&');
		            var urls=[];
		            for(var i=0,l=arr.length;i<l;i++){
		                var it=arr[i];
		                if(it.indexOf('postid=')!=-1||it.indexOf('page=')!=-1){
		                    continue;
		                }
		                urls.push(it);
		            }
		            url=ref[0]+'?'+urls.join('&');
		        }
		        return url;
		    }
		    var referrerUrl=document.referrer;
		    referrerUrl=fixBackUrl(referrerUrl);
			if(referrerUrl&&(referrerUrl.indexOf("message-reminder")!=-1||referrerUrl.indexOf("submit-application")!=-1)){
		    	referrerUrl=Store.get();
		    }
			if(localStorage.getItem("historyUrl")!=null){
				var historyUrl=localStorage.getItem("historyUrl")
				var urlArr=historyUrl.split('|');
				var saveFlag=true;
				var index;
				for(var i=0;i<urlArr.length;i++){
					if(urlArr[i]==referrerUrl){
						saveFlag=false;
					}
				}
				if(saveFlag){
					if(referrerUrl!=location.href){
						var historyUrl=historyUrl+"|"+referrerUrl;
						localStorage.setItem("historyUrl",historyUrl);
						urlArr=historyUrl.split('|');
						var len=urlArr.length
						for(var i=0;i<len;i++){
							if(urlArr[i]==location.href){
								index=i;
							}
						}
						urlArr.splice(index,len-index);
						urlArr=urlArr.join('|');
                		localStorage.setItem("historyUrl",urlArr);
					}
				}
			}else{
				localStorage.setItem("historyUrl",referrerUrl);
			}
			if(document.referrer==''){
				sessionStorage.setItem("indexIs","finance");
				localStorage.removeItem("historyUrl");
			}
			localStorage.setItem("currentPage","finance");
			localStorage.setItem("saveUrl",window.location.href);
			localStorage.removeItem("return");
		};

		return new PersonTools(Default, param);

	})(myReporter.DEFAULT, myReporter.paramModule);

	// 事件模块

	var eventModule = (function(toolModel) {

		var proId = null,
			proDoc = $(document),
			tool = toolModel,
			Default = tool._default,
			param = tool._param,
			option = tool._param.dialogOption,
			proDiv = null;

		// tab切换

		proDoc.on("click", "#mainTab li", function(){
			proId = $(this).attr("data-tab");
			proDiv =  proId + "Box";
			$(this).addClass("cur").siblings().removeClass("cur");
			$("." + proDiv).show().siblings().hide();
		});

		// 路演点评弹窗

		proDoc.on("click", ".proRoadBox .r-cont", function(e) {

			tool.showDetail(e,true);

		});

		// 我的收藏弹窗

		proDoc.on("click", ".proCollectBox .r-cont", function(e) {

			// 是否需要收藏按钮

			tool.showDetail(e);

		});

		// 我的收藏 路演记录

		proDoc.on("click", "#r-history", function(){
			tool.ajaxGetList(1, 
							$("#collect-history-page"), 
							$("#road-scjl-temp"), 
							$("#collect-history"),
							param.ajaxHistoryData, 
							Default.reportCollectHistory);
		});

		// 我的收藏 路演点评

		proDoc.on("click", "#proCollect", function() {
			tool.ajaxGetList(1, 
							$("#collect-commont-page"), 
							$("#road-sc-temp"), 
							$("#collect-comment"),
							param.ajaxCollectData, 
							Default.reportCollectComment);
		});

		// 路演点评

		proDoc.on("click", "#proRoad", function() {
			if($("#report_isself").val() == 1){
				param.ajaxData.isself = 1;
			}

			tool.ajaxGetList(null, 
							$("#pro-page"), 
							$("#road-dp-temp"), 
							$("#road-analyse"),
							param.ajaxData, 
							Default.ajaxList);
		});

		// 返回按钮

		proDoc.on("click", ".return-back",function(e){
			tool.returnPrev(e);
		});

		// 媒体介绍

		proDoc.on("click", "#introduce", function() {
			// tool.instrusty();
		});

		proDoc.on("click", "#r-h4", function() {
			var url = $(this).attr("data-url");
			window.location.href = url;
		});

		proDoc.on("click", ".r-tab li", function() {

			var value = $(this).attr("item");

			$(this).addClass("r-on").siblings().removeClass("r-on");
			$("." + value + "-div").show().siblings("div").hide();

		});

		// 取消收藏路演记录

		proDoc.on("click", ".history-uncollect", function() {

			var _this = this;

			var doUncollect = function() {

				var url = Default.Uncollect;
				var callback = function() {
					tool.ajaxGetList(1, 
									$("#collect-history-page"), 
									$("#road-scjl-temp"), 
									$("#collect-history"),
									param.ajaxHistoryData, 
									Default.reportCollectHistory);
				};

				param.UncollectHistoryData.id = $(_this).attr("url-data");
				tool.unCollectOrDelete(url, param.UncollectHistoryData, callback, param.collectText);
			};

			Dialog.confirm("确定要取消收藏该路演记录吗", doUncollect);

		});

		// 取消收藏路演点评

		proDoc.on("click", ".analyse-uncollect", function() {

			var _this = this;

			var doUncollect = function() {

				var url = Default.Uncollect;

				var callback = function() {
						tool.ajaxGetList(1, 
										$("#collect-commont-page"), 
										$("#road-sc-temp"), 
										$("#collect-comment"),
										param.ajaxCollectData, 
										Default.reportCollectComment);
				};

				param.UncollectAnalyseData.id = $(_this).attr("url-data");
				tool.unCollectOrDelete(url, param.UncollectAnalyseData, callback, param.collectText);
			};

			Dialog.confirm("确定要取消收藏该路演点评吗", doUncollect);

		});

		//删除路演点评文章按钮

		proDoc.on("click", ".tool-delete", function() {
			
			var _this = this;


			var deleteAnalyse = function() {

				var url = Default.delete;

				var callback = function() {
					tool.ajaxGetList(1, 
									$("#pro-page"), 
									$("#road-dp-temp"), 
									$("#road-analyse"),
									param.ajaxData, 
									Default.ajaxList);
				};

				param.deleteData.id = $(_this).attr("postid");
				tool.unCollectOrDelete(url, param.deleteData, callback, param.deleteText);
			};

			Dialog.confirm("确定要删除该路演点评吗", deleteAnalyse);
		});

		//编辑文章按钮

		proDoc.on("click", ".tool-edit", function() {
			var number = $(this).attr("number");
			// var value = $(this).parents(".road-analyse-li").find(".r-cont").attr("data-url");
			var value = $(this).attr("dataid");
			var url = Default.historyRecordDetail + "?roadShowNum=" + number + "&edit="+ value ;

			window.location.href = url;
		})


	})(myReporter.toolModule); 

	// 事件模块结束

	//自执行模块

	var initModule = (function(toolModule) {

		var tool = toolModule;

		sw = tool.getComputeScrollWidth();

		SettledTip.init();

		// 返回地址

		tool.saveUrl();
		
		// 返回按钮

		tool.isHaveHistory();

		// tab 跳转

		tool.changeTab();

		FeedBackTip.init('.main');
  		
  		if ($("#introduce").length) {
  			tool.instrusty();
  		}
		
	
	})(myReporter.toolModule);


 });


