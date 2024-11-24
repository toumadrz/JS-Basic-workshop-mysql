window.onload = async () => {
  await loadData();
};

const loadData = async () => {
  const response = await axios.get("http://localhost:8000/users");
  console.log(response.data);
  const userDom = document.getElementById("user");
  let htmlData = `<div class="container">
  <div class="card">
  <div class="card-body">
  <table class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Firstname</th>
      <th scope="col">Lastname</th>
      <th scope="col">Edit</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody>`;
  for (let i = 0; i < response.data.length; i++) {
    let user = response.data[i];
    htmlData += `<tr>
          <th scope="row">${user.id}</th>
          <td>${user.firstname}</td>
          <td>${user.lastname}</td>
          <td><a href='workshop.html?id=${user.id}'><button class='edit btn btn-success'>Edit</button></a></td>
          <td><button class='btn btn-danger delete' data-id='${user.id}'>Delete</button></td>
           
          </tr>`;
  }
  htmlData += `</tbody>
              </table>
              </div>
              </div>
              </div>`;
  userDom.innerHTML = htmlData;

  let deleteDom = document.getElementsByClassName("delete");
  for (let i = 0; i < deleteDom.length; i++) {
    deleteDom[i].addEventListener("click", async function () {
      const id = event.target.dataset.id;
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        loadData();
      } catch (error) {
        console.log("error", error);
      }
    });
  }
};
