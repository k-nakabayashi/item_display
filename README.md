# displayItems.js


## JSの呼び出し方
```
<script src="js/displayItems.js"></script>
<script async>
	var config = {
		csv: {
			base: { 
				url: "/csv/rank_base_copy.csv",　//必要
				target_index: "商品URL",　//必要
			},
		},
		prefix: {
			src: "/aaaa", //なくても大丈夫です。
			href: "/bbb",　//なくても大丈夫です。
		},
        afterClass: 'aa',　//なくても大丈夫です。
	}
	displayItems("displayItem", config);
</script>

```
- displayItems.jsを読み込んだ後に、asyncでdisplayItemsを起動してください。  
- target_indexは、csvの行を特定させるための列名です。
- afterClassは、csv読み込み処理と表示処理が完了したら付与されるクラスです。

## 画面表示の指定の仕方

```
<div class="card img-thumbnail displayItem" id="a120375500045891">
    <img class="card-img-top" data-src="0" data-alt="1">
    <div class="card-body px-2 py-3">
        <a class="card-title" data-href="0" data-text='0'></a>
        <div>
        <p class="card-text">大カテゴリ：<span data-text="1"></span></p>
        <p class="card-text">中カテゴリ：<span data-text="2"></span></p>
        <p class="card-text">オプション：<span data-text="4"></span></p>
        <p class="card-text test" data-text="3" ></p>
        <p class="card-text test" data-text="5" ></p>
        </div>
        <p class="mb-0"><a href="#" class="btn btn-primary btn-sm">ボタン</a> <a href="#" class="btn btn-secondary btn-sm">ボタン</a></p>
    </div>
</div>
```

- 'displayItem'をクラスに付与
- 'プライマリーキーID'をidに付与：target_indexが指すcsvの列の値
- 'data-text', 'data-src', 'data-alt', 'data-href' これらには、csvの列番号を記載

## 仕様

- 指定しているデータの頭に'https:'という文字が付かなかれば、'prefix'は付きます。
- 指定しているデータの頭に'https:'という文字が付くと、'prefix'は付きないです。