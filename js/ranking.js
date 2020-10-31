//
var locationHref = window.location.href;
//
if(!rank_itemURL){
	var rank_itemURL = 'https://www.rakuten.ne.jp/gold/intelogue/ranking/csv/rank_item.csv';
}
//
if(!rank_baseURL){
	var rank_baseURL = 'https://www.rakuten.ne.jp/gold/intelogue/ranking/csv/rank_base.csv';
} 
//
// if(!baseHTML){
	// var baseHTML = '<a class="item_link" href="#"><img class="item_img"><div class="item_cate item_genre"></div><div class="item_name"></div><div class="item_number"></div><div class="item_detail"></div><div class="maker_price"></div><div class="item_price"></div><div class="item_option"></div></a>'; 
// }


(function(rank_baseURL,rank_itemURL){

	//ランキングのデータを取得して配列に格納する関数
	(function openFile(rank_itemURL,rank_baseURL){

		//データを格納する配列を定義
		var csvArrays = [];

			var nowTime = new Date().getTime();
			var url1 	= rank_itemURL+'?'+nowTime;
			var xhr1 	= new XMLHttpRequest();

			//処理の状況変化を監視
			xhr1.onreadystatechange = function(){
			    if(this.readyState == 4 && this.status == 200){

			    	//アイテムデータを取得
					var t1 = this.responseText;
					var itemData = t1;

					//配列に格納[0]⇒item_csv
					csvArrays[0] = itemData;

					var nowTime = new Date().getTime();
					var url2 	= rank_baseURL+'?'+nowTime;
					var xhr2 	= new XMLHttpRequest();

					//処理の状況変化を監視
					xhr2.onreadystatechange = function(){
					    if(this.readyState == 4 && this.status == 200){

							//カテゴリデータを取得
							var t2 = this.responseText;
							var baseData = t2

							//配列に格納[1]⇒item_csv
							csvArrays[1] = baseData;


							itemFunction(csvArrays);
						}
					}	

					//リクエストを実行
					requestXhr(xhr2, url2);

			    }
			}

			//リクエストを実行
			requestXhr(xhr1, url1);

	})(rank_itemURL, rank_baseURL);


	//リクエストを送る関数
	function requestXhr(xhr, url){
		xhr.open('get',url ,true); 	
		//ファイルタイプと文字コードを設定
		xhr.overrideMimeType('text/csv;charset=Shift_JIS');
		//リクエストを送信 postリクエストでないので引数は不要
		xhr.send(null);
	}
	
	//csvファイルを2次元配列に変換する関数
	function csvToArray(csv){  
		
		var csvArray = new Array();
		
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
	}
	

	function itemFunction(dataArray){

		var items = dataArray[0];
		var bases = dataArray[1];

		//csvファイルを配列に変換
		var item_csv = csvToArray(items); 
		var base_csv = csvToArray(bases); 

		//item_csv内での商品管理番号のコラム位置（インデックス番号）を取得（この場合は[1]）
		var str = /商品管理番号（商品URL）/; 
		var item_col = indexofArray(str); 
		
		//base_csv内での商品URL=商品管理番号のコラム位置（インデックス番号）を取得（この場合は[0]）
		var str = /商品URL/; 
		var base_item_col = indexofArrayBase(str);


		//アイテム別のアイテムデータをを格納する連想配列を作成
		var item = new Array();
		for(var line=0, item_csvLength=item_csv.length; line<item_csvLength; line=(line+1)|0){

			//商品管理番号をキーに連想配列 item を作成
			//商品管理番号 = item_csv[x][1]
			var key1 = item_csv[line][item_col]; 

			item["" + key1 + ""] = item_csv[line];
		
		}

		//アイテム別のカテゴリデータを格納する連想配列を作成
		var item_base = new Array();
		for(var line=0, base_csvLength=base_csv.length; line<base_csvLength; line=(line+1)|0){

			//商品管理番号をキーに連想配列 item_base を作成
			//商品管理番号 = base_csv[x][0]
			var key2 = base_csv[line][base_item_col];
			
			item_base["" + key2 + ""] = base_csv[line];
		}


		//アイテムデータ内の各項目の列番号を定義する
		var str = /商品名/; 		var csv_item_name = indexofArray(str);
		var str = /販売価格/; 	var csv_price = indexofArray(str);
		var str = /表示価格/; 	var csv_maker_price = indexofArray(str);
		var str = /送料/; 		var csv_delivery_price = indexofArray(str);
		var str = /商品画像URL/;	var csv_item_img = indexofArray(str);

		//カテゴリデータ内の各項目の列番号を定義する
		var str = /大カテゴリ/; 	var base_item_Lcate = indexofArrayBase(str);
		var str = /商品名/; 		var base_item_name = indexofArrayBase(str);
		var str = /オプション/;		var base_item_option = indexofArrayBase(str);
		var str = /価格幅表記/;  var base_item_kakakuhaba = indexofArrayBase(str);
		var str = /サイズ/; 		var base_item_size = indexofArrayBase(str);
		var str = /タイプ/; 		var base_item_type = indexofArrayBase(str);


		//HTMLの<section>タグを全て取得
		var sections = document.getElementsByTagName("section");

		//全てのsectionに対して繰り返し
		for (var i=0, sectionslength=sections.length; i<sectionslength; i=(i+1)|0) {
			
			applyData(sections[i]); 
		
		}

		function applyData(sec) {

			var baseHTML = sec.getAttribute('base');
			// If (!baseHTML){baseHTML = '<span class="crowns"></span><span class="rank_number">位</span><a class="item_link" href="#"><img class="item_img"><div class="item_cate"></div><div class="item_name"></div><div class="item_detail"></div><div class="item_price"></div></a>'};

			//HTMLの<li>タグで表示する商品の管理番号を配列形式で取得
			var initialTags = sec.getElementsByTagName("li");

			//<li>タグの数だけ繰り返す
			for(var i=0, initialTagslength=initialTags.length; i<initialTagslength; i=(i+1)|0){

				//タグ内のHTMLテキストを取得
				var initialHTML = initialTags[i].innerHTML;
				
				//class="item_price"が空なら
				if(!/class="item_price"/.test(initialHTML)){

					//<li>タグ内の商品管理番号を取得
					var itemNumber = initialTags[i].getAttribute('data-item');
					
					//管理番号が定義されているなら
					if(itemNumber){

						//タグ内をランキング用HTMLに書き換え
						initialTags[i].innerHTML = baseHTML; 
					}
				}
			}

			echoItem(initialTags);
		}


		//各<li>タグ内のbaseHTMLを書き換える関数
		function echoItem(targetTags){

			//i番目の<li>タグに対して実行する繰り返し
			for(var i=0, targetTagslength=targetTags.length; i<targetTagslength; i=(i+1)|0){

				//タグ内のHTMLを取得
				var targetHTML = targetTags[i].innerHTML;

				//管理番号を取得
				var itemNumber = targetTags[i].getAttribute('data-item');

				/*該当する管理番号がデータにあるかチェックして書き替えを実行*/
				/*掲載する要素がHTML側で再定義されている場合はそれに従う*/
				if(itemNumber in item == true) {

					//商品管理番号
					if(itemNumber){
						if(/class="item_number"/.test(targetHTML)){ 
							var item_number = targetTags[i].getElementsByClassName("item_number")[0];
								item_number.innerText = itemNumber;
						}
					}

					//表示価格
					if(/class="maker_price"/.test(targetHTML)){
						var maker_price = targetTags[i].getElementsByClassName("maker_price")[0];
						var makerprice 	= item["" + itemNumber + ""][csv_maker_price];
					
						maker_price.innerText = priceNumber(makerprice)+"円(税込)";
					
					}

					//リンクhref
					if(/class="item_link"/.test(targetHTML)){
						var item_link = targetTags[i].getElementsByClassName("item_link")[0];
							item_link.href = "https://item.rakuten.co.jp/intelogue/" + itemNumber + "/";
					}

					//サムネ画像src
					if(/class="item_img"/.test(targetHTML)){
						//データからサムネのURLだけを取り出す
						var thumbnail = thumbnailUrl(item["" + itemNumber + ""][csv_item_img]);
						
						var item_img  = targetTags[i].getElementsByClassName("item_img")[0];
							item_img.src = thumbnail;
					}

					//販売価格（税込み、割引後の価格）
					if(/class="item_price"/.test(targetHTML)){

						//送料無料表示のリセット
						var item_detail = targetTags[i].getElementsByClassName("item_detail")[0];
						if(item_detail){ item_detail.innerHTML = ""; }
						
						//販売価格
						var itemprice = item["" + itemNumber + ""][csv_price];
						var item_price = targetTags[i].getElementsByClassName("item_price")[0];

						//カテゴリデータで価格幅表記が設定されているなら反映
						if(itemNumber in item_base == true) {
							var itemKakakuhaba = item_base["" + itemNumber + ""][base_item_kakakuhaba];
						} else {
							var itemKakakuhaba = ""; 
						}	

						if(item_price != null) {

							//表示価格が設定されていて、かつ販売価格と異なるなら
							if(makerprice && itemprice !== makerprice) {
								
								//表示価格を書き替え
								if(maker_price != null) {
									
									maker_price.innerHTML = '<span class="black">' + priceNumber(makerprice) + '円</span>';
									
								}
								
								//販売価格を書き替え
								if(item_price != null) {

									item_price.innerHTML = '<span class="black"> → </span><span class="red">' + priceNumber(itemprice) + '円' + itemKakakuhaba + '</span>';

								}

								//送料無料の横に割引額を記載
								if(/class="item_detail"/.test(targetHTML)){

									item_detail.innerHTML += '<span class="off">' + (makerprice - itemprice) + '円OFF</span>';
								
								}

							//そうでないなら
							} else {

								//表示価格を非表示
								// maker_price.innerHTML = '';

								//販売価格を書き替え
								item_price.innerText = priceNumber(itemprice)+"円(税込)" + itemKakakuhaba;

							}
						}
					}

					//アイテムカテゴリ、ジャンル
					if((/class="item_cate item_genre"/.test(targetHTML)) || (/class="item_cate"/.test(targetHTML)) || (/class="item_genre"/.test(targetHTML))){
						var item_cate = targetTags[i].getElementsByClassName("item_cate")[0];
						if(!item_cate){ var item_cate = targetTags[i].getElementsByClassName("item_genre")[0]; }

						if(itemNumber in item_base == true) {

							//大カテゴリ
							var itemCate = item_base["" + itemNumber + ""][base_item_Lcate];
								item_cate.innerText = itemCate;

						} else {

								item_cate.innerText = '-';
						}
					}

					//商品名
					if(/class="item_name"/.test(targetHTML)){
						var item_name = targetTags[i].getElementsByClassName("item_name")[0];
						var itemName = item["" + itemNumber + ""][csv_item_name];

						//商品名を整形
						itemName = getName(itemName);
						
						// if(itemNumber in item_base == true) {
						// 	var itemName = item_base["" + itemNumber + ""][base_item_name];
						// }

						item_name.innerText = itemName;
					}

					//送料
					if(/class="item_detail"/.test(targetHTML)){
						var item_detail = targetTags[i].getElementsByClassName("item_detail")[0];
						var itemDetail = item["" + itemNumber + ""][csv_delivery_price];
						if(/1/.test(itemDetail)){
							item_detail.innerHTML += '<span class="delivery_free">送料無料</span>';
						} else {
							item_detail.innerHTML += '<span class="delivery_add">別途送料</span>'
						}
					}

					// if(/class="item_subtitle"/.test(targetHTML)){ //副題
					// 		var item_subtitle = targetTags[i].getElementsByClassName("item_subtitle")[0];
					// 		if(itemNumber in item_base == true) {
					// 				var itemSubtitle = item_base["" + itemNumber + ""][base_item_subtitle];
					// 				if(itemSubtitle){
					// 					item_subtitle.innerHTML = itemSubtitle;
					// 				}
					// 		}
					// }

					// if(/class="item_text"/.test(targetHTML)){ //説明文
					// 		var item_text = targetTags[i].getElementsByClassName("item_text")[0];
					// 		if(itemNumber in item_base == true) {
					// 				var itemText = item_base["" + itemNumber + ""][base_item_text];
					// 				if(itemText){
					// 					itemText = itemText.substr(0,64) + "";
					// 					item_text.innerHTML = itemText;
					// 				}
					// 		}
					// }

					//オプション
					if(/class="item_option"/.test(targetHTML)){
							var item_option = targetTags[i].getElementsByClassName("item_option")[0];
							
							if(itemNumber in item_base == true) {
								var itemOption = item_base["" + itemNumber + ""][base_item_option];
								var itemoptionSplit = itemOption.split(' ');
								var itemoptionLength = itemoptionSplit.length;
								var item_optionHtml = "";

								if (itemoptionSplit[0].length > 1) {
									for(var o=0; o<itemoptionLength; o=(o+1)|0){
											var option = itemoptionSplit[o];
											item_optionHtml = item_optionHtml + '<span>' + option + '</span>';
									}
								}

								if (!item_optionHtml == "") {
									item_option.innerHTML = item_optionHtml;
								}
							}
					}

				//管理番号がCSVになければ	
				}else {

					if(/class="item_price"/.test(targetHTML)){
						targetTags[i].innerHTML = '<a class="item_link" href="#"><img class="item_img"><div class="item_cate"></div><div class="item_name"></div><div class="item_number">' + itemNumber + '</div><div class="item_detail"></div><div class="maker_price"></div><div class="item_price"></div><div class="item_option"></div></a>';
					}
					
				}

			}
		}


		//アイテムデータ内での要素の列番号を特定する関数
		function indexofArray(str){
			for(var item_value=0,item_value_length=item_csv[0].length; item_value<item_value_length; item_value=(item_value+1)|0){
				var csv_title = item_csv[0][item_value];
				if(str.test(csv_title)){ 
					return item_value;
				}
			}
		}

		//カテゴリデータ内での要素の列番号を特定する関数
		function indexofArrayBase(str){
			for(var item_value=0,item_value_length=base_csv[0].length; item_value<item_value_length; item_value=(item_value+1)|0){
				var csv_title = base_csv[0][item_value];
				if(str.test(csv_title)){ 
					return item_value;
				}
			}
		}

	}


	

	//商品名を整形する関数
	function getName(itemname){

		//元の商品名をスペースで区切る
		itemname = itemname.split(' ');

		var nameString = "";

		for(var i = itemname.length; i--; ) {

			var str = itemname[i] + " ";

			// 余計な言葉は除外
 			if(!/【/.test(str)){
 				if(!/送料/.test(str)){
 					if(!/北欧/.test(str)){
 						if(!/sofa/.test(str)){
 							if(!/カフェ風/.test(str)){
 								if(!/おしゃれ/.test(str)){
 									if(!/）/.test(str)){

	 									//一語ずつ追加
										nameString = nameString + str;
									}
								}
							}
						}
					}
				}
			}

			// nameString = nameString + str;
		}

		//規定文字数21文字で区切る
		return nameString.slice(0,21)+"..."; 
	}

	//価格を整形する関数
	function priceNumber(number) {

		return Number(number).toString().replace(/(\d)(?=(?:\d{3}){2,}(?:\.|$))|(\d)(\d{3}(?:\.\d*)?$)/g, '$1$2,$3');
	}

	//画像URL群からサムネイルのURL(先頭のURL)を取り出す関数
	function thumbnailUrl(urls){
		
		urls = urls.split(' ');
		var url = urls[0];
		
		return url;
	}


})(rank_baseURL,rank_itemURL);



(function(){
	if(/iPhone/.test(window.navigator.userAgent)){
		document.getElementsByTagName("html")[0].setAttribute("class","ios");
	}
	if(/Android/.test(window.navigator.userAgent)){
		document.getElementsByTagName("body")[0].setAttribute("class","android");
	}
})();

