let mode = "CREATE";
let selectId = "";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    mode = "EDIT";
    selectId = id;
  }
  try {
    const response = await axios.get(`http://localhost:8000/users/${id}`);
    const user = response.data;

    let firstnameDom = document.querySelector("input[name=firstname]");
    let lastnameDom = document.querySelector("input[name=lastname]");
    let ageDom = document.querySelector("input[name=age]");
    let descriptionDom = document.querySelector("textarea[name=description]");

    firstnameDom.value = user.firstname;
    lastnameDom.value = user.lastname;
    ageDom.value = user.age;
    descriptionDom.value = user.description;

    let genderDom = document.querySelectorAll("input[name=gender]");
    let interestDom = document.querySelectorAll("input[name=interest]");

    for (let i = 0; i < genderDom.length; i++) {
      if (genderDom[i].value == user.gender) {
        genderDom[i].checked = true;
      }
    }

    for (let i = 0; i < interestDom.length; i++) {
      if (user.interests.includes(interestDom[i].value)) {
        interestDom[i].checked = true;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อจริง");
  }
  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณาใส่อายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณาระบุเพศ");
  }
  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจ");
  }
  if (!userData.description) {
    errors.push("กรุณาใส่รายละเอียดของคุณ");
  }

  return errors;
};

let submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", async function () {
  let firstnameDom = document.querySelector("input[name=firstname]");
  let lastnameDom = document.querySelector("input[name=lastname]");
  let ageDom = document.querySelector("input[name=age]");

  let genderDom = document.querySelector("input[name=gender]:checked") || {};
  let interestDom =
    document.querySelectorAll("input[name=interest]:checked") || {};

  let descriptionDom = document.querySelector("textarea[name=description]");

  let messageDom = document.getElementById("message");

  try {
    let interest = "";
    for (let i = 0; i < interestDom.length; i++) {
      interest += interestDom[i].value;
      if (i != interestDom.length - 1) {
        interest += ", ";
      }
    }
    let userData = {
      firstname: firstnameDom.value,
      lastname: lastnameDom.value,
      age: ageDom.value,
      gender: genderDom.value,
      description: descriptionDom.value,
      interests: interest,
    };
    console.log(userData);

    const errors = validateData(userData);
    if (errors.length > 0) {
      throw {
        message: "กรอกข้อมูลไม่ครบ",
        errors: errors,
      };
    }
    let message = "บันทึกข้อมูลสำเร็จ";

    if (mode == "CREATE") {
      const response = await axios.post(
        `http://localhost:8000/users`,
        userData
      );
    } else {
      const response = await axios.put(
        `http://localhost:8000/users/${selectId}`,
        userData
      );
      message = "แก้ไขข้อมูลสำเร็จ";
      setTimeout(() => {
        window.location.href = "user.html";
      }, 800);
      
    }

    messageDom.innerText = message;
    messageDom.className = "message success";
  } catch (error) {
    console.log(error.message);
    console.log(error.errors);
    if (error.response) {
      console.log(error.response);
      error.message = error.response.data.message;
      error.errors = error.response.data.errors;
    }
    let htmlData = "<div>";
    htmlData += `<div>${error.message}</div>`;
    htmlData += "<ul>";
    
      for (let i = 0; i < error.errors.length; i++) {
        htmlData += `<li>${error.errors[i]}</li>`;
      }
    

    htmlData += "</ul>";
    htmlData += "</div>";

    messageDom.innerHTML = htmlData;
    messageDom.className = "message danger";
  }
});
