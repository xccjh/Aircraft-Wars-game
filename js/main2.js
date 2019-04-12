//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
//玩家飞机
function MyPlane(x, y, width, height, life, attack, normal, boom) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
}
//子弹
function Bullet(x, y, width, height, attack, normal) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.attack = attack;
  this.normal = normal;
}
//敌机
function EnemyPlane(
  x,
  y,
  width,
  height,
  life,
  attack,
  speed,
  normal,
  boom,
  score
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.life = life;
  this.speed = speed;
  this.attack = attack;
  this.normal = normal;
  this.boom = boom;
  this.score = score;
  this.isDie = false;
  this.destroy = function(main) {
    var p = this;
    if (!this.dieTimer) {
      this.dieTimer = setTimeout(function() {
        console.log("销毁  --  " + p.elemnt.index);
        if (p.elemnt.parentElement) {
          main.removeChild(p.elemnt);
        }
        var index = enemyArray.indexOf(p);
        enemyArray.splice(index, 1);
      }, 1000);
    }
  };
}

function $id(id) {
  return document.getElementById(id);
}
//获取某个元素的计算过后的css
function getStyle(element) {
  return window.getComputedStyle(element, null);
}
//用来判断一个点是否在一个区域之内
function isPosInrange(pos, range) {
  if (
    pos.x >= range.x &&
    pos.y >= range.y &&
    pos.x <= range.x + range.width &&
    pos.y <= range.y + range.height
  ) {
    return true;
  }
  return false;
}
//判断一个区域是否跟另一个区域有交集
function isRangeInRange(r1, r2) {
  var p1 = { x: r1.x, y: r1.y };
  var p2 = { x: r1.x, y: r1.y + r1.height };
  var p3 = { x: r1.x + r1.width, y: r1.y };
  var p4 = { x: r1.x + r1.width, y: r1.y + r1.height };
  if (
    isPosInrange(p1, r2) ||
    isPosInrange(p2, r2) ||
    isPosInrange(p3, r2) ||
    isPosInrange(p4, r2)
  ) {
    return true;
  }
  var pp1 = { x: r2.x, y: r2.y };
  var pp2 = { x: r2.x, y: r2.y + r2.height };
  var pp3 = { x: r2.x + r2.width, y: r2.y };
  var pp4 = { x: r2.x + r2.width, y: r2.y + r2.height };
  if (
    isPosInrange(pp1, r1) ||
    isPosInrange(pp2, r1) ||
    isPosInrange(pp3, r1) ||
    isPosInrange(pp4, r1)
  ) {
    return true;
  }
  return false;
}
var enemyIndex = 0;

