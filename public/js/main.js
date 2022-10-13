const bottomButton = document.querySelector('.bottom-button');
let count = 0;
let j = 0;

function filter() {
  let search = document.getElementById("search").value.toLowerCase();
  let project_box = document.getElementsByClassName("project_box");
  let projectCard = document.querySelector(".project_card");

  for (let i = 0; i < project_box.length; i++) {
    title = project_box[i].getElementsByClassName("title");
    subheading = project_box[i].getElementsByClassName("subheading");
    if (title[0].innerHTML.toLowerCase().indexOf(search) != -1 || subheading[0].innerHTML.toLowerCase().indexOf(search) != -1){
      project_box[i].style.display = "block"
    } else {
      console.dir(projectCard);
      projectCard.style.display = "flex"
      project_box[i].style.display = "none";
    }
  }
  if(search == ""){
    projectCard.style.display = ""
    projectCard.style.display = "gird"
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
    },2000, function(){
        $(this).css({left:'80vw'});
    });

    sno++;
    if(sno>lastno) {
        sno = 0;
    }

    $(slide[sno]).animate({
        left:'0px'
    },2000);
  }

  setInterval(function(){
      playSlide();
  },2000,1000);
})

const year = document.querySelectorAll('.yaer');

year.forEach((x) => {
    if(x.classList[2] == 2022) {
        x.style.display = "block";
    }
})

$.ajax({
    url:'/getAll',
    type: 'post',
    dataType:'json',
    success: data => {
      console.log(data.data)
      data.data.forEach((x) => {
        year.forEach((e) => {
            let box = $(`.${e.classList[2]} .project_card`);
            if(x.endyear == e.classList[2]){
                let div = `<a href="/ndividualworks?id=${x.id}">
                <div class="project_box">
                    <div class="img_box">
                    <img src="/img/uploads/${x.filename.split(',')[0]}">
                    <h2 class="title">${x.title}</h2>
                    <p class="subheading">${x.content}</p>
                    </div>
                </div>
                </a>`
                box.append(div);
                console.dir(box[0]);
                e.style.display = "block";
            }
        })
      })
    }
  })