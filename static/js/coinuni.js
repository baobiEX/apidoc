(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){e.indexOf('"')===0&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(t," ")),u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g,u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires=="number"){var f=a.expires,l=a.expires=new Date;l.setTime(+l+f*864e5)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{},h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("="),m=r(v.shift()),g=v.join("=");if(t&&t===m){c=o(g,s);break}!t&&(g=o(g))!==undefined&&(c[m]=g)}return c};u.defaults={},e.removeCookie=function(t,n){return e.cookie(t)===undefined?!1:(e.cookie(t,"",e.extend({},n,{expires:-1})),!e.cookie(t))}});
if(typeof CNY == 'undefined' || typeof USD == 'undefined'){
    var CNY = 1;
    var USD = 1;
}
FINANCE = 0;
TRANSFER = [lang('未确认'),lang('等待'),lang('确认中'),lang('已取消'),lang('失败'),lang('已补转'),lang('成功')];
STATUS_CLASS = ['orage','orage','orage','red','red','green','green'];
var PRICE_BTC = {};
function set_PRICE_BTC(str) {
    $.each(coinorder.data,function (i) {
        try {
            PRICE_BTC['PRICE_BTC_'+i] = eval(str+'_'+i);
        }catch (e){}
    })
}
if($.cookie('priceStyle') == 'usd'){
    $(function () {
        $('#priceBtc').html($('.top-user-sel-box .df p:eq(1)').html());
    })
    var priceStyle = 'usd';
    var unit = '$';
    PRICE_BTC.PRICE_BTC = USD;
    set_PRICE_BTC('USD');
}else {
    $(function () {
        $('#priceBtc').html($('.top-user-sel-box .df p:eq(0)').html());
    })
    var priceStyle = 'cny';
    var unit = '￥';
    PRICE_BTC.PRICE_BTC = CNY;
    set_PRICE_BTC('CNY');
}
//获取比特币的人民币价格和美金价格
function priceBtc(price,page,obj)
{
    $('.top-user-sel-box .df').hide();
    $.cookie('priceStyle', price, { expires: 365, path: '/' });
    $('#priceBtc').html($(obj).html());
    if(price == 'usd'){
        priceStyle = 'usd';
        PRICE_BTC.PRICE_BTC = USD;
        set_PRICE_BTC('USD');
        unit = '$';
    }else{
        priceStyle = 'cny';
        unit = '￥';
        PRICE_BTC.PRICE_BTC = CNY;
        set_PRICE_BTC('CNY');
    }
    if(page == 'global'){
        user();
    }
    if(page == 'index'){
        get_data();
        user();
    }
    if(page == 'market'){
        load();
    }
    if(page == 'summary'){
        balance_cb();
    }
}
$(function () {
    $('.top-user-sel-box').hover(function () {
        $(this).find('.df').show();
    },function () {
        $(this).find('.df').hide();
    })
})
function lang(str, re){
    if(typeof langs == 'undefined') langs = false;
    if(langs && typeof langs[str] != 'undefined'){
        str = langs[str];
    }
    if(re) for(var r in re){
        str = str.replace(r, re[r]);
    }
    return str;
}
function subMoneyKeyUp(obj,event,str){
    //str为保留小数
    event = event ? event : window.event;
    if(typeof event !='undefined' && (event.keyCode == 37 || event.keyCode == 39)){
        return;
    }
    var z;
    if(str == 2){
        z = /\d+(\.\d{0,2})?/;
    }else if(str == 3){
        z = /\d+(\.\d{0,3})?/;
    }else if(str == 4){
        z = /\d+(\.\d{0,4})?/;
    }else if(str == 5){
        z = /\d+(\.\d{0,5})?/;
    }else if(str == 6){
        z = /\d+(\.\d{0,6})?/;
    }else if(str == 7){
        z = /\d+(\.\d{0,7})?/;
    }else if(str == 8){
        z = /\d+(\.\d{0,8})?/;
    }else if(str == 9){
        z = /\d+(\.\d{0,9})?/;
    }else if(str == 10){
        z = /\d+(\.\d{0,10})?/;
    }
    if(str){
        obj.value=(obj.value.match(z)||[''])[0];
    }else {
        obj.value=obj.value.replace(/\D/g,'');
    }
}
//去掉无效0
function to_num(num,s) {
    isNaN(num) ? num = 0 : '';
    try {
        var bit_str = num.toString().split('.')[1];
        if(num%1 == 0){
            return parseFloat(num);
            return false;
        }
        for(var i=bit_str.length;i>=0;i--){
            var n = bit_str.substr(i, 1);
            if(n != 0){
                var m = new Number(num);
                if(i >=4 && s==5){
                    return m.toFixed(5);
                }else{
                    return m.toFixed(i + 1);
                }
                if(i >=7 && s==8){
                    return m.toFixed(8);
                }else{
                    return m.toFixed(i + 1);
                }
                if(i >=9 && s==10){
                    return m.toFixed(10);
                }else{
                    return m.toFixed(i + 1);
                }
                return false;
            }
        }
    }catch(e){}
}
function goods_num() {
    $('.is_num').each(function () {
        $(this).html(to_num($(this).html()));
    })
    $('.is_num_5').each(function () {
        $(this).html(to_num($(this).html(),5));
    })
    $('.is_num_8').each(function () {
        $(this).html(to_num($(this).html(),8));
    })
    $('.is_num_10').each(function () {
        $(this).html(to_num($(this).html(),10));
    })
}
//检测邮箱
function checkemail(obj){
    if($(obj).val() == ''){
        $('#email-error').show().html(lang('邮箱不能为空'));
        return false;
    }
    var patrn_email=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!patrn_email.exec($(obj).val())){
        $('#email-error').show().html(lang('邮箱格式不正确'));
        return false;
    }
    return true;
}
COMMON_INDEX={
    //显示||隐藏交易密码输入框
    pwTradeInput:function (hideParam) {
        var userData = $.cookie()['USER'];
        if (userData != undefined){
            userDataArr = userData.split(',');
            if(userDataArr[6]  == (hideParam ? hideParam: 0)){
                $('.pwdtrade').hide();
            }
        }
    }
};
//captcha
function show_captcha(id) {
    if (typeof id == 'undefined') id = 'captcha';
    $('#img-' + id).attr('src', '/index/captcha/?t=' + Math.random());
}
// status
function fncTrade(s) {
    var status = [lang('状态'), lang('等待'), lang('未成交'), lang('已撤消'), lang('全部成交')];
    return s ? status[s] : status;
}
// figure
FF={
    add: function(a,b){return (Math.round(a*1000000)+Math.round(b*1000000))/1000000},
    mul: function(a,b){return (Math.round(a*1000000)*Math.round(b*1000000))/1000000/1000000}
};
// timestamp
function fncDT(d, nt) {
    if (!d) return lang('刚刚');
    var time = new Date((parseInt(d) + 28800) * 1000);
    var ymd = time.getUTCFullYear() + "/" + (time.getUTCMonth() + 1) + "/" + time.getUTCDate() + ' ';
    if (nt) return ymd;
    return ymd + time.getUTCHours() + ":" + (time.getUTCMinutes() < 10 ? '0' : '') + time.getUTCMinutes();
}
// 设配首页和交易页面格式化小数改进版
function formatfloatimprovement(f, size, add) {
	f = parseFloat(f);
	var conf = {2:[100, 0.01], 3:[1000, 0.001], 4:[10000, 0.0001], 5:[100000, 0.00001], 6:[1000000, 0.000001], 7:[10000000, 0.0000001], 8:[100000000, 0.00000001]};
	if(f >= 1){
		var conf = conf[2];
		var ff = Math.floor(f * conf[0]) / conf[0];
		if(add && f > ff) ff += conf[1];
		if(ff > 0) return ff;
		return 0;
	}
	else if(f < 1 && f > 0) {
		var bit_str = f.toPrecision(2);
		if(bit_str > 0) return bit_str;
		return 0;
	}else{
		return 0;
	}
}

