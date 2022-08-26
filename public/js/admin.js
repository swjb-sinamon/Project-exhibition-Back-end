const yes = document.querySelector('.yes');
const no = document.querySelector('.no');
const msgBox = document.querySelector('.msg_box');

document.querySelectorAll(".delete").forEach(item => {
  item.addEventListener("click", e => {
    msgBox.style.display="block";
    
    yes.addEventListener("click", () => {
      $.ajax({
        url: `/admin/del`,
        type: 'post',
        dataType: 'json',
        data: {
          id: e.target.dataset.id
        },
        success: data => {
          location.reload()
        }
      })
    });
    
    no.addEventListener("click", () => {
      msgBox.style.display = "none";
    })
  });
});

document.querySelectorAll('.fix').forEach(item => {
  item.addEventListener('click', e => {
    if(confirm('수락합니까?')) {
      $.ajax({
        url: `/admin/accept`,
        type: 'post',
        dataType: 'json',
        data: {
          id: e.target.dataset.id
        },
        success: data => {
          location.reload()
        }
      })
    }
  })
})

function filter() {
  let search = document.getElementById("search").value.toLowerCase();
  let project_box = document.getElementsByClassName("project_box");

  for (let i = 0; i < project_box.length; i++) {
    title = project_box[i].getElementsByClassName("title");
    if (title[0].innerHTML.toLowerCase().indexOf(search) != -1){
      project_box[i].style.display = "flex";
    } else {
      project_box[i].style.display = "none";
    }
  }
}