'use strict';
const navDivided = document.getElementById('nav');
const modalAnchor = document.getElementById('create-modal');
const selectDivided = document.getElementById('game-select');
const numberEasyButton = document.getElementById('number-easy-mode');
const numberHardButton = document.getElementById('number-hard-mode')
const wordButton = document.getElementById('word-mode');
const gameDivided = document.getElementById('game-area');

/**
 * 指定した要素の子どもをすべて削除する
 * @param {HTMLElement} element HTMLの要素 
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    // 子どもの要素がある限り削除
    element.removeChild(element.firstChild);
  }
}

/* ---------------------------------

ゲームモードを選択したときの処理

 ------------------------------------ */
/* Number(easy) モード 
------------------------------------- */
numberEasyButton.onclick = () => {
  removeAllChildren(gameDivided);
  removeAllChildren(selectDivided);

  // 答えを生成
  createNumber3();

  // ヘッダーをEasyに変更
  const Header2 = document.createElement('h2');
  Header2.classList.add('title');
  Header2.innerText = 'Easy';
  selectDivided.appendChild(Header2);

  // 説明文追加
  const paragraph = document.createElement('p');
  paragraph.innerText = '3桁の数字を推理して当てて下さい';
  selectDivided.appendChild(paragraph);

  // テキストエリア追加
  const textarea = document.createElement('textarea');
  textarea.cols = 30;
  textarea.rows = 10;
  textarea.readOnly = true;
  textarea.value = '';
  textarea.setAttribute("id", "game-textarea");
  textarea.setAttribute("placeholder", "例:123[0hit 1blow]");
  gameDivided.appendChild(textarea);

  // 答え予想エリア作成
  const guessDivided = document.createElement('div');
  guessDivided.classList.add('guess');
  gameDivided.appendChild(guessDivided)

  // input 追加
  const input = document.createElement('input');
  input.setAttribute("type", "text")
  input.setAttribute("placeholder", "例:123")
  input.maxLength = 3;
  input.setAttribute("id", "game-input");
  guessDivided.appendChild(input);

  // 決定ボタン追加
  const decidebutton = document.createElement('button');
  decidebutton.innerText = '決定';
  decidebutton.setAttribute("id", "decide-button");
  guessDivided.appendChild(decidebutton);

  // 猫の画像追加
   const thinkImg = document.createElement('img');
   thinkImg.setAttribute("src", "cat_think.png");
   thinkImg.classList.add('img-animation');
   guessDivided.appendChild(thinkImg);

  // giveupリンク 追加
  const giveupAnchor = document.createElement('a');
  giveupAnchor.innerText = 'Give up';
  giveupAnchor.setAttribute("id", "giveup-anchor");
  giveupAnchor.classList.add('nav-content');
  navDivided.insertBefore(giveupAnchor, modalAnchor);

  // giveupAnchor が押されたときの処理
  giveupAnchor.onclick = () => {
    // 答え表示
    const confirmationGiveup = confirm('give up しますか？');
    if (confirmationGiveup) {
      textarea.value += `正解は${HitTarget}でした`;
      navDivided.removeChild(giveupAnchor);
      navEdit(); 
    }
  }
  
  // ナビゲーションメニューの編集
  function navEdit() {
    // もう一度リンク追加
    const againAnchor = document.createElement('a');
    againAnchor.innerText = 'もう一度';
    againAnchor.setAttribute("id", "again-anchor");
    againAnchor.classList.add('nav-content');
    navDivided.insertBefore(againAnchor, modalAnchor);
    againAnchor.onclick = () => {
      const confirmationAgain = confirm('もう一度遊びますか？');
      if (confirmationAgain) {
        textarea.value = '';
        createNumber3();
        navDivided.removeChild(topAnchor);
        navDivided.removeChild(againAnchor);
        navDivided.insertBefore(giveupAnchor, modalAnchor);
        paragraph.classList.remove('correct');
        paragraph.innerText = '3桁の数字を推理して当てて下さい';
      }
    }
    // トップに戻るリンク追加
    const topAnchor = document.createElement('a');
    topAnchor.innerText = 'トップに戻る';
    topAnchor.setAttribute("id", "top-anchor");
    topAnchor.classList.add('nav-content');
    navDivided.insertBefore(topAnchor, modalAnchor);
    topAnchor.addEventListener('click', returntop);
  }
  
  // decidebutton が押されたときの処理
  decidebutton.onclick = () => {
    if (input.value.length === 0) {
      // input が空の時は処理を終了
      return;
    } else {
      checkInput();
    }
  }

  // 入力が正しくない時にアラートを出す関数
  function checkInput() {
    if (input.value.match(/[０-９]/)) {
      alert('半角で入力して下さい');
      input.value = '';
    } else if (input.value.match(/\D/i)) {
      alert('数字を入力して下さい');
      input.value = '';
    } else if (input.value.length !== 3) {
      alert('３つの数字を入力して下さい');
      input.value = '';
    } else if (input.value.charAt(0) === input.value.charAt(1) || input.value.charAt(0) === input.value.charAt(2) || input.value.charAt(1) === input.value.charAt(2)) {
      alert('同じ数字を入力しないで下さい')
      input.value = '';
    } else {
      judge();
    }
  }

  // Hit , Blow を判断する関数
  function judge() {
    let Hit = 0;
    let Blow = 0;
    for (let i = 0; i < 3; i++) {
      const answerNumber = HitTarget.charAt(i);
      const inputNumber = input.value.charAt(i);
      if (answerNumber === inputNumber) {
        Hit++;
        continue;
      }
      for (let j = 0; j < 3; j++) {
        const inputNumber2 = input.value.charAt(j);
        if (answerNumber === inputNumber2) {
          Blow++;
        }
      }
    }
    const text = `${input.value}[${Hit}Hit ${Blow}Blow]\n`;
    textarea.value += text;
    input.value = '';
    if (Hit === 3) {
      // 正解と画面に表示
      paragraph.innerText = '正解です!!';
      paragraph.classList.add('correct');

      // ナビゲーションメニューの編集
      navEdit();
      navDivided.removeChild(giveupAnchor);

      // 正解したら画像変更
      guessDivided.removeChild(thinkImg);
      const teheImg = document.createElement('img');
      teheImg.setAttribute("src", "cat_tehe.png");
      teheImg.classList.add('img-animation');
      guessDivided.appendChild(teheImg);
    }
  }
  // Enterキーでも実行
  input.onkeydown = event => {
    if (event.key === 'Enter') {
      decidebutton.onclick();
    }
  };
}