var bulletArray = [];
var enemyArray = [];
var score = 0;
window.onload = function() {
  var main = $id("main");
  //点击开始按钮，把按钮隐藏，让背景替换，并且动起来
  $id("start").onclick = function() {
    this.style.display = "none";
    $id("score").style.display = "block";
    $id("main").style.background = "url(images/bg-gamming.png) repeat-y";
    moveGammingBg();
    //创建玩家飞机
    var plane = new MyPlane(
      127,
      450,
      66,
      80,
      10,
      5,
      "images/img-player.gif",
      "images/img-player-boom.gif"
    );
    //var playerPlane = document.createElement("img");
    //plane.elemnt = playerPlane;
    //playerPlane.src = plane.normal;
    //playerPlane.style.position = "absolute";
    //playerPlane.style.left = plane.x + "px";
    //playerPlane.style.top = plane.y + "px";
    var playerPlane = createGameObject(plane);
    main.appendChild(playerPlane);
    //让玩家飞机跟着鼠标动起来
    main.onmousemove = function(event) {
      //获取鼠标的位置
      var px = event.pageX;
      var py = event.pageY;
      //飞机的位置是相对main的
      //要计算出飞机相对于main的坐标
      //mian相对body的左边的位置
      var tempx = parseFloat(getStyle(main).marginLeft);
      //计算飞机的x和y
      var x = px - tempx - 33;
      var y = py - 40;
      //根据要求，飞机必须在main里面
      if (x < 0) {
        x = 0;
      }
      if (x > 320 - 66) {
        x = 320 - 66;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > 568 - 80) {
        y = 568 - 80;
      }

      plane.x = x;
      plane.y = y;
      playerPlane.style.top = y + "px";
      playerPlane.style.left = x + "px";
    };

    //让飞机发射子弹
    planeShoot(plane);
    //让子弹飞
    bulletMove();
    //生成敌机
    mekeEnemy();
    //移动敌机
    enemyMove(plane);
  };
  function moveGammingBg() {
    var main = $id("main");
    setInterval(function() {
      var y = parseFloat(getStyle(main).backgroundPositionY);
      y += 0.5;
      main.style.backgroundPositionY = y + "px";
    }, 20);
  }

  function planeShoot(plane) {
    var main = $id("main");
    setInterval(function() {
      //不停创建子弹，添加到main
      var x = plane.x + 30;
      var y = plane.y - 14;
      var bullet = new Bullet(x, y, 6, 14, plane.attack, "images/bullet1.png");
      bulletArray.push(bullet);
      var element = createGameObject(bullet);
      main.appendChild(element);
    }, 80);
  }

  function createGameObject(obj) {
    var element = document.createElement("img");
    obj.elemnt = element;
    element.src = obj.normal;
    element.style.position = "absolute";
    element.style.left = obj.x + "px";
    element.style.top = obj.y + "px";
    return element;
  }

  function bulletMove() {
    //var step = 500 / 1000 * 20;
    var step = 10;
    setInterval(function() {
      //遍历子弹数组，移动子弹
      for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.y -= step;
        bullet.elemnt.style.top = bullet.y + "px";
        //让超出mian的子弹消失
        if (bullet.y < -14) {
          main.removeChild(bullet.elemnt);
          bulletArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }

  function mekeEnemy() {
    //每隔3秒生成速记1-3个小飞机
    setInterval(function() {
      var count = Math.floor(Math.random() * 3 + 1);
      for (var i = 0; i < count; i++) {
        var width = 34;
        var height = 24;
        var y = -height;
        var maxX = 320 - width;
        var x = Math.random() * maxX;
        var speed = Math.random() * 300 + 100;
        var enemyPlane = new EnemyPlane(
          x,
          y,
          width,
          height,
          10,
          2,
          speed,
          "images/enemy1_fly_1.png",
          "images/small-boom.gif",
          100
        );
        var element = createGameObject(enemyPlane);
        element.index = enemyIndex;
        enemyIndex++;
        main.appendChild(element);
        enemyArray.push(enemyPlane);
      }
    }, 3000);

    //每隔6秒生成1-2中飞机

    //每隔9秒生成一个大飞机
  }

  function enemyMove(playerPlane) {
    setInterval(function() {
      for (var i = 0; i < enemyArray.length; i++) {
        var plane = enemyArray[i];
        if (!plane.isDie) {
          var step = (plane.speed / 1000) * 20;
          plane.y += step;
          plane.elemnt.style.top = plane.y + "px";
          //判断敌机和子弹的碰撞
          for (var j = 0; j < bulletArray.length; j++) {
            var bullet = bulletArray[j];
            if (isRangeInRange(bullet, plane)) {
              //已经产生碰撞,子弹消失
              main.removeChild(bullet.elemnt);
              bulletArray.splice(j, 1);
              j--;

              //敌机扣血
              plane.life -= bullet.attack;
              if (plane.life <= 0) {
                plane.isDie = true;
                plane.elemnt.src = plane.boom;
                score += 100;
                $id("score").innerHTML = "分数：" + score;
                plane.destroy(main);
              }
            }
          }
        }
        //判断玩家和敌机的碰撞
        if (!playerPlane.isDie) {
          if (isRangeInRange(playerPlane, plane)) {
            //直接敌机爆炸 --- 有可能，isDie属性还没有设置成功的时候，下次计时已经到达了
            plane.isDie = true;
            plane.elemnt.src = plane.boom;
            console.log("开始销毁 -- " + plane.elemnt.index);
            plane.destroy(main);
            //玩家扣血
            playerPlane.life -= plane.attack;
            if (playerPlane.life <= 0) {
              //玩家死亡，游戏结束
              playerPlane.isDie = true;
              $id("end").style.display = "block";
              //计时器不停，让飞机不停飞，玩家不能移动了
              main.onmousemove = null;
            }
          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};

          }
        }

        //如果飞机超出游戏区域，消失
        if (plane.y > 568) {
          main.removeChild(plane.elemnt);
          enemyArray.splice(i, 1);
          i--;
        }
      }
    }, 20);
  }
};
