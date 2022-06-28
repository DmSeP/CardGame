const table = document.querySelector('.table')
const fieldPlayer = document.querySelectorAll('.Player > .card')
const fieldAI = document.querySelectorAll('.AI > .card')
const AI = document.querySelector('.AI')
const attackingCard = document.querySelector('.attacking')

let deckPlayer = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
let deckAI = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
let cardCounter // счётчик побитых карт для проверки победы
//Функция для перемешивания колоды игроков с помощью Тасования Фишера-Йетса
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
//Шафл колод игроков
shuffle(deckPlayer)
shuffle(deckAI)
// console.log('Колода игрока: ', deckPlayer)
// console.log('Колода AI: ', deckAI)
// массивы защиты
let defPlayer = [undefined, undefined, undefined]
let defAI = [undefined, undefined, undefined]
//Функция выборки защиты
function defense(arr, setArrDef) {
  let k = 0
  for (let i = 0; i < 3; i++) {
    if (setArrDef[i] == undefined) {
      setArrDef[i] = arr[k]
      k++
    }
  }
  arr.splice(0, k)
  return setArrDef
}
defPlayer = defense(deckPlayer, defPlayer)
defAI = defense(deckAI, defAI)

// Защиты игроков
console.log('Колода игрока после выборки защиты: ', deckPlayer)
console.log('Защита игрока: ', defPlayer)
console.log('Колода AI после выборки защиты: ', deckAI)
console.log('Защита AI : ', defAI)

// отладка получания карт со страницы
// console.log(fieldPlayer)
// console.log(fieldAI)

// функция вставки на страницу карт защиты
function insertDef(fieldCardArr, defCardArr) {
  for (let i = 0; i < 3; i++) {
    ozo = fieldCardArr[i].getAttribute('data-value')

    if (ozo == 101) {
      fieldCardArr[i].setAttribute('data-value', `${defCardArr[i]}`)
      fieldCardArr[i].innerHTML = `<h1>${defCardArr[i]}</h1>`
    }
  }
}
insertDef(fieldPlayer, defPlayer)
insertDef(fieldAI, defAI)

//функция вставки на страницу карты атаки
function insertAttack() {
  let attackCard = deckPlayer[0]
  attackingCard.setAttribute('data-value', `${attackCard}`)
  attackingCard.innerHTML = `<h1>${attackCard}</h1>`
}
function checkPossibleAttack() {
  let attackCard = deckPlayer[0]
  let k = 0
  for (let i = 0; i < defAI.length; i++) {
    k += possibleAttack(attackCard, defAI[i])
  }
  if (k == 0) {
    console.log('ВАРИАНТОВ ХОДА НЕТ')
    checkWin()
    deckAI.push(attackCard)
    console.log(deckAI)
    // сделать переход хода другому игроку
    return 0
  } else return 1
}

function possibleAttack(att, def) {
  if (att > def || (def == 4 && att == 0)) return 1
  else return 0
}

function getAttack() {
  let attackCard = deckPlayer.splice(0, 1)
  return attackCard
}

insertAttack()

//
let penaltyPointsPlayer = 0 // счётчик штрафных очков для первого игрока
let penaltyPointsAI = 0 // счётчик штрафных очков для второго игрока

function startGame() {
  // let assaulter = Math.round(Math.random()) // переменная  атакующего
  let assaulter = 1
  while (penaltyPointsPlayer != 1 || penaltyPointsAI != 1) {
    if (assaulter) {
      while (attackAI()) {
        console.log('ии проатаковал')
      }
    }
    if (!assaulter) {
      // начало логики игрока
      for (let i = 1; i <= 3; i++) {
        fieldAI[i - 1].setAttribute('onclick', `AttackPlayer(${i})`)
      }
      checkPossibleAttack()
      break
    }
    console.log('Переход хода')
    assaulter = assaulter ? 0 : 1
    console.log('Значение переменной хода:', assaulter)
  }
}