function ltcb(d) {
    if (typeof(d) == 'string') {
        try {
            d = eval('(' + d + ')');
        } catch (e) {
        }
    }
    if ('LT' == d.msg) {
        USER = '';
        FINANCE = 0;
        return loginpop(lang('登录超时，请重新登录'));
    }
    if(d.msg == 'LCT'){
        var url = window.location.href;
        if(url.indexOf('location') < 0 ) {
            location.href='/user/login?v=location';
        }
        return false;
    }
    return 1;
}

function loginpop(msg) {
}

function umenu(){
    if (typeof FINANCE != 'object') return balance();
    var ListStr = '<a href="/finance/withdrawal/coin/btc/" ><li> <div class="userinfo-Coin"><span class="im_coin coin_btc"></span>BTC</div> <div class="userinfo-available is_num">' + FINANCE.data['btc_balance'] + '</div> <div class="userinfo-frozen is_num">' + FINANCE.data['btc_lock'] + '</div> </li></a><a><li> <div class="userinfo-Coin"><span class="im_coin coin_usc"></span>USC</div> <div class="userinfo-available is_num">' + FINANCE.data['usc_balance'] + '</div> <div class="userinfo-frozen is_num">' + FINANCE.data['usc_lock'] + '</div> </li></a>';
    for (var i in COIN) {
        if(i != 'btc'){
            ListStr += '<a  href="/finance/withdrawal/coin/'+i+'" ><li> <div class="userinfo-Coin"><span class="im_coin coin_' + i + '"></span>' + i.toUpperCase() + '</div> <div class="userinfo-available is_num">' + FINANCE.data[i + '_balance'] + '</div> <div class="userinfo-frozen is_num">' + FINANCE.data[i + '_lock'] + '</div> </li></a>'
        }
        if(i == 'bt1'){
            $('#bt1_balance').html(FINANCE.data[i + '_balance']);
        }
        if(i == 'bt2'){
            $('#bt2_balance').html(FINANCE.data[i + '_balance']);
        }
    }
    $('#max-coin-btc').html(parseFloat($('#bt1_balance').html()) > parseFloat($('#bt2_balance').html()) ? $('#bt2_balance').html() : $('#bt1_balance').html());
    $('#max-coin-btc').attr('data-value',parseFloat($('#bt1_balance').html()) > parseFloat($('#bt2_balance').html()) ? $('#bt2_balance').html() : $('#bt1_balance').html());
    var menu = '<div class="listscoll" id="userinfo-list"> ' + ListStr + '</div>';
    $('#user-balance').html(menu);
    $('#balance_total').html(FINANCE.data['btc_total'] + ' BTC');
	$('#usc_total').html(FINANCE.data['usc_total'] + ' USC');

    $('#btc_balance,#max-coin-bt1,#max-coin-bt2').html(FINANCE.data['btc_balance']);
    $('#max-coin-bt1,#max-coin-bt2').attr('data-value',FINANCE.data['btc_balance']);
    goods_num();
}
function loginga(ns){
    ns = ns || '';
    $.post('/user/email/', {email: $('#login-email-i').val()}, function (d) {
        if(d.status){
            $('.index_banner .well').css("top","38px");
            // email hide
            $('#email-error').html('').hide();
            // GA
            if (4 & d.data){
                gashow(ns, 1);
                $('.index_banner .well').css("top","10px")
            } else {
                $('#ga' + ns).hide();
            }
        } else {
            // alert msg
            $('#email-error').html(d.msg).show();
        }
    }, 'json');
}
function gashow (ns, show){
    if(show) $('#ga'+ns).show();
    else $('#ga'+ns).hide();
}