/* Number(hard) モード 
------------------------------------- */
numberHardButton.onclick = () => {
  removeAllChildren(gameDivided);
  removeAllChildren(selectDivided);

  // 答えを生成
  createNumber4();

  // ヘッダーをNumberに変更
  const Header2 = document.createElement('h2');
  Header2.classList.add('title');
  Header2.innerText = 'Hard';
  selectDivided.appendChild(Header2);

  // 説明文追加
  const paragraph = document.createElement('p');
  paragraph.innerText = '4桁の数字を推理して当てて下さい';
  selectDivided.appendChild(paragraph);

  // テキストエリア追加
  const textarea = document.createElement('textarea');
  textarea.cols = 30;
  textarea.rows = 10;
  textarea.readOnly = true;
  textarea.value = '';
  textarea.setAttribute("id", "game-textarea");
  textarea.setAttribute("placeholder", "例:1234[0hit 1blow]");
  gameDivided.appendChild(textarea);

  // 答え予想エリア作成
  const guessDivided = document.createElement('div');
  guessDivided.classList.add('guess');
  gameDivided.appendChild(guessDivided)

  // input 追加
  const input = document.createElement('input');
  input.setAttribute("type", "text")
  input.setAttribute("placeholder", "例:1234")
  input.maxLength = 4;
  input.setAttribute("id", "game-input");
  guessDivided.appendChild(input);

  // 決定ボタン追加
  const decidebutton = document.createElement('button');
  decidebutton.innerText = '決定';
  decidebutton.setAttribute("id", "decide-button");
  guessDivided.appendChild(decidebutton);

  // 猫の画像追加
  const thinkImg = document.createElement('img');
  thinkImg.setAttribute("src", "cat_think.png");
  thinkImg.classList.add('img-animation');
  guessDivided.appendChild(thinkImg);

  // giveupリンク 追加
  const giveupAnchor = document.createElement('a');
  giveupAnchor.innerText = 'Give up';
  giveupAnchor.setAttribute("id", "giveup-anchor");
  giveupAnchor.classList.add('nav-content');
  navDivided.insertBefore(giveupAnchor, modalAnchor);

  // giveupAnchor が押されたときの処理
  giveupAnchor.onclick = () => {
    // 答え表示
    const confirmationGiveup = confirm('give up しますか？');
    if (confirmationGiveup) {
      textarea.value += `正解は${HitTarget}でした`;
      navDivided.removeChild(giveupAnchor);
      navEdit(); 
    }
  }
  
  // ナビゲーションメニューの編集
  function navEdit() {
    // もう一度リンク追加
    const againAnchor = document.createElement('a');
    againAnchor.innerText = 'もう一度';
    againAnchor.setAttribute("id", "again-anchor");
    againAnchor.classList.add('nav-content');
    navDivided.insertBefore(againAnchor, modalAnchor);
    againAnchor.onclick = () => {
      const confirmationAgain = confirm('もう一度遊びますか？');
      if (confirmationAgain) {
        textarea.value = '';
        createNumber4();
        navDivided.removeChild(topAnchor);
        navDivided.removeChild(againAnchor);
        navDivided.insertBefore(giveupAnchor, modalAnchor);
        paragraph.classList.remove('correct');
        paragraph.innerText = '4桁の数字を推理して当てて下さい';
      }
    }
    // トップに戻るリンク追加
    const topAnchor = document.createElement('a');
    topAnchor.innerText = 'トップに戻る';
    topAnchor.setAttribute("id", "top-anchor");
    topAnchor.classList.add('nav-content');
    navDivided.insertBefore(topAnchor, modalAnchor);
    topAnchor.addEventListener('click', returntop);
  }
  
  // decidebutton が押されたときの処理
  decidebutton.onclick = () => {
    if (input.value.length === 0) {
      // input が空の時は処理を終了
      return;
    } else {
      checkInput();
    }
  }

  // 入力が正しくない時にアラートを出す関数
  function checkInput() {
    if (input.value.match(/[０-９]/)) {
      alert('半角で入力して下さい');
      input.value = '';
    } else if (input.value.match(/\D/i)) {
      alert('数字を入力して下さい');
      input.value = '';
    } else if (input.value.length !== 4) {
      alert('4つの数字を入力して下さい');
      input.value = '';
    } else if (input.value.charAt(0) === input.value.charAt(1) 
              || input.value.charAt(0) === input.value.charAt(2) 
              || input.value.charAt(0) === input.value.charAt(3) 
              || input.value.charAt(1) === input.value.charAt(2) 
              || input.value.charAt(1) === input.value.charAt(3) 
              || input.value.charAt(2) === input.value.charAt(3)) {
      alert('同じ数字を入力しないで下さい')
      input.value = '';
    } else {
      judge();
    }
  }

  // Hit , Blow を判断する関数
  function judge() {
    let Hit = 0;
    let Blow = 0;
    for (let i = 0; i < 4; i++) {
      const answerNumber = HitTarget.charAt(i);
      const inputNumber = input.value.charAt(i);
      if (answerNumber === inputNumber) {
        Hit++;
        continue;
      }
      for (let j = 0; j < 4; j++) {
        const inputNumber2 = input.value.charAt(j);
        if (answerNumber === inputNumber2) {
          Blow++;
        }
      }
    }
    const text = `${input.value}[${Hit}Hit ${Blow}Blow]\n`;
    textarea.value += text;
    input.value = '';
    if (Hit === 4) {
      // 正解と画面に表示
      paragraph.innerText = '正解です!!';
      paragraph.classList.add('correct');

      // ナビゲーションメニューの編集
      navEdit();
      navDivided.removeChild(giveupAnchor);

      // 正解したら画像変更
      guessDivided.removeChild(thinkImg);
      const teheImg = document.createElement('img');
      teheImg.setAttribute("src", "cat_tehe.png");
      teheImg.classList.add('img-animation');
      guessDivided.appendChild(teheImg);
    }
  }
  // Enterキーでも実行
  input.onkeydown = event => {
    if (event.key === 'Enter') {
      decidebutton.onclick();
    }
  };
}


