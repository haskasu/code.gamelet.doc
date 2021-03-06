.. _tutorials.cgevents.edit-monsters:

讓怪獸動起來
=====================

這一節，我們將會新增三個新的事件:

#. 怪物飛行: 讓怪獸動起來。
#. 怪物撞戰機: 檢查怪獸碰到戰機時，讓戰機爆炸，並結束遊戲。
#. 重新一次: 讓玩家在遊戲結束後可以選擇再玩一次。

怪物飛行
^^^^^^^^^^^^^^^

新增一個事件ID為 怪物飛行 的事件，並設定為 **無限重覆** 。我們將在這個事件中加入一個檢查以及一個動作，用來控制怪獸們的飛行。


(+檢查) For Each
------------------

接著我們要加入一個檢查，但這是個特殊的檢查， **迴圈** 。

.. topic:: :icon:`info` 什麼是 **迴圈** 檢查

    迴圈(Loop)在電腦的世界中是非常重要的存在，它可以讓同樣一組動作，重覆執行很多次。

    CG同人陣中的迴圈，可以讓一個事件中的所有動作重覆執行很多次。請注意，這裏所說的重覆和事件的重覆次數是不同的，事件的重覆是指每一小段時間會重覆執行一次，
    而迴圈中的重覆則是瞬間將事件中的動作重覆執行很多次。

在 怪物飛行 事件中按下 **檢查** :btnicon:`add` 開啟新增檢查的視窗，並從目錄中選擇 **迴圈** :icon:`chevron_right` **For Each** 。
我們要在這個For Each中找到所有名字(ID)以 monster 作為開頭的物件，並對這些物件都執行一個 **更新顯示物件** 的動作，讓所有的怪獸都持續朝玩家的戰機方向前進。

.. topic:: :icon:`info` For Each

    For Each是迴圈的一種，它可以在遊戲中找出名稱類似的所有物件，並對個別物件都執行事件中的所有動作。

在 For Each 的編輯視窗中，輸入下列資料:

- 區域變數名稱: **instance**

.. topic:: :icon:`info` 區域變數名稱

    因為在迴圈中可能找到許多怪獸，在之後 **更新顯示物件** 的動作中，我們卻沒有辦法預先知道怪獸的名字，因此就有了 **區域變數名稱** 來幫我們解決這個問題。
   
    在這個迴圈中，我們將找到 monster0, monster1, monster2, monster3四個怪獸，並輪流對他們動作。
    
    在輪到 monster0 的時候，我們會幫這隻怪獸取一個暫時的小名叫 instance，在 **更新顯示物件** 的動作中，我們只要把物件的ID設定為 instance 就可以控制 monster0 的位置、角度等屬性。

    輪到 monster1 的時候，一樣幫他取小名 instance ，在 **更新顯示物件** 的動作中，一樣針對 instance 做動作就可以。以此類推。

- 用來搜尋物件的ID: **monster***

.. topic:: :icon:`info` 星號搜尋

   使用 * (星號)來搜尋名字相似的所有物件，是個很方便的技巧，以 monster* 搜尋物件時，只要開頭是以 monster 為首的物件都會被選進來，當然就包括了這個教學中的 monster0, monster1, monster2, monster3 。

.. image:: img/check_foreach_monsters.png
        :class: fullwidth

(+動作) 更新顯示物件
--------------------

在 怪物飛行 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **更新** :icon:`chevron_right` **顯示** :icon:`chevron_right` **更新顯示物件** ，
如同上一節讓戰機飛行的方式一樣，輸入下列資料讓怪獸飛行。

- 物件的ID: **instance**
- 勾選 **設定位置** ，設定方式選擇 **朝一個方向移動** ，距離填入 **1**
- 勾選 **設定旋轉角度** ，設定方式選擇 **轉向一個顯示物件** ，目標物件 **fighter0** ，旋轉率 **0.01**
- 點擊視窗左上角的綠色勾勾完成

.. topic:: :icon:`camera_alt` 參考截圖
    :class: collapse

    .. image:: img/update_monster.png
        :class: fullwidth

完成這個事件後，可以試玩一下，看看怪獸們是不是都朝著玩家的戰機飛來。不過此時即使怪獸撞上戰機也不會有任何事情發生，因此在下一個事件中，我們就要讓怪獸有能力把戰機撞爆。

怪物撞戰機
^^^^^^^^^^^^^^^

新增一個事件ID為 怪物撞戰機 的事件，這個事件不需要重覆(重覆次數0)，因為這個事件發生後，遊戲就需要結束。

我們將在這個事件中加入一個 **迴圈** 檢查、一個 **物件重疊** 檢查，用來測試是否有其中一隻怪獸和戰機的位置重疊。
接著還會加入五個動作，在確認其中一隻怪獸和戰機位置重疊(碰撞)後，我們要從舞台上移除戰機並加入爆炸的特效。

(+檢查) For Each
------------------
在 怪物撞戰機 事件中按下 **檢查** :btnicon:`add` 開啟新增檢查的視窗，並從目錄中選擇 **迴圈** :icon:`chevron_right` **For Each** 。

- 區域變數名稱: **instance**
- 用來搜尋物件的ID: **monster***
- 最多動作觸發次數: **1**