function balance_cb(){}

function balance(){
	if (typeof FINANCE == 'object') {
        balance_cb();
        umenu();
    } else {
        FINANCE = 1;
        $.getJSON('/ajax/user/finance/', function (d) {
            if (!ltcb(d))return;
            FINANCE = d;
            umenu();
            balance_cb();
			user();
        });
    }
}
//3s定时器
function set_time3s (setTimeName) {
    clearTimeout(eval(setTimeName+'_t'));
    window[setTimeName+'_t'] = setTimeout(setTimeName+'(\'market\')',3000);
}
LOCAL = {};
//数据+当前时间写入缓存
LOCAL.write_data = function (d,localName) {
    if(localName){
        var timestamp = Date.parse(new Date());
        d.times = timestamp;
        obj = JSON.stringify(d)
        localStorage.setItem(localName, obj)
    }
}
//验证3s内的数据时读取接口
LOCAL.check_data = function (name,ajaxname,m) {
    var myorder_localStorage = JSON.parse(localStorage.getItem(name));
    if(myorder_localStorage){
        var timestamp = Date.parse(new Date());
        if((timestamp-myorder_localStorage.times)<3000){
            if(m){
                eval(ajaxname+"_html")(myorder_localStorage);
            }else{
                TMPL.localList(1, {name:ajaxname},'',10,myorder_localStorage)
            }
            set_time3s(ajaxname);
        }else{
            eval(ajaxname+"_ajax")();
        }
    }else{
        eval(ajaxname+"_ajax")();
    }
}
TMPL = {};
TMPL.list = function (p, config, code, num, localName, setTimeName) {
    $.post(config.url + '?p=' + p, function (d) {
        if (!ltcb(d))return;
        if (!d.status) return alert(d.msg);
        LOCAL.write_data(d,localName)
        if ('' == d.data.datas) {
            $('#grid-' + config.name).html('<p class="zwjl">'+lang('暂无记录')+'</p>');
        } else {
            if(num)d.data.datas= d.data.datas.slice(0,num);
            try {
                $('#tmpl-' + config.name).tmpl(d.data.datas).htm('#grid-' + config.name);
            }catch (e){}
        }
        goods_num();
        TMPL.pages(d.data.page, config.name);
        TMPL.listcb(d);
        if (typeof code != 'undefined')eval(code);
    }, 'json').complete(function () {
        if(setTimeName){
            set_time3s(setTimeName)
        }
    })
};
//缓存模板
TMPL.localList = function (p, config, code, num, d) {
    if (!ltcb(d))return;
    if (!d.status) return alert(d.msg);
    if ('' == d.data.datas) {
        $('#grid-' + config.name).html('<p class="zwjl">'+lang('暂无记录')+'</p>');
    } else {
        if(num)d.data.datas= d.data.datas.slice(0,num);
        try {
            $('#tmpl-' + config.name).tmpl(d.data.datas).htm('#grid-' + config.name);
        }catch (e){}
    }
    goods_num();
    TMPL.pages(d.data.page, config.name);
    TMPL.listcb(d);
    if (typeof code != 'undefined')eval(code);
};
TMPL.listcb = function (d) {
};