/* Word(英単語) モード
------------------------------------- */
wordButton.onclick = () => {
  removeAllChildren(gameDivided);
  removeAllChildren(selectDivided);

  // 答えを生成
  createWord();

  // ヘッダーをEasyに変更
  const Header2 = document.createElement('h2');
  Header2.classList.add('title');
  Header2.innerText = 'Word';
  selectDivided.appendChild(Header2);

  // 説明文追加
  const paragraph = document.createElement('p');
  paragraph.innerText = '3文字の英単語を推理して当てて下さい';
  selectDivided.appendChild(paragraph);

  // テキストエリア追加
  const textarea = document.createElement('textarea');
  textarea.cols = 30;
  textarea.rows = 10;
  textarea.readOnly = true;
  textarea.value = '';
  textarea.setAttribute("id", "game-textarea");
  textarea.setAttribute("placeholder", "例:cat[0hit 1blow]");
  gameDivided.appendChild(textarea);

  // 答え予想エリア作成
  const guessDivided = document.createElement('div');
  guessDivided.classList.add('guess');
  gameDivided.appendChild(guessDivided)

  // input 追加
  const input = document.createElement('input');
  input.setAttribute("type", "text")
  input.setAttribute("placeholder", "例:cat")
  input.maxLength = 3;
  input.setAttribute("id", "game-input");
  guessDivided.appendChild(input);

  // 決定ボタン追加
  const decidebutton = document.createElement('button');
  decidebutton.innerText = '決定';
  decidebutton.setAttribute("id", "decide-button");
  guessDivided.appendChild(decidebutton);

  // 猫の画像追加
   const thinkImg = document.createElement('img');
   thinkImg.setAttribute("src", "cat_think.png");
   thinkImg.classList.add('img-animation');
   guessDivided.appendChild(thinkImg);

  // giveupリンク 追加
  const giveupAnchor = document.createElement('a');
  giveupAnchor.innerText = 'Give up';
  giveupAnchor.setAttribute("id", "giveup-anchor");
  giveupAnchor.classList.add('nav-content');
  navDivided.insertBefore(giveupAnchor, modalAnchor);

  // giveupAnchor が押されたときの処理
  giveupAnchor.onclick = () => {
    // 答え表示
    const confirmationGiveup = confirm('give up しますか？');
    if (confirmationGiveup) {
      textarea.value += `正解は${HitTarget}でした`;
      navDivided.removeChild(giveupAnchor);
      navEdit(); 
    }
  }
  
  // ナビゲーションメニューの編集
  function navEdit() {
    // もう一度リンク追加
    const againAnchor = document.createElement('a');
    againAnchor.innerText = 'もう一度';
    againAnchor.setAttribute("id", "again-anchor");
    againAnchor.classList.add('nav-content');
    navDivided.insertBefore(againAnchor, modalAnchor);
    againAnchor.onclick = () => {
      const confirmationAgain = confirm('もう一度遊びますか？');
      if (confirmationAgain) {
        textarea.value = '';
        createWord();
        navDivided.removeChild(topAnchor);
        navDivided.removeChild(againAnchor);
        navDivided.insertBefore(giveupAnchor, modalAnchor);
        paragraph.classList.remove('correct');
        paragraph.innerText = '3文字の英単語を推理して当てて下さい';
      }
    }
    // トップに戻るリンク追加
    const topAnchor = document.createElement('a');
    topAnchor.innerText = 'トップに戻る';
    topAnchor.setAttribute("id", "top-anchor");
    topAnchor.classList.add('nav-content');
    navDivided.insertBefore(topAnchor, modalAnchor);
    topAnchor.addEventListener('click', returntop);
  }
  
  // decidebutton が押されたときの処理
  decidebutton.onclick = () => {
    if (input.value.length === 0) {
      // input が空の時は処理を終了
      return;
    } else {
      checkInput();
    }
  }

  // 入力が正しくない時にアラートを出す関数
  function checkInput() {
    if (input.value.match(/[A-Z]/)) {
      alert('半角で入力して下さい');
      input.value = '';
    } else if (input.value.match(/\d/i)) {
      alert('英単語を入力して下さい');
      input.value = '';
    } else if (input.value.length !== 3) {
      alert('３文字の英単語を入力して下さい');
      input.value = '';
    } else if (input.value.charAt(0) === input.value.charAt(1) || input.value.charAt(0) === input.value.charAt(2) || input.value.charAt(1) === input.value.charAt(2)) {
      alert('同じ文字を入力しないで下さい')
      input.value = '';
    } else {
      judge();
    }
  }

  // Hit , Blow を判断する関数
  function judge() {
    let Hit = 0;
    let Blow = 0;
    for (let i = 0; i < 3; i++) {
      const answerWord = HitTarget.charAt(i);
      const inputWord = input.value.charAt(i);
      if (answerWord === inputWord) {
        Hit++;
        continue;
      }
      for (let j = 0; j < 3; j++) {
        const inputWordr2 = input.value.charAt(j);
        if (answerWord === inputWordr2) {
          Blow++;
        }
      }
    }
    const text = `${input.value}[${Hit}Hit ${Blow}Blow]\n`;
    textarea.value += text;
    input.value = '';
    if (Hit === 3) {
      // 正解と画面に表示
      paragraph.innerText = '正解です!!';
      paragraph.classList.add('correct');

      // ナビゲーションメニューの編集
      navEdit();
      navDivided.removeChild(giveupAnchor);

      // 正解したら画像変更
      guessDivided.removeChild(thinkImg);
      const teheImg = document.createElement('img');
      teheImg.setAttribute("src", "cat_tehe.png");
      teheImg.classList.add('img-animation');
      guessDivided.appendChild(teheImg);
    }
  }

  // Enterキーでも実行
  input.onkeydown = event => {
    if (event.key === 'Enter') {
      decidebutton.onclick();
    }
  };
}