(+檢查) 物件重疊
------------------
在 怪物撞戰機 事件中按下 **檢查** :btnicon:`add` 開啟新增檢查的視窗，並從目錄中選擇 **顯示** :icon:`chevron_right` **物件重疊** 。

- 顯示物件的ID: **instance**
- 顯示物件的ID: **fighter0**
- 檢查方式: **距離**
- 距離: **60**

以上設定可以在迴圈中檢查被暫時取名為 instance 的怪獸和 fighter0 (戰機)的距離是不是小於 60 (像素)，如果距離小於60就通過檢查，也就是發生怪獸撞戰機的情況了。

.. topic:: :icon:`camera_alt` 參考截圖
    :class: collapse

    .. image:: img/check_monster_fighter_distance.png
        :class: fullwidth

(+動作) 建立圖層佈局
---------------------
在 怪物撞戰機 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **新增** :icon:`chevron_right` **顯示** :icon:`chevron_right` **建立圖層佈局** ，
用來加入爆炸的特效。

- 父節點的物件ID: **gameroot**
- 圖片佈局

  #. 將 explosion 這個資源拉進舞台
  #. 將explosion的轉軸設到中心位置 x: -35 , y: -27
  #. 勾選動畫的 **播放** 與 **自動移除**

.. topic:: :icon:`camera_alt` 讓爆炸動畫自動播放，並在播放完畢後自動從舞台上移除。

(+動作) 更新顯示物件
---------------------
剛剛加入的爆炸特效要移動到戰機的位置。
在 怪物撞戰機 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **更新** :icon:`chevron_right` **顯示** :icon:`chevron_right` **更新顯示物件** 。

- 物件的ID: **explosion0**
- 勾選 **設定位置** ，設定方式選擇 **設定在一個顯示物件上** ，目標物件 **fighter0**

(+動作) 移除物件
---------------------
將戰機從舞台上移除。
在 怪物撞戰機 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **移除** :icon:`chevron_right` **移除物件** 。

- 物件ID: **fighter0**

(+動作) 等待
---------------------
在接下來的動作之前，先等待一秒。
在 怪物撞戰機 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **系統** :icon:`chevron_right` **等待** 。

- 時間: **1000** 毫秒

.. topic:: :icon:`info` 一秒 = 1000毫秒

(+動作) 彈出確認視窗
---------------------
彈出顯示遊戲結束的視窗。
在 怪物撞戰機 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **彈出視窗** :icon:`chevron_right` **彈出確認視窗** 。

- 彈出視窗的ID: **gameover**
- 標題: **Game Over**
- 勾選 **隱藏取消按鈕**
- 確認按鈕文字: **再一次**

如此，這個事件就完成了，怪獸們會追著玩家，若被怪獸撞擊，戰機就會爆炸消失，並彈出一個有「再一次」按鈕的視窗。至於玩家按下「再一次」按鈕後會發生什麼，就是下一個事件要管的事了。

重新一次
^^^^^^^^^^^^^^^
新增一個事件ID為 重新一次 的事件，這個事件不需要重覆(重覆次數0)。

這個事件中會包含兩個 **觸發** ，用來監聽遊戲結束視窗中的「再一次」按鈕被玩家按下去的時機。觸發後不需要檢查，會執行一個動作，讓系統重新執行一次 game.events 這個事件表。

(+觸發) 視窗關閉
---------------------
監聽遊戲結束時彈出的視窗被玩家關閉的時機。
在 重新一次 事件中按下 **觸發** :btnicon:`add` 開啟新增觸發的視窗，並從目錄中選擇 **彈出視窗** :icon:`chevron_right` **視窗關閉** 。

- 彈出視窗的ID: **gameover**
- 關閉方式: **都可以**

(+觸發) 視窗關閉
---------------------
前一個觸發是檢查玩家被怪獸撞爆時彈出的結束視窗。雖然還沒寫到後面的事件，但我們也需要監聽任務完成彈出的視窗被關閉的時機。
在 重新一次 事件中按下 **觸發** :btnicon:`add` 開啟新增觸發的視窗，並從目錄中選擇 **彈出視窗** :icon:`chevron_right` **視窗關閉** 。

- 彈出視窗的ID: **gameclear**
- 關閉方式: **都可以**

.. topic:: :icon:`info` 一個事件有兩個觸發

    一個事件如果含有兩個或更多的觸發時，任何一個觸發發動都會讓事件醒來進行檢查與動作。

(+動作) 執行事件表
---------------------
在 重新一次 事件中按下 **動作** :btnicon:`add` 開啟新增動作的視窗，並從目錄中選擇 **系統** :icon:`chevron_right` **視執行事件表** 。

- 檔案(.event): **CG.SpaceShooter_zh/game.events**

.. topic:: :icon:`priority_high` 注意

    檔案所在目錄會依專案代碼所有不同，範例中因為專案代碼是 SpaceShooter_zh ，所以 game.events 是放在 CG.SpaceShooter_zh 這個目錄裏。

下一步
^^^^^^^^^^^^^^^
到此為止，我們已經完成遊戲的一半了，接下來就要讓玩家的戰機裝上飛彈，和怪獸一決雌雄了。

.. topic:: :icon:`camera_alt` 到此為止的事件表參考截圖
    :class: collapse

    .. image:: img/events_half_done.png
        :class: fullwidth

:ref:`tutorials.cgevents.edit-bullets`