
var displayItems = function(target_container, config){
    $('head').append(
        `<style>
            .displayItem {
                opacity: 0;
            }
            .isDisplayed {
                opacity: 1!important;
                transition-property: opacity;
                transition-duration: 2s;
            }
        </style>`
    );
    var base_csv = config.csv.base;
    // var join_csv = config.csv.join_csv;

    var init, boot, csv_func, formatData, dom_func;

    csv_func = {

        openFile: async function (url){
            return await this.ajaxFile(url);
        },

        ajaxFile: function(url){
            var that = this;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url +'?' + new Date().getTime(),
                    type:'GET',
                    beforeSend: function(xhr){
                        xhr.overrideMimeType("text/html;charset=Shift_JIS");
                    }
                }).then(
                    function(result){
                        result = that.csvToArray(result);
                        resolve(result);
                    }
                );
            });
        },

        //csvファイルを2次元配列に変換する関数
        csvToArray: function (csv){  
            
            var csvArray = [];
            
            //改行コードを定義
            var LF = String.fromCharCode(10);

            //改行コードで行をで分割
            var lines = csv.split(LF);
            for (var i=0,linesLength=lines.length; i<linesLength; i=(i+1)|0) {

                //カンマで要素を分割
                var cells = lines[i].replace(/\"/g,"").split(",");

                if( cells.length != 1 ) {
                    csvArray.push(cells);
                }
            }
            
            return csvArray;	
        },

        setTargets: function(csv) {

            var target_keys = $("." + target_container);
            target_keys = _.map(target_keys, function(target){
                return target.id;
            });

            var target = {};
            _.map(target_keys, function(target_key){
                target[target_key] = csv["body"][target_key];
            })
            csv["body"] = target;
        },

        joinCsv: function(targets){
            _.map(targets, function(target){
                if(target){

                }
            });
            return base_csv;
        },
    }

    formatData = function(csv){

        function setHeader (data){
            var datas = data.splice(1);
            var header = data[0];
            csv.header = header;
            csv.target_index_numnber = header.indexOf(base_csv.target_index);
            setBody(datas, csv.target_index_numnber);
        }

        function setBody (datas, needle) {
            var body_datas = [];
            _.forEach(datas, function(data){
                var id = data[needle];
                body_datas[id] = data;
            })
            csv.body = body_datas;
        }

        return {
            setFormated_Date: function(data) {
                setHeader.call(this, data);
            },
        }
    }

    dom_func = {

        setDom: function (value, key) {
            var target_dom = $("#" + key);
            var funcs = {
                text: innerText,
                src: setAttr("src"),
                href: setAttr("href"),
                alt: setAttr("alt")
            }

            _.forEach(funcs, function(func, attr){
                for (var i = 0; i < 5; ++i) {
                    var data_attr = "*[data-"+ attr +"='" + i + "']";
                    var children = target_dom.find(data_attr);
                    if (!children.length) {
                        continue;
                    }
                    _.forEach(children, function(child){
                        var child_dom = $(child);
                        var id = child_dom.data(attr);
                        func(child_dom[0], value[id]);
                    })
                }
            });
            
            target_dom.addClass('isDisplayed');
            if (config.hasOwnProperty('afterClass')) {
                target_dom.addClass(config.afterClass);
            }
            

            function innerText(dom, txt){
                dom.innerText = txt;
            }
            
            function setAttr(attr) {
                return function(dom, prop){
        
                    if (hasPrefix(attr) && !hasFullPath(prop)) {
                        $(dom).attr(attr, config.prefix[attr] + "/" + prop);
                    } else {
                        $(dom).attr(attr, prop);
        
                    }
                }
        
                function hasPrefix() {
                    return config.prefix.hasOwnProperty(attr);
                }
        
                function hasFullPath(prop) {
                    return prop.indexOf("https:") === 0;
                }
            }
        }
    }

    boot = function (formated_data) {
        var keys = Object.keys(formated_data.body);
        _.map(keys, function(key){
            dom_func.setDom(formated_data.body[key], key);
        });
    }

    init = async function() {
        
        var data1 = await csv_func.openFile(base_csv.url);
        // var data2 = await csv_func.openFile(join_csv.url);

        $(document).ready(function(){
            //csvの整形
            var formatData_for_base = formatData(base_csv);
            formatData_for_base.setFormated_Date(data1);

            //base_csvから対象を絞り込み
            csv_func.setTargets(base_csv);

            // var joined_csv = csv_func.joinCsv(targets);
            // var formated_data = formatData(joined_csv);
            boot(base_csv);
        })
    }
    init();

}



