let dataMain; //переменная для всего мапссива из JSON
let dataMainPart; //переменная для той части массива, которая будет выводиться в зависимости от номера страницы
const table = document.querySelector('.table');
const firstNameForm = document.querySelector('#firstName');
const lastNameForm = document.querySelector('#lastName');
const aboutForm = document.querySelector('#about');
const eyeColorForm = document.querySelector('#eyeColor');
const phoneForm = document.querySelector('#phone');
const idForm = document.querySelector('#idForm');
const closeAll = document.querySelectorAll('.close');
const resetFormBtn = document.querySelector('.reset-form');
const submitFormBtn = document.querySelector('.submit-form');
const form = document.querySelector('.custom-row-form');
const sortUpFirstName = document.querySelector('.firstName-sort-up');
const sortDownFirstName = document.querySelector('.firstName-sort-down');
const sortUpLastName = document.querySelector('.lastName-sort-up');
const sortDownLastName = document.querySelector('.lastName-sort-down');
const sortUpAbout = document.querySelector('.about-sort-up');
const sortDownAbout = document.querySelector('.about-sort-down');
const sortUpEyeColor = document.querySelector('.eyeColor-sort-up');
const sortDownEyeColor = document.querySelector('.eyeColor-sort-down');
const closefirstName = document.querySelector('.firstName-close');
const closeLastName = document.querySelector('.lastName-close');
const closeAbout = document.querySelector('.about-close');
const closeEyeColor = document.querySelector('.eyeColor-close');
const boxElements = document.querySelector('.table-wraper-list');
let endpageNumber = document.querySelector('body').getAttribute('data-page');  //определяем номер страницы из data атрибута
let sartPageNumber; //переменная для начального номера страницы, с которого будет начинаться рендеринг массива
switch (endpageNumber) {//определяем начальный номер страницы, с которой будет начинаться рендеринг массива
  case '1':
    sartPageNumber = 0;
    break;
  case '2':
    sartPageNumber = 10;
    break;
  case '3':
    sartPageNumber = 20;
    break;
  case '4':
    sartPageNumber = 30;
    break;
  case '5':
    sartPageNumber = 40;
    break;
  case 'all':
    endpageNumber = 5;
    sartPageNumber = 0;
    break;
}

sortUpFirstName.addEventListener('click', () => sortUpFunc('name.firstName'));//прослушка события клика по сортировке именни по алфавиту 
sortDownFirstName.addEventListener('click', () => sortDownFunc('name.firstName'));;//прослушка события клика по сортировке именни по алфавиту (убывание)
sortUpLastName.addEventListener('click', () => sortUpFunc('name.lastName'));//прослушка события клика по сортировке фамилии по алфавиту 
sortDownLastName.addEventListener('click', () => sortDownFunc('name.lastName'));//прослушка события клика по сортировке фамилии по алфавиту (убывание)
sortUpAbout.addEventListener('click', () => sortUpFunc('about'));//прослушка события клика по сортировке описания по алфавиту 
sortDownAbout.addEventListener('click', () => sortDownFunc('about'));//прослушка события клика по сортировке описания по алфавиту (убывание)
sortUpEyeColor.addEventListener('click', () => sortUpFunc('eyeColor'));//прослушка события клика по сортировке цвета глаз по алфавиту 
sortDownEyeColor.addEventListener('click', () => sortDownFunc('eyeColor'));//прослушка события клика по сортировке цвета глаз по алфавиту (убывание)

closefirstName.addEventListener('click', (e) => CloseFunc('.row-firstName', e));//прослушка клика по скрытию колонки имени
closeLastName.addEventListener('click', (e) => CloseFunc('.row-lastName', e));//прослушка клика по скрытию колонки фамилии
closeAbout.addEventListener('click', (e) => CloseFunc('.row-about', e));//прослушка клика по скрытию колонки описания
closeEyeColor.addEventListener('click', (e) => CloseFunc('.row-eyeColor', e));//прослушка клика по скрытию колонки цвета глаз

async function loadData() {//асинхронная функци для получения json данных
  fetch('./data.json')//запрос к json
    .then((res) => res.json())
    .then((data) => {
      dataMain = data;//обновление значения переменной массива данных 
      dataMainPart = dataMain.slice(sartPageNumber, endpageNumber * 10);//высчитывание определенной части массива, которая будет выводиться на конкретной странице
      loadTable();//запуск функции, отвечающей за рендеринг строк таблицы
    });
}