// トップに戻る関数
function returntop() {
  const confirmationTop = confirm('トップに戻りますか？');
  if (confirmationTop) {
    window.location.reload();
  }
}



/* ----------------------------------

遊び方リンク をクリックしたときの処理

------------------------------------- */
modalAnchor.addEventListener('click', displayModalWindow);

/* モーダルウインドウを表示 
------------------------------------- */
function displayModalWindow() {
  const modalElement = document.createElement('div');
  modalElement.classList.add('modal');

  const innerElement = document.createElement('div');
  innerElement.classList.add('inner');

  const header = document.createElement('h2');
  header.innerText = '遊び方';
  innerElement.appendChild(header);

  const unorderedList = document.createElement('ul');
  innerElement.appendChild(unorderedList);

  const list = document.createElement('li');
  list.innerText = '3桁、または4桁の数当てモードと3文字の英単語モードがあります!\n(easy : 3桁 , hard : 4桁 , Word : 英単語)';
  unorderedList.appendChild(list);

  const list2 = document.createElement('li');
  list2.innerText = 'Hit(数字も場所も正解)、 Blow(数字は正解だが場所が違う)\n(例: 正解が1234の時、1562は[1Hit,1Blow])';
  unorderedList.appendChild(list2);

  const list3 = document.createElement('li');
  list3.innerText = '答えは全て違う数字(文字)になります';
  unorderedList.appendChild(list3);

  const header3 = document.createElement('h3');
  header3.innerText = '注意事項';
  innerElement.appendChild(header3);

  const unorderedList2 = document.createElement('ul');
  innerElement.appendChild(unorderedList2);

  const list4 = document.createElement('li');
  list4.innerText ='半角で入力して下さい';
  unorderedList2.appendChild(list4);

  const list5 = document.createElement('li');
  list5.innerText = '同じ数字(文字)を二回以上使わないで下さい';
  unorderedList2.appendChild(list5);

  modalElement.appendChild(innerElement);
  document.body.appendChild(modalElement);

  modalElement.onclick = () => {
    closeModalWindow(modalElement);
  }
}