TMPL.pages = function (d, id) {
    var o = document.getElementById('page-' + id);
    if (!o) return;
    this.page = parseInt(d.page);
    this.pagemax = parseInt(d.pagemax);
    if (this.pagemax == 0) {
        o.innerHTML = '';
        return;
    }
    this.id = id;
    var prevPage = this.page - 1, nextPage = this.page + 1;
    if (prevPage < 1) {
        var strHtml = '<li class="active disabled not-allow"><a> <i class="icon-angle-left"></i></a> </li>';
    } else {
        var strHtml = '<li> <a onclick="' + id + '(' + prevPage + ');"> <i class="icon-angle-left"></i> </a> </li>';
    }
    if (this.page != 1) strHtml += '<li> <a onclick="' + id + '(1);">1</a> </li>';
    if (this.page >= 5) strHtml += '<li><a onclick="javascript:void(0)">...</a></li>';
    var endPage = this.pagemax > this.page + 2 ? this.page + 2 : this.pagemax;
    for (var i = this.page - 2; i <= endPage; i++)if (i > 0) {
        if (i == this.page) {
            strHtml += '<li class="active disabled"> <a>' + i + '</a> </li>';
        } else if (i != 1 && i != this.pagemax) {
            strHtml += '<li> <a onclick="' + id + '(' + i + ');">' + i + '</a> </li>';
        }
    }
    if (this.page + 3 < this.pagemax) strHtml += '<li><a onclick="javascript:void(0)">...</a></li>';
    if (this.page != this.pagemax) strHtml += '<li> <a onclick="' + id + '(' + this.pagemax + ');"> ' + this.pagemax + ' </a> </li>';
    if (nextPage > this.pagemax) {
        strHtml += '<li class="active disabled not-allow"> <a> <i class="icon-angle-right"></i> </a> </li>';
    } else {
        strHtml += '<li> <a onclick="' + id + '(' + nextPage + ');"> <i class="icon-angle-right"></i> </a> </li>';
    }
    o.innerHTML = strHtml;
};
function Dom(o) {
    return document.getElementById(o);
}
//弹出层
function showDialog(id, maskclick) {
    // 遮罩
    $('#' + id).removeClass('modal-out').addClass('styled-pane');
    var dialog = Dom(id);
    dialog.style.display = 'block';
    if (Dom('mask') == null) {
        $('html').prepend('<div class="ui-mask" id="mask" onselectstart="return false"></div>');
        if (!maskclick)
            $('#mask').bind('click', function () {
                hideDialog(id)
            })
    }
    var mask = Dom('mask');
    mask.style.display = 'inline-block';
    mask.style.width = document.body.offsetWidth + 'px';
    // mask.style.height = document.documentElement.clientHeight + 'px';
    var ispc = isPC();
    if(!ispc){
        //居中
        var elW = dialog.offsetWidth;
        dialog.style.left = '50%';
        dialog.style.top = '15%';
        dialog.style.marginLeft = -elW/2 +'px';
        dialog.style.position = 'fixed';
    }else{
        //居中
        var bodyW = document.documentElement.clientWidth;
        var bodyH = document.documentElement.clientHeight;
        var elW = dialog.offsetWidth;
        var elH = dialog.offsetHeight;
        dialog.style.left = (bodyW - elW) / 2 + 'px';
        dialog.style.top = (bodyH - elH) / 2 + 'px';
        dialog.style.position = 'fixed';
    }
}
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
var ispc = isPC();
$(function () {
    if(!ispc){
        $('body').addClass('body_m');
    }
})
// 关闭弹出框
function hideDialog(id, fn) {
    $('#' + id).removeClass('styled-pane').addClass('modal-out');
    $('#mask').addClass('out');
    setTimeout(function () {
        $('#' + id).hide();
        $('#mask').remove();
    }, 300);
    if (typeof fn == 'function') fn();
}
function inputFB(){
    $('input').focus(function(){
        var t = $(this);
        t.addClass('cur');
        if(t.val() == t.attr('placeholder')) t.val('');
        if(t.attr('type')=='text'||t.attr('type')=='password')t.css({'box-shadow':'0px 0px 3px #1688d0','border':'1px solid #1688d0','color':'#222'});
    });
    $('input').blur(function(){
        var t = $(this);
        t.removeClass('cur');
        if(t.attr('type')=='text'||t.attr('type')=='password')t.css({'box-shadow':'none','border':'1px solid #e1e1e1','color':'#a0a0ab'});
        if(t.attr('type')!='password' && !t.val()) t.val(t.attr('placeholder'));
    });
}
function inputjy() {
    $('.chart-buy input').focus(function () {
        var t = $(this);
        if (t.attr('type') == 'text' || t.attr('type') == 'password')t.css({'border': '1px solid #fff;', 'color': '#222'});
        if (t.val() == t.attr('placeholder')) t.val('');
    });
    $('.chart-buy input').blur(function () {
        var t = $(this);
        if (t.attr('type') == 'text' || t.attr('type') == 'password')t.css({'box-shadow': 'none', 'border': '1px solid #e4e5e9', 'color': '#222'});

    })
}
$(function(){
    if (os.is360se || os.is360se) inputFB();
    inputjy();
});