startGame()
cardCounter = 0

function AttackPlayer(cardId) {
  let card = document.getElementById(cardId)

  let attackCard = getAttack(deckPlayer)
  console.log('карта атаки:', attackCard)

  if (attackCard && eqAttDef(attackCard, +card.textContent)) {
    deckPlayer.push(+card.textContent)
    cardCounter += 1
    defAI[+card.id - 1] = undefined

    console.log('Защита после атаки картой:', defAI)
    card.setAttribute('data-value', 101)
    card.innerHTML = ``
    // console.log('Колода игрока после атаки', deckPlayer)
    insertAttack()
    let checkAttack = checkPossibleAttack()
    console.log('Проверка последующих атак для игрока', checkAttack)
    if (!checkAttack) {
      defAI = defense(deckAI, defAI)
      insertDef(fieldAI, defAI)
      console.log('Новая колода защиты AI:', defAI)

      // передать ход игроку через return 0?
      //return 0
    }
  }
}
function checkWin() {
  if (cardCounter == 3) {
    penaltyPointsAI += 1
    console.log('Засчитано штрафное очко ИИ')
    if (penaltyPointsAI == 1) {
      table.innerHTML = `Игрок победил`
    }
    // else {
    //   defAI = defense(deckAI, defAI)
    //   insertDef(fieldAI, defAI)
    //   console.log('Новая колода защиты', defAI)
    // }
  } else console.log('кард каунтер ', cardCounter)
}
function eqAttDef(att, def) {
  if (att > def || (def == 4 && att == 0)) {
    alert('вы побили карту ')
    return true
  } else {
    alert('выберите другую карту')
    return false
  }
}
//реализация логики ИИ
function attackAI() {
  let attackCard = getAiAttack()
  console.log('карта атаки ИИ:', attackCard)
  // начало проверки возможности атаки
  let k = 0
  let indexDef = []
  for (let i = 0; i < 3; i++) {
    k += possibleAttack(attackCard, defPlayer[i])
    if (possibleAttack(attackCard, defPlayer[i]) && defPlayer[i] != undefined) {
      indexDef.push(i)
    }
  }
  if (k == 0) {
    console.log('ВАРИАНТОВ ХОДА AI НЕТ')
    checkWinAI()
    // defAI = defense(deckAI, defAI)
    //   insertDef(fieldAI, defAI)
    //   console.log('Новая колода защиты:', defAI)
    // deckPlayer.push(attackCard)
    defPlayer = defense(deckPlayer, defPlayer)
    insertDef(fieldPlayer, defPlayer)
    console.log('Новая колода защиты игрока:', defPlayer)
    console.log('Колода ии после атаки', deckAI)
    return 0 // передача хода
  } else {
    let attackingAICardIndex = randomAttack(indexDef)
    deckAI.push(defPlayer[attackingAICardIndex])
    defPlayer[attackingAICardIndex] = undefined
    console.log('Колода игрока после атаки ии', defPlayer)
    fieldPlayer[attackingAICardIndex].setAttribute('data-value', 101)
    fieldPlayer[attackingAICardIndex].innerHTML = ``
    return 1
  }
}
// функция проверки победы AI
function checkWinAI() {
  if (cardCounter == 3) {
    penaltyPointsPlayer += 1
    console.log('Засчитано штрафное очко Игроку')
    if (penaltyPointsPlayer == 1) {
      table.innerHTML = `AI победил`
    }
  }
}
// функция получения карты атаки для ИИ
function getAiAttack() {
  let attackCard = deckAI.splice(0, 1)
  return attackCard
}
// функция случайной выборки карты ИИ для атаки
function randomAttack(arr) {
  let rndCard
  if (arr.length == 1) {
    console.log('Выбрали индекс карту для атаки ИИ ', (rndCard = arr[0]))
    return (rndCard = arr[0])
  } else {
    rndCard = arr[Math.round(Math.random() * (arr.length - 1))]
  }
  return rndCard
}