/* モーダルウインドウを閉じる関数
------------------------------------- */
function closeModalWindow(modalElement) {
  document.body.removeChild(modalElement);
}

 
/* ---------------------------------

Hit & Blow

------------------------------------- */
let answer;
let HitTarget = '';

/* 答えの数字を設定する関数
------------------------------------- */
// 3桁ver
function createNumber3() {
  answer = new Array(3);

  for (let i = 0; i < 3; i++) {
    answer[i] = Math.floor(Math.random() * 10);
    if (answer[i] === answer[i - 1] || answer[i] === answer[i - 2]) {
      i--;
    }
  }
  HitTarget = String(answer[0]) + String(answer[1]) + String(answer[2]);
}

// 4桁ver
function createNumber4() {
  answer = new Array(4);

  for (let i = 0; i < 4; i++) {
    answer[i] = Math.floor(Math.random() * 10);
    if (answer[i] === answer[i - 1] || answer[i] === answer[i - 2] || answer[i] === answer[i - 3]) {
      i--;
    }
  }
  HitTarget = String(answer[0]) + String(answer[1]) + String(answer[2] + String(answer[3]));
}

// 英単語ver
function createWord() {
  const index = Math.floor(Math.random() * wordArray.length);
  HitTarget = wordArray[index];
}