var inputLen = 8;
//格式化小数
//@f float 传入小数: 123; 1.1234; 1.000001;
//@size int 保留位数
//@add bool 进位: 0舍 1进
function formatfloat(f, size, add){
    f = parseFloat(f);
    var conf = {2:[100, 0.01], 3:[1000, 0.001], 4:[10000, 0.0001], 5:[100000, 0.00001], 6:[1000000, 0.000001], 7:[10000000, 0.0000001], 8:[100000000, 0.00000001], 9:[1000000000, 0.000000001], 10:[10000000000, 0.0000000001]};
    var conf = conf[size];
    var ff = Math.floor(f * conf[0]) / conf[0];
    if(add && f > ff) ff += conf[1];
    if(ff > 0) return ff;
    return 0;
}
//坏数字
function badFloat(num, size){
    if(isNaN(num)) return true;
    num += '';
    if(-1 == num.indexOf('.')) return false;
    var f_arr = num.split('.');
    if(f_arr[1].length > size){
        return true;
    }
    return false;
}
//小数位数
function vNum(o, len){
    if (isNaN(o.value)) o.value = '';
    var value = len?formatfloat(o.value, len, 0):parseInt(o.value);
    if(badFloat(o.value, len)) o.value = value
}
//dialog_login
function dialog_login(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_login">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_login\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="sign_box sign_box_bound">' +
        '<p class="t">Sign In</p>' +
        '<form id="login-form" action="">' +
        '<input type="text" id="email" name="email" placeholder="Email">' +
        '<input type="password" name="pw" placeholder="Password">' +
        '<input style="display: none;" type="text" name="ga" placeholder="GA Password">' +
        '<input type="button" class="btn" onclick="login()" value='+lang('登录')+'>' +
        '</form>' +
        '<p class="has"><a href="/user/forgetpw" class="blue">Forgot password？</a> · <span>Don\'t have an account？</span> <a href="/user/register" class="blue">Sign Up</a></p></div>' +
        '</div>'
    $('body').prepend(html);
    showDialog('dialog_login');
}
//禁止输入特殊字符
function no_special(obj) {
    if(obj.value == ''){
        $(obj).parent().find('.err').html(lang('答案不能为空')).show();
        return false;
    }
    if(!isNaN(obj.value)){
        $(obj).parent().find('.err').html(lang('答案不能为纯数字')).show();
        return false;
    }
    var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
    if(!reg.test(obj.value)) {
        $(obj).parent().find('.err').html(lang('答案不能有特殊字符')).show();
        return false;
    }
    var len = 0;
    var zh_zz = /[\u4E00-\u9FA5]/g;
    if(zh_zz.test(obj.value)){
        var zh = obj.value.match(zh_zz).length;
        var en = obj.value.length - obj.value.match(zh_zz).length;
        len = zh*3 + en;
    }else{
        len = obj.value.length;
    }
    if(len > 21){
        $(obj).parent().find('.err').html(lang('答案不能过长')).show();
        return false;
    }
}
function dialog_forgetpw(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_forgetpw">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_forgetpw\');" class="dialog_closed" title="关闭">×</a>' +
    '<div class="forgetpw_box">' +
    '<h2>'+lang('恭喜您申请找回密码成功!')+'</h2>' +
    '<p>'+lang('系统已发送一封密码重置邮件到您的注册邮箱，请登录邮箱重置。')+'</p>' +
    '<a class="btn" onclick="hideDialog(\'dialog_forgetpw\')">'+lang('确定')+'</a>' +
    '</div>' +
    ' </div>';
    $('body').prepend(html);
    showDialog('dialog_forgetpw');
}
//转出弹出框
function dialog_withdrawal(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_forgetpw">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_forgetpw\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="forgetpw_box withdrawal_box">' +
        '<p>'+lang('请进入注册邮箱进行姓名及生日信息确认。')+'<br>'+lang('确认无误后，平台将审核转出申请')+'</p>' +
        '<a class="btn" onclick="hideDialog(\'dialog_forgetpw\')">'+lang('确定')+'</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_forgetpw');
}
//短信验证码弹窗
function dialog_code() {
    $('#dialog_code').remove();
    var html = '';
    html += '<div class="dialog_content" id="dialog_code">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_code\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="code_box">' +
        '<p class="t">'+lang('请输入验证码')+'</p>' +
        '<p class="po_re"><input class="code_input" type="text" id="captcha"><img onclick="recode()" id="captchaimg" src="/index/captcha/?t=0.21460079976371382"/></p>' +
        '<p><a class="blue" onclick="recode()">'+lang('看不清，再换一张')+'</a></p>' +
        '<a class="btn" data-adopt="0" id="adopt_btn" onclick="getmocode(); hideDialog(\'dialog_code\');">'+lang('确定')+'</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_code');
}
function dialog_active(){
	var name = $('#name').val();
	var time  = $('#time').val();
    var html = '';
    if (name == lang('请输入您的姓名') || time == lang('请输入您的生日')) {
        alert(lang('请输入信息'));
        return false;
    }
    html += '<div class="dialog_content styled-pane" id="dialog_active">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_active\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="forgetpw_box register_box">' +
        '<h2>' + lang('身份信息确认') + '</h2>' +
        '<p>' + lang('以下生日和姓名信息一旦登录不可更改，请确认并牢记！') + '</p>' +
        '<p style="font-size: 13px; color:#ff6767;">' + lang('该信息将用于修改支付密码或修改GA验证码') + '</p>' +
        '<p style="padding-left: 103px;text-align: left; margin-top: 20px;letter-spacing: 1px;">' + lang('姓名') + '：' + name + '</p>' +
        '<p style="padding-left: 103px;text-align: left; margin-top: 10px;letter-spacing: 1px;">' + lang('生日') + '：' + time + '</p>' +
        '<a class="btn left" href="javascript:void(0)"  onclick="active()"   style="width: 190px;">'+lang('确定')+'</a>' +
        '<a class="btn right"  href=""  style="width: 190px;">' + lang('重新输入') + '</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_active');
}
function dialog_national() {
    var html = '';
    var err = typeof(id_err) == 'undefined' ? '' : id_err;
    html +='<div class="dialog_content" id="dialog_national">'+
        '<div class="nationalHeader">'+
        '<em class="icon_important"></em> <span class="wordImportant">' + lang('提示') +  '</span>'+
        '</div>'+err+
        '<div class="national_content">' + lang('暂不支持来自中国香港、伊朗、朝鲜、叙利亚、苏丹、孟加拉国、玻利维亚、厄瓜多尔、古巴、吉尔吉斯斯坦和美利坚合众国[含波多黎各自治邦，美属萨摩亚（不是萨摩亚），关岛，北马里亚纳群岛邦和美属维尔京群岛（圣克罗伊岛，圣约翰岛和圣托马斯岛)]的客户，为您带来的不便请谅解！') +'</div>'+
        '<div class="national_btn">'+
        '<input type="button" value=" '+ lang('我知道了') +' " onclick="hideDialog(\'dialog_national\');">'+
        '</div>'+
        '</div>';
    $('body').prepend(html);
    showDialog('dialog_national',1);
}
function contactus(){
	$.post('/ajax/user/contactusadd',$('#form-contact').serialize(),function(d){
		if(d.msg == 'LT'){
			alert(lang('请登录后再操作'));
        } else {
			alert(d.msg);
			contact(1);
		}
	},'json');
	return false;
}
function rd() {
    return Math.random()
}
function contact(p) {
	var requestUrl = '/ajax/user/contactus/';
	TMPL.list(p, {url: requestUrl, name: 'contact'});
}