function GetByPath(obj, path) {//функци для поиска свойства\метода объекта по двум параметрам - самому объекту и строковому пути
  var parts = path.split('.');
  var current = obj;
  for (var i = 0; i < parts.length; i++) {
    current = current[parts[i]];
    if (!current) break;
  }
  return current;
}

function deleteRow() {//функция удаления строк
  closeAll.forEach((item) => {
    item.innerText = '-';
  });
  let tableRowContainers = document.querySelectorAll('.wrapper');
  tableRowContainers.forEach((item, i) => {
    item.remove();
  });
}
function CloseFunc(className, e) {//функция скрытия строк определенного столбца
  let allItems = document.querySelectorAll(className);
  allItems.forEach((item) => {
    if (item.style.visibility === 'hidden') {
      item.style.visibility = 'visible';
      item.style.pointerEvents = 'initial';

      e.target.innerText = '-';
    } else {
      item.style.visibility = 'hidden';
      item.style.pointerEvents = 'none';
      e.target.innerText = '+';
    }
  });
}
function sortUpFunc(text) {//функция сортировки строк по алфавиту (обычное направление)
  const sorted = dataMainPart.sort((a, b) => GetByPath(a, text).localeCompare(GetByPath(b, text)));
  dataMainPart = sorted;
  deleteRow();
  loadTable();
}
function sortDownFunc(text) {//функция сортировки строк по алфавиту (обратное направление)
  const sorted = dataMainPart.sort((a, b) => GetByPath(b, text).localeCompare(GetByPath(a, text)));
  dataMainPart = sorted;
  deleteRow();
  loadTable();
}

submitFormBtn.addEventListener('click', (e) => {//функция, обрабатывающая submit формы изменения строки
  e.preventDefault();
  form.classList.add('hidden');
  let newObj = {
    id: idForm.value,
    name: {
      firstName: firstNameForm.value,
      lastName: lastNameForm.value,
    },
    phone: phoneForm.value,
    about: aboutForm.value,
    eyeColor: eyeColorForm.value,
  };
  const newList = dataMainPart.map((obj) => {
    if (obj.id === newObj.id) {
      return newObj;
    }
    return obj;
  });
  dataMainPart = newList;
  deleteRow();
  loadTable();
});
resetFormBtn.addEventListener('click', () => {//функция, обрабатывающая отмену редактирования формы изменения строки
  form.classList.add('hidden');
});

function loadTable() {//функция загрузки строк
  let max = endpageNumber === 5 ? dataMain.length : 10;//определение верхней границы выводимых значений
  for (let i = 0; i < max; i++) {//перебор массива строк
    let actialData = dataMainPart[i];
    let rowContainer = document.createElement('div');//создание обертки для строки
    rowContainer.classList.add('wrapper');
    let row = `
        <div class="table-row-container">
            <div id-data=${actialData.id} class="table-row row-firstName">${actialData.name.firstName}</div>
            <div id-data=${actialData.id} class="table-row row-lastName">${actialData.name.lastName}</div>
            <div id-data=${actialData.id} class="table-row row-about">${actialData.about}</div>
            <div id-data=${actialData.id} class="table-row row-eyeColor">${actialData.eyeColor}<div class="color-box" style="background-color: ${actialData.eyeColor};"></div></div></div>`;
    rowContainer.innerHTML = row;
    boxElements.insertAdjacentElement('beforeend', rowContainer);
    table.insertAdjacentElement('beforeend', boxElements);
  }
  let allRows = document.querySelectorAll('.table-row');//нахождение всех строк
  allRows.forEach((row) => {
    row.addEventListener('click', () => {//привязка функции по клику на строку
      form.classList.remove('hidden');
      let id = row.getAttribute('id-data');
      let data = dataMainPart.filter((item) => item.id === id)[0];//нахождение в массиве объекта по id
      firstNameForm.value = data.name.firstName;//заполнение значения объекта в инпуты формы редактирования
      lastNameForm.value = data.name.lastName;//заполнение значения объекта в инпуты формы редактирования
      aboutForm.value = data.about;//заполнение значения объекта в инпуты формы редактирования
      eyeColorForm.value = data.eyeColor;//заполнение значения объекта в инпуты формы редактирования
      phoneForm.value = data.phone;//заполнение значения объекта в инпуты формы редактирования
      idForm.value = data.id;//заполнение значения объекта в инпуты формы редактирования
    });
  });
}

loadData();//запуск функции по запросу данных из JSON файла
