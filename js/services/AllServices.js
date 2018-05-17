define(["app","require"],function(app,require){
	"use strict";
	
	require(["MinServices"],function(MinServices){
		app.registerfactory("Hall",factoryHall);
		app.registerfactory("Battle",factoryBattle);
		app.registerfactory("RTAll",factoryRTAll);
		app.registerfactory("LineUp",factoryLineUp);
		app.registerfactory("Rank",factoryRank);
		app.registerfactory("Main",factoryMain);
		app.registerfactory("Prizes",factoryPrizes);
		app.registerfactory("Thr",factoryThr);
		app.registerfactory("ShopUrl",factoryShopUrl);
		app.registerfactory("Wode",factoryWode);
		app.registerfactory("Corps",factoryCorps);
	});
//	return factory;
})