function login(i) {
	$.post('/user/login', $('#login-form').serialize(), function (d) {
		if (!d.status) {
			if (d.data == 'unverified') return dialog_login_yz();
			if (d.data == 'ga') gashow('-i', 1);
			if (d.data == 'captcha'){
                $('#captcha-error').show().html(d.msg);
                show_error_captcha();
			}
            if (d.data == 'forgetpw'){
                more_login();
                return false;
            }
            if (d.data == 'ga'){
                $('#ga-error').show().html(d.msg);
            }else if(d.data == 'captcha'){
                $('#captcha-error').show().html(d.msg);
            }else {
                $('#email-error').show().html(d.msg);
            }
		} else {
			if(i){
			location.reload()
			}else{
				location.href = '/';
			}
		}
	}, 'json');
}
function user(){
	if(USER = $.cookie('USER')){
		USER = USER.split(',');
		$('#login-form').hide();
		$('#login-bar').show();
        $('.index_banner .well').css('top','46px');
		$('.user-id').html(USER[0]);
		$('#user_name').html(USER[2] == '' ? '-' : USER[2]);
		$('.user-email').html(USER[1]);
		if (typeof FINANCE != 'object') return balance();
		$('.user-finance').html(FINANCE.data['btc_total'] + ' BTC');
        $('.user-finance_zh').html('≈' + formatfloatimprovement(FINANCE.data['btc_total']*PRICE_BTC.PRICE_BTC, 2) + ' ' + priceStyle.toUpperCase());
		$('.user-usc').html(FINANCE.data['usc_total'] + ' USC');
	}
}
function recode(){
    $('#captcha').val('').focus();
    $('#captchaimg').attr('src', '/index/captcha?t='+Math.random());
}
//验证码弹窗
function code_popup() {
    $('#popup_code').remove();
    $('body').prepend('<div class="ui-dialog" id="popup_code"></div>');
    $('#popup_code').html($('#for_popup_code').html());
    showDialog('popup_code');
}
//多次登录弹窗
function more_login() {
    $('#more_login').remove();
    $('body').prepend('<div class="ui-dialog" id="more_login"></div>');
    $('#more_login').html($('#for_more_login').html());
    showDialog('more_login');
}
//判断密码强度
function CheckIntensity(pwd){
    var Mcolor,Wcolor,Scolor,Color_Html,Word_Html;
    var m=0;
    var Modes=0;
    for(i=0; i<pwd.length; i++){
        var charType=0;
        var t=pwd.charCodeAt(i);
        if(t>=48 && t <=57){charType=1;}
        else if(t>=65 && t <=90){charType=2;}
        else if(t>=97 && t <=122){charType=4;}
        else{charType=4;}
        Modes |= charType;
    }
    for(i=0;i<7;i++){
        if(Modes & 1){m++;}
        Modes>>>=1;
    }
    if(pwd.length<=7){m=1;}
    if(pwd.length<=0){m=0;}
    switch(m){
        case 1 :
            Wcolor="pwd pwd_Weak_c";
            Mcolor="pwd pwd_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('弱');
            Color_Html="pwd pwd_Weak_Word_c";
            break;
        case 2 :
            Wcolor="pwd pwd_Medium_c";
            Mcolor="pwd pwd_Medium_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('中');
            Color_Html="pwd pwd_Medium_Word_c";
            break;
        case 3 :
            Wcolor="pwd pwd_Strong_c";
            Mcolor="pwd pwd_Strong_c";
            Scolor="pwd pwd_Strong_c";
            Word_Html=lang('强');
            Color_Html="pwd pwd_Strong_Word_c";
            break;
        default :
            Wcolor="pwd pwd_c";
            Mcolor="pwd pwd_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('无');
            Color_Html="pwd pwd_Word_c";
            break;
    }
    document.getElementById('pwd_Weak').className=Wcolor;
    document.getElementById('pwd_Medium').className=Mcolor;
    document.getElementById('pwd_Strong').className=Scolor;
    document.getElementById('pwd_html').className=Color_Html;
    document.getElementById('pwd_html').innerHTML=Word_Html;
}
//发短信按钮
function getcodes(i){
    var msg =  i == 1?lang('短信验证码'):lang('语音验证码');
    if(i) codetype = i;
    show_captcha();
}
codetype = 1;
//确认按钮
var wait=60;
function time() {
    var o=document.getElementById("btn-mobile-sms1_1")
    if (wait == -1) {
        $('.btn-mobile-sms1').show();
        $('#btn-mobile-sms1_1').hide();
        wait = 60;
    } else {
        o.innerHTML="(" + wait + ")"+lang('秒后重新获取');
        wait--;
        mobiletimer = setTimeout(function(){time()}, 1000)
    }
}
var wait2=60;
function time2() {
    var o=document.getElementById("btn-mobile-tel1_1")
    if (wait2 == -1) {
        $('.btn-mobile-tel1').show();
        $('#btn-mobile-tel1_1').hide();
        wait2 = 60;
    } else {
        o.innerHTML="(" + wait2 + ")"+(((typeof os != 'undefined') && (typeof os.isPc != 'undefined') && os.isPc) ? lang('秒后重新获取'):"s");
        wait2--;
        mobiletimer2 = setTimeout(function() {time2()}, 1000)
    }
}
var wait3 = 60;
function time3() {
    var o=document.getElementById("get_email_code1_1");
    if (wait3 == -1) {
        $('.get_email_code1').show();
        $('#get_email_code1_1').hide();
        wait3 = 60;
    } else {
        o.innerHTML="(" + wait3 + ")"+lang('秒后重新获取');
        wait3--;
        mobiletimer3 = setTimeout(function() {time3()}, 1000)
    }
}
function show_tab(i){
    $('.xt_tab_'+i+' .list_'+i+'').click(function(){
        var _index = $(this).index();
        $(this).addClass('hover').siblings().removeClass('hover');
        $('.xt_tab_list_'+i+'').each(function(){
            $(this).find('.list_'+i+'').hide();
            $(this).find('.list_'+i+'').eq(_index).show();
            if($(this).find('.list_'+i+'').hasClass('auto')){
                $(this).find('.list_'+i+'').css('height','auto');
            }
        })
    });
}
var search =  function(data, queryString) {
    var keys = [];
//            去掉空格
    var q = queryString.trim().toLowerCase();
//        Object.keys()用于获得由对象属性名组成的数组，可与数组遍历相结合使用
    Object.keys(data).forEach(function(key){
        if(key.indexOf(q) != -1) {
            keys.push(key);
        } else {
            var name  = data[key]['zh_CN'].toLowerCase();
            if(name.indexOf(q) != -1) {
                keys.push(key);
            }
        }
    });
    return keys;
};