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