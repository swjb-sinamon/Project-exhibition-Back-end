const yearText = document.querySelectorAll('.year-btn');
const yearBtn = document.querySelector('.year-text');


const data = new Date();
const year = data.getFullYear();
let i = 0;

yearText.forEach(e => {
  e.className += ` ${year-i}`;
  yearBtn.innerHTML = year-i;
  yearBtn.className += ` ${year-i}`;
  i++;
});

const bottomButton = document.querySelector('.bottom-button');
let count = 0;
let j = 0;

function filter() {
  let search = document.getElementById("search").value.toLowerCase();
  let project_box = document.getElementsByClassName("project_box");

  for (let i = 0; i < project_box.length; i++) {
    title = project_box[i].getElementsByClassName("title");
    subheading = project_box[i].getElementsByClassName("subheading");
    if (title[0].innerHTML.toLowerCase().indexOf(search) != -1 || subheading[0].innerHTML.toLowerCase().indexOf(search) != -1){
      project_box[i].style.display = "flex";
    } else {
      project_box[i].style.display = "none";
    }
  }
}

const search = document.querySelector('.search');
search.addEventListener('click', () => {
  j++;
  console.log(j);
});

const bottomBar = document.querySelector('#menu-bar');
bottomBar.addEventListener('click', () => {
  if(j>0) {
    bottomBar.style.display = "block";
    j = 0;
  } else {
    bottomBar.style.display = "none";
  }
});

bottomButton.addEventListener('click', () => {
  if(count == 0){
    bottomBar.style.display = "block";
    count++;
  }else {
    bottomBar.style.display = "none";
    count = 0;
  }
})

$(document).ready(function(){
  let slide = $(".slide li");
  let sno = 0;
  let lastno = slide.length-1;

  function playSlide(){
    $(slide[sno]).animate({
        left:'-80vw'
    },1000, function(){
        $(this).css({left:'80vw'});
    });

    sno++;
    if(sno>lastno) {
        sno = 0;
    }

    $(slide[sno]).animate({
        left:'0px'
    },1000);
  }

  setInterval(function(){
      playSlide();
  },2000);
})


$.ajax({
  url:'/getAll',
  type: 'post',
  dataType:'json',
  success: data => {
    console.log(data)
    let box = $('.project_card')
    console.log(box)
    let contents = $('.body')
    console.log(contents)

    data.data.forEach(item => {
      yearText.forEach( x => {
        if(x.classList[x.classList.length-1] == item.endyear){
          let div = `<a href="/ndividualworks?id=${item.id}">
                        <div class="project_box">
                          <div class="img_box">
                            <img src="/img/uploads/${item.filename.split(',')[0]}">
                            <h2 class="title">${item.title}</h2>
                            <p class="subheading">${item.content}</p>
                          </div>
                        </div>
                      </a>`
        box.append(div)
        } else {
          let div = `<div class="yaer mb-5 ${item.endyear}">
          <div class="contents">
            <div class="year-btn">
              <a href="/yearworks?year=${item.endyear}">
                <button class="year-text">${item.endyear}</button>
                <span class="material-symbols-outlined right btn">
                  <i class="fa-solid fa-angle-right"></i>
                </span>
              </a>
            </div>
            <div class="project_card">
              <a href="/ndividualworks?id=${item.id}">
              <div class="project_box">
                <div class="img_box">
                  <img src="/img/uploads/${item.filename.split(',')[0]}">
                  <h2 class="title">${item.title}</h2>
                  <p class="subheading">${item.content}</p>
                </div>
              </div>
              </a>
            </div>
          </div>`
          contents.append(div);
        }
      })
    })
  }
})