// 3文字の英単語の配列
const wordArray = [
  'ace',
  'act',
  'age',
  'aid',
  'aim',
  'ant',
  'apt',
  'arm',
  'ash',
  'ask',
  'axe',
  'aye',
  'bad',
  'ban',
  'bay',
  'beg',
  'bet',
  'big',
  'bit',
  'bow',
  'box',
  'boy',
  'bug',
  'bus',
  'buy',
  'cab',
  'cap',
  'car',
  'cat',
  'cop',
  'cow',
  'cry',
  'cue',
  'cut',
  'dam',
  'die',
  'dig',
  'dog',
  'dry',
  'due',
  'duo',
  'dye',
  'ear',
  'eat',
  'end',
  'era',
  'fan',
  'far',
  'fat',
  'few',
  'fin',
  'fit',
  'fix',
  'fly',
  'foe',
  'fog',
  'fox',
  'fun',
  'fur',
  'gap',
  'gas',
  'gem',
  'get',
  'gin',
  'god',
  'gum',
  'gun',
  'guy',
  'gym',
  'hat',
  'hen',
  'hex',
  'hot',
  'hub',
  'hug',
  'hut',
  'ice',
  'ink',
  'ion',
  'jab',
  'jam',
  'jar',
  'jaw',
  'jet',
  'job',
  'joy',
  'key',
  'kin',
  'kit',
  'lag',
  'lap',
  'law',
  'lay',
  'leg',
  'let',
  'lid',
  'lie',
  'lip',
  'log',
  'lot',
  'low',
  'mad',
  'map',
  'mix',
  'mob',
  'mud',
  'nap',
  'net',
  'new',
  'nil',
  'nod',
  'oak',
  'ohm',
  'oil',
  'owe',
  'owl',
  'own',
  'pay',
  'pea',
  'pie',
  'pig',
  'pot',
  'pro',
  'put',
  'rap',
  'rat',
  'raw',
  'ray',
  'red',
  'rid',
  'rob',
  'row',
  'rub',
  'run',
  'sad',
  'saw',
  'say',
  'sea',
  'sew',
  'shy',
  'sin',
  'ski',
  'sky',
  'sly',
  'son',
  'sow',
  'spy',
  'sum',
  'sun',
  'tap',
  'tax',
  'tea',
  'tie',
  'tip',
  'toe',
  'toy',
  'try',
  'ufo',
  'use',
  'vie',
  'vip',
  'vow',
  'war',
  'way',
  'web',
  'wet',
  'win',
  'yet',
  'yot'
];
